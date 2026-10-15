import { Megaphone, Plus } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, Input, Modal, PageHeader, Select, Textarea } from "@/components/ui-kit";
import { announcements as seedAnnouncements } from "@/data/mock";
import { formatDate } from "@/utils/format";

export default function AnnouncementsPage({ canCreate = false, title = "Announcements", subtitle }) {
  const [rows, setRows] = useState(seedAnnouncements);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", audience: "All", date: "" });

  function update(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  function handleCreate(event) {
    event.preventDefault();
    setRows((prev) => [
      {
        id: `ANN-${prev.length + 1}`,
        ...form,
        date: form.date || new Date().toISOString().slice(0, 10),
        author: "You",
      },
      ...prev,
    ]);
    setOpen(false);
    setForm({ title: "", message: "", audience: "All", date: "" });
  }

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle ?? "Tests, holidays, class changes and updates"}
        actions={
          canCreate ? (
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-4" /> New Announcement
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((item) => (
          <Card key={item.id} hover className="p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                <Megaphone className="size-[18px]" />
              </span>
              <span className="text-right">
                <Badge variant="primary">{item.audience}</Badge>
                <span className="mt-1.5 block text-xs text-muted-foreground">{formatDate(item.date)}</span>
              </span>
            </div>
            <h3 className="mt-4 text-[18px] font-bold tracking-tight">{item.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{item.message}</p>
            <p className="mt-4 text-xs font-medium text-muted-foreground">Posted by {item.author}</p>
          </Card>
        ))}
      </div>

      {canCreate ? (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Create announcement"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="announcement-form">
                Publish
              </Button>
            </>
          }
        >
          <form id="announcement-form" className="grid gap-4" onSubmit={handleCreate}>
            <Input id="a-title" label="Title" value={form.title} onChange={update("title")} required />
            <Textarea id="a-message" label="Message" value={form.message} onChange={update("message")} required />
            <Select id="a-audience" label="Audience" value={form.audience} onChange={update("audience")}>
              <option>All</option>
              <option>Students</option>
              <option>Teachers</option>
              <option>Parents</option>
              <option>Batch A - Morning</option>
              <option>Batch B - Afternoon</option>
              <option>Batch C - Evening</option>
              <option>Batch D - Morning</option>
            </Select>
            <Input id="a-date" type="date" label="Date" value={form.date} onChange={update("date")} />
          </form>
        </Modal>
      ) : null}
    </>
  );
}
