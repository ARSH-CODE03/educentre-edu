import { Download, Users, Wallet, CalendarCheck } from "lucide-react";
import { AttendanceChart, FeeChart, StatusPie } from "@/components/charts";
import { Button, Card, ChartCard, PageHeader, StatCard, StatusBadge, Table } from "@/components/ui-kit";
import { feeStatus, students } from "@/data/mock";
import { formatINR } from "@/utils/format";

const columns = ["Student", "Course", "Pending", "Due Date", "Status"];

export default function ReportsPage() {
  const pendingRows = students.filter((student) => feeStatus(student) !== "Paid");
  const pie = [
    { name: "Paid", value: students.filter((s) => feeStatus(s) === "Paid").length },
    { name: "Partially Paid", value: students.filter((s) => feeStatus(s) === "Partially Paid").length },
    { name: "Pending", value: students.filter((s) => feeStatus(s) === "Pending").length },
  ];

  function renderCell(student, column) {
    switch (column) {
      case "Student":
        return <span className="font-semibold">{student.name}</span>;
      case "Course":
        return student.course;
      case "Pending":
        return (
          <span className="font-semibold text-destructive">
            {formatINR(student.totalFee - student.paid)}
          </span>
        );
      case "Due Date":
        return student.dueDate;
      default:
        return <StatusBadge status={feeStatus(student)} />;
    }
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Attendance, fee collection and student statistics"
        actions={
          <Button size="sm" variant="secondary">
            <Download className="size-4" /> Download report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active students" value="248" icon={Users} />
        <StatCard label="Average attendance" value="91%" icon={CalendarCheck} />
        <StatCard label="Collected this month" value={formatINR(263000)} icon={Wallet} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Attendance report" subtitle="Present percentage by month">
          <AttendanceChart />
        </ChartCard>
        <ChartCard title="Fee collection report" subtitle="Collected vs pending (₹)">
          <FeeChart />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Fee status split" subtitle="Share of students by status">
          <StatusPie data={pie} />
          <ul className="mt-4 space-y-2 text-[13px]">
            {pie.map((item) => (
              <li key={item.name} className="flex items-center justify-between">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="font-semibold">{item.value} students</span>
              </li>
            ))}
          </ul>
        </ChartCard>

        <Card className="p-0 xl:col-span-2">
          <div className="border-b border-border p-5">
            <h3 className="text-[17px] font-bold tracking-tight">Pending fee report</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {pendingRows.length} students with outstanding balance
            </p>
          </div>
          <Table columns={columns} rows={pendingRows} renderCell={renderCell} />
        </Card>
      </div>
    </>
  );
}
