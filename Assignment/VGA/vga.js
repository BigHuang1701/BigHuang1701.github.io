document.addEventListener("DOMContentLoaded", function () {
  // Khai báo biến DOM trước
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

  // Hiển thị cart-overlay khi bấm vào icon giỏ hàng
  if (cartIcon) {
    cartIcon.addEventListener("click", function() {
      cartPanel.classList.add("open");
      cartOverlay.classList.add("show");
    });
  }

  // Hàm cập nhật tổng số lượng và tổng tiền
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

      // Kiểm tra sản phẩm đã có trong giỏ chưa
      let found = false;
      const cartItemList = cartItems.querySelectorAll('.cart-item');
      cartItemList.forEach(item => {
        const name = item.querySelector('p strong')?.innerText;
        const img = item.querySelector('img')?.src;
        if (name === productName && img === productImage) {
          // Đã có sản phẩm này, tăng số lượng
          const qtyValue = item.querySelector('.qty-value');
          let itemQty = parseInt(qtyValue.innerText);
          itemQty++;
          qtyValue.innerText = itemQty;
          found = true;
          // Gán lại sự kiện cho nút cộng/trừ
          const qtyMinus = item.querySelector('.qty-minus');
          const qtyPlus = item.querySelector('.qty-plus');
          qtyMinus.onclick = function() {
            let itemQty = parseInt(qtyValue.innerText);
            if (itemQty > 1) {
              itemQty--;
              qtyValue.innerText = itemQty;
              updateCartSummary();
            }
          };
          qtyPlus.onclick = function() {
            let itemQty = parseInt(qtyValue.innerText);
            itemQty++;
            qtyValue.innerText = itemQty;
            updateCartSummary();
          };
        }
      });
      if (!found) {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; gap:10px; align-items:center;">
              <img src="${productImage}" style="width:50px; height:auto;">
              <div>
                <p><strong>${productName}</strong></p>
                <p class="cart-item-price">${price.toLocaleString('vi-VN')}₫</p>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="cart-qty">
                    <button class="qty-minus" style="width:24px;">-</button>
                    <span class="qty-value">1</span>
                    <button class="qty-plus" style="width:24px;">+</button>
                  </div>
                  <button class="remove-item" style="background:none;border:none;color:black;font-size:15px;cursor:pointer;">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr>
        `;
        cartItems.appendChild(cartItem);

        const qtyValue = cartItem.querySelector('.qty-value');
        const qtyMinus = cartItem.querySelector('.qty-minus');
        const qtyPlus = cartItem.querySelector('.qty-plus');

        qtyMinus.addEventListener('click', () => {
          let itemQty = parseInt(qtyValue.innerText);
          if (itemQty > 1) {
            itemQty--;
            qtyValue.innerText = itemQty;
            updateCartSummary();
          }
        });

        qtyPlus.addEventListener('click', () => {
          let itemQty = parseInt(qtyValue.innerText);
          itemQty++;
          qtyValue.innerText = itemQty;
          updateCartSummary();
        });

        // Nút xoá
        const removeBtn = cartItem.querySelector(".remove-item");
        removeBtn.addEventListener("click", () => {
          cartItem.remove();
          updateCartSummary();
        });
      }
      updateCartSummary();
    });
  });

  // Đóng giỏ hàng
  closeCartBtn.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
  });

  // Click ra ngoài overlay để đóng giỏ
  cartOverlay.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
  });
});

// --- ĐỒNG BỘ LOGIC CATEGORY PANEL, OVERLAY, DROPDOWN ---
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
  const categoryPanelOverlay = document.getElementById('category-panel-overlay');
  const categoryPanelDropdownOverlay = document.getElementById('category-panel-dropdown-overlay');
  if (categoryPanel.style.right === '0px') {
    categoryPanel.style.right = '-320px';
    categoryPanel.style.boxShadow = '';
    if (categoryPanelOverlay) categoryPanelOverlay.classList.remove('active');
    if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.remove('active');
  } else {
    categoryPanel.style.right = '0px';
    categoryPanel.style.boxShadow = 'rgba(0,0,0,0.2) 0 0 16px';
    if (categoryPanelOverlay) categoryPanelOverlay.classList.add('active');
    if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.remove('active');
  }
};

// Đóng panel khi click vào overlay
const categoryPanelOverlay = document.getElementById('category-panel-overlay');
if (categoryPanelOverlay) {
  categoryPanelOverlay.addEventListener('click', function() {
    const categoryPanel = document.getElementById('category-list');
    categoryPanel.style.right = '-320px';
    categoryPanel.style.boxShadow = '';
    categoryPanelOverlay.classList.remove('active');
  });
}

// Dropdown Linh Kiện PC
const categoryDropdownItem = document.querySelector('nav.category-bar li.has-dropdown');
const categoryDropdown = categoryDropdownItem ? categoryDropdownItem.querySelector('.category-dropdown') : null;
const categoryPanelDropdownOverlay = document.getElementById('category-panel-dropdown-overlay');
function isMobile() {
  return window.innerWidth <= 768;
}
if (categoryDropdownItem && categoryDropdown) {
  if (isMobile()) {
    categoryDropdown.style.display = 'none';
    categoryDropdownItem.addEventListener('click', function(e) {
      e.stopPropagation();
      const categoryPanelOverlay = document.getElementById('category-panel-overlay');
      if (categoryDropdown.style.display === 'block') {
        categoryDropdown.style.display = 'none';
        categoryDropdownItem.classList.remove('open');
        if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.remove('active');
        if (categoryPanelOverlay) categoryPanelOverlay.classList.add('active');
      } else {
        categoryDropdown.style.display = 'block';
        categoryDropdownItem.classList.add('open');
        if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.add('active');
        if (categoryPanelOverlay) categoryPanelOverlay.classList.remove('active');
      }
    });
    document.addEventListener('click', function(e) {
      if (!categoryDropdownItem.contains(e.target)) {
        categoryDropdown.style.display = 'none';
        categoryDropdownItem.classList.remove('open');
        if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.remove('active');
      }
    });
  } else {
    // Desktop: hover để mở dropdown
    categoryDropdownItem.addEventListener('mouseenter', function() {
      categoryDropdown.style.display = 'block';
      categoryDropdownItem.classList.add('open');
    });
    categoryDropdownItem.addEventListener('mouseleave', function() {
      categoryDropdown.style.display = 'none';
      categoryDropdownItem.classList.remove('open');
    });
  }
}

