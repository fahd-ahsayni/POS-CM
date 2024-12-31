import { CommentIcon, DeleteCommentIcon } from "@/assets/figma-icons";
import ComboboxSelectOnChange from "@/components/global/ComboboxSelectOnChange";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

export default function OderLineAddComments() {
  const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
  const defineComments = generalData.defineNote.filter(
    (item: any) => item.type === "pos"
  );

  const [comments, setComments] = useState<string[]>([]);

  const displayValue = (item: any) => (item ? item.text || "" : "");

  const filterFunction = (query: string, item: any) => {
    return item.text
      ? item.text.toLowerCase().includes(query.toLowerCase())
      : false;
  };

  const renderOption = (item: any, active: boolean, selected: boolean) => (
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

    setComments(newComments.filter((c) => c !== ""));
    console.log(
      "All comments:",
      newComments.filter((c) => c !== "")
    );
  };

  const handleDelete = (index: number) => {
    if (comments.length > 0) {
      const newComments = comments.filter((_, i) => i !== index);
      setComments(newComments);
      console.log("All comments after delete:", newComments);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20"
        >
          <CommentIcon className="fill-primary-black dark:fill-white h-4 w-4" />
          <span className="sr-only">Comments</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="-ml-52 space-y-2 py-2">
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
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: comment ? 1 : 0, x: comment ? 0 : -10 }}
              transition={{ duration: 0.15 }}
              className={cn(comment ? "cursor-pointer" : "cursor-not-allowed")}

            >
              <Button
                size="icon"
                variant="link"
                onClick={() => handleDelete(index)}
              >
                <DeleteCommentIcon className={cn(comment ? "fill-error-color" : "fill-neutral-dark-grey")} />
                <span className="sr-only">Delete</span>
              </Button>
            </motion.span>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
