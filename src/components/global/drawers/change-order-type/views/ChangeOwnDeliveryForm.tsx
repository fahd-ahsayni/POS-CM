import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH3 } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { CHANGE_OWN_DELIVERY_FORM_VIEW } from "../constants";

interface OwnDeliveryFormProps {
  setDrawerView: (view: string) => void;
  setOpen: (open: boolean) => void;
}

export default function ChangeOwnDeliveryForm({
  setDrawerView,
  setOpen,
}: OwnDeliveryFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full"
    >
      <div className="flex flex-col justify-evenly h-full p-4">
        <TypographyH3 className="font-medium max-w-xs mb-4">
          Enter delivery details:
        </TypographyH3>
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div className="w-full">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              className="dark:bg-muted bg-white"
              placeholder="e.g. +212 612 34 56 78"
              type="tel"
              required
            />
          </div>

          <div className="w-full">
            <Label htmlFor="name">Full Name / Organization Name</Label>
            <Input
              id="name"
              className="dark:bg-muted bg-white"
              placeholder="Enter your full name or organization name"
              type="text"
              required
            />
          </div>

          <div className="w-full">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              className="min-h-[none] dark:bg-muted bg-white"
              placeholder="Enter delivery address"
              rows={2}
              required
            />
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between gap-1">
              <Label htmlFor="email" className="leading-6">
                Email
              </Label>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>
            <Input
              id="email"
              className="dark:bg-muted bg-white"
              placeholder="e.g. example@gmail.com"
              type="email"
            />
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between gap-1">
              <Label htmlFor="ice" className="leading-6">
                Company Identification Number
              </Label>
              <span className="text-xs text-muted-foreground">Optional</span>
            </div>
            <Input
              id="ice"
              className="dark:bg-muted bg-white"
              placeholder="Enter 14-digit company ICE"
              type="text"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDrawerView(CHANGE_OWN_DELIVERY_FORM_VIEW)}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
