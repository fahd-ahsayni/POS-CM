import { TypographyH2 } from "@/components/ui/typography";
import FilterOrders from "@/components/views/orders/components/FilterOrders";
import { FilterCriteria } from "@/types";
import { RefreshCwIcon } from "lucide-react";
import { useSelector } from "react-redux";

interface HeaderProps {
  handleRefreshOrders: () => void;
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
  const filteredDataLength = useSelector((state: any) => state.orders.filteredDataLength);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <TypographyH2>{title}</TypographyH2>
        <button 
          onClick={handleRefreshOrders}
          className="hover:rotate-180 transition-transform duration-300"
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
