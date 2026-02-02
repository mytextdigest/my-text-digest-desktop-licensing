import Link from "next/link";

export default function SubscribeSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Subscription activated 🎉</h1>
        <p className="text-gray-600 mb-6">
          Your desktop license is now active. You can start using My Text Digest
          Desktop.
        </p>

        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
