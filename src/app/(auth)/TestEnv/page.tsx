
"use client";

import { useState } from "react";

const TestData = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState("hospitals");

  const TestGemini = async () => {
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "Explain CurateAIHealth in two sentences.",
        }),
      });

      const data = await response.json();

      console.log("Gemini Response:", data);
    } catch (error) {
      console.error("Gemini Error:", error);
    }
  };



  const categories = [
    { label: "Hospitals", value: "hospitals" },
    { label: "Clinics", value: "clinics" },
    { label: "Nursing Homes", value: "nursing_homes" },
    { label: "Home Healthcare", value: "home_healthcare" },
    { label: "Senior Care", value: "senior_care" },
    {
      label: "Physiotherapy & Rehab",
      value: "physiotherapy_rehab",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            CurateAIHealth – AI Lead Finder
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Discover Hyderabad healthcare businesses and
            qualify them using Gemini AI.
          </p>
        </div>

        {/* Gemini Test */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">
            Gemini Integration
          </h2>

          <button
            type="button"
            onClick={TestGemini}
            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Test Gemini
          </button>
        </div>

        {/* Qualification Test */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold text-slate-800">
            Lead Qualification Test
          </h2>

       
        </div>

        {/* Automatic Discovery */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Hyderabad Business Discovery
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a category to discover businesses
              and generate Gemini lead scores.
            </p>
          </div>

     

          {loading && (
            <div className="mt-5 flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              Discovering businesses and analyzing with Gemini...
            </div>
          )}

          <p className="mt-4 text-xs text-slate-400">
            Results are currently displayed in the browser
            console. No leads are saved to MongoDB.
          </p>
        </div>

      </div>
    </div>
  );
};

export default TestData;