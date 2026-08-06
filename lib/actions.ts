"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CallResultValue } from "@/lib/types";

export type ActionResult = { success?: boolean; error?: string };

function fail(message: string): ActionResult {
  return { error: message };
}

// ------------------------------------------------------------
// STUDENTS
// ------------------------------------------------------------

// Note: the extra unused `_prevState` argument lets this be bound/used
// directly as a React `useFormState` action (which always calls the action
// as `action(prevState, formData)`).
export async function createStudent(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = createClient();

  const full_name = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const course_id = String(formData.get("course_id") || "");
  const level = Number(formData.get("level"));

  if (!full_name || !phone || !course_id || Number.isNaN(level)) {
    return fail("Barcha maydonlarni to'ldiring.");
  }

  const status = level === 0 ? "kutmoqda" : "guruh_kutmoqda";

  const { error } = await supabase.from("students").insert({
    full_name,
    phone,
    course_id,
    level,
    status,
  });

  if (error) return fail("O'quvchini saqlashda xatolik yuz berdi.");

  revalidatePath("/");
  revalidatePath("/students");
  return { success: true };
}

export async function updateStudent(
  studentId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = createClient();

  const full_name = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const course_id = String(formData.get("course_id") || "");
  const level = Number(formData.get("level"));

  if (!full_name || !phone || !course_id || Number.isNaN(level)) {
    return fail("Barcha maydonlarni to'ldiring.");
  }

  // Agar o'quvchi hali guruhga biriktirilmagan bo'lsa, daraja o'zgarganda
  // statusni ham moslashtiramiz (0 dan <-> bilimi bor).
  const { data: existing } = await supabase
    .from("students")
    .select("status, group_id")
    .eq("id", studentId)
    .single();

  const updates: Record<string, unknown> = { full_name, phone, course_id, level };
  if (existing && !existing.group_id) {
    updates.status = level === 0 ? "kutmoqda" : "guruh_kutmoqda";
  }

  const { error } = await supabase.from("students").update(updates).eq("id", studentId);
  if (error) return fail("O'quvchi ma'lumotlarini yangilashda xatolik yuz berdi.");

  revalidatePath("/");
  revalidatePath("/students");
  revalidatePath(`/students/${studentId}`);
  return { success: true };
}

export async function softDeleteStudent(studentId: string): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase
    .from("students")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", studentId);

  if (error) return fail("O'quvchini o'chirishda xatolik yuz berdi.");

  revalidatePath("/");
  revalidatePath("/students");
  revalidatePath("/deleted");
  return { success: true };
}

export async function restoreStudent(studentId: string): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase
    .from("students")
    .update({ deleted_at: null })
    .eq("id", studentId);

  if (error) return fail("O'quvchini tiklashda xatolik yuz berdi.");

  revalidatePath("/");
  revalidatePath("/students");
  revalidatePath("/deleted");
  return { success: true };
}

export async function permanentlyDeleteStudent(studentId: string): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase.from("students").delete().eq("id", studentId);
  if (error) return fail("O'quvchini butunlay o'chirishda xatolik yuz berdi.");

  revalidatePath("/deleted");
  return { success: true };
}

export async function removeStudentFromGroup(studentId: string, level: number): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase
    .from("students")
    .update({
      group_id: null,
      status: level === 0 ? "kutmoqda" : "guruh_kutmoqda",
    })
    .eq("id", studentId);

  if (error) return fail("O'quvchini guruhdan chiqarishda xatolik yuz berdi.");

  revalidatePath("/groups");
  revalidatePath("/students");
  revalidatePath("/");
  return { success: true };
}

