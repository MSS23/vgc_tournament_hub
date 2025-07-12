import React, { useState } from 'react';
import { PenTool, Eye, Clock, CheckCircle, XCircle, Filter, Search, Trophy, Users, TrendingUp, Calendar, Star, Bookmark, X, Heart, Brain, Sparkles, Loader2, Share2 } from 'lucide-react';
import { aiReviewBlogPost, type AIReviewResult, type LLMConfig } from '../utils/aiReview';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    achievements: string[];
    isPokemonCompanyApproved?: boolean;
    approvalLevel?: 'content_creator' | 'official_analyst' | 'brand_ambassador';
    specialBadges?: string[];
  };
  category: 'meta-analysis' | 'team-building' | 'tournament-report' | 'strategy-guide' | 'pokemon-company-content';
  tags: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  publishedAt?: string;
  readTime: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  featuredImage?: string;
  summary: string;
  isOfficialContent?: boolean;
  requiresApproval?: boolean;
  approvalStatus?: string;
  approvedBy?: string;
  approvedAt?: string;
  aiFlagged?: boolean;
  aiReviewReasons?: string[];
}

interface BlogTipsProps {
  isVerifiedPlayer?: boolean;
  isAdmin?: boolean;
  isPokemonCompanyApproved?: boolean;
  approvalLevel?: 'content_creator' | 'official_analyst' | 'brand_ambassador';
  onPostSelect?: (post: BlogPost) => void;
}

