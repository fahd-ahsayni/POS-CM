import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../..";
import { calculateProductPrice } from "@/functions/priceCalculations";

const initialOrderState: OrderState = {
  waiter_id: null,
  coaster_call: null,
  urgent: false,
  shift_id: localStorage.getItem("shift_id") || "",
  table_id: null,
  delivery_guy_id: null,
  discount: null,
  client_id: null,
  customer_count: 0,
  notes: "",
  one_time: false,
  total_amount: 0,
  changed_price: 0,
  order_type_id: null,
  orderlines: [],
};

const initialState: OrderSliceState = {
  data: initialOrderState,
  status: "idle",
  error: null,
};

const calculateTotalAmount = (orderlines: any[]) => {
  return orderlines.reduce((sum, line) => {
    // Handle combo products
    if (line.is_combo && line.combo_items) {
      const comboBasePrice = line.price || 0;
      const supplementsTotal =
        line.combo_items.supplements?.reduce(
          (suppSum: number, supp: any) =>
            suppSum + (supp.price_ttc || 0) * (supp.quantity || 1),
          0
        ) || 0;

      // Multiply the total combo price by its quantity
      return sum + (comboBasePrice + supplementsTotal) * (line.quantity || 1);
    }

    // Handle regular products
    const unitPrice = line.unit_price || line.price / (line.quantity || 1);
    return sum + unitPrice * (line.quantity || 1);
  }, 0);
};

