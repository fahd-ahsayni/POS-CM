import ComboboxSelectOnChange from "@/components/global/ComboboxSelectOnChange";
import InputComponent from "@/components/global/InputField";
import InputLikeTextarea from "@/components/global/InputLikeTextarea";
import { Client, ClientFormData } from "@/types/clients.types";
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
}

export default function ClientForm({
  formData,
  errors,
  handleInputChange,
  handlePhoneSelect,
  clients,
  isFetching,
}: ClientFormProps) {
  if (isFetching) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <BeatLoader color="#fb0000" size={10} />
      </div>
    );
  }

  console.log(formData);
  return (
    <div className="space-y-8 w-full">
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
        placeholder="e.g. 123 Main street, Apartment, City"
        value={formData.address || ""}
        setValue={handleInputChange("address")}
        error={errors.address}
        required
      />

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
        }}
      />
    </div>
  );
}
