import ComboboxSelectOnChange from "@/components/global/ComboboxSelectOnChange";
import InputComponent from "@/components/global/InputField";
import VirtualKeyboard from "@/components/keyboard/VirtualKeyboard";
import { Client, ClientFormData } from "@/interfaces/clients";
import { loadingColors } from "@/preferences";
import { useEffect, useRef, useState } from "react";
import { BeatLoader } from "react-spinners";

interface ClientFormProps {
  formData: ClientFormData;
  errors: Partial<ClientFormData>;
  handleInputChange: (
    field: keyof ClientFormData
  ) => (value: string | number | null) => void;
  handlePhoneSelect: (selectedClient: Client | null) => void;
  clients: Client[];
  isFetching: boolean;
  isSubmitting?: boolean;
}

export default function ClientForm({
  formData,
  errors,
  handleInputChange,
  handlePhoneSelect,
  clients,
  isFetching,
  isSubmitting = false,
}: ClientFormProps) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<keyof ClientFormData | null>(
    null
  );
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  // Update refs to remove textarea reference
  const inputRefs = {
    phone: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null), // Change from HTMLTextAreaElement to HTMLInputElement
    email: useRef<HTMLInputElement>(null),
    ice: useRef<HTMLInputElement>(null),
  };

  const handleKeyPress = (key: string) => {
    if (!activeInput) return;
    const currentValue = formData[activeInput] || "";
    let newValue = currentValue;
    let newPosition = cursorPosition;

    if (key === "Backspace") {
      if (cursorPosition > 0) {
        newValue =
          currentValue.slice(0, cursorPosition - 1) +
          currentValue.slice(cursorPosition);
        newPosition = cursorPosition - 1;
      }
    } else {
      newValue =
        currentValue.slice(0, cursorPosition) +
        key +
        currentValue.slice(cursorPosition);
      newPosition = cursorPosition + 1;
    }

    // For phone/ice, ensure only valid characters are accepted
    if (activeInput === "phone" || activeInput === "ice") {
      if (!isNaN(Number(newValue)) || newValue === "" || newValue === "+") {
        handleInputChange(activeInput)(newValue);
        setCursorPosition(newPosition);
      }
    } else {
      handleInputChange(activeInput)(newValue);
      setCursorPosition(newPosition);
    }

    const inputRefCurrent = inputRefs[activeInput]?.current;
    if (inputRefCurrent) {
      setTimeout(() => {
        inputRefCurrent.setSelectionRange(newPosition, newPosition);
        inputRefCurrent.focus();
      }, 0);
    }
  };


  const handleInputFocus = (inputType: keyof ClientFormData) => {
    setActiveInput(inputType);
    setShowKeyboard(true);

    const inputRef = inputRefs[inputType]?.current;
    if (inputRef) {
      setCursorPosition(inputRef.selectionStart || 0);
    }
  };

  useEffect(() => {
    if (activeInput && inputRefs[activeInput]?.current) {
      inputRefs[activeInput].current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [formData.phone, cursorPosition, activeInput]);

  if (isFetching || isSubmitting) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader color={loadingColors.primary} size={10} />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Phone Number Input */}
      <ComboboxSelectOnChange<Client>
        label="Phone Number"
        placeholder="Enter phone number"
        items={clients}
        value={clients.find((c) => c.phone === formData.phone) || null}
        onChange={(selected) => {
          if (typeof selected === "string") {
            handleInputChange("phone")(selected);
          } else if (selected) {
            handlePhoneSelect(selected);
          }
        }}
        displayValue={() => formData.phone}
        filterFunction={(query, client) =>
          client.phone.toLowerCase().includes(query.toLowerCase())
        }
        renderOption={(client) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{client.phone}</span>
          </div>
        )}
        required
        hasError={!!errors.phone}
        errorMessage={errors.phone}
        // --- New Props for Virtual Keyboard Integration ---
        inputRef={inputRefs.phone}
        onFocus={() => handleInputFocus("phone")}
        onSelect={(e) => {
          const selectionStart = (e.target as HTMLInputElement).selectionStart || 0;
          setCursorPosition(selectionStart);
        }}
      />


      {/* Full Name Input */}
      <InputComponent
        config={{
          label: "Full Name / Organization Name",
          placeholder: "Enter your full name or organization name",
          type: "text",
          required: true,
          value: formData.name,
          setValue: handleInputChange("name"),
          errorMessage: errors.name,
          hasError: !!errors.name,
          onFocus: () => handleInputFocus("name"),
          onSelect: (e) => {
            const selectionStart =
              (e.target as HTMLInputElement).selectionStart || 0;
            setCursorPosition(selectionStart);
          }, // ✅ Pass cursor tracking function
        }}
      />

      {/* Address Input (Replaced InputLikeTextarea with InputComponent) */}
      <InputComponent
        config={{
          label: "Address",
          placeholder: "e.g. 123 Main street, Apartment, City",
          type: "text", // Use 'text' type for multi-line input simulation
          required: true,
          value: formData.address || "",
          setValue: handleInputChange("address"),
          errorMessage: errors.address,
          hasError: !!errors.address,
          onFocus: () => handleInputFocus("address"),
          onSelect: (e) => {
            const selectionStart =
              (e.target as HTMLInputElement).selectionStart || 0;
            setCursorPosition(selectionStart);
          }, // ✅ Pass cursor tracking function
        }}
      />

      {/* Email Input */}
      <InputComponent
        config={{
          label: "Email",
          placeholder: "e.g. example@gmail.com",
          type: "email",
          required: false,
          value: formData.email || "",
          setValue: handleInputChange("email"),
          errorMessage: errors.email,
          hasError: !!errors.email,
          optionalText: "Optional",
          onFocus: () => handleInputFocus("email"),
          onSelect: (e) => {
            const selectionStart =
              (e.target as HTMLInputElement).selectionStart || 0;
            setCursorPosition(selectionStart);
          }, // ✅ Pass cursor tracking function
        }}
      />

      {/* Company Identification Number (ICE) Input */}
      <InputComponent
        config={{
          label: "Company Identification Number",
          placeholder: "Enter 14-digit company ICE",
          type: "text",
          required: false,
          value: formData.ice || "",
          setValue: handleInputChange("ice"),
          errorMessage: errors.ice,
          hasError: !!errors.ice,
          optionalText: "Optional",
          helperText: "Required for businesses. Skip for individual clients.",
          onFocus: () => handleInputFocus("ice"),
          onSelect: (e) => {
            const selectionStart =
              (e.target as HTMLInputElement).selectionStart || 0;
            setCursorPosition(selectionStart);
          }, // ✅ Pass cursor tracking function
        }}
      />

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <VirtualKeyboard
          onClose={() => setShowKeyboard(false)}
          onKeyPress={handleKeyPress}
          inputType={activeInput}
        />
      )}
    </div>
  );
}
