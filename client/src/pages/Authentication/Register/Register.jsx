import { useForm, useWatch } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import usePasswordToggle from "../../../hooks/usePasswordToggle";
import useAuthValue from "../../../hooks/useAuthValue";
import { useState } from "react";
import SocialLogin from "../SocialLogin/SocialLogin";
// import useAxiosPublic from "../../../hooks/useAxiosPublic";
const Register = () => {
  const { show, toggle, type: passType } = usePasswordToggle();
  const { createNewUser, updateUserInfo } = useAuthValue();
  const [error, setError] = useState("");
  // const axiosPublic = useAxiosPublic();
  const nav = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const onsubmit = async ({ name, email, password, photo }) => {
      try {
        const { user } = await createNewUser(email, password);
        await updateUserInfo(name, photo);
        console.log(user);
        reset();
        nav("/");
      } catch (err) {
        console.log(err);
        setError(err?.message);
      }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="card-body shadow-xl border rounded border-white/40"
      >
        <h2 className="text-2xl font-semibold ">Register Now ! ! </h2>

        <fieldset className="fieldset">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            id="name"
            {...register("name", {
              required: `Must fill name`,
            })}
            type="text"
            className="input w-full"
            placeholder="Name"
          />
          {errors?.name && (
            <p className="text-red-600 font-semibold">
              {errors?.name?.message}
            </p>
          )}

          <label htmlFor="photo" className="label">
            Photo
          </label>
          <input
            id="photo"
            {...register("photo", {
              required: `Must fill photo`,
            })}
            type="url"
            className="input w-full"
            placeholder="Photo URL"
          />
          {errors?.photo && (
            <p className="text-red-600 font-semibold">
              {errors?.photo?.message}
            </p>
          )}

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
                validate: {
                  hasLowercase: (value) =>
                    /[a-z]/.test(value) ||
                    "Must contain at least one lowercase letter",
                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Must contain at least one uppercase letter",
                  hasNumber: (value) =>
                    /\d/.test(value) || "Must contain at least one number",
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
          {password.length > 0 && (
            <ul className="text-sm mt-2">
              <li
                className={
                  /[a-z]/.test(password) ? "text-green-500" : "text-gray-400"
                }
              >
                At least one lowercase letter
              </li>
              <li
                className={
                  /[A-Z]/.test(password) ? "text-green-500" : "text-gray-400"
                }
              >
                At least one uppercase letter
              </li>
              <li
                className={
                  /\d/.test(password) ? "text-green-500" : "text-gray-400"
                }
              >
                At least one number
              </li>
              <li
                className={
                  password.length >= 6 ? "text-green-500" : "text-gray-400"
                }
              >
                At least 6 characters
              </li>
            </ul>
          )}

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <button disabled={isSubmitting} className="btn btn-primary mt-4">
            {isSubmitting ? "Creating Account" : "Signup"}
          </button>
        </fieldset>
        <p>
          Already have an Account,{" "}
          <Link className="link link-primary" to="/login">
            Login
          </Link>
        </p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;
