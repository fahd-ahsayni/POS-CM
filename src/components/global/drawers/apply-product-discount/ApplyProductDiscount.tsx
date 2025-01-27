import { useState, memo, useCallback } from "react";
import Drawer from "../../Drawer";
import Authorization from "../auth/Authorization";
import ApplyProductDiscountInfo from "@/components/global/drawers/apply-product-discount/views/ApplyProductDiscountInfo";
import { ProductSelected } from "@/interfaces/product";

interface ApplyProductDiscountProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderLine: ProductSelected;
}

const ApplyProductDiscount = memo(({ open, setOpen, orderLine }: ApplyProductDiscountProps) => {
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
      title="Authorize Product Discount"
      classNames="max-w-md"
      description="Apply discount to selected product."
    >
      {authorization ? (
        <ApplyProductDiscountInfo 
          admin={admin} 
          setOpen={handleClose}
          setAuthorization={setAuthorization}
          orderLine={orderLine}
        />
      ) : (
        <Authorization
          setAuthorization={setAuthorization}
          setAdmin={setAdmin}
        />
      )}
    </Drawer>
  );
});

ApplyProductDiscount.displayName = "ApplyProductDiscount";

export default ApplyProductDiscount;