import { useEffect, useRef } from "react";

export const useFirstRender = (): boolean => {
    const isFirstRender = useRef(true);

    useEffect(() => {
        isFirstRender.current = false;
    }, []);

    return isFirstRender.current;
};
