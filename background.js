console.log("background.js 已加载");

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateText",
    title: "deepseek翻译选中文本",
    contexts: ["selection"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("右键菜单创建失败：", chrome.runtime.lastError.message || chrome.runtime.lastError);
    } else {
      console.log("右键菜单创建成功！");
    }
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateText" && info.selectionText) {
    console.log("选中的文本：", info.selectionText);
    const selectedText = info.selectionText;

    // 获取保存的 API Key
    chrome.storage.sync.get('apiKey', function (data) {
      console.log("获取的 API Key：", data.apiKey);
      if (data.apiKey) {
        // 在用户手势的上下文中打开侧边栏
        chrome.sidePanel.open({ tabId: tab.id });

        // 调用 DeepSeek API 进行翻译
        translateText(data.apiKey, selectedText)
          .then((translation) => {
            // 将翻译结果发送到侧边栏
            chrome.runtime.sendMessage({
              action: "showTranslation",
              translation: translation,
            }, (response) => {
              if (chrome.runtime.lastError) {
                console.error("消息发送失败：", chrome.runtime.lastError.message || chrome.runtime.lastError);
              } else {
                console.log("消息发送成功");
              }
            });
          })
          .catch((error) => {
            console.error("翻译失败：", error);
          });
      } else {
        console.error("API Key 未设置");
      }
    });
  } else {
    console.error("未选中文本或右键菜单点击失败");
  }
});

// 翻译逻辑
function translateText(apiKey, text) {
  const url = 'https://api.deepseek.com/chat/completions';
  const prompt = `请将以下内容翻译成中文：${text}`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000
    })
  };

  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const translation = data.choices[0].message.content;
      return translation;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}