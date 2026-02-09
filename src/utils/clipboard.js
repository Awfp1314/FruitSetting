export const copyToClipboard = async (text, onSuccess) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess?.();
    } catch {
      fallbackCopy(text, onSuccess);
    }
  } else {
    fallbackCopy(text, onSuccess);
  }
};

const fallbackCopy = (text, onSuccess) => {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.cssText = "position:fixed;top:0;left:0;opacity:0;width:1px;height:1px;";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      onSuccess?.();
    } else {
      alert("❌ 复制失败，请尝试长按文本手动复制");
    }
  } catch {
    alert("❌ 您的浏览器暂不支持一键复制，请手动长按复制");
  }
};
