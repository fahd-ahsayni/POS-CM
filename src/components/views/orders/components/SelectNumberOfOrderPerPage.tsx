import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographySmall } from "@/components/ui/typography";
import { useOrdersContext } from "@/components/views/orders/context/orderContext"; // Import the context

export default function SelectNumberOfOrderPerPage({ itemsLength }: { itemsLength: number }) {
  const { pageSize, currentPage, setPageSize } = useOrdersContext();
  const totalEntries = itemsLength; // Assuming `orders` is imported and contains all entries

  const startEntry = currentPage * pageSize + 1;
  const endEntry = Math.min((currentPage + 1) * pageSize, totalEntries);

  return (
    <>
      <Select
        defaultValue="10"
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select number of orders per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
          <SelectItem value="200">200</SelectItem>
          <SelectItem value="500">500</SelectItem>
        </SelectContent>
      </Select>
      <TypographySmall className="text-xs">
        Showing {startEntry} to {endEntry} of {totalEntries} Entries
      </TypographySmall>
    </>
  );
}
