import React, { useState } from 'react';
import { Shield, Users, FileText, CheckCircle, XCircle, AlertTriangle, Filter, Search, Calendar, Award, MapPin } from 'lucide-react';
import { BlogPost, Player, AdminUser } from '../types';

interface AdminPanelProps {
  isAdmin: boolean;
  isPokemonCompanyOfficial?: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin, isPokemonCompanyOfficial = false }) => {
  const [activeTab, setActiveTab] = useState<'blog-posts' | 'user-verification' | 'reports' | 'analytics' | 'tournament-requests'>('blog-posts');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock admin data
  const [pendingBlogPosts] = useState<BlogPost[]>([
    {
      id: '4',
      title: 'Advanced Speed Control Strategies',
      content: 'Speed control is arguably the most important aspect of VGC...',
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
      summary: 'Advanced strategies for mastering speed control in VGC, including timing, counters, and tournament application.',
      aiFlagged: true, // Added for AI flagged badge
      aiReviewReasons: ['Contains inappropriate language', 'Promotes violence or hate speech'] // Added for AI flagged badge
    }
  ]);

  const [pendingVerifications] = useState<Player[]>([
    {
      id: '4',
      name: 'Emily Chen',
      playerId: 'EC2024',
      region: 'North America',
      division: 'master',
      championships: 2,
      winRate: 78,
      rating: 1850,
      tournaments: [],
      isVerified: false,
      privacySettings: {
        profileVisibility: 'public',
        teamShowcaseVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true
      }
    }
  ]);

  const [reports] = useState([
    {
      id: '1',
      type: 'inappropriate_content',
      reporter: 'User123',
      reportedUser: 'User456',
      content: 'This post contains inappropriate language',
      status: 'pending',
      createdAt: '2024-03-18T10:00:00Z'
    }
  ]);

  // Mock tournament creation requests
  const [tournamentRequests] = useState([
    {
      id: 'req-1',
      professorName: 'Alex Rodriguez',
      professorLevel: 'full',
      certificationNumber: 'PROF-2023-001',
      tournamentName: 'Phoenix Regional Championships 2024',
      date: '2024-03-15',
      location: 'Phoenix Convention Center, AZ',
      maxCapacity: 700,
      status: 'pending',
      submittedAt: '2024-01-15T10:00:00Z',
      requiresPokemonCompanyApproval: true,
      pokemonCompanyStatus: 'pending'
    },
    {
      id: 'req-2',
      professorName: 'Sarah Chen',
      professorLevel: 'associate',
      certificationNumber: 'PROF-2023-045',
      tournamentName: 'Seattle Spring Championships 2024',
      date: '2024-04-20',
      location: 'Seattle Convention Center, WA',
      maxCapacity: 500,
      status: 'pending',
      submittedAt: '2024-03-18T16:00:00Z',
      requiresPokemonCompanyApproval: true,
      pokemonCompanyStatus: 'pending'
    }
  ]);

  const tabs = [
    { id: 'blog-posts' as const, label: 'Blog Posts', icon: FileText },
    { id: 'user-verification' as const, label: 'User Verification', icon: Users },
    { id: 'reports' as const, label: 'Reports', icon: AlertTriangle },
    { id: 'analytics' as const, label: 'Analytics', icon: Award },
    ...(isPokemonCompanyOfficial ? [{ id: 'tournament-requests' as const, label: 'Tournament Requests', icon: Calendar }] : [])
  ];

  const handleApproveBlogPost = (postId: string) => {
    console.log('Approved blog post:', postId);
  };

  const handleRejectBlogPost = (postId: string) => {
    console.log('Rejected blog post:', postId);
  };

  const handleVerifyUser = (userId: string) => {
    console.log('Verified user:', userId);
  };

  const handleRejectUser = (userId: string) => {
    console.log('Rejected user:', userId);
  };

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'warn' | 'ban') => {
    console.log('Resolved report:', reportId, action);
  };

  const handleApproveTournament = (requestId: string) => {
    console.log('Approved tournament request:', requestId);
  };

  const handleRejectTournament = (requestId: string) => {
    console.log('Rejected tournament request:', requestId);
  };

  if (!isAdmin && !isPokemonCompanyOfficial) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-red-100">
              {isPokemonCompanyOfficial ? 'Pokémon Company Official Dashboard' : 'Manage content and user verification'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="text-sm">
              {isPokemonCompanyOfficial ? 'Pokémon Company Official' : 'Administrator'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{pendingBlogPosts.length}</p>
            <p className="text-sm text-red-100">Pending Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingVerifications.length}</p>
            <p className="text-sm text-red-100">Pending Verifications</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{reports.length}</p>
            <p className="text-sm text-red-100">Active Reports</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{tournamentRequests.filter(r => r.status === 'pending').length}</p>
            <p className="text-sm text-red-100">Tournament Requests</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Content */}
      {activeTab === 'blog-posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Blog Post Moderation</h3>
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'rejected'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedFilter === filter
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {pendingBlogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {post.author.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{post.title}</h4>
                      <p className="text-sm text-gray-600">by {post.author.name}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      {/* AI Reviewer Badge */}
                      {(post.aiFlagged || (post.aiReviewReasons && post.aiReviewReasons.length > 0)) && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="px-2 py-1 bg-yellow-200 text-yellow-900 rounded-full text-xs font-semibold flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" /> AI Flagged
                          </span>
                          <ul className="list-disc pl-4 text-xs text-yellow-900">
                            {post.aiReviewReasons?.map((reason, i) => (
                              <li key={i}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    post.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{post.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {post.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveBlogPost(post.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectBlogPost(post.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'user-verification' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">User Verification Requests</h3>
          <div className="space-y-4">
            {pendingVerifications.map((user) => (
              <div key={user.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.region} • {user.division}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Award className="h-4 w-4 mr-1" />
                        {user.championships} championships • {user.winRate}% WR
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Player ID: {user.playerId} • Rating: {user.rating}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVerifyUser(user.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Verify</span>
                    </button>
                    <button
                      onClick={() => handleRejectUser(user.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">User Reports</h3>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Report #{report.id}</h4>
                    <p className="text-sm text-gray-600">
                      Reported by {report.reporter} against {report.reportedUser}
                    </p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{report.content}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Type: {report.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  {report.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleResolveReport(report.id, 'dismiss')}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'warn')}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors text-sm"
                      >
                        Warn User
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'ban')}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors text-sm"
                      >
                        Ban User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">User Growth</h4>
              <p className="text-2xl font-bold text-green-600">+15%</p>
              <p className="text-sm text-gray-600">This month</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Content Engagement</h4>
              <p className="text-2xl font-bold text-blue-600">2.4K</p>
              <p className="text-sm text-gray-600">Total interactions</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Active Users</h4>
              <p className="text-2xl font-bold text-purple-600">1.2K</p>
              <p className="text-sm text-gray-600">Daily average</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Report Rate</h4>
              <p className="text-2xl font-bold text-orange-600">0.3%</p>
              <p className="text-sm text-gray-600">Of total content</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tournament-requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Tournament Creation Requests</h3>
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'rejected'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    selectedFilter === filter
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {tournamentRequests
              .filter(req => selectedFilter === 'all' || req.status === selectedFilter)
              .map((request) => (
                <div key={request.id} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                        {request.professorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.tournamentName}</h4>
                        <p className="text-sm text-gray-600">by {request.professorName} ({request.professorLevel})</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(request.date).toLocaleDateString()}
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          {request.location}
                          <span className="mx-2">•</span>
                          <Users className="h-4 w-4 mr-1" />
                          {request.maxCapacity} players
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.requiresPokemonCompanyApproval && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Pokémon Company Review Required
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Professor ID: {request.certificationNumber} • Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveTournament(request.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectTournament(request.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 