import { Clock, MapPin, User, Users } from "lucide-react";
import { Card, PageHeader, StatusBadge, Table } from "@/components/ui-kit";
import { batches, currentStudent, students } from "@/data/mock";

const columns = ["Classmate", "Course", "Attendance"];

export default function MyBatch() {
  const batch = batches.find((item) => item.name === currentStudent.batch) ?? batches[0];
  const classmates = students.filter((student) => student.batch === batch.name);

  function renderCell(student, column) {
    if (column === "Classmate") return <span className="font-semibold">{student.name}</span>;
    if (column === "Course") return student.course;
    return `${student.attendance}%`;
  }

  return (
    <>
      <PageHeader title="My Batch" subtitle="Batch details, timing and faculty" />

      <Card className="p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-[24px] font-extrabold tracking-tight">{batch.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{batch.course}</p>
          </div>
          <StatusBadge status={batch.status} />
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Clock, label: "Timing", value: batch.timing },
            { icon: User, label: "Teacher", value: batch.teacher },
            { icon: MapPin, label: "Room", value: batch.room },
            { icon: Users, label: "Students", value: `${batch.students}` },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-background p-4">
              <dt className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <item.icon className="size-4 text-primary" /> {item.label}
              </dt>
              <dd className="mt-1.5 text-[15px] font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="p-0">
        <div className="border-b border-border p-5">
          <h3 className="text-[17px] font-bold tracking-tight">Classmates</h3>
        </div>
        <Table columns={columns} rows={classmates} renderCell={renderCell} />
      </Card>
    </>
  );
}
