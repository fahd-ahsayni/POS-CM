import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { ORDER_SUMMARY_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { useHoldOrders } from "@/store/hooks/useHoldOrders";
import { setOrderData } from "@/store/slices/order/create-order.slice";
import { Product, ProductVariant } from "@/types/product.types";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useWaitingOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { holdOrders, removeFromHold } = useHoldOrders();
  const { setViews: setLeftViews, setSelectedProducts } = useLeftViewContext();
  const { setViews: setRightViews } = useRightViewContext();

  const getOrderTypeName = useCallback((order: any) => {
    const orderTypes = JSON.parse(
      localStorage.getItem("generalData") || "{}"
    ).orderTypes;

    const findOrderType = (types: any[]): string => {
      for (const type of types) {
        if (type._id === order.order_type_id._id) {
          return type.name;
        }
        if (type.children?.length) {
          const childType = type.children.find(
            (child: any) => child._id === order.order_type_id._id
          );
          if (childType) {
            return `${type.name} - ${childType.name}`;
          }
        }
      }
      return order.order_type_id.name;
    };

    return findOrderType(orderTypes);
  }, []);

  const handleRowClick = useCallback(
    (order: any) => {
      try {
        const generalData = JSON.parse(
          localStorage.getItem("generalData") || "{}"
        );
        const products = generalData.products || [];

        const selectedProducts = (
          order.orderline_ids ||
          order.orderlines ||
          []
        ).map((line: any) => {
          const product = products.find((p: Product) =>
            p.variants.some(
              (v: ProductVariant) =>
                v._id ===
                (line.product_variant_id?._id || line.product_variant_id)
            )
          );

          const variant = product?.variants.find(
            (v: ProductVariant) =>
              v._id ===
              (line.product_variant_id?._id || line.product_variant_id)
          );

          // Initialize combo_items structure
          const combo_items = {
            variants: [] as any[],
            supplements: [] as any[],
          };

          // Process combo products if this is a menu item
          if (variant?.is_menu) {
            // Handle combo products
            (line.combo_prod_ids || []).forEach((comboProd: any) => {
              const comboProduct = products.find((p: Product) =>
                p.variants.some(
                  (v: ProductVariant) => v._id === comboProd.product_variant_id
                )
              );

              const comboVariant = comboProduct?.variants.find(
                (v: ProductVariant) => v._id === comboProd.product_variant_id
              );

              if (comboVariant) {
                combo_items.variants.push({
                  ...comboVariant,
                  name: comboProduct?.name || comboVariant.name,
                  quantity: comboProd.quantity || 1,
                  notes: comboProd.notes || [],
                  stepIndex: comboProd.step_index,
                });
              }
            });

            // Handle supplements
            (line.combo_supp_ids || []).forEach((supp: any) => {
              const suppProduct = products.find((p: Product) =>
                p.variants.some(
                  (v: ProductVariant) => v._id === supp.product_variant_id
                )
              );

              const suppVariant = suppProduct?.variants.find(
                (v: ProductVariant) => v._id === supp.product_variant_id
              );

              if (suppVariant) {
                combo_items.supplements.push({
                  ...suppVariant,
                  name: suppProduct?.name || suppVariant.name,
                  quantity: supp.quantity || 1,
                  notes: supp.notes || [],
                  stepIndex: supp.step_index,
                  menus: suppVariant.menus,
                });
              }
            });
          }

          return {
            ...line,
            name: product?.name || "Unknown Product",
            variants: variant ? [variant] : [],
            quantity: line.quantity || 1,
            price: line.price || 0,
            customer_index: line.customer_index || 1,
            product_variant_id:
              line.product_variant_id?._id || line.product_variant_id,
            combo_items,
            is_menu: variant?.is_menu || false,
            uom_id:
              typeof line.uom_id === "object" ? line.uom_id._id : line.uom_id,
            order_type_id: order.order_type_id?._id || order.order_type_id,
            notes: line.notes || [],
            _animation: "reverse",
            _id: line._id,
          };
        });

        // Create clean order for Redux
        const cleanOrder: OrderState = {
          waiter_id: order.waiter_id || null,
          coaster_call: order.coaster_call || null,
          urgent: order.urgent || false,
          shift_id: order.shift_id || "",
          table_id: order.table_id?._id || order.table_id || null,
          delivery_guy_id: order.delivery_guy_id || null,
          discount: order.discount || null,
          client_id: order.client_id?._id || order.client_id || null,
          customer_count: order.customer_count || 1,
          notes: order.notes || "",
          one_time: order.one_time || false,
          total_amount: order.total_amount || 0,
          changed_price: order.changed_price || null,
          order_type_id:
            order.order_type_id?._id || order.order_type_id || null,
          orderlines: selectedProducts.map((line: any) => ({
            product_variant_id: line.product_variant_id,
            quantity: line.quantity,
            price: line.price,
            customer_index: line.customer_index,
            notes: line.notes || [],
            is_paid: line.is_paid || false,
            is_ordred: line.is_ordred || false,
            suite_commande: line.suite_commande || false,
            high_priority: line.high_priority || false,
            discount: line.discount || null,
            uom_id:
              typeof line.uom_id === "object" ? line.uom_id._id : line.uom_id,
            order_type_id: line.order_type_id,
          })),
        };

        dispatch(setOrderData(cleanOrder));
        setSelectedProducts(selectedProducts);
        setLeftViews(ALL_CATEGORIES_VIEW);
        setRightViews(ORDER_SUMMARY_VIEW);
        removeFromHold(order._id);
        navigate("/");
      } catch (error) {
        console.error("Error loading held order:", error);
      }
    },
    [
      dispatch,
      navigate,
      removeFromHold,
      setLeftViews,
      setRightViews,
      setSelectedProducts,
    ]
  );

  return {
    holdOrders,
    getOrderTypeName,
    handleRowClick,
  };
};
