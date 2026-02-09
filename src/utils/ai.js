const API_KEY = 'hk-3ziq891000002789d5f474eb80180cbe5ed20b1ab17038fb';
const API_URL = 'https://api.openai-hk.com/v1/chat/completions';

const SYSTEM_PROMPT =
  '你是一个经验丰富的摆摊助手，专门帮助水果摊主分析生意。你会结合集市信息、库存情况、历史销售数据给出实用建议。回答要简洁、接地气、有针对性，不超过200字。重点关注：1)今天去哪摆摊最赚钱 2)如何定价和销售策略 3)库存如何处理。';

// 流式调用 AI
export const streamAI = async (message, onMessage) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

  try {
    console.log('开始 AI 请求...');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        max_tokens: 500,
        model: 'deepseek-v3',
        temperature: 0.8,
        top_p: 1,
        presence_penalty: 1,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('收到响应，状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 响应错误:', response.status, errorText);
      throw new Error(`API 服务异常 (${response.status})`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let chunkCount = 0;

    console.log('开始读取流式数据...');

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('流式数据读取完成，共', chunkCount, '个块');
        break;
      }

      chunkCount++;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();

          if (data === '[DONE]') {
            console.log('收到 [DONE] 标记');
            continue;
          }

          if (!data) continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content || '';

            if (content) {
              fullText += content;
              onMessage(fullText);
            }
          } catch (e) {
            console.error('解析 JSON 错误:', e, 'data:', data);
          }
        }
      }
    }

    console.log('最终文本长度:', fullText.length);

    if (!fullText) {
      throw new Error('AI 没有返回内容，请稍后重试');
    }

    return fullText;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('请求超时');
      throw new Error('请求超时，请检查网络连接');
    }

    console.error('AI 调用失败:', error);
    throw error;
  }
};

// 普通调用 AI（非流式）
export const callAI = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        max_tokens: 500,
        model: 'deepseek-v3',
        temperature: 0.8,
        top_p: 1,
        presence_penalty: 1,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 错误 ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI 调用失败:', error);
    throw error;
  }
};
