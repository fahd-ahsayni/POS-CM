import { CommentIcon, DeleteCommentIcon } from "@/assets/figma-icons";
import ComboboxSelectOnChange from "@/components/global/ComboboxSelectOnChange";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateOrderLine } from "@/store/slices/order/create-order.slice";
import { Menu } from "@headlessui/react";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useProductSelection } from "../../left-section/hooks/useProductSelection";
import { useRightViewContext } from "../contexts/RightViewContext";

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
  const defineComments = generalData.defineNote.filter(
    (item: any) => item.type === "pos"
  );
  const [comments, setComments] = useState<string[]>(initialNotes);

  const displayValue = (item: any) => (item ? item.text || "" : "");

  const filterFunction = (query: string, item: any) => {
    return item.text
      ? item.text.toLowerCase().includes(query.toLowerCase())
      : false;
  };

  const renderOption = (item: any, _: any, selected: boolean) => (
    <div className="flex items-center justify-between">
      <span>{item.text}</span>
      {selected && <CheckIcon className="h-4 w-4 text-primary-red" />}
    </div>
  );

  const handleComboboxChange = (value: any, index: number) => {
    const newComments = [...comments];
    const commentValue = typeof value === "string" ? value : value?.text || "";
    newComments[index] = commentValue;

    if (index === comments.length - 1 && commentValue) {
      newComments.push("");
    }

    const filteredComments = newComments.filter((c) => c !== "");
    setComments(filteredComments);

    // Call both the original update and the new callback
    if (onNotesUpdate) {
      onNotesUpdate(filteredComments);
    } else {
      // Original update logic
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

  const handleDelete = (index: number) => {
    if (comments.length > 0) {
      const newComments = comments.filter((_, i) => i !== index);
      setComments(newComments);
      dispatch(
        updateOrderLine({
          _id: productId,
          customer_index: customerIndex,
          notes: newComments,
        })
      );
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

      <Menu.Items className="absolute right-0 mt-4 w-[250px] origin-top-right rounded-md bg-white dark:bg-primary-black shadow-lg focus:outline-none p-3 border border-border z-50 space-y-2">
        {[...comments, ""].map((comment, index) => (
          <div key={index} className="flex items-center gap-2">
            <ComboboxSelectOnChange
              items={defineComments}
              value={comment}
              onChange={(value) => handleComboboxChange(value, index)}
              displayValue={displayValue}
              filterFunction={filterFunction}
              renderOption={renderOption}
              placeholder="Add a comment"
            />
            <div className="flex items-center">
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
            </div>
          </div>
        ))}
      </Menu.Items>
    </Menu>
  );
}
