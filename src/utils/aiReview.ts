// AI Blog Post Reviewer Utility with LLM Integration
// Supports both local rule-based review and LLM-powered analysis

import { Pokemon } from '../types';
import { isLegalMove } from '../data/moveData';

const BLOCKED_PHRASES = [
  'kill', 'hate', 'suicide', 'violence', 'attack', 'bomb', 'shoot', 'abuse',
  'racist', 'sexist', 'homophobic', 'transphobic', 'dox', 'doxxing', 'nazi',
  'terrorist', 'harm yourself', 'self-harm', 'die', 'stupid', 'idiot', 'moron',
  'worthless', 'useless', 'retard', 'retarded', 'faggot', 'bitch', 'slut', 'cunt',
  'asshole', 'dumb', 'fuck', 'shit', 'piss', 'dick', 'cock', 'pussy', 'whore',
  'fag', 'nigger', 'kike', 'spic', 'chink', 'gook', 'coon', 'wetback', 'tranny',
  'rape', 'rapist', 'molest', 'pedophile', 'groom', 'groomer', 'incel', 'incest',
  'threaten', 'threat', 'harass', 'bully', 'bullying', 'abduct', 'abduction',
  'abusive', 'abusing', 'abused', 'abuser', 'dangerous', 'danger', 'unsafe',
  'illegal', 'crime', 'criminal', 'murder', 'manslaughter', 'genocide', 'lynch',
  'shooting', 'stab', 'stabbing', 'poison', 'poisoning', 'overdose', 'overdosing',
  'cut', 'cutting', 'burn', 'burning', 'hang', 'hanging', 'strangle', 'strangling',
  'suffocate', 'suffocating', 'abandon', 'abandonment', 'neglect', 'neglecting',
  'exploit', 'exploiting', 'exploitation', 'gore', 'blood', 'bloody', 'dead', 'death',
  'die', 'dying', 'kill yourself', 'kms', 'kys', 'unalive', 'unaliving',
];

export interface AIReviewResult {
  passed: boolean;
  reasons: string[];
  confidence: number;
  reviewType: 'rule-based' | 'llm' | 'hybrid';
  suggestions?: string[];
  categories?: {
    toxicity: number;
    spam: number;
    inappropriate: number;
    quality: number;
  };
}

export interface LLMConfig {
  provider: 'huggingface' | 'openai' | 'local' | 'mock';
  apiKey?: string;
  model?: string;
  endpoint?: string;
  enabled: boolean;
}

// Default LLM configuration (can be overridden)
const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: 'mock', // Start with mock, can be changed to 'huggingface' or 'openai'
  enabled: false, // Disabled by default for free deployment
  model: 'gpt-3.5-turbo',
  endpoint: 'https://api.openai.com/v1/chat/completions',
};

// Mock LLM response for development/testing
const MOCK_LLM_RESPONSE = {
  toxicity: 0.1,
  spam: 0.05,
  inappropriate: 0.02,
  quality: 0.85,
  passed: true,
  reasons: [],
  suggestions: ['Consider adding more specific strategy details', 'Include team composition analysis'],
};

export async function aiReviewBlogPost(
  title: string, 
  content: string, 
  config: LLMConfig = DEFAULT_LLM_CONFIG
): Promise<AIReviewResult> {
  // Always run rule-based review first
  const ruleBasedResult = runRuleBasedReview(title, content);
  
  // If LLM is enabled and configured, run LLM review
  if (config.enabled && config.provider !== 'mock') {
    try {
      const llmResult = await runLLMReview(title, content, config);
      return combineResults(ruleBasedResult, llmResult);
    } catch (error) {
      console.warn('LLM review failed, falling back to rule-based only:', error);
      return ruleBasedResult;
    }
  }
  
  // If LLM is mock, simulate LLM review
  if (config.enabled && config.provider === 'mock') {
    const mockLLMResult = await simulateLLMReview(title, content);
    return combineResults(ruleBasedResult, mockLLMResult);
  }
  
  return ruleBasedResult;
}

