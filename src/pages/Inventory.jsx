import React, { useState } from 'react'
import Layout from './Layout'

const AddItem = ({ close }) => {

  const [itemDetail, setItemDetail] = useState({
    name: "",
    price: 0,
    stock: 0
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()

    console.log(itemDetail)

  }

  const handleSetFormData = (e) => {
    let value = e.target.value

    let data = {
      ...itemDetail,
      [e.target.name]: value
    }
    setItemDetail(data)
  }


  const handleClose = () => {
    close()
  }

  return (
    <div className='absolute bg-white shadow-md p-6 border rounded-md w-[60%] max-w-[40rem] max top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <h1 className='text-xl font-bold mb-4'>Add Item</h1>

      <form onSubmit={handleFormSubmit}>

        <p className='mb-1 text-sm '>Name</p>
        <input name='name' value={itemDetail['name']} onChange={handleSetFormData} className='shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline' type='text' placeholder='Enter Item Name...' />

        <p className='mb-1 text-sm '>Price </p>
        <input name='price' value={itemDetail['price']} onChange={handleSetFormData} className='shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline' type='number' placeholder='Enter Item Price...' />

        <p className='mb-1 text-sm '>Stock (Per Unit)</p>
        <input name='stock' value={itemDetail['stock']} onChange={handleSetFormData} className='shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline' type='number' placeholder='Enter Item Stock...' />


        <div className='flex mt-2'>
          <button
            type='submit'
            className='h-max w-max font-bold rounded-sm px-3 py-2 text-white bg-[#fe100e] hover:cursor-pointer'
          >
            Submit
          </button>
          <button
            type='button'
            onClick={handleClose}
            className='h-max w-max font-bold rounded-sm px-3 py-2 ml-4 border border-[#fe100e] text-[#fe100e]  hover:cursor-pointer'
          >
            Close
          </button>
        </div>
      </form>



    </div>
  )
}

const Inventory = () => {
  const [isAddOpen, setAddOpen] = useState(false)
  const [items, setItems] = useState([
    {
      name: "Banana",
      price: 23,
      stock: 46
    },
    {
      name: "Banana",
      price: 23,
      stock: 46
    },
    {
      name: "Banana",
      price: 23,
      stock: 46
    },
    {
      name: "Banana",
      price: 23,
      stock: 46
    }

  ])

  const handleAddItem = () => {
    setAddOpen(true)
  }

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
            </tr>
          </thead>
          <tbody>
            {
              items.map(({ name, price, stock }, idx) => {
                return (
                  <tr>
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
                  </tr>

                )
              })
            }
          </tbody>
        </table>
      </div>
      {isAddOpen && <AddItem close={() => setAddOpen(false)} />}
    </Layout>
  )
}

export default Inventory