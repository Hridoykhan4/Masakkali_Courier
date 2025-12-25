import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const useAuthValue = () => useContext(AuthContext);

export default useAuthValue;
