import axios from "axios";
import { useEffect } from "react";
import useAuthValue from "./useAuthValue";
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});
const useAxiosSecure = () => {
  const { user } = useAuthValue();
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await user?.getIdToken();
        config.headers.authorization = `Bearer ${token}`;
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      (error) => {
        console.log(error);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  return axiosInstance;
};

export default useAxiosSecure;
