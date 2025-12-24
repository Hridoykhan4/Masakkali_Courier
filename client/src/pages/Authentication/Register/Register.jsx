import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import usePasswordToggle from "../../../hooks/usePasswordToggle";
const Register = () => {
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
        <h2 className="text-2xl font-semibold ">Register Now ! ! </h2>
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
                pattern: {
                  value: /[a-z]/,
                  message: "Must have at least one lowercase letter",
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
          <button disabled={isSubmitting} className="btn btn-neutral mt-4">
            {isSubmitting ? "Signing in" : "Signup"}
          </button>
        </fieldset>
        <p>
          Already have an Account,{" "}
          <Link className="link link-primary" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
