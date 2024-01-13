import React, { useState } from 'react'

const EditInventory = ({ close, onSuccess, data }) => {
  const [loading, setLoading] = useState(false)
  const [itemDetail, setItemDetail] = useState({
    ...data
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()

    if (
      itemDetail['name'] === "" ||
      itemDetail['price'] === 0 ||
      itemDetail['stock'] === 0 ||
      itemDetail['alert_stock'] === 0
    ) {
      alert("Please enter correct data")
      return
    }
    setLoading(true)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemDetail)
    };

    fetch('http://localhost:8081/update', options)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setLoading(false)
        onSuccess()
        close()
      })
      .catch(error => {
        alert("There was some error will editing data")
        setLoading(false)
      });

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
      <h1 className='text-xl font-bold mb-4'>Edit Item</h1>

      <form onSubmit={handleFormSubmit}>

        <p className='mb-1 text-sm '>Name</p>
        <input name='name' value={itemDetail['name']} onChange={handleSetFormData} className='shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline' type='text' placeholder='Enter Item Name...' />

        <p className='mb-1 text-sm '>Price </p>
        <input name='price' value={itemDetail['price']} onChange={handleSetFormData} className='shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline' type='number' placeholder='Enter Item Price...' />

        <p className='mb-1 text-sm '>Stock (Unit)</p>
        <input name='stock' value={itemDetail['stock']} onChange={handleSetFormData} className='shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline' type='number' placeholder='Enter Item Stock...' />

        <p className='mb-1 text-sm '>Alert (alert would be sent if it goes below it)</p>
        <input name='alert_stock' value={itemDetail['alert_stock']} onChange={handleSetFormData} className='shadow appearance-none border rounded w-full mb-4 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline' type='number' placeholder='Enter Alert Value...' />


        <div className='flex mt-2'>
          <button
            type='submit'
            className='h-max w-max font-bold rounded-sm px-3 py-2 text-white bg-[#fe100e] hover:cursor-pointer'
          >
            {
              loading ? "Submitting..." : "Submit"
            }
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

export default EditInventory