function runRuleBasedReview(title: string, content: string): AIReviewResult {
  const reasons: string[] = [];
  const text = `${title} ${content}`.toLowerCase();

  // Check for blocked phrases
  for (const phrase of BLOCKED_PHRASES) {
    if (text.includes(phrase)) {
      reasons.push(`Contains blocked or unsafe phrase: "${phrase}"`);
    }
  }

  // Heuristic: excessive ALL CAPS (shouting)
  const allCapsWords = text.split(/\s+/).filter(w => w.length > 4 && w === w.toUpperCase());
  if (allCapsWords.length > 5) {
    reasons.push('Excessive use of ALL CAPS (shouting)');
  }

  // Heuristic: repeated exclamation marks
  if ((text.match(/!{3,}/g) || []).length > 0) {
    reasons.push('Excessive exclamation marks (may be inflammatory)');
  }

  // Heuristic: personal attack patterns
  if (/you (are|should|must|deserve) (die|suffer|fail|lose|quit|leave|be punished)/i.test(text)) {
    reasons.push('Possible personal attack or harmful advice');
  }

  // Heuristic: encouragement of self-harm
  if (/harm yourself|kill yourself|kms|kys|unalive/i.test(text)) {
    reasons.push('Possible encouragement of self-harm');
  }

  // Heuristic: spam detection (repeated words/phrases)
  const words = text.split(/\s+/);
  const wordCounts = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const repeatedWords = Object.entries(wordCounts)
    .filter(([word, count]) => count > 10 && word.length > 3)
    .map(([word]) => word);
    
  if (repeatedWords.length > 0) {
    reasons.push(`Possible spam: excessive repetition of words like "${repeatedWords.slice(0, 3).join(', ')}"`);
  }

  const passed = reasons.length === 0;
  const confidence = passed ? 0.8 : 0.9; // High confidence for rule-based detection

  return {
    passed,
    reasons,
    confidence,
    reviewType: 'rule-based',
    categories: {
      toxicity: reasons.some(r => r.includes('blocked') || r.includes('attack')) ? 0.8 : 0.1,
      spam: reasons.some(r => r.includes('spam')) ? 0.7 : 0.1,
      inappropriate: reasons.some(r => r.includes('inappropriate')) ? 0.6 : 0.1,
      quality: passed ? 0.7 : 0.3,
    },
  };
}

async function runLLMReview(title: string, content: string, config: LLMConfig): Promise<AIReviewResult> {
  const prompt = `Analyze this Pokémon VGC blog post for content safety and quality:

Title: "${title}"
Content: "${content.substring(0, 2000)}..."

Please evaluate the following aspects and respond in JSON format:
1. Toxicity (0-1 scale): Is the content harmful, hateful, or inappropriate?
2. Spam (0-1 scale): Is this spam or low-quality content?
3. Inappropriate (0-1 scale): Is this inappropriate for a gaming community?
4. Quality (0-1 scale): Is this well-written and valuable content?
5. Passed (boolean): Should this post be approved?
6. Reasons (array): List specific issues found
7. Suggestions (array): List improvement suggestions

Respond only with valid JSON.`;

  try {
    let response;
    
    if (config.provider === 'huggingface') {
      response = await callHuggingFaceAPI(prompt, config);
    } else if (config.provider === 'openai') {
      response = await callOpenAIAPI(prompt, config);
    } else {
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }

    const result = parseLLMResponse(response);
    return {
      ...result,
      reviewType: 'llm',
    };
  } catch (error) {
    console.error('LLM review error:', error);
    throw error;
  }
}

async function callHuggingFaceAPI(prompt: string, config: LLMConfig): Promise<string> {
  const response = await fetch(config.endpoint || 'https://api-inference.huggingface.co/models/gpt2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_length: 500,
        temperature: 0.3,
        return_full_text: false,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const data = await response.json();
  return data[0]?.generated_text || '';
}

async function callOpenAIAPI(prompt: string, config: LLMConfig): Promise<string> {
  const response = await fetch(config.endpoint || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a content moderator for a Pokémon VGC community. Analyze blog posts for safety and quality.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function parseLLMResponse(response: string): AIReviewResult {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      passed: parsed.passed ?? true,
      reasons: parsed.reasons ?? [],
      confidence: 0.7, // Moderate confidence for LLM
      reviewType: 'llm',
      suggestions: parsed.suggestions ?? [],
      categories: {
        toxicity: parsed.toxicity ?? 0.1,
        spam: parsed.spam ?? 0.1,
        inappropriate: parsed.inappropriate ?? 0.1,
        quality: parsed.quality ?? 0.7,
      },
    };
  } catch (error) {
    console.error('Failed to parse LLM response:', error);
    // Fallback to basic analysis
    return {
      passed: !response.toLowerCase().includes('reject'),
      reasons: response.toLowerCase().includes('reject') ? ['LLM flagged content'] : [],
      confidence: 0.5,
      reviewType: 'llm',
    };
  }
}

async function simulateLLMReview(title: string, content: string): Promise<AIReviewResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simple simulation based on content length and keywords
  const text = `${title} ${content}`.toLowerCase();
  const hasPokemonTerms = /pokemon|vgc|tournament|team|strategy|battle/i.test(text);
  const hasInappropriateTerms = /hate|stupid|idiot|kill/i.test(text);
  const isTooShort = content.length < 100;
  
  const toxicity = hasInappropriateTerms ? 0.8 : 0.1;
  const spam = isTooShort ? 0.6 : 0.1;
  const inappropriate = hasInappropriateTerms ? 0.7 : 0.1;
  const quality = hasPokemonTerms && !isTooShort ? 0.8 : 0.4;
  
  const passed = toxicity < 0.5 && spam < 0.5 && inappropriate < 0.5;
  const reasons = [];
  
  if (toxicity > 0.5) reasons.push('Content may be toxic or harmful');
  if (spam > 0.5) reasons.push('Content appears to be spam or low quality');
  if (inappropriate > 0.5) reasons.push('Content may be inappropriate');
  
  return {
    passed,
    reasons,
    confidence: 0.6,
    reviewType: 'llm',
    suggestions: passed ? ['Consider adding more strategy details', 'Include team analysis'] : [],
    categories: { toxicity, spam, inappropriate, quality },
  };
}

