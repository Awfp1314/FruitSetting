import { useState, useEffect } from 'react';
import { X, Key, Globe, Check } from 'lucide-react';

const AI_PROVIDERS = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
  },
  {
    id: 'openai-hk',
    name: 'OpenAI-HK',
    apiUrl: 'https://api.openai-hk.com/v1/chat/completions',
    model: 'deepseek-v3',
  },
  {
    id: 'custom',
    name: '自定义',
    apiUrl: '',
    model: '',
  },
];

const AIConfigModal = ({ onClose }) => {
  const [provider, setProvider] = useState('deepseek');
  const [apiKey, setApiKey] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customModel, setCustomModel] = useState('');

  useEffect(() => {
    // 加载已保存的配置
    const savedConfig = localStorage.getItem('aiConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setProvider(config.provider || 'deepseek');
      setApiKey(config.apiKey || '');
      setCustomUrl(config.customUrl || '');
      setCustomModel(config.customModel || '');
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      alert('请输入 API Key');
      return;
    }

    if (provider === 'custom') {
      if (!customUrl.trim() || !customModel.trim()) {
        alert('请填写完整的自定义配置');
        return;
      }
    }

    const config = {
      provider,
      apiKey: apiKey.trim(),
      customUrl: customUrl.trim(),
      customModel: customModel.trim(),
    };

    localStorage.setItem('aiConfig', JSON.stringify(config));
    alert('配置已保存');
    onClose();
  };

  const selectedProvider = AI_PROVIDERS.find((p) => p.id === provider);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">AI 配置</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5 space-y-5">
          {/* 供应商选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe size={16} className="inline mr-1" />
              AI 供应商
            </label>
            <div className="space-y-2">
              {AI_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    provider === p.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{p.name}</span>
                    {provider === p.id && <Check size={18} className="text-purple-500" />}
                  </div>
                  {p.id !== 'custom' && <div className="text-xs text-gray-500 mt-1">{p.model}</div>}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Key size={16} className="inline mr-1" />
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入您的 API Key"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              {provider === 'deepseek' && (
                <>
                  在{' '}
                  <a
                    href="https://platform.deepseek.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:underline"
                  >
                    DeepSeek 平台
                  </a>{' '}
                  获取
                </>
              )}
              {provider === 'openai-hk' && '从您的 OpenAI-HK 账户获取'}
              {provider === 'custom' && '从您的 AI 服务商获取'}
            </p>
          </div>

          {/* 自定义配置 */}
          {provider === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API 地址</label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://api.example.com/v1/chat/completions"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">模型名称</label>
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="gpt-4, claude-3, etc."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </>
          )}

          {/* 说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 leading-relaxed">
              💡 您的 API Key 仅保存在本地浏览器，不会上传到任何服务器。AI
              请求直接从您的浏览器发送到所选的 AI 服务商。
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIConfigModal;
