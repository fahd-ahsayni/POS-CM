import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectNumberOfOrderPerPage() {
  return (
    <Select defaultValue="10">
      <SelectTrigger>
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="50">50</SelectItem>
        <SelectItem value="100">100</SelectItem>
        <SelectItem value="200">200</SelectItem>
        <SelectItem value="500">500</SelectItem>
      </SelectContent>
    </Select>
  );
}
