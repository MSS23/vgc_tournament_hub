import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Clock, Trophy, Users, Plus, MessageSquare } from 'lucide-react';
import CreatePost from './CreatePost';
import DirectMessages from './DirectMessages';
import SearchBrowse from './SearchBrowse';

interface SocialPost {
  id: string;
  type: 'tournament_result' | 'team_share' | 'achievement';
  user: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  content: {
    title: string;
    description?: string;
    tournament?: string;
    placement?: number;
    team?: string[];
    achievement?: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface SocialFeedProps {
  onPlayerSelect?: (playerId: string) => void;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ onPlayerSelect }) => {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: '0',
      type: 'team_share',
      user: { name: 'TrainerMaster', avatar: 'TM' },
      timestamp: 'Just now',
      content: {
        title: 'Testing my new Miraidon team build',
        description: 'This team has been performing really well in practice. The Miraidon + Flutter Mane core is incredible!',
        team: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'],
      },
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '1',
      type: 'tournament_result',
      user: { name: 'Alex Rodriguez', avatar: 'AR' },
      timestamp: '2 hours ago',
      content: {
        title: 'Just finished 4th at Phoenix Regionals!',
        description: 'Great tournament with some amazing matches. My Charizard team performed really well!',
        tournament: 'Phoenix Regional Championships',
        placement: 4,
        team: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'],
      },
      likes: 24,
      comments: 8,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '2',
      type: 'team_share',
      user: { name: 'Sarah Kim', avatar: 'SK' },
      timestamp: '5 hours ago',
      content: {
        title: 'New team build - Miraidon/Flutter Mane core',
        description: 'Been testing this combo and it\'s been working great! The synergy is incredible.',
        team: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri'],
      },
      likes: 18,
      comments: 12,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: '3',
      type: 'achievement',
      user: { name: 'Marcus Johnson', avatar: 'MJ' },
      timestamp: '1 day ago',
      content: {
        title: 'Hit 2200 rating!',
        description: 'Finally broke through the 2200 barrier after months of grinding. Next stop: Worlds qualification!',
        achievement: 'Reached 2200+ rating',
      },
      likes: 45,
      comments: 15,
      isLiked: false,
      isBookmarked: true,
    },
  ]);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleNewPost = (newPost: SocialPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'tournament_result':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'team_share':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-purple-500" />;
      default:
        return <Trophy className="h-5 w-5 text-gray-500" />;
    }
  };

  if (showSearch) {
    return <SearchBrowse onPlayerSelect={onPlayerSelect} />;
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold">Community Feed</h2>
            <p className="text-purple-100">See what the VGC community is up to</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSearch(true)}
              className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
            >
              <Search className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowMessages(true)}
              className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
            >
              <MessageSquare className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowCreatePost(true)}
              className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-4 border border-gray-200">
            {/* Post Header */}
            <div className="flex items-start space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {post.user.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">{post.user.name}</h4>
                  {getPostIcon(post.type)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.timestamp}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">{post.content.title}</h3>
              {post.content.description && (
                <p className="text-gray-700 mb-3">{post.content.description}</p>
              )}

              {/* Tournament Result */}
              {post.type === 'tournament_result' && post.content.tournament && (
                <div className="bg-yellow-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-yellow-800">{post.content.tournament}</p>
                      <p className="text-sm text-yellow-600">Placement: #{post.content.placement}</p>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      #{post.content.placement}
                    </div>
                  </div>
                </div>
              )}

              {/* Team Preview */}
              {post.content.team && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-2">Team:</p>
                  <div className="flex flex-wrap gap-2">
                    {post.content.team.map((pokemon, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border"
                      >
                        {pokemon}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievement */}
              {post.type === 'achievement' && post.content.achievement && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    <p className="font-medium text-purple-800">{post.content.achievement}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
              <button
                onClick={() => handleBookmark(post.id)}
                className={`transition-colors ${
                  post.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                <Bookmark className={`h-5 w-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
          Load More Posts
        </button>
      </div>

      {/* Create Post Modal */}
      <CreatePost
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPost={handleNewPost}
      />

      {/* Direct Messages */}
      <DirectMessages
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
      />
    </div>
  );
};

export default SocialFeed;