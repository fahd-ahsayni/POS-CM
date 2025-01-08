import { useState, memo } from "react";
import Drawer from "../../Drawer";
import Authorization from "../auth/Authorization";
import ApplyDiscountInfo from "./views/ApplyDiscountInfo";

const ApplyDiscount = memo(
  ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [authorization, setAuthorization] = useState(false);
    const [admin, setAdmin] = useState<any>({});

    return (
      <Drawer
        open={open}
        setOpen={setOpen}
        title="Authorize discount"
        classNames="max-w-lg"
      >
        {authorization ? (
          <ApplyDiscountInfo admin={admin} setOpen={setOpen} setAuthorization={setAuthorization} />
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

export default ApplyDiscount;
