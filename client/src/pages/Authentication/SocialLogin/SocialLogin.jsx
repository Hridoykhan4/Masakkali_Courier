import { toast } from "react-toastify";
import useAuthValue from "../../../hooks/useAuthValue";
import { useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import useTheme from "../../../hooks/useTheme";

const SocialLogin = ({ from }) => {
  const { loginByGoogle } = useAuthValue();
  const [loading, setLoading] = useState(false);
  const {theme} = useTheme()
  const nav = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleGoogleSignin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { user } = await loginByGoogle();
      const userInfo = {
        email: user?.email,
        name: user?.displayName,
        photoURL: user?.photoURL,
        role: "user",
        createdAt: new Date().toISOString(),
        lastLoggedIn: new Date().toISOString(),
      };
      await axiosPublic.post("/users", userInfo);
      toast.success(`Welcome ${user?.displayName || 'Sir !'}`, {
         theme: theme === "light" ? "light" : "dark",
      });
      nav(from, { replace: true });
    } catch (err) {
      console.log(err);
      toast.error("Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-2">
      <button
        onClick={handleGoogleSignin}
        disabled={loading}
        className="group relative w-full h-14 flex items-center justify-center gap-4 
                   bg-base-200 hover:bg-base-300 
                   text-base-content border border-base-content/10 
                   rounded-2xl transition-all duration-300 
                   hover:border-primary/40 active:scale-[0.98]"
      >
        {/* Subtle Inner Glow - Adaptive to Theme */}
        <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <FaGoogle
            className={`text-lg transition-transform duration-500 ${loading ? "animate-spin" : "group-hover:rotate-12"}`}
          />
          <span className="text-xs font-black italic tracking-[0.2em] uppercase">
            {loading ? "Authenticating..." : "Continue with Google"}
          </span>
        </div>

        {/* Minimalist Accents */}
        <div className="absolute top-3 right-4 w-1 h-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
      </button>

      <div className="mt-6 flex items-center gap-4 opacity-20">
        <div className="h-px grow bg-current" />
        <span className="text-[9px] font-bold uppercase tracking-widest">
          Secure Gateway
        </span>
        <div className="h-px grow bg-current" />
      </div>
    </div>
  );
};

export default SocialLogin;
