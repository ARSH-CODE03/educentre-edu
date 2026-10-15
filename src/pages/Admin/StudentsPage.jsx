import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  StatusBadge,
  Table,
} from "@/components/ui-kit";
import { batches, courses, feeStatus, students as seedStudents } from "@/data/mock";
import { formatDate } from "@/utils/format";

const columns = ["Name", "Contact", "Course", "Batch", "Joining Date", "Fee Status", "Actions"];

const emptyForm = {
  name: "",
  contact: "",
  email: "",
  course: courses[0].name,
  batch: batches[0].name,
  joiningDate: "",
  totalFee: "",
  paid: "",
};

export default function StudentsPage() {
  const [rows, setRows] = useState(seedStudents);
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [batch, setBatch] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(
    () =>
      rows.filter((student) => {
        const matchesQuery =
          student.name.toLowerCase().includes(query.toLowerCase()) ||
          student.contact.includes(query);
        const matchesCourse = course === "all" || student.course === course;
        const matchesBatch = batch === "all" || student.batch === batch;
        return matchesQuery && matchesCourse && matchesBatch;
      }),
    [rows, query, course, batch],
  );

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(student) {
    setEditing(student);
    setForm({ ...student, totalFee: String(student.totalFee), paid: String(student.paid) });
    setModalOpen(true);
  }

  function update(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  function handleSave(event) {
    event.preventDefault();
    const payload = {
      ...form,
      totalFee: Number(form.totalFee || 0),
      paid: Number(form.paid || 0),
      attendance: editing?.attendance ?? 0,
      dueDate: editing?.dueDate ?? form.joiningDate,
    };
    setRows((prev) =>
      editing
        ? prev.map((item) => (item.id === editing.id ? { ...item, ...payload } : item))
        : [{ ...payload, id: `STU-${1000 + prev.length + 1}` }, ...prev],
    );
    setModalOpen(false);
  }

  function handleDelete(id) {
    setRows((prev) => prev.filter((student) => student.id !== id));
  }

  function renderCell(student, column) {
    switch (column) {
      case "Name":
        return (
          <span className="block">
            <span className="block font-semibold">{student.name}</span>
            <span className="block text-xs text-muted-foreground">{student.id}</span>
          </span>
        );
      case "Contact":
        return (
          <span className="block">
            <span className="block">{student.contact}</span>
            <span className="block text-xs text-muted-foreground">{student.email}</span>
          </span>
        );
      case "Course":
        return student.course;
      case "Batch":
        return <Badge>{student.batch}</Badge>;
      case "Joining Date":
        return formatDate(student.joiningDate);
      case "Fee Status":
        return <StatusBadge status={feeStatus(student)} />;
      default:
        return (
          <span className="flex gap-1.5">
            <button
              type="button"
              onClick={() => openEdit(student)}
              aria-label={`Edit ${student.name}`}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-primary"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(student.id)}
              aria-label={`Delete ${student.name}`}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </span>
        );
    }
  }

  return (
    <>
      <PageHeader
        title="Student Management"
        subtitle={`${filtered.length} of ${rows.length} students`}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="size-4" /> Add Student
          </Button>
        }
      />

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_220px]">
          <Input
            id="student-search"
            icon={Search}
            placeholder="Search students by name or contact"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select id="filter-course" value={course} onChange={(event) => setCourse(event.target.value)}>
            <option value="all">All courses</option>
            {courses.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select id="filter-batch" value={batch} onChange={(event) => setBatch(event.target.value)}>
            <option value="all">All batches</option>
            {batches.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="p-0">
        <Table columns={columns} rows={filtered} renderCell={renderCell} emptyMessage="No students match these filters" />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit student" : "Add student"}
        description="Student records sync with courses, batches and fee tracking."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="student-form">
              {editing ? "Save changes" : "Add student"}
            </Button>
          </>
        }
      >
        <form id="student-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
          <Input id="f-name" label="Full name" value={form.name} onChange={update("name")} required />
          <Input id="f-contact" label="Contact" value={form.contact} onChange={update("contact")} required />
          <Input id="f-email" type="email" label="Email" value={form.email} onChange={update("email")} />
          <Input id="f-join" type="date" label="Joining date" value={form.joiningDate} onChange={update("joiningDate")} required />
          <Select id="f-course" label="Course" value={form.course} onChange={update("course")}>
            {courses.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </Select>
          <Select id="f-batch" label="Batch" value={form.batch} onChange={update("batch")}>
            {batches.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </Select>
          <Input id="f-total" type="number" label="Total fee (₹)" value={form.totalFee} onChange={update("totalFee")} />
          <Input id="f-paid" type="number" label="Paid amount (₹)" value={form.paid} onChange={update("paid")} />
        </form>
      </Modal>
    </>
  );
}
