# Thiệp sinh nhật (mẫu)

Mở `index.html` trong trình duyệt để xem tấm thiệp.

Tùy chỉnh:
- Đổi chữ trong `index.html` (thẻ `.header`, `.subtitle`, `.note`, `.footer`).
- Thay avatar SVG bằng ảnh thật: thay phần SVG trong `index.html` bằng `<img src="your-photo.jpg" alt="avatar" class="avatar">` và đặt file ảnh cùng thư mục.

Chạy nhanh (terminal):
```
xdg-open index.html
```

Muốn xuất PNG: chụp ảnh màn hình hoặc dùng công cụ in -> Save as PDF/PNG.

Chức năng mới:
- Bấm `Chọn ảnh` để upload ảnh avatar (hiển thị ngay trên thiệp).
- Bấm `Tải xuống PNG` để xuất tấm thiệp hiện tại thành file `thiệp-sinh-nhat.png`.

Lưu ý:
- Tính năng tải xuống sử dụng thư viện `html2canvas` (đã được đính kèm qua CDN). Nếu trình duyệt chặn tải xuống, bật quyền cho tab hoặc thử trên trình duyệt khác.

Ảnh mặc định:
- Nếu bạn muốn người yêu mở trang là thấy luôn ảnh của bạn, hãy đặt file ảnh tên `avatar.jpg` vào thư mục `assets/` trong repo. Trang sẽ tự load `/assets/avatar.jpg` khi mở; nếu file không tồn tại thì sẽ hiển thị hình SVG mặc định.

Ví dụ tạo thư mục và chép ảnh (terminal):
```bash
mkdir -p /workspaces/nguy-n-v-n-ninh-/assets
cp /đường/dẫn/đến/anh-cua-ban.jpg /workspaces/nguy-n-v-n-ninh-/assets/avatar.jpg
```

Thêm nhạc nền:
- Đặt file nhạc tên `music.mp3` (MP3) vào `assets/`.
- Khi trang mở, nó sẽ tự load `assets/music.mp3`. Do trình duyệt có thể chặn autoplay, nên tôi đã thêm nút nhỏ để bật/tắt nhạc ở góc phải.

Ví dụ copy file nhạc:
```bash
cp /đường/dẫn/đến/nhac.mp3 /workspaces/nguy-n-v-n-ninh-/assets/music.mp3
```
