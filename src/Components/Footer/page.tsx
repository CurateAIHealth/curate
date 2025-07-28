
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function ModernFooter() {
  return (
    <footer className="bg-teal-500 py-10 px-6 text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between gap-10 relative">
     
        <section className="flex-1 flex flex-col justify-between">
          <div>
            <img src="Icons/CurateOfficialLogo.png"
              alt="Brand Logo"
              className="w-20 h-20 md:w-40 md:h-40 object-contain mb-2 rounded-xl  p-2"
            />
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Curate<span className="text-indigo-200">Health</span></h2>
            <p className="text-md text-teal-50 mb-8">
              Experience truly personal, at-home healthcare with our trusted professionals.
            </p>
          </div>
          <form className="bg-white/10 py-3 px-5 rounded-xl flex items-center gap-2 mb-3 max-w-xs shadow-lg focus-within:ring-2 focus-within:ring-teal-200">
            <input
              className="bg-transparent flex-1 placeholder:text-teal-200 text-sm p-2 border-none outline-none"
              type="email"
              placeholder="Join our newsletter"
            />
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 transition-colors px-4 py-2 rounded text-white text-xs font-bold"
            >Subscribe</button>
          </form>
          <div className="flex items-center gap-4 mt-4">
            <a href="#"><Facebook size={22} className="hover:text-teal-200" /></a>
            <a href="#"><Twitter size={22} className="hover:text-teal-200" /></a>
            <a href="#"><Linkedin size={22} className="hover:text-teal-200" /></a>
          </div>
        </section>
     
     <div className="animate-popup-blink rounded-2xl border border-teal-200 bg-teal-900/80 shadow-xl py-8 px-7 w-[260px] flex flex-col gap-3">
  <span className="block font-semibold text-teal-100 mb-2">Talk to us</span>
  <span className="flex gap-2 items-center text-sm"><Mail size={18}/>info@curatehealth.in</span>
  <span className="flex gap-2 items-center text-sm"><Phone size={18}/>+91 73860 45569</span>
  <span className="flex gap-2 items-start text-sm"><MapPin size={18} className="mt-1"/>
    <span>
      Plot 45, St. No. 14, Puppalaguda Rd,<br/>Manikonda, Hyderabad, Telangana 500089
    </span>
  </span>
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
