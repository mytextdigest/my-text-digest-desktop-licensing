import Link from "next/link";

export default function SubscribeCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center p-6 border rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Checkout canceled</h1>
        <p className="text-gray-600 mb-6">
          No worries — you haven’t been charged. You can try again anytime.
        </p>

        <Link
          href="/subscribe"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md"
        >
          Back to pricing
        </Link>
      </div>
    </div>
  );
}
