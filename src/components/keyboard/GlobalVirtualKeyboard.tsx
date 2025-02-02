import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import VirtualKeyboard from "./VirtualKeyboard";
import { useVirtualKeyboard } from "./VirtualKeyboardGlobalContext";

const GlobalVirtualKeyboard: React.FC = () => {
    const { showKeyboard, onKeyPress, closeKeyboard, activeInput } = useVirtualKeyboard();

    // Memoize the onClose callback to prevent unnecessary re-renders
    const handleClose = useCallback(() => {
        closeKeyboard();
    }, [closeKeyboard]);

    // Ensure the keyboard is not rendered if it's not visible
    if (!showKeyboard || !onKeyPress) return null;

    return createPortal(
        <VirtualKeyboard
            onClose={handleClose}
            onKeyPress={onKeyPress} // Pass the onKeyPress callback to the VirtualKeyboard
            inputType={activeInput || null}
        />,
        document.body
    );
};

// Optimize re-renders with React.memo
export default React.memo(GlobalVirtualKeyboard);