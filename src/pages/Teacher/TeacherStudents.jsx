import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Card, Input, PageHeader, Select, Table } from "@/components/ui-kit";
import { batches, students } from "@/data/mock";

const columns = ["Student", "Contact", "Batch", "Attendance", "Course"];

export default function TeacherStudents() {
  const [query, setQuery] = useState("");
  const [batch, setBatch] = useState("all");

  const rows = useMemo(
    () =>
      students.filter((student) => {
        const matchesQuery = student.name.toLowerCase().includes(query.toLowerCase());
        const matchesBatch = batch === "all" || student.batch === batch;
        return matchesQuery && matchesBatch;
      }),
    [query, batch],
  );

  function renderCell(student, column) {
    switch (column) {
      case "Student":
        return (
          <span className="block">
            <span className="block font-semibold">{student.name}</span>
            <span className="block text-xs text-muted-foreground">{student.id}</span>
          </span>
        );
      case "Contact":
        return student.contact;
      case "Batch":
        return <Badge>{student.batch}</Badge>;
      case "Attendance":
        return (
          <Badge variant={student.attendance >= 85 ? "success" : "warning"}>{student.attendance}%</Badge>
        );
      default:
        return student.course;
    }
  }

  return (
    <>
      <PageHeader title="Students" subtitle="Students enrolled in your batches" />

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            id="ts-search"
            icon={Search}
            placeholder="Search students"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select id="ts-batch" value={batch} onChange={(event) => setBatch(event.target.value)}>
            <option value="all">All my batches</option>
            {batches.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="p-0">
        <Table columns={columns} rows={rows} renderCell={renderCell} />
      </Card>
    </>
  );
}
