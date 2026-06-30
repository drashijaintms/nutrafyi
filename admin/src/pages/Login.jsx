import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/authSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    dispatch(loginStart());
    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
        rememberMe,
      });

      dispatch(loginSuccess(data));
      toast.success(`Welcome back, ${data.name}!`);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Check your credentials.";
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !recoveryKey || !newPassword) {
      return toast.error("Please fill in all fields");
    }

    setResetLoading(true);
    try {
      await axios.post("/api/admin/forgot-password", {
        email,
        recoveryKey,
        newPassword
      });
      toast.success("Password reset successfully! Please log in.");
      setRecoveryKey("");
      setNewPassword("");
      setIsForgot(false);
      setShowPassword(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Password reset failed.";
      toast.error(msg);
    } finally {
      setResetLoading(false);
    }
  };

  if (isForgot) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900 pointer-events-none" />

        <div className="bg-white/5 backdrop-blur-md border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl relative z-10 animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-sm text-slate-400 mt-1.5">Enter details to reset admin credentials</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nutrafyi.com"
                className="w-full text-sm px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Recovery Key
              </label>
              <input
                type="password"
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                placeholder="Enter secret recovery key"
                className="w-full text-sm px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50"
            >
              {resetLoading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgot(false);
                  setError("");
                  setShowPassword(false);
                }}
                className="text-xs text-slate-400 hover:text-indigo-400 font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900 pointer-events-none" />

      <div className="bg-white/5 backdrop-blur-md border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl relative z-10 animate-in fade-in duration-300">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center font-bold text-white text-xl mx-auto shadow-lg shadow-indigo-500/20">
            N
          </div>
          <h2 className="text-2xl font-bold text-white mt-4">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1.5">Log in to manage your e-commerce store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nutrafyi.com"
              className="w-full text-sm px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none bg-transparent border-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/20 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-white/5 w-4 h-4"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => {
                setIsForgot(true);
                setShowPassword(false);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
