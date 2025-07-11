# AI Review System for VGC Hub

This document explains how to use and configure the AI-powered content review system for blog posts in VGC Hub.

## Overview

The AI review system provides automated content moderation for blog posts, ensuring they meet community guidelines and quality standards. It combines rule-based filtering with optional LLM-powered analysis for enhanced accuracy.

## Features

- **Rule-based filtering**: Fast, reliable detection of inappropriate content
- **LLM integration**: Advanced AI analysis for nuanced content evaluation
- **Multiple providers**: Support for Hugging Face, OpenAI, and local models
- **Graceful fallback**: Falls back to rule-based review if LLM fails
- **Detailed feedback**: Provides specific reasons and improvement suggestions
- **Configurable**: Easy to enable/disable and configure different providers

## Quick Start

### Basic Usage

```typescript
import { aiReviewBlogPost } from '../utils/aiReview';

// Simple usage with default settings
const result = await aiReviewBlogPost(title, content);

if (result.passed) {
  console.log('Post approved!');
} else {
  console.log('Post rejected:', result.reasons);
}
```

### Advanced Configuration

```typescript
import { aiReviewBlogPost, type LLMConfig } from '../utils/aiReview';

const config: LLMConfig = {
  provider: 'huggingface', // 'mock', 'huggingface', 'openai', 'local'
  enabled: true,
  apiKey: 'your-api-key',
  model: 'gpt2',
  endpoint: 'https://api-inference.huggingface.co/models/gpt2'
};

const result = await aiReviewBlogPost(title, content, config);
```

## Configuration Options

### LLM Providers

#### 1. Mock (Development)
- **Use case**: Development and testing
- **Cost**: Free
- **Features**: Simulates LLM responses
- **Configuration**:
  ```typescript
  {
    provider: 'mock',
    enabled: true
  }
  ```

#### 2. Hugging Face (Free Tier)
- **Use case**: Production with free tier
- **Cost**: Free with rate limits
- **Features**: Many open-source models
- **Configuration**:
  ```typescript
  {
    provider: 'huggingface',
    enabled: true,
    apiKey: 'hf_...',
    endpoint: 'https://api-inference.huggingface.co/models/gpt2'
  }
  ```

#### 3. OpenAI (Paid)
- **Use case**: Production with high accuracy
- **Cost**: Usage-based pricing
- **Features**: High-quality models
- **Configuration**:
  ```typescript
  {
    provider: 'openai',
    enabled: true,
    apiKey: 'sk-...',
    model: 'gpt-3.5-turbo',
    endpoint: 'https://api.openai.com/v1/chat/completions'
  }
  ```

#### 4. Local Model
- **Use case**: Self-hosted deployment
- **Cost**: Infrastructure costs only
- **Features**: Full control, privacy
- **Configuration**:
  ```typescript
  {
    provider: 'local',
    enabled: true,
    endpoint: 'http://localhost:8000/generate'
  }
  ```

## Review Results

The AI review returns a comprehensive result object:

```typescript
interface AIReviewResult {
  passed: boolean;                    // Whether the post was approved
  reasons: string[];                  // List of issues found
  confidence: number;                 // Confidence score (0-1)
  reviewType: 'rule-based' | 'llm' | 'hybrid';
  suggestions?: string[];             // Improvement suggestions
  categories?: {
    toxicity: number;                 // Toxicity score (0-1)
    spam: number;                     // Spam score (0-1)
    inappropriate: number;            // Inappropriateness score (0-1)
    quality: number;                  // Quality score (0-1)
  };
}
```

## Content Detection

### Rule-based Detection
- **Blocked phrases**: Comprehensive list of inappropriate terms
- **Excessive capitalization**: Detects shouting (ALL CAPS)
- **Excessive punctuation**: Flags posts with too many !!! or ???
- **Spam patterns**: Identifies repetitive content
- **Personal attacks**: Detects harmful advice patterns

### LLM-powered Detection
- **Contextual analysis**: Understands context and nuance
- **Quality assessment**: Evaluates writing quality and relevance
- **Suggestions**: Provides specific improvement recommendations
- **Multi-category scoring**: Detailed breakdown of content issues

## Integration Examples

### Blog Post Creation

