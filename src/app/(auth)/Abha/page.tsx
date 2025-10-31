'use client'
import axios from "axios";
import { useState } from "react";
interface AbhaUser {
  abhaNumber: string;
  name: string;
  gender?: string;
  dateOfBirth?: string;
  [key: string]: any;
}
export default function Home() {
  const [abhaNumber, setAbhaNumber] = useState("");
  const [details, setDetails] = useState(null);

  const fetchDetails = async () => {
    const response:any = await axios.get<AbhaUser>(
        `/api/getAbhaUser?abhaNumber=${abhaNumber}`
      );

    setDetails(response);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Fetch ABHA Information (Ayushman Bharat)
      </h1>

      <input
        className="border p-2 rounded mr-2"
        type="text"
        placeholder="Enter ABHA Number"
        value={abhaNumber}
        onChange={(e) => setAbhaNumber(e.target.value)}
      />
      <button
        onClick={fetchDetails}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Get Details
      </button>

      {details && (
        <pre className="mt-6 p-4 bg-gray-100 rounded">
          {JSON.stringify(details, null, 2)}
        </pre>
      )}
    </div>
  );
}