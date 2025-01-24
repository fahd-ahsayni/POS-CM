import { TypographyH2 } from "@/components/ui/typography";
import FilterOrders from "@/components/views/orders/components/FilterOrders";
import { refreshOrders } from "@/store/slices/data/orders.slice";
import { FilterCriteria } from "@/types/general";
import { RefreshCwIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  handleRefreshOrders?: () => void;
  title: string;
  withFilter?: boolean;
  onFilterChange?: (filters: FilterCriteria) => void;
  totalItems?: number;
}

function Header({
  handleRefreshOrders,
  title,
  withFilter = false,
  onFilterChange,
  totalItems = 0,
}: HeaderProps) {
  const filteredDataLength = useSelector(
    (state: any) => state.orders.filteredDataLength
  );
  const ordersStatus = useSelector((state: any) => state.orders.status);
  const dispatch = useDispatch();

  const handleRefresh = async () => {
    if (ordersStatus !== "loading") {
      await dispatch(refreshOrders() as any);
      handleRefreshOrders?.();
    }
  };

  return (
    <div className="flex items-center justify-between pr-3">
      <div className="flex items-center gap-x-4">
        <TypographyH2>{title}</TypographyH2>
        <button
          onClick={handleRefresh}
          className={`hover:rotate-180 transition-transform duration-300 ${
            ordersStatus === "loading" ? "animate-spin" : ""
          }`}
          disabled={ordersStatus === "loading"}
        >
          <RefreshCwIcon className="w-4 h-4 rotate-[66deg] text-secondary-black dark:text-secondary-white" />
        </button>
      </div>
      {withFilter && onFilterChange && (
        <FilterOrders
          onFilterChange={onFilterChange}
          totalItems={totalItems || filteredDataLength}
        />
      )}
    </div>
  );
}

export default Header;
