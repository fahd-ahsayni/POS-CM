import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { RootState } from "@/store";
import { setNotes } from "@/store/slices/order/create-order.slice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalLayout from "./Layout";
import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";

interface ModalOrderCommentsProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export default function ModalOrderComments({
  isOpen,
  setOpen,
}: ModalOrderCommentsProps) {
  const notes = useSelector((state: RootState) => state.createOrder.data.notes);
  const [comment, setComment] = useState(notes);
  const dispatch = useDispatch();

  // Virtual Keyboard state management
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Create a ref for the textarea to manage cursor position
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get virtual keyboard function
  const { openKeyboard } = useVirtualKeyboard();

  // Update the comment when notes in the store change
  useEffect(() => {
    setComment(notes);
  }, [notes]);

  // Keep the textarea's selection in sync with the cursor position
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.selectionStart = cursorPosition;
      textareaRef.current.selectionEnd = cursorPosition;
    }
  }, [comment, cursorPosition]);

  const handleAddComment = () => {
    dispatch(setNotes(comment));
    setOpen(false);
  };

  // Handle keypress from virtual keyboard
  const handleKeyboardKeyPress = (key: string) => {
    if (activeInput !== "textarea") return;

    let currentValue = comment;
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

    setComment(currentValue);
    setCursorPosition(newPosition);
  };

  const handleFocus = () => {
    setActiveInput("textarea");
    openKeyboard("textarea", handleKeyboardKeyPress);

    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart || 0);
    }
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
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type your comment here ..."
            className="w-full"
            onFocus={handleFocus}
            onSelect={(e) => {
              const selectionStart = (e.target as HTMLTextAreaElement).selectionStart || 0;
              setCursorPosition(selectionStart);
            }}
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
