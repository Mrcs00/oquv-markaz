import { createBrowserClient } from "@supabase/ssr";

// Hand-written types in lib/types.ts are used across the app instead of the
// supabase-js generic parameter, to keep query builder inference simple.
// Once the project is linked, you can run `supabase gen types typescript`
// and wire the generated Database type back in here if you want stricter
// query-level typing.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
