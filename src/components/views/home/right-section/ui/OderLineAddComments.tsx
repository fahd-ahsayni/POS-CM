import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CommentIcon, DeleteCommentIcon } from "@/assets/figma-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateOrderLine } from "@/store/slices/order/create-order.slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useProductSelection } from "../../left-section/hooks/useProductSelection";
import { useRightViewContext } from "../contexts/RightViewContext";
import ComboboxSelectOnChange from "@/components/global/ComboboxSelectOnChange";
import { PlusIcon } from "lucide-react";

interface OrderLineAddCommentsProps {
  productId: string;
  customerIndex: number;
  initialNotes?: string[];
  onNotesUpdate?: (notes: string[]) => void;
}

export default function OrderLineAddComments({
  productId,
  customerIndex,
  initialNotes = [],
  onNotesUpdate,
}: OrderLineAddCommentsProps) {
  const dispatch = useDispatch();
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const { orderType } = useRightViewContext();
  const { updateProductNotes } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    customerIndex,
    orderType,
  });

  const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
  const defineComments =
    generalData.defineNote?.filter((item: any) => item.type === "pos") || [];

  const [comments, setComments] = useState<string[]>([...initialNotes]);

  const handleCommentChange = (index: number, value: string | null) => {
    const updatedComments = [...comments];
    updatedComments[index] = value || "";

    setComments(updatedComments);

    if (onNotesUpdate) {
      onNotesUpdate(updatedComments);
    } else {
      updateProductNotes(productId, updatedComments, customerIndex);
      dispatch(
        updateOrderLine({
          _id: productId,
          customer_index: customerIndex,
          notes: updatedComments,
        })
      );
    }
  };

  const addCommentField = () => {
    if (comments.length === 0 || comments[comments.length - 1].trim() !== "") {
      setComments([...comments, ""]);
    }
  };

  const removeCommentField = (index: number) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);

    if (onNotesUpdate) {
      onNotesUpdate(updatedComments);
    } else {
      updateProductNotes(productId, updatedComments, customerIndex);
      dispatch(
        updateOrderLine({
          _id: productId,
          customer_index: customerIndex,
          notes: updatedComments,
        })
      );
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20 relative"
        >
          <CommentIcon className="fill-primary-black dark:fill-white h-4 w-4" />
          <span className="sr-only">Comments</span>
          {comments.length > 0 &&
            comments.some((comment) => comment.trim() !== "") && (
              <span className="absolute -top-1 -right-1 bg-error-color text-white text-[0.6rem] rounded-full flex items-center justify-center shadow-md shadow-error-color/50 size-4">
                {comments.length}
              </span>
            )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 mt-2 w-[280px] rounded-md bg-white dark:bg-primary-black shadow-lg border border-border p-3 space-y-2 -ml-52 top-2"
          sideOffset={5}
          collisionPadding={16}
          avoidCollisions={true}
        >
          {comments.map((comment, index) => (
            <div key={index} className="flex items-center">
              <ComboboxSelectOnChange
                label={`Comment ${index + 1}`}
                items={defineComments.map((item: any) => item.text)}
                value={comment}
                onChange={(value) => handleCommentChange(index, value)}
                displayValue={(item) => item}
                filterFunction={(query, item) =>
                  item.toLowerCase().includes(query.toLowerCase())
                }
                renderOption={(item, active) => (
                  <span className={cn("px-2 py-1", active && "bg-gray-200")}>
                    {item}
                  </span>
                )}
                placeholder="Choose a comment"
              />
              {comment.trim() !== "" && ( // Only show delete button when there is text
                <Button
                  variant="link"
                  onClick={() => removeCommentField(index)}
                >
                  <DeleteCommentIcon className="h-5 w-5 -mb-2 !fill-red-400" />
                </Button>
              )}
            </div>
          ))}

          <Button
            onClick={addCommentField}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" /> Add Comment
          </Button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
