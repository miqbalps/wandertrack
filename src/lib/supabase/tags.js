import { createClient } from "@/lib/supabase/client";

export async function getAllTags() {
  const supabase = createClient();
  const { data, error } = await supabase.from("tags").select("*").order("name");

  if (error) throw error;
  return data;
}

export async function createTag(name) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tags")
    .insert([
      {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating tag:", error);
    throw error;
  }

  return data;
}

export async function updateTag({ id, name, slug }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tags")
    .update({ name, slug })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
export async function deleteTag(id) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
