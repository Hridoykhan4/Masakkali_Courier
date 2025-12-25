import { useForm } from "react-hook-form";
import usePasswordToggle from "../../../hooks/usePasswordToggle";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
const Login = () => {
  const { show, toggle, type: passType } = usePasswordToggle();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onsubmit = ({ email, password }) => {
    console.log(email, password);

    reset();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="card-body shadow-xl border rounded border-white/40"
      >
        <h2 className="text-2xl font-semibold ">Login Now ! ! </h2>
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
          <Link className="link link-primary" to="/register">
            Sign Up
          </Link>
        </p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Login;
