
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
