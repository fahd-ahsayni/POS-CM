import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export default function CommentsOfProducts({ notes }: { notes: string[] }) {
  if (!notes || notes.length === 0) {
    return null; // Return null if there are no notes to display
  }
  return (
    <div
      className={cn("relative -right-4", notes?.length > 0 ? "pb-4" : "h-0")}
    >
      {notes.map((comment: string, index: number) => (
        <div key={index} className="relative flex items-end gap-x-2">
          <div className="h-6 w-4 border-l-2 border-b-2 rounded-bl-lg border-neutral-600 relative">
            {index !== 0 && (
              <div className="absolute -left-0.5 -top-1.5 border-l-2 w-3 h-3 border-neutral-600" />
            )}
          </div>
          <TypographySmall className="relative dark:text-neutral-400 text-neutral-500 text-sm -bottom-2">
            {comment}
          </TypographySmall>
        </div>
      ))}
    </div>
  );
}
