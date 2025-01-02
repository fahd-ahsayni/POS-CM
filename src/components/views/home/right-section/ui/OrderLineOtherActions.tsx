import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SwitchToggle } from "@/components/ui/toggle";
import { updateOrderLine } from "@/store/slices/order/createOrder";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import { useRightViewContext } from "../contexts/rightViewContext";

interface OrderLineOtherActionsProps {
  item: any; // Add proper typing based on your item structure
}

export default function OrderLineOtherActions({
  item,
}: OrderLineOtherActionsProps) {
  const dispatch = useDispatch();
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const { customerIndex } = useRightViewContext();

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

  return (
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
        {/* <DropdownMenuItem>
          <span className="text-sm">Change Order Line Type</span>
        </DropdownMenuItem> */}
        <DropdownMenuItem>
          <span className="text-sm">Apply Discount</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="text-sm flex items-center w-full justify-between space-x-4">
            <span>Mark as Urgent</span>
            <SwitchToggle
              enabled={item.high_priority || false}
              setEnabled={handleUrgentToggle}
              disabled={isUrgentDisabled} // Add disabled prop to SwitchToggle
            />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
