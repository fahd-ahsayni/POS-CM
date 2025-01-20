import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { BeatLoader } from "react-spinners";
import { useAddClient } from "../hooks/useAddClient";
import ClientForm from "../layouts/ClientForm";
import { loadingColors } from "@/preferences";

export default function NumberOfTabel() {
  const {
    handleSubmit,
    isLoading,
    formData,
    errors,
    handleInputChange,
    handlePhoneSelect,
    clients,
    isFetching,
    handleClose,
  } = useAddClient();

  return (
    <div className="flex flex-col justify-start h-full">
      <TypographyH3 className="font-medium">
        Enter the table number to start the order:
      </TypographyH3>
      <div className="flex flex-col justify-center items-center px-1 relative h-full">
        <div className="w-full">
          <ClientForm
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handlePhoneSelect={handlePhoneSelect}
            clients={clients}
            isFetching={isFetching}
            isSubmitting={isLoading}
          />
        </div>
        <div className="flex gap-x-2 w-full absolute bottom-0">
          <Button
            variant="secondary"
            className="flex-1 border border-border"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <BeatLoader color={loadingColors.primary} size={8} /> : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
