"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Presentation,
  ClipboardList,
  Plus,
  Search,
  Download,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
  Link as LinkIcon,
  X,
  Upload,
  Youtube,
  Instagram,
  Grid3X3,
  List,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";

type MaterialType =
  | "ppt"
  | "pdf"
  | "image"
  | "video"
  | "youtube"
  | "instagram"
  | "question-paper";

type Material = {
  id: number;
  title: string;
  type: MaterialType;
  category: string;
  fileName?: string;
  url?: string;
  size?: string;
  date: string;
};

const initialMaterials: Material[] = [
  {
    id: 1,
    title: "React Training Presentation",
    type: "ppt",
    category: "Training",
    fileName: "react-training.pptx",
    size: "4.2 MB",
    date: "15 Sep 2026",
  },
  {
    id: 2,
    title: "JavaScript Interview Questions",
    type: "pdf",
    category: "Study Material",
    fileName: "javascript-questions.pdf",
    size: "2.8 MB",
    date: "14 Sep 2026",
  },
  {
    id: 3,
    title: "Training Guidelines",
    type: "image",
    category: "Reference",
    fileName: "training-guidelines.png",
    size: "1.4 MB",
    date: "13 Sep 2026",
  },
  {
    id: 4,
    title: "React Hooks Complete Training",
    type: "youtube",
    category: "Video Training",
    url: "https://youtu.be/LZapz2L6J1Q?si=Ui8usnoK2czo45r8",
    date: "12 Sep 2026",
  },
  {
    id: 5,
    title: "Company Training Video",
    type: "video",
    category: "Training",
    fileName: "company-training.mp4",
    size: "86 MB",
    date: "11 Sep 2026",
  },
  {
    id: 6,
    title: "Previous Year Question Paper",
    type: "question-paper",
    category: "Question Papers",
    fileName: "question-paper-2025.pdf",
    size: "3.1 MB",
    date: "10 Sep 2026",
  },
  {
    id: 7,
    title: "Training Tips",
    type: "instagram",
    category: "Social Resources",
    url: "https://www.instagram.com/reel/Dc_bUdXPPtO/?stkn=MWxpaWdiY3RjOXFtMQ==",
    date: "09 Sep 2026",
  },
];

const typeConfig: Record<
  MaterialType,
  {
    label: string;
    icon: React.ElementType;
    bg: string;
    color: string;
  }
> = {
  ppt: {
    label: "PowerPoint",
    icon: Presentation,
    bg: "bg-orange-50",
    color: "text-orange-600",
  },
  pdf: {
    label: "PDF",
    icon: FileText,
    bg: "bg-red-50",
    color: "text-red-600",
  },
  image: {
    label: "Image",
    icon: ImageIcon,
    bg: "bg-purple-50",
    color: "text-purple-600",
  },
  video: {
    label: "Video",
    icon: Video,
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    bg: "bg-red-50",
    color: "text-red-600",
  },
  instagram: {
    label: "Instagram",
    icon: Instagram,
    bg: "bg-pink-50",
    color: "text-pink-600",
  },
  "question-paper": {
    label: "Question Paper",
    icon: ClipboardList,
    bg: "bg-green-50",
    color: "text-green-600",
  },
};

export default function TrainingKnowledge() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [activeFilter, setActiveFilter] = useState<"all" | MaterialType>(
    "all"
  );
  const [previewMaterial, setPreviewMaterial] =
  useState<Material | null>(null);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<Material | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [newType, setNewType] = useState<MaterialType>("pdf");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  const [renameValue, setRenameValue] = useState("");
