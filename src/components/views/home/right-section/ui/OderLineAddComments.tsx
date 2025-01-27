import { CommentIcon, DeleteCommentIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateOrderLine } from "@/store/slices/order/create-order.slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useProductSelection } from "../../left-section/hooks/useProductSelection";
import { useRightViewContext } from "../contexts/RightViewContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

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

  const [comments, setComments] = useState<string[]>(() => {
    return [...initialNotes, ""];
  });

  const [customInputs, setCustomInputs] = useState<boolean[]>(
    new Array(initialNotes.length + 1).fill(false)
  );

  const handleCommentChange = (value: string, index: number) => {
    setComments((prev) => {
      const newComments = [...prev];
      newComments[index] = value;

      if (index === prev.length - 1 && value.length > 0) {
        newComments.push("");
        setCustomInputs((prevCI) => [...prevCI, false]);
      }
      return newComments;
    });
  };

  const handleBlur = () => {
    setComments((prev) => {
      const filtered = prev.filter((c) => c.length > 0);
      filtered.push("");

      if (onNotesUpdate) {
        onNotesUpdate(filtered.slice(0, -1));
      } else {
        updateProductNotes(productId, filtered.slice(0, -1), customerIndex);
        dispatch(
          updateOrderLine({
            _id: productId,
            customer_index: customerIndex,
            notes: filtered.slice(0, -1),
          })
        );
      }
      return filtered;
    });
  };

  const handleCustomInputToggle = (index: number, enabled: boolean) => {
    setCustomInputs((prev) => {
      const newArr = [...prev];
      newArr[index] = enabled;
      return newArr;
    });
    handleCommentChange("", index);
  };

  const handleDelete = (index: number) => {
    setComments((prev) => {
      const newComments = prev.filter((_, i) => i !== index);
      if (onNotesUpdate) {
        onNotesUpdate(newComments.slice(0, -1));
      } else {
        updateProductNotes(productId, newComments.slice(0, -1), customerIndex);
        dispatch(
          updateOrderLine({
            _id: productId,
            customer_index: customerIndex,
            notes: newComments.slice(0, -1),
          })
        );
      }
      return newComments;
    });
    setCustomInputs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20 relative"
        >
          <CommentIcon className="fill-primary-black dark:fill-white h-4 w-4" />
          <span className="sr-only">Comments</span>
          {comments.filter((c) => c.trim() !== "").length > 0 && (
            <span className="absolute -top-1 -right-1 bg-error-color text-white text-[0.6rem] rounded-full flex items-center justify-center shadow-md shadow-error-color/50 size-4">
              {comments.filter((c) => c.trim() !== "").length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="mt-2 w-[280px] rounded-md bg-white dark:bg-primary-black shadow-lg border border-border p-3 space-y-2 -translate-x-1/3"
        onBlur={handleBlur}
      >
        {comments.map((comment, index) => (
          <div key={index} className="flex items-center gap-2">
            {!customInputs[index] ? (
              <Select
                value={comment}
                onValueChange={(value) => handleCommentChange(value, index)}
              >
                <SelectTrigger className="w-full text-[.8rem]">
                  <SelectValue placeholder="Add a comment" />
                </SelectTrigger>
                <SelectContent>
                  {defineComments.map((item: any) => (
                    <SelectItem
                      key={item.id}
                      value={item.text}
                      className="text-[.8rem]"
                    >
                      {item.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                value={comment}
                placeholder="Add a comment"
                onChange={(e) => handleCommentChange(e.target.value, index)}
                onBlur={handleBlur}
              />
            )}
            <div className="flex items-center">
              {comment.trim() ? (
                <Button
                  size="icon"
                  variant="link"
                  onClick={() => handleDelete(index)}
                >
                  <DeleteCommentIcon
                    className={cn(
                      "w-5 h-5",
                      comment.trim()
                        ? "fill-error-color"
                        : "fill-neutral-dark-grey"
                    )}
                  />
                  <span className="sr-only">Delete</span>
                </Button>
              ) : (
                <Switch
                  checked={customInputs[index]}
                  onChange={(enabled) =>
                    handleCustomInputToggle(index, enabled)
                  }
                  color="red"
                />
              )}
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
