import { Link } from "@/lib/router-compat";
import { Clock, MapPin, Users } from "lucide-react";
import { Button, Card, PageHeader, StatusBadge } from "@/components/ui-kit";
import { batches } from "@/data/mock";

export default function MyBatches() {
  const myBatches = batches.slice(0, 2);

  return (
    <>
      <PageHeader title="My Batches" subtitle="Batches assigned to you by the administrator" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {myBatches.map((batch) => (
          <Card key={batch.id} hover className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[19px] font-bold tracking-tight">{batch.name}</h3>
              <StatusBadge status={batch.status} />
            </div>
            <p className="mt-1 text-[13px] text-muted-foreground">{batch.course}</p>

            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-primary" /> {batch.timing}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> {batch.room}
              </li>
              <li className="flex items-center gap-2">
                <Users className="size-4 text-primary" /> {batch.students} students
              </li>
            </ul>

            <div className="mt-5 flex gap-2">
              <Button as={Link} to="/teacher/attendance" size="sm" className="flex-1">
                Mark attendance
              </Button>
              <Button as={Link} to="/teacher/students" size="sm" variant="secondary" className="flex-1">
                Students
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