const orderSlice = createSlice({
  name: "order",
  initialState: {
    data: initialOrderState,
    status: "idle" as const,
    error: null,
  },
  reducers: {
    setOrderData: (state, action: PayloadAction<OrderState>) => {
      state.data = action.payload;
      state.data.total_amount = calculateTotalAmount(state.data.orderlines);
    },
    resetOrder: (state) => {
      const currentShiftId = state.data.shift_id;
      state.data = {
        ...initialOrderState,
        shift_id: currentShiftId,
      };
      state.data.total_amount = calculateTotalAmount(state.data.orderlines);
    },
    updateOrderLine: (state, action: PayloadAction<any>) => {
      const { _id, customerIndex, orderLine } = action.payload;

      // Find the index of the existing order line
      const orderLineIndex = state.data.orderlines.findIndex((ol) => {
        // For combo products, check by id
        if (ol.is_combo) {
          return ol.id === _id && ol.customer_index === customerIndex;
        }
        // For regular products, check by product_variant_id
        return (
          ol.product_variant_id === orderLine.product_variant_id &&
          ol.customer_index === customerIndex
        );
      });

      if (orderLineIndex !== -1) {
        // Update existing order line
        state.data.orderlines[orderLineIndex] = {
          ...state.data.orderlines[orderLineIndex],
          ...orderLine,
          quantity: orderLine.quantity,
          price: orderLine.price,
        };

        // Remove the order line if quantity is 0
        if (orderLine.quantity <= 0) {
          state.data.orderlines.splice(orderLineIndex, 1);
        }
      } else {
        // Add new order line
        state.data.orderlines.push(orderLine);
      }

      // Recalculate total amount
      state.data.total_amount = calculateTotalAmount(state.data.orderlines);
    },
    addOrderLine: (state, action: PayloadAction<any[]>) => {
      const currentMenu = localStorage.getItem("currentMenu");
      const newOrderLines = action.payload.map((line) => {
        // If price is already set and valid, keep it
        if (line.price && line.price > 0) {
          return line;
        }

        // Handle combo products
        if (line.is_combo && line.combo_items) {
          const priceCalc = calculateProductPrice(
            line,
            currentMenu,
            line.quantity || 1
          );
          return {
            ...line,
            price: priceCalc.totalPrice,
            quantity: line.quantity || 1,
          };
        }

        // Handle regular products with variants
        const variant = line.variants?.[0];
        if (!variant)
          return { ...line, price: 0, quantity: line.quantity || 1 };

        const priceCalc = calculateProductPrice(
          line,
          currentMenu,
          line.quantity || 1
        );
        return {
          ...line,
          price: priceCalc.totalPrice,
          quantity: line.quantity || 1,
        };
      });

      // Replace existing order lines with matching product_variant_id and customer_index
      state.data.orderlines = newOrderLines.map((newLine) => {
        const existingLine = state.data.orderlines.find(
          (ol) =>
            (ol.is_combo
              ? ol.id === newLine.id
              : ol.product_variant_id === newLine.product_variant_id) &&
            ol.customer_index === newLine.customer_index
        );
        return existingLine ? { ...existingLine, ...newLine } : newLine;
      });

      state.data.total_amount = calculateTotalAmount(state.data.orderlines);
    },
    removeOrderLine: (state, action: PayloadAction<number>) => {
      state.data.orderlines = state.data.orderlines.filter(
        (_: any, index: number) => index !== action.payload
      );
      state.data.total_amount = calculateTotalAmount(state.data.orderlines);
    },
    updateTotalAmount: (state, action: PayloadAction<number>) => {
      state.data.total_amount = action.payload;
    },
    setCustomerCount: (state, action: PayloadAction<number>) => {
      state.data.customer_count = action.payload;
    },
    setWaiterId: (state, action: PayloadAction<number | null>) => {
      state.data.waiter_id = action.payload;
    },
    setCoasterCall: (state, action: PayloadAction<string | null>) => {
      state.data.coaster_call = action.payload;
    },
    setShiftId: (state, action: PayloadAction<string>) => {
      state.data.shift_id = action.payload;
    },
    setTableId: (state, action: PayloadAction<string | null>) => {
      state.data.table_id = action.payload;
    },
    setDeliveryGuyId: (state, action: PayloadAction<string | null>) => {
      state.data.delivery_guy_id = action.payload;
    },
    setClientId: (state, action: PayloadAction<string | null>) => {
      state.data.client_id = action.payload;
    },
    setOneTime: (state, action: PayloadAction<boolean>) => {
      state.data.one_time = action.payload;
    },
    setOrderTypeId: (
      state,
      action: PayloadAction<SetOrderTypePayload | string | null>
    ) => {
      // Handle both simple string/null input and complex payload
      if (typeof action.payload === "string" || action.payload === null) {
        // Reset all related fields when only order_type_id is provided
        state.data = {
          ...state.data,
          order_type_id: action.payload,
          client_id: null,
          table_id: null,
          coaster_call: null,
        };
      } else {
        // Keep provided values and only reset those that weren't specified
        const { order_type_id, table_id, client_id, coaster_call } =
          action.payload;
        state.data = {
          ...state.data,
          order_type_id,
          table_id: table_id ?? null,
          client_id: client_id ?? null,
          coaster_call: coaster_call ?? null,
        };
      }
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.data.notes = action.payload;
    },
    setUrgent: (state, action: PayloadAction<boolean>) => {
      state.data.urgent = action.payload;
    },
    setDiscount: (state, action: PayloadAction<any | null>) => {
      state.data.discount = action.payload;
    },
    holdOrder: (state) => {
      const holdOrders = JSON.parse(localStorage.getItem("holdOrders") || "[]");
      const newHoldOrder = {
        ...state.data,
        id: Date.now(), // unique identifier
        createdAt: new Date().toISOString(),
        status: "waiting",
      };

      holdOrders.push(newHoldOrder);
      localStorage.setItem("holdOrders", JSON.stringify(holdOrders));

      // Reset the current order
      state.data = initialState.data;
    },
    resetCoasterCall: (state) => {
      state.data.coaster_call = null;
    },
    resetTableId: (state) => {
      state.data.table_id = null;
    },
    resetClientId: (state) => {
      state.data.client_id = null;
    },
  },
});

export const {
  holdOrder,
  setOrderData,
  resetOrder,
  updateOrderLine,
  addOrderLine,
  removeOrderLine,
  updateTotalAmount,
  setCustomerCount,
  setWaiterId,
  setCoasterCall,
  setShiftId,
  setTableId,
  setDeliveryGuyId,
  setClientId,
  setOneTime,
  setOrderTypeId,
  setNotes,
  setUrgent,
  setDiscount,
  resetCoasterCall,
  resetTableId,
  resetClientId,
} = orderSlice.actions;

export default orderSlice.reducer;

export const selectOrder = (state: RootState) => state.createOrder.data;
export const selectOrderStatus = (state: RootState) => state.createOrder.status;
export const selectOrderError = (state: RootState) => state.createOrder.error;
export const selectOrderLines = (state: RootState) =>
  state.createOrder.data.orderlines;
export const selectTotalAmount = (state: RootState) => {
  return calculateTotalAmount(state.createOrder.data.orderlines);
};
