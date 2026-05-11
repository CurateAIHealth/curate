import React from "react";
import { X } from "lucide-react";

type CommentType = {
  Date?: string;
  Time?: string;
  comment?: string;
  Comment?: string;
};

type CommentsPopupProps = {
  open: boolean;
  onClose: () => void;
  comments: CommentType[];
  title?: string;
};

const CommentsPopup: React.FC<CommentsPopupProps> = ({
  open,
  onClose,
  comments = [],
  title = "Comments",
}) => {
  if (!open) return null;
console.log("Comments Data:", comments);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-3">
          <img
            src="/Icons/Curate-logoq.png"
            className="h-8"
            alt="Company Logo"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {title}
            </h2>
            <p className="text-sm text-gray-500">
              Total Comments: {comments.length}
            </p>
          </div>
</div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[450px] overflow-y-auto px-5 py-4 space-y-4">
          {comments.length > 0 ? (
            comments.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Comment #{index + 1}
                  </span>

                  <span className="text-xs text-gray-400">
                    {item.Date} {item.Time}
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-700">
                  {item.comment || "No comment available"}
                </p>
              </div>
            ))
          ) : (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300">
              <p className="text-sm text-gray-500">
                No comments available
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsPopup;