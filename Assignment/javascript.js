// Payment modal logic for index.html
document.addEventListener('DOMContentLoaded', function() {
  // Profile popup logic
  function createProfileModal() {
    if (document.getElementById('profile-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'profile-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.4)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '99999';
    modal.innerHTML = `
      <div style="background:#fff;padding:32px 24px 24px 24px;border-radius:10px;min-width:320px;max-width:90vw;position:relative;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
        <span id="profile-modal-close" style="position:absolute;top:12px;right:16px;font-size:28px;color:#888;cursor:pointer;font-weight:bold;">&times;</span>
        <h2 style="margin-bottom:18px;">Thông tin cá nhân</h2>
        <form id="profile-form">
          <div style="margin-bottom:12px;text-align:left;">
            <label for="profile-fullname" style="font-weight:500;">Họ và tên:</label><br>
            <input id="profile-fullname" name="fullname" type="text" style="width:100%;padding:8px 10px;margin-top:4px;border-radius:5px;border:1px solid #ccc;">
          </div>
          <div style="margin-bottom:12px;text-align:left;">
            <label for="profile-email" style="font-weight:500;">Email:</label><br>
            <input id="profile-email" name="email" type="email" style="width:100%;padding:8px 10px;margin-top:4px;border-radius:5px;border:1px solid #ccc;">
          </div>
          <div style="margin-bottom:12px;text-align:left;">
            <label for="profile-phone" style="font-weight:500;">Số điện thoại:</label><br>
            <input id="profile-phone" name="phone" type="text" style="width:100%;padding:8px 10px;margin-top:4px;border-radius:5px;border:1px solid #ccc;">
          </div>
          <button type="submit" style="background:#f7ca18;color:#222;font-weight:bold;border:none;border-radius:6px;padding:10px 32px;font-size:16px;cursor:pointer;">Lưu thông tin</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('profile-modal-close').onclick = function() {
      modal.remove();
    };
    document.getElementById('profile-form').onsubmit = function(e) {
      e.preventDefault();
      const fullname = document.getElementById('profile-fullname').value.trim();
      const email = document.getElementById('profile-email').value.trim();
      const phone = document.getElementById('profile-phone').value.trim();
      let currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        let profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
        profiles[currentUser] = { fullname, email, phone };
        localStorage.setItem('profiles', JSON.stringify(profiles));
        alert('Đã lưu thông tin cá nhân!');
        modal.remove();
      }
    };
    // Luôn lấy thông tin mới nhất khi mở popup
    function fillProfileForm() {
      let currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        let profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
        let info = profiles[currentUser] || {};
        document.getElementById('profile-fullname').value = info.fullname || '';
        document.getElementById('profile-email').value = info.email || '';
        document.getElementById('profile-phone').value = info.phone || '';
      }
    }
    fillProfileForm();
    // Nếu modal chưa bị remove, khi click lại nút profile sẽ gọi lại createProfileModal, nên luôn fill lại form
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });
  }
  // Hiển thị Xin chào! <tên tài khoản> nếu đã đăng nhập
  function showWelcomeUser() {
    const infoIcon = document.querySelector('.info-icon .icons');
    let currentUser = localStorage.getItem('currentUser');
    const userIcon = document.getElementById('user-icon');
    if (infoIcon && currentUser) {
      // Xóa nếu đã có
      let welcome = document.getElementById('welcome-user');
      if (welcome) welcome.remove();
      welcome = document.createElement('span');
      welcome.id = 'welcome-user';
      welcome.style.marginRight = '12px';
      welcome.style.fontWeight = '500';
      welcome.style.color = '#111';
      welcome.textContent = 'Xin chào! ' + currentUser + ' ';
      // Nút profile
      let profileBtn = document.createElement('button');
      profileBtn.textContent = 'Profile';
      profileBtn.style.marginLeft = '8px';
      profileBtn.style.background = '#eee';
      profileBtn.style.border = '1px solid #bbb';
      profileBtn.style.borderRadius = '4px';
      profileBtn.style.padding = '2px 10px';
      profileBtn.style.fontSize = '14px';
      profileBtn.style.cursor = 'pointer';
      profileBtn.onclick = function() {
        createProfileModal();
      };
      // Nút đăng xuất
      let logoutBtn = document.createElement('button');
      logoutBtn.textContent = 'Đăng xuất';
      logoutBtn.style.marginLeft = '8px';
      logoutBtn.style.background = '#eee';
      logoutBtn.style.border = '1px solid #bbb';
      logoutBtn.style.borderRadius = '4px';
      logoutBtn.style.padding = '2px 10px';
      logoutBtn.style.fontSize = '14px';
      logoutBtn.style.cursor = 'pointer';
      logoutBtn.onclick = function() {
        localStorage.removeItem('currentUser');
        window.location.reload();
      };
      welcome.appendChild(profileBtn);
      welcome.appendChild(logoutBtn);
      infoIcon.insertBefore(welcome, infoIcon.firstChild);
      // Ẩn icon user
      if (userIcon) userIcon.style.display = 'none';
    } else if (userIcon) {
      userIcon.style.display = '';
      let welcome = document.getElementById('welcome-user');
      if (welcome) welcome.remove();
    }
  }
  showWelcomeUser();
  var checkoutBtn = document.getElementById('checkout-btn');
  var paymentModal = document.getElementById('payment-modal');
  var paymentModalClose = document.getElementById('payment-modal-close');
  var paymentModalOk = document.getElementById('payment-modal-ok');
  if (checkoutBtn && paymentModal) {
    checkoutBtn.addEventListener('click', function() {
      // Render cart items and total in modal
      var cartList = JSON.parse(localStorage.getItem('cartList') || '[]');
      var cartListDiv = document.getElementById('payment-cart-list');
      var totalDiv = document.getElementById('payment-total');
      if (cartListDiv && totalDiv) {
        cartListDiv.innerHTML = '';
        let total = 0;
        if (cartList.length === 0) {
          cartListDiv.innerHTML = '<em>Không có sản phẩm trong giỏ hàng.</em>';
        } else {
          cartList.forEach(function(item) {
            var itemDiv = document.createElement('div');
            itemDiv.style.display = 'flex';
            itemDiv.style.alignItems = 'center';
            itemDiv.style.marginBottom = '8px';
            itemDiv.innerHTML =
              '<img src="' + item.image + '" alt="' + item.name + '" style="width:36px;height:36px;object-fit:cover;border-radius:4px;margin-right:10px;">' +
              '<span style="flex:1;">' + item.name + ' <span style="color:#888;font-size:13px;">x' + item.qty + '</span></span>' +
              '<span style="font-weight:500;min-width:80px;text-align:right;">' + (item.price * item.qty).toLocaleString('vi-VN') + '₫</span>';
            cartListDiv.appendChild(itemDiv);
            total += item.price * item.qty;
          });
        }
        totalDiv.textContent = total.toLocaleString('vi-VN') + '₫';
      }
      paymentModal.classList.add('active');
    });
  }
  if (paymentModalClose && paymentModal) {
    paymentModalClose.addEventListener('click', function() {
      paymentModal.classList.remove('active');
    });
  }
  if (paymentModalOk && paymentModal) {
    paymentModalOk.addEventListener('click', function() {
      paymentModal.classList.remove('active');
      // Xử lý thanh toán thực tế có thể thêm ở đây
    });
  }
  // Optional: close modal when clicking outside content
  if (paymentModal) {
    paymentModal.addEventListener('click', function(e) {
      if (e.target === paymentModal) {
        paymentModal.classList.remove('active');
      }
    });
  }
});
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
          } else {
            toggleBtn.style.display = 'none';
            categoryPanel.classList.remove('active');
          }
        }
        window.addEventListener('resize', handleCategoryPanel);
        window.addEventListener('DOMContentLoaded', handleCategoryPanel);
        document.getElementById('category-toggle').onclick = function() {
          const categoryPanel = document.getElementById('category-list');
          const categoryPanelOverlay = document.getElementById('category-panel-overlay');
          const categoryPanelDropdownOverlay = document.getElementById('category-panel-dropdown-overlay');
          const isActive = categoryPanel.classList.contains('active');
          if (isActive) {
            categoryPanel.classList.remove('active');
            if (categoryPanelOverlay) categoryPanelOverlay.classList.remove('active');
            if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.remove('active');
          } else {
            categoryPanel.classList.add('active');
            if (categoryPanelOverlay) categoryPanelOverlay.classList.add('active');
            if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.remove('active');
          }
        };

        // Đóng panel khi click vào overlay
        document.addEventListener('DOMContentLoaded', function() {
          const categoryPanel = document.getElementById('category-list');
          const categoryPanelOverlay = document.getElementById('category-panel-overlay');
          if (categoryPanelOverlay) {
            categoryPanelOverlay.addEventListener('click', function() {
              categoryPanel.style.right = '-320px';
              categoryPanel.style.boxShadow = '';
              categoryPanelOverlay.classList.remove('active');
            });
          }
        });

document.addEventListener('DOMContentLoaded', function() {
  const categoryDropdownItem = document.querySelector('nav.category-bar li.has-dropdown');
  const categoryDropdown = categoryDropdownItem ? categoryDropdownItem.querySelector('.category-dropdown') : null;
  const categoryDropdownOverlay = document.getElementById('category-bar-overlay');
  const categoryPanelDropdownOverlay = document.getElementById('category-panel-dropdown-overlay');
  console.log('[DEBUG] categoryDropdownItem:', categoryDropdownItem);
  console.log('[DEBUG] categoryDropdown:', categoryDropdown);
  console.log('[DEBUG] categoryDropdownOverlay:', categoryDropdownOverlay);

  function isMobile() {
    return window.innerWidth <= 768;
  }

  if (categoryDropdownItem && categoryDropdown) {
    if (isMobile()) {
      // Trên mobile: click mới hiện dropdown, mặc định ẩn
      categoryDropdown.style.display = 'none';
      categoryDropdownItem.addEventListener('click', function(e) {
        e.stopPropagation();
        // Toggle dropdown
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
      // Ẩn dropdown khi click ra ngoài
      document.addEventListener('click', function(e) {
        if (!categoryDropdownItem.contains(e.target)) {
          categoryDropdown.style.display = 'none';
          categoryDropdownItem.classList.remove('open');
          if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.remove('active');
          const categoryPanelOverlay = document.getElementById('category-panel-overlay');
          if (categoryPanelOverlay && document.getElementById('category-list').style.right === '0px') {
            categoryPanelOverlay.classList.add('active');
          }
        }
      });
      // Ẩn dropdown khi click vào overlay
      if (categoryPanelDropdownOverlay) {
        categoryPanelDropdownOverlay.addEventListener('click', function() {
          categoryDropdown.style.display = 'none';
          categoryDropdownItem.classList.remove('open');
          categoryPanelDropdownOverlay.classList.remove('active');
          const categoryPanelOverlay = document.getElementById('category-panel-overlay');
          if (categoryPanelOverlay && document.getElementById('category-list').style.right === '0px') {
            categoryPanelOverlay.classList.add('active');
          }
        });
      }
    } else {
      // Trên desktop: hover mới hiện dropdown
      categoryDropdown.style.display = 'none';
      categoryDropdownItem.addEventListener('mouseenter', function() {
        categoryDropdown.style.display = 'block';
      });
      categoryDropdownItem.addEventListener('mouseleave', function() {
        categoryDropdown.style.display = 'none';
      });
      if (categoryPanelDropdownOverlay) categoryPanelDropdownOverlay.classList.remove('active');
    }
  }

  // Điều chỉnh lại khi resize
  window.addEventListener('resize', function() {
    if (categoryDropdownItem && categoryDropdown) {
      categoryDropdown.style.display = 'none';
      categoryDropdownItem.classList.remove('open');
      if (categoryDropdownOverlay) categoryDropdownOverlay.classList.remove('active');
    }
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