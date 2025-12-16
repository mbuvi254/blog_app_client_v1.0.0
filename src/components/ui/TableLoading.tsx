import { Loader2 } from "lucide-react";

interface TableLoadingProps {
  message?: string;
  rows?: number;
}

const TableLoading = ({ message = "Loading...", rows = 3 }: TableLoadingProps) => {
  return (
    <div className="space-y-3">
      {/* Header loading */}
      <div className="flex items-center justify-between border-b border-blue-100 pb-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm font-medium text-gray-600">{message}</span>
        </div>
      </div>
      
      {/* Table rows loading */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 p-4 border border-blue-100 rounded-lg bg-white">
            {/* Title skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
            </div>
            
            {/* Status skeleton */}
            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
            
            {/* Author skeleton */}
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            
            {/* Date skeleton */}
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            
            {/* Actions skeleton */}
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableLoading;
