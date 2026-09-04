"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FileText,
  Upload,
  Eye,
  Download,
  Trash2,
  X,
  File,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

/* =========================================================
   TYPES
========================================================= */

interface CompanyPolicy {
  id: string;
  documentName: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  uploadedBy?: string;
  uploadedAt?: string;
  version?: number;
  isActive?: boolean;
}

interface CompanyPolicyProps {
  /**
   * Logged-in user's email.
   * Replace this with your existing Curate auth user.
   */
  userEmail: string;
}

/* =========================================================
   CONFIGURATION
========================================================= */

/**
 * IMPORTANT:
 *
 * Put ONLY the emails that should be allowed to upload/delete
 * Company Policies here.
 *
 * For true production security, the backend MUST validate this
 * independently as well.
 */
const COMPANY_POLICY_ADMIN_EMAILS = [
  "admin@company.com",
  "srinivasnew0803@gmail.com",
];

/**
 * Maximum upload size.
 * Change if required.
 */
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Allowed file extensions.
 */
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

/**
 * API endpoints.
 *
 * Change these to your actual Curate API routes.
 */
const API = {
  list: "/api/getcompany-policies",
  upload: "/api/company-policies/upload",
  delete: "/api/DeleteCompanyPolicy",
};

/* =========================================================
   COMPONENT
========================================================= */

const CompanyPolicy = () => {
  const [policies, setPolicies] = useState<CompanyPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<CompanyPolicy | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
      const [UpdatedStatusMessage, setUpdatedStatusMessage] = useState('');
      const router = useRouter();
  /* =========================================================
     ADMIN AUTHORIZATION
  ========================================================= */

  const userEmail = useSelector((state: any) => state.LoggedInEmail)
  const normalizedEmail = useMemo(
    () => userEmail.trim().toLowerCase(),
    [userEmail]
  );

  const isPolicyAdmin = useMemo(() => {
    return COMPANY_POLICY_ADMIN_EMAILS.some(
      (email) => email.toLowerCase() === normalizedEmail
    );
  }, [normalizedEmail]);

  /* =========================================================
     FETCH POLICIES
  ========================================================= */

  const fetchPolicies = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await axios.get(API.list);
console.log("Fetched company policies:", response);
      const data = response?.data.data
;

      if (Array.isArray(data)) {
        setPolicies(data);
      } else if (Array.isArray(data?.policies)) {
        setPolicies(data.policies);
      } else {
        setPolicies([]);
      }
    } catch (error: any) {
      console.error("Error fetching company policies:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          "No Ploicies found."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  /* =========================================================
     FILE VALIDATION
  ========================================================= */

  const validateFile = (file: File): string | null => {
    const fileName = file.name.toLowerCase();

    const isAllowedExtension = ALLOWED_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension)
    );

    if (!isAllowedExtension) {
      return "Only PDF, DOC, and DOCX files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File size cannot exceed ${MAX_FILE_SIZE_MB} MB.`;
    }

    return null;
  };

  /* =========================================================
     FILE SELECT
  ========================================================= */

 
  /* =========================================================
     UPLOAD
  ========================================================= */


