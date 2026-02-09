export const copyToClipboard = async (text, onSuccess, onError) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess?.();
    } catch {
      fallbackCopy(text, onSuccess, onError);
    }
  } else {
    fallbackCopy(text, onSuccess, onError);
  }
};

const fallbackCopy = (text, onSuccess, onError) => {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;width:1px;height:1px;';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      onSuccess?.();
    } else {
      onError?.('复制失败，请尝试长按文本手动复制');
    }
  } catch {
    onError?.('您的浏览器暂不支持一键复制，请手动长按复制');
  }
};
