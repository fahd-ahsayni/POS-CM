import { Client } from "@/types/clients";
import ComboboxSelectOnChange from "@/components/global/ComboboxSelectOnChange";
import InputComponent from "@/components/global/InputField";
import InputLikeTextarea from "@/components/global/InputLikeTextarea";
import { Button } from "@/components/ui/button";
import { useAddClient } from "@/components/views/home/right-section/hooks/useAddClient";
import { BeatLoader } from "react-spinners";

interface ClientFormProps {
  onClose: () => void;
}

export default function ClientForm({ onClose }: ClientFormProps) {
  const {
    clients,
    isLoading,
    isFetching,
    formData,
    errors,
    handleInputChange,
    handlePhoneSelect,
    handleSubmit,
  } = useAddClient(onClose);

  console.log(formData);

  if (isFetching) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader color="#fb0000" size={10} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
      />

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
        }}
      />

      <InputLikeTextarea
        label="Address"
        placeholder="Enter your address"
        rows={2}
        value={formData.address}
        setValue={handleInputChange("address")}
        error={errors.address}
        required
        maxLength={200}
      />

      <InputComponent
        config={{
          label: "Email",
          placeholder: "e.g. example@gmail.com",
          type: "email",
          required: false,
          value: formData.email,
          setValue: handleInputChange("email"),
          errorMessage: errors.email,
          hasError: !!errors.email,
          optionalText: "(Optional)",
        }}
      />

      <InputComponent
        config={{
          label: "Company Identification Number",
          placeholder: "Enter 14-digit company ICE",
          type: "text",
          required: false,
          value: formData.ice,
          setValue: handleInputChange("ice"),
          errorMessage: errors.ice,
          hasError: !!errors.ice,
          optionalText: "(Optional)",
        }}
      />

      <div className="flex gap-x-1.5 w-full mt-6">
        <Button
          variant="secondary"
          className="flex-1 border border-border"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <BeatLoader color="#fff" size={10} /> : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
