import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { AppDispatch } from "@/store";
import { setCurrentPage } from "@/store/slices/data/ordersSlice";
import { useDispatch, useSelector } from "react-redux";

export function TablePagination({ itemsLength }: { itemsLength: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const currentPage = useSelector((state: any) => state.orders.currentPage);
  const pageSize = useSelector((state: any) => state.orders.pageSize);
  const totalPages = Math.ceil(itemsLength / pageSize);

  const handlePrevious = () => {
    if (currentPage > 0) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  const handlePageClick = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => {
          if (
            index === 0 ||
            index === totalPages - 1 ||
            (index >= currentPage - 1 && index <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  className="text-white"
                  isActive={index === currentPage}
                  onClick={() => handlePageClick(index)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            );
          }
          if (
            (index === currentPage - 2 && currentPage > 2) ||
            (index === currentPage + 2 && currentPage < totalPages - 3)
          ) {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return null;
        })}
        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
