import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { RootState } from "@/store";
import { setNotes } from "@/store/slices/order/create-order.slice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalLayout from "./Layout";
import VirtualKeyboard from "@/components/keyboard/VirtualKeyboard";

interface ModalOrderCommentsProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export default function ModalOrderComments({
  isOpen = true,
  setOpen = () => { },
}: ModalOrderCommentsProps) {
  const notes = useSelector((state: RootState) => state.createOrder.data.notes);
  const [comment, setComment] = useState(notes);
  const dispatch = useDispatch();

  // Virtual Keyboard state management
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Create a ref for the textarea so we can manage the cursor position.
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setComment(notes);
  }, [notes]);

  // Whenever the comment or cursor position changes, update the textarea's selection.
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

  /**
   * This function handles key presses coming from the VirtualKeyboard.
   * It inserts or removes text in the comment state at the current cursor position.
   */
  const handleKeyboardKeyPress = (key: string) => {
    // Make sure we're working with the textarea.
    if (activeInput !== "textarea") return;

    let currentValue = comment;

    if (key === "Backspace") {
      // Remove one character before the cursor if possible.
      if (cursorPosition > 0) {
        currentValue =
          currentValue.slice(0, cursorPosition - 1) +
          currentValue.slice(cursorPosition);
        setComment(currentValue);
        setCursorPosition(cursorPosition - 1);
      }
    } else if (key === "BackspaceLongPress") {
      // Clear the entire text.
      currentValue = "";
      setComment(currentValue);
      setCursorPosition(0);
    } else {
      // Insert the key at the current cursor position.
      currentValue =
        currentValue.slice(0, cursorPosition) +
        key +
        currentValue.slice(cursorPosition);
      setComment(currentValue);
      setCursorPosition(cursorPosition + key.length);
    }
  };

  return (
    <>
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
              onFocus={() => {
                setActiveInput("textarea");
                setShowKeyboard(true);
              }}
              onBlur={() => {
                // Optionally hide the keyboard on blur.
                // setShowKeyboard(false);
              }}
              onSelect={(e) => {
                const pos = (e.target as HTMLTextAreaElement).selectionStart || 0;
                setCursorPosition(pos);
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

      {showKeyboard && (
        <div className="mt-4">
          <VirtualKeyboard
            onClose={() => setShowKeyboard(false)}
            onKeyPress={handleKeyboardKeyPress}
            inputType="textarea" // optional prop to let the keyboard know which input is active
          />
        </div>
      )}</>
  );
}
