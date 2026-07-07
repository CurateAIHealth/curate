import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  title = "No Results Found",
  description = "We couldn't find any records matching your current filters.",
  icon,
  action,
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={`flex min-h-[280px] w-full items-center justify-center px-4 py-10 ${className}`}
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
          {icon || <SearchX size={26} className="text-gray-400" />}
        </div>

        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-1.5 text-sm leading-6 text-gray-500">
          {description}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
};

export default EmptyState;