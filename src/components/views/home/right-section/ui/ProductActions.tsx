import { TrashRegularIcon } from "@/assets/figma-icons";
import { Dropdown, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from "@/components/catalyst/dropdown";
import ApplyProductDiscount from "@/components/global/drawers/apply-product-discount/ApplyProductDiscount";
import BaseModal from "@/components/global/modal/Layout/BaseModal";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { updateOrderLine } from "@/store/slices/order/create-order.slice";
import { MenuButton } from "@headlessui/react";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";

interface ProductActionsProps {
  item: any; // Add proper typing based on your item structure
}

export default function ProductActions({ item }: ProductActionsProps) {
  const dispatch = useDispatch();
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const { customerIndex } = useRightViewContext();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDiscountDrawerOpen, setIsDiscountDrawerOpen] = useState(false);

  const handleUrgentToggle = (enabled: boolean) => {
    const currentCustomerIndex = item.customer_index || customerIndex;

    // If enabling high_priority, ensure suite_commande is false
    dispatch(
      updateOrderLine({
        _id: item._id,
        customer_index: currentCustomerIndex,
        high_priority: enabled,
        suite_commande: enabled ? false : item.suite_commande,
      })
    );

    // Update selected products in LeftViewContext
    const updatedProducts = selectedProducts.map((product) => {
      if (
        product._id === item._id &&
        product.customer_index === currentCustomerIndex
      ) {
        return {
          ...product,
          high_priority: enabled,
          suite_commande: enabled ? false : product.suite_commande, // Force suite_commande to false if high_priority is true
        };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };

  // Disable the urgent toggle if suite_commande is true
  const isUrgentDisabled = item.suite_commande;

  const handleRemoveOrderLine = () => {
    setIsConfirmModalOpen(true); // Open confirmation modal instead of direct removal
  };

  const confirmRemove = () => {
    setSelectedProducts(
      selectedProducts.filter(
        (product) =>
          !(
            product._id === item._id &&
            product.customer_index === item.customer_index
          )
      )
    );
    setIsConfirmModalOpen(false);
  };

  return (
    <>
      <BaseModal
        isOpen={isConfirmModalOpen}
        closeModal={() => setIsConfirmModalOpen(false)}
        title="Remove Order Line"
        description="Are you sure you want to remove this order line?"
        onConfirm={confirmRemove}
        onCancel={() => setIsConfirmModalOpen(false)}
        icon={<TrashRegularIcon className="h-7 w-7 text-error-color" />}
        confirmText="Yes, Remove order line"
        cancelText="Cancel"
      />

      <ApplyProductDiscount
        open={isDiscountDrawerOpen}
        setOpen={setIsDiscountDrawerOpen}
        orderLine={item}
      />

      <Dropdown>
        <MenuButton>
          <span
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors",
              "bg-accent-white/10 hover:bg-accent-white/20",
              "h-7 w-7"
            )}
          >
            <BsThreeDotsVertical className="text-primary-black dark:text-white" />
          </span>
        </MenuButton>

        <DropdownMenu className="z-[9999] -ml-20 p-3">
          <DropdownItem
            onClick={handleRemoveOrderLine}
          >
            Remove Order Line
          </DropdownItem>

          <DropdownItem
            onClick={() => setIsDiscountDrawerOpen(true)}
          >
            Apply Discount
          </DropdownItem>

          <DropdownDivider />

          <DropdownItem>
            <div className="flex items-center justify-between w-full">
              <DropdownLabel>Mark as Urgent</DropdownLabel>
              <Switch
                color="red"
                checked={item.high_priority || false}
                onChange={handleUrgentToggle}
                disabled={isUrgentDisabled}
                className="-mr-8"
              />
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
