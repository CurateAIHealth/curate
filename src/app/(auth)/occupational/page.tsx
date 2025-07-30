"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck, HeartPulse, HelpingHand,
  Users, UserCheck, Award,
  BriefcaseMedical,
  User,
  LogIn,
  Sparkles,
  Menu
} from "lucide-react";
import ModernFooter from "@/Components/Footer/page";
import { images } from "@/Lib/HomePageContent";

const mainMenu = [
  { label: "Home Health", icon: <BriefcaseMedical size={18} />, href: "/" },
  { label: "Occupational Health", icon: <User size={18} />, href: "/occupational" },
  { label: "Digital AI Health", icon: <User size={18} />, href: "/DigitalAI" },
  { label: "About Us", icon: <User size={18} />, href: "/AboutUS" },
  { label: "Login", icon: <LogIn size={18} />, href: "/sign-in" },
];

export default function OccupationalHealth() {
  const [mobileOptsOpen, setMobileOptsOpen] = useState(false);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 font-sans">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-3">

          <a href="/">
          <img src="/Icons/Curate-logo.png" alt="Curate Logo" width={35} height={35} className="object-contain" />
          </a>
        </div>
        <div className="hidden md:flex gap-7 items-center">
          {mainMenu.map((item, idx) => (
            <motion.a
              key={item.href}
              href={item.href}
              className="px-2 py-1 text-lg font-medium text-[#275f72] relative inline-block after:block after:h-[2px] after:bg-[#ff1493] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.18, duration: 0.45, type: "spring", stiffness: 130 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>
        <div className="md:hidden z-50">
          <motion.button
            onClick={() => setMobileOptsOpen(true)}
            aria-label="Open Menu"
            className="p-2 rounded hover:bg-blue-100 transition"
            whileTap={{ rotate: 90, scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Menu size={26} />
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOptsOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 flex items-start justify-end"
            onClick={() => setMobileOptsOpen(false)}
          >
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white w-[80vw] max-w-sm h-full shadow-2xl p-7 flex flex-col items-start gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 items-center mb-4">
                <Sparkles size={28} className="text-blue-700" />
                <span className="text-2xl font-bold text-blue-700">Medico</span>
              </div>
              {mainMenu.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-lg py-3 px-2 text-[#275f72] rounded-md w-full hover:bg-[#eaf6fa] transition"
                  onClick={() => setMobileOptsOpen(false)}
                >
                  {item.icon} {item.label}
                </a>
              ))}
              <button className="mt-8 text-gray-400 hover:text-blue-700" onClick={() => setMobileOptsOpen(false)}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto py-20 px-5 items-center md:items-start">
        <motion.div initial="hidden" animate="visible" className="flex-1 md:pt-7">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#ff1493] leading-snug">
            CURATE <span className="text-[#1392d3]">Occupational Health</span>
          </h1>
          <p className="text-lg md:text-2xl mt-6 text-[#1392d3] max-w-xl">
            Not just checking boxes—transforming workforce wellness through journeys, not programs.
          </p>
          <button
            onClick={() => window.location.href = "/contact"}
            className="mt-10 bg-[#50c896] hover:bg-blue-800 transition text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
          >
            Get Your Custom Plan
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 90 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.28, delay: 0.1 }}
          className="flex-1 w-full h-72 md:h-[420px] rounded-2xl shadow-2xl overflow-hidden"
        >
          <img src='Icons/OccupationalHealthMain.png' alt="Occupational Health Hero" className="w-full h-full object-cover object-center" />
        </motion.div>
      </header>

      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-16 overflow-x-hidden">
        <motion.h2
          className="text-center mb-10 text-3xl md:text-4xl font-bold text-blue-900"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, type: "spring", stiffness: 110 }}
        >
          Your Workforce Wellness Journey
        </motion.h2>
        <ol className="relative border-l-2 border-blue-200 ml-4 sm:ml-6 px-2">
          {images.journey.map((j, idx) => {
            const Odd = idx % 2 === 1;
            const Icon = j.icon;
            return (
              <motion.li
                key={j.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx + 1) * 0.2, duration: 0.7, type: "spring", bounce: 0.35 }}
                className="mb-16 flex flex-col md:flex-row md:items-center gap-6"
              >
                {!Odd && (
                  <img
                    src={j.img}
                    alt={j.label}
                    className="w-full max-w-[180px] h-auto rounded-xl shadow-lg object-cover border-4 border-white mx-auto md:mx-0"
                  />
                )}
                <div className="flex-1 relative mt-2 md:mt-0">
                  <span className="absolute -left-8 sm:-left-12 top-1 bg-blue-100 flex items-center justify-center rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow">
                    <Icon size={24} className="text-blue-700" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">{j.label}</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{j.text}</p>
                </div>
                {Odd && (
                  <img
                    src={j.img}
                    alt={j.label}
                    className="w-full max-w-[180px] h-auto rounded-xl shadow-lg object-cover border-4 border-white mx-auto md:mx-0"
                  />
                )}
              </motion.li>
            );
          })}
        </ol>
      </section>

      <section className="bg-blue-400 py-14 mt-10">
        <ul className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto">
          {images.highlights.map((h, idx) => (
            <motion.li
              key={h.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.18, duration: 0.5, type: "spring", stiffness: 120 }}
              className="flex flex-col items-center text-center px-3"
            >
              <div className="rounded-full border-4 border-white bg-white w-20 h-20 flex items-center justify-center mb-3 shadow-xl">
                <h.icon size={32} className="text-blue-700" />
              </div>
              <img src={h.img} alt={h.title} className="w-24 h-24 object-cover object-center rounded-2xl mb-3 shadow-md border-2 border-blue-100" />
              <div className="text-white text-xl font-extrabold">{h.stat}</div>
              <div className="text-white text-base font-medium">{h.title}</div>
              <div className="text-blue-100 text-sm">{h.desc}</div>
            </motion.li>
          ))}
        </ul>
      </section>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="my-16 bg-white/90 py-12 px-8 rounded-3xl max-w-2xl mx-auto text-center shadow-xl border-t-4 border-blue-300"
      >
        <h3 className="text-2xl font-bold mb-4 text-blue-900">Ready for a Wellness Transformation?</h3>
        <ul className="text-gray-700 text-left list-disc list-inside space-y-2 max-w-xs mx-auto text-base mb-6">
          <li>Elite, compassionate care teams</li>
          <li>End-to-end workforce health innovation</li>
          <li>Industry-proofed compliance and reporting</li>
          <li>Always-on support and consultation</li>
        </ul>
        <motion.button
          onClick={() => window.location.href = "/contact"}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          className="mt-4 px-8 py-3 bg-blue-700 text-white font-extrabold rounded-xl shadow-xl hover:bg-blue-800 transition text-lg"
        >
          Schedule a Demo
        </motion.button>
      </motion.div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-center">
        <motion.a
          href="https://www.instagram.com/yourprofile"
          target="_blank" rel="noopener noreferrer"
          className="hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition"
          aria-label="Instagram"
          whileHover={{ scale: 1.15, rotate: -5 }}
          whileTap={{ scale: 0.94 }}
        >
          <img alt="Instagram" src="Icons/insta.svg" className="w-10 h-10" />
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/yourprofile"
          target="_blank" rel="noopener noreferrer"
          className="hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
          aria-label="LinkedIn"
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.94 }}
        >
          <img alt="LinkedIn" src="Icons/Linkedin.png" className="w-10 h-10" />
        </motion.a>
      </div>

      <ModernFooter />
    </section>
  );
}
