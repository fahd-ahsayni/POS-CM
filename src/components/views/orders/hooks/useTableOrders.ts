import { useState, useMemo } from 'react'
import { FilterCriteria } from '@/types'

interface SortConfig {
  key: string
  direction: 'ascending' | 'descending'
}

interface UseTableOrdersProps<T> {
  data: T[]
  filterCriteria: FilterCriteria
  defaultSort?: SortConfig
}

export function useTableOrders<T>({
  data,
  filterCriteria,
  defaultSort
}: UseTableOrdersProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort || null)

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev?.key === key && prev.direction === 'ascending'
          ? 'descending'
          : 'ascending',
    }))
  }

  const sortedData = useMemo(() => {
    let filtered = [...data]
    
    // Apply filters
    if (filterCriteria) {
      filtered = filtered.filter(item => {
        const matchesEmployee =
          !filterCriteria.employee ||
          (item as any).created_by?.name?.toLowerCase().includes(filterCriteria.employee.toLowerCase())

        const matchesOrderType =
          !filterCriteria.orderType ||
          (item as any).order_type_id?.type?.toLowerCase() === filterCriteria.orderType.toLowerCase()

        const matchesStatus =
          !filterCriteria.status ||
          (item as any).status?.toLowerCase() === filterCriteria.status.toLowerCase()

        return matchesEmployee && matchesOrderType && matchesStatus
      })
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const { key, direction } = sortConfig
        const comparison = (a as any)[key] < (b as any)[key] ? -1 : (a as any)[key] > (b as any)[key] ? 1 : 0
        return direction === 'ascending' ? comparison : -comparison
      })
    }

    return filtered
  }, [data, filterCriteria, sortConfig])

  return {
    sortedData,
    sortConfig,
    handleSort,
  }
}