function combineResults(ruleBased: AIReviewResult, llm: AIReviewResult): AIReviewResult {
  // Combine both results with weighted confidence
  const combinedPassed = ruleBased.passed && llm.passed;
  const combinedReasons = [...ruleBased.reasons, ...llm.reasons];
  const combinedConfidence = (ruleBased.confidence + llm.confidence) / 2;
  
  const combinedCategories = {
    toxicity: Math.max(ruleBased.categories?.toxicity || 0, llm.categories?.toxicity || 0),
    spam: Math.max(ruleBased.categories?.spam || 0, llm.categories?.spam || 0),
    inappropriate: Math.max(ruleBased.categories?.inappropriate || 0, llm.categories?.inappropriate || 0),
    quality: (ruleBased.categories?.quality || 0 + llm.categories?.quality || 0) / 2,
  };
  
  return {
    passed: combinedPassed,
    reasons: combinedReasons,
    confidence: combinedConfidence,
    reviewType: 'hybrid',
    suggestions: llm.suggestions,
    categories: combinedCategories,
  };
}

// Backward compatibility function
export function aiReviewBlogPostSync(title: string, content: string): { passed: boolean; reasons: string[] } {
  const result = runRuleBasedReview(title, content);
  return {
    passed: result.passed,
    reasons: result.reasons,
  };
} 

// Parses a Showdown team export and returns an array of Pokemon objects and errors
export function parseShowdownTeam(showdownText: string): { team: Pokemon[], errors: string[] } {
  const lines = showdownText.split(/\r?\n/);
  const team: Pokemon[] = [];
  const errors: string[] = [];
  let current: Partial<Pokemon> = {};
  let moves: string[] = [];

  function pushCurrent() {
    if (current.name) {
      current.moves = moves.slice();
      team.push(current as Pokemon);
    }
    current = {};
    moves = [];
  }

  for (let line of lines) {
    line = line.trim();
    if (!line) {
      pushCurrent();
      continue;
    }
    // Species, item, gender, shiny
    const speciesMatch = line.match(/^([\w\-\.\' ]+)(?: \((M|F)\))? ?@ ?([\w\-\. ]+)?/i);
    if (speciesMatch && line.includes('@')) {
      pushCurrent();
      current.name = speciesMatch[1].trim();
      if (speciesMatch[2]) current.gender = speciesMatch[2] === 'M' ? 'male' : 'female';
      if (speciesMatch[3]) current.item = speciesMatch[3].trim();
      current.shiny = /shiny: ?yes/i.test(line);
      continue;
    }
    // Ability
    const abilityMatch = line.match(/^Ability: ?(.+)/i);
    if (abilityMatch) {
      current.ability = abilityMatch[1].trim();
      continue;
    }
    // Level
    const levelMatch = line.match(/^Level: ?(\d+)/i);
    if (levelMatch) {
      current.level = parseInt(levelMatch[1], 10);
      continue;
    }
    // Tera Type
    const teraMatch = line.match(/^Tera Type: ?(.+)/i);
    if (teraMatch) {
      current.teraType = teraMatch[1].trim();
      continue;
    }
    // Nature
    const natureMatch = line.match(/^([A-Za-z]+) Nature/i);
    if (natureMatch) {
      current.nature = natureMatch[1];
      continue;
    }
    // EVs
    const evMatch = line.match(/^EVs: ?(.+)/i);
    if (evMatch) {
      const evs: { [stat: string]: number } = {};
      evMatch[1].split('/').forEach(ev => {
        const [val, stat] = ev.trim().split(' ');
        if (val && stat) evs[stat] = parseInt(val, 10);
      });
      current.evs = evs;
      continue;
    }
    // IVs
    const ivMatch = line.match(/^IVs: ?(.+)/i);
    if (ivMatch) {
      const ivs: { [stat: string]: number } = {};
      ivMatch[1].split('/').forEach(iv => {
        const [val, stat] = iv.trim().split(' ');
        if (val && stat) ivs[stat] = parseInt(val, 10);
      });
      current.ivs = ivs;
      continue;
    }
    // Moves
    const moveMatch = line.match(/^- ([\w\-\' ]+)/);
    if (moveMatch) {
      moves.push(moveMatch[1].trim());
      continue;
    }
  }
  pushCurrent();

  // Validate moves
  for (const poke of team) {
    if (!poke.name) {
      errors.push('A Pokémon is missing its name/species.');
      continue;
    }
    if (!poke.moves) poke.moves = [];
    for (const move of poke.moves) {
      if (!isLegalMove(poke.name, move)) {
        errors.push(`${poke.name} cannot legally learn ${move}.`);
      }
    }
  }

  return { team, errors };
} 