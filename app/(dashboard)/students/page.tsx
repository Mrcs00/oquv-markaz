import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StudentsList } from "@/components/StudentsList";
import { getStudents } from "@/lib/data";

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div>
      <PageHeader
        title="Yangi o'quvchilar"
        action={
          <Link href="/students/new" className="btn-primary">
            + Yangi o'quvchi
          </Link>
        }
      />
      <div className="p-4 md:p-8">
        <StudentsList students={students} />
      </div>
    </div>
  );
}