const BlogTips: React.FC<BlogTipsProps> = ({ 
  isVerifiedPlayer = false, 
  isAdmin = false, 
  isPokemonCompanyApproved = false,
  approvalLevel,
  onPostSelect 
}) => {
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'pending' | 'bookmarked'>('published');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'meta-analysis' | 'team-building' | 'tournament-report' | 'strategy-guide'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'meta-analysis' as const,
    tags: [] as string[],
    summary: '',
    featuredImage: ''
  });
  const [aiReviewError, setAiReviewError] = useState<string | null>(null);
  const [aiReviewReasons, setAiReviewReasons] = useState<string[]>([]);
  const [isAiReviewLoading, setIsAiReviewLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTargetPost, setShareTargetPost] = useState<BlogPost | null>(null);
  const [shareRecipient, setShareRecipient] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  // Mock blog posts with Pokémon Company content
  const [blogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Official VGC 2024 Meta Analysis - Regulation H',
      content: 'As the official meta analyst for the Pokémon Company, I\'m excited to share insights into the current VGC 2024 Regulation H meta...',
      author: {
        id: '1',
        name: 'Alex Rodriguez',
        avatar: 'AR',
        isVerified: true,
        achievements: ['Worlds Champion 2023', 'Official Meta Analyst', 'Content Creator'],
        isPokemonCompanyApproved: true,
        approvalLevel: 'official_analyst',
        specialBadges: ['Official Meta Analyst', 'Worlds Champion 2023', 'Content Creator']
      },
      category: 'pokemon-company-content',
      tags: ['Official', 'Meta Analysis', 'Regulation H', 'Pokémon Company', 'VGC 2024'],
      status: 'approved',
      createdAt: '2024-03-15T10:00:00Z',
      publishedAt: '2024-03-15T10:00:00Z',
      readTime: 15,
      likes: 245,
      comments: 23,
      isLiked: false,
      isBookmarked: false,
      summary: 'Official meta analysis for VGC 2024 Regulation H from the Pokémon Company\'s official analyst.',
      isOfficialContent: true,
      requiresApproval: false,
      approvalStatus: 'approved',
      approvedBy: 'pokemon-company',
      approvedAt: '2024-03-15T09:30:00Z'
    },
    {
      id: '2',
      title: 'Building Teams for Success: A Comprehensive Guide',
      content: 'Team building is one of the most crucial aspects of competitive Pokémon...',
      author: {
        id: '2',
        name: 'Sarah Chen',
        avatar: 'SC',
        isVerified: true,
        achievements: ['Regional Champion', 'Meta Expert', 'Content Creator'],
        isPokemonCompanyApproved: true,
        approvalLevel: 'content_creator',
        specialBadges: ['Official Content Creator', 'Regional Champion', 'Meta Expert']
      },
      category: 'team-building',
      tags: ['Team Building', 'Strategy', 'Beginner Guide', 'Official Content'],
      status: 'approved',
      createdAt: '2024-03-14T14:00:00Z',
      publishedAt: '2024-03-14T14:00:00Z',
      readTime: 12,
      likes: 189,
      comments: 15,
      isLiked: false,
      isBookmarked: false,
      summary: 'A comprehensive guide to team building from an official Pokémon Company content creator.',
      isOfficialContent: true,
      requiresApproval: false,
      approvalStatus: 'approved',
      approvedBy: 'pokemon-company',
      approvedAt: '2024-03-14T13:30:00Z'
    },
    {
      id: '3',
      title: 'Community Spotlight: Rising Stars in VGC',
      content: 'The VGC community continues to grow with amazing new talent emerging...',
      author: {
        id: '3',
        name: 'Marcus Johnson',
        avatar: 'MJ',
        isVerified: true,
        achievements: ['Community Leader', 'Tournament Organizer'],
        isPokemonCompanyApproved: true,
        approvalLevel: 'brand_ambassador',
        specialBadges: ['Brand Ambassador', 'Community Leader', 'Tournament Organizer']
      },
      category: 'tournament-report',
      tags: ['Community', 'Rising Stars', 'Spotlight', 'Official Content'],
      status: 'approved',
      createdAt: '2024-03-13T16:00:00Z',
      publishedAt: '2024-03-13T16:00:00Z',
      readTime: 8,
      likes: 156,
      comments: 12,
      isLiked: false,
      isBookmarked: false,
      summary: 'Spotlight on rising stars in the VGC community from our official brand ambassador.',
      isOfficialContent: true,
      requiresApproval: false,
      approvalStatus: 'approved',
      approvedBy: 'pokemon-company',
      approvedAt: '2024-03-13T15:30:00Z'
    },
    {
      id: '4',
      title: 'Advanced Speed Control Strategies',
      content: `Speed control is arguably the most important aspect of VGC, yet many players struggle with its implementation. In this guide, I'll share advanced strategies that have helped me achieve consistent tournament success.

## Understanding Speed Tiers

Before diving into strategies, it's crucial to understand common speed tiers:
- **Max Speed Flutter Mane**: 200+ Speed
- **Max Speed Miraidon**: 180+ Speed
- **Max Speed Calyrex-Ice**: 160+ Speed
- **Max Speed Incineroar**: 140+ Speed

## Tailwind Strategies

**Setup Timing**: Don't always lead with your Tailwind setter. Sometimes it's better to:
- Lead with a Fake Out user to prevent opposing Tailwind
- Use a fast Pokémon to pressure the opponent first
- Set up Tailwind after the opponent has committed resources

**Tailwind Counters**:
- **Max Airstream**: Boosts speed without setup
- **Icy Wind**: Reduces opponent speed
- **Electroweb**: Spread speed control
- **Rock Slide**: Flinch chance to prevent setup

## Trick Room Tactics

**Trick Room Timing**: The key to successful Trick Room is timing:
- Use it when you have the advantage
- Don't be predictable with setup
- Have multiple Trick Room users as backup

**Trick Room Counters**:
- **Imprison**: Prevents Trick Room setup
- **Taunt**: Stops setup moves
- **Fake Out**: Flinches the setter
- **Priority Moves**: Work regardless of speed

## Max Moves for Speed Control

**Max Airstream**: The most common speed control option
- Use on fast Pokémon for immediate speed boost
- Great for maintaining momentum
- Combines well with Tailwind

**Max Quake**: Alternative speed control
- Boosts Special Defense
- Good for bulkier teams
- Less predictable than Airstream

## Team Building Considerations

When building for speed control:
1. **Multiple Options**: Don't rely on just one method
2. **Counter Options**: Have answers to opposing speed control
3. **Flexibility**: Be able to adapt mid-game
4. **Practice**: Test different scenarios extensively

## Tournament Application

In tournament play:
- **Scout Opponents**: Know their speed control options
- **Adapt Game Plans**: Don't stick to one strategy
- **Practice Scenarios**: Be comfortable with all speed control methods
- **Mental Preparation**: Stay calm when speed control fails

Speed control mastery takes time and practice, but it's essential for competitive success.`,
      author: {
        id: '1',
        name: 'Alex Rodriguez',
        avatar: 'AR',
        isVerified: true,
        achievements: ['Regional Champion', 'Top 8 Worlds 2023', 'Meta Analyst']
      },
      category: 'strategy-guide',
      tags: ['Speed Control', 'Strategy', 'Tailwind', 'Trick Room', 'Advanced'],
      status: 'pending',
      createdAt: '2024-03-18T16:00:00Z',
      readTime: 12,
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      summary: 'Advanced strategies for mastering speed control in VGC, including timing, counters, and tournament application.'
    }
  ]);

  const categories = [
    { id: 'all' as const, label: 'All Posts', icon: Eye },
    { id: 'meta-analysis' as const, label: 'Meta Analysis', icon: TrendingUp },
    { id: 'team-building' as const, label: 'Team Building', icon: Users },
    { id: 'tournament-report' as const, label: 'Tournament Reports', icon: Trophy },
    { id: 'strategy-guide' as const, label: 'Strategy Guides', icon: Star },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const statusMatch = activeTab === 'published' ? post.status === 'approved' :
                       activeTab === 'draft' ? post.status === 'draft' :
                       activeTab === 'pending' ? post.status === 'pending' : true;
    
    const categoryMatch = selectedCategory === 'all' || post.category === selectedCategory;
    
    const searchMatch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && categoryMatch && searchMatch;
  });

  // Filtered bookmarked posts
  const bookmarkedPosts = blogPosts.filter(post => post.isBookmarked);

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setIsAiReviewLoading(true);
    setAiReviewError(null);
    setAiReviewReasons([]);

    try {
      // AI review step with LLM integration
      const aiResult = await aiReviewBlogPost(newPost.title, newPost.content, {
        provider: 'mock', // Can be changed to 'huggingface' or 'openai'
        enabled: true, // Enable AI review
      });

      if (!aiResult.passed) {
        setAiReviewError(`Your post was flagged by our ${aiResult.reviewType} AI reviewer for the following reasons:`);
        setAiReviewReasons(aiResult.reasons);
        
        // Add suggestions if available
        if (aiResult.suggestions && aiResult.suggestions.length > 0) {
          setAiReviewReasons(prev => [...prev, '', 'Suggestions for improvement:', ...aiResult.suggestions!]);
        }
        
        setIsAiReviewLoading(false);
        return;
      }

      const post: BlogPost = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        author: {
          id: '1',
          name: 'Alex Rodriguez',
          avatar: 'AR',
          isVerified: true,
          achievements: ['Regional Champion', 'Top 8 Worlds 2023']
        },
        category: newPost.category,
        tags: newPost.tags,
        status: 'pending',
        createdAt: new Date().toISOString(),
        readTime: Math.ceil(newPost.content.split(' ').length / 200),
        likes: 0,
        comments: 0,
        isLiked: false,
        isBookmarked: false,
        summary: newPost.summary || newPost.content.substring(0, 150) + '...',
        aiFlagged: false,
        aiReviewReasons: [],
      };

      setBlogPosts(prev => [post, ...prev]);
      setShowCreateForm(false);
      setNewPost({
        title: '',
        content: '',
        category: 'meta-analysis',
        tags: [],
        summary: '',
        featuredImage: ''
      });
      setAiReviewError(null);
      setAiReviewReasons([]);
    } catch (error) {
      console.error('AI review error:', error);
      setAiReviewError('AI review failed. Please try again or contact support.');
    } finally {
      setIsAiReviewLoading(false);
    }
  };

  const handleApprovePost = (postId: string) => {
    setBlogPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, status: 'approved', publishedAt: new Date().toISOString() }
        : post
    ));
  };

  const handleRejectPost = (postId: string) => {
    setBlogPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, status: 'rejected' }
        : post
    ));
  };

  const handleLikePost = (postId: string) => {
    setBlogPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmarkPost = (postId: string) => {
    setBlogPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handlePostClick = (post: BlogPost) => {
    if (onPostSelect) {
      onPostSelect(post);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meta-analysis': return 'bg-blue-100 text-blue-800';
      case 'team-building': return 'bg-green-100 text-green-800';
      case 'tournament-report': return 'bg-yellow-100 text-yellow-800';
      case 'strategy-guide': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalLevelColor = (level?: string) => {
    switch (level) {
      case 'official_analyst': return 'bg-purple-100 text-purple-800';
      case 'content_creator': return 'bg-blue-100 text-blue-800';
      case 'brand_ambassador': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalLevelIcon = (level?: string) => {
    switch (level) {
      case 'official_analyst': return '📊';
      case 'content_creator': return '✍️';
      case 'brand_ambassador': return '🌟';
      default: return '✓';
    }
  };

  const canCreateContent = () => {
    return isVerifiedPlayer || isPokemonCompanyApproved || isAdmin;
  };

  const getContentCreationPrivileges = () => {
    if (isPokemonCompanyApproved) {
      return {
        canCreate: true,
        requiresApproval: false,
        badge: `${getApprovalLevelIcon(approvalLevel)} Pokémon Company ${approvalLevel?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        color: getApprovalLevelColor(approvalLevel)
      };
    }
    if (isVerifiedPlayer) {
      return {
        canCreate: true,
        requiresApproval: true,
        badge: '✓ Verified Player',
        color: 'bg-blue-100 text-blue-800'
      };
    }
    if (isAdmin) {
      return {
        canCreate: true,
        requiresApproval: false,
        badge: '👑 Admin',
        color: 'bg-red-100 text-red-800'
      };
    }
    return {
      canCreate: false,
      requiresApproval: false,
      badge: '',
      color: ''
    };
  };

  const privileges = getContentCreationPrivileges();

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Tips & Blog</h2>
            <p className="text-purple-100">Expert insights from verified players</p>
          </div>
          {canCreateContent() && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <PenTool className="h-4 w-4" />
              <span>Create Post</span>
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{blogPosts.filter(p => p.status === 'approved').length}</p>
            <p className="text-sm text-purple-100">Published Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{blogPosts.filter(p => p.status === 'pending').length}</p>
            <p className="text-sm text-purple-100">Pending Review</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{blogPosts.reduce((sum, p) => sum + p.likes, 0)}</p>
            <p className="text-sm text-purple-100">Total Likes</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px]"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 rounded-full transition-all min-h-[44px] whitespace-nowrap text-sm ${
              activeTab === 'published'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Published
          </button>
          {isVerifiedPlayer && (
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-4 py-2 rounded-full transition-all min-h-[44px] whitespace-nowrap text-sm ${
                activeTab === 'draft'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Drafts
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-full transition-all min-h-[44px] whitespace-nowrap text-sm ${
                activeTab === 'pending'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Pending Review
            </button>
          )}
          {isVerifiedPlayer && (
            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`px-4 py-2 rounded-full transition-all min-h-[44px] whitespace-nowrap text-sm ${
                activeTab === 'bookmarked'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Bookmarked
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Categories</h3>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all min-h-[44px] text-sm ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-6 border border-gray-200">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {post.author.avatar}
                  </div>
                  {post.author.isVerified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {post.author.isPokemonCompanyApproved && (
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {post.status !== 'approved' && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    )}
                    {post.isOfficialContent && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        🎮 Official
                      </span>
                    )}
                    {post.author.isPokemonCompanyApproved && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalLevelColor(post.author.approvalLevel)}`}>
                        {getApprovalLevelIcon(post.author.approvalLevel)} {post.author.approvalLevel?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Admin Actions */}
              {isAdmin && post.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprovePost(post.id)}
                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRejectPost(post.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Post Content */}
            <div 
              className="cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              <h4 className="text-xl font-bold text-gray-900 mb-2 hover:text-purple-600 transition-colors">{post.title}</h4>
              <p className="text-gray-600 mb-4">{post.summary}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Stats */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{post.comments} comments</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikePost(post.id);
                    }}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                      post.isLiked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span>❤️</span>
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShareTargetPost(post);
                      setShowShareModal(true);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Share Blog"
                  >
                    <Share2 className="h-4 w-4 text-blue-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkPost(post.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      post.isBookmarked
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PenTool className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600">
            {activeTab === 'published' ? 'No published posts match your criteria.' :
             activeTab === 'draft' ? 'You haven\'t created any drafts yet.' :
             'No posts are pending review.'}
          </p>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Post</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="meta-analysis">Meta Analysis</option>
                    <option value="team-building">Team Building</option>
                    <option value="tournament-report">Tournament Report</option>
                    <option value="strategy-guide">Strategy Guide</option>
                    {isPokemonCompanyApproved && (
                      <option value="pokemon-company-content">Pokémon Company Content</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary
                  </label>
                  <textarea
                    value={newPost.summary}
                    onChange={(e) => setNewPost(prev => ({ ...prev, summary: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief summary of your post..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Write your post content here... (Supports Markdown)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newPost.tags.join(', ')}
                    onChange={(e) => setNewPost(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="VGC, Meta, Strategy, etc."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.title.trim() || !newPost.content.trim() || isAiReviewLoading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isAiReviewLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AI Reviewing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        <span>Submit for Review</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* AI Review Info */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-sm text-blue-700">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">AI-Powered Content Review</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Your post will be automatically reviewed for content safety, quality, and community guidelines using advanced AI analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {aiReviewError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold text-red-600 mb-2">{aiReviewError}</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
              {aiReviewReasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              onClick={() => { setAiReviewError(null); setAiReviewReasons([]); }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showShareModal && shareTargetPost && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Share Blog Post</h3>
            <p className="mb-4 text-gray-700">Share <span className="font-bold">{shareTargetPost.title}</span> with another user:</p>
            <input
              type="text"
              value={shareRecipient}
              onChange={e => setShareRecipient(e.target.value)}
              placeholder="Enter username or email..."
              className="w-full p-2 border border-gray-300 rounded-lg mb-3"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShareSuccess(true);
                  setTimeout(() => {
                    setShowShareModal(false);
                    setShareSuccess(false);
                    setShareRecipient('');
                    setShareTargetPost(null);
                  }, 1200);
                }}
                disabled={!shareRecipient.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {shareSuccess ? 'Shared!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTips; 