import { motion } from 'framer-motion'
import { useWaitingOrdersManagement } from '@/components/views/orders/hooks/useWaitingOrdersManagement'
import WaitingOrdersTable from '@/components/views/orders/components/WaitingOrdersTable'
import { BeatLoader } from 'react-spinners'
import Header from './components/Header'
import Footer from './components/Footer'

export default function WaitingOrders() {
  const { holdOrders, loading, loadWaitingOrders } = useWaitingOrdersManagement()

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', duration: 0.35 }}
      className="flex h-full w-[calc(100vw-80px)] flex-col overflow-hidden px-4 pt-8 sm:px-6"
    >
      <Header handleRefreshOrders={loadWaitingOrders} title="Waiting Orders" />
      <main className="mt-6 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <BeatLoader color="#fb0000" size={10} />
          </div>
        ) : (
          <WaitingOrdersTable data={holdOrders} />
        )}
      </main>
      <Footer ordersLength={holdOrders.length} />
    </motion.div>
  )
}
