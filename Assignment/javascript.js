const userIcon = document.getElementById('user-icon');
const dropdown = document.getElementById('user-dropdown');

// Bật tắt dropdown khi click vào icon
userIcon.addEventListener('click', function (e) {
  e.stopPropagation(); // Ngăn click lan ra ngoài
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Ẩn dropdown khi click ra ngoài
window.addEventListener('click', function () {
  dropdown.style.display = 'none';
});

        // Category panel slide-in for mobile
        function handleCategoryPanel() {
          const toggleBtn = document.getElementById('category-toggle');
          const categoryPanel = document.getElementById('category-list');
          if (window.innerWidth <= 768) {
            toggleBtn.style.display = 'block';
            categoryPanel.classList.add('category-panel');
            categoryPanel.style.right = '-320px';
          } else {
            toggleBtn.style.display = 'none';
            categoryPanel.classList.remove('category-panel');
            categoryPanel.style.right = '';
            categoryPanel.style.boxShadow = '';
          }
        }
        window.addEventListener('resize', handleCategoryPanel);
        window.addEventListener('DOMContentLoaded', handleCategoryPanel);
        document.getElementById('category-toggle').onclick = function() {
          const categoryPanel = document.getElementById('category-list');
          if (categoryPanel.style.right === '0px') {
            categoryPanel.style.right = '-320px';
            categoryPanel.style.boxShadow = '';
          } else {
            categoryPanel.style.right = '0px';
            categoryPanel.style.boxShadow = 'rgba(0,0,0,0.2) 0 0 16px';
          }
        };
    
      // Nhúng header
  //    fetch('layout/header.html')
  //      .then(res => res.text())
  //      .then(data => document.getElementById('header').innerHTML = data);

      // Nhúng footer
  //    fetch('layout/footer.html')
  //      .then(res => res.text())
  //      .then(data => document.getElementById('footer').innerHTML = data);

document.addEventListener('DOMContentLoaded', function() {
  var linhKienPC = document.querySelector('nav.category-bar li.has-dropdown');
  var dropdown = linhKienPC.querySelector('.category-dropdown');
  linhKienPC.addEventListener('mouseenter', function() {
    dropdown.style.display = 'block';
  });
  linhKienPC.addEventListener('mouseleave', function() {
    dropdown.style.display = 'none';
  });
  linhKienPC.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '/Assignment/component/component.html') {
      window.location.href = '/Assignment/component/component.html';
    }
    // Nếu click vào mục con, chuyển hướng sang file khác nếu có
    if (e.target.parentElement.classList.contains('category-dropdown')) {
      // Ví dụ: chuyển hướng sang file khác
      // window.location.href = '/Assignment/component/vga.html';
    }
  });
});

