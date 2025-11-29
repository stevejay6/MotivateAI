import { NextRequest, NextResponse } from "next/server";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";

export async function GET(request: NextRequest) {
  if (!PEXELS_API_KEY) {
    return NextResponse.json(
      { error: "Pexels API key not configured" },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get("keyword") || "nature";
  const quoteId = searchParams.get("quoteid");

  try {
    // Fetch popular, high-quality images
    // Sort by popularity to get better quality results
    const perPage = 30; // Get top 30 results (high quality)
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      keyword
    )}&per_page=${perPage}&orientation=landscape&sort=popular`;

    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error("Pexels API error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch image from Pexels" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      return NextResponse.json(
        { error: "No images found" },
        { status: 404 }
      );
    }

    // Prioritize top results (first 20-25) for better quality
    // Use quoteid to consistently select the same image for the same quote
    const topResults = Math.min(25, data.photos.length); // Use top 25 results
    const photoIndex = quoteId
      ? parseInt(quoteId, 10) % topResults
      : Math.floor(Math.random() * topResults);

    const selectedPhoto = data.photos[photoIndex];

    // Return the large image URL (good quality for backgrounds)
    return NextResponse.json({
      imageUrl: selectedPhoto.src.large2x || selectedPhoto.src.large,
      photographer: selectedPhoto.photographer,
      photographerUrl: selectedPhoto.photographer_url,
    });
  } catch (error) {
    console.error("Error fetching Pexels image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

