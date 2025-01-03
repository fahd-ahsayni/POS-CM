import ClientForm from "@/components/views/home/right-section/layouts/ClientForm";
import Drawer from "../../Drawer";

import { Button } from "@/components/ui/button";
import { useAddClient } from "@/components/views/home/right-section/hooks/useAddClient";
import { BeatLoader } from "react-spinners";
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
    setOpen(false);
    setFormData({
      name: "",
      phone: "",
      address: "",
      email: "",
      ice: "",
    });
  };

  return (
    <Drawer open={open} setOpen={setOpen} title="Client">
      <div className="relative h-full">
        <ClientForm
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          handlePhoneSelect={handlePhoneSelect}
          clients={clients}
          isFetching={isFetching}
        />
        <div className="flex gap-x-4 pb-2 absolute bottom-0 w-full">
          <Button
            variant="secondary"
            className="flex-1 dark:bg-white/10 bg-white border border-border"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            {isLoading ? <BeatLoader color="#fff" size={10} /> : "Save"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
