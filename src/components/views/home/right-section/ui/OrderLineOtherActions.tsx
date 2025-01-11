import { TrashRegularIcon } from "@/assets/figma-icons";
import ApplyProductDiscount from "@/components/global/drawers/apply-product-discount/ApplyProductDiscount";
import BaseModal from "@/components/global/modal/Layout/BaseModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { updateOrderLine } from "@/store/slices/order/createOrder";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";

interface OrderLineOtherActionsProps {
  item: any; // Add proper typing based on your item structure
}

export default function OrderLineOtherActions({
  item,
}: OrderLineOtherActionsProps) {
  const dispatch = useDispatch();
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const { customerIndex } = useRightViewContext();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDiscountDrawerOpen, setIsDiscountDrawerOpen] = useState(false);

  const handleUrgentToggle = (enabled: boolean) => {
    const currentCustomerIndex = item.customer_index || customerIndex;

    // If enabling high_priority, ensure suite_commande is false
    const updatedOrderLine = {
      ...item,
      high_priority: enabled,
      suite_commande: enabled ? false : item.suite_commande, // Force suite_commande to false if high_priority is true
      customer_index: currentCustomerIndex,
    };

    // Update Redux store
    dispatch(
      updateOrderLine({
        _id: item._id,
        customerIndex: currentCustomerIndex,
        orderLine: updatedOrderLine,
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20"
            aria-label="Open edit menu"
          >
            <BsThreeDotsVertical className="text-primary-black dark:text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 -ml-36 min-w-52">
          <DropdownMenuItem onClick={handleRemoveOrderLine}>
            <span className="text-sm">Remove Order Line</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDiscountDrawerOpen(true)}>
            <span className="text-sm">Apply Discount</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className="text-sm flex items-center w-full justify-between space-x-4">
              <span>Mark as Urgent</span>
              <Switch
                color="red"
                checked={item.high_priority || false}
                onChange={handleUrgentToggle}
                disabled={isUrgentDisabled} // Add disabled prop to SwitchToggle
              />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
