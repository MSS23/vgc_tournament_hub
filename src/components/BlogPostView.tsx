import React, { useState } from 'react';
import { ArrowLeft, Heart, Bookmark, Share2, Clock, Users, CheckCircle, Calendar } from 'lucide-react';
import { BlogPost, BlogComment } from '../types';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  onBack,
  onLike,
  onBookmark,
  onComment
}) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  // Mock comments data
  const [comments] = useState([
    {
      id: '1',
      author: { name: 'John Doe', avatar: 'JD', isVerified: true },
      content: 'Great analysis! This really helped me understand the meta better.',
      timestamp: '2024-03-15T11:00:00Z',
      likes: 5,
      isLiked: false
    },
    {
      id: '2',
      author: { name: 'Jane Smith', avatar: 'JS', isVerified: false },
      content: 'I\'ve been using this strategy and it works really well!',
      timestamp: '2024-03-15T10:30:00Z',
      likes: 3,
      isLiked: true
    }
  ]);

  const handleSubmitComment = () => {
    if (comment.trim()) {
      // In a real app, this would submit the comment to the backend
      console.log('Comment submitted:', comment);
      setComment('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    // In a real app, this would like/unlike the comment
    console.log('Liked comment:', commentId);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'meta-analysis': return 'bg-blue-100 text-blue-800';
      case 'team-building': return 'bg-green-100 text-green-800';
      case 'tournament-report': return 'bg-purple-100 text-purple-800';
      case 'strategy-guide': return 'bg-orange-100 text-orange-800';
      case 'pokemon-company-content': return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Blog Post</h1>
      </div>

      {/* Post Content */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        {/* Author Info */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              {post.author.avatar}
            </div>
            {post.author.isPokemonCompanyApproved && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎮</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-lg font-semibold text-gray-900">{post.author.name}</h2>
              {post.author.isVerified && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  ✓ Verified
                </span>
              )}
              {post.isOfficialContent && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  🎮 Official Content
                </span>
              )}
              {post.author.isPokemonCompanyApproved && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalLevelColor(post.author.approvalLevel)}`}>
                  {getApprovalLevelIcon(post.author.approvalLevel)} Pokémon Company {post.author.approvalLevel?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.readTime} min read</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                post.isLiked
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => onBookmark(post.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                post.isBookmarked
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
              <span>Bookmark</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
          
          {/* Add Comment */}
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleSubmitComment}
                disabled={!comment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-sm">
                    {comment.author.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{comment.author.name}</span>
                      {comment.author.isVerified && (
                        <span className="px-1 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                          ✓
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{comment.content}</p>
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center space-x-1 text-sm transition-colors ${
                        comment.isLiked
                          ? 'text-red-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostView; 