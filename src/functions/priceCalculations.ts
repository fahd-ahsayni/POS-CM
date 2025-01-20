import { ProductSelected } from "@/types/product.types";

interface PriceCalculation {
  basePrice: number;
  supplementsTotal: number;
  unitPrice: number;
  totalPrice: number;
}

export const calculateProductPrice = (
  item: ProductSelected,
  currentMenu: string | null,
  quantity: number
): PriceCalculation => {
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const menuId = orderType.menu_id || currentMenu;

  // Calculate base price for combo or regular product
  let basePrice = 0;
  if (item.is_combo || (item.variants?.[0]?.is_menu && item.combo_items)) {
    const comboVariant = item.variants?.[0];
    if (comboVariant) {
      // Get menu-specific price or fallback to default
      basePrice =
        comboVariant.menus?.find((menu) => menu.menu_id === menuId)
          ?.price_ttc ||
        comboVariant.default_price ||
        comboVariant.price_ttc ||
        0;
    }

    // Calculate supplements total
    const supplementsTotal =
      item.combo_items?.supplements?.reduce(
        (total, supp) =>
          total +
          (supp.price || supp.default_price || 0) * (supp.quantity || 1),
        0
      ) || 0;

    basePrice += supplementsTotal;
  } else {
    const variant = item.variants?.[0];
    if (variant) {
      basePrice =
        variant.menus?.find((menu) => menu.menu_id === menuId)?.price_ttc ||
        variant.default_price ||
        variant.price_ttc ||
        0;
    }
  }

  const unitPrice = basePrice;
  const totalPrice = unitPrice * quantity;

  return {
    basePrice,
    supplementsTotal: item.combo_items?.supplements
      ? basePrice - (item.variants?.[0]?.price_ttc || 0)
      : 0,
    unitPrice,
    totalPrice,
  };
};

export const calculateTotalFromOrderlines = (
  orderlines: any[],
  deliveryGuyId: string
) => {
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const deliveryTax =
    orderType.delivery_product_variant_id && deliveryGuyId
      ? orderType.delivery_product_variant_id.default_price
      : 0;
  return (
    orderlines.reduce((total, line) => {
      const linePrice = (line.price || 0) * (line.quantity || 1);
      return total + linePrice;
    }, 0) + deliveryTax
  );
};
