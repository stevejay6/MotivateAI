import { supabase } from "./supabase";
import { Quote } from "../components/QuoteCard";
import { Affirmation } from "../components/AffirmationCard";

export async function fetchQuotes(options: {
  search?: string;
  qcategory?: string | null;
  limit?: number;
}): Promise<Quote[]> {
  if (!supabase) return [];

  const limit = options.limit ?? 30;
  let query = supabase
    .from("quotes")
    .select("*")
    .eq("is_active", true)
    .limit(limit)
    .order("created_at", { ascending: false });

  if (options.qcategory) {
    query = query.eq("qcategory", options.qcategory);
  }

  if (options.search) {
    query = query.or(
      `quotetext.ilike.%${options.search}%,author.ilike.%${options.search}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("fetchQuotes", error);
    return [];
  }

  return (data as Quote[]) ?? [];
}

export async function fetchAffirmations(options: {
  search?: string;
  category?: string | null;
  limit?: number;
}): Promise<Affirmation[]> {
  if (!supabase) return [];

  const limit = options.limit ?? 30;
  let query = supabase
    .from("i_affirmations_view")
    .select("*")
    .limit(limit)
    .order("created_at", { ascending: false });

  if (options.category) {
    query = query.eq("icategoryname", options.category);
  }

  if (options.search) {
    query = query.ilike("quotetext", `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("fetchAffirmations", error);
    return [];
  }

  return (data as Affirmation[]) ?? [];
}

