import React from "react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "indigo",
  change = null,
  changeType = "positive",
}) {
  const colorSchemes = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between transition-all hover:shadow-md duration-200">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                changeType === "positive"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        )}
      </div>
      <div className={`p-4 rounded-xl border ${colorSchemes[color] || colorSchemes.indigo}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
}
