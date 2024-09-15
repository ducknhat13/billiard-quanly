function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var validUsername = 'admin';
    var validPassword = '123';

    if (username === validUsername && password === validPassword) {
        // Lưu vai trò (nhân viên hoặc quản lý) vào localStorage
        localStorage.setItem('userRole', 'Nhân viên'); // Hoặc 'Quản lý' nếu là trang của quản lý
        
        // Chuyển hướng về trang chủ sau khi đăng nhập thành công
        window.location.href = '../html/trangchu.html'; // Quay về trang chủ sau khi đăng nhập
    } else {
        // Thông báo lỗi nếu đăng nhập sai
        alert('Tên đăng nhập hoặc mật khẩu không chính xác.');
    }
}
