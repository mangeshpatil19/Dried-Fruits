document.addEventListener('DOMContentLoaded', () => {
  // Fetch existing cart data from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Ensure cart is an array
  if (!Array.isArray(cart)) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  const cartTable = document.getElementById("cartTableBody");
  const totalPrice = document.getElementById("totalPrice");

  if (cart.length === 0) {
    cartTable.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Your cart is empty.</td></tr>";
    if (totalPrice) totalPrice.textContent = "$0.00";
    return;
  }

  let total = 0;

  // Clear table first in case this runs multiple times
  if (cartTable) cartTable.innerHTML = "";

  // Add each item to the cart table
  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    // Image
    const imageTd = document.createElement("td");
    const img = document.createElement("img");
    img.src = item.image || "https://via.placeholder.com/100";
    img.alt = item.name || "Product Image";
    img.classList.add("product-image");
    img.style.width = "80px";
    imageTd.appendChild(img);

    // Name
    const nameTd = document.createElement("td");
    nameTd.textContent = item.name;

    // Quantity
    const qtyTd = document.createElement("td");
    
    // Create quantity controls
    const qtyControls = document.createElement("div");
    qtyControls.classList.add("quantity-controls");
    
    const decreaseBtn = document.createElement("button");
    decreaseBtn.textContent = "-";
    decreaseBtn.classList.add("qty-btn", "decrease");
    decreaseBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
        updateCartDisplay();
      }
    });
    
    const qtyDisplay = document.createElement("span");
    qtyDisplay.textContent = item.quantity;
    qtyDisplay.classList.add("qty-display");
    
    const increaseBtn = document.createElement("button");
    increaseBtn.textContent = "+";
    increaseBtn.classList.add("qty-btn", "increase");
    increaseBtn.addEventListener("click", () => {
      item.quantity++;
      updateCartDisplay();
    });
    
    qtyControls.appendChild(decreaseBtn);
    qtyControls.appendChild(qtyDisplay);
    qtyControls.appendChild(increaseBtn);
    
    qtyTd.appendChild(qtyControls);

    // Price
    const priceTd = document.createElement("td");
    priceTd.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

    // Remove Button
    const removeTd = document.createElement("td");
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => {
      // Remove this item from cart
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartDisplay();
    });
    removeTd.appendChild(removeBtn);

    // Append all
    row.appendChild(imageTd);
    row.appendChild(nameTd);
    row.appendChild(qtyTd);
    row.appendChild(priceTd);
    row.appendChild(removeTd);

    cartTable.appendChild(row);

    total += item.price * item.quantity;
  });

  if (totalPrice) totalPrice.textContent = `$${total.toFixed(2)}`;

  // Function to update the cart display after quantity changes
  function updateCartDisplay() {
    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Reload the page to refresh the cart display
    // Alternative: recursively rebuild the table without reloading
    location.reload();
  }

  // Handle payment
  const form = document.getElementById('payment-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const method = form.payment.value;
      alert(`Order placed using ${method.toUpperCase()}!`);
      localStorage.removeItem('cart');
      window.location.href = 'index.html';
    });
  }

  // Checkout button handler
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checkout.");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }
});