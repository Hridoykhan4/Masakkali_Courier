import { toast } from "react-toastify";
import useAuthValue from "../../../hooks/useAuthValue";
import { useNavigate } from "react-router";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useState } from "react";

const SocialLogin = ({ from }) => {
  const { loginByGoogle } = useAuthValue();
  const [loading, setLoading] = useState(false);

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
      toast.success("Logged in successfully!");
      nav(from, { replace: true });
    } catch (err) {
      //console.log(err);
      toast.error("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div className="divider">OR</div>
      <button
        aria-label="Login with Google"
        onClick={handleGoogleSignin}
        className="btn btn-secondary text-neutral border-[#e5e5e5]"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        {loading ? "Signing in..." : "Login with Google"}
      </button>
    </div>
  );
};

export default SocialLogin;
