import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../index";
import { ProductSelected } from "@/interfaces/product";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


interface PriceResult {
  basePrice: number;
  supplementsTotal: number;
  unitPrice: number;
  totalPrice: number;
}

export const calculateVariantPrice = (
  variant: any,
  menuId: string | null
): number => {
  return (
    variant.menus?.find((menu: any) => menu.menu_id === menuId)?.price_ttc ||
    variant.default_price ||
    variant.price_ttc ||
    0
  );
};

export const calculateSupplementPrice = (
  supplement: any,
  menuId: string | null
): number => {
  const suppPrice =
    supplement.menus?.find((menu: any) => menu.menu_id === menuId)?.price_ttc ||
    supplement.price ||
    supplement.default_price ||
    0;
  return suppPrice * (supplement.quantity || 1);
};

export const calculateComboPrice = (
  item: ProductSelected,
  menuId: string | null,
  quantity: number
): PriceResult => {
  // Calculate base price from main variant
  const comboVariant = item.variants?.[0];
  let basePrice = comboVariant
    ? calculateVariantPrice(comboVariant, menuId)
    : 0;

  // Calculate supplements total
  const supplementsTotal =
    item.combo_items?.supplements?.reduce(
      (total: any, supp: any) => total + calculateSupplementPrice(supp, menuId),
      0
    ) || 0;

  const unitPrice = basePrice + supplementsTotal;
  const totalPrice = unitPrice * quantity;

  return {
    basePrice,
    supplementsTotal,
    unitPrice,
    totalPrice,
  };
};

export const calculateRegularPrice = (
  item: ProductSelected,
  menuId: string | null,
  quantity: number
): PriceResult => {
  const variant = item.variants?.[0];
  const basePrice = variant
    ? calculateVariantPrice(variant, menuId)
    : item.price || 0;

  return {
    basePrice,
    supplementsTotal: 0,
    unitPrice: basePrice,
    totalPrice: basePrice * quantity,
  };
};

export const calculateProductPrice = (
  item: ProductSelected,
  currentMenu: string | null,
  quantity: number
): PriceResult => {
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const menuId = orderType.menu_id || currentMenu;

  // Use appropriate calculation based on product type
  const result = item.is_combo
    ? calculateComboPrice(item, menuId, quantity)
    : calculateRegularPrice(item, menuId, quantity);

  return result;
};

export const calculateOrderTotal = (orderlines: ProductSelected[]): number => {
  const currentMenu = localStorage.getItem("currentMenu");

  return orderlines.reduce((total, item) => {
    const { totalPrice } = calculateProductPrice(
      item,
      currentMenu,
      item.quantity
    );
    return total + totalPrice;
  }, 0);
};
