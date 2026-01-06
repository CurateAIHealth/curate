'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">
          Something went wrong
        </h2>

        <p className="text-gray-600">{error.message}</p>

        <button
          onClick={reset}
          className="px-4 py-2 bg-teal-600 text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
