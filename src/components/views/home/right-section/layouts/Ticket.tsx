import { TypographyP } from "@/components/ui/typography";
import { useSelector } from "react-redux";

export default function Ticket() {
  const order = useSelector((state: any) => state.order);

  return (
    <div className="w-full px-4">
      <div className="w-full rounded-lg dark:bg-white bg-primary-black">
        <div className="p-4 space-y-1">
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm font-semibold dark:text-primary-black text-white">
              Subtotal
            </TypographyP>
            <TypographyP className="text-sm font-semibold dark:text-primary-black text-white">
              204.55 MAD
            </TypographyP>
          </div>
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm dark:text-primary-black text-white">
              Discount sales
            </TypographyP>
            <TypographyP className="text-sm dark:text-primary-black text-white">0.00 MAD</TypographyP>
          </div>
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm dark:text-primary-black text-white">
              Total sales tax
            </TypographyP>
            <TypographyP className="text-sm dark:text-primary-black text-white  ">20.00 MAD</TypographyP>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
