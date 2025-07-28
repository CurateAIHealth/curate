"use client";
import { useState } from "react";
import { cta, features, heroContent, pricing, testimonials } from "@/Lib/HomePageContent";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Settings } from "lucide-react";

const pink = "#ff1493";  // Deep Pink
const blue = "#1392d3";  // Strong Blue
const green = "#50c896"; // Fresh Green

export default function HomePage() {
  const [mobileOptsOpen, setMobileOptsOpen] = useState(false);

  const optionLinks = [
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div
      className="font-sans min-h-screen"
      style={{
        background: `linear-gradient(135deg, white 0%, ${blue}20 50%, ${green}20 100%)`,
      }}
    >
      {/* HERO */}
      <section className="relative isolate py-24 px-6 overflow-hidden">
        {/* Medical BG Blur */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 0.18, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[650px] h-[480px] rounded-full blur-2xl pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at center, ${blue}30, ${green}30, white)`,
          }}
        />
        {/* Option Menu */}
        <div className="absolute right-8 top-8 z-20">
          {/* Desktop: options as inline links */}
          <div
            className="hidden md:flex items-center gap-4 rounded-xl px-4 py-2 shadow backdrop-blur-md border"
            style={{
              backgroundColor: "rgba(255, 20, 147, 0.15)", // pink with transparency
              borderColor: blue,
            }}
          >
            <Settings size={22} strokeWidth={2.1} color={blue} />
            {optionLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-medium transition"
                style={{ color: blue }}
                onMouseEnter={(e) => (e.currentTarget.style.color = pink)}
                onMouseLeave={(e) => (e.currentTarget.style.color = blue)}
              >
                {item.label}
              </a>
            ))}
          </div>
          {/* Mobile: icon triggers modal */}
          <button
            type="button"
            aria-label="Options"
            className="md:hidden flex items-center gap-2 rounded-xl p-2 shadow transition"
            style={{
              backgroundColor: "rgba(255, 20, 147, 0.15)",
              border: `1px solid ${blue}`,
            }}
            onClick={() => setMobileOptsOpen(true)}
          >
            <Settings size={26} strokeWidth={2.2} color={blue} />
          </button>
          <AnimatePresence>
            {mobileOptsOpen && (
              <motion.div
                key="option-menu"
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
                  className="bg-white w-[85vw] max-w-xs h-full shadow-xl p-6 flex flex-col items-start gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Settings size={24} color={blue} />
                    <span className="font-bold text-lg" style={{ color: blue }}>
                      Options
                    </span>
                  </div>
                  {optionLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="text-base font-medium rounded w-full px-1 py-2 transition hover:bg-[rgba(255,20,147,0.1)]"
                      style={{ color: blue }}
                      onClick={() => setMobileOptsOpen(false)}
                      onMouseEnter={(e) => e.currentTarget.style.color = pink}
                      onMouseLeave={(e) => e.currentTarget.style.color = blue}
                    >
                      {item.label}
                    </a>
                  ))}
                  <button
                    onClick={() => setMobileOptsOpen(false)}
                    className="mt-6 text-gray-500 hover:text-[rgb(255,20,147)] text-sm transition"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Central Hero */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 80, damping: 16 }}
          className="relative z-10 text-center"
        >
          <h1
            className="text-4xl md:text-6xl font-extrabold drop-shadow mb-4 flex justify-center items-center gap-3"
            style={{ color: blue }}
          >
            <Sparkles size={40} className="animate-pulse" color={pink} />
            {heroContent.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-700">
            {heroContent.subtitle}
          </p>
          <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.98 }}
              href="/contact"
              className="text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 border border-transparent shadow-lg backdrop-blur-lg"
              style={{
                background: `linear-gradient(90deg, ${blue}, ${pink})`,
                boxShadow: `0 8px 24px ${pink}66`,
              }}
            >
              {heroContent.ctaPrimary}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, filter: "brightness(1.08)" }}
              whileTap={{ scale: 0.98 }}
              href="/pricing"
              className="shadow border rounded-2xl font-medium text-lg px-8 py-4 backdrop-blur-md transition-all duration-200"
              style={{
                backgroundColor: "rgba(255, 20, 147, 0.1)",
                borderColor: pink,
                color: pink,
              }}
            >
              {heroContent.ctaSecondary}
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4">
        <h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center flex justify-center items-center gap-2"
          style={{ color: blue }}
        >
          <Sparkles size={28} className="animate-spin-slow" color={green} />
          Core Features
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              className="relative p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border backdrop-blur-xl group"
              style={{
                backgroundColor: "rgba(255, 20, 147, 0.1)",
                borderColor: blue,
              }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 z-0 pointer-events-none rounded-3xl blur-lg transition-all duration-300 group-hover:opacity-100 opacity-30"
                style={{
                  background:
                    `radial-gradient(circle at top left, ${pink}40, ${green}40, ${blue}40)`,
                }}
              />
              <div className="relative z-10">
                <Star size={32} className="mb-3 mx-auto animate-wiggle" color={pink} />
                <h3 className="text-xl font-bold" style={{ color: pink }}>
                  {f.title}
                </h3>
                <p className="mt-2 text-gray-700">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section
        className="py-20 px-6 text-center"
        style={{
          background: `linear-gradient(135deg, white 0%, ${blue}20 50%, ${green}20 100%)`,
        }}
      >
        <h2 className="text-3xl font-bold mb-6" style={{ color: blue }}>
          Simple Pricing
        </h2>
        <p className="text-lg mb-10" style={{ color: blue }}>
          Transparent plans tailored for solo PTs and clinics
        </p>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {pricing.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="rounded-3xl shadow-xl p-10 relative isolate overflow-hidden backdrop-blur-md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                border: plan.highlighted
                  ? `2px solid ${blue}`
                  : `1px solid ${green}`,
                boxShadow: plan.highlighted
                  ? `0 0 25px 4px ${blue}44`
                  : "none",
                transform: plan.highlighted ? "scale(1.05)" : undefined,
                transition: "all 0.3s ease",
              }}
            >
              {plan.highlighted && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.7 }}
                  transition={{ delay: 0.3, duration: 0.9, type: "spring" }}
                  className="absolute top-4 right-6 rounded-full px-4 py-1 uppercase text-xs font-bold shadow-sm drop-shadow text-white"
                  style={{ backgroundColor: pink }}
                >
                  Popular
                </motion.div>
              )}
              <h3 className="text-2xl font-bold mb-2" style={{ color: blue }}>
                {plan.name}
              </h3>
              <p
                className="text-4xl font-bold mb-6"
                style={{ color: green }}
              >
                {plan.price}
              </p>
              <ul className="text-gray-700 space-y-3 text-left mb-6">
                {plan.features.map((item, i) => (
                  <li key={i}>
                    <span className="font-bold" style={{ color: green }}>
                      ✓
                    </span>{" "}
                    {item}
                  </li>
                ))}
              </ul>
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="/contact"
                className="font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 text-white"
                style={{
                  background: `linear-gradient(90deg, ${blue}, ${pink})`,
                }}
              >
                Get Started
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-white/90 backdrop-blur-md text-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-10"
          style={{ color: blue }}
        >
          What Our Users Say
        </h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.97 },
            visible: { opacity: 1, scale: 1 },
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03, boxShadow: `0px 8px 24px 0px ${blue}30` }}
              className="bg-white/90 p-8 rounded-2xl shadow-md border flex flex-col items-center group transition"
              style={{ borderColor: green }}
            >
              <p
                className="text-gray-700 text-lg italic transition group-hover:text-blue-700"
              >
                "{t.quote}"
              </p>
              <p
                className="mt-4 font-semibold group-hover:text-green-600"
                style={{ color: pink }}
              >
                — {t.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA BANNER */}
      <section
        className="relative text-center py-24 px-6 overflow-hidden isolate"
        style={{
          background: `linear-gradient(90deg, ${blue}20, ${green}20, ${pink}20)`,
          color: blue,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.17, scale: 1.05 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-3xl pointer-events-none"
          style={{
            backgroundColor: pink,
          }}
        />
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="text-4xl font-extrabold mb-6 drop-shadow"
        >
          {cta.heading}
        </motion.h2>
        <p className="text-lg mb-10 max-w-2xl mx-auto">{cta.subheading}</p>
        <motion.a
          whileHover={{ scale: 1.07, filter: "brightness(1.1)" }}
          href="/contact"
          className="font-bold px-10 py-4 rounded-xl shadow transition-all text-lg text-white"
          style={{
            background: `linear-gradient(90deg, ${blue}, ${pink})`,
          }}
        >
          {cta.button}
        </motion.a>
      </section>
    </div>
  );
}
