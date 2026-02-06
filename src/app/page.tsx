'use client';


import { GetUserCompliteInformation, GetUserInformation } from '@/Lib/user.action';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cta, features, heroContent, pricing, reviews, services, steps } from "@/Lib/HomePageContent";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Settings, User, LogIn, BriefcaseMedical, CircleEllipsis, Menu } from "lucide-react";
import FreeConsultationForm from '@/Components/Contactfill/page';
import ContactSection from '@/Components/Contact/page';
import ModernFooter from '@/Components/Footer/page';
import { CurrentLoginUser, UpdateRegisterdType, UpdateTimeStamp } from '@/Redux/action';
import { useDispatch } from 'react-redux';
import { LoadingData } from '@/Components/Loading/page';
import { StaffEmails } from '@/Lib/Content';




const pink = "#ff1493";
const blue = "#1392d3";
const green = "#50c896";


const mainMenu = [

    { label: "Home Health", icon: <BriefcaseMedical size={18} />, href: "/ComeingSoon" },
    { label: "Occupational Health", icon: <User size={18} />, href: "/ComeingSoon" },
    { label: "Digital AI Health", icon: <User size={18} />, href: "/ComeingSoon" },
    { label: "About US", icon: <User size={18} />, href: "/AboutUS" },
    { label: "Login", icon: <LogIn size={18} />, href: "/sign-in" },
];

  const logos = [
    "/Icons/AbhaLogo.png",
    "/Icons/Parkson.jpeg",
    "/Icons/AbhaLogo.png",
    "/Icons/Parkson.jpeg",
    "/Icons/AbhaLogo.png",
  ];
