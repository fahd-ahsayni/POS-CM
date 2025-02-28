import { getFloors } from "@/api/services/floors.service";
import {
  Table2Seats,
  Table4Seats,
  Table6Seats,
  Table8Seats,
} from "@/assets/tables-icons";
import { createToast } from "@/components/global/Toasters";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNumberOfTable } from "@/components/views/home/right-section/hooks/useNumberOfTable";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  useEffect(() => {
    const fetchAllFloors = async () => {
      const response = await getFloors();
      setFloors(response.data);
    };

    fetchAllFloors();
  }, []);

  console.log(floors)

  const handleTableClick = async (table: Table) => {
    if (table.status !== "available") {
      toast.warning(
        createToast(
          "Table not available",
          "This table is already Taken",
          "warning"
        )
      );
      return;
    }
    await handleConfirm(table.name);
  };

  return (
    <>
      {floors.length > 0 ? (
        <Tabs defaultValue={floors[0]?.name}>
          <TabsList className="dark:bg-white/5">
            {floors.map((floor) => (
              <TabsTrigger key={floor._id} value={floor.name} className="px-8">
                {floor.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {floors.map((floor) => (
            <TabsContent key={floor._id} value={floor.name}>
              <div className="w-full grid grid-cols-5 gap-3 pt-4">
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
                        "h-20 flex items-center justify-start relative",
                        table.status === "available" && "cursor-pointer"
                      )}
                      onClick={() => handleTableClick(table)}
                    >
                      <div className="flex items-center justify-center pl-3">
                        <TableIcon
                          className={cn(
                            "w-auto absolute left-2 h-14",
                            table.status === "available"
                              ? "text-primary-black/10 dark:text-white/10"
                              : "text-primary-red/70"
                          )}
                        />
                        <span className="font-semibold relative">
                          Table {table.name}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
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