export async function addStudentToGroup(studentId: string, groupId: string): Promise<ActionResult> {
  const supabase = createClient();

  const { data: group } = await supabase
    .from("groups")
    .select("id, max_students, students:students(count)")
    .eq("id", groupId)
    .single();

  if (!group) return fail("Guruh topilmadi.");

  const { count } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("group_id", groupId)
    .is("deleted_at", null);

  if ((count ?? 0) >= group.max_students) {
    return fail("Bu guruh to'liq. Boshqa guruh tanlang.");
  }

  const { error } = await supabase
    .from("students")
    .update({ group_id: groupId, status: "faol" })
    .eq("id", studentId);

  if (error) return fail("O'quvchini guruhga qo'shishda xatolik yuz berdi.");

  revalidatePath("/groups");
  revalidatePath("/students");
  revalidatePath(`/students/${studentId}`);
  revalidatePath("/");
  return { success: true };
}

// ------------------------------------------------------------
// CALL RESULTS
// ------------------------------------------------------------

export async function setCallResult(studentId: string, result: CallResultValue, note = ""): Promise<ActionResult> {
  const supabase = createClient();

  const { error } = await supabase
    .from("call_results")
    .upsert({ student_id: studentId, result, note }, { onConflict: "student_id" });

  if (error) return fail("Telefon natijasini saqlashda xatolik yuz berdi.");

  revalidatePath("/call", "layout");
  revalidatePath("/");
  return { success: true };
}

// ------------------------------------------------------------
// GROUPS
// ------------------------------------------------------------

export async function createGroup(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const course_id = String(formData.get("course_id") || "");
  const min_level = Number(formData.get("min_level"));
  const max_level = Number(formData.get("max_level"));
  const teacher_name = String(formData.get("teacher_name") || "").trim();
  const schedule_time = String(formData.get("schedule_time") || "").trim();
  const max_students = Number(formData.get("max_students") || 12);
  const schedule_days = formData.getAll("schedule_days").map(String);
  const studentIds = formData.getAll("student_ids").map(String);

  if (!name || !course_id || Number.isNaN(min_level) || Number.isNaN(max_level)) {
    return fail("Guruh ma'lumotlarini to'liq kiriting.");
  }

  const { data: newGroup, error } = await supabase
    .from("groups")
    .insert({
      name,
      course_id,
      min_level,
      max_level,
      teacher_name,
      schedule_time,
      schedule_days,
      max_students,
    })
    .select("id")
    .single();

  if (error || !newGroup) return fail("Guruhni yaratishda xatolik yuz berdi.");

  if (studentIds.length > 0) {
    const { error: assignError } = await supabase
      .from("students")
      .update({ group_id: newGroup.id, status: "faol" })
      .in("id", studentIds);

    if (assignError) return fail("O'quvchilarni guruhga biriktirishda xatolik yuz berdi.");
  }

  revalidatePath("/groups");
  revalidatePath("/students");
  revalidatePath("/");
  redirect(`/groups/${newGroup.id}`);
}

export async function updateGroup(
  groupId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = createClient();

  const name = String(formData.get("name") || "").trim();
  const teacher_name = String(formData.get("teacher_name") || "").trim();
  const schedule_time = String(formData.get("schedule_time") || "").trim();
  const max_students = Number(formData.get("max_students") || 12);
  const schedule_days = formData.getAll("schedule_days").map(String);

  const { error } = await supabase
    .from("groups")
    .update({ name, teacher_name, schedule_time, max_students, schedule_days })
    .eq("id", groupId);

  if (error) return fail("Guruhni yangilashda xatolik yuz berdi.");

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

export async function deleteGroup(groupId: string): Promise<ActionResult> {
  const supabase = createClient();

  const { data: members } = await supabase
    .from("students")
    .select("id, level")
    .eq("group_id", groupId)
    .is("deleted_at", null);

  if (members && members.length > 0) {
    for (const m of members) {
      await supabase
        .from("students")
        .update({ group_id: null, status: m.level === 0 ? "kutmoqda" : "guruh_kutmoqda" })
        .eq("id", m.id);
    }
  }

  const { error } = await supabase.from("groups").delete().eq("id", groupId);
  if (error) return fail("Guruhni o'chirishda xatolik yuz berdi.");

  revalidatePath("/groups");
  revalidatePath("/students");
  revalidatePath("/");
  redirect("/groups");
}

// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
