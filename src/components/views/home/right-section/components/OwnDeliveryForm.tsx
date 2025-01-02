import { TypographyH3 } from "@/components/ui/typography";
import ClientForm from "../layouts/ClientForm";

export default function NumberOfTabel() {

  return (
    <div className="flex flex-col justify-evenly h-full">
      <TypographyH3 className="font-medium max-w-xs">
        Enter the table number to start the order:
      </TypographyH3>
      <div className="flex flex-col justify-center items-center gap-y-4 px-1">
        <ClientForm onClose={() => {}} />
      </div>
    </div>
  );
}
