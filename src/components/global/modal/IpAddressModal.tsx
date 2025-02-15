import { useState } from "react";
import { toast } from "react-toastify";
import InputComponent from "../InputComponent";
import { createToast } from "../Toasters";
import BaseModal from "./Layout/BaseModal";

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
    // Validate IP address (IPv4) and port (1-65535)
    const ipRegex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    const portRegex = /^[0-9]{1,5}$/;

    if (!ipRegex.test(ipAddress)) {
      toast.warning(
        createToast(
          "Invalid IP address",
          "Please enter a valid IPv4",
          "warning"
        )
      );
      return;
    }
    if (!portRegex.test(port) || parseInt(port, 10) > 65535) {
      toast.warning(
        createToast(
          "Invalid port number",
          "Port must be between 1 and 65535",
          "warning"
        )
      );
      return;
    }

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
