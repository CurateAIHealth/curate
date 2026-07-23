import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type IconProps = { className?: string };

const AiFillStar = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const AiOutlineStar = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const AiOutlinePlus = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const AiOutlineSearch = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const AiOutlineHeart = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const AiFillHeart = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.5 3.5 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 18.5 5 20 6.5 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const AiOutlineMessage = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const AiOutlineShareAlt = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98" />
    <path d="M15.41 6.51l-6.82 3.98" />
  </svg>
);

const AiOutlineClose = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const AiOutlineMore = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
  </svg>
);

const AiFillCheckCircle = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
  </svg>
);

const BsImageFill = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Zm-2 0H5V5h14v14Zm-3.5-5.5-2.5 3.01L11 13l-4 5h12l-1.5-3.5Zm-4.5-4a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
  </svg>
);

const BiUpload = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M12 16V4" />
    <path d="m8 8 4-4 4 4" />
    <path d="M4 20h16" />
  </svg>
);

type ReviewType = 'curate' | 'client';

type Review = {
  id: string;
  name: string;
  role: string;
  type: ReviewType;
  rating: number;
  text: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  verified: boolean;
  profileImage: string;
  images: string[];
  isLiked?: boolean;
};
const sampleReviews: Review[] = [
  {
    id: "r1",
    name: "Dr. Sai Kiran Reddy",
    role: "Senior Physician · Yashoda Hospitals, Somajiguda",
    type: "curate",
    rating: 5,
    text: "Curate helped us deploy experienced HCAs within 24 hours. The verification process was smooth, documentation was complete, and patient care quality improved immediately.",
    date: "Jul 18, 2026",
    likes: 82,
    comments: 14,
    shares: 11,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=SaiKiran&backgroundColor=b6e3f4",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r2",
    name: "K. Ramesh Reddy",
    role: "HR Manager · KIMS Hospitals, Secunderabad",
    type: "client",
    rating: 5,
    text: "From recruitment to deployment, everything was handled professionally. We received regular updates and every HCA joined on time.",
    date: "Jul 14, 2026",
    likes: 67,
    comments: 9,
    shares: 6,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=RameshReddy&backgroundColor=c0aede",
    images: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r3",
    name: "Dr. Anusha Lakshmi",
    role: "Pediatrician · Rainbow Children's Hospital, Banjara Hills",
    type: "curate",
    rating: 5,
    text: "The assigned caregiver was compassionate, punctual, and well-trained. Parents appreciated the professionalism shown throughout the admission period.",
    date: "Jun 30, 2026",
    likes: 55,
    comments: 6,
    shares: 4,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=AnushaLakshmi&backgroundColor=ffdfbf",
    images: [
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r4",
    name: "Mohammed Imran",
    role: "Hospital Administrator · CARE Hospitals, HITEC City",
    type: "client",
    rating: 5,
    text: "Curate has become our preferred staffing partner. Replacement requests were handled quickly, reducing workload on our internal HR team.",
    date: "Jun 12, 2026",
    likes: 91,
    comments: 18,
    shares: 13,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=MohammedImran&backgroundColor=d1d4f9",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r5",
    name: "Dr. Kavya Reddy",
    role: "Gynecologist · Apollo Hospitals, Jubilee Hills",
    type: "curate",
    rating: 5,
    text: "Staff quality exceeded our expectations. Every HCA arrived with verified documents and completed onboarding without delays.",
    date: "May 29, 2026",
    likes: 73,
    comments: 10,
    shares: 8,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=KavyaReddy&backgroundColor=ffd5dc",
    images: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r6",
    name: "Srinivas Goud",
    role: "Operations Manager · AIG Hospitals, Gachibowli",
    type: "client",
    rating: 4,
    text: "Excellent experience overall. Faster replacement notifications inside the dashboard would make the platform even better.",
    date: "May 15, 2026",
    likes: 39,
    comments: 7,
    shares: 4,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=SrinivasGoud&backgroundColor=c0aede",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r7",
    name: "Dr. Sneha Reddy",
    role: "Chief Nursing Officer · Sunshine Hospitals, Secunderabad",
    type: "curate",
    rating: 5,
    text: "Reliable HCAs, quick deployment, excellent communication, and outstanding support. Curate has significantly reduced our hiring turnaround time.",
    date: "Apr 28, 2026",
    likes: 102,
    comments: 19,
    shares: 17,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaReddy&backgroundColor=b6e3f4",
    images: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r8",
    name: "Rajesh Kumar",
    role: "Patient Care Manager · Virinchi Hospital, Banjara Hills",
    type: "client",
    rating: 5,
    text: "The attendance dashboard and payroll tracking have made managing healthcare staff much easier. Very impressed with the platform.",
    date: "Apr 05, 2026",
    likes: 47,
    comments: 8,
    shares: 5,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshKumar&backgroundColor=d1d4f9",
    images: [
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r9",
    name: "Dr. Priyanka Sharma",
    role: "Dermatologist · Continental Hospitals, Gachibowli",
    type: "curate",
    rating: 5,
    text: "Professional, caring, and highly skilled HCAs. We have recommended Curate to several hospitals across Hyderabad.",
    date: "Mar 20, 2026",
    likes: 58,
    comments: 9,
    shares: 6,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyankaSharma&backgroundColor=ffdfbf",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    ],
  },

  {
    id: "r10",
    name: "Harsha Vardhan",
    role: "Director · Medicover Hospitals, HITEC City",
    type: "client",
    rating: 5,
    text: "Curate consistently delivers qualified healthcare professionals. The transparency, communication, and ongoing support make them a trusted staffing partner.",
    date: "Mar 03, 2026",
    likes: 76,
    comments: 12,
    shares: 9,
    verified: true,
    profileImage:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=HarshaVardhan&backgroundColor=c0aede",
    images: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=900&q=80",
    ],
  },
];
const badgeStyles = {
  curate: 'bg-[#ff1493]/10 text-[#ff1493] ring-[#ff1493]/20',
  client: 'bg-[#1392d3]/10 text-[#1392d3] ring-[#1392d3]/20',
};
type Props = {
  HCAName: string;
  UserId:any;
  ImportedReviews:any
};

export function HCPReviews({ HCAName,UserId,ImportedReviews }: Props){
  const [reviews, setReviews] = useState<Review[]>(ImportedReviews);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'curate' | 'client' | '5star' | 'images'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewType, setReviewType] = useState<ReviewType>('curate');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('');
  const [rating, setRating] = useState(2);
  const [reviewText, setReviewText] = useState('');
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [UploadStatusMessage,setUploadStatusMessage]=useState("")
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [profilePreview, imagePreviews]);

  const filteredReviews = useMemo(() => {
    let list = reviews;
    if (filterTab === 'curate') {
      list = list.filter((item) => item.type === 'curate');
    }
    if (filterTab === 'client') {
      list = list.filter((item) => item.type === 'client');
    }
    if (filterTab === '5star') {
      list = list.filter((item) => item.rating === 5);
    }
    if (filterTab === 'images') {
      list = list.filter((item) => item.images.length > 0);
    }
    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query)
      );
    }
    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      return a.rating - b.rating;
    });
    return sorted;
  }, [reviews, search, filterTab, sortBy]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  }, [reviews]);

  const curateCount = reviews.filter((item) => item.type === 'curate').length;
  const clientCount = reviews.filter((item) => item.type === 'client').length;




  const handleProfileUpload = useCallback(
  async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadStatusMessage("Please Wait Uploading Profile Picture....");

    const file = e.target.files?.[0];
    const inputName = e.target.name;

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max allowed is 10MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only image, video, or PDF files are allowed.");
      return;
    }

    const formDataData = new FormData();
    formDataData.append("file", file);

    try {
      const res = await axios.post("/api/Upload", formDataData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res?.data?.url;

      if (url) {
          setProfileFile(url);
    setProfilePreview(url);
      }

      setUploadStatusMessage("Profile Picture Uploaded Successfully");
    } catch (error: any) {
      console.error("Upload failed:", error.message);
      setUploadStatusMessage("Upload Failed");
    }
  },
  []
);



    const handleImageUpload = useCallback(
  async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadStatusMessage("Please Wait Uploading Review Image....");

    const file = e.target.files?.[0];
    const inputName = e.target.name;

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max allowed is 10MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only image, video, or PDF files are allowed.");
      return;
    }

    const formDataData = new FormData();
    formDataData.append("file", file);

    try {
      const res = await axios.post("/api/Upload", formDataData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res?.data?.url;

   if (url) {
  setImageFiles((prev) => [...prev, file]);
  setImagePreviews((prev) => [...prev, url]);
}

      setUploadStatusMessage("Review Image Uploaded Successfully");
    } catch (error: any) {
      console.error("Upload failed:", error.message);
      setUploadStatusMessage("Upload Failed");
    }
  },
  []
);

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
    setImageFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handlePublish = async() => {
    if (!reviewerName.trim() ||  !reviewText.trim()) {
      setUploadStatusMessage("Please Enter Reviewer Name& Review!")
      return;
    }

    setUploadStatusMessage("Please Wait Posting Review......")
    const newReview: Review = {
      id: UserId,
      name: reviewerName.trim(),
      role: reviewerRole.trim(),
      type: reviewType,
      rating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likes: 0,
      comments: 0,
      shares: 0,
      verified: true,
      profileImage:
        profilePreview || 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=200&q=80',
      images: imagePreviews,
      isLiked: false,
    };
    
const PostReview=await axios.post("api/NewReview",{newReview,UserId})
console.log("CheckReview Status------",PostReview.data.success)
alert(UserId)
if(PostReview.data.success){
 setUploadStatusMessage("Review Posted Successfully")
    setReviews((prev) => [newReview, ...prev]);
    setDrawerOpen(false);
    setReviewType('curate');
    setReviewerName('');
    setReviewerRole('');
    setRating(5);
    setReviewText('');
    setProfileFile(null);
    setProfilePreview('');
    setImageFiles([]);
    setImagePreviews([]);
}else{
  setUploadStatusMessage("Review Posted Failed!")
    setReviews((prev) => [newReview, ...prev]);
    setDrawerOpen(false);
    setReviewType('curate');
    setReviewerName('');
    setReviewerRole('');
    setRating(5);
    setReviewText('');
    setProfileFile(null);
    setProfilePreview('');
    setImageFiles([]);
    setImagePreviews([]);
}

   
  };

  const toggleLike = (id: string) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id !== id) return review;
        const liked = !!review.isLiked;
        return {
          ...review,
          isLiked: !liked,
          likes: liked ? review.likes - 1 : review.likes + 1,
        };
      })
    );
  };

  const filterChips = [
    { label: 'All', value: 'all' },
    { label: 'Curate', value: 'curate' },
    { label: 'Client', value: 'client' },
    { label: '5 Star', value: '5star' },
    { label: 'With Images', value: 'images' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#50c896]/20 bg-white px-5 py-2.5 shadow-sm transition-all duration-300 hover:shadow-md">
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#50c896]/10">
    <span className="text-base text-[#ff1493]">⭐</span>
  </div>

 <div className="flex flex-col">
  <span className="text-sm font-semibold text-[#1392d3]">
    {HCAName}
  </span>

  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
    Reviews & Feedback
  </h1>

  <span className="mt-1 text-sm text-slate-500">
    View and manage all Curate and Client reviews
  </span>
</div>
</div>
              <div className="space-y-2">
                <p className="text-4xl font-semibold tracking-tight ">{averageRating.toFixed(1)}</p>
                <div className="flex items-center gap-1 text-[#ff1493]">
                  {Array.from({ length: 5 }).map((_, idx) =>
                    idx < Math.round(averageRating) ? <AiFillStar key={idx} /> : <AiOutlineStar key={idx} />
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-[#50c896]/30 bg-[#50c896] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-[#50c896]/20 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#3fae7a]"
            >
              <AiOutlinePlus className="h-5 w-5" />
              New Review
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border  bg-white/5 p-5 shadow-sm shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Average Rating</p>
              <p className="mt-3 text-3xl font-semibold text-[#ff1493]">{averageRating.toFixed(1)}</p>
            </div>
            <div className="rounded-3xl border  bg-white/5 p-5 shadow-sm shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Total Reviews</p>
              <p className="mt-3 text-3xl font-semibold text-[#1392d3]">{reviews.length}</p>
            </div>
            <div className="rounded-3xl border  bg-white/5 p-5 shadow-sm shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Curate Reviews</p>
              <p className="mt-3 text-3xl font-semibold text-[#ff1493]">{curateCount}</p>
            </div>
            <div className="rounded-3xl border bg-white/5 p-5 shadow-sm shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Client Reviews</p>
              <p className="mt-3 text-3xl font-semibold text-[#1392d3]">{clientCount}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-[2rem] border border-slate-200/70 bg-slate-100/90 p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:flex lg:items-center lg:justify-between">
          <div className="flex-1">
            <label className="relative block">
              <AiOutlineSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews, names, health systems..."
                className="w-full rounded-3xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-950 outline-none transition focus:border-[#1392d3] focus:ring-2 focus:ring-[#50c896]/20"
              />
            </label>
          </div>
         <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
  
  <div className="flex flex-wrap gap-3">
    {filterChips.map((chip) => {
      const active = filterTab === chip.value;

      return (
        <button
          key={chip.value}
          type="button"
          onClick={() => setFilterTab(chip.value)}
          className={`group relative overflow-hidden rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
            active
              ? "border-[#50c896] bg-[#50c896]  shadow-lg shadow-[#50c896]/30 scale-105"
              : "border-slate-300 bg-white text-slate-700 hover:border-[#1392d3] hover:bg-[#1392d3]/10 hover:text-[#1392d3] hover:shadow-md"
          }`}
        >
          <span className="relative z-10">{chip.label}</span>

          {!active && (
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          )}
        </button>
      );
    })}
  </div>

  
  <div className="relative w-full sm:w-64">
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
      className="w-full appearance-none rounded-full border border-slate-300 bg-white px-5 py-3 pr-12 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all duration-300 hover:border-[#1392d3] focus:border-[#1392d3] focus:ring-4 focus:ring-[#50c896]/20"
    >
      <option value="newest">🕒 Newest First</option>
      <option value="oldest">📅 Oldest First</option>
      <option value="highest">⭐ Highest Rating</option>
      <option value="lowest">⭐ Lowest Rating</option>
    </select>

   
    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#1392d3]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
</div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-[2rem] border border-slate-200/70 bg-slate-100/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.08)]"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-800" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/4 rounded-full bg-slate-800" />
                    <div className="h-4 w-1/2 rounded-full bg-slate-800" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-slate-800" />
                  <div className="h-4 w-full rounded-full bg-slate-800" />
                  <div className="h-4 w-5/6 rounded-full bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-200/50 bg-white/90 p-12 text-center text-slate-600 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.08)]">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-white/5 text-[#1392d3] shadow-lg shadow-[#1392d3]/10">
              <BsImageFill className="h-12 w-12" />
            </div>
            <h2 className="mt-8 text-3xl font-semibold ">No Reviews Yet</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm text-slate-400">Add your first review to build trust and showcase verified feedback from clients and Curate reviews.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredReviews.map((review,index) => (
              <div
                key={index}
                className="group rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#50c896]/50 hover:bg-slate-100"
              >
                        
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <img src={review.profileImage} alt={review.name} className="h-14 w-14 rounded-3xl object-cover ring-1 ring-white/10" />
                                <div>
                                    <p className="font-semibold ">{review.name}</p>
                                    <p className="text-sm text-slate-700">{review.role}</p>
                                </div>
                            </div>
                            <button className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 ">
                                <AiOutlineMore className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[review.type]} ring-1`}>
                                <AiFillCheckCircle className="h-3.5 w-3.5" />
                                Verified {review.type === 'curate' ? 'Curate' : 'Client'}
                            </span>
                            <div className="ml-auto flex items-center gap-1 text-[#ff1493]">
                                {Array.from({ length: 5 }).map((_, idx) => idx < review.rating ? <AiFillStar key={idx} className="h-4 w-4" /> : <AiOutlineStar key={idx} className="h-4 w-4" />
                                )}
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-900">{review.text}</p>
                        {review.images.length > 0 && (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {review.images.map((image, idx) => (
                                    <button
                                        key={image + idx}
                                        type="button"
                                        onClick={() => setModalImage(image)}
                                        className="overflow-hidden rounded-3xl border  bg-slate-950/70 transition hover:scale-[1.02]"
                                    >
                                        <img src={image} alt={`review-${idx}`} className="h-32 w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t  pt-4 text-sm text-slate-400">
                            {/* <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => toggleLike(review.id)}
                                    className="inline-flex items-center gap-2 rounded-full border  bg-white/5 px-3 py-2 text-slate-900 transition hover:border-[#ff1493] "
                                >
                                    {review.isLiked ? <AiFillHeart className="h-4 w-4 text-[#ff1493]" /> : <AiOutlineHeart className="h-4 w-4" />}
                                    {review.likes}
                                </button>
                                <div className="inline-flex items-center gap-2 rounded-full border  bg-white/5 px-3 py-2 text-slate-900">
                                    <AiOutlineMessage className="h-4 w-4" /> {review.comments}
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border  bg-white/5 px-3 py-2 text-slate-900">
                                    <AiOutlineShareAlt className="h-4 w-4" /> {review.shares}
                                </div>
                            </div> */}
                            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{review.date}</span>
                        </div>
                    </div>
            ))}
          </div>
        )}
      </div>

      <div className={`fixed inset-0 z-50 ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'} flex`}>
        <div
          className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setDrawerOpen(false)}
        />
        <div className={`relative ml-auto flex h-full w-full max-w-xl transform flex-col bg-white/95 p-6 shadow-2xl transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#ff1493]">Add Review</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#1392d3]">New Review For {HCAName} </h2>
             {UploadStatusMessage && (
  <div
    className={`mt-4 rounded-xl px-4 py-3 shadow-sm transition-all duration-300 ${
      UploadStatusMessage.toLowerCase().includes("success")
        ? "border border-[#50c896]/30 bg-[#50c896]/10 text-[#166534]"
        : UploadStatusMessage.toLowerCase().includes("error")
        ? "border border-red-300 bg-red-50 text-red-700"
        : "border border-yellow-300 bg-yellow-50 text-yellow-700"
    }`}
  >
    <p className="text-sm font-semibold">{UploadStatusMessage}</p>
  </div>
)}
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-3xl border bg-slate-900/80 text-slate-900 transition cursor-pointer hover:shadow-lg bg-white/10"
            >
              <AiOutlineClose className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2">
            <div className="rounded-3xl border bg-white/5 p-5">
              <p className="text-sm font-medium text-slate-900">Review Type</p>
            <div className="mt-5">
  <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-sm">
    {[
      { value: "curate", label: "🏥 Curate Review" },
      { value: "client", label: "🤝 Client Review" },
    ].map((item) => (
      <label
        key={item.value}
        className={`relative cursor-pointer rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
          reviewType === item.value
            ? "bg-[#50c896]  shadow-md"
            : "text-slate-600 hover:bg-white hover:text-[#50c896]"
        }`}
      >
        <input
          type="radio"
          name="reviewType"
          value={item.value}
          checked={reviewType === item.value}
          onChange={() => setReviewType(item.value as ReviewType)}
          className="hidden"
        />

        <span className="flex items-center gap-2">
          {item.label}
        </span>
      </label>
    ))}
  </div>
</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block rounded-3xl border bg-white/5 p-4">
                <span className="text-sm font-medium text-slate-900">Reviewer Name</span>
                <input
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="mt-3 w-full bg-transparent  outline-none placeholder:text-slate-500"
                  placeholder="Enter Your Name"
                />
              </label>
              {reviewType!=="client"&&
              <label className="block rounded-3xl border bg-white/5 p-4">
                <span className="text-sm font-medium text-slate-900">Designation / Company</span>
                <input
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  className="mt-3 w-full bg-transparent  outline-none placeholder:text-slate-500"
                  placeholder="Ex: Application Developer"
                />
              </label>}
            </div>

            <div className="rounded-3xl border bg-white/5 p-5">
              <p className="text-sm font-medium text-slate-900">Rating</p>
           <div className="mt-4 flex items-center gap-2 text-[#ff1493]">
  {Array.from({ length: 5 }).map((_, idx) => (
    <button
      key={idx}
      type="button"
      onClick={() => setRating(rating === idx + 1 ? 0 : idx + 1)}
      className="transition hover:-translate-y-0.5"
    >
      {idx < rating ? (
        <AiFillStar className="h-7 w-7" />
      ) : (
        <AiOutlineStar className="h-7 w-7" />
      )}
    </button>
  ))}
</div>
            </div>

            <label className="block rounded-3xl border bg-white/5 p-5">
              <span className="text-sm font-medium text-slate-900">Review Text</span>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={6}
                className="mt-4 w-full resize-none bg-transparent  outline-none placeholder:text-slate-500"
                placeholder="Write your review content here..."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border  bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Profile Image Upload</p>
                    <p className="mt-1 text-xs text-slate-500">Optional preview for reviewer avatar.</p>
                  </div>
                  <BiUpload className="h-6 w-6 text-[#1392d3]" />
                </div>
                <label className="mt-4 flex h-40 w-full cursor-pointer items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-100 text-center transition hover:border-[#1392d3] hover:bg-slate-200">
                  {profilePreview ? (
                    <img src={profilePreview} alt="profile preview" className="h-full w-full rounded-3xl object-cover" />
                  ) : (
                    <span className="text-sm text-slate-400">Click to upload profile image</span>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
                </label>
              </div>

              <div className="rounded-3xl border  bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Review Images Upload</p>
                    <p className="mt-1 text-xs text-slate-500">Add multiple images for the review.</p>
                  </div>
                  <BiUpload className="h-6 w-6 text-[#ff1493]" />
                </div>
                <label className="mt-4 flex h-40 w-full cursor-pointer items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-100 text-center transition hover:border-[#ff1493] hover:bg-slate-200">
                  <span className="text-sm text-slate-400">Click to add images</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {imagePreviews.map((image, index) => (
                      <div key={`${image}-${index}`} className="relative overflow-hidden rounded-3xl border  bg-slate-950/60">
                        <img src={image} alt={`preview-${index}`} className="h-24 w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-slate-950/90 p-2 text-slate-100 transition hover:bg-[#ff1493]"
                        >
                          <AiOutlineClose className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex min-w-[10rem] items-center justify-center rounded-3xl bg-[#50c896] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#3fae7a]"
            >
              Publish Review
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex min-w-[10rem] items-center justify-center rounded-3xl border  bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-6">
          <button
            type="button"
            onClick={() => setModalImage(null)}
            className="absolute right-6 top-6 inline-flex h-12 w-12 items-center justify-center rounded-full border  bg-slate-900/80 text-slate-100 transition hover:bg-white/10"
          >
            <AiOutlineClose className="h-6 w-6" />
          </button>
          <div className="max-h-full w-full max-w-4xl overflow-hidden rounded-[2rem] border  bg-slate-900/95 shadow-2xl">
            <img src={modalImage} alt="Fullscreen review" className="h-full w-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

export default HCPReviews;
