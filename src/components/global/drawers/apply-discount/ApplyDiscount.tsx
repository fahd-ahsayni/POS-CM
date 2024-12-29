import { useState, memo } from "react";
import Drawer from "../../Drawer";
import Authorization from "./views/Authorization";
import ApplyDiscountInfo from "./views/ApplyDiscountInfo";

const ApplyDiscount = memo(
  ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
    const [authorization, setAuthorization] = useState(false);

    return (
      <Drawer open={open} setOpen={setOpen} title="Apply Discount">
        {/* {authorization ? ( */}
          <ApplyDiscountInfo />
        {/**
          
          ) : (
          <Authorization setAuthorization={setAuthorization} />
        )}
          */}
      </Drawer>
    );
  }
);

export default ApplyDiscount;
