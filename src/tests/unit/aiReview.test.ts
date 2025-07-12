import { aiReviewBlogPost, aiReviewBlogPostSync, type AIReviewResult, type LLMConfig } from '../../utils/aiReview';
import { parseShowdownTeam } from '../../utils/aiReview';

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
      const spamContent = 'spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam spam';
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

describe('Showdown Team Parser', () => {
  test('parses a valid 6-Pokémon team', () => {
    const showdown = `
Charizard @ Life Orb  
Ability: Blaze  
Level: 50  
Tera Type: Fire  
EVs: 252 SpA / 4 SpD / 252 Spe  
Timid Nature  
IVs: 0 Atk  
- Flamethrower  
- Heat Wave  
- Air Slash  
- Protect  

Gholdengo @ Choice Specs  
Ability: Good as Gold  
Level: 50  
Tera Type: Steel  
EVs: 252 HP / 252 SpA / 4 SpD  
Modest Nature  
IVs: 0 Atk  
- Make It Rain  
- Shadow Ball  
- Thunderbolt  
- Nasty Plot  

Urshifu @ Focus Sash  
Ability: Unseen Fist  
Level: 50  
Tera Type: Dark  
EVs: 252 Atk / 4 SpD / 252 Spe  
Jolly Nature  
IVs: 0 SpA  
- Wicked Blow  
- Close Combat  
- Protect  
- Iron Head  

Rillaboom @ Assault Vest  
Ability: Grassy Surge  
Level: 50  
Tera Type: Grass  
EVs: 252 HP / 252 Atk / 4 SpD  
Adamant Nature  
IVs: 0 SpA  
- Grassy Glide  
- Fake Out  
- Wood Hammer  
- U-turn  

Amoonguss @ Sitrus Berry  
Ability: Regenerator  
Level: 50  
Tera Type: Water  
EVs: 252 HP / 156 Def / 100 SpD  
Calm Nature  
IVs: 0 Atk  
- Spore  
- Rage Powder  
- Protect  
- Sludge Bomb  

Indeedee @ Psychic Seed  
Ability: Psychic Surge  
Level: 50  
Tera Type: Fairy  
EVs: 252 HP / 252 Def / 4 SpD  
Bold Nature  
IVs: 0 Atk  
- Follow Me  
- Expanding Force  
- Protect  
- Psychic  
`;
    const { team, errors } = parseShowdownTeam(showdown);
    expect(errors).toHaveLength(0);
    expect(team).toHaveLength(6);
    expect(team[0].name).toBe('Charizard');
    expect(team[0].moves).toContain('Flamethrower');
    expect(team[5].name).toBe('Indeedee');
  });

  test('reports illegal moves', () => {
    const showdown = `
Charizard @ Life Orb
Ability: Blaze
Level: 50
Tera Type: Fire
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk
- Thunderbolt
- Heat Wave
- Air Slash
- Protect
`;
    const { errors } = parseShowdownTeam(showdown);
    expect(errors.some(e => e.includes('Charizard') && e.includes('Thunderbolt'))).toBe(true);
  });

  test('reports missing Pokémon name', () => {
    const showdown = `
@ Life Orb
Ability: Blaze
Level: 50
Tera Type: Fire
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk
- Flamethrower
- Heat Wave
- Air Slash
- Protect
`;
    const { errors } = parseShowdownTeam(showdown);
    expect(errors.some(e => e.includes('missing its name'))).toBe(true);
  });

  test('reports wrong team size', () => {
    const showdown = `
Charizard @ Life Orb
Ability: Blaze
Level: 50
Tera Type: Fire
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk
- Flamethrower
- Heat Wave
- Air Slash
- Protect
`;
    const { team } = parseShowdownTeam(showdown);
    expect(team).toHaveLength(1);
  });

  test('parses gender, shiny, and stats', () => {
    const showdown = `
Charizard (M) @ Life Orb
Ability: Blaze
Level: 50
Tera Type: Fire
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
Shiny: Yes
IVs: 0 Atk
- Flamethrower
- Heat Wave
- Air Slash
- Protect
`;
    const { team, errors } = parseShowdownTeam(showdown);
    expect(errors).toHaveLength(0);
    expect(team[0].gender).toBe('male');
    expect(team[0].shiny).toBe(true);
    expect(team[0].evs).toBeDefined();
    expect(team[0].ivs).toBeDefined();
  });
}); 