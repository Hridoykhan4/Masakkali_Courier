import ParcelForm from "../../components/parcel/ParcelForm";
import useAuthValue from "../../hooks/useAuthValue";

const SendParcel = () => {
    const {user} = useAuthValue()
    const handleSendParcel = data => {
        console.log("Create", data);
    }

    return (
      <ParcelForm
        mode="create"
        defaultValues={{ senderName: user?.displayName || ''}}
        onSubmitParcel={handleSendParcel}
      ></ParcelForm>
    );
};

export default SendParcel;