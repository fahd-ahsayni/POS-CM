import { TypographySmall } from "@/components/ui/typography";
type ToastType = "default" | "glovo_new_order_created";

export default function createNewOrderReceivedNotification(
  orderCode: any,
  image: any,
  type: ToastType
) {
  // Compute baseUrl dynamically
  const baseUrl = localStorage.getItem("ipAddress") || window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;

  const bgColorMap = {
    glovo_new_order_created: "bg-yellow-600",
    default: "bg-gray-500",
  };

  return (
    <span className="relative flex items-center justify-start">
      <span
        className={`w-40 h-40 ${bgColorMap[type]} absolute -left-40 -top-10 blur-3xl opacity-30`}
      />

      <div className="flex items-center justify-start relative">
        <div className="h-9 w-10 rounded-md bg-yellow-600 overflow-hidden relative flex items-center justify-center">
          <img
            className="size-full object-cover absolute rounded-md"
            src={`${baseUrl}${image}`}
            alt={type}
            crossOrigin="anonymous"
          />
        </div>
        <TypographySmall className="ml-3 text-sm">
          A new order has arrived!{" "}
          <span className="font-bold">{orderCode}</span>
        </TypographySmall>
      </div>
    </span>
  );
}
