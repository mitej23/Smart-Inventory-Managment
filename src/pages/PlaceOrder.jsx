import React, { useEffect, useState } from 'react'

const PlaceOrder = ({ close, onSuccess }) => {
  const [itemsInStore, setItemsInStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("")
  const [selectedItemName, setSelectedItemName] = useState("")
  const [quantity, setQuantity] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    total: 0,
    order_items: [],
  });

  const sendPlaceOrderReq = (data) => {
    setLoading(true)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

    fetch('http://localhost:8081/placeorder', options)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setLoading(false)
        onSuccess()
        close()
      })
      .catch(error => {
        alert("There was some error will adding data")
        setLoading(false)
      });
  }


  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      // You may want to add some validation logic here
      return;
    }

    const newOrderItems = selectedItems.map((selectedItem) => {
      const item = itemsInStore.find((item) => item.id === selectedItem.id);
      return {
        item_id: selectedItem.id,
        name: selectedItem.name,
        quantity: selectedItem.quantity,
        price: item ? item.price : 0,
      };
    });

    const updatedOrderItems = [...orderDetails.order_items, ...newOrderItems];

    const updatedTotal = updatedOrderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    console.log({
      ...orderDetails,
      order_items: updatedOrderItems,
      total: updatedTotal,
    })

    sendPlaceOrderReq({
      ...orderDetails,
      order_items: updatedOrderItems,
      total: updatedTotal,
    })

  };

  const handleAddToOrder = () => {
    if (!selectedItem || quantity <= 0) {
      // You may want to add some validation logic here
      return;
    }

    const newItem = {
      id: selectedItem,
      quantity: quantity,
      name: selectedItemName
    };

    setSelectedItems((prevSelectedItems) => {
      // Calculate the new total
      const new_data = [...prevSelectedItems, newItem]
      const newTotal = new_data.reduce((total, item) => {
        const storeItem = itemsInStore.find((storeItem) => storeItem.id === item.id);
        return total + item.quantity * (storeItem ? storeItem.price : 0);
      }, 0);

      // Update the total in orderDetails
      setOrderDetails((prevOrderDetails) => ({
        ...prevOrderDetails,
        total: newTotal,
      }));

      return new_data

    });

    // Clear the selected item and quantity for the next selection
    setSelectedItem('');
    setQuantity(1);
    setSelectedItemName("")

  };

  const fetchItemsInStore = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch('http://localhost:8081/list', options)
      .then(response => response.json())
      .then(data => setItemsInStore(data))
      .catch(error => console.error(error));
  }

  useEffect(() => {
    fetchItemsInStore()
  }, [])

  const renderDropdownOptions = () => {
    // Filter items that are not already selected
    const availableItems = itemsInStore.filter(
      (item) => !selectedItems.some((selectedItem) => selectedItem.id === item.id)
    );

    return availableItems.map((item) => (
      <option key={item.id} value={`${item.id}---${item.name}`}>
        {item.name}
      </option>
    ));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedItems = selectedItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    const newTotal = updatedItems.reduce((total, item) => {
      const storeItem = itemsInStore.find((storeItem) => storeItem.id === item.id);
      console.log(storeItem)
      return total + item.quantity * (storeItem ? storeItem.price : 0);
    }, 0);

    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      total: newTotal,
    }));

    setSelectedItems(updatedItems);
  };



  return (
    <div className='absolute bg-white shadow-md p-6 border rounded-md w-[60%] max-w-[40rem] max top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <h1 className='text-xl font-bold mb-4'>Place Order</h1>

      <form onSubmit={handleFormSubmit}>

        <div className='flex justify-between'>
          <div className='flex items-center mb-2'>
            <label htmlFor='itemDropdown' className='mr-2'>
              Select Item:
            </label>
            {console.log(selectedItem + "---" + selectedItemName)}
            <select
              id='itemDropdown'
              value={selectedItem + "---" + selectedItemName === "---" ? '' : (selectedItem + "---" + selectedItemName)}
              onChange={(e) => {
                let d = (e.target.value).split('---');
                setSelectedItem(d[0])
                setSelectedItemName(d[1])
              }}
              className='border rounded-md p-1'
            >
              <option value='' disabled>
                Select an item
              </option>
              {renderDropdownOptions()}
            </select>
          </div>

          <div className='flex items-center mb-2'>
            <label htmlFor='quantityInput' className='mr-2'>
              Quantity:
            </label>
            <input
              type='number'
              id='quantityInput'
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className='border rounded-md p-1 w-16 text-center'
            />
          </div>

          <div className='flex items-center mb-2'>
            <button
              type='button'
              onClick={handleAddToOrder}
              className='h-max w-max text-sm font-semibold rounded-sm px-3 py-2 text-white bg-[#fe100e] hover:cursor-pointer'
            >
              Add to Order
            </button>
          </div>
        </div>

        <div className='mb-4'>
          <h2 className='text-lg font-bold mb-2'>Selected Items:</h2>
          <ul>
            {selectedItems.map((item) => (
              <li key={item.id} className='mb-2'>
                {itemsInStore.find((storeItem) => storeItem.id === item.id)?.name} - <input
                  type='number'
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                  className='border rounded-md p-1 w-16 text-center mx-2'
                />
              </li>
            ))}
          </ul>
        </div>
        <p className='text-lg'><span className='font-bold'>Total:</span> ₹{orderDetails.total}</p>
        <div className='flex mt-2'>
          <button
            type='submit'
            className='h-max w-max font-bold rounded-sm px-3 py-2 text-white bg-[#fe100e] hover:cursor-pointer'
          >
            {
              loading ? "Placing..." : "Place"
            }
          </button>
          <button
            type='button'
            onClick={() => close()}
            className='h-max w-max font-bold rounded-sm px-3 py-2 ml-4 border border-[#fe100e] text-[#fe100e]  hover:cursor-pointer'
          >
            Close
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder