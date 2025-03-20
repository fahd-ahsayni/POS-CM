import React from "react";
import { Button } from "../ui/button";

interface KeyboardToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

const KeyboardToggle: React.FC<KeyboardToggleProps> = ({ enabled, onChange }) => {
  const handleToggle = () => {
    onChange(!enabled);
  };

  return (
    <Button
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-[9998] bg-primary-red hover:bg-primary-red/90"
      size="sm"
    >
      {enabled ? "Disable Keyboard" : "Enable Keyboard"}
    </Button>
  );
};

export default KeyboardToggle;
