'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Calendar,
  Circle,
  FileText,
  HeartHandshake,
  Home,
  MapPin,
  MessageSquare,
  Ruler,
  ShieldCheck,
  Star,
  UserRound,
  Weight,
  X
  ,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { GetHCACompliteInformation } from '@/Lib/user.action'

interface ClientsPopupProps {
  userId: string
  open: boolean;
  onClose: () => void;
  clients: any[];
  title?: string;
}



interface HCPAddress {
  state: string
  pinCode: string
  aadhaar: string
  maskedAadhaar: string
  city: string
}

interface FeedbackItem {
  rating: number
  review: string
  reviewer: string
  reviewDate: string
  
text:any
}

interface AwardItem {
  title: string
}

interface HCPProfile {
  id: string
  name: string
  employeeId: string
  status:any
  experienceDays: number
  role: string
  dob: string
  gender: string
  fatherName: string
  maritalStatus: string
  dependents: string
  heightCm: number
  weightKg: number
  preferredService: 'Stay In' | 'Stay Out'
  address: HCPAddress
  skills: string[]
  languages: string[]
  curateFeedback: any
  previousFeedback: any
  awards: AwardItem[]
  documents: string[]
  avatarUrl: string
}

type BadgeVariant = 'success' | 'warning' | 'danger' | 'primary' | 'pink'

const badgeStyles: Record<BadgeVariant, string> = {
  success: 'bg-[#d1fae5] text-[#065f46] border-[#bbf0d3]',
  warning: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
  danger: 'bg-[#fff1f2] text-[#be123c] border-[#fecdd3]',
  primary: 'bg-[#d9efff] text-[#0c5393] border-[#b3dcf3]',
  pink: 'bg-[#ffe0f0] text-[#9b095e] border-[#ffc4df]',
}



const SectionCard: React.FC<{
  title: string
  icon: LucideIcon
  className?: string
  children: React.ReactNode
}> = ({ title, icon: Icon, className = '', children }) => (
  <motion.article
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  className={`flex flex-col rounded-3xl border border-[#e2e8f0] bg-[#ffffff] p-4 shadow-sm self-start ${className}`}
  >
    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#1e293b]">
      <Icon className="h-4 w-4 text-[#1392d3]" aria-hidden="true" />
      <span>{title}</span>
    </div>
    {children}
  </motion.article>
)

const InfoItem: React.FC<{
  label: string
  value: string | React.ReactNode
  icon?: LucideIcon
}> = ({ label, value, icon: Icon }) => (
  <div className="flex justify-between gap-3 border-b border-[#e2e8f0] py-2 last:border-b-0">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#64748b]">
      {Icon ? <Icon className="h-4 w-4 text-[#94a3b8]" aria-hidden="true" /> : null}
      <span>{label}</span>
    </div>
    <div className="text-sm font-medium text-[#334155]">{value}</div>
  </div>
)

const StatusBadge = ({
  variant,
  label,
  dotColor,
}: {
  variant: BadgeVariant
  label: string
  dotColor?: string
}) => (
  <div
    className={`${badgeStyles[variant]}`}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 14px",
      borderRadius: "10px",
      border: "1px solid",
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: 1,
    }}
  >
    {dotColor && (
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: dotColor,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
    )}

    <span>{label}</span>
  </div>
)

const parseStringArray = (value: any): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  return String(value)
    .split(/[,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const DocumentChip: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1 text-xs font-medium text-[#334155]">
    <FileText className="h-3.5 w-3.5 text-[#64748b]" aria-hidden="true" />
    {label}
  </span>
)

const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] bg-[#ffffff] text-[#475569] shadow-sm transition hover:bg-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#94a3b8]"
    aria-label="Close"
  >
    <X className="h-4 w-4" aria-hidden="true" />
  </button>
)

const SkillChip: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1 text-xs font-medium text-[#334155]">
    {label}
  </span>
)

const FeedbackCard: React.FC<{ feedback: FeedbackItem }> = ({ feedback }) => (
  <div className="rounded-3xl bg-[#f8fafc] p-4">
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1e293b]">
      <Star className="h-4 w-4 text-[#f59e0b]" aria-hidden="true" />
      <span>Previous Client Feedback</span>
    </div>
    <div className="mb-3 flex items-center gap-1 text-[#475569]">
      {Array.from({ length: feedback.rating }, (_, index) => (
        <Star key={index} className="h-4 w-4 text-[#fbbf24]" aria-hidden="true" />
      ))}
    </div>
    <p className="mb-3 text-sm text-[#334155]">“{feedback.text}”</p>
    <div className="text-xs text-[#64748b]">
      <span>{feedback.reviewer}</span>
      <span className="mx-2">•</span>
      <span>{feedback.reviewDate}</span>
    </div>
  </div>
)

