import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import ModalLayout from "./Layout";
import { useState } from "react";
import { updateOrder } from "@/functions/updateOrder";
import { useDispatch } from "react-redux";
import { setNotes } from "@/store/slices/order/createOrder";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ModalOrderCommentsProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export default function ModalOrderComments({
  isOpen = true,
  setOpen = () => {},
}: ModalOrderCommentsProps) {
  const [comment, setComment] = useState("");
  const notes = useSelector((state: RootState) => state.createOrder.data.notes);
  const dispatch = useDispatch();

  const handleAddComment = () => {
    dispatch(setNotes([...notes, comment]));
    setOpen(false);
  };

  return (
    <ModalLayout isOpen={isOpen} closeModal={() => setOpen(false)}>
      <div className="flex flex-col items-center justify-center gap-6">
        <TypographyH4 className="mb-4">Add Order Comment</TypographyH4>
        <div className="w-full mb-2">
          <TypographyP className="text-sm mb-2">
            Provide a global comment for the order below.
          </TypographyP>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment here ..."
            className="w-full"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            className="w-[145px]"
          >
            Cancel
          </Button>
          <Button className="w-[145px]" onClick={handleAddComment}>
            Add Comment
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
}
