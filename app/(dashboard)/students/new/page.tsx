import { PageHeader } from "@/components/PageHeader";
import { StudentForm } from "@/components/StudentForm";
import { getCourses, getGroups } from "@/lib/data";

export default async function NewStudentPage() {
  const [courses, groups] = await Promise.all([getCourses(), getGroups()]);

  return (
    <div>
      <PageHeader title="Yangi o'quvchi" backHref="/students" />
      <div className="p-4 md:p-8 max-w-md">
        <div className="card p-5 md:p-6">
          <StudentForm courses={courses} groups={groups} />
        </div>
      </div>
    </div>
  );
}
