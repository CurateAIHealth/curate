'use client';
import { Mail, Phone } from 'lucide-react';
import React from 'react';

const ContactSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-sky-50 to-white py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

     
      <div className="bg-white/90 backdrop-blur-lg p-6 md:p-8 rounded-2xl h-auto min-h-[320px] shadow-xl border border-gray-100 flex flex-col justify-between">
  
  
  <div>
    <h2 className="text-2xl md:text-3xl font-bold text-white px-4 py-2 rounded-lg inline-block mb-4 bg-[#ff1493]">
      Get in Touch
    </h2>

    <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
      We’re here to assist you. Reach out via the form below or visit us at our location.
    </p>

   
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm text-gray-700">
        <Mail size={18} className="text-[#ff1493]" />
        <span>info@curatehealth.in</span>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-700">
        <Phone size={18} className="text-[#ff1493]" />
        <span>+91 73860 45569</span>
      </div>
    </div>
  </div>


  <div className="mt-6 pt-4 border-t border-gray-200 text-gray-700 text-sm leading-relaxed">
    <strong className="block mb-1">Curate Health Services LLP</strong>
    H. No. 2-117/7-53, Anagha Datta Nilayam,<br />
    2-117/3, Manikonda Road,<br />
    Behind Preetham Hospital, OU Colony,<br />
    Shaikpet, Hyderabad, Telangana – 500104
  </div>
</div>


  
      <div className="w-full h-[420px]">
  <iframe
    title="Curate Health Services Map"
    src="https://www.google.com/maps?q=H+No+2-117/7-53,+Anagha+Datta+Nilayam,+Manikonda+Road,+OUColony,+Shaikpet,+Hyderabad,+Telangana+500104&output=embed"
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