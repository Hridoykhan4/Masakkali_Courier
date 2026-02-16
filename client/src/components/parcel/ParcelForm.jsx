import { useForm, useWatch } from "react-hook-form";
import calculateParcelCost from "./parcel.utils";
import coverageData from "../../utils/coverageData";
import { useEffect, useRef, useState } from "react";
import useAuthValue from "../../hooks/useAuthValue";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import {
  FaBoxOpen,
  FaTruckLoading,
  FaUserCircle,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaCalculator,
} from "react-icons/fa";

const generateTrackingID = () => {
  const date = new Date();
  const datePart = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PCL-${datePart}-${rand}`;
};

const ParcelForm = ({
  mode = "create",
  defaultValues = {},
  onSubmitParcel,
}) => {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    control,
    watch,
    setValue,
  } = useForm({ defaultValues });

  const [pendingData, setPendingData] = useState(null);
  const [costBreakdown, setCostBreakDown] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuthValue();
  const navigate = useNavigate();
  const coverage = coverageData;

  // Watchers for Live Preview Card
  const watchedData = watch();
  const senderRegion = watchedData.senderRegion;
  const receiverRegion = watchedData.receiverRegion;
  const parcelType = watchedData.parcelType;

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const uniqueRegions = [...new Set(coverage.map((w) => w.region))];
  const getDistrictsByRegion = (region) =>
    coverage.filter((w) => w.region === region).map((r) => r.district) || [];

  const onSubmit = (data) => {
    const cost = calculateParcelCost({
      type: data?.parcelType,
      weight: data?.weight,
      isSameRegion: data?.senderRegion === data?.receiverRegion,
    });
    setPendingData(data);
    setCostBreakDown(cost);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const parcelData = {
      ...pendingData,
      created_by: user?.email,
      delivery_status: "not-collected",
      creation_date: new Date().toISOString(),
      payment_status: "unpaid",
      trackingId: generateTrackingID(),
      cost: costBreakdown.total,
      costBreakDown: costBreakdown,
    };
    await onSubmitParcel(parcelData, {
      onSuccess: () => {
        reset();
        navigate("/dashboard/myParcels");
      },
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: MULTI-STEP FORM (8 Cols) */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-base-content/5 overflow-hidden relative"
          >
            {/* PROGRESS BAR */}
            <div className="flex items-center justify-between mb-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-base-content/10 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(step - 1) * 50}%` }}
              />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${step >= i ? "bg-primary text-white scale-110" : "bg-base-200 text-base-content/30"}`}
                >
                  {step > i ? <FaCheckCircle /> : i}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* STEP 1: PARCEL INFO */}
                {step === 1 && (
                  <motion.div
                    key="st1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <FaBoxOpen size={24} />
                      </div>
                      <h3 className="text-2xl font-black italic tracking-tight">
                        PARCEL SPECIFICATIONS
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label className="label text-[10px] font-black uppercase opacity-40">
                          Item Category
                        </label>
                        <select
                          {...register("parcelType", { required: true })}
                          className="select select-bordered bg-base-200 border-none rounded-2xl h-14"
                        >
                          <option value="">Select Type</option>
                          <option value="document">📄 Document</option>
                          <option value="non-document">📦 Non-Document</option>
                        </select>
                      </div>
                      <div className="form-control">
                        <label className="label text-[10px] font-black uppercase opacity-40">
                          Parcel Title
                        </label>
                        <input
                          {...register("title", { required: true })}
                          className="input input-bordered bg-base-200 border-none rounded-2xl h-14"
                          placeholder="e.g., Business Contract"
                        />
                      </div>
                      {parcelType === "non-document" && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          className="form-control md:col-span-2"
                        >
                          <label className="label text-[10px] font-black uppercase opacity-40">
                            Weight (KG)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            {...register("weight")}
                            className="input input-bordered bg-base-200 border-none rounded-2xl h-14"
                            placeholder="0.5"
                          />
                        </motion.div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn btn-primary w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 mt-8"
                    >
                      NEXT: PICKUP INFO
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: SENDER INFO */}
                {step === 2 && (
                  <motion.div
                    key="st2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <FaUserCircle size={24} />
                      </div>
                      <h3 className="text-2xl font-black italic tracking-tight">
                        SENDER & PICKUP
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        {...register("senderName")}
                        readOnly
                        className="input bg-base-300/50 rounded-xl"
                      />
                      <input
                        {...register("senderContact", { required: true })}
                        className="input input-bordered bg-base-200 border-none rounded-xl"
                        placeholder="Contact Number"
                      />
                      <select
                        {...register("senderRegion", { required: true })}
                        className="select bg-base-200 border-none rounded-xl"
                      >
                        <option value="">Select Region</option>
                        {uniqueRegions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <select
                        {...register("senderServiceCenter", { required: true })}
                        className="select bg-base-200 border-none rounded-xl"
                      >
                        <option value="">Service Center</option>
                        {getDistrictsByRegion(senderRegion).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <textarea
                        {...register("senderAddress", { required: true })}
                        className="textarea bg-base-200 border-none rounded-xl md:col-span-2"
                        placeholder="Full Pickup Address"
                      />
                    </div>
                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-ghost flex-1 h-14 rounded-2xl"
                      >
                        BACK
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary flex-1 h-14 rounded-2xl font-black"
                      >
                        NEXT: RECEIVER
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: RECEIVER INFO */}
                {step === 3 && (
                  <motion.div
                    key="st3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <FaMapMarkedAlt size={24} />
                      </div>
                      <h3 className="text-2xl font-black italic tracking-tight">
                        RECEIVER & DELIVERY
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        {...register("receiverName", { required: true })}
                        className="input bg-base-200 border-none rounded-xl"
                        placeholder="Receiver Name"
                      />
                      <input
                        {...register("receiverContact", { required: true })}
                        className="input bg-base-200 border-none rounded-xl"
                        placeholder="Receiver Contact"
                      />
                      <select
                        {...register("receiverRegion", { required: true })}
                        className="select bg-base-200 border-none rounded-xl"
                      >
                        <option value="">Select Region</option>
                        {uniqueRegions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <select
                        {...register("receiverServiceCenter", {
                          required: true,
                        })}
                        className="select bg-base-200 border-none rounded-xl"
                      >
                        <option value="">Service Center</option>
                        {getDistrictsByRegion(receiverRegion).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <textarea
                        {...register("receiverAddress", { required: true })}
                        className="textarea bg-base-200 border-none rounded-xl md:col-span-2"
                        placeholder="Delivery Address"
                      />
                    </div>
                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-ghost flex-1 h-14 rounded-2xl"
                      >
                        BACK
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-1 h-14 rounded-2xl font-black shadow-lg shadow-primary/30"
                      >
                        CALCULATE TOTAL
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>

        {/* RIGHT: LIVE PREVIEW LABEL (4 Cols) */}
        <div className="lg:col-span-4 sticky top-10 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-primary p-1 rounded-[2.5rem] shadow-2xl overflow-hidden group"
          >
            <div className="bg-primary text-primary-content p-8 rounded-[2.3rem] relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                    Shipping Label
                  </div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold">
                    LIVE PREVIEW
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50">
                      Recipient
                    </span>
                    <p className="text-2xl font-black truncate leading-none">
                      {watchedData.receiverName || "---"}
                    </p>
                    <p className="text-xs opacity-70 font-medium truncate">
                      {watchedData.receiverAddress ||
                        "Address will appear here..."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/10">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block mb-1">
                        Weight
                      </span>
                      <p className="text-lg font-black">
                        {watchedData.weight ||
                          (watchedData.parcelType === "document"
                            ? "0.5"
                            : "0")}{" "}
                        KG
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-50 block mb-1">
                        Service
                      </span>
                      <p className="text-lg font-black capitalize">
                        {watchedData.parcelType || "---"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2">
                      {/* Mock QR Code */}
                      <div className="w-full h-full bg-black/5 rounded flex flex-wrap gap-1 p-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-primary/20 rounded-sm"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black opacity-50">
                        EST. CHARGE
                      </p>
                      <p className="text-3xl font-black italic">৳ --</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-3xl text-primary">
            <FaCalculator />
            <span className="text-xs font-bold tracking-tight">
              Cost is calculated based on weight & region.
            </span>
          </div>
        </div>
      </div>

      {/* --- REFINED MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-base-content/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-base-100 rounded-[3rem] p-10 max-w-md w-full shadow-2xl relative z-10 border border-base-content/10"
            >
              <h3 className="text-3xl font-black tracking-tighter mb-6 italic">
                FINAL QUOTE
              </h3>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between font-medium opacity-60">
                  <span>Base Charge</span>
                  <span>৳ {costBreakdown.baseCost}</span>
                </div>
                {costBreakdown.weightCharge > 0 && (
                  <div className="flex justify-between font-medium opacity-60">
                    <span>Extra Weight</span>
                    <span>৳ {costBreakdown.weightCharge}</span>
                  </div>
                )}
                {costBreakdown.regionCharge > 0 && (
                  <div className="flex justify-between font-medium opacity-60">
                    <span>Inter-region</span>
                    <span>৳ {costBreakdown.regionCharge}</span>
                  </div>
                )}
                <div className="h-px bg-base-content/5 my-2" />
                <div className="flex justify-between text-2xl font-black">
                  <span>Total Cost</span>
                  <span className="text-primary font-outline-2">
                    ৳ {costBreakdown.total}
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost flex-1 h-14 rounded-2xl"
                >
                  RE-EDIT
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn btn-primary flex-1 h-14 rounded-2xl font-black text-lg"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    "CONFIRM"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ParcelForm;
