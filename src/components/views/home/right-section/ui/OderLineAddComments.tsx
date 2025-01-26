import { CommentIcon, DeleteCommentIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateOrderLine } from "@/store/slices/order/create-order.slice";
import { Menu } from "@headlessui/react";
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

interface OderLineAddCommentsProps {
  productId: string;
  customerIndex: number;
  initialNotes?: string[];
  onNotesUpdate?: (notes: string[]) => void;
}

export default function OderLineAddComments({
  productId,
  customerIndex,
  initialNotes = [],
  onNotesUpdate,
}: OderLineAddCommentsProps) {
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const { orderType } = useRightViewContext();
  const { updateProductNotes } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    customerIndex,
    orderType,
  });

  const dispatch = useDispatch();
  const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
  const defineComments =
    generalData.defineNote?.filter((item: any) => item.type === "pos") || [];
  const [comments, setComments] = useState<string[]>(initialNotes);
  const [customInputs, setCustomInputs] = useState<boolean[]>(
    new Array(comments.length + 1).fill(false)
  );

  const handleCommentChange = (value: string, index: number) => {
    const newComments = [...comments];
    newComments[index] = value;

    if (index === comments.length - 1 && value.trim()) {
      newComments.push("");
      setCustomInputs([...customInputs, false]);
    }

    const filteredComments = newComments.filter((c) => c.trim() !== "");
    setComments(filteredComments);

    if (onNotesUpdate) {
      onNotesUpdate(filteredComments);
    } else {
      updateProductNotes(productId, filteredComments, customerIndex);
      dispatch(
        updateOrderLine({
          _id: productId,
          customer_index: customerIndex,
          notes: filteredComments,
        })
      );
    }
  };

  const handleCustomInputToggle = (index: number, enabled: boolean) => {
    const newCustomInputs = [...customInputs];
    newCustomInputs[index] = enabled;
    setCustomInputs(newCustomInputs);

    // Reset the value when switching between input types
    handleCommentChange("", index);
  };

  const handleDelete = (index: number) => {
    if (comments.length > 0) {
      const newComments = comments.filter((_, i) => i !== index);
      setComments(newComments);
      if (onNotesUpdate) {
        onNotesUpdate(newComments);
      } else {
        updateProductNotes(productId, newComments, customerIndex);
        dispatch(
          updateOrderLine({
            _id: productId,
            customer_index: customerIndex,
            notes: newComments,
          })
        );
      }
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        as={Button}
        size="icon"
        variant="ghost"
        className="-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20 relative"
      >
        <CommentIcon className="fill-primary-black dark:fill-white h-4 w-4" />
        <span className="sr-only">Comments</span>
        {comments.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-error-color text-white text-[0.6rem] rounded-full flex items-center justify-center shadow-md shadow-error-color/50 size-4">
            <span>{comments.length}</span>
          </span>
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-4 w-[280px] origin-top-right rounded-md bg-white dark:bg-primary-black shadow-lg focus:outline-none p-3 border border-border z-50 space-y-2">
        {[...comments, ""].map((comment, index) => (
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
              />
            )}
            <div className="flex items-center">
              {comment ? (
                <Button
                  size="icon"
                  variant="link"
                  onClick={() => handleDelete(index)}
                >
                  <DeleteCommentIcon
                    className={cn(
                      comment ? "fill-error-color" : "fill-neutral-dark-grey",
                      "w-5 h-5"
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
      </Menu.Items>
    </Menu>
  );
}
