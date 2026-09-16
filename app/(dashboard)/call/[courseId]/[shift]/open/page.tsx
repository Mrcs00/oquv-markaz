import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { GroupForm } from "@/components/GroupForm";
import { getPoolByCourseAndShift, getCourses } from "@/lib/data";
import { SHIFT_META } from "@/lib/constants";
import type { GroupShift } from "@/lib/types";

export default async function OpenGroupPage({
  params,
}: {
  params: { courseId: string; shift: string };
}) {
  const shift = params.shift as GroupShift;
  const [pool, courses] = await Promise.all([
    getPoolByCourseAndShift(params.courseId, shift),
    getCourses(),
  ]);
  if (!pool) notFound();

  const comingStudents = pool.students.filter((s) => s.call_result?.result === "coming");
  if (comingStudents.length === 0) notFound();

  const shiftMeta = SHIFT_META[shift];

  return (
    <div>
      <PageHeader
        title="Guruh yaratish"
        subtitle={`${pool.courseName} — Beginner · ${shiftMeta.emoji} ${shiftMeta.label} (${shiftMeta.korean})`}
      />
      <div className="p-4 md:p-8 max-w-md">
        <div className="card p-5 md:p-6">
          <GroupForm
            courses={courses}
            defaultCourseId={pool.courseId}
            defaultMinLevel={0}
            defaultMaxLevel={0}
            defaultShift={shift}
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
