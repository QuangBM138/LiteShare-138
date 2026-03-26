const API_URL = "PLACEHOLDER_API_URL"; 
const apiKey = ""; 
const MAX_CHARS = 200000;

const TRANSLATIONS = {
    en: { loginTitle: "Login", loginSubtitle: "Enter email to access dashboard", sendCodeBtn: "Send Code", verifyBtn: "Login", backBtn: "Back", historyTitle: "My Links", logoutBtn: "Logout", createNewBtn: "+ Create Share", typeCol: "Type", expiresCol: "Expires", viewsCol: "Views", typeText: "📝 Text", typeCode: "💻 Code", 
    time10m: "10 Minutes", time30m: "30 Minutes", time1h: "1 Hour", time6h: "6 Hours", time12h: "12 Hours", 
    time1d: "1 Day", time3d: "3 Days", time1w: "1 Week", time2w: "2 Weeks", 
    time1mo: "1 Month", time3mo: "3 Months", time6mo: "6 Months", time1y: "1 Year", timeForever: "∞ Forever", timeCustom: "Custom Date...",
    saveShareBtn: "Create Link", successTitle: "Link Ready!", copyBtn: "Copy", expiresLabel: "Expires:", createAnotherBtn: "Create Another", sharedContentTitle: "Shared Content", createOwnBtn: "Create New Share", editBtn: "Edit", cancelBtn: "Cancel", saveBtn: "Save", linkExpiredTitle: "Link Expired", linkExpiredMsg: "This content is no longer available.", msgExpired: "Link Expired", msgUpdateSuccess: "Updated!", msgRenewSuccess: "Extended!", msgNotOwner: "Not authorized", processing: "Processing...", msgNoContent: "Content empty!", aiRefine: "Refine", aiExplain: "Explain", noData: "No history found.", msgInvalidDate: "Invalid expiration date!", limitTitle: "Limit Exceeded", limitMsg: "Content is too long (Max 200,000 chars).", dashboardMenu: "Dashboard", logoutMenu: "Logout" },
    
    vi: { loginTitle: "Đăng nhập", loginSubtitle: "Nhập email để vào Dashboard", sendCodeBtn: "Gửi Mã", verifyBtn: "Vào", backBtn: "Quay lại", historyTitle: "Link Của Tôi", logoutBtn: "Thoát", createNewBtn: "+ Tạo Link Mới", typeCol: "Loại", expiresCol: "Hết hạn", viewsCol: "Xem", typeText: "📝 Văn bản", typeCode: "💻 Code", 
    time10m: "10 Phút", time30m: "30 Phút", time1h: "1 Giờ", time6h: "6 Giờ", time12h: "12 Giờ", 
    time1d: "1 Ngày", time3d: "3 Ngày", time1w: "1 Tuần", time2w: "2 Tuần", 
    time1mo: "1 Tháng", time3mo: "3 Tháng", time6mo: "6 Tháng", time1y: "1 Năm", timeForever: "∞ Vĩnh viễn", timeCustom: "Tùy chọn ngày...",
    saveShareBtn: "Tạo Link", successTitle: "Đã Tạo Link!", copyBtn: "Sao Chép", expiresLabel: "Hết hạn:", createAnotherBtn: "Tạo Tiếp", sharedContentTitle: "Nội Dung", createOwnBtn: "Tạo Link Mới", editBtn: "Sửa", cancelBtn: "Hủy", saveBtn: "Lưu", linkExpiredTitle: "Link Hết Hạn", linkExpiredMsg: "Nội dung này không còn khả dụng.", msgExpired: "Link đã hết hạn", msgUpdateSuccess: "Đã cập nhật!", msgRenewSuccess: "Đã gia hạn!", msgNotOwner: "Không có quyền", processing: "Đang xử lý...", msgNoContent: "Nội dung trống!", aiRefine: "Sửa lỗi", aiExplain: "Giải thích", noData: "Chưa có dữ liệu.", msgInvalidDate: "Ngày hết hạn không hợp lệ!", limitTitle: "Quá Giới Hạn", limitMsg: "Nội dung quá dài (Tối đa 200,000 ký tự).", dashboardMenu: "Bảng điều khiển", logoutMenu: "Đăng xuất" }
};

const state = { 
    user: localStorage.getItem('ls_user'), 
    lang: localStorage.getItem('ls_lang') || 'en', 
    currentEmail: '', 
    currentShareId: null, 
    originalContent: '' 
};
