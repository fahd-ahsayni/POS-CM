import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbItemType {
  _id: string;
  name: string;
  isLast?: boolean;
  onClick?: () => void;
}
interface BreadcrumbProps {
  items: BreadcrumbItemType[];
}
export function CustomBreadcrumb({ items }: BreadcrumbProps) {
  if (!items?.length) return null;

  const showEllipsis = items.length > 3;
  const visibleItems =
    items.length === 1
      ? [{ _id: "subcategories", name: "Subcategories", isLast: true }]
      : showEllipsis
      ? [...items.slice(0, 1), ...items.slice(-2)]
      : items;

  return (
    <nav aria-label="breadcrumb" className="relative z-10 bg-background pr-4 flex items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          {visibleItems.map((item, index) => (
            <React.Fragment key={item._id + index}>
              <BreadcrumbItem className="text-sm">
                {item.isLast ? (
                  <BreadcrumbPage className="font-medium">
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    to="#"
                    onClick={item.onClick}
                    className="cursor-pointer hover:text-primary font-medium transition-colors"
                  >
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && <BreadcrumbSeparator className="text-red-600" />}
              {showEllipsis && index === 0 && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-red-600" />
                </>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
