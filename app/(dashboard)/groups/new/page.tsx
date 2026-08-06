import { PageHeader } from "@/components/PageHeader";
import { GroupForm } from "@/components/GroupForm";
import { getCourses } from "@/lib/data";

export default async function NewGroupPage() {
  const courses = await getCourses();

  return (
    <div>
      <PageHeader title="Yangi guruh" />
      <div className="p-4 md:p-8 max-w-md">
        <div className="card p-5 md:p-6">
          <GroupForm courses={courses} />
        </div>
      </div>
    </div>
  );
}
