import { useState } from "react";
import Drawer from "../../Drawer";
import Authorization from "./views/Authorization";

export default function ApplyDiscount({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [authorization, setAuthorization] = useState(false);
  return (
    <Drawer open={open} setOpen={setOpen} title="Apply Discount">
      {!authorization ? (
        <Authorization setAuthorization={setAuthorization} />
      ) : (
        <div>Hello</div>
      )}
    </Drawer>
  );
}
