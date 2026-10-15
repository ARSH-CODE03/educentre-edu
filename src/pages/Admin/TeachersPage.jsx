import { Plus, Search, Pencil, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, Input, Modal, PageHeader, Select, StatusBadge, Table } from "@/components/ui-kit";
import { batches, teachers as seedTeachers } from "@/data/mock";

const columns = ["Teacher", "Subject", "Assigned Batches", "Contact", "Status", "Actions"];

export default function TeachersPage() {
  const [rows, setRows] = useState(seedTeachers);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", contact: "", email: "", batch: batches[0].name, status: "Active" });

  const filtered = useMemo(
    () =>
      rows.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(query.toLowerCase()) ||
          teacher.subject.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  function update(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  function handleSave(event) {
    event.preventDefault();
    setRows((prev) => [
      {
        id: `TCH-${String(prev.length + 1).padStart(2, "0")}`,
        name: form.name,
        subject: form.subject,
        batches: [form.batch],
        contact: form.contact,
        email: form.email,
        status: form.status,
      },
      ...prev,
    ]);
    setOpen(false);
  }

  function renderCell(teacher, column) {
    switch (column) {
      case "Teacher":
        return (
          <span className="block">
            <span className="block font-semibold">{teacher.name}</span>
            <span className="block text-xs text-muted-foreground">{teacher.id}</span>
          </span>
        );
      case "Subject":
        return teacher.subject;
      case "Assigned Batches":
        return (
          <span className="flex flex-wrap gap-1.5">
            {teacher.batches.map((batch) => (
              <Badge key={batch} variant="primary">
                {batch}
              </Badge>
            ))}
          </span>
        );
      case "Contact":
        return (
          <span className="block">
            <span className="block">{teacher.contact}</span>
            <span className="block text-xs text-muted-foreground">{teacher.email}</span>
          </span>
        );
      case "Status":
        return <StatusBadge status={teacher.status} />;
      default:
        return (
          <span className="flex gap-1.5">
            <button type="button" aria-label="Edit teacher" className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-primary">
              <Pencil className="size-3.5" />
            </button>
            <button type="button" aria-label="Email teacher" className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-primary">
              <Mail className="size-3.5" />
            </button>
          </span>
        );
    }
  }

  return (
    <>
      <PageHeader
        title="Teacher Management"
        subtitle="Assign faculty to courses and batches"
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="size-4" /> Add Teacher
          </Button>
        }
      />

      <Card className="p-4">
        <Input
          id="teacher-search"
          icon={Search}
          placeholder="Search teachers by name or subject"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Card>

      <Card className="p-0">
        <Table columns={columns} rows={filtered} renderCell={renderCell} emptyMessage="No teachers found" />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add teacher"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="teacher-form">
              Add teacher
            </Button>
          </>
        }
      >
        <form id="teacher-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
          <Input id="t-name" label="Full name" value={form.name} onChange={update("name")} required />
          <Input id="t-subject" label="Subject" value={form.subject} onChange={update("subject")} required />
          <Input id="t-contact" label="Contact" value={form.contact} onChange={update("contact")} required />
          <Input id="t-email" type="email" label="Email" value={form.email} onChange={update("email")} />
          <Select id="t-batch" label="Assign batch" value={form.batch} onChange={update("batch")}>
            {batches.map((batch) => (
              <option key={batch.id}>{batch.name}</option>
            ))}
          </Select>
          <Select id="t-status" label="Status" value={form.status} onChange={update("status")}>
            <option>Active</option>
            <option>On Leave</option>
          </Select>
        </form>
      </Modal>
    </>
  );
}
