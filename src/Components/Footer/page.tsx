
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function ModernFooter() {
  return (
    <footer className="bg-teal-500 py-10 px-6 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-10 relative">
     
        <section className="flex-1 flex flex-col justify-between">
          <div>
            <img src="Icons/HomeIcon.png"
              alt="Brand Logo"
              className="w-20 h-20 md:w-40 md:h-40 object-contain mb-2 rounded-xl  p-2"
            />
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Curate<span className="text-indigo-200">Health</span></h2>
            <p className="text-md text-teal-50 mb-8">
              Experience truly personal, at-home healthcare with our trusted professionals.
            </p>
          </div>
        
        
        </section>
     
  <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-6 w-[280px] flex flex-col gap-4">
  
  {/* Title */}
  <span className="text-sm text-center font-semibold tracking-wide text-[#ff1493] uppercase">
    Talk to us
  </span>

  {/* Contact Info */}
  <div className="flex flex-col gap-3 text-sm text-gray-700">
    <div className="flex gap-3 items-center">
      <Mail size={18} className="text-[#ff1493]" />
      <span>info@curatehealth.in</span>
    </div>

    <div className="flex gap-3 items-center">
      <Phone size={18} className="text-[#ff1493]" />
      <span>+91 73860 45569</span>
    </div>

    <div className="flex gap-3 items-start">
      <MapPin size={18} className="text-[#ff1493] mt-1" />
      <span className="leading-relaxed">
        H. No. 2-117/7-53, Anagha Datta Nilayam,<br />
        2-117/3, Manikonda Road,<br />
        Behind Preetham Hospital, OU Colony,<br />
        Shaikpet, Hyderabad, Telangana – 500104
      </span>
    </div>
  </div>
</div>


      
        <section className="flex-1 flex flex-col md:items-end md:text-right">
          <nav className="mb-6">
            <ul className="flex flex-col gap-2 text-md">
              <li><a href="#" className="hover:underline hover:text-teal-200">Home</a></li>
              <li><a href="#" className="hover:underline hover:text-teal-200">Our Services</a></li>
              <li><a href="#" className="hover:underline hover:text-teal-200">Physiotherapy</a></li>
              <li><a href="#" className="hover:underline hover:text-teal-200">Corporate Wellbeing</a></li>
              <li><a href="#" className="hover:underline hover:text-teal-200">About Curate</a></li>
              <li><a href="#" className="hover:underline hover:text-teal-200">Privacy Policy</a></li>
            </ul>
          </nav>
          <div className="text-xs text-teal-100 mt-8">
            &copy; {new Date().getFullYear()} Curate Health • All rights reserved.
          </div>
        </section>
      </div>
    </footer>
  );
}