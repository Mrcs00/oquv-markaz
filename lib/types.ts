export type StudentStatus = "kutmoqda" | "guruh_kutmoqda" | "faol";
export type CallResultValue = "coming" | "no_answer" | "not_coming" | "call_later";
export type GroupStatus = "faol" | "yopiq";

export interface Course {
  id: string;
  name: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  course_id: string;
  min_level: number;
  max_level: number;
  teacher_name: string;
  schedule_days: string[];
  schedule_time: string;
  max_students: number;
  status: GroupStatus;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  phone: string;
  phone2: string | null;
  course_id: string;
  level: number;
  group_id: string | null;
  status: StudentStatus;
  enrollment_type: "individual" | "group";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CallResult {
  id: string;
  student_id: string;
  result: CallResultValue;
  note: string;
  created_at: string;
  updated_at: string;
}

// Joined shapes used across the UI
export interface StudentWithRelations extends Student {
  course: Course | null;
  group: Group | null;
  call_result: CallResult | null;
}

export interface GroupWithRelations extends Group {
  course: Course | null;
  students: Student[];
}

// Minimal hand-written Database type for supabase-js generics.
// Regenerate with `supabase gen types typescript` once the project is linked
// if you want fully strict types.
export interface Database {
  public: {
    Tables: {
      courses: {
        Row: Course;
        Insert: Partial<Course> & { name: string };
        Update: Partial<Course>;
      };
      groups: {
        Row: Group;
        Insert: Partial<Group> & {
          name: string;
          course_id: string;
          min_level: number;
          max_level: number;
        };
        Update: Partial<Group>;
      };
      students: {
        Row: Student;
        Insert: Partial<Student> & {
          full_name: string;
          phone: string;
          course_id: string;
          level: number;
        };
        Update: Partial<Student>;
      };
      call_results: {
        Row: CallResult;
        Insert: Partial<CallResult> & { student_id: string; result: CallResultValue };
        Update: Partial<CallResult>;
      };
    };
  };
}
