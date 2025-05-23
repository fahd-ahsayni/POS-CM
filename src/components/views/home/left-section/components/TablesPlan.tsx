import { getOrderByTableId } from "@/api/services";
import { getFloors } from "@/api/services/floors.service";
import {
  Table2Seats,
  Table4Seats,
  Table6Seats,
  Table8Seats,
} from "@/assets/tables-icons";
import { useOrder } from "@/components/global/drawers/order-details/context/OrderContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNumberOfTable } from "@/components/views/home/right-section/hooks/useNumberOfTable";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Table {
  _id: string;
  name: string;
  seats: number;
  position_h: number;
  position_v: number;
  status: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  floor: Floor;
}

interface Floor {
  _id: string;
  name: string;
  table_ids: Table[];
}

export default function TablesPlan() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const { handleConfirm } = useNumberOfTable();
  const { setSelectedOrder, setOpenOrderDetails } = useOrder();

  useEffect(() => {
    const fetchAllFloors = async () => {
      const response = await getFloors();
      setFloors(response.data);
    };

    fetchAllFloors();
  }, []);

  const handleTableClick = async (table: Table) => {
    if (table.status == "occupied") {
      try {
        const response = await getOrderByTableId(table._id);
        const order = response.data;

        // If order exists, set it and open the order details drawer
        if (order) {
          setSelectedOrder(order);
          setOpenOrderDetails(true);
        } else {
          toast.warning(
            createToast(
              "Table not available",
              "This table is already taken but no active order found",
              "warning"
            )
          );
        }
      } catch (error) {
        console.error("Error fetching order by table ID:", error);
        toast.error(
          createToast("Error", "Failed to fetch order information", "error")
        );
      }
      return;
    } else {
      await handleConfirm(table.name);
    }
  };

  return (
    <>
      {floors.length > 0 ? (
        <Tabs defaultValue={floors[0]?.name} className="h-full flex flex-col">
          <ScrollArea orientation="horizontal" className="pb-2.5">
            <TabsList className="bg-white/5">
              {floors.map((floor) => (
                <TabsTrigger
                  key={floor._id}
                  value={floor.name}
                  className="px-8"
                >
                  {floor.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          <ScrollArea className="flex-grow h-[calc(100%-50px)] overflow-auto">
            {floors.map((floor) => (
              <TabsContent
                key={floor._id}
                value={floor.name}
                className="h-full mt-0 p-4"
              >
                <div className="w-full grid grid-cols-5 gap-3">
                  {floor.table_ids.map((table) => {
                    const TableIcon =
                      table.seats > 7
                        ? Table8Seats
                        : table.seats > 5
                        ? Table6Seats
                        : table.seats > 3
                        ? Table4Seats
                        : Table2Seats;
                    return (
                      <Card
                        key={table._id}
                        className={cn(
                          "h-20 flex items-center justify-start relative bg-zinc-900 border-neutral-700",
                          table.status === "available" && "cursor-pointer"
                        )}
                        onClick={() => handleTableClick(table)}
                      >
                        <div className="flex items-center justify-center pl-3">
                          <TableIcon
                            className={cn(
                              "w-auto absolute left-2 h-14",
                              table.status === "available"
                                ? " text-white/10"
                                : "text-primary-red/70"
                            )}
                          />
                          <span className="font-semibold relative text-white">
                            Table {table.name}
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-center text-lg font-medium dark:text-white/80">
            No tables found for this floor.
          </p>
        </div>
      )}
    </>
  );
}
