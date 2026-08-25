import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { EditableStudentCard } from "@/components/EditableStudentCard";
import { MatchingGroupsList, RemoveFromGroupButton } from "@/components/MatchingGroupsList";
import { ConfirmButton } from "@/components/ConfirmButton";
import { getStudentById, getMatchingGroups, getCourses, getGroups } from "@/lib/data";
import { softDeleteStudent } from "@/lib/actions";
import { Trash2 } from "lucide-react";

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const [student, courses, groups] = await Promise.all([
    getStudentById(params.id),
    getCourses(),
    getGroups(),
  ]);

  if (!student) notFound();

  const matchingGroups =
    !student.group_id && student.level > 0
      ? await getMatchingGroups(student.course_id, student.level)
      : [];

  return (
    <div>
      <PageHeader title="O'quvchi profili" backHref="/students" />

      <div className="p-4 md:p-8 max-w-lg space-y-5">
        <EditableStudentCard student={student} courses={courses} groups={groups} />

        {!student.group_id && student.level > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Mos guruhlar</h3>
            <MatchingGroupsList studentId={student.id} groups={matchingGroups} />
          </section>
        )}

        {student.group_id && (
          <RemoveFromGroupButton studentId={student.id} level={student.level} />
        )}

        <ConfirmButton
          label="O'quvchini o'chirish"
          confirmLabel="O'chirish"
          title="O'quvchini o'chirish"
          description="Ushbu o'quvchini o'chirmoqchimisiz? U 'O'chirilganlar' bo'limiga o'tkaziladi."
          variant="danger"
          className="btn-secondary text-danger-600 w-full"
          icon={<Trash2 className="w-4 h-4" />}
          action={softDeleteStudent.bind(null, student.id)}
          successMessage="O'quvchi o'chirildi."
          redirectOnSuccess="/students"
        />
      </div>
    </div>
  );
}
