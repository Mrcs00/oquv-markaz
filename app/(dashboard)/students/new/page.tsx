import { PageHeader } from "@/components/PageHeader";
import { StudentForm } from "@/components/StudentForm";
import { getCourses } from "@/lib/data";

export default async function NewStudentPage() {
  const courses = await getCourses();

  return (
    <div>
      <PageHeader title="Yangi o'quvchi" />
      <div className="p-4 md:p-8 max-w-md">
        <div className="card p-5 md:p-6">
          <StudentForm courses={courses} />
        </div>
      </div>
    </div>
  );
}
