import React, { useState } from 'react';
import { Brain, Settings, Save, TestTube, Shield, Zap, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { type LLMConfig } from '../utils/aiReview';

interface AIReviewConfigProps {
  config: LLMConfig;
  onConfigChange: (config: LLMConfig) => void;
  onTestConfig: (config: LLMConfig) => Promise<boolean>;
  isAdmin?: boolean;
}

const AIReviewConfig: React.FC<AIReviewConfigProps> = ({
  config,
  onConfigChange,
  onTestConfig,
  isAdmin = false
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTestConfig = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const success = await onTestConfig(config);
      setTestResult({
        success,
        message: success 
          ? 'AI review configuration test successful!' 
          : 'AI review configuration test failed. Please check your settings.'
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Admin Access Required</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Only administrators can configure AI review settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Review Configuration</h3>
            <p className="text-sm text-gray-600">Configure AI-powered content review settings</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
        </button>
      </div>

      {/* Basic Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Review Status
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => onConfigChange({ ...config, enabled: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Enable AI Review</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LLM Provider
            </label>
            <select
              value={config.provider}
              onChange={(e) => onConfigChange({ ...config, provider: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="mock">Mock (Development)</option>
              <option value="huggingface">Hugging Face (Free Tier)</option>
              <option value="openai">OpenAI (Paid)</option>
              <option value="local">Local Model</option>
            </select>
          </div>

          {config.provider !== 'mock' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={config.apiKey || ''}
                onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your API key..."
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <input
              type="text"
              value={config.model || ''}
              onChange={(e) => onConfigChange({ ...config, model: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={config.provider === 'openai' ? 'gpt-3.5-turbo' : 'model-name'}
            />
          </div>

          {showAdvanced && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Endpoint
              </label>
              <input
                type="url"
                value={config.endpoint || ''}
                onChange={(e) => onConfigChange({ ...config, endpoint: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://api.example.com/v1/chat/completions"
              />
            </div>
          )}

          {/* Test Configuration */}
          <div className="pt-4">
            <button
              onClick={handleTestConfig}
              disabled={isTesting || !config.enabled}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              <span>{isTesting ? 'Testing...' : 'Test Configuration'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`p-4 rounded-lg border ${
          testResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {testResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${
              testResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {testResult.success ? 'Success' : 'Error'}
            </span>
          </div>
          <p className={`text-sm mt-1 ${
            testResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {testResult.message}
          </p>
        </div>
      )}

      {/* Provider Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Provider Information</h4>
        <div className="space-y-2 text-sm text-gray-600">
          {config.provider === 'mock' && (
            <p>Mock provider for development and testing. No API calls are made.</p>
          )}
          {config.provider === 'huggingface' && (
            <div>
              <p>• Free tier available with rate limits</p>
              <p>• Supports many open-source models</p>
              <p>• Get API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Hugging Face</a></p>
            </div>
          )}
          {config.provider === 'openai' && (
            <div>
              <p>• Paid service with usage-based pricing</p>
              <p>• High-quality models and reliable API</p>
              <p>• Get API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI</a></p>
            </div>
          )}
          {config.provider === 'local' && (
            <p>Local model deployment. Configure your own endpoint and model.</p>
          )}
        </div>
      </div>

      {/* Save Configuration */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            // In a real app, this would save to backend
            console.log('Saving AI review config:', config);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};

export default AIReviewConfig; 