import { Plus } from "lucide-react";
import { Button, Card, PageHeader, StatusBadge, Table } from "@/components/ui-kit";
import { batches } from "@/data/mock";

const columns = ["Batch Name", "Course", "Teacher", "Timing", "Students", "Status"];

export default function BatchesPage() {
  function renderCell(batch, column) {
    switch (column) {
      case "Batch Name":
        return (
          <span className="block">
            <span className="block font-semibold">{batch.name}</span>
            <span className="block text-xs text-muted-foreground">{batch.room}</span>
          </span>
        );
      case "Course":
        return batch.course;
      case "Teacher":
        return batch.teacher;
      case "Timing":
        return batch.timing;
      case "Students":
        return <span className="font-semibold">{batch.students}</span>;
      default:
        return <StatusBadge status={batch.status} />;
    }
  }

  return (
    <>
      <PageHeader
        title="Batch Management"
        subtitle="Timings, rooms and teacher assignments"
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Create Batch
          </Button>
        }
      />
      <Card className="p-0">
        <Table columns={columns} rows={batches} renderCell={renderCell} />
      </Card>
    </>
  );
}
