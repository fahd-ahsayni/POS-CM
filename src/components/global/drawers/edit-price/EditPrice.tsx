import { memo, useCallback, useState } from "react";
import Drawer from "../../Drawer";
import Authorization from "../auth/Authorization";
import { useOrder } from "../order-details/context/OrderContext";
import EditPriceInfo from "./views/EditPriceInfo";

const EditPrice = memo(
  ({
    open,
    setOpen,
    onPriceChange,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    onPriceChange?: (price: number) => void;
  }) => {
    const [authorization, setAuthorization] = useState(false);
    const [admin, setAdmin] = useState<any>({});
    const { selectedOrder } = useOrder();

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
        classNames="max-w-md"
        description="Enter admin credentials to edit price"
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
