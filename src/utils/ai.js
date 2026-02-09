const API_KEY = 'hk-3ziq891000002789d5f474eb80180cbe5ed20b1ab17038fb';
const API_URL = 'https://api.openai-hk.com/v1/chat/completions';

// 流式调用 AI
export const streamAI = async (message, onMessage) => {
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
            content:
              '你是一个摆摊助手，帮助摆摊商贩分析今天是否适合摆摊、去哪里摆摊。请从摆摊人的角度给出实用建议，简洁明了，不超过150字。',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 错误 ${response.status}: ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          if (!data) continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              onMessage(fullText);
            }
          } catch (e) {
            console.error('解析错误:', e, 'data:', data);
          }
        }
      }
    }

    if (!fullText) {
      throw new Error('AI 没有返回内容');
    }

    return fullText;
  } catch (error) {
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
            content:
              '你是一个摆摊助手，帮助摆摊商贩分析今天是否适合摆摊、去哪里摆摊。请从摆摊人的角度给出实用建议，简洁明了，不超过150字。',
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
