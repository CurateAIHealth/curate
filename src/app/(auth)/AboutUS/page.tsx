'use client';

import ModernFooter from '@/Components/Footer/page';
import {
  HeartPulse,
  Users,
  Star,
  HandHeart,
  Stethoscope,
  BriefcaseMedical,
  LogIn,
  User,
  Menu,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const sections = [
  {
    icon: <HeartPulse className="w-8 h-8 text-blue-500" />,
    title: 'About Curate Health Services',
    content:
      'Curate Health Services delivers premium in-home care, blending medical expertise with heartfelt compassion to keep you and your loved ones thriving in the comfort of home.',
    image: 'Icons/about-care.png'
  },
  {
    icon: <Users className="w-8 h-8 text-purple-500" />,
    title: 'Who We Are',
    content:
      "Our team of skilled care attendants and nurses provides bespoke support tailored to every individual's unique needs—whether short-term or ongoing. We focus on quality, dignity, and companionship.",
    image: 'Icons/team.png'
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: 'Our Services',
    content: (
      <>
        <ul className="list-disc pl-6 space-y-1">
          <li>Attentive in-home care and companionship</li>
          <li>Professional, rigorously vetted staff</li>
          <li>Full spectrum of nursing and post-surgical support</li>
          <li>Dementia and Alzheimer’s care with empathy and patience</li>
        </ul>
        <p className="mt-2">
          We craft care plans for families, seniors, and those recovering at every stage.
        </p>
      </>
    ),
    image: 'Icons/services.jpg'
  },
  {
    icon: <HandHeart className="w-8 h-8 text-rose-500" />,
    title: 'Why Choose Us',
    content:
      'We go beyond clinical care. Our compassionate professionals foster emotional well-being, build trust, and ensure families feel supported at every step of the journey.',
    image: 'Icons/why-us.jpg'
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-green-500" />,
    title: 'Trusted by Families',
    content:
      'From urban homes to remote communities, hundreds of families across the region rely on our dedicated team. Our client stories reflect our unwavering commitment to excellence.',
    image: 'Icons/trusted.jpg'
  }
];

const mainMenu = [
  { label: 'Home Health', icon: <BriefcaseMedical size={18} />, href: '/' },
  { label: 'Ocuppational Health', icon: <User size={18} />, href: '/occupational' },
  { label: 'Digital AI Health', icon: <User size={18} />, href: '/DigitalAI' },
  { label: 'About US', icon: <User size={18} />, href: '/AboutUS' },
  { label: 'Login', icon: <LogIn size={18} />, href: '/sign-in' }
];


const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.7 } }
};

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.14,
    rotate: [0, 12, -7, 0], 
    transition: { type: "spring", stiffness: 200, damping: 8 }
  }
};

const imgVariants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function About() {
  const [mobileOptsOpen, setMobileOptsOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
   
      <nav className="w-full bg-white/80 dark:bg-slate-950 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
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
          <div className="hidden md:flex gap-6 items-center">
            {mainMenu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-2 py-1 text-lg font-medium text-[#275f72] relative"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileOptsOpen(true)}
              className="flex items-center gap-2 px-3 py-2 shadow hover:bg-[#f2f2fb] transition rounded"
              aria-label="Open Menu"
              type="button"
            >
              <Menu size={25} color="#1392d3" />
            </button>
          </div>
        </div>
        
        {mobileOptsOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 flex items-start justify-end"
               onClick={() => setMobileOptsOpen(false)}>
            <div className="bg-white w-[80vw] max-w-sm h-full shadow-2xl p-7 flex flex-col items-start gap-2"
                 onClick={e => e.stopPropagation()}>
              <div className="flex gap-2 items-center mb-4">
                <Sparkles size={28} color="#1392d3" />
                <span className="text-2xl font-bold text-[#1392d3]">Medico</span>
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
              <button
                className="mt-8 text-gray-400 hover:text-[#1392d3]"
                onClick={() => setMobileOptsOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </nav>

    
      <header className="max-w-7xl mx-auto py-10 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="font-extrabold text-5xl md:text-6xl text-[#1392d3] dark:text-indigo-100 tracking-tight mb-3"
        >
          <span className="text-[#ff1493]">CURATE</span> Health Services
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9 }}
          className="text-2xl text-[#50c896] dark:text-slate-300 font-medium max-w-2xl mx-auto"
        >
          Compassion. Personalization. Excellence.
        </motion.h2>
      </header>

  
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4 pb-24">
      
        <aside className="hidden md:block w-1/4 pt-8 sticky top-32 self-start">
          <nav>
            <ul className="space-y-3">
              {sections.map(sec =>
                <li key={sec.title}>
                  <a href={`#${sec.title.replace(/\s/g, '')}`}
                     className="group block text-blue-900 dark:text-indigo-100 hover:text-[#1392d3] font-medium py-1 px-2 rounded transition-colors duration-200 relative">
                    <span className="relative group-hover:underline group-hover:underline-offset-4">
                      {sec.title}
                      <motion.span
                        layoutId="sidebar-underline"
                        className="absolute left-0 bottom-0 h-[2px] w-full bg-[#1392d3] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                      />
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        
        <section className="flex-1 space-y-9">
          {sections.map((sec, idx) => (
            <motion.div
              id={sec.title.replace(/\s/g, '')}
              key={sec.title}
              className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-10 flex flex-col md:flex-row items-center gap-8 border border-slate-200 dark:border-slate-700 group"
            
              initial="hidden"
              whileInView="enter"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.04 * idx }}
              whileHover={{ scale: 1.025, boxShadow: "0 8px 36px 0 rgba(19,146,211,0.10)" }}
            >
              <motion.div
                className="flex-shrink-0 mb-4 md:mb-0"
                
                initial="rest"
                whileHover="hover"
                whileTap="hover"
              >
                {sec.icon}
              </motion.div>
              <div className="flex-1">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold mb-2 text-[#1392d3] dark:text-indigo-100"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, type: "spring" }}
                  viewport={{ once: true }}
                >
                  {sec.title}
                </motion.h2>
                <motion.div
                  className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {sec.content}
                </motion.div>
              </div>
              <motion.img
                src={sec.image}
                alt={sec.title}
                className="w-65 h-36 object-cover rounded-lg shadow border border-slate-100 dark:border-slate-700"
               
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
              />
            </motion.div>
          ))}
        </section>
      </div>

      
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

   
      <div className="relative z-10 mt-12">
        <ModernFooter />
      </div>
    </main>
  );
}