function renderCartFromStorage() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartBadge = document.getElementById("cart-badge");
  const cartTotal = document.getElementById("cart-total").querySelector("strong");
  cartItems.innerHTML = "";
  let totalQty = 0;
  let totalAmount = 0;
  const cartList = JSON.parse(localStorage.getItem('cartList') || '[]');
  cartList.forEach(product => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <div style=\"display:flex; justify-content:space-between; align-items:center;\">
        <div style=\"display:flex; gap:10px; align-items:center;\">
          <img src=\"${product.image}\" style=\"width:50px; height:auto;\">
          <div>
            <p><strong>${product.name}</strong></p>
            <p class=\"cart-item-price\">${product.price.toLocaleString('vi-VN')}₫</p>
            <div style=\"display:flex; align-items:center; gap:8px;\">
              <div class=\"cart-qty\">
                <button class=\"qty-minus\" style=\"width:24px;\">-</button>
                <span class=\"qty-value\">${product.qty}</span>
                <button class=\"qty-plus\" style=\"width:24px;\">+</button>
              </div>
              <button class=\"remove-item\" style=\"background:none;border:none;color:black;font-size:15px;cursor:pointer;\">
                <i class=\"fas fa-trash\"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr>
    `;
    cartItems.appendChild(cartItem);
    totalQty += product.qty;
    totalAmount += product.price * product.qty;
    // Sự kiện tăng/giảm/xóa
    const qtyValue = cartItem.querySelector('.qty-value');
    const qtyMinus = cartItem.querySelector('.qty-minus');
    const qtyPlus = cartItem.querySelector('.qty-plus');
    qtyMinus.addEventListener('click', () => {
      if (product.qty > 1) {
        product.qty--;
        qtyValue.innerText = product.qty;
        saveCartList(cartList);
        renderCartFromStorage();
      }
    });
    qtyPlus.addEventListener('click', () => {
      product.qty++;
      qtyValue.innerText = product.qty;
      saveCartList(cartList);
      renderCartFromStorage();
    });
    cartItem.querySelector('.remove-item').addEventListener('click', () => {
      const idx = cartList.findIndex(p => p.name === product.name && p.image === product.image);
      if (idx !== -1) {
        cartList.splice(idx, 1);
        saveCartList(cartList);
        renderCartFromStorage();
      }
    });
  });
  cartCount.innerText = totalQty;
  cartBadge.innerText = totalQty;
  localStorage.setItem('cartQty', totalQty);
  cartTotal.innerText = totalAmount.toLocaleString("vi-VN") + "₫";
}
function saveCartList(cartList) {
  localStorage.setItem('cartList', JSON.stringify(cartList));
}
document.addEventListener("DOMContentLoaded", function () {
  // Cart panel localStorage logic
  const cartPanel = document.getElementById("cart-panel");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCartBtn = document.getElementById("close-cart");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartBadge = document.getElementById("cart-badge");
  const savedQty = localStorage.getItem('cartQty');
  if (savedQty) {
    cartBadge.innerText = savedQty;
    cartCount.innerText = savedQty;
  }
  const cartTotal = document.getElementById("cart-total").querySelector("strong");
  const cartIcon = document.getElementById("cart-icon");

  // Show cart overlay when clicking cart icon
  if (cartIcon) {
    cartIcon.addEventListener("click", function() {
      cartPanel.classList.add("open");
      cartOverlay.classList.add("show");
    });
  }

  // Update cart summary
  function updateCartSummary() {
    let totalQty = 0;
    let totalAmount = 0;
    cartItems.querySelectorAll('.cart-item').forEach(item => {
      const qty = parseInt(item.querySelector('.qty-value').innerText);
      const price = parseInt(item.querySelector('.cart-item-price').innerText.replace(/\D/g, ""));
      totalQty += qty;
      totalAmount += price * qty;
    });
    cartCount.innerText = totalQty;
    cartBadge.innerText = totalQty;
    localStorage.setItem('cartQty', totalQty);
    cartTotal.innerText = totalAmount.toLocaleString("vi-VN") + "₫";
  }

  addToCartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      cartPanel.classList.add("open");
      cartOverlay.classList.add("show");
      const productCard = btn.closest(".product-card");
      const productName = productCard.querySelector(".name")?.innerText || "Sản phẩm";
      const productPriceText = productCard.querySelector(".price")?.innerText || "0₫";
      const productImage = productCard.querySelector("img")?.src;
      const price = parseInt(productPriceText.replace(/\D/g, ""));
      let cartList = JSON.parse(localStorage.getItem('cartList') || '[]');
      let found = false;
      cartList.forEach(product => {
        if (product.name === productName && product.image === productImage) {
          product.qty++;
          found = true;
        }
      });
      if (!found) {
        cartList.push({ name: productName, price: price, image: productImage, qty: 1 });
      }
      saveCartList(cartList);
      renderCartFromStorage();
    });
  });

  // Render cart from localStorage
  renderCartFromStorage();

  // Close cart
  closeCartBtn.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
  });

  // Click outside overlay to close cart
  cartOverlay.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
  });
});