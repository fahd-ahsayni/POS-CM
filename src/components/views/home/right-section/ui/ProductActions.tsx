import { TrashRegularIcon } from "@/assets/figma-icons";
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
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
  item: any;
}

export default function ProductActions({ item }: ProductActionsProps) {
  const dispatch = useDispatch();
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const { customerIndex } = useRightViewContext();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDiscountDrawerOpen, setIsDiscountDrawerOpen] = useState(false);

  const handleUrgentToggle = (enabled: boolean) => {
    const currentCustomerIndex = item.customer_index || customerIndex;
    dispatch(
      updateOrderLine({
        _id: item._id,
        customer_index: currentCustomerIndex,
        high_priority: enabled,
        suite_commande: enabled ? false : item.suite_commande,
      })
    );

    const updatedProducts = selectedProducts.map((product) => {
      if (
        product._id === item._id &&
        product.customer_index === currentCustomerIndex
      ) {
        return {
          ...product,
          high_priority: enabled,
          suite_commande: enabled ? false : product.suite_commande,
        };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };

  const isUrgentDisabled = item.suite_commande;

  const handleRemoveOrderLine = () => {
    setIsConfirmModalOpen(true);
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
        <MenuButton as="div" className="cursor-pointer">
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

        <DropdownMenu className="z-[9999] -ml-20 p-2 min-w-52">
          {!item.is_ordred && (
            <DropdownItem onClick={handleRemoveOrderLine}>
              Remove Order Line
            </DropdownItem>
          )}

          <DropdownItem onClick={() => setIsDiscountDrawerOpen(true)}>
            Apply Discount
          </DropdownItem>

          {!item.is_ordred && (
            <>
              <DropdownDivider />
              <div
                className="px-3.5 py-2.5 sm:px-3 sm:py-1.5 w-full"
                onClick={() => handleUrgentToggle(!item.high_priority)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">Mark as Urgent</span>
                  <span className="-mr-10">
                    <Switch
                      color="red"
                      checked={item.high_priority || false}
                      onChange={handleUrgentToggle}
                      disabled={isUrgentDisabled}
                    />
                  </span>
                </div>
              </div>
            </>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
