import { createClient } from "@supabase/supabase-js";
import {
  Quote,
  QuotesApiResponse,
  Category,
  AffirmationsApiResponse,
} from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getQuotes(): Promise<Quote[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Missing Supabase environment variables. Please check your .env.local file."
    );
    return [];
  }

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }

  return data || [];
}

export async function getQuotesPaginated(
  limit: number = 25,
  offset: number = 0,
  search?: string,
  categoryId?: number | null,
  qcategory?: string | null,
  random: boolean = false,
  randomSeed?: number
): Promise<QuotesApiResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    if (categoryId !== null && categoryId !== undefined) {
      params.append("categoryId", categoryId.toString());
    }

    if (qcategory) {
      params.append("qcategory", qcategory);
    }

    if (random) {
      params.append("random", "true");
      if (randomSeed !== undefined) {
        params.append("randomSeed", randomSeed.toString());
      }
    }

    const response = await fetch(`/api/quotes?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch quotes");
    }

    const data: QuotesApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching paginated quotes:", error);
    return { quotes: [], hasMore: false };
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories");

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getAffirmationsPaginated(
  limit: number = 25,
  offset: number = 0,
  search?: string,
  icategoryName?: string | null,
  random: boolean = false,
  randomSeed?: number
): Promise<AffirmationsApiResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    if (icategoryName) {
      params.append("icategory", icategoryName);
    }

    if (random) {
      params.append("random", "true");
      if (randomSeed !== undefined) {
        params.append("randomSeed", randomSeed.toString());
      }
    }

    const response = await fetch(`/api/affirmations?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to fetch affirmations");
    }

    const data: AffirmationsApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching affirmations:", error);
    return { affirmations: [], hasMore: false };
  }
}

