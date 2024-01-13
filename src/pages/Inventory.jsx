import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import AddInventory from './AddInventory'
import EditInventory from './EditInventory'


const Inventory = () => {
  const [isAddOpen, setAddOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState()
  const [items, setItems] = useState([])

  const handleAddItem = () => {
    setAddOpen(true)
  }

  const fetchData = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch('http://localhost:8081/list', options)
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error(error));

  }

  const handleEditData = (idx) => {
    setEditOpen(true)
    setEditData(items[idx])
  }

  const handleDeleteData = (idx) => {

  }


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout>
      <div className='flex justify-between mb-8'>
        <h1 className='text-xl font-bold'>Inventory</h1>
        <button
          onClick={handleAddItem}
          className='h-max w-max font-bold rounded-md px-3 py-2 bg-[#ffebea] text-[#fe100e] hover:cursor-pointer'
        >
          Add Item
        </button>
      </div>

      <div className=' relative border sm:rounded-lg mb-4'>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-red-700 uppercase bg-red-100">
            <tr>
              <th scope="col" className="py-3 px-4 text-center">
                Sr No.
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                Item Name
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                Item Price (Per Unit)
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                Stock
              </th>
              <th scope="col" className="py-3 px-4 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {
              items.map(({ name, price, stock }, idx) => {
                return (
                  <tr key={idx}>
                    <td className="py-2 px-4 text-center text-black">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-4 text-center text-black">
                      {name}
                    </td>
                    <td className="py-2 px-4 text-center text-black">
                      ₹ {price}
                    </td>
                    <td className="py-2 px-4 text-center text-black">
                      {stock}
                    </td>
                    <td className='py-3 px-6 flex justify-center'>
                      <svg onClick={() => handleEditData(idx)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-4 hover:mt-[-2px] hover:cursor-pointer ">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                      {/* <svg onClick={() => handleDeleteData(idx)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-4 hover:mt-[-2px] hover:cursor-pointer text-red-600">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg> */}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      {isAddOpen && <AddInventory close={() => setAddOpen(false)} onSuccess={() => fetchData()} />}
      {isEditOpen && <EditInventory close={() => setEditOpen(false)} onSuccess={() => fetchData()} data={editData} />}
    </Layout>
  )
}

export default Inventory