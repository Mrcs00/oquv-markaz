"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CallResultValue, GroupShift } from "@/lib/types";
import { SHIFT_META } from "@/lib/constants";

export type ActionResult = { success?: boolean; error?: string };

function fail(message: string): ActionResult {
  return { error: message };
}

// Guruh "yigilmoqda" holatida bo'lsa va o'quvchilar soni max_students'ga
// yetsa, uni avtomatik "faol"ga o'tkazadi. Har safar guruhga o'quvchi
// qo'shilgandan keyin chaqiriladi.
async function maybeActivateGroup(
  supabase: ReturnType<typeof createClient>,
  groupId: string
): Promise<void> {
  const { data: group } = await supabase
    .from("groups")
    .select("id, status, max_students")
    .eq("id", groupId)
    .single();

  if (!group || group.status !== "yigilmoqda") return;

  const { count } = await supabase
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("group_id", groupId)
    .is("deleted_at", null);

  if ((count ?? 0) >= group.max_students) {
    await supabase.from("groups").update({ status: "faol" }).eq("id", groupId);
  }
}

// ------------------------------------------------------------
// STUDENTS
// ------------------------------------------------------------

// Note: the extra unused `_prevState` argument lets this be bound/used
// directly as a React `useFormState` action (which always calls the action
// as `action(prevState, formData)`).
export async function createStudent(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = createClient();

  const mode = String(formData.get("mode") || "individual");
  const full_name = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const phone2 = String(formData.get("phone2") || "").trim();

  if (!full_name || !phone) {
    return fail("Barcha maydonlarni to'ldiring.");
  }

  if (mode === "group") {
    const course_id = String(formData.get("course_id") || "");
    const shift = String(formData.get("shift") || "") as GroupShift;

    if (!course_id) return fail("Kurs aniqlanmadi.");
    if (shift !== "ertalabki" && shift !== "kunduzgi") {
      return fail("Smenani tanlang: ertalabki (오전) yoki kunduzgi (오후).");
    }

    // "0 dan": hali guruh ochilmagan — o'quvchi tanlagan smenasi bo'yicha
    // "kutmoqda" havzasiga qo'shiladi. Guruh faqat qo'ng'iroq qilib,
    // kamida bitta "Kelaman" natijasi olingandan keyin ochiladi.
    const { error } = await supabase.from("students").insert({
      full_name,
      phone,
      phone2: phone2 || null,
      course_id,
      level: 0,
      status: "kutmoqda",
      enrollment_type: "group",
      desired_shift: shift,
    });

    if (error) return fail("O'quvchini saqlashda xatolik yuz berdi.");
  } else {
    // Individual: kurs va daraja bo'yicha, guruhsiz saqlanadi.
    const course_id = String(formData.get("course_id") || "");
    const level = Number(formData.get("level"));

    if (!course_id || Number.isNaN(level)) {
      return fail("Barcha maydonlarni to'ldiring.");
    }

    const status = level === 0 ? "kutmoqda" : "guruh_kutmoqda";

    const { error } = await supabase.from("students").insert({
      full_name,
      phone,
      phone2: phone2 || null,
      course_id,
      level,
      status,
      enrollment_type: "individual",
    });

    if (error) return fail("O'quvchini saqlashda xatolik yuz berdi.");
  }

  revalidatePath("/");
  revalidatePath("/students");
  revalidatePath("/groups");
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
  const phone2 = String(formData.get("phone2") || "").trim();
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

  const updates: Record<string, unknown> = { full_name, phone, phone2: phone2 || null, course_id, level };
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
  await maybeActivateGroup(supabase, groupId);

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

  // "Kelmayman" yoki "Telefonni ko'tarmadi" natijasi chiqsa, o'quvchi
  // avtomatik "O'chirilganlar" bo'limiga o'tkaziladi.
  if (result === "not_coming" || result === "no_answer") {
    await supabase
      .from("students")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", studentId);
    revalidatePath("/students");
    revalidatePath("/deleted");
  }

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
  const shift = String(formData.get("shift") || "") as GroupShift;
  const max_students = Number(formData.get("max_students") || 12);
  const schedule_days = formData.getAll("schedule_days").map(String);
  const studentIds = formData.getAll("student_ids").map(String);

  if (!name || !course_id || Number.isNaN(min_level) || Number.isNaN(max_level)) {
    return fail("Guruh ma'lumotlarini to'liq kiriting.");
  }
  if (shift !== "ertalabki" && shift !== "kunduzgi") {
    return fail("Smenani tanlang: ertalabki (오전) yoki kunduzgi (오후).");
  }

  // Dars vaqti smenaga qarab avtomatik belgilanadi — o'qituvchi aniq
  // soat kiritmaydi, faqat 오전/오후 smenasini tanlaydi.
  const schedule_time = SHIFT_META[shift].startTime;

  const { data: newGroup, error } = await supabase
    .from("groups")
    .insert({
      name,
      course_id,
      min_level,
      max_level,
      teacher_name,
      schedule_time,
      shift,
      schedule_days,
      max_students,
      status: "yigilmoqda",
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
    await maybeActivateGroup(supabase, newGroup.id);
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
  const shift = String(formData.get("shift") || "") as GroupShift;
  const max_students = Number(formData.get("max_students") || 12);
  const schedule_days = formData.getAll("schedule_days").map(String);

  if (shift !== "ertalabki" && shift !== "kunduzgi") {
    return fail("Smenani tanlang: ertalabki (오전) yoki kunduzgi (오후).");
  }
  const schedule_time = SHIFT_META[shift].startTime;

  const { error } = await supabase
    .from("groups")
    .update({ name, teacher_name, schedule_time, shift, max_students, schedule_days })
    .eq("id", groupId);

  if (error) return fail("Guruhni yangilashda xatolik yuz berdi.");

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

// Administrator "yigilmoqda" guruhni to'lmagan holda ham qo'lda ochishi
// (faollashtirishi) mumkin — masalan darslarni to'lguncha kutmasdan
// boshlamoqchi bo'lsa.
export async function openGroupManually(groupId: string): Promise<ActionResult> {
  const supabase = createClient();

  const { error } = await supabase
    .from("groups")
    .update({ status: "faol" })
    .eq("id", groupId)
    .eq("status", "yigilmoqda");

  if (error) return fail("Guruhni ochishda xatolik yuz berdi.");

  revalidatePath("/groups");
  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/");
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
