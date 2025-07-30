
import {
  ShieldCheck, HeartPulse, HelpingHand,
  Users, UserCheck, Award,
  BriefcaseMedical,
  User,
  LogIn,
  Sparkles,
  Menu,Activity, Heart, Thermometer, Mic, Apple,
  BookOpen, Music, Hammer, Brain,
  PersonStanding, 
} from "lucide-react";


export const heroContent = {
  title: 'A Complete Home Health Professional',
  subtitle: 'We care for you and your beloved. Supporting your health journey with compassionate homecare services.',
  ctaPrimary: 'Contact Us',
  ctaSecondary: 'Learn More',
};

export const features = [
  { title: 'Homecare Assistance', desc: 'Professional care attendants to support you at home.' },
  { title: 'Trained Caretakers', desc: 'Well-trained staff providing patient care with patience and empathy.' },
  { title: 'Flexible Support', desc: 'Customized care solutions based on your health and home needs.' },
  { title: 'Wide Specialist Network', desc: 'Access to specialists and nursing care as per requirement.' },
  { title: 'Trusted by Families', desc: 'Positive feedback and satisfaction from our clients and their loved ones.' },
];

export const pricing = [
  {
    name: 'Basic Care Package',
    price: 'Contact for Pricing',
    features: [
      'Certified Care Attendants',
      'Home Assistance',
      'Daily Health Monitoring',
      'Flexible Scheduling',
    ],
  },
  {
    name: 'Comprehensive Care Package',
    price: 'Contact for Pricing',
    features: [
      'All features in Basic Care',
      'Specialist Access',
      'Nursing Care Days Included',
      'Personalized Care Plans',
    ],
    highlighted: true,
  },
];

export const testimonials = [
  {
    quote: 'My grandmother was bedridden post hip surgery. The caretaker Ms. Madhuri showed great patience and care. Thanks, Curate!',
    name: 'Family of Patient',
  },
  {
    quote: 'They provided a well-trained caretaker for my mother-in-law. I am totally satisfied with their service.',
    name: 'Satisfied Client',
  },
  {
    quote: 'Curate’s attendant Ms. Durga Bhavani was extremely flexible and sympathetic. Highly recommend their services.',
    name: 'Client for 3 months',
  },
];

export const cta = {
  heading: 'Need Reliable Home Health Care?',
  subheading: 'Reach out to Curate Health Services today and experience compassionate support at your doorstep.',
  button: 'Contact Us Now',
};

export const services = [
  {
    title: 'Healthcare Assistants',
    icon: '/Icons/healthcare-assistants.png',
  },
  {
    title: 'Nurse At Home 24/7',
    icon: '/Icons/nurse-at-home.jpeg',
  },
  {
    title: 'Physio At Home',
    icon: '/Icons/physio-at-home.jpeg',
  },
  {
    title: 'Labs At Home',
    icon: '/Icons/Lab-at-Home.png',
  },
  {
    title: 'Medical Equipment',
    icon: '/Icons/medical-equipment.png',
  },
];


export const images = {
  hero: "https://images.unsplash.com/photo-1515165562835-cd4ceaca1eac?auto=format&fit=crop&w=1200&q=80",
  journey: [
    {
      label: "Wellness Programs",
      img: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=900&q=80",
      icon: ShieldCheck,
      text: "Empower your team with nutrition plans, fitness workshops, and mental health resources—no one-size-fits-all solutions.",
    },
    {
      label: "Rehabilitation",
      img: "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?auto=format&fit=crop&w=900&q=80",
      icon: HelpingHand,
      text: "Seamless return-to-work programs: onsite therapy, remote monitoring, and custom care pathways.",
    },
    {
      label: "Health Screening",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
      icon: HeartPulse,
      text: "Pop-up clinics, smart diagnostics, and proactive risk assessment. Prevention meets convenience.",
    },
  ],
  highlights: [
    {
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
      icon: Users,
      title: "Clients Served",
      stat: "15,000+",
      desc: "Professionals empowered nationwide",
    },
    {
      img: "Icons/Recognisation.png",
      icon: Award,
      title: "Recognition",
      stat: "2024",
      desc: "Industry-voted Best Wellness Provider",
    },
    {
      img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
      icon: UserCheck,
      title: "Corporate Partnerships",
      stat: "120+",
      desc: "Trusted by global leaders",
    },
  ],
};

export const DigitalAiHealservices = [
  {
    title: "Ayurveda",
    desc: "Ancient science meets digital intelligence—restoring balance and well-being through holistic traditions and modern insights.",
    icon: Activity, image: "Icons/Ayurvedha.png"
  },
  {
    title: "Modern Medicine",
    desc: "Cutting-edge care enabled by AI, blending the latest evidence-based practice with a personalized, tech-empowered approach.",
    icon: Heart, image: "Icons/medicine.png"
  },
  {
    title: "Physiotherapy",
    desc: "Movement and recovery guided by smart rehabilitation tools—supporting you on your journey towards optimal function.",
    icon: Thermometer, image: "Icons/physio.png"
  },
  {
    title: "Speech Therapy",
    desc: "Connecting voices and unlocking communication with the support of integrated digital and traditional therapies.",
    icon: Mic, image: "Icons/speech.png"
  },
  {
    title: "Nutrition",
    desc: "Personalized dietary guidance powered by expert knowledge and AI insights for lifelong wellness.",
    icon: Apple, image: "Icons/nutrition.png"
  },
  {
    title: "Yoga & Meditation",
    desc: "Mind and body connectivity, bringing ancient healing into the digital age for greater balance and calm.",
    icon: PersonStanding, image: "Icons/yoga.png"
  },
  {
    title: "Behavior Therapy",
    desc: "Empowering positive change through tech-enhanced behavioral strategies within a compassionate network.",
    icon: BookOpen, image: "Icons/behavior.png"
  },
  {
    title: "Music Therapy",
    desc: "Harnessing the healing power of sound and rhythm—supported by innovative, tech-enabled care.",
    icon: Music, image: "Icons/music.png"
  },
  {
    title: "Occupational Therapy",
    desc: "Fostering independence and daily skills with digital and personalized rehabilitation programs.",
    icon: Hammer, image: "Icons/occupation.png"
  },
  {
    title: "Psychology",
    desc: "Promoting mental wellness and resilience, integrating modern psychology with digital advancement.",
    icon: Brain, image: "Icons/psychology.png"
  }
];