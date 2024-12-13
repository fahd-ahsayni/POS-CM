import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setOrderType } from "@/store/slices/orderSlice";

export default function NumberOfPeeper() {
  const [peopleCount, setPeopleCount] = useState(1);
  const dispatch = useDispatch();

  

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-4">
        
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => dispatch(setOrderType(null))}>Cancel</Button>
        <Button className="flex-1">Confirm Number of People</Button>
      </div>
    </div>
  );
}
