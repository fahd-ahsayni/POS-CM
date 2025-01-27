import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { ORDER_SUMMARY_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { useHoldOrders } from "@/store/hooks/useHoldOrders";
import { setOrderData } from "@/store/slices/order/create-order.slice";
import { Product, ProductVariant } from "@/interfaces/product";
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

        const selectedProducts = order.orderline_ids
          .map((line: any) => {
            // Handle both string and object variant IDs
            const variantId =
              typeof line.product_variant_id === "object"
                ? line.product_variant_id._id
                : line.product_variant_id;

            // Find the product and variant from generalData
            const product = products.find((p: Product) =>
              p.variants.some((v: ProductVariant) => v._id === variantId)
            );

            const variant = product?.variants.find(
              (v: ProductVariant) => v._id === variantId
            );

            if (!product || !variant) {
              console.warn("Product or variant not found:", line);
              return null;
            }

            // Rest of the mapping remains the same
            const comboProducts =
              line.combo_prod_ids?.map((combo: any) => {
                const comboId =
                  typeof combo.product_variant_id === "object"
                    ? combo.product_variant_id._id
                    : combo.product_variant_id;

                const comboProduct = products.find((p: Product) =>
                  p.variants.some((v: ProductVariant) => v._id === comboId)
                );
                const comboVariant = comboProduct?.variants.find(
                  (v: ProductVariant) => v._id === comboId
                );

                return {
                  _id: combo._id,
                  quantity: combo.quantity || 1,
                  name: comboVariant?.name || "Unknown Product",
                  notes: combo.notes || [],
                  suite_commande: combo.suite_commande || false,
                  order_type_id: combo.order_type_id,
                  price: comboVariant?.default_price || 0,
                  menus: comboVariant?.menus || [],
                  product_variant_id: comboVariant,
                  variants: [
                    {
                      _id: comboVariant?._id,
                      name: comboVariant?.name,
                      default_price: comboVariant?.default_price,
                      menus: comboVariant?.menus,
                      is_menu: comboVariant?.is_menu,
                    },
                  ],
                };
              }) || [];

            return {
              ...product,
              id: line._id,
              name: variant.name,
              variants: [variant],
              product_variant_id: variant._id,
              quantity: line.quantity,
              price: line.price,
              customer_index: line.customer_index,
              order_type_id:
                line.order_type_id?._id || line.order_type_id || null,
              uom_id: variant.uom_id?._id || line.uom_id || "",
              notes: line.notes || [],
              discount: null,
              is_paid: line.is_paid || false,
              is_ordred: line.is_ordred || false,
              suite_commande: line.suite_commande || false,
              high_priority: line.high_priority || false,
              is_combo: comboProducts.length > 0,
              combo_prod_ids: comboProducts,
              combo_supp_ids: [],
              combo_items: {
                variants: comboProducts,
                supplements: [],
              },
            };
          })
          .filter(Boolean);

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
