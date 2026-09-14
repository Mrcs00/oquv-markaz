import { PageHeader } from "@/components/PageHeader";
import { DeletedStudentsList } from "@/components/DeletedStudentsList";
import { getDeletedStudents } from "@/lib/data";

export default async function DeletedStudentsPage() {
  const students = await getDeletedStudents();

  return (
    <div>
      <PageHeader title="O'chirilganlar" />
      <div className="p-4 md:p-8">
        {students.length === 0 ? (
          <div className="card p-10 text-center text-sm text-slate-400">
            O'chirilgan o'quvchilar yo'q.
          </div>
        ) : (
          <DeletedStudentsList students={students} />
        )}
      </div>
    </div>
  );
}
