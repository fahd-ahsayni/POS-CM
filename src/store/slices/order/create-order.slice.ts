import { calculateTotalFromOrderlines } from "@/functions/priceCalculations";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../..";

interface OrderState {
  _id?: string;
  waiter_id: string | null;
  coaster_call: string | null;
  urgent: boolean;
  shift_id: string;
  table_id: string | null;
  delivery_guy_id: string | null;
  discount: any | null;
  client_id: string | null;
  customer_count: number;
  notes: string;
  one_time: boolean;
  total_amount: number;
  changed_price: number | null;
  changed_price_reason?: string;
  changed_price_confirmed_by?: string;
  order_type_id: string | null;
  orderlines: any[];
}

const initialOrderState: OrderState = {
  waiter_id: null,
  coaster_call: null,
  urgent: false,
  shift_id: localStorage.getItem("shiftId") || "",
  table_id: null,
  delivery_guy_id: null,
  discount: null,
  client_id: null,
  customer_count: 0,
  notes: "",
  one_time: false,
  total_amount: 0,
  changed_price: null,
  order_type_id: null,
  orderlines: [],
};

const initialState: OrderSliceState = {
  data: initialOrderState,
  status: "idle",
  error: null,
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
      state.data.total_amount = calculateTotalFromOrderlines(
        state.data.orderlines,
        state.data.delivery_guy_id || "",
        state.data.discount?.id || ""
      );
    },
    resetOrder: (state) => {
      const currentShiftId = state.data.shift_id;
      state.data = {
        ...initialOrderState,
        shift_id: currentShiftId,
      };
      state.data.total_amount = calculateTotalFromOrderlines(
        state.data.orderlines,
        state.data.delivery_guy_id || "",
        state.data.discount?.id || ""
      );
    },
    updateSuiteCommande: (
      state,
      action: PayloadAction<{
        product_variant_id: string;
        suite_commande: boolean;
      }>
    ) => {
      state.data.orderlines = state.data.orderlines.map((orderline) => {
        // Handle regular products
        if (
          orderline.product_variant_id === action.payload.product_variant_id
        ) {
          return {
            ...orderline,
            suite_commande: action.payload.suite_commande,
          };
        }

        // Handle combo products
        if (orderline.is_combo && orderline.combo_items) {
          // Update suite_commande in variants
          const updatedVariants = orderline.combo_items.variants.map(
            (variant: any) =>
              variant._id === action.payload.product_variant_id
                ? { ...variant, suite_commande: action.payload.suite_commande }
                : variant
          );

          // Update suite_commande in supplements
          const updatedSupplements = orderline.combo_items.supplements.map(
            (supplement: any) =>
              supplement._id === action.payload.product_variant_id
                ? {
                    ...supplement,
                    suite_commande: action.payload.suite_commande,
                  }
                : supplement
          );

          return {
            ...orderline,
            combo_items: {
              ...orderline.combo_items,
              variants: updatedVariants,
              supplements: updatedSupplements,
            },
          };
        }

        return orderline;
      });
    },
    updateOrderLine: (
      state,
      action: PayloadAction<{
        _id?: string;
        customer_index: number;
        product_variant_id?: string;
        quantity?: number;
        price?: number;
        notes?: string[];
        discount?: OrderLineDiscount;
        high_priority?: boolean;
        suite_commande?: boolean;
        combo_prod_ids?: Array<{
          product_variant_id: string;
          quantity: number;
          notes: string[];
        }>;
        combo_supp_ids?: Array<{
          product_variant_id: string;
          quantity: number;
          notes: string[];
          suite_commande: boolean;
        }>;
      }>
    ) => {
      const { _id, customer_index, product_variant_id, ...updateData } =
        action.payload;

      // Find the exact order line - give priority to the exact ID match
      const orderLineIndex = state.data.orderlines.findIndex((ol) => {
        if (_id && (ol._id === _id || ol.id === _id)) {
          return ol.customer_index === customer_index;
        }
        
        // Fall back to product_variant_id only if no _id was provided
        if (!_id && product_variant_id && ol.product_variant_id === product_variant_id) {
          return ol.customer_index === customer_index;
        }
        
        return false;
      });

      if (orderLineIndex !== -1) {
        if (updateData.quantity !== undefined && updateData.quantity <= 0) {
          // Remove the order line if quantity is 0
          state.data.orderlines.splice(orderLineIndex, 1);
        } else {
          // Update only the specified fields while preserving combo-specific data
          const currentOrderLine = state.data.orderlines[orderLineIndex];
          state.data.orderlines[orderLineIndex] = {
            ...currentOrderLine,
            ...updateData,
            // Preserve combo-specific IDs and items
            id: currentOrderLine.id,
            _id: currentOrderLine._id || currentOrderLine.id, // Ensure _id is set
            combo_prod_ids: currentOrderLine.combo_prod_ids,
            combo_supp_ids: currentOrderLine.combo_supp_ids,
          };
        }
      }

      state.data.total_amount = calculateTotalFromOrderlines(
        state.data.orderlines,
        state.data.delivery_guy_id || "",
        state.data.discount?.id || ""
      );
    },
    addOrderLine: (state, action: PayloadAction<any[]>) => {
      const newOrderLines = action.payload.map((line) => {
        if (line.is_combo && line.combo_items) {
          const uniqueId = `combo_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          return {
            ...line,
            id: uniqueId,
            _id: line._id || uniqueId, // Ensure _id is set
            combo_prod_ids: line.combo_items.variants.map((v: any) => ({
              ...v,
              combo_id: uniqueId,
            })),
            combo_supp_ids: line.combo_items.supplements.map((s: any) => ({
              ...s,
              combo_id: uniqueId,
            })),
            price: line.price || 0,
            quantity: line.quantity || 1,
          };
        }

        // Ensure every product has both id and _id set
        return {
          ...line,
          _id: line._id || line.id, // Ensure _id is set
          id: line.id || line._id, // Ensure id is set
          price: line.price || line.variants?.[0]?.price || 0,
          quantity: line.quantity || 1,
        };
      });

      state.data.orderlines = newOrderLines;

      // Recalculate customer count based on orderlines
      if (newOrderLines.length > 0) {
        const uniqueCustomerIndices = new Set(
          newOrderLines.map((line) => line.customer_index)
        );
        state.data.customer_count = Math.max(uniqueCustomerIndices.size, 1);
      } else {
        state.data.customer_count = 1; // Reset to 1 if no orderlines
      }

      // Update total amount
      state.data.total_amount = calculateTotalFromOrderlines(
        state.data.orderlines,
        state.data.delivery_guy_id || "",
        state.data.discount?.id || ""
      );
    },
    removeOrderLine: (state, action: PayloadAction<number>) => {
      state.data.orderlines = state.data.orderlines.filter(
        (_: any, index: number) => index !== action.payload
      );
      state.data.total_amount = calculateTotalFromOrderlines(
        state.data.orderlines,
        state.data.delivery_guy_id || "",
        state.data.discount?.id || ""
      );
    },
    updateTotalAmount: (state, action: PayloadAction<number>) => {
      state.data.total_amount = action.payload;
    },
    setCustomerCount: (state, action: PayloadAction<number>) => {
      const uniqueCustomerIndices = new Set(
        state.data.orderlines.map((line) => line.customer_index)
      );
      const calculatedCount = Math.max(
        uniqueCustomerIndices.size,
        action.payload,
        1
      );

      state.data.customer_count = calculatedCount;
    },
    setWaiterId: (state, action: PayloadAction<string | null>) => {
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
      if (typeof action.payload === "string" || action.payload === null) {
        state.data = {
          ...state.data,
          order_type_id: action.payload,
          client_id: null,
          table_id: null,
          coaster_call: null,
        };
      } else {
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

      const newTotal = calculateTotalFromOrderlines(
        state.data.orderlines,
        state.data.delivery_guy_id || "",
        state.data.discount
      );
      state.data.total_amount = newTotal;
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
    setChangedPrice: (
      state,
      action: PayloadAction<{
        price: number;
        reason?: string;
        confirmed_by: string;
      }>
    ) => {
      state.data.changed_price = action.payload.price;
      state.data.changed_price_reason = action.payload.reason;
      state.data.changed_price_confirmed_by = action.payload.confirmed_by;
    },
    resetStaffIds: (state) => {
      state.data.waiter_id = null;
      state.data.delivery_guy_id = null;
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
  updateSuiteCommande,
  setNotes,
  setUrgent,
  setDiscount,
  resetCoasterCall,
  resetTableId,
  resetClientId,
  setChangedPrice,
  resetStaffIds,
} = orderSlice.actions;

export default orderSlice.reducer;

export const selectOrder = (state: RootState) => state.createOrder.data;
export const selectOrderStatus = (state: RootState) => state.createOrder.status;
export const selectOrderError = (state: RootState) => state.createOrder.error;
export const selectOrderLines = (state: RootState) =>
  state.createOrder.data.orderlines;
export const selectTotalAmount = (state: RootState) => {
  return calculateTotalFromOrderlines(
    state.createOrder.data.orderlines,
    state.createOrder.data.delivery_guy_id || "",
    state.createOrder.data.discount?.id || ""
  );
};
