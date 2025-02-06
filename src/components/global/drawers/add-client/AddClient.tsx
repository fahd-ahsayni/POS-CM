import ClientForm from "@/components/views/home/right-section/layouts/ClientForm";
import Drawer from "../layout/Drawer";

import { Button } from "@/components/ui/button";
import { useAddClient } from "@/components/views/home/right-section/hooks/useAddClient";
import { BeatLoader } from "react-spinners";
import { loadingColors } from "@/preferences";

export default function AddClient({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const {
    formData,
    errors,
    handleInputChange,
    handlePhoneSelect,
    clients,
    isFetching,
    setFormData,
    isLoading,
    handleSubmit,
  } = useAddClient();

  const handleCancel = () => {
    if (!isLoading) {
      setOpen(false);
      setFormData({
        name: "",
        phone: "",
        address: "",
        email: "",
        ice: "",
      });
    }
  };

  const handleAddComplete = async () => {
    try {
      const success = await handleSubmit();
      if (success) {
        setOpen(false);
        setFormData({
          name: "",
          phone: "",
          address: "",
          email: "",
          ice: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Drawer
      open={open}
      setOpen={(newOpen) => {
        // Prevent closing if loading
        if (!isLoading) {
          setOpen(newOpen);
        }
      }}
      title="Add New Client"
      description="Add a new client to manage their orders and information"
    >
      <div className="relative h-full">
        <div className="px-4">
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
        <div className="flex gap-x-4 pb-2 absolute bottom-0 w-full px-4">
          <Button
            variant="secondary"
            className="flex-1 dark:bg-white/10 bg-white border border-border"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleAddComplete}
            disabled={isLoading}
          >
            {isLoading ? (
              <BeatLoader color={loadingColors.primary} size={8} />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
