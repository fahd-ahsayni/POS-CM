import { memo } from "react";
import SelectNumberOfOrderPerPage from "@/components/views/orders/components/SelectNumberOfOrderPerPage";
import { TablePagination } from "@/components/views/orders/components/TablePagination";

const Footer = memo(function Footer({ ordersLength }: { ordersLength: number }) {
  return (
    <div className="flex h-14 w-full items-center justify-between bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SelectNumberOfOrderPerPage itemsLength={ordersLength} />
      </div>
      <div>
        <TablePagination />
      </div>
    </div>
  );
});

export default Footer;
