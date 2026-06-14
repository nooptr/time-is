// draggable.js — biến một phần tử thành kéo thả được trong viewport.
// onEnd(x, y) được gọi khi thả chuột, để caller lưu vị trí.

function makeDraggable(el, onEnd) {
  let startX = 0, startY = 0;   // toạ độ chuột khi bắt đầu kéo
  let originX = 0, originY = 0; // vị trí el khi bắt đầu kéo
  let dragging = false;

  // Giới hạn vị trí để widget luôn nằm trong khung nhìn.
  const clamp = (x, y) => {
    const maxX = Math.max(0, window.innerWidth - el.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - el.offsetHeight);
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  };

  const onMouseDown = (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = el.getBoundingClientRect();
    originX = rect.left;
    originY = rect.top;
    el.classList.add("dragging");
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const next = clamp(originX + (e.clientX - startX), originY + (e.clientY - startY));
    el.style.left = next.x + "px";
    el.style.top = next.y + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";
  };

  const onMouseUp = () => {
    if (!dragging) return;
    dragging = false;
    el.classList.remove("dragging");
    const rect = el.getBoundingClientRect();
    if (typeof onEnd === "function") onEnd(rect.left, rect.top);
  };

  el.addEventListener("mousedown", onMouseDown);
  // Lắng nghe trên document để kéo mượt kể cả khi chuột ra ngoài widget.
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  // Đặt lại vị trí trong viewport khi cửa sổ đổi kích thước.
  window.addEventListener("resize", () => {
    const rect = el.getBoundingClientRect();
    const next = clamp(rect.left, rect.top);
    el.style.left = next.x + "px";
    el.style.top = next.y + "px";
  });
}
