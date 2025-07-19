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