```typescript
const handleCreatePost = async () => {
  setIsAiReviewLoading(true);
  
  try {
    const aiResult = await aiReviewBlogPost(title, content, {
      provider: 'mock', // Change to 'huggingface' or 'openai' for production
      enabled: true
    });

    if (!aiResult.passed) {
      setAiReviewError(`Post flagged: ${aiResult.reasons.join(', ')}`);
      if (aiResult.suggestions) {
        setSuggestions(aiResult.suggestions);
      }
      return;
    }

    // Post approved, proceed with creation
    createPost(title, content);
  } catch (error) {
    console.error('AI review failed:', error);
    // Fall back to manual review
  } finally {
    setIsAiReviewLoading(false);
  }
};
```

### Admin Configuration

```typescript
import AIReviewConfig from '../components/AIReviewConfig';

const AdminPanel = () => {
  const [config, setConfig] = useState<LLMConfig>({
    provider: 'mock',
    enabled: false
  });

  const handleTestConfig = async (testConfig: LLMConfig) => {
    try {
      const result = await aiReviewBlogPost(
        'Test Post',
        'This is a test post for configuration validation.',
        testConfig
      );
      return result.passed;
    } catch (error) {
      return false;
    }
  };

  return (
    <AIReviewConfig
      config={config}
      onConfigChange={setConfig}
      onTestConfig={handleTestConfig}
      isAdmin={true}
    />
  );
};
```

## Free Deployment Setup

For free deployment, use the mock provider:

```typescript
// Default configuration for free deployment
const DEFAULT_CONFIG: LLMConfig = {
  provider: 'mock',
  enabled: true, // Simulates AI review without API costs
  model: 'mock-model',
  endpoint: 'mock-endpoint'
};
```

To upgrade to real LLM:

1. **Hugging Face (Recommended for free tier)**:
   - Sign up at [huggingface.co](https://huggingface.co)
   - Get API key from settings
   - Update configuration:
     ```typescript
     {
       provider: 'huggingface',
       enabled: true,
       apiKey: 'hf_...',
       endpoint: 'https://api-inference.huggingface.co/models/gpt2'
     }
     ```

2. **OpenAI (Paid option)**:
   - Sign up at [openai.com](https://openai.com)
   - Get API key from platform
   - Update configuration:
     ```typescript
     {
       provider: 'openai',
       enabled: true,
       apiKey: 'sk-...',
       model: 'gpt-3.5-turbo'
     }
     ```

## Testing

Run the test suite to verify functionality:

```bash
npm run test -- --testPathPattern=aiReview.test.ts
```

The tests cover:
- Rule-based filtering
- LLM integration
- Error handling
- Performance
- Edge cases

## Performance Considerations

- **Rule-based review**: < 1ms response time
- **Mock LLM**: ~500ms (simulated delay)
- **Real LLM**: 1-3 seconds (network dependent)
- **Fallback**: Automatic fallback to rule-based if LLM fails

## Security

- API keys are stored securely (use environment variables in production)
- No content is logged or stored permanently
- All API calls are made over HTTPS
- Rate limiting is implemented for API providers

## Troubleshooting

### Common Issues

1. **LLM API errors**:
   - Check API key validity
   - Verify endpoint URL
   - Check rate limits
   - System falls back to rule-based review

2. **Slow response times**:
   - Use rule-based only for faster responses
   - Check network connectivity
   - Consider local model deployment

3. **False positives**:
   - Review blocked phrases list
   - Adjust LLM prompts
   - Use hybrid review for better accuracy

### Debug Mode

Enable debug logging:

```typescript
const result = await aiReviewBlogPost(title, content, {
  ...config,
  debug: true // Add debug flag to see detailed logs
});
```

## Future Enhancements

- **Custom models**: Train domain-specific models
- **Multi-language support**: Review content in multiple languages
- **Image analysis**: Review images and media content
- **Real-time learning**: Improve accuracy over time
- **Community feedback**: Learn from user reports

## Support

For issues or questions:
1. Check the test suite for examples
2. Review the configuration options
3. Test with mock provider first
4. Check API provider documentation
5. Open an issue in the repository

---

**Note**: The AI review system is designed to be lightweight and suitable for free deployment while providing powerful content moderation capabilities. 