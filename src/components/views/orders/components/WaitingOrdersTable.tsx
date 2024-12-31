import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WaitingOrder } from "@/types/waitingOrders";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useLeftViewContext } from "../../home/left-section/contexts/leftViewContext";
import { ORDER_SUMMARY_VIEW } from "../../home/right-section/constants";
import { useRightViewContext } from "../../home/right-section/contexts/rightViewContext";
import { useWaitingOrders } from "../hooks/useWaitingOrders";
import { handleWaitingOrderSelect } from "../hooks/useWaitingOrdersManagement";

const HEADERS = [
  { key: "createdAt", label: "Date & Time", isTextMuted: true },
  { key: "created_by.name", label: "Created by" },
  { key: "order_type_id.type", label: "Order Type" },
  { key: "total_amount", label: "Order Total (Dhs)", isPrice: true },
];

const WaitingOrdersTable = ({ data }: { data: WaitingOrder[] }) => {
  const { sortedData, sortConfig, handleSort } = useWaitingOrders({ data });
  const { setSelectedProducts } = useLeftViewContext();
  const { setCustomerIndex, setSelectedCustomer, setViews } =
    useRightViewContext();
  const navigate = useNavigate();

  const handleOrderClick = (displayItem: any) => {
    const originalOrder = data.find((order) => order._id === displayItem._id);
    if (!originalOrder) return;

    handleWaitingOrderSelect(
      originalOrder,
      setSelectedProducts,
      setCustomerIndex,
      setSelectedCustomer
    );
    navigate("/");
    setViews(ORDER_SUMMARY_VIEW);
  };

  return (
    <div className="rounded-md h-full relative overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {HEADERS.map((header) => (
              <TableHead
                key={header.key}
                className="cursor-pointer"
                onClick={() => handleSort(header.key)}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow
              key={item._id}
              onClick={() => handleOrderClick(item)}
              className="cursor-pointer hover:bg-white/70 dark:hover:bg-white/5"
            >
              {HEADERS.map((header) => (
                <TableCell
                  key={`${item._id}-${header.key}`}
                  className={`${
                    header.isTextMuted ? "text-muted-foreground" : ""
                  } 
                            ${header.isPrice ? "text-right" : ""}`}
                >
                  {header.isPrice ? (
                    <span>{Number(item.total_amount).toFixed(2)} Dhs</span>
                  ) : (
                    item[header.key as keyof typeof item]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(WaitingOrdersTable);
