import { useState } from "react";
import BaseModal from "./Layout/BaseModal";
import InputComponent from "../InputComponent";

interface IpAddressModalProps {
  isOpen: boolean;
  onConfirm: (ip: string, port: string) => void;
  onCancel: () => void;
}

export default function IpAddressModal({
  isOpen,
  onConfirm,
  onCancel,
}: IpAddressModalProps) {
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("");

  const handleConfirm = () => {
    onConfirm(ipAddress, port);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      closeModal={onCancel}
      title="Enter IP Address"
      description="Please enter a valid IP address"
      onConfirm={handleConfirm}
      onCancel={onCancel}
      confirmText="Confirm"
      cancelText="Cancel"
    >
      <div className="flex gap-2">
        <InputComponent
          config={{
            type: "text",
            placeholder: "Enter the IP address",
            value: ipAddress,
            setValue: (value) => setIpAddress(value as string),
          }}
          className="w-3/4"
        />
        <InputComponent
          config={{
            type: "text",
            placeholder: "Port",
            value: port,
            setValue: (value) => setPort(value as string),
          }}
          className="w-1/4"
        />
      </div>
    </BaseModal>
  );
}
