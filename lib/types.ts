export interface Quote {
  quoteid: number;
  categoryid: number;
  subcategoryid: number;
  quotetext: string;
  author: string | null;
  created_at: string;
  updated_at: string;
  likes_count: number;
  flag_count: number;
  rand: number;
  quotenumber: number | null;
  tags: string | null;
  is_active: boolean;
}

export interface Category {
  categoryid: number;
  categoryname: string;
  created_at?: string;
  calltype?: string | null;
  CategoryIDString?: string | null;
}

export interface QuotesApiResponse {
  quotes: Quote[];
  hasMore: boolean;
  total?: number;
}

// Category mapping structure - populated dynamically from API
export const categoryIdToName: Record<number, string> = {};

// Helper function to get category name or fallback to categoryid
export function getCategoryName(categoryid: number): string {
  return categoryIdToName[categoryid] || `Category ${categoryid}`;
}

// Category IDs for the 8 categories mentioned (user will need to map these)
// These are placeholder values - user should update based on their actual categoryid values
export const categoryIds = {
  growth: null as number | null,
  wellness: null as number | null,
  love: null as number | null,
  relationships: null as number | null,
  gratitude: null as number | null,
  reflection: null as number | null,
  creativity: null as number | null,
  challenge: null as number | null,
};