const handleUpload = useCallback(
  async () => {
    const file = selectedFile;
setUpdatedStatusMessage("Uploading file...");
    if (!file) return;

    // -------------------------------------------------------
    // File Size Validation
    // -------------------------------------------------------

    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Max allowed is 10MB.");
      return;
    }

    // -------------------------------------------------------
    // Allowed File Types
    // -------------------------------------------------------

    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",

      // Videos
      "video/mp4",
      "video/webm",
      "video/ogg",

      // PDF
      "application/pdf",

      // Microsoft Word - .doc
      "application/msword",

      // Microsoft Word - .docx
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const fileExtension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    const allowedExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "mp4",
      "webm",
      "ogg",
      "pdf",
      "doc",
      "docx",
    ];

    const isValidType =
      allowedTypes.includes(file.type) ||
      (fileExtension &&
        allowedExtensions.includes(fileExtension));

    if (!isValidType) {
      alert(
        "Only image, video, PDF, Word (.doc/.docx) files are allowed."
      );
      return;
    }

    // -------------------------------------------------------
    // Upload
    // -------------------------------------------------------

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "/api/Upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedPolicy: CompanyPolicy = {
        id:  uuidv4(),

        documentName:
         documentName,

        fileName: file.name,

        fileUrl: res.data.url,

        fileType: file.type,

        fileSize: file.size,
      };

      setPolicies((current) => [
        uploadedPolicy,
        ...current,
      ]);

      const PostinDB = await axios.post(
        "/api/company-policies",
        {
            uploadedPolicy
        }
      );
      console.log("PostinDB", PostinDB);
      if(PostinDB.data.success){
      setUpdatedStatusMessage("File uploaded successfully.");
      setShowUploadModal(false);
      setDocumentName("");
      setSelectedFile(null);
      }else{
        setUpdatedStatusMessage("Failed to upload file.");
            setShowUploadModal(false);
      setDocumentName("");
      setSelectedFile(null);
      }
    } catch (error: any) {
      console.error(
        "Upload failed:",
        error?.message || error
      );
      setUpdatedStatusMessage("Failed to upload file.");
    }
  },
  [selectedFile]
);
  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (
    policy: CompanyPolicy
  ) => {
    if (!isPolicyAdmin) {
      setErrorMessage(
        "You are not authorized to delete company policies."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${policy.documentName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      setIsDeleting(policy.id);

     await axios.delete(API.delete, {
  data: {
    id: policy.id,
  },
});

      setSuccessMessage(
        "Company policy deleted successfully."
      );

      await fetchPolicies();
    } catch (error: any) {
      console.error(
        "Company policy deletion failed:",
        error
      );

      setErrorMessage(
        error?.response?.data?.message ||
          "Unable to delete company policy."
      );
    } finally {
      setIsDeleting(null);
    }
  };

  /* =========================================================
     RESET UPLOAD FORM
  ========================================================= */

  const resetUploadForm = () => {
    setDocumentName("");
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  /* =========================================================
     FORMAT FILE SIZE
  ========================================================= */

  const formatFileSize = (
    bytes?: number
  ) => {
    if (!bytes) return "";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (
    date?: string
  ) => {
    if (!date) return "";

    try {
      return new Intl.DateTimeFormat(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ).format(new Date(date));
    } catch {
      return date;
    }
  };

  /* =========================================================
     FILE TYPE
  ========================================================= */

  const isPdf = (
    policy: CompanyPolicy
  ) => {
    return (
      policy.fileType
        ?.toLowerCase()
        .includes("pdf") ||
      policy.fileName
        ?.toLowerCase()
        .endsWith(".pdf")
    );
  };
const getFileType = (policy: CompanyPolicy) => {
  const type = policy.fileType?.toLowerCase() || "";
  const name = policy.fileName?.toLowerCase() || "";

  if (type.includes("pdf") || name.endsWith(".pdf")) {
    return "pdf";
  }

  if (
    type.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(name)
  ) {
    return "image";
  }

  if (
    type.startsWith("video/") ||
    /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(name)
  ) {
    return "video";
  }

  if (
    type.includes("word") ||
    /\.(doc|docx)$/i.test(name)
  ) {
    return "office";
  }

  return "other";
};
  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="w-full min-h-full bg-gray-50 p-4 md:p-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

   <div className="mb-6 w-full rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4 md:p-5">
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

    {/* Logo + Title */}
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14">
        <img
          src="/Icons/Curate-logo.png"
          onClick={() => router.push("/DashBoard")}
          alt="Logo"
          className="h-9 w-9 cursor-pointer rounded-xl object-contain sm:h-11 sm:w-11"
        />
      </div>

      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-gray-900 sm:text-xl">
          Company Policies
        </h1>

        <p className="text-xs leading-5 text-gray-500 sm:text-sm">
          View and manage company policy documents
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:shrink-0">

      {/* ADMIN ONLY */}
      {isPolicyAdmin && (
        <button
          type="button"
          onClick={() => {
            setErrorMessage("");
            setSuccessMessage("");
            setShowUploadModal(true);
            setUpdatedStatusMessage("");
          }}
          className="
            inline-flex w-full cursor-pointer items-center justify-center
            gap-2 rounded-lg bg-blue-600 px-4 py-2.5
            text-sm font-medium text-white shadow-sm
            transition hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:ring-offset-2
            sm:w-auto
          "
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span>Upload Policy</span>
        </button>
      )}

      {/* Dashboard */}
      <button
        type="button"
        onClick={() => router.replace("/DashBoard")}
        className="
          inline-flex w-full cursor-pointer items-center justify-center
          gap-2 rounded-xl
          bg-gradient-to-br from-[#00A9A5] to-[#005f61]
          px-4 py-2.5
          text-sm font-semibold text-white
          shadow-lg transition-all duration-150
          hover:from-[#01cfc7] hover:to-[#00403e]
          focus:outline-none focus:ring-2 focus:ring-[#00A9A5]
          focus:ring-offset-2
          sm:w-auto
        "
      >
        DashBoard
      </button>

    </div>
  </div>
</div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <span>{errorMessage}</span>

        </div>
      )}

      {successMessage && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">

          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

          <span>{successMessage}</span>

        </div>
      )}

      {/* =====================================================
          POLICY LIST
      ===================================================== */}

      {isLoading ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-gray-200 bg-white">

          <div className="flex items-center gap-3 text-gray-500">

            <Loader2 className="h-5 w-5 animate-spin" />

            <span className="text-sm">
              Loading company policies...
            </span>

          </div>

        </div>
      ) : policies.length === 0 ? (

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 text-center">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

            <FileText className="h-7 w-7 text-gray-400" />

          </div>

          <h3 className="text-base font-semibold text-gray-800">
            No Company Policies
          </h3>

          <p className="mt-1 max-w-md text-sm text-gray-500">
            Company policy documents uploaded by management
            will appear here.
          </p>

          {isPolicyAdmin && (
            <button
              type="button"
              onClick={() =>
                setShowUploadModal(true)
                
              }
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Upload className="h-4 w-4" />
              Upload First Policy
            </button>
          )}

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {policies.map((policy) => (

            <div
              key={policy.id}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* ICON */}

              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50">

                  <FileText
                    className="h-6 w-6 text-red-500"
                  />

                </div>

                {policy.version && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    v{policy.version}
                  </span>
                )}

              </div>

              {/* NAME */}

              <h3 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900">
                {policy.documentName}
              </h3>

              {/* DETAILS */}

              <div className="mt-2 space-y-1">

                <p className="truncate text-xs text-gray-500">
                  {policy.fileName}
                </p>

                {policy.fileSize && (
                  <p className="text-xs text-gray-400">
                    {formatFileSize(
                      policy.fileSize
                    )}
                  </p>
                )}

                {policy.uploadedAt && (
                  <p className="text-xs text-gray-400">
                    Updated{" "}
                    {formatDate(
                      policy.uploadedAt
                    )}
                  </p>
                )}

              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedPolicy(policy)
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>

                <a
                  href={policy.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </a>

                {/* ADMIN DELETE */}

                {isPolicyAdmin && (
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(policy)
                    }
                    disabled={
                      isDeleting === policy.id
                    }
                    className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Delete"
                  >
                    {isDeleting === policy.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

      {showUploadModal && isPolicyAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Upload Company Policy
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Add a new company policy document
                </p>
              </div>

              <button
                type="button"
                onClick={resetUploadForm}
                disabled={isUploading}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="space-y-5 p-5">

              {/* DOCUMENT NAME */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Document Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={documentName}
                  onChange={(e) =>
                    setDocumentName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Employee Code of Conduct"
                  disabled={isUploading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

              </div>

              {/* FILE */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Policy Document
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-7 transition ${
                    selectedFile
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >

             <input
  type="file"
  accept=".pdf,.doc,.docx,image/*,video/*"
  onChange={(e) => {
    setSelectedFile(
      e.target.files?.[0] || null
    );
  }}
/>

                  {selectedFile ? (
                    <>
                      <File className="mb-2 h-8 w-8 text-blue-600" />

                      <p className="max-w-full truncate px-4 text-sm font-medium text-gray-800">
                        {selectedFile.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {formatFileSize(
                          selectedFile.size
                        )}
                      </p>

                      <p className="mt-2 text-xs font-medium text-blue-600">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />

                      <p className="text-sm font-medium text-gray-700">
                        Click to select document
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        PDF, DOC or DOCX • Max{" "}
                        {MAX_FILE_SIZE_MB} MB
                      </p>
                    </>
                  )}

                </label>

              </div>

              {/* ADMIN INFO */}

              <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">

                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                <div>

                  <p className="text-xs font-semibold text-blue-900">
                    Authorized Management Upload
                  </p>

                  <p className="mt-0.5 text-xs text-blue-700">
                    This document will be uploaded under
                    your authorized management account.
                  </p>

                </div>

              </div>

            </div>
        
{UpdatedStatusMessage&&<p className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm">
  <span className="flex h-5 w-5 items-center justify-center">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
  </span>

  <span className="leading-5">
    {UpdatedStatusMessage}
  </span>
</p>}
            {/* MODAL FOOTER */}

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4">

              <button
                type="button"
                onClick={resetUploadForm}
                disabled={isUploading}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpload}
                disabled={
                  isUploading ||
                  !documentName.trim() ||
                  !selectedFile
                }
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Policy
                  </>
                )}

              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          PREVIEW MODAL
      ===================================================== */}

      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/70">

          {/* PREVIEW HEADER */}

          <div className="flex items-center justify-between bg-white px-4 py-3 shadow-md">

            <div className="min-w-0">

              <h2 className="truncate text-base font-semibold text-gray-900">
                {selectedPolicy.documentName}
              </h2>

              <p className="truncate text-xs text-gray-500">
                {selectedPolicy.fileName}
              </p>

            </div>

            <div className="ml-4 flex items-center gap-2">

              <a
                href={
                  selectedPolicy.fileUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Download
              </a>

              <button
                type="button"
                onClick={() =>
                  setSelectedPolicy(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

          </div>

          {/* PREVIEW CONTENT */}

      {/* PREVIEW CONTENT */}

<div className="flex min-h-0 flex-1 items-center justify-center p-3 md:p-5 overflow-auto">

  {getFileType(selectedPolicy) === "pdf" && (
    <iframe
      src={selectedPolicy.fileUrl}
      title={selectedPolicy.documentName}
      className="h-full w-full rounded-lg bg-white shadow-lg"
    />
  )}

  {getFileType(selectedPolicy) === "image" && (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-black/20 p-4">
      <img
        src={selectedPolicy.fileUrl}
        alt={selectedPolicy.documentName}
        className="max-h-full max-w-full rounded-lg object-contain shadow-lg"
      />
    </div>
  )}

  {getFileType(selectedPolicy) === "video" && (
    <video
      src={selectedPolicy.fileUrl}
      controls
      autoPlay={false}
      className="max-h-full max-w-full rounded-lg bg-black shadow-lg"
    >
      Your browser does not support video playback.
    </video>
  )}

  {getFileType(selectedPolicy) === "office" && (
    <iframe
      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        selectedPolicy.fileUrl
      )}`}
      title={selectedPolicy.documentName}
      className="h-full w-full rounded-lg bg-white shadow-lg"
    />
  )}

  {getFileType(selectedPolicy) === "other" && (
    <div className="flex max-w-md flex-col items-center rounded-xl bg-white p-8 text-center shadow-xl">

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
        <File className="h-8 w-8 text-gray-500" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        Preview unavailable
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        This file format cannot be previewed directly in the browser.
      </p>

      <a
        href={selectedPolicy.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        <Download className="h-4 w-4" />
        Open / Download
      </a>

    </div>
  )}

</div>

        </div>
      )}

    </div>
  );
};

export default CompanyPolicy;