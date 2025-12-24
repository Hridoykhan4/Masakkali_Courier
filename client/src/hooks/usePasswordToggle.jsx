import { useState } from "react";

const usePasswordToggle = () => {
    const [show, setShow] = useState(false)

    const toggle = () => setShow(prev => !prev )

    return {
        show,
        toggle,
        type: show ? 'text' : 'password'
    }
};

export default usePasswordToggle;