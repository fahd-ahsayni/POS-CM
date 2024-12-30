import { memo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useWaitingOrders } from '../hooks/useWaitingOrders'
import { ArrowDownAZ, ArrowUpAZ, SortDesc } from 'lucide-react'
import { useLeftViewContext } from '../../home/left-section/contexts/leftViewContext'
import { useRightViewContext } from '../../home/right-section/contexts/rightViewContext'
import { useNavigate } from 'react-router-dom'
import { ORDER_SUMMARY_VIEW } from '../../home/right-section/constants'
import { handleRowClick } from '../config/waiting-table-config'
import { currency } from '@/preferences'

interface Header {
  key: string
  label: string
  width: string
  isTextMuted?: boolean
  isPrice?: boolean
}

interface WaitingOrder {
  [key: string]: any;  // Index signature to allow string keys
  _id: string;
  dateTime: string;
  orderedBy: string;
  orderType: string;
  orderTotal: number;
}

interface WaitingOrdersTableProps {
  headers: Header[]
  data: WaitingOrder[]
  caption?: string
}

const WaitingOrdersTable = ({ headers, data }: WaitingOrdersTableProps) => {
  const { sortedData, sortConfig, handleSort } = useWaitingOrders<WaitingOrder>({ data })
  const { setSelectedProducts } = useLeftViewContext()
  const { setViews, setCustomerIndex, setSelectedCustomer } = useRightViewContext()
  const navigate = useNavigate()

  const handleOrderClick = (item: any) => {
    handleRowClick(
      item,
      setSelectedProducts,
      setCustomerIndex,
      setSelectedCustomer
    )
    navigate('/')
    setViews(ORDER_SUMMARY_VIEW)
  }

  const renderSortIcon = (headerKey: string) => {
    if (sortConfig?.key !== headerKey) {
      return <SortDesc className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
    }
    return sortConfig.direction === 'ascending' ? (
      <ArrowUpAZ className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
    ) : (
      <ArrowDownAZ className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
    )
  }

  return (
    <div className="rounded-md h-full relative overflow-y-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-white dark:bg-secondary-black">
          <TableRow>
            {headers.map((header) => (
              <TableHead
                key={header.key}
                className="cursor-pointer"
                style={{ width: header.width }}
                onClick={() => handleSort(header.key)}
              >
                <div className="flex items-center justify-between">
                  {header.label}
                  {renderSortIcon(header.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <TableRow
                key={item._id || index}
                onClick={() => handleOrderClick(item)}
                className="cursor-pointer hover:bg-white/70 dark:hover:bg-white/5"
              >
                {headers.map((header) => (
                  <TableCell
                    key={`${item._id || index}-${header.key}`}
                    className={`${header.isTextMuted ? 'text-muted-foreground' : ''} 
                              ${header.isPrice ? 'text-right' : ''}`}
                  >
                    {header.isPrice ? (
                      <span>
                        {(Number(item[header.key]) || 0).toFixed(currency.toFixed ?? 2)} Dhs
                      </span>
                    ) : (
                      item[header.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center">
                No waiting orders available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default memo(WaitingOrdersTable)