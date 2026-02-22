import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import useAuthValue from "../../../hooks/useAuthValue";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import usePasswordToggle from "../../../hooks/usePasswordToggle";

const Register = () => {
  const { createNewUser, updateUserInfo } = useAuthValue();
  const axiosPublic = useAxiosPublic();
  const { show, toggle, type: passType } = usePasswordToggle();
  const [preview, setPreview] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm();
  const password = useWatch({ control, name: "password", defaultValue: "" });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_PRESET_NAME,
    );

    setImageLoading(true);
    try {
      const { data } = await axiosPublic.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
      );
      setPreview(data.secure_url);
    } catch (err) {
      console.log(err);
      toast.error("Image upload failed");
    } finally {
      setImageLoading(false);
    }
  };

  const onRegister = async ({ name, email, password }) => {
    if (!preview) return toast.warning("Please upload a profile picture");
    try {
      await createNewUser(email, password);
      await updateUserInfo(name, preview);

      const userInfo = {
        name,
        email,
        photoURL: preview,
        role: "user",
        createdAt: new Date(),
      };
      await axiosPublic.post("/users", userInfo);

      toast.success("Account Created!");
      nav("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
          Sign Up
        </h2>
        <div className="h-1 w-12 bg-primary rounded-full" />
      </div>

      <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
        {/* Profile Upload */}
        <div className="flex justify-center mb-6">
          <label className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-base-200 border-2 border-dashed border-primary/30 flex items-center justify-center ring-4 ring-base-100 shadow-xl">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <FaCamera className="text-2xl opacity-20" />
              )}
              {imageLoading && (
                <div className="absolute inset-0 bg-base-100/80 flex items-center justify-center">
                  <span className="loading loading-spinner text-primary" />
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
              <FaCamera size={12} />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase opacity-40 ml-4">
              Full Name
            </label>
            <input
              {...register("name", { required: true })}
              className="input input-bordered w-full rounded-2xl h-12"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase opacity-40 ml-4">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              className="input input-bordered w-full rounded-2xl h-12"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase opacity-40 ml-4">
            Set Password
          </label>
          <div className="relative">
            <input
              type={passType}
              {...register("password", { required: true, minLength: 6 })}
              className="input input-bordered w-full rounded-2xl h-12 pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={toggle}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30"
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {password.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="grid grid-cols-2 gap-2 px-4 py-2 bg-base-200/50 rounded-2xl"
            >
              {[
                { label: "6+ Char", met: password.length >= 6 },
                { label: "Uppercase", met: /[A-Z]/.test(password) },
                { label: "Lowercase", met: /[a-z]/.test(password) },
                { label: "Number", met: /\d/.test(password) },
              ].map((req, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-[10px] font-bold ${req.met ? "text-success" : "opacity-30"}`}
                >
                  <FaCheckCircle /> {req.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          disabled={isSubmitting || imageLoading}
          className="btn btn-primary w-full h-14 rounded-2xl text-lg font-black italic tracking-widest shadow-xl shadow-primary/20 mt-4"
        >
          {isSubmitting ? "CREATING..." : "START JOURNEY"}
        </button>
      </form>

      <p className="text-center text-sm font-medium opacity-60">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-black hover:underline italic"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;
