import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { YouAffirmation } from "@/lib/types";

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
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "25", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const search = searchParams.get("search") || "";
  const categoryParam = searchParams.get("icategory");
  const icategoryName =
    categoryParam && categoryParam.trim().length > 0
      ? categoryParam.trim()
      : null;
  const random = searchParams.get("random") === "true";
  const randomSeedParam = searchParams.get("randomSeed");
  const parsedSeed = randomSeedParam ? parseInt(randomSeedParam, 10) : NaN;
  const randomSeed = Number.isFinite(parsedSeed) ? parsedSeed : Date.now();

  try {
    if (random) {
      return await handleRandomAffirmations({
        supabase,
        search,
        icategoryName,
        limit,
        offset,
        randomSeed,
      });
    }

    let query = supabase
      .from("u_affirmations_view")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    query = applyAffirmationFilters(query, { search, icategoryName });
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error("Error fetching you-affirmations:", error);
      return NextResponse.json(
        { error: "Failed to fetch affirmations" },
        { status: 500 }
      );
    }

    const affirmations = (data as YouAffirmation[]) || [];
    const hasMore = count ? offset + limit < count : false;

    return NextResponse.json({
      affirmations,
      hasMore,
      total: count,
    });
  } catch (error) {
    console.error("Error in you-affirmations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

type DefaultSupabaseClient = SupabaseClient<any, "public", any>;

function applyAffirmationFilters(
  query: any,
  options: { search: string; icategoryName: string | null }
) {
  const { search, icategoryName } = options;
  let updatedQuery = query;

  if (search) {
    updatedQuery = updatedQuery.ilike("quotetext", `%${search}%`);
  }

  if (icategoryName) {
    updatedQuery = updatedQuery.eq("ucategoryname", icategoryName);
  }

  return updatedQuery;
}

async function handleRandomAffirmations({
  supabase,
  search,
  icategoryName,
  limit,
  offset,
  randomSeed,
}: {
  supabase: DefaultSupabaseClient;
  search: string;
  icategoryName: string | null;
  limit: number;
  offset: number;
  randomSeed: number;
}) {
  let idQuery = supabase
    .from("u_affirmations_view")
    .select("uaffid")
    .order("created_at", { ascending: false });

  idQuery = applyAffirmationFilters(idQuery, { search, icategoryName });

  const { data: idData, error: idError } = await idQuery;

  if (idError) {
    console.error("Error fetching you-affirmation IDs:", idError);
    return NextResponse.json(
      { error: "Failed to fetch affirmations" },
      { status: 500 }
    );
  }

  const allIds = (idData || []).map((row: { uaffid: number }) => row.uaffid);

  if (allIds.length === 0) {
    return NextResponse.json({
      affirmations: [],
      hasMore: false,
      total: 0,
    });
  }

  const shuffledIds = shuffleWithSeed(allIds, randomSeed);
  const selectedIds = shuffledIds.slice(offset, offset + limit);

  if (selectedIds.length === 0) {
    return NextResponse.json({
      affirmations: [],
      hasMore: false,
      total: allIds.length,
    });
  }

  const { data: affirmationData, error: affirmationError } = await supabase
    .from("u_affirmations_view")
    .select("*")
    .in("uaffid", selectedIds);

  if (affirmationError) {
    console.error("Error fetching random you-affirmations:", affirmationError);
    return NextResponse.json(
      { error: "Failed to fetch affirmations" },
      { status: 500 }
    );
  }

  const affirmationMap = new Map<number, YouAffirmation>();
  (affirmationData as YouAffirmation[]).forEach((affirmation) => {
    affirmationMap.set(affirmation.uaffid, affirmation);
  });

  const affirmations = selectedIds
    .map((id) => affirmationMap.get(id))
    .filter(
      (affirmation): affirmation is YouAffirmation => Boolean(affirmation)
    );

  const hasMore = offset + limit < allIds.length;

  return NextResponse.json({
    affirmations,
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


