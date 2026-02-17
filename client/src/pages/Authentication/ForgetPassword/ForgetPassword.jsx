import { useState } from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router"; // or react-router-dom
import { toast } from "react-toastify";
import useAuthValue from "../../../hooks/useAuthValue";

const ForgetPassword = () => {
  const { resetPassword } = useAuthValue();
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    console.log(email);
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success("Reset link sent! Check your inbox.");
      e.target.reset();
    } catch (err) {
      toast.error(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-10 text-left">
        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-3">
          Restore <span className="text-primary">Access</span>
        </h3>
        <p className="text-sm font-medium opacity-50 leading-relaxed">
          Enter your registered email. We'll send a secure link to reset your
          credentials.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        <div className="space-y-2 relative">
          <label className="text-[10px] font-black uppercase opacity-40 ml-4 tracking-[0.2em]">
            Account Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 text-xs" />
            <input
              type="email"
              name="email"
              required
              placeholder="name@company.com"
              className="input input-bordered w-full pl-12 rounded-2xl font-semibold bg-base-200/50 focus:bg-base-100 transition-all border-base-content/10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full h-14 rounded-2xl text-xs font-black italic tracking-[0.2em] shadow-xl shadow-primary/20 uppercase"
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Initialize Recovery"
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-base-content/5">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-primary transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Secure Login
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
