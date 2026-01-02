'use client';

import ModernFooter from '@/Components/Footer/page';
import { DigitalAiHealservices } from '@/Lib/HomePageContent';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseMedical, LogIn, User,
  Sparkles, Menu
} from 'lucide-react';
import { useState } from 'react';

const pink = "#ff1493";
const blue = "#1392d3";
const green = "#50c896";

const mainMenu = [
  { label: "Home Health", icon: <BriefcaseMedical size={18} />, href: "/" },
  { label: "Ocuppational Health", icon: <User size={18} />, href: "/occupational" },
  { label: "Digital AI Health", icon: <User size={18} />, href: "/DigitalAI" },
  { label: "About US", icon: <User size={18} />, href: "/AboutUS" },
  { label: "Login", icon: <LogIn size={18} />, href: "/sign-in" },
];



export default function HospitalDesign() {
  const [mobileOptsOpen, setMobileOptsOpen] = useState(false);
  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-900 font-sans">
     
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
         <div className="flex items-center gap-3">
                    <a href='/'>
                      <img
                                  src="/Icons/HomeIcon.png"
                                  alt="Curate AI Health Logo"
                                  width={120}
                                  height={35}
                                  
                                  className="object-contain"
                                />
                    </a>
                </div>
        <div className="hidden md:flex flex gap-6 items-center">
          {mainMenu.map((item) => (
            <a key={item.href} href={item.href} className="px-2 py-1 text-lg font-medium text-[#275f72] relative inline-block after:block after:h-[2px] after:bg-[#ff1493] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

    
      <div className="md:hidden fixed top-5 right-6 z-50">
        <button onClick={() => setMobileOptsOpen(true)} className="flex items-center gap-2 px-3 py-2 shadow hover:bg-[#f2f2fb] transition rounded" aria-label="Open Menu" type="button">
          <Menu size={25} color={blue} />
        </button>
        <AnimatePresence>
          {mobileOptsOpen && (
            <motion.div key="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/30 flex items-start justify-end" onClick={() => setMobileOptsOpen(false)}>
              <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="bg-white w-[80vw] max-w-sm h-full shadow-2xl p-7 flex flex-col items-start gap-2" onClick={e => e.stopPropagation()}>
                <div className="flex gap-2 items-center mb-4">
                  <Sparkles size={28} color={blue} />
                  <span className="text-2xl font-bold text-[#1392d3]">Medico</span>
                </div>
                {mainMenu.map((item) => (
                  <a key={item.href} href={item.href} className="flex items-center gap-2 text-lg py-3 px-2 text-[#275f72] rounded-md w-full hover:bg-[#eaf6fa] transition" onClick={() => setMobileOptsOpen(false)}>
                    {item.icon} {item.label}
                  </a>
                ))}
                <button className="mt-8 text-gray-400 hover:text-[#1392d3]" onClick={() => setMobileOptsOpen(false)} type="button">Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    
      <section className="relative h-auto py-20 sm:py-24 md:py-2 flex items-center overflow-hidden bg-gradient-to-br from-blue-100 to-pink-100">

        <div className="absolute inset-0 bg-white/60" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }} className="relative z-10 px-4 sm:px-6 max-w-full sm:max-w-xl md:max-w-4xl mx-auto text-center">
          <h1 className="text-md sm:text-md md:text-5xl font-extrabold text-[#ff1493] mb-4 leading-tight drop-shadow-md">CURATE Digital AI Health</h1>
          <p className="mx-auto  text-[12px] md:text-lg text-gray-600 max-w-full sm:max-w-xl mb-9 leading-relaxed break-words whitespace-normal">
            We are building a network to transform healthcare and the rehab community with a holistic, technology-powered approach for medical and rehab solutions. Our integrated care brings together Modern Medicine, Ayurveda, Physiotherapy, Speech & Language Therapy, Behavior Therapy, Occupational Therapy, Nutrition, Yoga & Meditation, Music Therapy, and Psychology—delivered through a compassionate, connected digital ecosystem.
          </p>
          <motion.a whileHover={{ scale: 1.05 }} href="#services" className="inline-block px-8 md:px-10 py-3 md:py-4 bg-[#50c896] text-white rounded-full font-semibold text-lg shadow-xl hover:bg-[#1392d3] transition">
            Explore Our Services
          </motion.a>
        </motion.div>
      </section>

          <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="md:w-7/12 w-full"
          >
            <img
              src="Icons/DigitalAI.jpg"
              alt="Digital health professional with patient"
              className="rounded-2xl shadow-xl w-full max-h-[310px] md:max-h-[410px] object-cover border border-blue-100"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-5/12 w-full text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#ff1493] mb-3 md:mb-5 leading-tight">
              Connected. Holistic. Intelligent.
            </h2>
            <p className="text-base md:text-xl text-gray-700 leading-loose">
              We unite expert teams, advanced AI, and integrative therapies across medical and rehab fields. Every community member gets a tailored plan—driven by digital innovation and human empathy—so everyone can achieve their best health.
            </p>
          </motion.div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-blue-50">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="text-3xl md:text-6xl font-extrabold text-center text-[#1392d3] mb-10 md:mb-12 leading-tight">
            Our Specializations
          </h2>
          <div className="space-y-10 md:space-y-20">
            {DigitalAiHealservices.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * .05 }}
                  className={`flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="md:w-2/3 w-full">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#ff1493] mb-3 flex items-center gap-3">
                      {Icon && <Icon className="h-8 w-8 md:h-10 md:w-10 text-[#ff1493]" aria-hidden="true" />}
                      {s.title}
                    </h3>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="md:w-1/3 w-full flex justify-center mb-4 md:mb-0">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="rounded-xl shadow-xl w-full max-w-[350px] h-[130px] md:h-[200px] object-cover border border-blue-100"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="relative py-14 md:py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/medical-team-smiling.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <div className="relative z-10 text-center px-4">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-5xl font-extrabold mb-4 text-[#50c896]"
          >
            One Network. Many Experts.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-base md:text-xl max-w-2xl md:max-w-3xl mx-auto text-[#1392d3] mb-2"
          >
            We connect a diverse team across medical, traditional, and rehab specialties—building a supportive and caring AI-powered health community for all.
          </motion.p>
        </div>
      </section>

      <section className="px-4 md:px-6 py-16 md:py-24 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16 max-w-6xl">
          <motion.div
            className="md:w-1/2 w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="Icons/patient-rehabilitation-support.jpg"
              alt="Patient rehabilitation support"
              className="rounded-2xl shadow-2xl border border-pink-100 w-full max-w-[380px] h-auto object-cover mx-auto"
              style={{ maxHeight: '290px', minHeight: '160px' }}
            />
          </motion.div>
          <motion.div
            className="md:w-1/2 w-full text-center md:text-left mt-10 md:mt-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-6xl font-extrabold text-[#1392d3] mb-7 leading-tight">
              Holistic Wellness, Powered by AI
            </h2>
            <p className="text-base md:text-2xl text-gray-700 leading-loose mb-4">
              We use modern technology and the strength of community to deliver seamless, personalized experiences—bringing tomorrow’s care to you, today.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-24 bg-gradient-to-br from-blue-100 to-pink-100 text-blue-800 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl md:max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-6xl font-extrabold text-[#ff1493] mb-5 md:mb-8 leading-tight"
          >
            Join the Digital Health Movement
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-base md:text-2xl text-[#1392d3] mb-7 md:mb-12 leading-loose"
          >
            Become part of a smarter, connected future in rehabilitation and care. Reach out today and discover the power of a truly holistic health network.
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            href="#"
            className="inline-block px-8 md:px-14 py-4 md:py-6 bg-[#50c896] text-white rounded-full shadow-lg font-bold text-lg md:text-2xl uppercase tracking-wider hover:bg-blue-700 transition"
          >
            #connecting rehab care with AI ❤️
          </motion.a>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-center">
  <a
    href="https://www.instagram.com/yourprofile"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="w-14 h-14 flex items-center justify-center rounded-full
               bg-white border-2 border-[#ff1493]
               shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
  >
    <img src="Icons/Insta.gif" alt="Instagram" className="w-7 h-7" />
  </a>

  <a
    href="https://www.linkedin.com/in/yourprofile"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="w-14 h-14 flex items-center justify-center rounded-full
               bg-white border-2 border-[#0a66c2]
               shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300"
  >
    <img src="Icons/Linkedin.gif" alt="LinkedIn" className="w-7 h-7" />
  </a>
</div>
      <ModernFooter />
    </main>
  );
}
