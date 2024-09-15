// Kiểm tra và cập nhật vai trò trong ô NAS
function updateRole() {
    const userRole = localStorage.getItem('userRole'); // Lấy vai trò từ localStorage
    const nasRoleElement = document.getElementById('nasRole');

    if (userRole) {
        nasRoleElement.textContent = userRole; // Cập nhật vai trò trong ô NAS
    }
}

// Chuyển hướng đến trang đăng nhập dựa trên loại tài khoản
function redirectToLogin() {
    const accountType = document.getElementById('accountType').value;
    if (accountType === 'nhanvien') {
        window.location.href = '../html/nhanvien-log.html'; // Trang đăng nhập nhân viên
    } else if (accountType === 'quanly') {
        window.location.href = '../html/quanly-log.html'; // Trang đăng nhập quản lý
    }
}

// Gọi hàm updateRole khi trang tải lên
window.onload = updateRole;

// Hiển thị nội dung tương ứng khi nhấp vào một mục trong phần aside
document.querySelectorAll('.content aside ul li').forEach((li, index) => {
    li.addEventListener('click', () => {
        // Ẩn tất cả các nội dung của article
        document.querySelectorAll('.article-content').forEach(content => {
            content.style.display = 'none';
        });

        // Hiển thị nội dung tương ứng với mục được nhấp vào
        const contentId = ['content-standard', 'content-smoke', 'content-vip'][index];
        document.getElementById(contentId).style.display = 'grid';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tables = document.querySelectorAll('.table-item a');
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupInfo = document.getElementById('popup-info');
    const amountText = document.getElementById('amount-to-pay');
    const closeButton = document.querySelector('.popup .close');
    const bookButton = document.getElementById('book-table');
    const payButton = document.getElementById('pay');

    let timers = {}; // Để lưu thông tin thời gian và số tiền cho từng bàn
    let activeTableName = null;

    // Giá tiền cho mỗi giây ở các phòng
    const roomPrices = {
        'standard': 14,
        'smoke': 20,
        'vip': 25 // Sửa giá tiền cho phòng V.I.P
    };

    // Xử lý sự kiện click cho từng bàn
    tables.forEach(table => {
        table.addEventListener('click', (event) => {
            event.preventDefault();

            // Lấy thông tin tên bàn và phòng từ thuộc tính data
            const tableName = table.getAttribute('data-name');
            const tableRoom = table.getAttribute('data-room');
            
            // Lấy bàn từ HTML để cập nhật màu sắc
            const tableItem = table.closest('.table-item');

            // Xác định tên phòng dựa trên giá trị data-room
            const roomNames = {
                'standard': 'Standard',
                'smoke': 'Smoke',
                'vip': 'VIP'
            };
            const roomName = roomNames[tableRoom] || 'Unknown';

            // Cập nhật nội dung của cửa sổ pop-up
            popupTitle.textContent = `Thông tin ${tableName}`;
            popupInfo.textContent = `Tên bàn: ${tableName}\nPhòng: ${roomName}`;

            // Hiển thị cửa sổ pop-up
            popup.style.display = 'flex';

            // Hiển thị số tiền cần thanh toán nếu có
            if (timers[tableName]) {
                amountText.style.display = 'block';
                amountText.textContent = `Số tiền cần thanh toán: ${timers[tableName].amount} đồng`;
            } else {
                amountText.style.display = 'none';
            }

            // Đặt màu mặc định cho bàn và cập nhật thông tin thời gian
            tableItem.classList.remove('booked');
            tableItem.classList.remove('paid');

            // Cập nhật biến activeTableName
            activeTableName = tableName;
        });
    });

    // Đóng cửa sổ pop-up khi nhấp vào nút đóng
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Đóng cửa sổ pop-up nếu nhấp ra ngoài
    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Xử lý nút "Đặt bàn"
    bookButton.addEventListener('click', () => {
        if (activeTableName) {
            const tableItem = document.querySelector(`.table-item a[data-name="${activeTableName}"]`).closest('.table-item');
            const tableRoom = document.querySelector(`.table-item a[data-name="${activeTableName}"]`).getAttribute('data-room');
            const pricePerSecond = roomPrices[tableRoom] || 0;

            tableItem.classList.add('booked');
            tableItem.classList.remove('paid');
            
            // Khởi tạo hoặc cập nhật dữ liệu thời gian và số tiền
            timers[activeTableName] = {
                startTime: new Date(),
                pricePerSecond: pricePerSecond,
                amount: 0
            };

            // Cập nhật bộ đếm thời gian
            updateTimer();
        }
    });

    // Xử lý nút "Thanh toán"
    payButton.addEventListener('click', () => {
        if (activeTableName) {
            const tableItem = document.querySelector(`.table-item a[data-name="${activeTableName}"]`).closest('.table-item');
            
            tableItem.classList.remove('booked');
            tableItem.classList.add('paid');

            // Tính toán số tiền cần thanh toán
            const tableInfo = timers[activeTableName];
            if (tableInfo) {
                const elapsedTime = Math.floor((new Date() - tableInfo.startTime) / 1000);
                const amount = tableInfo.pricePerSecond * elapsedTime;
                tableInfo.amount = amount;

                // Cập nhật số tiền cần thanh toán
                amountText.style.display = 'block';
                amountText.textContent = `Số tiền cần thanh toán: ${amount} đồng`;

                // Xóa dữ liệu khi thanh toán xong
                delete timers[activeTableName];
            }
        }
    });

    // Cập nhật bộ đếm thời gian
    function updateTimer() {
        if (activeTableName && timers[activeTableName]) {
            const tableInfo = timers[activeTableName];
            const elapsedTime = Math.floor((new Date() - tableInfo.startTime) / 1000);
            tableInfo.amount = tableInfo.pricePerSecond * elapsedTime;

            // Cập nhật số tiền cần thanh toán
            amountText.style.display = 'block';
            amountText.textContent = `Số tiền cần thanh toán: ${tableInfo.amount} đồng`;

            // Tiếp tục cập nhật sau mỗi giây
            setTimeout(updateTimer, 1000);
        }
    }
});




