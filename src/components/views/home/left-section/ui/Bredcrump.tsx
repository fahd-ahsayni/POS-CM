import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { toTitleCase } from "@/functions/string-transforms";
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
    <nav aria-label="breadcrumb" className="relative z-10 pr-4 flex-shrink-0">
      <Breadcrumb>
        <BreadcrumbList className="flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide">
          {visibleItems.map((item, index) => (
            <React.Fragment key={item._id + index}>
              <BreadcrumbItem className="text-sm flex-shrink-0">
                {item.isLast ? (
                  <BreadcrumbPage className="font-medium line-clamp-2">
                    {toTitleCase(item.name.toLowerCase())}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    to="#"
                    onClick={item.onClick}
                    className="cursor-pointer hover:text-primary font-medium transition-colors line-clamp-2"
                  >
                    {toTitleCase(item.name.toLowerCase())}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && (
                <BreadcrumbSeparator className="text-red-600 flex-shrink-0" />
              )}
              {showEllipsis && index === 0 && (
                <>
                  <BreadcrumbItem className="flex-shrink-0">
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-red-600 flex-shrink-0" />
                </>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
