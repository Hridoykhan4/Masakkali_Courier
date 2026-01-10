import { useForm, useWatch } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import usePasswordToggle from "../../../hooks/usePasswordToggle";
import useAuthValue from "../../../hooks/useAuthValue";
import { useState } from "react";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
const Register = () => {
  const { show, toggle, type: passType } = usePasswordToggle();
  const { createNewUser, updateUserInfo } = useAuthValue();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_PRESET_NAME
    );
    setImageLoading(true);
    try {
      const { data: cloudRes } = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData
      );
      if (!cloudRes?.url) return toast.error("Image Upload failed");
      setPreview(cloudRes.url);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setImageLoading(false);
    }
  };

  const onsubmit = async ({ name, email, password }) => {
    try {
      const { user } = await createNewUser(email, password);
      await updateUserInfo(name, preview);
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

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              {imageLoading ? "Uploading" : "Upload"} Profile Picture
            </legend>
            <input
              accept="image/*"
              disabled={imageLoading}
              onChange={handleFileChange}
              type="file"
              className="file-input"
            />
            <label className="label">Max size 2MB</label>
          </fieldset>

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
      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex mt-6 justify-center pb-4"
        >
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 rounded-lg object-cover border border-gray-200 shadow-md"
          />
        </motion.div>
      )}
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;
