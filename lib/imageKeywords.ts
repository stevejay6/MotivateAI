/**
 * Custom Keyword Mapping for Pexels Image Search
 * 
 * This file contains customizable keyword mappings for fetching nature images.
 * You can easily modify the keywords array or add category-based mappings
 * to get better image results from Pexels.
 * 
 * To customize:
 * 1. Modify the `natureKeywords` array below with your preferred search terms
 * 2. Use more specific, evocative terms for better results (e.g., "tropical beach sunset" instead of "beach")
 * 3. Optionally implement category-based keyword mapping using `getKeywordByCategory()`
 */

/**
 * Enhanced nature keywords with more specific, evocative terms
 * These keywords are used to search Pexels for background images
 */
export const natureKeywords = [
  "tropical beach sunset",
  "misty forest path",
  "dramatic mountain landscape",
  "tranquil lake reflection",
  "serene waterfall mist",
  "peaceful meadow wildflowers",
  "golden hour sunset clouds",
  "majestic mountain peaks",
  "calm ocean waves",
  "sunlight through trees",
  "mountain lake sunrise",
  "desert landscape sunset",
  "coastal cliff ocean",
  "autumn forest path",
  "mountain stream waterfall",
  "sunset over water",
  "green forest canopy",
  "rocky mountain vista",
  "peaceful countryside",
  "tropical paradise beach",
  "mountain valley mist",
  "lake mountain reflection",
  "coastal sunrise horizon",
  "forest floor sunlight",
  "mountain peak clouds",
  "serene lake morning",
  "tropical island beach",
  "mountain range sunset",
  "peaceful river bend",
  "wildflower meadow spring",
];

/**
 * Get a keyword for a specific quote ID
 * Uses modulo to consistently assign the same keyword to the same quote
 * 
 * @param quoteId - The quote ID to get a keyword for
 * @returns A nature keyword string
 */
export function getKeywordByQuoteId(quoteId: number): string {
  return natureKeywords[quoteId % natureKeywords.length];
}

/**
 * Optional: Get keyword based on category ID
 * This allows different categories to have different image themes
 * 
 * @param categoryId - The category ID
 * @param quoteId - The quote ID (used as fallback)
 * @returns A nature keyword string
 */
export function getKeywordByCategory(
  categoryId: number,
  quoteId: number
): string {
  // Example category-based mapping (customize as needed)
  // You can map specific categories to specific image themes
  const categoryKeywordMap: Record<number, string[]> = {
    // Example: Category 1 gets beach/ocean themes
    // 1: ["tropical beach sunset", "calm ocean waves", "coastal sunrise horizon"],
    // Example: Category 2 gets mountain themes
    // 2: ["dramatic mountain landscape", "mountain lake sunrise", "mountain range sunset"],
  };

  const categoryKeywords = categoryKeywordMap[categoryId];
  
  if (categoryKeywords && categoryKeywords.length > 0) {
    // Use quoteId to consistently select from category-specific keywords
    return categoryKeywords[quoteId % categoryKeywords.length];
  }

  // Fallback to default keyword selection
  return getKeywordByQuoteId(quoteId);
}

/**
 * Get all available keywords (useful for debugging or UI)
 */
export function getAllKeywords(): string[] {
  return [...natureKeywords];
}

