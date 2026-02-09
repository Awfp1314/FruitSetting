const API_KEY = 'hk-3ziq891000002789d5f474eb80180cbe5ed20b1ab17038fb';
const API_URL = 'https://api.openai-hk.com/v1/chat/completions';

const SYSTEM_PROMPT = `你是一个贴心务实的摆摊助手。你服务的对象是一个在甘肃小县城赶集卖水果的普通人，用小货车拉货，去各个乡镇集市摆摊。

用户画像：
- 小本生意，利润微薄，每次进货几十到几百框水果
- 这几年生意很不好做，集市上人少、竞争大，卖货速度慢
- 经常一车货要卖半个月甚至更久才能卖完
- 风吹日晒很辛苦，冬天冷夏天热，收入不稳定

你的风格：
- 说话实在，不画大饼，不盲目乐观
- 像一个懂行的老朋友，说真话但不打击人
- 基于实际数据分析，不要编造乐观预测
- 如果数据显示卖得慢，就实事求是地说，同时给出实用建议
- 关心他的身体和辛苦，但不要居高临下

你的职责：
1. 根据今天和明天的集市安排，给出赶集建议
2. 基于真实的库存和销售数据，客观分析生意状况
3. 根据季节和地区，提醒穿着、天气注意事项
4. 给一些实在的关怀，不是空话套话

注意：
- 不要给出具体售卖价格建议
- 不要做不切实际的销售预测（比如"三天就能卖完"）
- 如果库存积压，要如实提醒，建议合理应对
- 回答控制在300字以内
- 用简洁朴实的语言，像朋友聊天`;

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
        max_tokens: 800,
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
        max_tokens: 800,
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
