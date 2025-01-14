import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWaitingOrders } from "../hooks/useWaitingOrders";
import { useNavigate } from "react-router-dom";
import { ORDER_SUMMARY_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { useDispatch } from "react-redux";
import { setOrderData } from "@/store/slices/order/create-order.slice";

const HEADERS = [
  { label: "Created At", align: "start" },
  { label: "Created By", align: "start" },
  { label: "Order Type", align: "start" },
  { label: "Order Total (Dhs)", align: "start" },
];

export default function WaitingOrdersTable() {
  const { tableData, loading } = useWaitingOrders();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setViews } = useRightViewContext();
  const { setSelectedProducts } = useLeftViewContext();

  const handleRowClick = (row: any) => {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem("products") || "[]");

    // Map orderlines with product names
    const orderLinesWithNames = row.originalOrder.orderlines.map(
      (line: any) => {
        const product = products.find((p: any) => p._id === line.product_id);
        return {
          ...line,
          name: product?.name,
        };
      }
    );

    // Set order data in Redux store with updated orderlines
    dispatch(
      setOrderData({
        ...row.originalOrder,
        orderlines: orderLinesWithNames,
      })
    );

    // Set selected products
    setSelectedProducts(orderLinesWithNames);

    // Navigate to home and show order summary
    navigate("/");
    setViews(ORDER_SUMMARY_VIEW);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {HEADERS.map(({ label, align }) => (
            <TableHead key={label} className={`text-${align}`}>
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((row) => (
          <TableRow
            key={row._id}
            onClick={() => handleRowClick(row)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell>{row.createdAt}</TableCell>
            <TableCell>{row.createdBy}</TableCell>
            <TableCell>{row.orderType}</TableCell>
            <TableCell className="text-right">
              {row.orderTotal.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
