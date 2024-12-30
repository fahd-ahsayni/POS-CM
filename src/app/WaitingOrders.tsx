import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import WaitingOrdersTable from '@/components/views/orders/components/WaitingOrdersTable'
import { WAITING_TABLE_HEADERS } from '@/components/views/orders/config/waiting-table-config'
import { formatData } from '@/components/views/orders/config/waiting-table-config'
import Header from './components/Header'
import Footer from './components/Footer'

export default function WaitingOrders() {
  const [holdOrders, setHoldOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('holdOrders') || '[]')
    const posData = {
      data: {
        pos: JSON.parse(localStorage.getItem('pos') || '[]')
      }
    }
    const formattedOrders = storedOrders.map((order: any) => formatData(order, posData))
    setHoldOrders(formattedOrders)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', duration: 0.35 }}
      className="flex h-full w-[calc(100vw-80px)] flex-col overflow-hidden px-4 pt-8 sm:px-6"
    >
      <Header handleRefreshOrders={() => {}} title="Waiting Orders" />
      <main className="mt-6 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <BeatLoader color="#fb0000" size={10} />
          </div>
        ) : (
          <WaitingOrdersTable
            headers={WAITING_TABLE_HEADERS}
            data={holdOrders}
            caption="A list of your waiting orders."
          />
        )}
      </main>
      <Footer ordersLength={holdOrders.length} />
    </motion.div>
  )
}
