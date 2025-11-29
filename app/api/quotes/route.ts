import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Quote } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: "Missing Supabase environment variables" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "25", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId");
  const random = searchParams.get("random") === "true";
  const randomSeedParam = searchParams.get("randomSeed");
  const qcategoryParam = searchParams.get("qcategory");
  const qcategory =
    qcategoryParam && qcategoryParam.trim().length > 0
      ? qcategoryParam.trim()
      : null;
  const parsedSeed = randomSeedParam ? parseInt(randomSeedParam, 10) : NaN;
  const randomSeed = Number.isFinite(parsedSeed) ? parsedSeed : Date.now();

  const categoryIdNum =
    categoryId && !isNaN(parseInt(categoryId, 10))
      ? parseInt(categoryId, 10)
      : null;

  try {
    if (random) {
      return await handleRandomQuotes({
        supabase,
        search,
        categoryId: categoryIdNum,
        qcategory,
        limit,
        offset,
        randomSeed,
      });
    }

    // Build the query
    let query = supabase
      .from("quotes")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    query = applyFilters(query, {
      search,
      categoryId: categoryIdNum,
      qcategory,
    });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching quotes:", error);
      return NextResponse.json(
        { error: "Failed to fetch quotes" },
        { status: 500 }
      );
    }

    const quotes = (data as Quote[]) || [];
    const hasMore = count ? offset + limit < count : false;

    return NextResponse.json({
      quotes,
      hasMore,
      total: count,
    });
  } catch (error) {
    console.error("Error in quotes API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

type DefaultSupabaseClient = SupabaseClient<any, "public", any>;

function applyFilters(
  query: any,
  options: { search: string; categoryId: number | null; qcategory: string | null }
) {
  const { search, categoryId, qcategory } = options;
  let updatedQuery = query;

  if (search) {
    updatedQuery = updatedQuery.or(
      `quotetext.ilike.%${search}%,author.ilike.%${search}%`
    );
  }

  if (categoryId !== null) {
    updatedQuery = updatedQuery.eq("categoryid", categoryId);
  }

  if (qcategory) {
    updatedQuery = updatedQuery.eq("qcategory", qcategory);
  }

  return updatedQuery;
}

async function handleRandomQuotes({
  supabase,
  search,
  categoryId,
  qcategory,
  limit,
  offset,
  randomSeed,
}: {
  supabase: DefaultSupabaseClient;
  search: string;
  categoryId: number | null;
  qcategory: string | null;
  limit: number;
  offset: number;
  randomSeed: number;
}) {
  let idQuery = supabase
    .from("quotes")
    .select("quoteid")
    .eq("is_active", true);

  idQuery = applyFilters(idQuery, { search, categoryId, qcategory });

  const { data: idData, error: idError } = await idQuery;

  if (idError) {
    console.error("Error fetching quote IDs:", idError);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }

  const allIds = (idData || []).map(
    (row: { quoteid: number }) => row.quoteid
  );

  if (allIds.length === 0) {
    return NextResponse.json({
      quotes: [],
      hasMore: false,
      total: 0,
    });
  }

  const shuffledIds = shuffleWithSeed(allIds, randomSeed);
  const selectedIds = shuffledIds.slice(offset, offset + limit);

  if (selectedIds.length === 0) {
    return NextResponse.json({
      quotes: [],
      hasMore: false,
      total: allIds.length,
    });
  }

  const { data: quoteData, error: quoteError } = await supabase
    .from("quotes")
    .select("*")
    .in("quoteid", selectedIds);

  if (quoteError) {
    console.error("Error fetching random quotes:", quoteError);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }

  const quoteMap = new Map<number, Quote>();
  (quoteData as Quote[]).forEach((quote) => {
    quoteMap.set(quote.quoteid, quote);
  });

  const quotes = selectedIds
    .map((id) => quoteMap.get(id))
    .filter((quote): quote is Quote => Boolean(quote));

  const hasMore = offset + limit < allIds.length;

  return NextResponse.json({
    quotes,
    hasMore,
    total: allIds.length,
  });
}

function shuffleWithSeed<T>(array: T[], seed: number): T[] {
  const normalizedSeed = normalizeSeed(seed);
  const random = mulberry32(normalizedSeed);
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) {
    return Date.now() >>> 0;
  }
  return seed >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

