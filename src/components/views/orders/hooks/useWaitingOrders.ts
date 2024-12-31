import { WaitingOrder } from '@/types/waitingOrders';
import { WaitingTableData } from '../config/waiting-table-config';
import { useState, useMemo } from 'react'

interface SortConfig {
  key: string
  direction: 'ascending' | 'descending'
}

interface UseWaitingOrdersProps<T> {
  data: T[]
  defaultSort?: SortConfig
}

export function useWaitingOrders<T>({
  data,
  defaultSort
}: UseWaitingOrdersProps<T>) {
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

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? ''
  }

  const extractOrderNumber = (ref: string) => {
    const match = ref?.match(/^(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }

  const sortedData = useMemo(() => {
    const tableData: WaitingTableData[] = (data as WaitingOrder[]).map(order => ({
      _id: order._id,
      createdAt: order.createdAt,
      'created_by.name': order.created_by.name,
      'order_type_id.type': order.order_type_id.type,
      total_amount: order.total_amount
    }));

    if (sortConfig) {
      tableData.sort((a, b) => {
        let aValue = getNestedValue(a, sortConfig.key)
        let bValue = getNestedValue(b, sortConfig.key)

        if (sortConfig.key === 'ref') {
          const aNum = extractOrderNumber(aValue)
          const bNum = extractOrderNumber(bValue)
          return sortConfig.direction === 'ascending' 
            ? aNum - bNum
            : bNum - aNum
        }

        if (sortConfig.key === 'total_amount') {
          return sortConfig.direction === 'ascending' 
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue)
        }

        if (sortConfig.key === 'createdAt') {
          return sortConfig.direction === 'ascending'
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime()
        }

        // Default string comparison
        const comparison = String(aValue).localeCompare(String(bValue))
        return sortConfig.direction === 'ascending' ? comparison : -comparison
      })
    }

    return tableData
  }, [data, sortConfig])

  return {
    sortedData,
    sortConfig,
    handleSort,
  }
}