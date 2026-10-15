import { FileText, Plus } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "@/components/ui-kit";
import { materials } from "@/data/mock";
import { formatDate } from "@/utils/format";

export default function AssignmentsPage() {
  return (
    <>
      <PageHeader
        title="Assignments & Notes"
        subtitle="Work shared with your batches"
        actions={
          <Button size="sm">
            <Plus className="size-4" /> New Assignment
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {materials.map((item) => (
          <Card key={item.id} hover className="p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                <FileText className="size-[18px]" />
              </span>
              <Badge variant="primary">{item.type}</Badge>
            </div>
            <h3 className="mt-4 text-[17px] font-bold leading-snug tracking-tight">{item.title}</h3>
            <p className="mt-2 text-[13px] text-muted-foreground">
              {item.subject} · {item.batch}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Shared on {formatDate(item.uploadedDate)} · {item.size}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
