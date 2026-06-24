import React from "react";

export default function Loader({ size = "md", color = "indigo" }) {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorMap = {
    indigo: "border-indigo-500",
    emerald: "border-emerald-500",
    amber: "border-amber-500",
    white: "border-white",
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div
        className={`${sizeMap[size]} ${colorMap[color]} border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}
