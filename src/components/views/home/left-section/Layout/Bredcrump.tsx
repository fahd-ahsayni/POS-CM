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

  const modifiedItems = [...items];
  if (modifiedItems[0]) {
    modifiedItems[0] = { ...modifiedItems[0], name: "Subcategories" };
  }

  const showEllipsis = modifiedItems.length > 3;
  const visibleItems = showEllipsis
    ? [modifiedItems[0], ...modifiedItems.slice(-2)]
    : modifiedItems;

  return (
    <nav aria-label="breadcrumb" className="relative z-10 pr-4 flex items-center justify-center">
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
                    className="cursor-pointer hover:text-primary font-medium transition-colors capitalize"
                  >
                    {item.name.toLowerCase()}
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