const router = useRouter();
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchesType =
        activeFilter === "all" || item.type === activeFilter;

      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [materials, activeFilter, search]);

  const stats = {
    total: materials.length,
    documents: materials.filter((x) =>
      ["ppt", "pdf", "question-paper"].includes(x.type)
    ).length,
    media: materials.filter((x) =>
      ["image", "video", "youtube", "instagram"].includes(x.type)
    ).length,
    questions: materials.filter((x) => x.type === "question-paper").length,
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;

    const newMaterial: Material = {
      id: Date.now(),
      title: newTitle,
      type: newType,
      category: newCategory || "General",
      fileName: newFile?.name,
      size: newFile
        ? `${(newFile.size / 1024 / 1024).toFixed(1)} MB`
        : undefined,
      url:
        newType === "youtube" || newType === "instagram"
          ? newUrl
          : undefined,
      date: "15 Sep 2026",
    };

    setMaterials((prev) => [newMaterial, ...prev]);

    setNewTitle("");
    setNewCategory("");
    setNewUrl("");
    setNewFile(null);
    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this material?"
    );

    if (!confirmed) return;

    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  const openRename = (material: Material) => {
    setSelectedMaterial(material);
    setRenameValue(material.title);
    setShowRenameModal(true);
  };

  const handleRename = () => {
    if (!selectedMaterial || !renameValue.trim()) return;

    setMaterials((prev) =>
      prev.map((item) =>
        item.id === selectedMaterial.id
          ? { ...item, title: renameValue }
          : item
      )
    );

    setShowRenameModal(false);
    setSelectedMaterial(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl  text-white ">
    <img
    src="/Icons/Curate-logo.png"
    
    alt="Logo"
    className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl"
  />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Training & Knowledge
                </h1>

                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Manage training materials, documents, videos and question
                  papers
                </p>
              </div>
            </div>
          </div>
<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
          >
            <Plus size={18} />
            Add New Material
          </button>
          <button
            onClick={() => router.back()}
              className="flex cursor-pointer items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-br from-[#00A9A5] to-[#005f61] hover:from-[#01cfc7] hover:to-[#00403e] text-white rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              DashBoard
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            title="Total Materials"
            value={stats.total}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            icon={FileText}
            title="Documents"
            value={stats.documents}
            iconClass="bg-red-50 text-red-600"
          />

          <StatCard
            icon={Video}
            title="Media"
            value={stats.media}
            iconClass="bg-purple-50 text-purple-600"
          />

          <StatCard
            icon={ClipboardList}
            title="Question Papers"
            value={stats.questions}
            iconClass="bg-green-50 text-green-600"
          />
        </div>

        {/* TOOLBAR */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

            {/* SEARCH */}
            <div className="relative w-full xl:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search training materials..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* VIEW BUTTONS */}
            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter size={17} />
                <span className="hidden sm:inline">View</span>
              </div>

              <div className="flex rounded-lg border border-slate-200 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-400"
                  }`}
                >
                  <Grid3X3 size={17} />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 ${
                    viewMode === "list"
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-400"
                  }`}
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <FilterButton
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
              label="All"
              count={materials.length}
            />

            <FilterButton
              active={activeFilter === "ppt"}
              onClick={() => setActiveFilter("ppt")}
              label="PPT"
            />

            <FilterButton
              active={activeFilter === "pdf"}
              onClick={() => setActiveFilter("pdf")}
              label="PDF"
            />

            <FilterButton
              active={activeFilter === "image"}
              onClick={() => setActiveFilter("image")}
              label="Images"
            />

            <FilterButton
              active={activeFilter === "video"}
              onClick={() => setActiveFilter("video")}
              label="Videos"
            />

            <FilterButton
              active={activeFilter === "youtube"}
              onClick={() => setActiveFilter("youtube")}
              label="YouTube"
            />

            <FilterButton
              active={activeFilter === "instagram"}
              onClick={() => setActiveFilter("instagram")}
              label="Instagram"
            />

            <FilterButton
              active={activeFilter === "question-paper"}
              onClick={() => setActiveFilter("question-paper")}
              label="Question Papers"
            />
          </div>
        </div>

        {/* CONTENT */}
        {filteredMaterials.length === 0 ? (
          <EmptyState onAdd={() => setShowAddModal(true)} />
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredMaterials.map((material) => (
           <MaterialCard
  key={material.id}
  material={material}
  onRename={openRename}
  onDelete={handleDelete}
  onPreview={setPreviewMaterial}
/>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1fr_150px_150px_160px] border-b bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <span>Material</span>
              <span>Type</span>
              <span>Category</span>
              <span className="text-right">Actions</span>
            </div>

            {filteredMaterials.map((material) => (
              <MaterialListItem
                key={material.id}
                material={material}
                onRename={openRename}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <div className="p-5 sm:p-6">

            <ModalHeader
              title="Add Training Material"
              onClose={() => setShowAddModal(false)}
            />

            {/* TYPE */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Material Type
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    "ppt",
                    "pdf",
                    "image",
                    "video",
                    "youtube",
                    "instagram",
                    "question-paper",
                  ] as MaterialType[]
                ).map((type) => {
                  const config = typeConfig[type];
                  const Icon = config.icon;

                  return (
                    <button
                      key={type}
                      onClick={() => setNewType(type)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-medium transition ${
                        newType === type
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={20} />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TITLE */}
            <Input
              label="Title"
              value={newTitle}
              onChange={setNewTitle}
              placeholder="Enter material title"
            />

            {/* CATEGORY */}
            <Input
              label="Category"
              value={newCategory}
              onChange={setNewCategory}
              placeholder="Example: Training, Study Material"
            />

            {/* URL */}
            {(newType === "youtube" || newType === "instagram") && (
              <Input
                label={newType === "youtube" ? "YouTube URL" : "Instagram URL"}
                value={newUrl}
                onChange={setNewUrl}
                placeholder="Paste URL here..."
              />
            )}

            {/* FILE */}
            {newType !== "youtube" && newType !== "instagram" && (
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Upload File
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <Upload className="mb-2 text-slate-400" size={28} />

                  {newFile ? (
                    <>
                      <p className="text-sm font-semibold text-slate-700">
                        {newFile.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {(newFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-700">
                        Click to upload
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        PPT, PDF, Images or Video
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setNewFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add Material
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* RENAME MODAL */}
      {showRenameModal && (
        <Modal onClose={() => setShowRenameModal(false)}>
          <div className="p-5 sm:p-6">
            <ModalHeader
              title="Rename Material"
              onClose={() => setShowRenameModal(false)}
            />

            <Input
              label="New Name"
              value={renameValue}
              onChange={setRenameValue}
              placeholder="Enter new name"
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowRenameModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>

              <button
                onClick={handleRename}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Rename
              </button>
            </div>
          </div>
        </Modal>
      )}

      {previewMaterial && (
  <PreviewModal
    material={previewMaterial}
    onClose={() => setPreviewMaterial(null)}
  />
)}
    </div>
  );
}

/* -------------------------------------------------- */
/* STAT CARD */
/* -------------------------------------------------- */

function StatCard({
  icon: Icon,
  title,
  value,
  iconClass,
}: {
  icon: React.ElementType;
  title: string;
  value: number;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* FILTER BUTTON */
/* -------------------------------------------------- */

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}

      {count !== undefined && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] ${
            active
              ? "bg-white/20 text-white"
              : "bg-white text-slate-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* -------------------------------------------------- */
/* MATERIAL CARD */
/* -------------------------------------------------- */

function MaterialCard({
  material,
  onRename,
  onDelete,
  onPreview,
}: {
  material: Material;
  onRename: (material: Material) => void;
  onDelete: (id: number) => void;
  onPreview: (material: Material) => void;
}) {
  const config = typeConfig[material.type];
  const Icon = config.icon;

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      {/* PREVIEW */}
   {material.url?  <div className="aspect-video w-full">
                  <iframe
                    src={convertYoutubeUrl(material.url)}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>:   <div className="relative flex h-36 items-center justify-center bg-slate-50 sm:h-40">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${config.bg} ${config.color}`}
        >
          <Icon size={32} />
        </div>

        <div className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
          {config.label}
        </div>

        <button className="absolute right-3 top-3 rounded-lg bg-white p-2 text-slate-500 opacity-100 shadow-sm transition hover:text-slate-900 sm:opacity-0 sm:group-hover:opacity-100">
          <MoreVertical size={17} />
        </button>
      </div>}

      {/* DETAILS */}
      <div className="p-4">

        <h3
          title={material.title}
          className="truncate text-sm font-bold text-slate-800"
        >
          {material.title}
        </h3>

        <p className="mt-1 truncate text-xs text-slate-400">
          {material.fileName || material.url || "External resource"}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
            {material.category}
          </span>

          <span className="text-[10px] text-slate-400">
            {material.date}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">

         <ActionButton
  icon={Eye}
  label="View"
  onClick={() => onPreview(material)}
/>
        

          <ActionButton
            icon={Download}
            label="Download"
            onClick={() => {}}
          />

          <ActionButton
            icon={Pencil}
            label="Rename"
            onClick={() => onRename(material)}
          />

          <ActionButton
            icon={Trash2}
            label="Delete"
            danger
            onClick={() => onDelete(material.id)}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* LIST ITEM */
/* -------------------------------------------------- */

function MaterialListItem({
  material,
  onRename,
  onDelete,
}: {
  material: Material;
  onRename: (material: Material) => void;
  onDelete: (id: number) => void;
}) {
  const config = typeConfig[material.type];
  const Icon = config.icon;

  return (
    <div className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-0 md:grid-cols-[1fr_150px_150px_160px] md:items-center md:px-5">

      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">
            {material.title}
          </p>

          <p className="truncate text-xs text-slate-400">
            {material.fileName || material.url}
          </p>
        </div>
      </div>

      <div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {config.label}
        </span>
      </div>

      <div className="text-xs text-slate-500">
        {material.category}
      </div>

      <div className="flex items-center justify-end gap-1">
        <ActionButton icon={Eye} label="View" onClick={() => {}} />

        <ActionButton
          icon={Download}
          label="Download"
          onClick={() => {}}
        />

        <ActionButton
          icon={Pencil}
          label="Rename"
          onClick={() => onRename(material)}
        />

        <ActionButton
          icon={Trash2}
          label="Delete"
          danger
          onClick={() => onDelete(material.id)}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* ACTION BUTTON */
/* -------------------------------------------------- */

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-9 flex-1 items-center justify-center rounded-lg transition sm:flex-none sm:px-2 ${
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      <Icon size={16} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

/* -------------------------------------------------- */
/* INPUT */
/* -------------------------------------------------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* -------------------------------------------------- */
/* MODAL */
/* -------------------------------------------------- */

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* MODAL HEADER */
/* -------------------------------------------------- */

function ModalHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <button
        onClick={onClose}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={19} />
      </button>
    </div>
  );
}

/* -------------------------------------------------- */
/* EMPTY STATE */
/* -------------------------------------------------- */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <BookOpen size={30} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-800">
        No materials found
      </h3>

      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        Add your first training presentation, PDF, image, video or question
        paper.
      </p>

      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        <Plus size={17} />
        Add Material
      </button>
    </div>
  );
}

function convertYoutubeUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");

      return `https://www.youtube.com/embed/${id}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}

function PreviewModal({
  material,
  onClose,
}: {
  material: Material;
  onClose: () => void;
}) {
  const config = typeConfig[material.type];
  const Icon = config.icon;

  const isImage = material.type === "image";
  const isVideo = material.type === "video";
  const isPdf =
    material.type === "pdf" ||
    material.type === "question-paper";
  const isYoutube = material.type === "youtube";
  const isInstagram = material.type === "instagram";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">

          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.color}`}
            >
              <Icon size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                {material.title}
              </h2>

              <p className="text-xs text-slate-400">
                {config.label}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* PREVIEW AREA */}
        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 p-3 sm:p-5">

          {/* IMAGE */}
          {isImage && material.fileName && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="flex flex-col items-center justify-center rounded-xl bg-white p-10 text-center shadow-sm">
                <ImageIcon
                  size={60}
                  className="mb-4 text-purple-500"
                />

                <h3 className="font-semibold text-slate-800">
                  Image Preview
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {material.fileName}
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  Actual image preview will appear here once the
                  uploaded file URL is connected.
                </p>
              </div>
            </div>
          )}

          {/* PDF */}
          {isPdf && (
            <div className="flex min-h-[500px] items-center justify-center rounded-xl bg-white shadow-sm">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <FileText size={40} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  PDF Preview
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {material.fileName || material.title}
                </p>

                <p className="mx-auto mt-2 max-w-md text-xs text-slate-400">
                  The PDF viewer will display the actual document
                  after connecting the uploaded file URL.
                </p>
              </div>
            </div>
          )}

          {/* VIDEO */}
          {isVideo && (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-black">
              <div className="text-center text-white">
                <Video
                  size={60}
                  className="mx-auto mb-4 opacity-80"
                />

                <h3 className="font-semibold">
                  Video Preview
                </h3>

                <p className="mt-1 text-sm opacity-60">
                  {material.fileName || material.title}
                </p>
              </div>
            </div>
          )}

          {/* YOUTUBE */}
          {isYoutube && (
            <div className="overflow-hidden rounded-xl bg-black">
              {material.url ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={convertYoutubeUrl(material.url)}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center text-white">
                  YouTube URL not available
                </div>
              )}
            </div>
          )}

          {/* INSTAGRAM */}
          {isInstagram && (
            <div className="flex min-h-[500px] items-center justify-center rounded-xl bg-white">
              <div className="max-w-md text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Instagram size={40} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  Instagram Resource
                </h3>

                <p className="mt-2 break-all text-sm text-slate-500">
                  {material.url}
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  Instagram content can be opened from the
                  original post.
                </p>

                {material.url && (
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
                  >
                    <LinkIcon size={16} />
                    Open Instagram
                  </a>
                )}
              </div>
            </div>
          )}

          {/* PPT */}
          {material.type === "ppt" && (
            <div className="flex min-h-[500px] items-center justify-center rounded-xl bg-white">
              <div className="max-w-md text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Presentation size={40} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  PowerPoint Presentation
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {material.fileName || material.title}
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  PowerPoint preview will be connected when the
                  actual uploaded file URL is available.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">

          <div className="text-xs text-slate-400">
            {material.category} • {material.date}
          </div>

          <div className="flex w-full gap-2 sm:w-auto">

            {material.url && (
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none"
              >
                <LinkIcon size={16} />
                Open
              </a>
            )}

            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:flex-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}