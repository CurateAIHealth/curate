'use client';

export default function GlobalError({ error, reset }: any) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-xl font-bold mb-2">
            Something went wrong
          </h2>

          <p className="text-gray-600 mb-4">
            Please refresh the page
          </p>

          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-teal-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  );
}
