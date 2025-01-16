import { memo, useCallback, useState } from "react";
import Drawer from "../../Drawer";
import Authorization from "../auth/Authorization";
import EditPriceInfo from "./views/EditPriceInfo";
import { useOrder } from "../order-details/context/OrderContext";

const EditPrice = memo(
  ({ 
    open, 
    setOpen, 
    onPriceChange 
  }: { 
    open: boolean; 
    setOpen: (open: boolean) => void;
    onPriceChange?: (price: number) => void;
  }) => {
    const [authorization, setAuthorization] = useState(false);
    const [admin, setAdmin] = useState<any>({});
    const { selectedOrder } = useOrder();

    console.log(selectedOrder);

    const handleClose = useCallback(() => {
      setOpen(false);
      setAuthorization(false);
      setAdmin({});
    }, [setOpen]);

    return (
      <Drawer
        open={open}
        setOpen={handleClose}
        title="Authorize Price Edit"
        classNames="max-w-lg"
      >
        {authorization ? (
          <EditPriceInfo
            admin={admin}
            setOpen={handleClose}
            setAuthorization={setAuthorization}
            selectedOrder={selectedOrder}
            onPriceChange={onPriceChange}
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

EditPrice.displayName = "EditPrice";

export default EditPrice;
