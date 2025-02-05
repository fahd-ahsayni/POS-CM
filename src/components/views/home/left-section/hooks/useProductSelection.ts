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

  // const updateExistingProduct = useCallback(
  //   (
  //     prevProducts: ProductSelected[],
  //     product: Product, // Add product parameter
  //     variantId: string,
  //     price?: number,
  //     notes?: string[]
  //   ): ProductSelected[] => {
  //     // Find existing product with same variant ID, customer index AND same notes
  //     const existingProduct = prevProducts.find(p =>
  //       p.product_variant_id === variantId &&
  //       p.customer_index === customerIndex &&
  //       JSON.stringify(p.notes) === JSON.stringify(notes)
  //     );

  //     if (existingProduct) {
  //       // Update existing product if notes match
  //       return prevProducts.map((p) =>
  //         p === existingProduct
  //           ? {
  //             ...p,
  //             quantity: p.quantity + 1,
  //             price: price ? p.price + price : p.price,
  //             order_type_id: orderType || "",
  //           }
  //           : p
  //       );
  //     } else {
  //       // Create new product entry if notes don't match
  //       const variant = findVariant(product, variantId);
  //       if (!variant) return prevProducts;

  //       const newProduct = createNewProduct(product, variant, price);
  //       newProduct.notes = notes || [];

  //       return [...prevProducts, newProduct];
  //     }
  //   },
  //   [customerIndex, orderType, findVariant, createNewProduct]
  // );

  const updateProductNotes = useCallback(
    (productId: string, notes: string[], customerIndex: number) => {
      setSelectedProducts((prevSelected) =>
        prevSelected.map((p) =>
          p._id === productId && p.customer_index === customerIndex
            ? {
                ...p,
                notes,
              }
            : p
        )
      );
    },
    []
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
          if (!variant) {
            toast.warning(
              createToast(
                "Variant not found",
                "Choose another variant",
                "warning"
              )
            );
            return prevSelected;
          }

          // If the product is ordered, always create a new entry
          const isOrdered = variant.is_ordred || false;

          // If notes are provided or product is ordered, always add a new product
          if ((notes || []).length > 0 || isOrdered) {
            const newProduct = createNewProduct(product, variant, price);
            newProduct.notes = notes || [];
            newProduct.is_ordred = isOrdered;
            const newProducts = [...prevSelected, newProduct];

            updateCustomerCount(newProducts);
            updateProductsAndDisplay(newProducts);
            return newProducts;
          }

          // Regular product handling...
          const existingProduct = prevSelected.find(
            (p) =>
              p.product_variant_id === variantId &&
              p.customer_index === customerIndex &&
              (!p.notes || p.notes.length === 0) &&
              !p.is_ordred // Don't update if it's ordered
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
            // Add new product
            const newProduct = createNewProduct(product, variant, price);
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
