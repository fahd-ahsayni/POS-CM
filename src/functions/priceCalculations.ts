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
  // Early return if no menu selected
  if (!currentMenu) {
    const basePrice = item.variants?.[0]?.default_price || 0;
    return {
      basePrice,
      supplementsTotal: 0,
      unitPrice: basePrice,
      totalPrice: basePrice * quantity
    };
  }

  // Calculate base price
  const basePrice = item.variants?.[0]?.menus?.find(
    menu => menu.menu_id === currentMenu
  )?.price_ttc || item.variants?.[0]?.default_price || 0;

  // Calculate supplements if it's a combo
  const supplementsTotal = item.is_combo 
    ? item.combo_items?.supplements?.reduce((total, supp) => {
        const suppPrice = supp.menus?.find(
          (menu: any) => menu.menu_id === currentMenu
        )?.price_ttc || supp.default_price || 0;
        return total + (suppPrice * supp.quantity);
      }, 0) || 0
    : 0;

  const unitPrice = basePrice + supplementsTotal;
  const totalPrice = unitPrice * quantity;

  return {
    basePrice,
    supplementsTotal,
    unitPrice,
    totalPrice
  };
};