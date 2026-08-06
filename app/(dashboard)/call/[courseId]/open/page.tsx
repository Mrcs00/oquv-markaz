import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { GroupForm } from "@/components/GroupForm";
import { getPoolByCourse, getCourses } from "@/lib/data";

export default async function OpenGroupPage({ params }: { params: { courseId: string } }) {
  const [pool, courses] = await Promise.all([getPoolByCourse(params.courseId), getCourses()]);
  if (!pool) notFound();

  const comingStudents = pool.students.filter((s) => s.call_result?.result === "coming");
  if (comingStudents.length === 0) notFound();

  return (
    <div>
      <PageHeader title="Guruh yaratish" subtitle={`${pool.courseName} — Beginner`} />
      <div className="p-4 md:p-8 max-w-md">
        <div className="card p-5 md:p-6">
          <GroupForm
            courses={courses}
            defaultCourseId={pool.courseId}
            defaultMinLevel={0}
            defaultMaxLevel={0}
            presetName={`${pool.courseName} Beginner`}
            presetStudents={comingStudents.map((s) => ({
              id: s.id,
              full_name: s.full_name,
              phone: s.phone,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
