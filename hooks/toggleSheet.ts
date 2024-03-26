import React from "react";

export const useToggleSheet = (ref: any) => {
    return React.useCallback(() => {
        const trigger = ref.current;
        if (trigger) {
            trigger.click();
        }
    }, []);
};
