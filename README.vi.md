⚡ LiteShare - Hệ Thống Chia Sẻ Dữ Liệu Bảo Mật (Serverless)

LiteShare (trước đây là QuickShare) là một ứng dụng web đơn giản, nhanh chóng và bảo mật cho phép chia sẻ văn bản, mã nguồn (code) và ghi chú. Dự án hoạt động theo mô hình Serverless, sử dụng Google Sheets làm cơ sở dữ liệu và Google Apps Script làm Backend API, giúp tiết kiệm chi phí và dễ dàng triển khai.

🚀 Tính Năng Nổi Bật

📝 Chia sẻ Đa dạng: Hỗ trợ văn bản thuần (Text) và Mã nguồn (Code) với font Monospace.

🔒 Bảo mật cao:

Đăng nhập qua Email với mã OTP (One-Time Password).

Dữ liệu được mã hóa (Base64) trước khi lưu trữ.

Chỉ chủ sở hữu mới có quyền chỉnh sửa nội dung đã chia sẻ.

⏳ Tự hủy liên kết: Tùy chọn thời gian hết hạn từ 10 phút đến Vĩnh viễn.

🌍 Đa ngôn ngữ: Hỗ trợ Tiếng Anh (EN) và Tiếng Việt (VN).

📱 Giao diện hiện đại: Tối ưu cho cả Mobile và Desktop (Responsive), hỗ trợ Dark Mode.

QR Code: Tự động tạo mã QR để chia sẻ nhanh trên điện thoại.

🛠️ Công Nghệ Sử Dụng

Frontend: HTML5, CSS3, JavaScript (Vanilla - Không dùng Framework nặng).

Backend: Google Apps Script (GAS).

Database: Google Sheets.

Hosting: GitHub Pages.

CI/CD: GitHub Actions (Để bảo mật API URL).

⚙️ Hướng Dẫn Cài Đặt (Deployment)

Phần 1: Cấu hình Backend (Google Apps Script)

Tạo một Google Sheet mới.

Vào Tiện ích mở rộng (Extensions) > Apps Script.

Copy toàn bộ nội dung file Code.gs vào trình soạn thảo.

Chạy hàm setupSheet() một lần để khởi tạo các Sheet (Database, Auth).

Nhấn Deploy (Triển khai) > New deployment.

Type: Web App.

Execute as: Me (Tôi).

Who has access: Anyone (Bất kỳ ai).

Copy Web App URL (kết thúc bằng /exec). Lưu ý: Giữ bí mật link này.

Phần 2: Cấu hình Frontend (GitHub)

Tạo một Repository mới trên GitHub (Public hoặc Private đều được, nhưng khuyên dùng Private nếu muốn giấu code kỹ hơn).

Upload file index.html vào thư mục gốc.

Lưu ý: Trong file index.html, hãy đảm bảo dòng const API_URL = "PLACEHOLDER_API_URL"; được giữ nguyên (không điền link thật vào đây).

Tạo file Workflow để deploy tự động:

Đường dẫn: .github/workflows/deploy.yml

Nội dung: Copy từ file deploy.yml trong dự án.

Phần 3: Bảo mật API Key & Deploy

Để tránh lộ API URL của Google Script, chúng ta sử dụng GitHub Secrets:

Vào tab Settings của Repository trên GitHub.

Chọn Secrets and variables > Actions.

Nhấn New repository secret.

Name: APPS_SCRIPT_URL

Value: Dán cái Web App URL bạn đã copy ở Phần 1 vào đây.

Nhấn Add secret.

Sau khi cấu hình xong, mỗi khi bạn push code lên nhánh main, GitHub Actions sẽ:

Tự động thay thế chữ PLACEHOLDER_API_URL thành link thật của bạn.

Deploy trang web lên GitHub Pages.

📖 Hướng Dẫn Sử Dụng

Đăng nhập (Tùy chọn): Nhập email để nhận mã OTP. Đăng nhập giúp bạn quản lý lịch sử các link đã tạo và chỉnh sửa chúng sau này.

Tạo Share:

Chọn loại nội dung (Text/Code).

Chọn thời gian hết hạn.

Nhập nội dung và nhấn Save & Create Link.

Chia sẻ: Copy link hoặc quét mã QR gửi cho bạn bè.

Chỉnh sửa: Truy cập lại link cũ (khi đã đăng nhập đúng tài khoản tạo), nút Edit sẽ hiện ra.

🛡️ Cơ Chế Bảo Mật

Rate Limiting: Backend tự động chặn spam nếu một người dùng gửi quá nhiều yêu cầu trong thời gian ngắn.

Validation: Kiểm tra độ dài nội dung để tránh làm tràn bộ nhớ Google Sheet.

No Hardcode Secrets: API URL không bao giờ được lưu trực tiếp trong mã nguồn trên GitHub.

🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo Pull Request hoặc mở Issue nếu bạn tìm thấy lỗi.

Dự án được xây dựng cho mục đích học tập và chia sẻ cá nhân.