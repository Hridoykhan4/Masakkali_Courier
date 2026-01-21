import axios from "axios";
import { useEffect } from "react";
import useAuthValue from "./useAuthValue";
import { useNavigate } from "react-router";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});
const useAxiosSecure = () => {
  const { user, logOut } = useAuthValue();
  const navigate = useNavigate();
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await user?.getIdToken();
        config.headers.authorization = `Bearer ${token}`;
        return config;
      },
      (err) => Promise.reject(err),
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      async (error) => {
        console.log(error);
        const status = error?.response?.status;
        if (status === 401) {
          await logOut();
          navigate("/login");
        } else if (status === 403) {
          navigate("/dashboard/forbidden");
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
