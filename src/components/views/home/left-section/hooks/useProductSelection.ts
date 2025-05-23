import { checkProductAvailability } from "@/api/services";
import { updateCustomerDisplay } from "@/components/global/customer-display/useCustomerDisplay";
import { createToast } from "@/components/global/Toasters";
import { Product, ProductSelected, ProductVariant } from "@/interfaces/product";
import { useAppDispatch } from "@/store/hooks";
import { setCustomerCount } from "@/store/slices/order/create-order.slice";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

interface UseProductSelectionProps {
  selectedProducts: ProductSelected[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>;
  customerIndex: number;
  orderType: string | null;
}

export const useProductSelection = ({
  setSelectedProducts,
  customerIndex,
  orderType,
}: UseProductSelectionProps) => {
  const dispatch = useAppDispatch();

  const findVariant = useCallback(
    (
      product: Product | null,
      variantId: string
    ): ProductVariant | undefined => {
      const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
      if (!product?.variants) return undefined;

      const variant = product.variants.find((v) => v._id === variantId);

      if (variant && orderType?.menu_id) {
        const menuPrice = variant.menus?.find(
          (menu) => menu.menu_id === orderType.menu_id
        )?.price_ttc;
        return {
          ...variant,
          price_ttc: menuPrice || variant.default_price || variant.price_ttc,
        };
      }
      return variant;
    },
    []
  );

  const createNewProduct = useCallback(
    (
      product: any,
      variant: ProductVariant,
      price?: number
    ): ProductSelected => {
      const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
      const menuPrice = variant.menus?.find(
        (menu) => menu.menu_id === orderType.menu_id
      )?.price_ttc;

      const unitPrice =
        menuPrice || variant.default_price || price || variant.price_ttc;

      return {
        ...product,
        id: uuidv4(),
        variants: [variant],
        product_variant_id: variant._id,
        quantity: 1,
        price: unitPrice,
        customer_index: customerIndex,
        order_type_id: orderType || "",
        uom_id: variant.uom_id ? variant.uom_id._id : "",
        notes: [],
        discount: null,
        is_paid: false,
        is_ordred: false,
        suite_commande: false,
        high_priority: false,
      };
    },
    [customerIndex, orderType]
  );

  const updateProductNotes = useCallback(
    (productId: string, notes: string[], customerIndex: number) => {
      setSelectedProducts((prevSelected) =>
        prevSelected.map((p) =>
          // Match by exact ID (either id or _id) and customer index
          (p.id === productId || p._id === productId) && p.customer_index === customerIndex
            ? {
                ...p,
                notes,
              }
            : p
        )
      );
    },
    [setSelectedProducts]
  );

  const updateProductsAndDisplay = useCallback(
    (newProducts: ProductSelected[]) => {
      setSelectedProducts(newProducts);
      updateCustomerDisplay(newProducts);
    },
    [setSelectedProducts]
  );

  const updateCustomerCount = useCallback(
    (products: ProductSelected[]) => {
      if (products.length === 0) {
        dispatch(setCustomerCount(1));
        return;
      }

      const maxCustomerIndex = Math.max(
        ...products.map((product) => product.customer_index)
      );
      dispatch(setCustomerCount(maxCustomerIndex));
    },
    [dispatch]
  );

  const addOrUpdateProduct = useCallback(
    async (
      product: Product,
      variantId: string,
      price?: number,
      notes?: string[]
    ) => {
      try {
        // Check availability before adding
        const response = await checkProductAvailability(variantId);

        if (response?.status !== 200 || !response?.data?.availability) {
          toast.error(
            createToast(
              "Product Unavailable",
              "This product is currently not available",
              "error"
            )
          );
          return;
        }

        setSelectedProducts((prevSelected) => {
          const variant = findVariant(product, variantId);
          if (!variant) return prevSelected;

          // For combo products, check if already exists for current customer
          if (variant.is_menu) {
            const comboExistsForCustomer = prevSelected.some(
              (p) => 
                p.product_variant_id === variant._id && 
                p.customer_index === customerIndex
            );
            if (comboExistsForCustomer) {
              return prevSelected;
            }
          }

          // If the product is ordered or notes are provided, always create a new entry
          const isOrdered = variant.is_ordred || false;
          const hasNotes = notes && notes.length > 0;

          // Always create a new unique product instance in these cases
          if (hasNotes || isOrdered) {
            const newProduct = createNewProduct(product, variant, price);
            newProduct.id = uuidv4(); // Ensure a unique ID for each product instance
            newProduct._id = newProduct.id; // Set _id for consistency
            newProduct.notes = notes || [];
            newProduct.is_ordred = isOrdered;
            const newProducts = [...prevSelected, newProduct];

            updateCustomerCount(newProducts);
            updateProductsAndDisplay(newProducts);
            return newProducts;
          }

          // Regular product handling for items without notes
          const existingProduct = prevSelected.find(
            (p) =>
              p.product_variant_id === variantId &&
              p.customer_index === customerIndex &&
              (!p.notes || p.notes.length === 0) &&
              !p.is_ordred
          );

          if (existingProduct) {
            // Update existing product
            const updatedProducts = prevSelected.map((p) =>
              p === existingProduct
                ? {
                    ...p,
                    quantity: p.quantity + 1,
                    price: price ? p.price + price : p.price,
                    order_type_id: orderType || "",
                  }
                : p
            );

            updateCustomerCount(updatedProducts);
            updateProductsAndDisplay(updatedProducts);
            return updatedProducts;
          } else {
            // Add new product with unique ID
            const newProduct = createNewProduct(product, variant, price);
            newProduct.id = uuidv4();
            newProduct._id = newProduct.id;
            const newProducts = [...prevSelected, newProduct];

            updateCustomerCount(newProducts);
            updateProductsAndDisplay(newProducts);
            return newProducts;
          }
        });
      } catch (error) {
        toast.error(
          createToast(
            "Availability Check Failed",
            "Unable to verify product availability. Please try again later.",
            "error"
          )
        );
      }
    },
    [
      findVariant,
      createNewProduct,
      updateCustomerCount,
      updateProductsAndDisplay,
      customerIndex,
      orderType,
    ]
  );

  return {
    addOrUpdateProduct,
    updateProductNotes: (
      productId: string,
      notes: string[],
      customerIndex: number
    ) => updateProductNotes(productId, notes, customerIndex),
  };
};
