import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographySmall } from "@/components/ui/typography";
import { AppDispatch } from "@/store";
import { setCurrentPage, setPageSize } from "@/store/slices/data/orders.slice";
import { useDispatch, useSelector } from "react-redux";

export default function SelectNumberOfOrderPerPage({
  itemsLength,
}: {
  itemsLength: number;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const pageSize = useSelector((state: any) => state.orders.pageSize);
  const currentPage = useSelector((state: any) => state.orders.currentPage);
  const totalEntries = itemsLength;

  const startEntry = currentPage * pageSize + 1;
  const endEntry = Math.min((currentPage + 1) * pageSize, totalEntries);

  const handlePageSizeChange = (value: string) => {
    dispatch(setPageSize(Number(value)));
    dispatch(setCurrentPage(0)); // Reset to first page when page size changes
  };

  return (
    <>
      <Select
        defaultValue={pageSize.toString()}
        onValueChange={handlePageSizeChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select number of orders per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
          <SelectItem value="200">200</SelectItem>
        </SelectContent>
      </Select>
      <TypographySmall className="text-xs">
        Showing {startEntry} to {endEntry} of {totalEntries} Entries
      </TypographySmall>
    </>
  );
}
