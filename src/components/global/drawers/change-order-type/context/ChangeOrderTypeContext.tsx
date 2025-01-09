import { createContext, useContext, useState, useCallback } from "react";
import { OrderType } from "@/types";
import { useDispatch } from "react-redux";
import { setOrderTypeId } from "@/store/slices/order/createOrder";

interface ChangeOrderTypeContextType {
  selectedType: OrderType | null;
  showForm: "types" | "client" | "table" | "coaster";
  displayedTypes: OrderType[];
  handleOrderTypeSelect: (orderType: OrderType) => void;
  handleBack: () => void;
  setOpen: (open: boolean) => void;
}

const ChangeOrderTypeContext = createContext<ChangeOrderTypeContextType | null>(
  null
);

export function ChangeOrderTypeProvider({
  children,
  setOpen,
}: {
  children: React.ReactNode;
  setOpen: (open: boolean) => void;
}) {
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState<OrderType | null>(null);
  const [showForm, setShowForm] = useState<
    "types" | "client" | "table" | "coaster"
  >("types");
  const [displayedTypes, setDisplayedTypes] = useState<OrderType[]>(
    JSON.parse(localStorage.getItem("generalData") || "{}").orderTypes.filter(
      (type: OrderType) => !type.parent_id
    )
  );

  const handleOrderTypeSelect = useCallback(
    (orderType: OrderType) => {
      setSelectedType(orderType);

      if (orderType.children.length > 0) {
        setDisplayedTypes(orderType.children);
      } else {
        dispatch(
          setOrderTypeId({
            order_type_id: orderType._id,
            table_id: orderType.select_table ? undefined : null,
            client_id: orderType.select_client ? undefined : null,
            coaster_call: orderType.select_coaster_call ? undefined : null,
          })
        );

        localStorage.setItem("orderType", JSON.stringify(orderType));

        if (orderType.select_client) {
          setShowForm("client");
        } else if (orderType.select_table) {
          setShowForm("table");
        } else if (orderType.select_coaster_call) {
          setShowForm("coaster");
        } else {
          setOpen(false);
        }
      }
    },
    [dispatch, setOpen]
  );

  const handleBack = useCallback(() => {
    if (showForm !== "types") {
      setShowForm("types");
      setSelectedType(null);
    } else if (selectedType) {
      setSelectedType(null);
      setDisplayedTypes(
        JSON.parse(
          localStorage.getItem("generalData") || "{}"
        ).orderTypes?.filter((type: OrderType) => !type.parent_id)
      );
    }
  }, [selectedType, showForm]);

  return (
    <ChangeOrderTypeContext.Provider
      value={{
        selectedType,
        showForm,
        displayedTypes,
        handleOrderTypeSelect,
        handleBack,
        setOpen,
      }}
    >
      {children}
    </ChangeOrderTypeContext.Provider>
  );
}

export const useChangeOrderType = () => {
  const context = useContext(ChangeOrderTypeContext);
  if (!context)
    throw new Error(
      "useChangeOrderType must be used within ChangeOrderTypeProvider"
    );
  return context;
};
