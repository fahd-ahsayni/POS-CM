import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectDemo() {
  return (
    <div className="space-y-2">
      <Label htmlFor="select-15">Simple select with default value</Label>
      <Select defaultValue="s1">
        <SelectTrigger id="select-15">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="s1">10</SelectItem>
          <SelectItem value="s2">100</SelectItem>
          <SelectItem value="s3">200</SelectItem>
          <SelectItem value="s4">500</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
