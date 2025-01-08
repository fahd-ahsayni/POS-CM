import { useState, memo } from "react";
import Drawer from "../../Drawer";
import Authorization from "../auth/Authorization";
import CancelOrderReason from "./views/CancelOrderReason";

const CancelOrder = memo(
  ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [authorization, setAuthorization] = useState(false);
    const [admin, setAdmin] = useState<any>({});

    return (
      <Drawer
        open={open}
        setOpen={setOpen}
        title="Cancel order"
        classNames="max-w-lg"
      >
        {authorization ? (
          <CancelOrderReason admin={admin} setOpen={setOpen} setAuthorization={setAuthorization} />
        ) : (
          <Authorization
            setAuthorization={setAuthorization}
            setAdmin={setAdmin}
          />
        )}
      </Drawer>
    );
  }
);

export default CancelOrder;
