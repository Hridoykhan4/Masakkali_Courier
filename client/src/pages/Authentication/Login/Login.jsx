import { useForm } from "react-hook-form";
import usePasswordToggle from "../../../hooks/usePasswordToggle";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuthValue from "../../../hooks/useAuthValue";
import { toast } from "react-toastify";
const Login = () => {
  const { signInUser } = useAuthValue();
  const { show, toggle, type: passType } = usePasswordToggle();
  const nav = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onsubmit = async ({ email, password }) => {
    try {
      const { user } = await signInUser(email, password);
      reset();
      nav(from, { replace: true });
      toast.success(`Welcome Back ${user?.displayName || ""}`, {
        position: "top-left",
        autoClose: 1500,
      });
    } catch (err) {
      toast.error(
        err?.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : "Login failed. Please try again."
      );
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="card-body shadow-xl border rounded border-white/40"
      >
        <h2 className="text-2xl font-semibold">Login</h2>
        <p className="text-sm text-gray-500">Welcome back! Please sign in.</p>

        <fieldset className="fieldset">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            {...register("email", {
              required: `Must fill email`,
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter valid Email",
              },
            })}
            type="email"
            className="input w-full"
            placeholder="Email"
          />
          {errors?.email && (
            <p className="text-red-600 font-semibold">
              {errors?.email?.message}
            </p>
          )}
          <div className="relative">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type={passType}
              {...register("password", {
                required: "Password must be filled",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="input w-full"
              placeholder="***Password"
            />
            <button
              aria-label={show ? "Hide password" : "Show password"}
              onClick={toggle}
              type="button"
              className="btn btn-sm absolute right-3 bottom-1  btn-outline"
            >
              {show ? <FaEyeSlash /> : <FaEye></FaEye>}
            </button>
          </div>
          {errors?.password && (
            <p className="text-red-600 font-semibold">
              {errors?.password?.message}
            </p>
          )}
          <div>
            <a className="link link-hover">Forgot password?</a>
          </div>
          <button disabled={isSubmitting} className="btn btn-primary mt-4">
            {isSubmitting ? "Logging in" : "Login"}
          </button>
        </fieldset>
        <p>
          New to this Account,{" "}
          <Link state={{from}} className="link link-primary" to="/register">
            Sign Up
          </Link>
        </p>
      </form>
      <SocialLogin from={from}></SocialLogin>
    </div>
  );
};

export default Login;
