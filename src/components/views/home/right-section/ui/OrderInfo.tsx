import { TypographyH3 } from "@/components/ui/typography";

export const orderInfo = (orderType: string) => {
  switch (orderType) {
    case "takeaway":
      return (
        <div>
          <TypographyH3>Takeaway</TypographyH3>
        </div>
      );
    case "delivery":
      return;
    case "on_place":
      return <div>On place</div>;
    default:
      return null;
  }
};