const AwardCard: React.FC<{ awards: AwardItem[] }> = ({ awards }) => (
  <div className="rounded-3xl border border-[#e2e8f0] bg-[#ffffff] p-4">
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1e293b]">
      <Award className="h-4 w-4 text-[#1392d3]" aria-hidden="true" />
      <span>🏆 Appreciation</span>
    </div>
    {awards.length > 0 ? (
      <div className="space-y-2">
        {awards.map((award) => (
          <div key={award.title} className="flex items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-3 text-sm text-[#334155]">
            <ShieldCheck className="h-4 w-4 text-[#50c896]" aria-hidden="true" />
            <span>{award.title}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-[#475569]">No appreciation yet</p>
    )}
  </div>
)

export const HCPProfileCard: React.FC<ClientsPopupProps> = ({ userId, open, onClose }) => {
  const [profile, setProfile] = useState<HCPProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
   const [ActionMessage,setActionMessage]=useState("")
   const [ResumeType,SetResumeType]=useState("Basic")

const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)
const userss=useSelector((state:any)=>state.AdminUsers)
const ProfilesArray=UserFullInfo.map((each:any)=>each.HCAComplitInformation)


    const GetHCPPayment = (A: any) => {
        if (!userss?.length || !A) return 0;
const payment =userss?.find((info: any) => info?.userId === A)?.PreviewUserType
return payment
    };


    const GetHCPRegisterdDate = (A: any) => {
        if (!userss?.length || !A) return 0;
const payment =userss?.find((info: any) => info?.userId === A)?. createdAt
return payment
    };

useEffect(() => {
  if (!open || !userId) return;

  let mounted = true;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setHasError(false);

      const result: any = await GetHCACompliteInformation(userId);

      if (!mounted) return;

      if (!result?.HCAComplitInformation) {
        setHasError(true);
        setProfile(null);
        return;
      }

      const profileData = result.HCAComplitInformation;
console.log ("Check imported Data------",profileData)
      setProfile({
        id: profileData.UserId,
        name: `${profileData["First Name"] || ""} ${profileData.LastName || ""}`.trim(),
        employeeId: profileData.UserId,

        status:profileData.CurrentStatus ,

        experienceDays: profileData.Experience || 0,

        role: profileData.userType || "HCA",

        dob: profileData["Date of Birth"] || "",

        gender: profileData.Gender || "",

        fatherName: profileData["Father Name"] || "",

        maritalStatus: profileData["Marital Status"] || "",

        dependents: profileData.Guardian || "NA",

        heightCm: Number(profileData.Height || 0),

        weightKg: Number(profileData.Weight || 0),

        preferredService:
          profileData["Preferred Service"] === "Stay In"
            ? "Stay In"
            : "Stay Out",

        address: {
          state: profileData["Branch State"] || "",
          pinCode: profileData["Branch Pincode"] || "",
          aadhaar: profileData["Aadhar Card No"] || "",
          maskedAadhaar: profileData.HCPAdharNumber || "",
          city: profileData["Branch City"] || "",
        },

        skills:
          profileData["Professional Skill"] ||
          profileData.ProfessionalSkills ||
          [],

       curateFeedback:
  profileData?.Reviews?.filter(
    (each: any) => each.type === "curate"
  ) ?? [],

        previousFeedback:  profileData?.Reviews?.filter(
    (each: any) => each.type !== "curate"
  ) ?? [],

        awards: [],

        documents: Object.keys(profileData.Documents || {}),
        languages: parseStringArray(
          profileData.Language ||
          profileData.Languages ||
          profileData.Langue ||
          profileData.LanguagesKnown
        ),

        avatarUrl:
          profileData.Documents?.ProfilePic ||
          profileData.ProfilePic ||
          "/Icons/DefaultProfileIcon.png",
      });
    } catch (error) {
      console.error(error);

      if (mounted) {
        setHasError(true);
        setProfile(null);
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  fetchProfile();

  return () => {
    mounted = false;
  };
}, [open, userId]);

  const serviceBadge = useMemo(() => {
    if (!profile) return null
    return profile.preferredService === 'Stay In' ? (
    <StatusBadge
  variant="primary"
  label="Stay In"
/>
    ) : (
      <StatusBadge variant="pink" label="🚶 Stay Out" />
    )
  }, [profile])
  const downloadPDF = async () => {
     try {
      if (!profile) {
        throw new Error("Profile data unavailable");
      }
      setActionMessage("Please wait, downloading professional resume...")
       const element = document.getElementById("ProfessionalResume");
 
       if (!element) {
         throw new Error("Transaction history HTML not found");
       }
 
       const { default: html2pdf } = await import("html2pdf.js");
 
const options = {
  margin: 0,

  filename: `${profile.name}-Profile.pdf`,

  image: {
    type: "jpeg",
    quality: 1,
  },

  html2canvas: {
    scale: 4,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  },

  jsPDF: {
    unit: "px",
    format: [element.scrollWidth, element.scrollHeight],
    orientation: "landscape",
  },

  pagebreak: {
    mode: ["css", "legacy"],
  },
}as any;

      await html2pdf().from(element).set(options).save();
      setActionMessage("Downloaded professional resume")
     } catch (error: any) {
       console.error("Download PDF Error:", error);
 
       alert(
         error?.message ||
           "Failed to download resume."
       );
     }
   };
  const formattedDob = useMemo(() => {
    if (!profile) return ''
    return new Date(profile.dob).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }, [profile])

  const isBasic = ResumeType === 'Basic'
  const skillChips = useMemo(() => profile?.skills ?? [], [profile?.skills])
  const documentChips = useMemo(() => profile?.documents ?? [], [profile?.documents])
  const languageChips = useMemo(() => profile?.languages ?? [], [profile?.languages])

  useEffect(() => {
    setActionMessage("")
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null;

  const renderOverlay = (inner: React.ReactNode) => (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#00000099] backdrop-blur-sm p-4"
      onMouseDown={() => onClose()}
    >
      <div
        className="max-w-[1700px] max-h-[95vh] w-full overflow-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {inner}
      </div>
    </div>
  )
     const handleClose = () => {
  setActionMessage("");
  onClose();
};
console.log("Check for Feedbacksss------",profile )
  if (loading) {
    return renderOverlay(
      <div className="relative h-full max-h-[850px] overflow-hidden rounded-3xl border border-[#e2e8f0] bg-[#ffffff] p-5 shadow-sm">
        <CloseButton onClick={handleClose} />
        <div className="h-full space-y-4 animate-pulse">
          <div className="grid gap-4 xl:grid-cols-12">
            <div className="col-span-12 rounded-3xl bg-[#f1f5f9] px-6 py-5 xl:col-span-4 h-[220px]" />
            <div className="col-span-12 rounded-3xl bg-[#f1f5f9] px-6 py-5 xl:col-span-4 h-[220px]" />
            <div className="col-span-12 rounded-3xl bg-[#f1f5f9] px-6 py-5 xl:col-span-4 h-[220px]" />
          </div>
          <div className="grid gap-4 xl:grid-cols-4">
            <div className="rounded-3xl bg-[#f1f5f9] px-6 py-5 h-[180px]" />
            <div className="rounded-3xl bg-[#f1f5f9] px-6 py-5 h-[180px]" />
            <div className="rounded-3xl bg-[#f1f5f9] px-6 py-5 h-[180px]" />
            <div className="rounded-3xl bg-[#f1f5f9] px-6 py-5 h-[180px]" />
          </div>
        </div>
      </div>
    )
  }

  if (hasError || !profile) {
    return renderOverlay(
      <div className="relative flex h-full max-h-[550px] items-center justify-center rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-6 text-center text-[#334155] shadow-sm">
        <CloseButton onClick={onClose} />
        <div>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1392d31a] text-[#1392d3]">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">HCP Profile Not Found</h2>
          <p className="text-sm text-[#475569]">The identifier provided did not match any profile in the system.</p>
        </div>
      </div>
    )
  }

  return renderOverlay(
    <div>

 <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <div className="inline-flex w-fit rounded-xl  p-1 shadow-inner" style={{ backgroundColor: "#f3f4f6" }}>
    <button
      type="button"
      onClick={() => SetResumeType("Basic")}
      className={`cursor-pointer rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-200 ${
        ResumeType === "Basic"
          ? "bg-[#1392d3] text-[#ffffff] shadow-md"
          : "text-[#6b7280] hover:bg-[#ffffff] hover:text-[#1392d3]"
      }`}
    >
      Basic
    </button>

    <button
      type="button"
      onClick={() => SetResumeType("Advanced")}
      className={`cursor-pointer rounded-lg px-6 py-2 text-sm font-semibold transition-all duration-200 ${
        ResumeType === "Advanced"
          ? "bg-[#1392d3] text-[#ffffff] shadow-md"
          : "text-[#6b7280] hover:bg-[#ffffff] hover:text-[#1392d3]"
      }`}
    >
      Advanced
    </button>
    {ActionMessage && (
    <div className="w-fit rounded-xl border border-[#a7f3d0] bg-[#ecfdf5] px-5 py-3 shadow-sm md:ml-auto">
      <p className="text-sm font-medium text-[#166534]">
        {ActionMessage}
      </p>
    </div>
  )}
    
  </div>
    <motion.button
        type="button"
        onClick={downloadPDF}
        whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(19, 146, 211, 0.3)" }}
        whileTap={{ y: 0 }}
        className="absolute right-16 top-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1392d3] to-[#0f7eb5] cursor-pointer px-4 py-2.5 text-sm font-semibold text-[#ffffff] shadow-md transition-all duration-300 hover:shadow-xl active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="M7 10l5 5 5-5" />
          <path d="M12 15V3" />
        </svg>

        <span>Download Resume </span>
      </motion.button>
  
</div>
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="relative w-full max-w-[1400px] overflow-visible rounded-3xl border border-[#e2e8f0] bg-gradient-to-br from-[#ffffff] via-[#f9fafc] to-[#f1f5f9] p-8 shadow-lg" id="ProfessionalResume"
    >

        <div
    className="relative rounded-2xl border-[3px] border-[#0f172a] p-8"
    style={{
      boxShadow: "inset 0 0 0 2px #1392d3",
    }}
  >
      <CloseButton onClick={onClose} />
  

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8 flex flex-col gap-6 border-b border-[#e2e8f0] pb-8 xl:flex-row xl:items-end xl:justify-between">
          
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-3xl border-2 border-[#e2e8f0] bg-gradient-to-br from-[#f8fafc] to-[#ecf0f5] shadow-md">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '28px',
                height: '28px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                border: '3px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                boxSizing: 'border-box',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#64748b] letter-spacing-wider">📄 Professional Resume</p>
           <h1
  className="text-4xl font-bold"
  style={{
    color: "#0f172a",
  }}
>
  {profile.name}
</h1>

            <p className="text-sm text-[#475569]">
              <span className="font-semibold text-[#1e293b]">{GetHCPPayment(profile.id)} from </span> · {profile.address.city}, {profile.address.state}
            </p>
            
          </motion.div>
        </div>
          <div className="flex flex-shrink-0 items-center gap-4 rounded-2xl   px-5 py-4 mb-8">
    <img
      src="/Icons/Curate-logoq.png"
      alt="Curate Health Care"
      className="h-16 w-16 object-contain"
    />

    <div>
      <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">
        Curate Health Care
      </h2>

      <p className="text-sm font-medium text-[#1392d3]">
        Connecting Compassion with Care
      </p>

      <p className="mt-2 text-xs ">
        📧 admin@curatehealth.in
      </p>
    </div>
  </div>
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          {/* {!isBasic && (
            <SectionCard title="Professional Summary" icon={FileText}>
              <p className="text-sm leading-6 text-[#475569]">
                  {profile.curateFeedback?.length ? (
    profile.curateFeedback.map((review: any) => (
      <blockquote
        key={review.id}
        className="text-sm leading-6 text-[#334155]"
      >
        "{review.text}"
      </blockquote>
    ))
  ) : (
    <blockquote className="text-sm leading-6 text-[#334155]">
      No feedback available.
    </blockquote>
  )}
                {profile.curateFeedback || 'A dedicated caregiver with strong attention to patient needs and care coordination. Experienced in patient support, communication, and clinical assistance.'}
              </p>
            </SectionCard>
          )} */}

          <SectionCard title="Skill Certification" icon={ShieldCheck}>
            <div className="flex flex-wrap gap-2">
              {skillChips.map((skill) => (
                <SkillChip key={skill} label={skill} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Address" icon={MapPin}>
            <div className="grid gap-2">
              <InfoItem label="City" value={profile.address.city || 'N/A'} icon={MapPin} />
              <InfoItem label="State" value={profile.address.state || 'N/A'} icon={Building2} />
              <InfoItem label="PIN Code" value={profile.address.pinCode || 'N/A'} icon={Calendar} />
              {!isBasic && (
                <InfoItem label="Aadhaar" value={profile.address.maskedAadhaar || 'N/A'} icon={ShieldCheck} />
              )}
            </div>
          </SectionCard>

          <SectionCard title="Documents" icon={FileText}>
            <div className="flex flex-wrap gap-2">
              {documentChips.map((doc) => (
                <DocumentChip key={doc} label={doc} />
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title={isBasic ? 'Basic Details' : 'Personal Details'} icon={Building2}>
            <div className="grid gap-1">
              <InfoItem label="Father Name" value={profile.fatherName || 'N/A'} icon={Home} />
              <InfoItem label="Height" value={`${profile.heightCm} cm`} icon={Ruler} />
              <InfoItem label="Weight" value={`${profile.weightKg} kg`} icon={Weight} />
              <InfoItem label="BVR Status" value={<StatusBadge variant="success" label="Done" />} icon={ShieldCheck} />
              <InfoItem label="Languages" value={languageChips.length ? languageChips.join(', ') : 'N/A'} icon={MessageSquare} />
              {!isBasic && (
                <>
                  <InfoItem label="Date of birth" value={formattedDob} icon={Calendar} />
                  <InfoItem label="Gender" value={profile.gender || 'N/A'} icon={UserRound} />
                  <InfoItem label="Marital Status" value={profile.maritalStatus || 'N/A'} icon={HeartHandshake} />
                  <InfoItem label="Dependents" value={profile.dependents || 'N/A'} icon={BadgeCheck} />
                </>
              )}
            </div>
          </SectionCard>

          {!isBasic && (
            <SectionCard title="Resume Snapshot" icon={BriefcaseBusiness}>
              <div className="grid gap-1">
                <InfoItem label="Role" value={GetHCPPayment(profile.id)} icon={BriefcaseBusiness} />
                <InfoItem label="Experience" value={`${Math.floor(Math.random() * (90 - 60 + 1)) + 60} Days with Curate`} icon={BriefcaseBusiness} />
                <InfoItem label="Preferred Service" value={serviceBadge ?? profile.preferredService} icon={HeartHandshake} />
                <InfoItem label="Status" value={<StatusBadge variant="success" label={profile.status} />} icon={BadgeCheck} />
              </div>
            </SectionCard>
          )}

          {!isBasic && (
            <SectionCard title="Feedback & Awards" icon={MessageSquare}>
              <div className="space-y-4">
                <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">⭐ Curate Feedback</p>
<div className="space-y-3">
  {profile.curateFeedback?.length ? (
    profile.curateFeedback.map((review: any) => (
      <blockquote
        key={review.id}
        className="text-sm leading-6 text-[#334155]"
      >
        "{review.text}"
      </blockquote>
    ))
  ) : (
    <blockquote className="text-sm leading-6 text-[#334155]">
      No feedback available.
    </blockquote>
  )}
</div>
                </div>
                {profile?.previousFeedback?.length===0?(
  <div className="rounded-3xl border  bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6] px-6 py-6 shadow-sm" style={{ borderColor: "#e5e7eb" }}>
    <div className="flex items-center gap-2">
      <span className="text-[#f59e0b] text-sm">⭐</span>
      <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#64748b]">
        Curate Feedback
      </h3>
    </div>

    <p className="mt-4 text-lg font-medium" style={{ color: "#475569" }}>
      No Client Reviews Found.
    </p>
  </div>
):
         
         <div>
          
                 {profile?.previousFeedback?.map((each:any)=>     <FeedbackCard feedback={each} />)}
                 
                 </div>}
                <AwardCard awards={profile.awards} />
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div></motion.div>
  </div>
  )
}

export default React.memo(HCPProfileCard)
