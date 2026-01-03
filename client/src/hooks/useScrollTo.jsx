import { useEffect } from "react";

const useScrollTo = () => {
    return useEffect(() => {
        window.scrollTo({
             top: 0,
             behavior: 'smooth'
        })
    }, [])
};

export default useScrollTo;