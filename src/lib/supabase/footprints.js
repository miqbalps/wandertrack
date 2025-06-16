// lib/supabase/footprints.js
import { createClient } from "./client";

/**
 * Get all footprints for a specific user
 */
export async function getUserFootprints(userId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("footprints")
    .select(
      `
      *,
      trips (
        id,
        title
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user footprints:", error);
    throw error;
  }

  return data;
}

/**
 * Get public footprints
 */
export async function getPublicFootprints(limit = 50) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("footprints")
    .select(
      `
      *,
      trips (
        id,
        title
      )
    `
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching public footprints:", error);
    throw error;
  }

  return data;
}

/**
 * Get footprints by trip ID
 */
export async function getFootprintsByTrip(tripId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("footprints")
    .select("*")
    .eq("trip_id", tripId)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching footprints by trip:", error);
    throw error;
  }

  return data;
}

/**
 * Get single footprint by ID
 */
export async function getFootprintById(footprintId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("footprints")
    .select(
      `
      *,
      trips (
        id,
        title
      )
    `
    )
    .eq("id", footprintId)
    .single();

  if (error) {
    console.error("Error fetching footprint:", error);
    throw error;
  }

  return data;
}

/**
 * Create new footprint
 */
export async function createFootprint(footprintData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("footprints")
    .insert([footprintData])
    .select()
    .single();

  if (error) {
    console.error("Error creating footprint:", error);
    throw error;
  }

  return data;
}

/**
 * Update footprint
 */
export async function updateFootprint(footprintId, updates) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("footprints")
    .update(updates)
    .eq("id", footprintId)
    .select()
    .single();

  if (error) {
    console.error("Error updating footprint:", error);
    throw error;
  }

  return data;
}
