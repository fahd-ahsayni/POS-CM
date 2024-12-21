import React from "react";
import {
  keyboardConfig,
  KeyboardRow,
  KeyboardKey,
  numbersRow,
} from "./config/keyboardConfig";
import { useKeyboard } from "./context/KeyboardContext";
import Key from "./Key";
import { motion, AnimatePresence } from "framer-motion";

const Keyboard: React.FC = () => {
  const { isOpen, handleKeyPress, isShiftActive, isNumbersVisible } = useKeyboard();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.25 }}
          drag
          dragMomentum={false}
          className={`fixed cursor-pointer left-0 right-0 top-0 bottom-0 mx-auto my-auto h-fit w-[95%] z-50 ${keyboardConfig.grid.bgColor} p-4 rounded-lg shadow-lg border border-white/30`}
          style={{
            maxWidth: keyboardConfig.grid.maxWidth,
          }}
        >
          <div className="grid grid-cols-11 gap-2">
            <AnimatePresence>
              {isNumbersVisible && (
                <motion.div 
                  className="col-span-11 grid grid-cols-11 gap-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {numbersRow.keys.map((key: KeyboardKey, keyIndex: number) => (
                    <Key
                      key={`numbers-${keyIndex}`}
                      label={key.label === "-" ? (isShiftActive ? "_" : "-") : key.label}
                      color={key.color || "bg-[#646567]"}
                      isIcon={key.isIcon || false}
                      icon={key.icon}
                      onClick={() => handleKeyPress(key.label)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {keyboardConfig.layout.map((row: KeyboardRow, rowIndex: number) =>
              row.keys.map((key: KeyboardKey, keyIndex: number) => (
                <Key
                  key={`${rowIndex}-${keyIndex}`}
                  label={
                    key.label === "space"
                      ? ""
                      : key.label === "shift"
                      ? key.label
                      : isShiftActive
                      ? key.label.toUpperCase()
                      : key.label
                  }
                  color={key.color || "bg-[#646567]"}
                  isIcon={key.isIcon || false}
                  icon={key.icon}
                  onClick={() => handleKeyPress(key.label)}
                />
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(Keyboard);
