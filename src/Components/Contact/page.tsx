'use client';
import React from 'react';

const ContactSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-sky-50 to-white py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

     
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl h-[320px]  shadow-xl border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-white p-2 rounded-md w-[250px] mb-4 bg-[#ff1493]">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We’re here to assist you. Reach out via the form below or visit us at our location.
          </p>

         

        
          <div className="mt-8 text-gray-700 text-sm leading-relaxed">
            <strong>Curate Health Services LLP</strong><br />
            Plot – 45, Street Number 14,<br />
            Puppalaguda Road, opp. Gem motors Maruti Suzuki,<br />
            Manikonda, Hyderabad, Telangana 500089
          </div>
        </div>

  
        <div className="w-full h-[320px]">
          <iframe
            title="Curate Health Services Map"
            src="https://www.google.com/maps?q=Curate+Health+Services+LLP,+Plot+45,+Street+Number+14,+Puppalaguda+Road,+Hyderabad,+Telangana+500089&output=embed"
            className="w-full h-full rounded-2xl shadow-xl border border-gray-200"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;