// Fetch stock items from the server //
const fetchStockItems = async () => {
    try {
      const response = await axios.get('https://crudcrud.com/api/fefdf22a44c84c2799613b078f69b1de/stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching stock items:', error);
      return [];
    }
  };
  
  // Render stock items in the list //
  const renderStockItems = (stockItems) => {
    const itemList = document.querySelector('#items');
    itemList.innerHTML = '';
  
    stockItems.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.innerHTML = `
        <strong>${item.candy_name}</strong> - ${item.description}, Price: ${item.price}, Quantity: <span id="quantity-${item._id}">${item.quantity}</span>
        <button class="btn btn-primary btn-sm buy-btn" data-id="${item._id}" data-quantity="1">Buy One</button>
        <button class="btn btn-primary btn-sm buy-btn" data-id="${item._id}" data-quantity="2">Buy Two</button>
        <button class="btn btn-primary btn-sm buy-btn" data-id="${item._id}" data-quantity="3">Buy Three</button>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${item._id}">Delete</button>
      `;
      itemList.appendChild(listItem);
    });
  };
  
  // Add a new stock item //
  const addItem = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#candy-name').value;
    const description = document.querySelector('#description').value;
    const price = parseFloat(document.querySelector('#price').value);
    const quantity = parseInt(document.querySelector('#quantity').value);
  
    const newItem = {
      candy_name: name,
      description,
      price,
      quantity
    };
  
    try {
      await axios.post('https://crudcrud.com/api/fefdf22a44c84c2799613b078f69b1de/stock', newItem);
      document.querySelector('#add-item-form').reset();
      const stockItems = await fetchStockItems();
      renderStockItems(stockItems);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  
  // Buy button event listener //
  document.querySelector('#items').addEventListener('click', async (event) => {
    if (event.target.classList.contains('buy-btn')) {
      const itemId = event.target.getAttribute('data-id');
      const quantity = parseInt(event.target.getAttribute('data-quantity'));
      try {
        const stockItems = await fetchStockItems();
        const selectedItem = stockItems.find(item => item._id === itemId);
  
        if (selectedItem) {
          const newQuantity = selectedItem.quantity - quantity;
          if (newQuantity >= 0) {
            await axios.put(`https://crudcrud.com/api/fefdf22a44c84c2799613b078f69b1de/stock/${itemId}`, { quantity: newQuantity });
            document.querySelector(`#quantity-${itemId}`).textContent = newQuantity;
          } else {
            console.log("Insufficient quantity!");
          }
        } else {
          console.log("Item not found!");
        }
      } catch (error) {
        console.error('Error updating item quantity:', error);
      }
    }
  });
  
  // Delete button event listener //
  document.querySelector('#items').addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const itemId = event.target.getAttribute('data-id');
      try {
        await axios.delete(`https://crudcrud.com/api/fefdf22a44c84c2799613b078f69b1de/stock/${itemId}`);
        const stockItems = await fetchStockItems();
        renderStockItems(stockItems);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  });
  
  // Initial setup when the page loads //
  document.addEventListener('DOMContentLoaded', async () => {
    const stockItems = await fetchStockItems();
    renderStockItems(stockItems);
  });
  
  // Form submission event listener //
  document.querySelector('#add-item-form').addEventListener('submit', addItem);
  