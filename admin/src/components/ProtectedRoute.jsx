import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MainLayout from "../layouts/MainLayout";

export default function ProtectedRoute({ children, resource }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (resource && user) {
    const isSuper = user.role === "superadmin";
    const hasPerm = user.permissions && user.permissions[resource] === true;

    if (!isSuper && !hasPerm) {
      return (
        <MainLayout>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white border border-slate-100 rounded-2xl shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-2xl font-bold mb-4">
              ✕
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
            <p className="text-slate-400 max-w-md">
              You do not have the required permissions to access the <strong>{resource}</strong> module. Please contact your system administrator.
            </p>
          </div>
        </MainLayout>
      );
    }
  }

  return <MainLayout>{children}</MainLayout>;
}
