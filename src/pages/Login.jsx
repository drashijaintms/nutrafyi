import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BreadcrumbBar from "../components/BreadcrumbBar";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  // Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/account");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const url = isRegister ? "/api/user/register" : "/api/user/login";
    const payload = isRegister ? { name, email, password, phone } : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Success
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email, phone: data.phone }));
      
      window.dispatchEvent(new Event("user_logged_in"));

      setSuccessMsg(isRegister ? "Registration successful! Redirecting..." : "Login successful! Redirecting...");
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/account";
        navigate(from);
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccessMsg("Password updated successfully! Please sign in with your new password.");
      setNewPassword("");
      setTimeout(() => {
        setIsForgot(false);
        setSuccessMsg("");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfbf7] min-h-screen flex flex-col justify-between">
      <div>
        <BreadcrumbBar title={isForgot ? "Forgot Password" : isRegister ? "Register" : "Sign In"} />

        <div className="max-w-[480px] mx-auto my-16 px-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md p-8 md:p-10">
            
            {/* Header Title depending on mode */}
            {isForgot ? (
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-slate-800">Reset Password</h2>
                <p className="text-xs text-slate-400 mt-1">Verify details to set a new password</p>
              </div>
            ) : (
              /* Tab Headers */
              <div className="flex border-b border-slate-100 mb-8 justify-center gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                    setShowPassword(false);
                  }}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    !isRegister
                      ? "border-b-2 border-[#147a3f] text-[#147a3f]"
                      : "text-slate-400 hover:text-slate-650"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                    setShowPassword(false);
                  }}
                  className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                    isRegister
                      ? "border-b-2 border-[#147a3f] text-[#147a3f]"
                      : "text-slate-400 hover:text-slate-650"
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3.5 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-3.5 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3">
                {successMsg}
              </div>
            )}

            {isForgot ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#147a3f]/10 focus:border-[#147a3f] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#147a3f]/10 focus:border-[#147a3f] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#147a3f]/10 focus:border-[#147a3f] text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 focus:outline-none bg-transparent border-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#147a3f] hover:bg-[#0f6630] disabled:bg-slate-300 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#147a3f]/10 mt-6"
                >
                  {loading ? "Please wait..." : "Reset Password"}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false);
                      setError("");
                      setSuccessMsg("");
                      setShowPassword(false);
                    }}
                    className="text-xs text-[#147a3f] hover:underline font-bold uppercase tracking-wider"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {isRegister && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#147a3f]/10 focus:border-[#147a3f] text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#147a3f]/10 focus:border-[#147a3f] text-sm"
                  />
                </div>

                {isRegister && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#147a3f]/10 focus:border-[#147a3f] text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#147a3f]/10 focus:border-[#147a3f] text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 focus:outline-none bg-transparent border-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isRegister && (
                  <div className="flex justify-end text-xs -mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgot(true);
                        setError("");
                        setSuccessMsg("");
                        setShowPassword(false);
                      }}
                      className="text-[#147a3f] hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#147a3f] hover:bg-[#0f6630] disabled:bg-slate-300 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#147a3f]/10 mt-6"
                >
                  {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
