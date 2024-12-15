import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setSelectedOrderType } from "@/store/slices/pages/SelectOrderSlice";
import { TypographyH3 } from "@/components/ui/typography";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NumberOfTabel() {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col justify-evenly h-full">
      <TypographyH3 className="font-medium max-w-xs">
        Enter the table number to start the order:
      </TypographyH3>
      <div className="flex flex-col justify-center items-center gap-y-4 px-1">
        <div className="space-y-1 w-full">
          <Label htmlFor="input-07">Phone Number</Label>
          <Input
            id="input-07"
            className="dark:bg-muted bg-white"
            placeholder="e.g. +212 612 34 56 78"
            type="tel"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="input-07">Full Name / Organization Name</Label>
          <Input
            id="input-07"
            className="dark:bg-muted bg-white"
            placeholder="Enter your full name or organization name"
            type="text"
          />
        </div>
        <div className="space-y-1 w-full">
          <Label htmlFor="input-07">Address</Label>
          <Textarea
            id="textarea-08"
            className="min-h-[none] dark:bg-muted bg-white"
            placeholder="Enter your address"
            rows={2}
          />
        </div>
        <div className="space-y-1 w-full">
          <div className="mb-2 flex items-center justify-between gap-1">
            <Label htmlFor="input-07" className="leading-6">
              Email
            </Label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <Input
            id="input-07"
            className="dark:bg-muted bg-white"
            placeholder="e.g. example@gmail.com"
            type="email"
          />
        </div>
        <div className="space-y-1 w-full">
          <div className="mb-2 flex items-center justify-between gap-1">
            <Label htmlFor="input-07" className="leading-6">
              Company Identification Number
            </Label>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <Input
            id="input-07"
            className="dark:bg-muted bg-white"
            placeholder="Enter 14-digit company ICE"
            type="text"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 bg-gray-200 hover:bg-gray-300/70 dark:bg-muted"
          onClick={() => dispatch(setSelectedOrderType(null))}
        >
          Cancel
        </Button>
        <Button className="flex-1">Confirm</Button>
      </div>
    </div>
  );
}
