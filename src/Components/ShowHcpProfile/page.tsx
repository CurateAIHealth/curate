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
}

interface AwardItem {
  title: string
}

interface HCPProfile {
  id: string
  name: string
  employeeId: string
  status: 'Active' | 'Inactive' | 'Pending'
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
  curateFeedback: string
  previousFeedback: FeedbackItem
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

// const getHCPProfile = async (userId: string): Promise<HCPProfile | null> => {
//   await new Promise((resolve) => setTimeout(resolve, 650))

//   if (!userId || userId.trim().length === 0) {
//     return null
//   }

//   return {
//     id: 'CUR-1024',
//     name: 'Priya Sharma',
//     employeeId: 'CUR-1024',
//     status: 'Active',
//     experienceDays: 148,
//     role: 'Senior Care Partner',
//     dob: '1991-10-22',
//     gender: 'Female',
//     fatherName: 'Ramesh Sharma',
//     maritalStatus: 'Married',
//     dependents: '2 dependents',
//     heightCm: 165,
//     weightKg: 58,
//     preferredService: 'Stay In',
//     address: {
//       state: 'Telangana',
//       pinCode: '500081',
//       aadhaar: 'XXXX XXXX 2541',
//       maskedAadhaar: 'XXXX XXXX 2541',
//       city: 'Hyderabad',
//     },
//     skills: [
//       'Dementia Care',
//       'Stroke Patient',
//       'Bedridden Care',
//       'Catheter Care',
//       'Feeding Tube',
//       'Elderly Care',
//       'ICU Experience',
//     ],
//     curateFeedback:
//       'Very punctual, caring and maintains excellent communication with patients.',
//     previousFeedback: {
//       rating: 5,
//       review:
//         'Priya supported the family with empathy and kept the patient comfortable at every stage.',
//       reviewer: 'Sunita Rao',
//       reviewDate: 'May 8, 2025',
//     },
//     awards: [{ title: 'Best Employee 2025' }, { title: 'Star Caregiver Award' }],
//     documents: ['Aadhaar', '10th Certificate', 'PAN', 'Medical Certificate'],
//     avatarUrl:
//       'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
//   }
// }

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
    <p className="mb-3 text-sm text-[#334155]">“{feedback.review}”</p>
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

const UserFullInfo=useSelector((state:any)=>state.AdminFullInfo)
const ProfilesArray=UserFullInfo.map((each:any)=>each.HCAComplitInformation)
console.log ("Check Profile----",ProfilesArray.find((each:any)=>each.
UserId===userId
))
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

