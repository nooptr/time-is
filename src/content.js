// content.js — chèn đồng hồ nổi vào trang, cô lập style bằng Shadow DOM.
// Chạy trên mọi trang (xem manifest). Phụ thuộc: clock.js, draggable.js (cùng scope).

(function () {
  const HOST_ID = "time-is-clock-host";

  // Tránh chèn trùng (ví dụ SPA chạy lại content script).
  if (document.getElementById(HOST_ID)) return;

  // CSS đặt thẳng trong Shadow DOM để không bị CSS của trang đè và cũng không
  // rò rỉ ra trang. (Field "css" của manifest sẽ tiêm vào document chứ không vào shadow.)
  const STYLE = `
    :host { all: initial; }
    .clock {
      position: fixed;
      top: 16px;
      right: 16px;
      left: auto;
      bottom: auto;
      z-index: 2147483647;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 16px;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.5px;
      color: #f5f5f5;
      background: rgba(20, 20, 22, 0.82);
      padding: 6px 12px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
      user-select: none;
      cursor: grab;
      backdrop-filter: blur(4px);
    }
    .clock.dragging { cursor: grabbing; }
    .clock.hidden { display: none; }
  `;

  // Tạo host + shadow root.
  const host = document.createElement("div");
  host.id = HOST_ID;
  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = STYLE;

  const clockEl = document.createElement("div");
  clockEl.className = "clock";

  shadow.appendChild(style);
  shadow.appendChild(clockEl);
  (document.body || document.documentElement).appendChild(host);

  const MIN_FONT = 10;
  const MAX_FONT = 48;
  const DEFAULT_FONT = 16;

  // Khôi phục trạng thái đã lưu (vị trí + ẩn/hiện + cỡ chữ).
  chrome.storage.local.get(
    { visible: true, position: null, fontSize: DEFAULT_FONT },
    (state) => {
      applyVisibility(state.visible);
      applyFontSize(state.fontSize);
      if (state.position) {
        clockEl.style.left = state.position.x + "px";
        clockEl.style.top = state.position.y + "px";
        clockEl.style.right = "auto";
        clockEl.style.bottom = "auto";
      }
    }
  );

  function applyVisibility(visible) {
    clockEl.classList.toggle("hidden", !visible);
  }

  function applyFontSize(px) {
    const clamped = Math.min(MAX_FONT, Math.max(MIN_FONT, px));
    clockEl.style.fontSize = clamped + "px";
    return clamped;
  }

  // Bắt đầu đồng hồ.
  startClock(clockEl);

  // Kéo thả -> lưu vị trí (chỉ lưu, không phát tán sang tab khác để tránh nhảy vị trí).
  makeDraggable(clockEl, (x, y) => {
    chrome.storage.local.set({ position: { x: Math.round(x), y: Math.round(y) } });
  });

  // Lăn chuột trên đồng hồ -> tăng/giảm cỡ chữ, lưu lại.
  clockEl.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const current = parseFloat(clockEl.style.fontSize) || DEFAULT_FONT;
      const next = applyFontSize(current + (e.deltaY < 0 ? 1 : -1));
      chrome.storage.local.set({ fontSize: next });
    },
    { passive: false }
  );

  // Đồng bộ trạng thái ẩn/hiện giữa các tab khi click icon extension.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.visible) applyVisibility(changes.visible.newValue);
    if (changes.fontSize) applyFontSize(changes.fontSize.newValue);
  });
})();
