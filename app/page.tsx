import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Quotes Discovery
        </h1>
        <Link
          href="/quotes"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        >
          Explore Quotes
        </Link>
      </div>
    </main>
  );
}

