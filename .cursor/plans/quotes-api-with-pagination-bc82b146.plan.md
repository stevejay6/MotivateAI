<!-- bc82b146-872b-4cd1-bbff-d24f1e28bf9b 13718f93-71ee-4182-89bf-fad16982425d -->
# Display qcategoryname on Quote Cards

## Overview

Ensure quotes returned from Supabase expose their stored `qcategoryname` text and update the UI to render this value instead of the generic `Category {id}` placeholder. Fall back to the existing category mapping only if the quote lacks `qcategoryname`.

## Implementation Steps

### 1. Extend Quote Type (`lib/types.ts`)

- Add an optional `qcategoryname?: string | null` property to the `Quote` interface so API responses can include it.
- Keep other interfaces untouched.

### 2. Validate API Output (`app/api/quotes/route.ts`)

- Because the route already does `select("*")`, the `qcategoryname` column will automatically be returned once typed.
- No query changes needed, but ensure TypeScript sees the new field by reusing the updated interface.

### 3. Render qcategoryname in QuoteCard (`components/QuoteCard.tsx`)

- Update the badge text to use `quote.qcategoryname` when present.
- Keep `getCategoryName(quote.categoryid)` as a fallback if `qcategoryname` is null/empty.
- No other visual changes required.

## Files to Modify

- `lib/types.ts`
- `components/QuoteCard.tsx`
- (Implicitly `app/api/quotes/route.ts` benefits from the updated type)