// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Sticky navbar on scroll
window.addEventListener('scroll', function () {
  const nav = document.querySelector('nav');
  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
});

// Slider functionality
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  const slides = document.getElementsByClassName("testimonial-slide");
  const dots = document.getElementsByClassName("dot");

  if (slides.length === 0 || dots.length === 0) return;

  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  slides[slideIndex - 1].classList.add("active");
  dots[slideIndex - 1].classList.add("active");
}

// Global cart counter
let cartTotalCount = 0;

// Function to update the cart icon badge
function updateCartIconCount(count) {
  const cartIcon = document.querySelector('.icons .fa-shopping-cart');

  // Ensure the cart icon exists
  if (!cartIcon) return;

  // Check if count badge exists already
  let existingBadge = cartIcon.querySelector('.cart-count');
  if (!existingBadge) {
    // Create badge if it doesn't exist
    const badge = document.createElement('span');
    badge.classList.add('cart-count');
    badge.style.position = 'absolute';
    badge.style.top = '0px';
    badge.style.right = '-5px';
    badge.style.background = 'red';
    badge.style.color = 'white';
    badge.style.borderRadius = '50%';
    badge.style.padding = '2px 6px';
    badge.style.fontSize = '12px';
    badge.style.fontWeight = 'bold';
    badge.innerText = count;
    cartIcon.style.position = 'relative'; // Ensure parent is positioned
    cartIcon.appendChild(badge);
  } else {
    // Update existing badge with the new count
    existingBadge.innerText = count;
  }
}

// Function to update cart - with image support
function updateCart(name, price, quantity, productId, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Ensure cart is an array
  if (!Array.isArray(cart)) {
    cart = [];
  }

  // Find if product with the same productId already exists in the cart
  const productIndex = cart.findIndex(item => item.id === productId);

  if (productIndex !== -1) {
    // If product exists, update its quantity
    cart[productIndex].quantity += quantity;
  } else {
    // If product doesn't exist, add it to the cart
    cart.push({ 
      id: productId, 
      name: name, 
      price: price, 
      quantity: quantity,
      image: image
    });
  }

  // Save the updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the cart icon counter
  cartTotalCount += quantity;
  updateCartIconCount(cartTotalCount);

  // Show an alert that the product has been added or updated
  alert(`${name} has been added to your cart.`);
}

// Initialize cart functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize cart count from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (Array.isArray(cart)) {
    cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartIconCount(cartTotalCount);
  }

  // Setup product cards
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach(card => {
    const name = card.querySelector(".product-name").textContent;
    const priceText = card.querySelector(".product-price").textContent;
    const price = parseInt(priceText.replace(/[^\d]/g, "")); // Extract number from price text
    const productId = card.getAttribute("data-id");
    const imageSrc = card.querySelector("img")?.src || "https://via.placeholder.com/100";
    
    // Match the cart-btn class that exists in the HTML
    const addToCartBtn = card.querySelector(".cart-btn");
    
    // Add click event to the "Add to Cart" button
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        // Default quantity is 1
        const quantityToAdd = 1;
        updateCart(name, price, quantityToAdd, productId, imageSrc);
      });
    }
  });

  // Cart icon click handler
  const cartIcon = document.querySelector(".fa-shopping-cart");
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }
});