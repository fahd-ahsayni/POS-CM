import React, { useEffect } from "react";
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

export function TablePagination() {
  const dispatch = useDispatch<AppDispatch>();
  const currentPage = useSelector((state: any) => state.orders.currentPage);
  const pageSize = useSelector((state: any) => state.orders.pageSize);
  const filteredDataLength = useSelector((state: any) => state.orders.filteredDataLength);

  const totalPages = Math.ceil(filteredDataLength / pageSize);

  // Reset to first page when itemsLength changes (i.e., when filters are applied)
  useEffect(() => {
    dispatch(setCurrentPage(0));
  }, [filteredDataLength, dispatch]);

  // Ensure current page is valid when total pages changes
  useEffect(() => {
    if (currentPage >= totalPages) {
      dispatch(setCurrentPage(Math.max(0, totalPages - 1)));
    }
  }, [totalPages, currentPage, dispatch]);

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

  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={handlePrevious}
            className={currentPage === 0 ? 'pointer-events-none opacity-50' : ''}
          />
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
          <PaginationNext 
            onClick={handleNext}
            className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
