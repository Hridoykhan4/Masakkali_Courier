import { useForm, useWatch } from "react-hook-form";
import calculateParcelCost from "./parcel.utils";
import coverageData from "../../utils/coverageData";
import { useEffect, useRef, useState } from "react";
import useAuthValue from "../../hooks/useAuthValue";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router";

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
  const senderCenterRef = useRef(null);
  const receiverCenterRef = useRef(null);
  const { user } = useAuthValue();
  const [costBreakdown, setCostBreakDown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const coverage = coverageData;
  const navigate = useNavigate();
  const senderRegion = useWatch({
    control,
    name: "senderRegion",
    defaultValue: "",
  });

  const receiverRegion = useWatch({
    control,
    name: "receiverRegion",
    defaultValue: "",
  });

  useEffect(() => {
    if (senderRegion && senderCenterRef.current) {
      senderCenterRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [senderRegion]);

  useEffect(() => {
    if (receiverRegion && receiverCenterRef.current) {
      receiverCenterRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [receiverRegion]);

  useEffect(() => {
    if (receiverRegion && receiverCenterRef.current) {
      receiverCenterRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [receiverRegion]);

  const uniqueRegions = [...new Set(coverage.map((w) => w.region))];
  const regionsVal = uniqueRegions.map((region) => (
    <option key={region} value={region}>
      {region}
    </option>
  ));

  const parcelType = useWatch({
    control,
    name: "parcelType",
    defaultValue: "",
  });

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
        setPendingData(null);
        setCostBreakDown(null);
        setShowModal(false);
        navigate("/dashboard/myParcels");
      },
    });
  };

  useEffect(() => {
    if (parcelType === "document") {
      setValue("weight", null);
    }
  }, [parcelType, setValue]);

  return (
    <Motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, ease: "easeInOut", duration: 0.9 }}
      className="max-w-6xl mx-auto p-4"
    >
      <div className="card bg-base-100 shadow-xl">
        {showModal && costBreakdown && (
          <dialog
            onClose={() => setShowModal(false)}
            className="modal modal-open modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Cost Breakdown</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Base Charge</span>
                  <span>৳ {costBreakdown.baseCost}</span>
                </li>
                {costBreakdown.weightCharge > 0 && (
                  <li className="flex justify-between">
                    <span>Extra Weight Charge</span>
                    <span>৳ {costBreakdown.weightCharge}</span>
                  </li>
                )}
                {costBreakdown.regionCharge > 0 && (
                  <li className="flex justify-between">
                    <span>Inter-region Charge</span>
                    <span>৳ {costBreakdown.regionCharge}</span>
                  </li>
                )}
                <hr />
                <li className="flex justify-between font-semibold text-base">
                  <span>Total Cost</span>
                  <span>৳ {costBreakdown.total}</span>
                </li>
              </ul>

              <div className="modal-action">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-error text-base-content"
                >
                  Close
                </button>
                <button onClick={handleConfirm} className="btn btn-primary">
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Confirm & Proceed"
                  )}
                </button>
              </div>
            </div>
          </dialog>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Add Parcel</h2>
            <p className="text-gray-500">
              Door-to-door delivery requires pickup & delivery information
            </p>
          </div>

          {/* PARCEL INFO S */}
          <Motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            <h3 className="md:col-span-3 font-semibold text-lg">Parcel Info</h3>
            <select
              {...register("parcelType", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Type</option>
              <option value="document">Document</option>
              <option value="non-document">Non Document</option>
            </select>

            <input
              {...register("title", { required: true })}
              placeholder="Parcel Title"
              className="input input-bordered w-full"
            />

            {parcelType === "non-document" && (
              <input
                min={1}
                step={0.1}
                type="number"
                required={parcelType === "non-document"}
                {...register("weight")}
                placeholder="Weight (kg)"
                className="input input-bordered w-full"
              />
            )}
          </Motion.section>

          {/* PARCEL INFO E */}

          {/* ======= Sender Info S */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <h3 className="md:col-span-3 font-semibold text-lg">Sender Info</h3>

            <input
              {...register("senderName", { required: true })}
              className="input input-bordered w-full"
              placeholder="Sender Name"
              readOnly
            />

            <input
              {...register("senderContact", {
                required: "Mobile number is required",
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: "Enter valid Bangladeshi number",
                },
              })}
              inputMode="numeric"
              maxLength={11}
              className="input input-bordered w-full"
              placeholder="Contact (e.g. 017XXXXXXXX)"
            />
            {errors?.senderContact && (
              <p className="text-red-500 text-sm mt-1">
                {errors.senderContact.message}
              </p>
            )}

            <select
              {...register("senderRegion", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Region</option>
              {regionsVal}
            </select>

            <select
              disabled={!senderRegion}
              ref={senderCenterRef}
              {...register("senderServiceCenter", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Service Center</option>
              {getDistrictsByRegion(senderRegion).map((district) => (
                <option value={district} key={district}>
                  {district}
                </option>
              ))}
            </select>

            <textarea
              {...register("senderAddress", { required: true })}
              className="textarea textarea-bordered w-full md:col-span-2"
              placeholder="Pickup Address"
            />

            <textarea
              {...register("pickupInstruction")}
              className="textarea w-full textarea-bordered"
              placeholder="Pickup Instruction"
            />
          </section>

          {/* ======= Sender Info E */}

          {/* ================= Receiver Info ================= */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <h3 className="md:col-span-3 font-semibold text-lg">
              Receiver Info
            </h3>
            <input
              {...register("receiverName", { required: true })}
              className="input input-bordered w-full"
              placeholder="Receiver Name"
            />

            <input
              {...register("receiverContact", {
                required: "Receiver contact is required",
                pattern: {
                  value: /^01[3-9]\d{8}$/,
                  message: "Enter valid Bangladeshi number",
                },
                validate: (value) =>
                  // eslint-disable-next-line react-hooks/incompatible-library
                  value !== watch("senderContact") ||
                  "Sender & Receiver cannot be same",
              })}
              inputMode="numeric"
              maxLength={11}
              className="input input-bordered w-full"
              placeholder="Contact"
            />

            {errors?.receiverContact && (
              <p className="text-red-500 text-sm mt-1">
                {errors.receiverContact.message}
              </p>
            )}

            <select
              {...register("receiverRegion", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Region</option>
              {regionsVal}
            </select>

            <select
              disabled={!receiverRegion}
              ref={receiverCenterRef}
              {...register("receiverServiceCenter", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Service Center</option>
              {getDistrictsByRegion(receiverRegion).map((district) => (
                <option value={district} key={district}>
                  {district}
                </option>
              ))}
            </select>

            <textarea
              {...register("receiverAddress", { required: true })}
              className="textarea textarea-bordered md:col-span-2"
              placeholder="Delivery Address"
            />

            <textarea
              {...register("deliveryInstruction")}
              className="textarea textarea-bordered"
              placeholder="Delivery Instruction"
            />
          </section>
          {/* ================= Receiver Info ================= */}

          <button
            disabled={isSubmitting}
            className="btn text-base-200 btn-primary w-full"
          >
            {mode === "create" ? "Add Parcel" : "Update Parcel"}
          </button>
        </form>
      </div>
    </Motion.div>
  );
};

export default ParcelForm;
