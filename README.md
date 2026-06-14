# time-is

Chrome Extension (Manifest V3) hiển thị một **đồng hồ nổi `HH:MM:ss`** trên mọi trang web.
Kéo thả được, mặc định nằm góc phải trên, bật/tắt bằng cách click icon extension.

## Tính năng
- Đồng hồ 24h `HH:MM:ss` lấy theo giờ máy tính, cập nhật mỗi giây.
- Kéo thả tới vị trí bất kỳ; vị trí được ghi nhớ (`chrome.storage.local`).
- **Lăn chuột (scroll) trên đồng hồ để tăng/giảm cỡ chữ** (10–48px); cỡ chữ được ghi nhớ và đồng bộ giữa các tab.
- Click icon extension để ẩn/hiện trên tất cả các tab.
- Style cô lập bằng **Shadow DOM** nên không bị CSS của trang web làm vỡ.

## Cài đặt (chế độ developer)
1. Mở `chrome://extensions`.
2. Bật **Developer mode** (góc phải trên).
3. Bấm **Load unpacked** và chọn thư mục này.
4. Mở một trang web bất kỳ — đồng hồ xuất hiện ở góc phải trên. Click icon để ẩn/hiện.

> Lưu ý: Chrome chặn extension chạy trên các trang nội bộ như `chrome://...` và Chrome Web Store, nên đồng hồ sẽ không hiện ở đó.

## Cấu trúc
```
manifest.json      Manifest V3, content script chạy trên <all_urls>
background.js      Service worker: click icon -> đảo trạng thái ẩn/hiện
src/clock.js       Định dạng & cập nhật giờ HH:MM:ss
src/draggable.js   Logic kéo thả + giới hạn trong viewport
src/content.js     Chèn widget + Shadow DOM, khôi phục trạng thái
icons/             Icon 16/48/128px
```
