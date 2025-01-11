import { memo, useCallback, useState } from "react";
import Drawer from "../../Drawer";
import Authorization from "../auth/Authorization";
import ApplyDiscountInfo from "./views/ApplyDiscountInfo";

const ApplyDiscount = memo(
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
        title="Authorize discount"
        classNames="max-w-lg"
      >
        {authorization ? (
          <ApplyDiscountInfo 
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

ApplyDiscount.displayName = "ApplyDiscount";

export default ApplyDiscount;
