document.getElementById('save-key').addEventListener('click', function () {
  const apiKey = document.getElementById('api-key').value;
  chrome.storage.sync.set({ apiKey: apiKey }, function () {
    alert('API Key 已保存！');
  });
});

// 加载时显示已保存的API Key
chrome.storage.sync.get('apiKey', function (data) {
  if (data.apiKey) {
    document.getElementById('api-key').value = data.apiKey;
  }
});