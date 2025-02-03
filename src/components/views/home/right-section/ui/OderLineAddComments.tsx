import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CommentIcon, DeleteCommentIcon } from "@/assets/figma-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateOrderLine } from "@/store/slices/order/create-order.slice";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useProductSelection } from "../../left-section/hooks/useProductSelection";
import { useRightViewContext } from "../contexts/RightViewContext";
import ComboboxSelectOnChange from "@/components/global/ComboboxSelectOnChange";
import { PlusIcon } from "lucide-react";
import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";

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
  const { openKeyboard, showKeyboard } = useVirtualKeyboard();
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
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  // Refs for each comment input field
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Handle keypress from virtual keyboard
  const handleKeyPress = (key: string) => {
    if (activeInput === null) return;

    let currentValue = comments[activeInput] || "";
    let newPosition = cursorPosition;

    if (key === "Backspace") {
      if (cursorPosition > 0) {
        currentValue =
          currentValue.slice(0, cursorPosition - 1) +
          currentValue.slice(cursorPosition);
        newPosition = cursorPosition - 1;
      }
    } else {
      currentValue =
        currentValue.slice(0, cursorPosition) +
        key +
        currentValue.slice(cursorPosition);
      newPosition = cursorPosition + key.length;
    }

    handleCommentChange(activeInput, currentValue);
    setCursorPosition(newPosition);

    const inputRefCurrent = inputRefs.current[activeInput];
    if (inputRefCurrent) {
      setTimeout(() => {
        inputRefCurrent.setSelectionRange(newPosition, newPosition);
        inputRefCurrent.focus();
      }, 0);
    }
  };

  // Handle input focus
  const handleInputFocus = (index: number) => {
    setActiveInput(index);
    openKeyboard(`comment-${index}`, handleKeyPress);

    const inputRef = inputRefs.current[index];
    if (inputRef) {
      setCursorPosition(inputRef.selectionStart || 0);
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
          onPointerDownOutside={(event) => {
            if (showKeyboard) {
              event.preventDefault(); // Prevent closing if keyboard is open
            }
          }}
        >
          {comments.map((comment, index) => (
            <div key={index} className="flex items-center mt-2">
              <ComboboxSelectOnChange
                label={`Note ${index + 1}`}
                items={defineComments.map((item: any) => item.text)}
                value={comment}
                onChange={(value) => handleCommentChange(index, value)}
                displayValue={(item) => item}
                filterFunction={(query, item) =>
                  item.toLowerCase().includes(query.toLowerCase())
                }
                renderOption={(item, active) => (
                  <span className={cn("px-2 py-1", active && "")}>{item}</span>
                )}
                placeholder="Choose a comment"
                inputRef={(el) => (inputRefs.current[index] = el)}
                onFocus={() => handleInputFocus(index)}
                onSelect={(e) => {
                  const selectionStart = (e.target as HTMLInputElement).selectionStart || 0;
                  setCursorPosition(selectionStart);
                }}
              />
              {comment.trim() !== "" && (
                <Button
                  variant="link"
                  size="icon"
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
