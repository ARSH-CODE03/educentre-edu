import { Download, FileText, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { Badge, Button, Card, Input, Modal, PageHeader, Select, Table } from "@/components/ui-kit";
import { batches, materials as seedMaterials } from "@/data/mock";
import { formatDate } from "@/utils/format";

const columns = ["Title", "Subject", "Batch", "Uploaded Date", "File Type", "Action"];

export default function MaterialPage({ canUpload = false, title = "Study Material", subtitle }) {
  const [rows, setRows] = useState(seedMaterials);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", batch: batches[0].name, type: "PDF" });

  function update(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  function handleUpload(event) {
    event.preventDefault();
    setRows((prev) => [
      {
        id: `MAT-${prev.length + 1}`,
        ...form,
        uploadedDate: new Date().toISOString().slice(0, 10),
        size: "1.2 MB",
      },
      ...prev,
    ]);
    setOpen(false);
  }

  function renderCell(row, column) {
    switch (column) {
      case "Title":
        return (
          <span className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
              <FileText className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{row.title}</span>
              <span className="block text-xs text-muted-foreground">{row.size}</span>
            </span>
          </span>
        );
      case "Subject":
        return row.subject;
      case "Batch":
        return <Badge>{row.batch}</Badge>;
      case "Uploaded Date":
        return formatDate(row.uploadedDate);
      case "File Type":
        return <Badge variant="primary">{row.type}</Badge>;
      default:
        return (
          <Button size="sm" variant="secondary">
            <Download className="size-3.5" /> Download
          </Button>
        );
    }
  }

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle ?? `${rows.length} files available`}
        actions={
          canUpload ? (
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-4" /> Upload Material
            </Button>
          ) : null
        }
      />

      <Card className="p-0">
        <Table columns={columns} rows={rows} renderCell={renderCell} emptyMessage="No material uploaded yet" />
      </Card>

      {canUpload ? (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Upload study material"
          description="Notes, PDFs and assignments are shared with the selected batch."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="material-form">
                <Upload className="size-4" /> Upload
              </Button>
            </>
          }
        >
          <form id="material-form" className="grid gap-4" onSubmit={handleUpload}>
            <Input id="m-title" label="Title" value={form.title} onChange={update("title")} required />
            <Input id="m-subject" label="Subject" value={form.subject} onChange={update("subject")} required />
            <Select id="m-batch" label="Batch" value={form.batch} onChange={update("batch")}>
              {batches.map((batch) => (
                <option key={batch.id}>{batch.name}</option>
              ))}
            </Select>
            <Select id="m-type" label="File type" value={form.type} onChange={update("type")}>
              <option>PDF</option>
              <option>DOCX</option>
              <option>PPTX</option>
              <option>Assignment</option>
            </Select>
            <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-6 text-center">
              <Upload className="mx-auto size-5 text-muted-foreground" />
              <p className="mt-2 text-[13px] font-medium">Drag and drop your file here</p>
              <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX or PPTX up to 20 MB</p>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  );
}
