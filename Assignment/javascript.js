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