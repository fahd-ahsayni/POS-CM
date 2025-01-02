import ClientForm from "@/components/views/home/right-section/layouts/ClientForm";
import Drawer from "../../Drawer";

export default function AddClient({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} setOpen={setOpen} title="Client">
      <ClientForm />
    </Drawer>
  );
}
