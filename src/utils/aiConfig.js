// AI 配置管理
const DEFAULT_PROVIDERS = {
  deepseek: {
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
  },
  'openai-hk': {
    apiUrl: 'https://api.openai-hk.com/v1/chat/completions',
    model: 'deepseek-v3',
  },
};

// 获取 AI 配置
export const getAIConfig = () => {
  const savedConfig = localStorage.getItem('aiConfig');
  if (!savedConfig) {
    return null;
  }

  try {
    const config = JSON.parse(savedConfig);
    const { provider, apiKey, customUrl, customModel } = config;

    if (!apiKey) {
      return null;
    }

    // 自定义供应商
    if (provider === 'custom') {
      if (!customUrl || !customModel) {
        return null;
      }
      return {
        apiUrl: customUrl,
        apiKey,
        model: customModel,
      };
    }

    // 预设供应商
    const providerConfig = DEFAULT_PROVIDERS[provider];
    if (!providerConfig) {
      return null;
    }

    return {
      apiUrl: providerConfig.apiUrl,
      apiKey,
      model: providerConfig.model,
    };
  } catch (error) {
    console.error('解析 AI 配置失败:', error);
    return null;
  }
};

// 检查是否已配置
export const hasAIConfig = () => {
  return getAIConfig() !== null;
};
