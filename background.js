// background.js — service worker. Click icon extension -> đảo trạng thái ẩn/hiện.
// Trạng thái lưu trong chrome.storage.local; mọi content script lắng nghe
// storage.onChanged và tự cập nhật, nên không cần gửi message thủ công.

chrome.action.onClicked.addListener(() => {
  chrome.storage.local.get({ visible: true }, (state) => {
    chrome.storage.local.set({ visible: !state.visible });
  });
});
