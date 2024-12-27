import { TypographyH2 } from "@/components/ui/typography";
import FiltreOrders from "@/components/views/orders/components/FiltreOrders";
import { FilterCriteria } from "@/types";
import { RefreshCwIcon } from "lucide-react";

interface HeaderProps {
  handleRefreshOrders: () => void;
  title: string;
  withFilter?: boolean;
  onFilterChange?: (filters: FilterCriteria) => void;
}

function Header({
  handleRefreshOrders,
  title,
  withFilter = false,
  onFilterChange,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <TypographyH2>{title}</TypographyH2>
        <button onClick={handleRefreshOrders}>
          <RefreshCwIcon className="w-4 h-4 rotate-[66deg] text-secondary-black dark:text-secondary-white" />
        </button>
      </div>
      {withFilter && onFilterChange && <FiltreOrders onFilterChange={onFilterChange} />}
    </div>
  );
}

export default Header;
