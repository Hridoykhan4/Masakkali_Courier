import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

const ParcelForm = ({
  mode = "create",
  defaultValues = {},
  onSubmitParcel,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm({ defaultValues });

  const parcelType = useWatch({
    control,
    name: "parcelType",
    defaultValue: "",
  });

  const onSubmit = (data) => {
    console.log(data);
    toast.success('hh')
    return onSubmitParcel({ ...data });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Add Parcel</h2>
            <p className="text-gray-500">
              Door-to-door delivery requires pickup & delivery information
            </p>
          </div>

          {/* PARCEL INFO S */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <h3 className="md:col-span-3 font-semibold text-lg">Parcel Info</h3>
            <select
              {...register("parcelType", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Type</option>
              <option value="document">document</option>
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
                type="number"
                {...register("weight")}
                placeholder="Weight (kg)"
                className="input input-bordered w-full"
              />
            )}
          </section>

          {/* PARCEL INFO E */}

          {/* ======= Sender Info S */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <h3 className="md:col-span-3 font-semibold text-lg">Sender Info</h3>

            <input
              {...register("senderName", { required: true })}
              className="input input-bordered w-full"
              placeholder="Sender Name"
            />

            <input
              {...register("senderContact", { required: true })}
              className="input input-bordered w-full"
              placeholder="Contact"
            />

            <select
              {...register("senderRegion", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Region</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
            </select>

            <select
              {...register("senderServiceCenter", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Service Center</option>
              <option>Center A</option>
              <option>Center B</option>
            </select>

            <textarea
              {...register("senderAddress", { required: true })}
              className="textarea textarea-bordered md:col-span-2"
              placeholder="Pickup Address"
            />

            <textarea
              {...register("pickupInstruction")}
              className="textarea textarea-bordered"
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
              {...register("receiverContact", { required: true })}
              className="input input-bordered w-full"
              placeholder="Contact"
            />

            <select
              {...register("receiverRegion", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Region</option>
              <option>Dhaka</option>
              <option>Chittagong</option>
            </select>

            <select
              {...register("receiverServiceCenter", { required: true })}
              className="select select-bordered w-full"
            >
              <option value="">Select Service Center</option>
              <option>Center A</option>
              <option>Center B</option>
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

          <button className="btn btn-primary w-full">
            {mode === "create" ? "Add Parcel" : "Update Parcel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParcelForm;
