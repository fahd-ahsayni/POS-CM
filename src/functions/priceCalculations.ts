import { ProductSelected } from "@/interfaces/product";

interface PriceCalculation {
  basePrice: number;
  supplementsTotal: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Calculates the price for a single product, considering its variants, supplements and quantity
 */
export const calculateProductPrice = (
  item: ProductSelected,
  currentMenu: string | null | undefined,
  quantity: number
): PriceCalculation => {
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const menuId = orderType.menu_id || currentMenu;

  // Get effective quantity (adjust for canceled items if needed)
  const effectiveQuantity = item.is_ordred && item.cancelled_qty ? 
    Math.max(quantity - (item.cancelled_qty || 0), 0) : 
    quantity;
  
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
  let totalPrice = unitPrice * effectiveQuantity;

  // Apply discount if exists
  if (item.discount?.discount_id) {
    const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
    const discountDetails = generalData.discount?.find(
      (d: any) => d._id === item.discount?.discount_id
    );

    if (discountDetails) {
      if (discountDetails.type === "percentage") {
        const discountAmount = totalPrice * (discountDetails.value / 100);
        totalPrice = Number((totalPrice - discountAmount).toFixed(2));
      } else if (discountDetails.type === "fixed") {
        totalPrice = Number(Math.max(totalPrice - discountDetails.value, 0).toFixed(2));
      }
    }
  }

  return {
    basePrice,
    supplementsTotal: item.combo_items?.supplements
      ? basePrice - (item.variants?.[0]?.price_ttc || 0)
      : 0,
    unitPrice,
    totalPrice,
  };
};

/**
 * Calculates the total from orderlines, properly handling canceled quantities
 */
export const calculateTotalFromOrderlines = (
  orderlines: any[],
  deliveryGuyId: string,
  discount: any
) => {
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");

  // Calculate subtotal from orderlines, accounting for canceled items
  const subtotal = orderlines.reduce((total, line) => {
    // Skip fully canceled lines
    if (line.cancelled_qty >= line.quantity) {
      return total;
    }
    
    // Calculate effective quantity and price
    const effectiveQuantity = line.quantity - (line.cancelled_qty || 0);
    const unitPrice = line.price / line.quantity; // Get unit price
    const lineTotal = unitPrice * effectiveQuantity;
    
    return total + lineTotal;
  }, 0);

  // Add delivery tax
  const deliveryTax =
    orderType.delivery_product_variant_id && deliveryGuyId
      ? orderType.delivery_product_variant_id.default_price
      : 0;

  const total = subtotal + deliveryTax;

  // Find and apply discount using discount_id
  if (discount?.discount_id) {
    const discountDetails = generalData.discount?.find(
      (d: any) => d._id === discount.discount_id
    );

    if (discountDetails) {
      if (discountDetails.type === "percentage") {
        const discountAmount = total * (discountDetails.value / 100);
        return Number((total - discountAmount).toFixed(2));
      } else if (discountDetails.type === "fixed") {
        return Number(Math.max(total - discountDetails.value, 0).toFixed(2));
      }
    }
  }

  return Number(total.toFixed(2));
};

/**
 * Calculates order totals by customer index, properly handling canceled items
 */
export const calculateTotalsByCustomerIndex = (selectedProducts: ProductSelected[], currentMenu: string | null | undefined) => {
  // Group products by customer index
  const customerGroups: Record<number, ProductSelected[]> = {};

   selectedProducts.forEach(product => {
    const customerIndex = product.customer_index || 1;
    if (!customerGroups[customerIndex]) {
      customerGroups[customerIndex] = [];
    }
    customerGroups[customerIndex].push(product);
  });
  
  // Calculate totals for each customer
  const customerTotals: Record<number, { items: number, total: number }> = {};
  
  Object.entries(customerGroups).forEach(([index, products]) => {
    const customerIndex = Number(index);
    let totalItems = 0;
    let totalPrice = 0;
    
    products.forEach(product => {
      // Skip fully canceled products
      if (product.cancelled_qty >= product.quantity) {
        return;
      }
      
      // Count effective items
      const effectiveQuantity = product.cancelled_qty ? 
        Math.max(product.quantity - product.cancelled_qty, 0) : 
        product.quantity;
      
      totalItems += effectiveQuantity;
      
      // Calculate price
      const priceCalc = calculateProductPrice(product, currentMenu, product.quantity);
      totalPrice += priceCalc.totalPrice;
    });
    
    customerTotals[customerIndex] = { items: totalItems, total: totalPrice };
  });
  
  return customerTotals;
};

/**
 * Calculates the total of all valid products (not fully canceled)
 */
export const calculateOrderTotal = (selectedProducts: ProductSelected[], currentMenu: string | null | undefined) => {
  let subtotal = 0;
  let totalItems = 0;
  
  selectedProducts.forEach(product => {
    // Skip fully canceled products
    if (product.cancelled_qty >= product.quantity) {
      return;
    }
    
    // Count effective items
    const effectiveQuantity = product.cancelled_qty ? 
      Math.max(product.quantity - product.cancelled_qty, 0) : 
      product.quantity;
    
    totalItems += effectiveQuantity;
    
    // Calculate price
    const priceCalc = calculateProductPrice(product, currentMenu, product.quantity);
    subtotal += priceCalc.totalPrice;
  });
  
  return { subtotal, totalItems };
};
