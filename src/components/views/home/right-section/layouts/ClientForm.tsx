import PhoneInputWithSuggestions from "@/components/global/PhoneInputWithSuggestions";
import InputComponent from "@/components/global/InputComponent";
import { Client, ClientFormData } from "@/interfaces/clients";
import { loadingColors } from "@/preferences";
import { useRef, useCallback } from "react";
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
  // Define refs for inputs
  const inputRefs = {
    phone: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
  };

  // Handle phone selection
  const handlePhoneSelection = useCallback((client: Client | null) => {
    handlePhoneSelect(client);
  }, [handlePhoneSelect]);

  // Handle focus on name input after selecting a client
  const focusNameInput = useCallback(() => {
    setTimeout(() => {
      if (inputRefs.name.current) {
        inputRefs.name.current.focus();
      }
    }, 100);
  }, [inputRefs.name]);

  // Handle loading state
  if (isFetching || isSubmitting) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader color={loadingColors.primary} size={10} />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Phone Number Input with Suggestions */}
      <PhoneInputWithSuggestions
        value={formData.phone}
        onChange={handleInputChange("phone")}
        onSelectClient={handlePhoneSelection}
        onClientSelect={focusNameInput}
        clients={clients}
        isFetching={isFetching}
        hasError={!!errors.phone}
        errorMessage={errors.phone}
        inputRef={inputRefs.phone}
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
          ref: inputRefs.name,
        }}
      />

      {/* Address Input */}
      <InputComponent
        config={{
          label: "Address",
          placeholder: "e.g. 123 Main street, Apartment, City",
          type: "text",
          required: true,
          value: formData.address || "",
          setValue: handleInputChange("address"),
          errorMessage: errors.address,
          hasError: !!errors.address,
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
        }}
      />
    </div>
  );
}