      setProfile({
        id: profileData.UserId,
        name: `${profileData["First Name"] || ""} ${profileData.LastName || ""}`.trim(),
        employeeId: profileData.UserId,

        status:
          profileData.CurrentStatus === "Active"
            ? "Active"
            : "Inactive",

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
          profileData["Curate Feedback"] ||
          "No feedback available.",

        previousFeedback: {
          rating: 5,
          review: "No previous feedback available.",
          reviewer: "Curate",
          reviewDate: "",
        },

        awards: [],

        documents: Object.keys(profileData.Documents || {}),

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
      setActionMessage("Please Wait Downloading Profile.......")
       const element = document.getElementById("ComplitePaySlip");
 
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
      setActionMessage("DownLoaded  Profile")
     } catch (error: any) {
       console.error("Download PDF Error:", error);
 
       alert(
         error?.message ||
           "Failed to download transaction history."
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

  const skillChips = useMemo(() => profile?.skills ?? [], [profile?.skills])
  const documentChips = useMemo(() => profile?.documents ?? [], [profile?.documents])

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
           {ActionMessage&&
  <div className="my-4 rounded-xl border border-[#a7f3d0] bg-[#ecfdf5] px-5 py-4 shadow-sm">
  <p className="text-sm font-medium text-[#166534]">
    {ActionMessage}
  </p>
</div>}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
        className="relative w-full w-[1400px] max-w-none overflow-visible rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-3 shadow-sm" id="ComplitePaySlip"
    >
     
     
      <CloseButton onClick={onClose} />
   <button
  type="button"
  onClick={downloadPDF}
  className="absolute right-16 top-4 inline-flex items-center gap-2 rounded-xl bg-[#1392d3] cursor-pointer px-4 py-2 text-sm font-semibold text-[#ffffff] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f7eb5] hover:shadow-lg active:translate-y-0"
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

  <span>Download Profile</span>
</button>
   <div className="grid grid-cols-12 gap-4 items-start">
        <div className="col-span-12 xl:col-span-4">
          <SectionCard title="Profile" icon={UserRound}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
              <div
    className="flex items-center gap-5"
    style={{
        alignItems: "center",
        flexWrap: "nowrap",
    }}
>
  {/* HCP Profile */}
  <div className="relative h-24 w-24">
    <img
      src={profile.avatarUrl}
      alt={profile.name}
      className="h-24 w-24 rounded-full border border-[#e2e8f0] object-cover shadow-sm"
    />

    {/* Verified Badge */}
    <div
  style={{
    position: "absolute",
    top: "2px",
    right: "2px",
    width: "24px",
    height: "24px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
    border: "2px solid #ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    boxSizing: "border-box",
  }}
>
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
</div>
  </div>
 <div className="flex-1 space-y-2">
    <p className="text-sm uppercase tracking-[0.24em] text-[#94a3b8]">
        Care Partner
    </p>

    <h1
        className="text-2xl font-semibold text-[#0f172a] break-words"
        style={{
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "unset",
        }}
    >
        {profile.name}
    </h1>

    
</div>
  {/* Company Logo */}
  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#e2e8f0] bg-[#ffffff] shadow-sm">
    <img
      src="/Icons/Curate-logoq.png"
      alt="Curate Logo"
      className="h-10 w-10 object-contain"
    />
  </div>


  
</div>
               
              </div>
              <div className="grid gap-3">
                <StatusBadge
  variant="success"
  label="Active"
/>
                <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#64748b]"> 
                    <BriefcaseBusiness className="h-4 w-4 text-[#1392d3]" aria-hidden="true" />
                    <span>Experience</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-[#0f172a]">{profile.experienceDays} Days with Curate</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <SectionCard title="Personal Details" icon={Building2}>
            <div className="grid gap-1">
              <InfoItem label="Date of birth" value={formattedDob} icon={Calendar} />
              <InfoItem label="Gender" value={profile.gender} icon={UserRound} />
              <InfoItem label="Father Name" value={profile.fatherName} icon={Home} />
              <InfoItem label="Height" value={`${profile.heightCm} cm`} icon={Ruler} />
              <InfoItem label="Weight" value={`${profile.weightKg} kg`} icon={Weight} />
              <InfoItem label="Preferred Service" value={serviceBadge ?? profile.preferredService} icon={HeartHandshake} />
            </div>
          </SectionCard>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <SectionCard title="Professional Details" icon={ShieldCheck}>
       <div className="flex flex-col gap-4">
              <div className="grid gap-1">
                <InfoItem label="Role" value={profile.role} icon={BriefcaseBusiness} />
                <InfoItem label="City" value={profile.address.city} icon={MapPin} />
                <InfoItem label="State" value={profile.address.state} icon={Building2} />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">Special Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skillChips.map((skill) => (
                    <SkillChip key={skill} label={skill} />
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
<div className="mt-2 grid items-start gap-2 xl:grid-cols-4">
        <SectionCard title="Family" icon={Home}>
          <div className="grid gap-1">
            <InfoItem label="Father Name" value={profile.fatherName} icon={UserRound} />
            <InfoItem label="Marital Status" value={profile.maritalStatus} icon={HeartHandshake} />
            <InfoItem label="Dependents" value={profile.dependents} icon={BadgeCheck} />
            <InfoItem label="Service Type" value={profile.preferredService} icon={Home} />
          </div>
        </SectionCard>

        <SectionCard title="Address" icon={MapPin}>
          <div className="grid gap-1">
            <InfoItem label="State" value={profile.address.state} icon={Building2} />
            <InfoItem label="PIN Code" value={profile.address.pinCode} icon={Calendar} />
            <InfoItem label="Aadhaar" value={profile.address.maskedAadhaar} icon={ShieldCheck} />
          </div>
        </SectionCard>

        <SectionCard title="Feedback" icon={MessageSquare}>
          <div className="space-y-2">
            <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-2">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">⭐ Curate Feedback</p>
              <blockquote className="text-xs leading-5 text-[#334155]">" {profile.curateFeedback}"</blockquote>
            </div>
            <FeedbackCard feedback={profile.previousFeedback} />
            <AwardCard awards={profile.awards} />
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
    </motion.div>
    </div>

  )
}

export default React.memo(HCPProfileCard)
