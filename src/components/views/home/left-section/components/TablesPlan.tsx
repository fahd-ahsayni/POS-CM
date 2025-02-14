import { Card } from "@/components/ui/card";

export default function TablesPlan() {
  return (
    <div className="w-full grid grid-cols-6 gap-4">
      {Array.from({ length: 15 }).map((_, index) => (
        <Card className="h-20">Table {index}</Card>
      ))}
    </div>
  );
}
