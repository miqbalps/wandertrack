import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL or Anon Key is missing. Please check your environment variables."
  );
}

// Export the supabase client instance directly
// export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Export a function to get the session using the exported supabase client
export const getSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
