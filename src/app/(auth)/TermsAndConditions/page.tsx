'use client';

import Logo from '@/Components/Logo/page';
import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto text-justify leading-7 text-gray-800 bg-white shadow-md rounded-xl">
        <Logo/>
      <h1 className="text-2xl font-bold text-center mb-6">Terms and Conditions</h1>

      <section className="space-y-4">
        <p>
          This agreement (“Healthcare Professional Service Contract”) is made between <strong>Curate Health Services LLP</strong>, located at
          H.No. 15/100030, Plot No. 4, Brindhavanam Colony, Beeramguda, Sangareddy, Telangana - 502032 (“Curate Health”) and
          the individual contractor (“Healthcare Professional”).
        </p>

        <h2 className="text-xl font-semibold">1. Background</h2>
        <p>
          Curate Health connects qualified Healthcare Professionals with clients in need of home care services. Contractors agree to provide
          these services based on a mutual agreement and are responsible for submitting accurate identification and qualification documents.
        </p>

        <h2 className="text-xl font-semibold">2. Agreement Terms</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Agreement is effective from the date signed and continues until terminated with two weeks’ notice by either party.</li>
          <li>Contractors must stay on-site if the service demands and must notify managers before leaving client premises.</li>
          <li>Confidential client information must be protected during and after contract termination.</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Payment Terms</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Invoices are issued monthly, due within 7 days. Late fees of ₹500/day apply post due date.</li>
          <li>Annual fee increment of 10% may apply.</li>
          <li>Payments may be made via bank transfer, cheque, or prepaid cash cards.</li>
          <li>Curate Health may deduct accommodation fees or taxes as agreed.</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Leaves and Replacement</h2>
        <p>
          Leaves must be approved in advance. Emergency or sick leaves will be managed per labor laws. Curate Health will attempt to provide a
          replacement in such cases.
        </p>

        <h2 className="text-xl font-semibold">5. Confidentiality & Data Use</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Contractors agree to background checks and allow use of their data for verification and promotional material.</li>
          <li>Biometric data may be stored securely for legal liability.</li>
        </ul>

        <h2 className="text-xl font-semibold">6. Termination & Breach</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Service can be terminated by either party with written notice (5-15 days depending on role).</li>
          <li>Unnotified exit or misconduct may incur a compensation fee of ₹50,000.</li>
          <li>Repeated absence or unacceptable behavior (drugs, alcohol, etc.) can lead to immediate termination.</li>
        </ul>

        <h2 className="text-xl font-semibold">7. Legal & Dispute Resolution</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>All disputes will be resolved under Telangana law.</li>
          <li>Jurisdiction is limited to Hyderabad courts only.</li>
          <li>Force majeure events (natural disaster, war, etc.) are acknowledged as valid for service disruption.</li>
        </ul>

        <h2 className="text-xl font-semibold">8. Non-Solicitation & Liability</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Clients cannot hire healthcare professionals directly for 12 months post-contract termination.</li>
          <li>Curate Health is not liable for any theft or disputes arising at the client’s place.</li>
        </ul>

        <h2 className="text-xl font-semibold">9. Final Declaration</h2>
        <p>
          By enabling the CheckBox, the Contractor and Client acknowledge that they have read, understood, and voluntarily accepted all
          terms and conditions outlined above.
        </p>
      </section>

     
    </div>
  );
};

export default TermsAndConditions;