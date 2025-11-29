# Quotes Discovery

A clean and modern quotes discovery page built with Next.js, Tailwind CSS, and Supabase.

## Features

- 🔍 Search functionality to find quotes by text or author
- 🏷️ Category filtering with interactive chips (filtered by categoryid)
- 🎨 Beautiful nature background images from Pexels on each quote card
- 📱 Responsive one-column layout
- ⚡ Fast and efficient filtering with pagination
- ✅ Only displays active quotes (`is_active = true`)
- 🎲 Random quote selection when "All" category is selected

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Add your Supabase credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Configure Pexels API (for Background Images)

1. Get a free API key from [Pexels](https://www.pexels.com/api/):
   - Sign up for a free account at https://www.pexels.com/
   - Navigate to https://www.pexels.com/api/
   - Create a new application
   - Copy your API key

2. Add your Pexels API key to `.env.local`:
   ```
   PEXELS_API_KEY=your_pexels_api_key
   ```

   **Note:** If you don't configure Pexels API key, quote cards will use beautiful gradient fallback backgrounds instead of nature photos.

### 4. Database Schema

The application works with your existing `quotes` table structure:
- `quoteid` (integer, primary key)
- `categoryid` (integer, foreign key)
- `subcategoryid` (integer, foreign key)
- `quotetext` (text)
- `author` (varchar(100), nullable)
- `is_active` (boolean) - only active quotes are displayed
- Other fields: `created_at`, `updated_at`, `likes_count`, `flag_count`, etc.

### 5. Category Mapping (Optional)

To display category names instead of "Category {id}", update the `categoryIdToName` object in `lib/types.ts`:

```typescript
export const categoryIdToName: Record<number, string> = {
  1: "Growth",
  2: "Wellness",
  3: "Love",
  // ... add your categoryid mappings
};
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── api/
│   │   ├── quotes/        # Quotes API endpoint with pagination
│   │   ├── categories/    # Categories API endpoint
│   │   └── images/        # Pexels image proxy endpoint
│   └── quotes/
│       └── page.tsx        # Main quotes discovery page
├── components/
│   ├── QuoteCard.tsx       # Individual quote card component
│   ├── CategoryChips.tsx   # Category filter chips
│   └── SearchBar.tsx       # Search input component
├── lib/
│   ├── supabase.ts         # Supabase client configuration
│   └── types.ts            # TypeScript type definitions
└── .env.local              # Environment variables (not in git)
```

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend database and API
- **Pexels API** - High-quality nature background images

## Notes

- The application filters quotes by `categoryid` (not subcategoryid)
- Only quotes where `is_active = true` are displayed
- Category chips are dynamically generated based on available categoryids in your quotes
- You can customize category names by updating the `categoryIdToName` mapping in `lib/types.ts`

