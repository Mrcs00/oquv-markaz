import { createClient } from "@/lib/supabase/server";
import { READY_POOL_SIZE } from "@/lib/constants";
import type { Course, Group, Student, StudentWithRelations } from "@/lib/types";

export async function getCourses() {
  const supabase = createClient();
  const { data } = await supabase.from("courses").select("*").order("name");
  return data ?? [];
}

// ------------------------------------------------------------
// STUDENTS
// ------------------------------------------------------------

export async function getStudents(opts?: { search?: string }) {
  const supabase = createClient();
  let query = supabase
    .from("students")
    .select("*, course:courses(*), group:groups(*), call_result:call_results(*)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (opts?.search) {
    query = query.or(`full_name.ilike.%${opts.search}%,phone.ilike.%${opts.search}%`);
  }

  const { data } = await query;
  return (data ?? []).map(normalizeStudent);
}

export async function getStudentById(id: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("*, course:courses(*), group:groups(*), call_result:call_results(*)")
    .eq("id", id)
    .single();

  return data ? normalizeStudent(data) : null;
}

export async function getDeletedStudents() {
  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("*, course:courses(*), group:groups(*), call_result:call_results(*)")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  return (data ?? []).map(normalizeStudent);
}

function normalizeStudent(row: any): StudentWithRelations {
  return {
    ...row,
    call_result: Array.isArray(row.call_result) ? row.call_result[0] ?? null : row.call_result,
  };
}

// ------------------------------------------------------------
// GROUPS
// ------------------------------------------------------------

export async function getGroups() {
  const supabase = createClient();
  const { data } = await supabase
    .from("groups")
    .select("*, course:courses(*), students:students(id)")
    .order("created_at", { ascending: false });

  return (data ?? []) as unknown as (Group & { course: any; students: { id: string }[] })[];
}

export interface GroupDetail extends Group {
  course: Course | null;
  students: Student[];
}

export async function getGroupById(id: string): Promise<GroupDetail | null> {
  const supabase = createClient();
  const { data: group } = await supabase
    .from("groups")
    .select("*, course:courses(*)")
    .eq("id", id)
    .single();

  if (!group) return null;

  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("group_id", id)
    .is("deleted_at", null)
    .order("full_name");

  return { ...group, students: (students ?? []) as Student[] } as GroupDetail;
}

// Guruhlar — bilimi bor o'quvchiga mos keladigan, joy bor guruhlar
export async function getMatchingGroups(courseId: string, level: number) {
  const supabase = createClient();
  const { data } = await supabase
    .from("groups")
    .select("*, course:courses(*), students:students(id)")
    .eq("course_id", courseId)
    .eq("status", "faol")
    .lte("min_level", level)
    .gte("max_level", level);

  return (data ?? [])
    .map((g: any) => ({ ...g, currentCount: g.students?.length ?? 0 }))
    .filter((g: any) => g.currentCount < g.max_students);
}

// ------------------------------------------------------------
// "0 dan" GURUH HAVZALARI (pool)
// ------------------------------------------------------------

export interface Pool {
  courseId: string;
  courseName: string;
  count: number;
  ready: boolean;
  students: StudentWithRelations[];
}

export async function getPools(): Promise<Pool[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("students")
    .select("*, course:courses(*), call_result:call_results(*)")
    .eq("level", 0)
    .is("group_id", null)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const students = (data ?? []).map(normalizeStudent);

  const grouped = new Map<string, StudentWithRelations[]>();
  for (const s of students) {
    const key = s.course_id;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(s);
  }

  const pools: Pool[] = [];
  for (const [courseId, list] of grouped) {
    pools.push({
      courseId,
      courseName: list[0].course?.name ?? "Noma'lum kurs",
      count: list.length,
      ready: list.length >= READY_POOL_SIZE,
      students: list.slice(0, READY_POOL_SIZE),
    });
  }

  return pools.sort((a, b) => b.count - a.count);
}

export async function getPoolByCourse(courseId: string): Promise<Pool | null> {
  const pools = await getPools();
  return pools.find((p) => p.courseId === courseId) ?? null;
}

// ------------------------------------------------------------
// DASHBOARD
// ------------------------------------------------------------

export async function getDashboardStats() {
  const supabase = createClient();

  const [{ count: newStudents }, { count: activeGroups }, { count: totalStudents }, pools, recent] =
    await Promise.all([
      supabase
        .from("students")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null)
        .in("status", ["kutmoqda", "guruh_kutmoqda"]),
      supabase.from("groups").select("id", { count: "exact", head: true }).eq("status", "faol"),
      supabase.from("students").select("id", { count: "exact", head: true }).is("deleted_at", null),
      getPools(),
      supabase
        .from("students")
        .select("*, course:courses(*), group:groups(*), call_result:call_results(*)")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const readyPools = pools.filter((p) => p.ready);

  return {
    newStudents: newStudents ?? 0,
    activeGroups: activeGroups ?? 0,
    readyToOpen: readyPools.length,
    totalStudents: totalStudents ?? 0,
    // Barcha pool'lar (0 dan boshlaydiganlar) — hajmidan qat'i nazar,
    // administrator xohlagan payt telefon qilish jarayonini boshlashi mumkin.
    pools,
    recentStudents: (recent.data ?? []).map(normalizeStudent),
  };
}
