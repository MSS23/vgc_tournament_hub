import { aiReviewBlogPost, aiReviewBlogPostSync, type AIReviewResult, type LLMConfig } from '../../utils/aiReview';

describe('AI Review Utility', () => {
  describe('Sync Content Filtering (Backward Compatibility)', () => {
    test('should pass appropriate content', () => {
      const result = aiReviewBlogPostSync(
        'VGC Meta Analysis: Regulation H Trends',
        'This is a comprehensive analysis of the current VGC meta in Regulation H. We will explore the top performing Pokémon and strategies.'
      );

      expect(result.passed).toBe(true);
      expect(result.reasons).toHaveLength(0);
    });

    test('should block content with inappropriate language', () => {
      const result = aiReviewBlogPostSync(
        'VGC Analysis',
        'This is a terrible analysis with hate speech and offensive content that should not be allowed.'
      );

      expect(result.passed).toBe(false);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    test('should block content with blocked phrases', () => {
      const result = aiReviewBlogPostSync(
        'VGC Guide',
        'This guide contains hate speech and discriminatory content that violates community guidelines.'
      );

      expect(result.passed).toBe(false);
      expect(result.reasons.some(r => r.includes('blocked'))).toBe(true);
    });
  });

  describe('Async AI Review (Enhanced)', () => {
    test('should pass appropriate content with mock LLM', async () => {
      const result = await aiReviewBlogPost(
        'VGC Meta Analysis: Regulation H Trends',
        'This is a comprehensive analysis of the current VGC meta in Regulation H. We will explore the top performing Pokémon and strategies.',
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(true);
      expect(result.reviewType).toBe('hybrid');
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.categories).toBeDefined();
    });

    test('should detect spam content with mock LLM', async () => {
      const spamContent = 'spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam';
      const result = await aiReviewBlogPost(
        'VGC Analysis',
        spamContent,
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(false);
      expect(result.reasons.some(r => r.includes('spam'))).toBe(true);
    });

    test('should detect inappropriate content with mock LLM', async () => {
      const result = await aiReviewBlogPost(
        'VGC Guide',
        'This guide contains hate speech and offensive content.',
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(false);
      expect(result.reasons.some(r => r.includes('toxic') || r.includes('inappropriate'))).toBe(true);
    });

    test('should provide suggestions for good content', async () => {
      const result = await aiReviewBlogPost(
        'VGC Meta Analysis',
        'This is a good VGC analysis post with strategy content.',
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(true);
      expect(result.suggestions).toBeDefined();
      expect(Array.isArray(result.suggestions)).toBe(true);
    });

    test('should fall back to rule-based when LLM is disabled', async () => {
      const result = await aiReviewBlogPost(
        'VGC Meta Analysis',
        'This is a comprehensive VGC analysis.',
        { provider: 'mock', enabled: false }
      );

      expect(result.reviewType).toBe('rule-based');
      expect(result.passed).toBe(true);
    });

    test('should handle LLM errors gracefully', async () => {
      const result = await aiReviewBlogPost(
        'VGC Meta Analysis',
        'This is a comprehensive VGC analysis.',
        { provider: 'openai', enabled: true, apiKey: 'invalid' }
      );

      // Should fall back to rule-based review
      expect(result.reviewType).toBe('rule-based');
      expect(result.passed).toBe(true);
    });
  });

  describe('Content Quality Detection', () => {
    test('should detect excessive ALL CAPS', async () => {
      const result = await aiReviewBlogPost(
        'VGC META ANALYSIS',
        'THIS IS A POST WRITTEN ENTIRELY IN CAPITAL LETTERS WHICH IS CONSIDERED POOR QUALITY CONTENT.',
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(false);
      expect(result.reasons.some(r => r.includes('ALL CAPS'))).toBe(true);
    });

    test('should detect excessive exclamation marks', async () => {
      const result = await aiReviewBlogPost(
        'VGC Analysis',
        'This is a post with excessive punctuation!!! It has too many exclamation marks!!!',
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(false);
      expect(result.reasons.some(r => r.includes('exclamation'))).toBe(true);
    });

    test('should detect spam patterns', async () => {
      const result = await aiReviewBlogPost(
        'VGC Analysis',
        'This post repeats the same words over and over and over and over and over and over and over and over and over and over.',
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(false);
      expect(result.reasons.some(r => r.includes('spam'))).toBe(true);
    });
  });

  describe('LLM Configuration', () => {
    test('should work with different providers', async () => {
      const configs: LLMConfig[] = [
        { provider: 'mock', enabled: true },
        { provider: 'huggingface', enabled: false },
        { provider: 'openai', enabled: false },
      ];

      for (const config of configs) {
        const result = await aiReviewBlogPost(
          'VGC Analysis',
          'This is a good VGC analysis post.',
          config
        );

        expect(result).toBeDefined();
        expect(typeof result.passed).toBe('boolean');
        expect(Array.isArray(result.reasons)).toBe(true);
      }
    });

    test('should handle invalid provider gracefully', async () => {
      const result = await aiReviewBlogPost(
        'VGC Analysis',
        'This is a good VGC analysis post.',
        { provider: 'invalid' as any, enabled: true }
      );

      // Should fall back to rule-based
      expect(result.reviewType).toBe('rule-based');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty content', async () => {
      const result = await aiReviewBlogPost('', '', { provider: 'mock', enabled: true });

      expect(result.passed).toBe(false);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    test('should handle very long content', async () => {
      const longContent = 'This is a very long VGC analysis post. '.repeat(100);
      const result = await aiReviewBlogPost('VGC Analysis', longContent, { provider: 'mock', enabled: true });

      expect(result.passed).toBe(true);
    });

    test('should handle special characters', async () => {
      const result = await aiReviewBlogPost(
        'VGC Analysis: Special Characters',
        'This post contains special characters like é, ñ, and ü. It also has numbers like 123 and symbols like @#$%.',
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(true);
    });

    test('should handle mixed content quality', async () => {
      const result = await aiReviewBlogPost(
        'VGC Analysis',
        'This is a good VGC analysis but contains some SPAM WORDS and excessive punctuation!!!',
        { provider: 'mock', enabled: true }
      );

      expect(result.passed).toBe(false);
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Reliability', () => {
    test('should complete within reasonable time', async () => {
      const startTime = Date.now();
      
      await aiReviewBlogPost(
        'VGC Analysis',
        'This is a comprehensive VGC analysis post with detailed strategy content.',
        { provider: 'mock', enabled: true }
      );
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 2 seconds (including mock delay)
      expect(duration).toBeLessThan(2000);
    });

    test('should handle concurrent requests', async () => {
      const promises = Array(5).fill(null).map(() => 
        aiReviewBlogPost(
          'VGC Analysis',
          'This is a good VGC analysis post.',
          { provider: 'mock', enabled: true }
        )
      );

      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(typeof result.passed).toBe('boolean');
      });
    });
  });
}); 