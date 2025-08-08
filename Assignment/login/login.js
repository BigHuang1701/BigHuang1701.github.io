// login.js: Handles validation for login and register forms

document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.querySelector('form');
    if (loginForm && document.title.includes('Đăng nhập')) {
        loginForm.addEventListener('submit', function(e) {
            const username = loginForm.querySelector('input[type="text"]');
            const password = loginForm.querySelector('input[type="password"]');
            let valid = true;
            clearErrors(loginForm);
            if (!username.value.trim()) {
                showError(username, 'Vui lòng nhập tên đăng nhập.');
                valid = false;
            }
            if (!password.value.trim()) {
                showError(password, 'Vui lòng nhập mật khẩu.');
                valid = false;
            }
            if (!valid) {
                e.preventDefault();
            } else {
                e.preventDefault();
                // Kiểm tra tài khoản trong localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const found = users.find(u => u.username === username.value.trim() && u.password === password.value);
                if (found) {
                    localStorage.setItem('currentUser', found.username);
                    window.location.href = '/Assignment/index.html';
                } else {
                    showError(password, 'Tên đăng nhập hoặc mật khẩu không đúng!');
                }
            }
        });
    }

    // Register form validation
    if (loginForm && document.title.includes('Đăng ký')) {
        loginForm.addEventListener('submit', function(e) {
            const username = loginForm.querySelector('input[type="text"]');
            const email = loginForm.querySelector('input[type="email"]');
            const password = loginForm.querySelector('input[type="password"]');
            const confirmPassword = loginForm.querySelectorAll('input[type="password"]')[1];
            let valid = true;
            clearErrors(loginForm);
            if (!username.value.trim()) {
                showError(username, 'Vui lòng nhập tên người dùng.');
                valid = false;
            }
            if (!email.value.trim() || !validateEmail(email.value)) {
                showError(email, 'Vui lòng nhập email hợp lệ.');
                valid = false;
            }
            if (!password.value.trim()) {
                showError(password, 'Vui lòng nhập mật khẩu.');
                valid = false;
            }
            if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Mật khẩu xác nhận không khớp.');
                valid = false;
            }
            // Kiểm tra trùng tên đăng nhập
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.username === username.value.trim())) {
                showError(username, 'Tên đăng nhập đã tồn tại!');
                valid = false;
            }
            if (!valid) {
                e.preventDefault();
            } else {
                e.preventDefault();
                // Lưu tài khoản vào localStorage
                users.push({
                    username: username.value.trim(),
                    email: email.value.trim(),
                    password: password.value
                });
                localStorage.setItem('users', JSON.stringify(users));
                window.location.href = 'login.html';
            }
        });
    }

    function showError(input, message) {
        let error = document.createElement('div');
        error.className = 'form-error';
        error.textContent = message;
        input.parentNode.insertBefore(error, input.nextSibling);
        input.classList.add('input-error');
    }
    function clearErrors(form) {
        form.querySelectorAll('.form-error').forEach(e => e.remove());
        form.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
    }
    function validateEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }
});
