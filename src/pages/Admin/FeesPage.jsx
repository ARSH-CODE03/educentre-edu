import { Wallet, CheckCircle2, Clock, PieChart, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, Input, PageHeader, Select, StatCard, StatusBadge, Table } from "@/components/ui-kit";
import { FeeChart } from "@/components/charts";
import { feeStatus, students } from "@/data/mock";
import { formatDate, formatINR } from "@/utils/format";

const columns = ["Student", "Course", "Total Fee", "Paid", "Pending", "Due Date", "Status"];

export default function FeesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(
    () =>
      students.filter((student) => {
        const matchesQuery = student.name.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "all" || feeStatus(student) === status;
        return matchesQuery && matchesStatus;
      }),
    [query, status],
  );

  const totals = students.reduce(
    (acc, student) => {
      acc.total += student.totalFee;
      acc.paid += student.paid;
      acc.pending += student.totalFee - student.paid;
      if (feeStatus(student) === "Partially Paid") acc.partial += 1;
      return acc;
    },
    { total: 0, paid: 0, pending: 0, partial: 0 },
  );

  function renderCell(student, column) {
    switch (column) {
      case "Student":
        return (
          <span className="block">
            <span className="block font-semibold">{student.name}</span>
            <span className="block text-xs text-muted-foreground">{student.batch}</span>
          </span>
        );
      case "Course":
        return student.course;
      case "Total Fee":
        return formatINR(student.totalFee);
      case "Paid":
        return <span className="font-semibold text-success">{formatINR(student.paid)}</span>;
      case "Pending":
        return (
          <span className="font-semibold text-destructive">
            {formatINR(student.totalFee - student.paid)}
          </span>
        );
      case "Due Date":
        return formatDate(student.dueDate);
      default:
        return <StatusBadge status={feeStatus(student)} />;
    }
  }

  return (
    <>
      <PageHeader
        title="Fee Management"
        subtitle="Track collections, pending dues and payment status"
        actions={
          <Button size="sm" variant="secondary">
            <Download className="size-4" /> Export
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Fees" value={formatINR(totals.total)} icon={Wallet} />
        <StatCard label="Collected" value={formatINR(totals.paid)} icon={CheckCircle2} trend="78% of target" />
        <StatCard label="Pending" value={formatINR(totals.pending)} icon={Clock} trend="Follow up needed" trendTone="danger" />
        <StatCard label="Partially Paid" value={String(totals.partial)} icon={PieChart} />
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            id="fee-search"
            placeholder="Search by student name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select id="fee-status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
          </Select>
        </div>
      </Card>

      <Card className="p-0">
        <Table columns={columns} rows={rows} renderCell={renderCell} emptyMessage="No fee records match" />
      </Card>

      <Card className="p-5">
        <h3 className="text-[17px] font-bold tracking-tight">Collection trend</h3>
        <div className="mt-4">
          <FeeChart />
        </div>
      </Card>
    </>
  );
}
