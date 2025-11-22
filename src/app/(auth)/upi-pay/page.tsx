"use client";


import { useEffect } from "react";

export default function UpiRedirect() {
  useEffect(() => {
    
    const params = new URLSearchParams(window.location.search);
    const amount = params.get("amount") || "0";

    const upiURL = `upi://pay?pa=curateservices@ucobank&pn=Curate%20Health%20Services&am=${amount}&cu=INR`;


    window.location.href = upiURL;

    setTimeout(() => {
      document.getElementById("fallback")?.classList.remove("hidden");
    }, 2000);
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "Segoe UI" }}>
      <h2 style={{ marginBottom: 10 }}>Redirecting to UPI Payment…</h2>
      <p style={{ color: "#555" }}>
        Please wait while we open your UPI app (PhonePe, Google Pay, Paytm).
      </p>

      <div id="fallback" className="hidden" style={{ marginTop: 30 }}>
        <h3>Unable to open UPI App?</h3>
        <p>Click the link below to retry:</p>
        <a
          style={{ color: "blue", textDecoration: "underline" }}
          href={`upi://pay?pa=curateservices@ucobank&pn=Curate%20Health%20Services`}
        >
          Retry UPI Payment
        </a>
      </div>
    </div>
  );
}