export default function StaticInfoPage() {
  const [isChecking, setIsChecking] = useState(true);
    const [mobileOptsOpen, setMobileOptsOpen] = useState(false);
    const [ShowPopUp,setShowPopUp]=useState(false)
  const router = useRouter();
  const dispatch=useDispatch()
const [showAllReviews, setShowAllReviews] = useState(false);
const INITIAL_REVIEWS_COUNT = 4;
const visibleReviews = showAllReviews
  ? reviews
  : reviews.slice(0, INITIAL_REVIEWS_COUNT);


 useEffect(() => {
  const Fetch = async () => {
    const localValue = typeof window !== "undefined" ? localStorage.getItem("UserId") : null;
 

    try {
      const ProfileInformation = await GetUserInformation(localValue);
  

      const email = ProfileInformation?.Email?.toLowerCase();
      if (StaffEmails.includes(email)) {
        
                   const user = await GetUserInformation(localValue);
                   console.log("Check Email-----",user?.Email)
                   dispatch(CurrentLoginUser(user?.Email))
        router.push("/DashBoard");
        return;
      }

      if (ProfileInformation?.FinelVerification === false) {
        if (ProfileInformation?.userType === "healthcare-assistant") {
          dispatch(UpdateRegisterdType(ProfileInformation?.userType ))
          router.push("/HCARegistraion");
          return;
        }else{
            router.push("/HomePage");
        return;
        }
       
      
      }

      if (ProfileInformation?.FinelVerification === true) {
        router.push("/Profile");
        return;
      }

      if (ProfileInformation === null) {
        setIsChecking(false);
      } else {
        setIsChecking(false);
        const Timer = setTimeout(() => {
          setShowPopUp(true);
        }, 3500);
        return () => clearTimeout(Timer);
      }
    } catch (err) {
      console.error(err);
    }
  };
  Fetch();
}, [router]);

const ViewContactInfo=()=>{
  const Contact_Container=document.getElementById("ContactInformation")
  Contact_Container?.scrollIntoView({behavior:"smooth",block:'center'})

}
  if (isChecking) {
    return (
      <LoadingData/>
    );
  }

  return (
        <div className="font-sans min-h-screen bg-[#f7fafd]">

            <nav className="flex justify-between items-center max-w-7xl mx-auto px-10 py-5">
                <div className="flex items-center gap-3">
                    <a href='/'>
                      <img
                                  src="/Icons/HomeIcon.png"
                                  alt="Curate AI Health Logo"
                                  width={180}
                                  height={45}
                                  
                                  className="object-contain"
                                />
                    </a>
                </div>
                <div className="hidden md:flex gap-7 items-center">
                    {mainMenu.map((item,Index) => (
                        <a
                            key={Index}
                            href={item.href}
                            className="px-2 py-1 text-lg font-medium text-[#275f72] relative inline-block after:block after:h-[2px] after:bg-[#ff1493] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                        >
                            {item.label}
                        </a>
                    ))}

                </div>
            </nav>

           <div className="md:hidden fixed top-5 right-6 z-50">
    <button
        className="flex items-center gap-2 px-3 py-2   shadow hover:bg-[#f2f2fb] transition"
        onClick={() => setMobileOptsOpen(true)}
        aria-label="Open Menu"
    >
        <Menu  size={25} color={blue} />
    </button>
 <AnimatePresence>
                    {mobileOptsOpen && (
                        <motion.div
                            key="mobile-menu"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/30 flex items-start justify-end"
                            onClick={() => setMobileOptsOpen(false)}
                        >
                            <motion.div
                                initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                className="bg-white w-[80vw] max-w-sm h-full shadow-2xl p-7 flex flex-col items-start gap-2"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex gap-2 items-center mb-4">
                                    <Sparkles size={28} color={blue} />
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
                                >
                                    Close
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
</div>



            <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-36">

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="absolute left-0 top-0 w-full h-full -z-10"
                >
                    <div
                        className="absolute left-[-18%] top-[-12%] w-[520px] h-[420px] rounded-[48%] blur-3xl"
                        style={{ background: `radial-gradient(circle, ${blue}55 0%, transparent 100%)` }}
                    />
                    <div
                        className="absolute right-[-16%] bottom-[-13%] w-[450px] h-[360px] rounded-[44%] blur-3xl"
                        style={{ background: `radial-gradient(circle, ${green}40 0%, transparent 100%)` }}
                    />
                </motion.div>

                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 justify-between">
                    <div className="flex-1 text-center md:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05, type: "spring", damping: 26, stiffness: 105 }}
                            className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight text-[#11354b] drop-shadow"
                        >
                            {/* <Sparkles size={44} color={blue} className="inline animate-pulse mb-1" />
                             <span className="ml-3 ">CURATE HEALTH</span> */}
                            
                        </motion.h1>
                        <span className="text-xl md:text-5xl font-extrabold mb-5 tracking-tight text-[#11354b] drop-shadow">{heroContent.title}</span>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
                            className="text-xl md:text-2xl max-w-2xl mx-auto text-[#647c8a] font-medium"
                        >
                            {heroContent.subtitle}
                        </motion.p>
                        <div className="flex flex-col md:flex-row gap-4 mt-10 md:justify-start justify-center">
                            <motion.a
                                whileHover={{ scale: 1.057 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={ViewContactInfo}
                                className="rounded-full px-8 py-4 font-semibold text-lg shadow transition bg-[#1392d3] text-white"
                                style={{
                                    background: `linear-gradient(90deg, ${blue} 60%, ${green} 110%)`,
                                    boxShadow: `0 6px 24px 0 ${blue}33`,
                                }}
                            >
                                {heroContent.ctaPrimary}
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.04 }}
                                href="/"
                                className="rounded-full border-2 border-[#f5e8f8] bg-white text-[#1392d3] font-semibold px-8 py-4 transition hover:shadow-lg shadow"
                            >
                                {heroContent.ctaSecondary}
                            </motion.a>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.28, duration: 0.45, type: "spring" }}
                        className="flex-1 flex items-center justify-center mt-10 md:mt-0"
                    >

                             
                            {/* <img src="Icons/HomePageLogo.png" alt="Curate Logo" className="rounded-lg"/> */}
                             <img src="Icons/CurateNewLogo.jpeg" alt="Curate Logo" className="rounded-lg"/>

                            
                    
                    </motion.div>
                </div>
            </section>
<section className="py-16 px-4 bg-white text-center">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 slide-in-left">
  Home Health Services Offered by CURATE
  </h2>
  {/* <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto slide-in-right">
    If you need assistance with medical services at home, a good option is to choose Curate Health Services to have Healthcare Professionals come into your home to assist you with your medical needs.
  </p> */}
  <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto slide-in-right">
If you or a loved one needs medical support at home, Curate Health Services is here to help—our caring healthcare professionals come to you, making home care comfortable and stress-free
  </p>

  <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10 justify-items-center">
    {services.map((service, index) => (
      <div
        key={index}
        className={`w-30 h-30 sm:w-30 sm:h-35 md:w-44 md:h-44 lg:w-48 lg:h-48 bg-white rounded-[54px] p-4 flex flex-col items-center justify-center border border-gray-100 shadow-md card-hover-scale pop-in pop-in-stagger-delay-${(index % 5) + 1}`}
        style={{ boxShadow: '0 0 12px rgba(6, 208, 244, 1)' }}
      >
        <img
          src={service.icon}
          alt={service.title}
          className="mb-3 object-contain md:h-30 h-18"
        />
        <p className="md:text-sm text-[8px] sm:text-base font-semibold text-gray-800 text-center">
          {service.title}
        </p>
      </div>
    ))}
  </div>
</section>
 <section className="bg-white py-16 border-t border-[#ecf3fb]">
      <div className="max-w-5xl mx-auto px-6">
    
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Our <span className="text-[#ff1493]">Seamless</span> Service Workflow
        </motion.h2>

    
        <div className="space-y-8">
          {steps.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
            
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#1392d3] text-white font-bold rounded-full shadow-md"
              >
                {index + 1}
              </motion.span>

            
              <p className="text-lg text-[#333] leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>


           {/* <section className="bg-white py-20 border-t border-[#ecf3fb]">
    <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center flex justify-center items-center gap-2">
            <Star size={30} color={green} className="animate-wiggle" />
            <span className="text-[#ff1493]">Our </span>
            <span className="text-[#1392d3] font-extrabold">CURATE</span>
            <span className="text-[#ff1493]"> Values</span>
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
                { title: "Care your beloved", desc: "We put love and compassion first in every interaction." },
                { title: "Understand your requirements", desc: "Listening closely to tailor care to your unique needs." },
                { title: "Reciprocate with quality service", desc: "Delivering top-notch care with dedication." },
                { title: "Advice with expertise professionals", desc: "Guidance from trained and skilled experts." },
                { title: "Train the health care professionals", desc: "Equipping professionals with advanced training." },
                { title: "Empathize the senior & patient families with 24/7 availability", desc: "Always available to offer understanding and support." }
            ].map((f, idx) => (
                <motion.div
                    key={idx}
                    initial={{ scale: 0.94, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.02 + idx * 0.10 }}
                    className="rounded-2xl group relative bg-white/90 border border-[#e0eff5] shadow-sm hover:shadow-2xl p-8 transition-all hover:border-[#50c896] overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.25 }}
                        className="absolute inset-0 pointer-events-none blur-xl transition"
                        style={{
                            background: `linear-gradient(93deg, ${green}1c 30%, ${blue}1a 80%, ${pink}08 100%)`,
                        }}
                    />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <Star size={30} color={green} className="mb-2 animate-wiggle" />
                        <h3 className="font-semibold text-lg text-[#1392d3] mb-1">
                            <a className='text-[#ff1493]'>{f.title[0]}</a>{f.title.slice(1,f.title.length)}</h3>
                        <p className="text-[#6b8193]">{f.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
</section> */}


<section className="bg-gradient-to-b from-white to-[#f8fbff] py-20">
  <div className="max-w-5xl mx-auto px-6">
  
    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
      <span className="text-[#ff1493]">Our </span>
    <span className="text-[#1392d3] font-extrabold">CURATE</span>
      <span className="text-[#ff1493]"> Values</span>
    </h2>

 
    <div className="relative border-l-4 border-[#50c896] ml-6">
      {[
        { title: "Care your beloved", desc: "We put love and compassion first in every interaction." },
        { title: "Understand your requirements", desc: "Listening closely to tailor care to your unique needs." },
        { title: "Reciprocate with quality service", desc: "Delivering top-notch care with dedication." },
        { title: "Advice with expertise professionals", desc: "Guidance from trained and skilled experts." },
        { title: "Train the health care professionals", desc: "Equipping professionals with advanced training." },
        { title: "Empathize the senior & patient families with 24/7 availability", desc: "Always available to offer understanding and support." }
      ].map((f, idx) => (
        <motion.div
          key={idx}
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1, duration: 0.6 }}
          className="mb-12 ml-6 relative"
        >
         
          <span className="absolute -left-10 flex items-center justify-center w-8 h-8 bg-[#50c896] rounded-full ring-4 ring-white">
            <Star size={18} color="white" />
          </span>

     
          <h3 className="text-xl font-semibold text-[#1392d3] mb-2">
            <span className="text-[#ff1493]">{f.title[0]}</span>
            {f.title.slice(1)}
          </h3>
          <p className="text-[#6b8193] leading-relaxed">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>





            <section className="py-18 px-6 bg-[#f9fdfd] border-t border-[#efefff]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-[#ff1493] text-center">Why Choose US !</h2>
                    <p className="text-lg text-[#48697e] mb-12 text-center">
                    Transparent plan and service orientation for benefit of Patients
                    </p>
       <div className="grid md:grid-cols-2 gap-8">
  {pricing.map((plan, idx) => (
    <motion.div
      key={idx}
      initial={{ y: 32, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.04 + idx * 0.09 }}
      className="rounded-2xl p-10 border border-[#e0eff5] shadow-lg bg-white 
                 hover:shadow-2xl transition 
                 flex flex-col h-full"
    >
   
      <h3 className="text-xl font-bold mb-3 text-[#1392d3]">
        {plan.name}
      </h3>

     
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        {plan.description}
      </p>

  
      <ul className="text-[#628fa1] space-y-3 text-left mb-8">
        {plan.features.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-[#50c896] font-bold">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

   
      <motion.button
        whileHover={{ scale: 1.03 }}
        onClick={ViewContactInfo}
        className="mt-auto bg-[#1392d3] text-white font-semibold px-7 py-3 
                   rounded-full w-full text-center shadow hover:shadow-lg transition"
      >
        Contact Us
      </motion.button>
    </motion.div>
  ))}
</div>


                </div>
            </section>
            <AnimatePresence>
  {ShowPopUp && (
    <motion.div
      key="popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative bg-white rounded-xl shadow-2xl p-6 w-[90%] lg:w-[40%]  md:w-[60%]"
        onClick={(e) => e.stopPropagation()}
      >
       
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
          onClick={() => setShowPopUp(false)}
        >
          &times;
        </button>

        <FreeConsultationForm />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>



            <section className="py-16 bg-[#f6f9fd] border-t border-[#e5e7eb]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-9 text-[#1392d3] text-center">
                        What Our Users Say
                    </h2>
                  <div className="grid md:grid-cols-2 gap-8">
  {visibleReviews.map((t, idx) => (
    <motion.div
      key={idx}
      initial={{ scale: 0.98, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + idx * 0.08 }}
      className="bg-white/90 border border-[#e0eff5] rounded-2xl shadow p-7 flex flex-col min-h-[220px] group hover:shadow-lg transition"
    >
      {/* Review */}
      <p className="text-[#527290] text-lg italic flex-1 leading-relaxed">
        “{t.review}”
      </p>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: t.rating }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">★</span>
        ))}
      </div>

      {/* Reviewer */}
      <div className="mt-3">
        <p className="font-semibold text-[#ff1493] group-hover:text-[#50c896] transition">
          {t.reviewerName}
        </p>
        <p className="text-sm text-gray-500">{t.reviewerMeta}</p>
      </div>

      {/* Owner Reply */}
      {t.ownerReply && (
        <div className="mt-4 bg-[#f5fbfd] border border-[#e0eff5] rounded-xl p-4">
          <p className="text-sm font-semibold text-[#1392d3]">
            {t.ownerReply.company}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {t.ownerReply.message}
          </p>
        </div>
      )}
    </motion.div>
  ))}
</div>
{reviews.length > INITIAL_REVIEWS_COUNT && (
  <div className="flex justify-center mt-10">
    <button
      onClick={() => setShowAllReviews((prev) => !prev)}
      className='px-8 py-3 rounded-full font-semibold
bg-white text-[#ff1493]
border-2 border-[#ff1493]
shadow-sm
hover:bg-[#ff1493] hover:text-white
hover:shadow-md cursor-pointer
transition-all duration-300
'
    >
      {showAllReviews ? "Show Less Reviews" : "See More Reviews"}
    </button>
  </div>
)}

                </div>
            </section>


<h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
  Our <span className="text-teal-600">Partners</span>
</h1>

<div className="relative w-full overflow-hidden bg-white py-10">
      
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

     
      <div className="flex gap-16 whitespace-nowrap animate-scroll">
        {[...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt="Partner logo"
            className="h-16 w-auto object-contain grayscale opacity-80 grayscale-0 opacity-100 transition duration-300"
          />
        ))}
      </div>
    </div>

          
{/* <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
  <a
    href="https://www.instagram.com/yourprofile"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-4 py-3 rounded-full
               bg-white shadow-lg border hover:shadow-xl transition"
  >
    <img src="Icons/Insta.gif" className="w-6 h-6" />
    <span className="text-sm font-medium">Instagram</span>
  </a>

  <a
    href="https://www.linkedin.com/in/yourprofile"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-4 py-3 rounded-full
               bg-white shadow-lg border hover:shadow-xl transition"
  >
    <img src="Icons/Linkedin.gif" className="w-6 h-6" />
    <span className="text-sm font-medium">LinkedIn</span>
  </a>
</div> */}

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

<div id='ContactInformation'>
<ModernFooter/>
</div>
            
        </div>
    );
}



