// content.js

document.addEventListener("mouseup", function () {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    console.log("选中的文本：", selectedText); // 添加日志
    // 如果有选中文本，发送到后台脚本
    chrome.runtime.sendMessage(
      { action: "textSelected", text: selectedText },
      function (response) {
        console.log("后台脚本返回的响应：", response); // 添加日志
        if (response && response.success) {
          console.log("选中文本已发送到后台脚本");
        } else {
          console.error("发送选中文本失败");
        }
      }
    );
  }
});
// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    // 在网页中高亮指定的文本
    highlightText(request.text);
    sendResponse({ success: true });
  }
});

// 在网页中高亮文本的函数
function highlightText(text) {
  const bodyHTML = document.body.innerHTML;
  const highlightedHTML = bodyHTML.replace(
    new RegExp(text, "gi"),
    (match) => `<span style="background-color: yellow;">${match}</span>`
  );
  document.body.innerHTML = highlightedHTML;
}