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
  // Get the current menu from localStorage to ensure we're using the latest menu
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const menuId = orderType.menu_id || currentMenu;

  // Calculate base price for combo or regular product
  let basePrice = 0;
  if (item.is_combo) {
    const comboVariant = item.variants?.[0];
    if (comboVariant) {
      // Get menu-specific price or fallback to default
      basePrice =
        comboVariant.menus?.find((menu) => menu.menu_id === menuId)
          ?.price_ttc ||
        comboVariant.default_price ||
        comboVariant.price_ttc ||
        0;

      // If the variant itself is a combo, add its supplements
      if (
        comboVariant.is_menu &&
        comboVariant.supplements &&
        comboVariant.supplements.length > 0
      ) {
        const variantSupplementsTotal = comboVariant.supplements.reduce(
          (total, supp) => {
            const suppPrice =
              supp.menus?.find((menu) => menu.menu_id === menuId)?.price_ttc ||
              supp.default_price ||
              supp.price_ttc ||
              0;

            return total + suppPrice * (supp.quantity || 1);
          },
          0
        );

        basePrice += variantSupplementsTotal;
      }
    }
  } else {
    const variant = item.variants?.[0];
    if (variant) {
      // Get menu-specific price or fallback to default
      basePrice =
        variant.menus?.find((menu) => menu.menu_id === menuId)?.price_ttc ||
        variant.default_price ||
        variant.price_ttc ||
        0;

      // If the variant is a combo, add its supplements
      if (
        variant.is_menu &&
        variant.supplements &&
        variant.supplements.length > 0
      ) {
        const variantSupplementsTotal = variant.supplements.reduce(
          (total, supp) => {
            const suppPrice =
              supp.menus?.find((menu: any) => menu.menu_id === menuId)
                ?.price_ttc ||
              supp.default_price ||
              supp.price_ttc ||
              0;

            return total + suppPrice * (supp.quantity || 1);
          },
          0
        );

        basePrice += variantSupplementsTotal;
      }
    }
  }

  // Calculate supplements total for combo products
  const supplementsTotal =
    item.is_combo && item.combo_items?.supplements
      ? item.combo_items.supplements.reduce((total, supp) => {
          // Get menu-specific supplement price or fallback to default
          const suppPrice =
            supp.menus?.find((menu: any) => menu.menu_id === menuId)
              ?.price_ttc ||
            supp.default_price ||
            supp.price_ttc ||
            0;

          return total + suppPrice * (supp.quantity || 1);
        }, 0)
      : 0;

  const unitPrice = basePrice + supplementsTotal;
  const totalPrice = unitPrice * quantity;

  return {
    basePrice,
    supplementsTotal,
    unitPrice,
    totalPrice,
  };
};
