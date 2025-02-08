type ToastType = "error" | "success" | "info" | "warning" | "default";

export const createToast = (
  title: string,
  message: string,
  type: ToastType = "error"
) => {
  const bgColorMap = {
    error: "bg-error-color",
    success: "bg-green-500",
    info: "bg-info-color",
    warning: "bg-yellow-500",
    default: "bg-gray-500",
  };

  return (
    <span className="flex flex-col gap-y-1 justify-start relative pl-1">
      <span
        className={`w-40 h-40 ${bgColorMap[type]} absolute -left-40 -top-10 blur-3xl opacity-30`}
      />
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs font-light dark:text-white/50 light:text-primary-black/50 leading-4">
        {message}
      </span>
    </span>
  );
};
