// clock.js — logic định dạng và cập nhật giờ HH:MM:ss (giờ máy tính, 24h).
// Các content script trong cùng một entry chia sẻ chung scope của isolated world,
// nên các hàm khai báo ở đây dùng được trong content.js.

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

// Định dạng một đối tượng Date thành chuỗi "HH:MM:ss" (24h).
function formatTime(date) {
  return pad2(date.getHours()) + ":" + pad2(date.getMinutes()) + ":" + pad2(date.getSeconds());
}

// Bắt đầu cập nhật text của phần tử mỗi giây. Trả về hàm dừng.
//
// Mỗi lần vẽ đều đọc lại new Date() (giờ hệ thống) nên KHÔNG tích luỹ sai số dù
// chạy lâu. Dùng setTimeout canh đúng mốc đầu mỗi giây (thay vì setInterval 1000ms
// dễ trôi), và tự refresh khi tab được focus lại — vì Chrome bóp timer ở tab nền.
function startClock(el) {
  let timer = null;

  const render = () => {
    el.textContent = formatTime(new Date());
  };

  const scheduleNext = () => {
    render();
    const delay = 1000 - (Date.now() % 1000); // thời gian tới đầu giây kế tiếp
    timer = setTimeout(scheduleNext, delay);
  };

  // Tab nền bị throttle -> khi quay lại, refresh ngay cho khớp giờ thật.
  const resync = () => {
    if (document.visibilityState === "visible") {
      clearTimeout(timer);
      scheduleNext();
    }
  };

  scheduleNext();
  document.addEventListener("visibilitychange", resync);

  return () => {
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", resync);
  };
}
