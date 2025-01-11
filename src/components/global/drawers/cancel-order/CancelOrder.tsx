import { useState, memo, useCallback } from "react";
import Drawer from "../../Drawer";
import Authorization from "../auth/Authorization";
import CancelOrderReason from "./views/CancelOrderReason";

const CancelOrder = memo(
  ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [authorization, setAuthorization] = useState(false);
    const [admin, setAdmin] = useState<any>({});

    const handleClose = useCallback(() => {
      setOpen(false);
      setAuthorization(false);
      setAdmin({});
    }, [setOpen]);


    return (
      <Drawer
        open={open}
        setOpen={handleClose}
        title="Cancel order"
        classNames="max-w-lg"
      >
        {authorization ? (
          <CancelOrderReason
            admin={admin}
            setOpen={handleClose}
            setAuthorization={setAuthorization}
          />
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

CancelOrder.displayName = "CancelOrder";

export default CancelOrder;
