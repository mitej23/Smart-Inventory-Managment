import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import PlaceOrder from './PlaceOrder'

const Orders = () => {

  const [isPlaceOrder, setPlaceOrderOpen] = useState(false)
  const [orders, setOrders] = useState([])

  const handlePlaceOrder = () => {
    setPlaceOrderOpen(true)
  }

  const fetchData = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch('http://localhost:8081/getOrders', options)
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error(error));

  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <div className='flex justify-between mb-8'>
        <h1 className='text-xl font-bold'>Inventory</h1>
        <button
          onClick={handlePlaceOrder}
          className='h-max w-max font-bold rounded-md px-3 py-2 bg-[#ffebea] text-[#fe100e] hover:cursor-pointer'
        >
          Place Order
        </button>
      </div>
      <div className=' relative border sm:rounded-lg mb-4'>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-red-700 uppercase bg-red-100">
            <tr>
              <th scope="col" className="py-3 px-4 text-left">
                Order Id
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                Items
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {
              orders.map(({ order_id, order_items, total }, idx) => {
                return (
                  <tr key={idx}>
                    <td className="py-2 px-4 text-left text-black">
                      #{order_id}
                    </td>
                    <td className="py-2 px-4 text-center text-black">
                      {order_items.map(({ name, quantity }, index) => {
                        const isLastItem = index === order_items.length - 1;
                        return `${name} x ${quantity}${isLastItem ? '.' : ', '}`;
                      })}
                    </td>
                    <td className="py-2 px-4 text-right text-black">
                      ₹ {order_items.reduce((acc, { quantity, price }) => {
                        return acc + quantity * price;
                      }, 0)}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      {isPlaceOrder && <PlaceOrder close={() => setPlaceOrderOpen(false)} onSuccess={() => fetchData()} />}
    </Layout>
  )
}

export default Orders