console.log("sidebar.js 已加载"); // 添加日志

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showTranslation") {
    console.log("接收到翻译结果：", request.translation);
    document.getElementById("translation").innerText = request.translation;

    // 返回 true 以保持消息端口开放
    return true;
  }
});