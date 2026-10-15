import { BookOpen, Plus, Users } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatusBadge } from "@/components/ui-kit";
import { courses } from "@/data/mock";
import { formatINR } from "@/utils/format";

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        title="Course Management"
        subtitle={`${courses.length} courses offered at your centre`}
        actions={
          <Button size="sm">
            <Plus className="size-4" /> Add Course
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} hover className="p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                <BookOpen className="size-5" />
              </span>
              <StatusBadge status={course.status} />
            </div>
            <h3 className="mt-4 text-[19px] font-bold tracking-tight">{course.name}</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">Duration: {course.duration}</p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
              <div className="rounded-xl border border-border bg-background p-3">
                <dt className="text-muted-foreground">Students</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 font-bold">
                  <Users className="size-3.5 text-primary" /> {course.students}
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <dt className="text-muted-foreground">Course fee</dt>
                <dd className="mt-0.5 font-bold">{formatINR(course.fee)}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned teachers
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {course.teachers.map((teacher) => (
                  <Badge key={teacher} variant="primary">
                    {teacher}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
