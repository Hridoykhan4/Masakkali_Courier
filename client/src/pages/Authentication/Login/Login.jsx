import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import usePasswordToggle from "../../../hooks/usePasswordToggle";
import useAuthValue from "../../../hooks/useAuthValue";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const { signInUser } = useAuthValue();
  const { show, toggle, type: passType } = usePasswordToggle();
  const nav = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      const { user } = await signInUser(email, password);
      nav(from, { replace: true });
      toast.success(`Welcome back, ${user?.displayName || "User"}!`);
    } catch (err) {
      toast.error(
        err?.code === "auth/invalid-credential"
          ? "Invalid Credentials"
          : "Login Failed",
      );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
          Login
        </h2>
        <div className="h-1 w-12 bg-primary rounded-full" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase opacity-40 ml-4">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 text-xs" />
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="name@example.com"
              className="input input-bordered w-full pl-12 rounded-2xl h-14 font-semibold focus:ring-2 ring-primary/20 transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-error font-bold ml-4">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase opacity-40 ml-4">
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 text-xs" />
            <input
              {...register("password", { required: "Password is required" })}
              type={passType}
              placeholder="••••••••"
              className="input input-bordered w-full pl-12 pr-12 rounded-2xl h-14 font-semibold"
            />
            <button
              type="button"
              onClick={toggle}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <Link
            to="/forgot-password"
            size="xs"
            className="text-xs font-bold text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          disabled={isSubmitting}
          className="btn btn-primary w-full h-14 rounded-2xl text-lg font-black italic tracking-widest shadow-xl shadow-primary/20"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner" />
          ) : (
            "SECURE LOGIN"
          )}
        </button>
      </form>

      <div className="divider text-[10px] font-black uppercase opacity-20">
        Or Continue With
      </div>
      <SocialLogin from={from} />

      <p className="text-center text-sm font-medium opacity-60">
        New to Masakkali?{" "}
        <Link
          to="/register"
          state={{ from }}
          className="text-primary font-black hover:underline italic"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default Login;
