import React, { useState, useCallback } from 'react';
import { Trophy, Calendar, Users, QrCode, UserCheck, BookOpen, Search, Heart, Award, MapPin, Clock, TrendingUp, Settings } from 'lucide-react';
import TournamentPairings from './TournamentPairings';
import ScalableTournamentRegistration from './ScalableTournamentRegistration';
import QRCodeGenerator from './QRCodeGenerator';
import EventCalendar from './EventCalendar';
import FollowingFeed from './FollowingFeed';
import PlayerSearch from './PlayerSearch';
import BlogTips from './BlogTips';
import BlogPostView from './BlogPostView';
import PlayerPerformanceTracker from './PlayerPerformanceTracker';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import { UserSession, BlogPost, Tournament } from '../types';
import { mockTournaments, mockPlayers } from '../data/mockData';
import BottomNav from './BottomNav';

type CompetitorTabType = 'home' | 'tournaments' | 'pairings' | 'calendar' | 'search' | 'blog' | 'following';

interface CompetitorViewProps {
  userSession: UserSession;
  onLogout: () => void;
  onGoHome: () => void;
  onSwitchView?: (view: 'competitor' | 'professor' | 'admin') => void;
}

const CompetitorView: React.FC<CompetitorViewProps> = ({ userSession, onLogout, onGoHome, onSwitchView }) => {
  const [activeTab, setActiveTab] = useState<CompetitorTabType>('home');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<'overview' | 'achievements' | 'history'>('overview');
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [followedPlayers, setFollowedPlayers] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(() => {
    // Prioritize active tournaments, then registration open, then upcoming, then completed
    const activeTournament = mockTournaments.find(t => t.status === 'ongoing');
    if (activeTournament) return activeTournament.id;
    
    const registrationTournament = mockTournaments.find(t => t.status === 'registration');
    if (registrationTournament) return registrationTournament.id;
    
    const upcomingTournament = mockTournaments.find(t => t.status === 'upcoming');
    if (upcomingTournament) return upcomingTournament.id;
    
    const completedTournament = mockTournaments.find(t => t.status === 'completed');
    if (completedTournament) return completedTournament.id;
    
    return mockTournaments[0]?.id || '';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const mockTournament = mockTournaments[0];

  const tabs = [
    { id: 'home' as CompetitorTabType, label: 'Home', icon: Trophy },
    { id: 'tournaments' as CompetitorTabType, label: 'Events', icon: Trophy },
    { id: 'pairings' as CompetitorTabType, label: 'Pairings', icon: Users },
    { id: 'calendar' as CompetitorTabType, label: 'Calendar', icon: Calendar },
    { id: 'search' as CompetitorTabType, label: 'Search', icon: Search },
    { id: 'blog' as CompetitorTabType, label: 'Blog', icon: BookOpen },
    { id: 'following' as CompetitorTabType, label: 'Following', icon: Heart },
  ];

  // Memoized handlers to prevent unnecessary re-renders
  const handleTournamentRegister = useCallback(async (tournamentId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Registered for tournament:', tournamentId);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleFollowToggle = useCallback((playerId: string) => {
    setFollowedPlayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  }, []);

  const handleBlogPostSelect = useCallback((post: BlogPost) => {
    setSelectedBlogPost(post);
  }, []);

  const handleBlogPostBack = useCallback(() => {
    setSelectedBlogPost(null);
  }, []);

  const handleBlogPostLike = useCallback((postId: string) => {
    console.log('Liked blog post:', postId);
  }, []);

  const handleBlogPostBookmark = useCallback((postId: string) => {
    console.log('Bookmarked blog post:', postId);
  }, []);

  const handleBlogPostComment = useCallback((postId: string, content: string) => {
    console.log('Commented on blog post:', postId, content);
  }, []);

  const handleTabChange = useCallback((tabId: CompetitorTabType) => {
    setActiveTab(tabId);
  }, []);

  const handlePlayerSelect = useCallback((playerId: string) => {
    setSelectedPlayer(playerId);
    // Optionally reset tab or keep last
    // setProfileActiveTab('overview');
  }, []);

  const handlePlayerBack = useCallback(() => {
    setSelectedPlayer(null);
    // Do NOT reset profileActiveTab so it is preserved
  }, []);

  const handleTournamentSelect = useCallback((tournamentId: string) => {
    setSelectedTournamentId(tournamentId);
  }, []);

  const handleTournamentClick = useCallback((tournamentId: string) => {
    // Find the tournament to check if it's live
    const tournament = mockTournaments.find(t => t.id === tournamentId);
    if (tournament && tournament.status === 'ongoing') {
      // Navigate to pairings tab and select this tournament
      setSelectedTournamentId(tournamentId);
      setActiveTab('pairings');
    } else {
      // For non-live tournaments, just select them
      setSelectedTournamentId(tournamentId);
    }
  }, []);

  const handleSettingsToggle = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleViewSwitch = useCallback((view: 'competitor' | 'professor' | 'admin') => {
    if (onSwitchView) {
      onSwitchView(view);
    }
    setShowSettings(false);
  }, [onSwitchView]);

  const renderActiveTab = () => {
    // Show player profile if a player is selected AND we're on a profile-related tab
    if (selectedPlayer && (activeTab === 'following' || activeTab === 'search')) {
      const selectedPlayerData = mockPlayers.find(p => p.id === selectedPlayer);
      if (selectedPlayerData) {
        return (
          <Profile
            isOwnProfile={false}
            playerId={selectedPlayer}
            activeTab={profileActiveTab}
            onTabChange={setProfileActiveTab}
          />
        );
      }
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="container-responsive space-responsive space-y-6">
            {/* Personal Dashboard Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">Your Dashboard</h2>
                  <p className="text-indigo-100 text-wrap">Track your VGC journey</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{userSession.division.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              
              {/* Personal Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-indigo-100">Tournaments</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-xs text-indigo-100">Win Rate</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-indigo-100">Top 8s</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid-responsive">
              <button 
                onClick={() => handleTabChange('tournaments')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-wrap">Browse Events</p>
                    <p className="text-sm text-gray-600 text-wrap">Find tournaments</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('leaderboard')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-wrap">Leaderboard</p>
                    <p className="text-sm text-gray-600 text-wrap">See rankings</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('following')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-wrap">Following</p>
                    <p className="text-sm text-gray-600 text-wrap">Track players</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('qr')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-wrap">QR Code</p>
                    <p className="text-sm text-gray-600 text-wrap">Check in</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Top 4 Finish</p>
                    <p className="text-xs text-gray-600">Phoenix Regional Championships</p>
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Registered</p>
                    <p className="text-xs text-gray-600">Seattle Spring Championships</p>
                  </div>
                  <span className="text-xs text-gray-500">1 week ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Started Following</p>
                    <p className="text-xs text-gray-600">Alex Rodriguez</p>
                  </div>
                  <span className="text-xs text-gray-500">1 week ago</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events Preview */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
                <button 
                  onClick={() => handleTabChange('tournaments')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {mockTournaments.slice(0, 2).map((tournament) => (
                  <div key={tournament.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                      <p className="text-sm text-gray-600">{tournament.location} • {new Date(tournament.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tournament.status === 'registration' ? 'bg-green-100 text-green-800' :
                      tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tournaments':
        return (
          <div className="container-responsive space-responsive space-y-6">
            {/* Tournament Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">Tournaments</h2>
                  <p className="text-blue-100 text-wrap">Find and register for events</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'registration').length}</p>
                    <p className="text-xs text-blue-100">Open for Registration</p>
                  </div>
                </div>
              </div>
              
              {/* Tournament Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'upcoming').length}</p>
                  <p className="text-xs text-blue-100">Upcoming</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'ongoing').length}</p>
                  <p className="text-xs text-blue-100">Live Now</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'completed').length}</p>
                  <p className="text-xs text-blue-100">Completed</p>
                </div>
              </div>
            </div>

            {/* Tournament Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                  All Events
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                  Registration Open
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                  Upcoming
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                  Live Now
                </button>
              </div>
            </div>

            {/* Tournament Listings */}
            <div className="space-y-4">
              {mockTournaments.map((tournament) => (
                <div key={tournament.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{tournament.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tournament.status === 'registration' ? 'bg-green-100 text-green-800' :
                          tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          tournament.status === 'ongoing' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(tournament.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{tournament.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{tournament.currentRegistrations}/{tournament.maxCapacity} registered</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Registration */}
                  {tournament.status === 'registration' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Capacity</span>
                        <span>{tournament.currentRegistrations} / {tournament.maxCapacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            (tournament.currentRegistrations / tournament.maxCapacity) > 0.8 ? 'bg-red-500' :
                            (tournament.currentRegistrations / tournament.maxCapacity) > 0.5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(tournament.currentRegistrations / tournament.maxCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {tournament.status === 'registration' && (
                        <button
                          onClick={() => {
                            setSelectedTournamentId(tournament.id);
                            // This would open the registration modal
                            console.log('Register for tournament:', tournament.id);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Register Now
                        </button>
                      )}
                      {tournament.status === 'ongoing' && (
                        <button
                          onClick={() => {
                            setSelectedTournamentId(tournament.id);
                            handleTabChange('pairings');
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                        >
                          View Pairings
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedTournamentId(tournament.id);
                          // This would open tournament details
                          console.log('View tournament details:', tournament.id);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${tournament.entryFee}</p>
                      <p className="text-xs text-gray-500">Entry Fee</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid-responsive">
              <button 
                onClick={() => handleTabChange('calendar')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-wrap">Calendar View</p>
                    <p className="text-sm text-gray-600 text-wrap">See all events</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => handleTabChange('search')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-wrap">Search Players</p>
                    <p className="text-sm text-gray-600 text-wrap">Find competitors</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 'pairings': {
        const selectedTournament = mockTournaments.find(t => t.id === selectedTournamentId) || mockTournaments[0];
        return (
          <div className="container-responsive space-responsive space-y-6">
            {/* Tournament Selector */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Tournament Pairings</h3>
              </div>
              <select
                value={selectedTournamentId}
                onChange={e => handleTournamentSelect(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                disabled={isLoading}
              >
                {/* Group tournaments by status */}
                {(() => {
                  const completedTournaments = mockTournaments.filter(t => t.status === 'completed');
                  const activeTournaments = mockTournaments.filter(t => t.status === 'ongoing');
                  const registrationTournaments = mockTournaments.filter(t => t.status === 'registration');
                  const upcomingTournaments = mockTournaments.filter(t => t.status === 'upcoming');

                  return (
                    <>
                      {/* Completed Tournaments */}
                      {completedTournaments.length > 0 && (
                        <optgroup label="🏆 Completed Tournaments">
                          {completedTournaments.map(t => (
                            <option key={t.id} value={t.id} className="text-gray-600">
                              {t.name} - {new Date(t.date).toLocaleDateString()}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Active Tournaments */}
                      {activeTournaments.length > 0 && (
                        <optgroup label="⚡ Active Tournaments">
                          {activeTournaments.map(t => (
                            <option key={t.id} value={t.id} className="text-green-600 font-semibold">
                              {t.name} - LIVE
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Registration Open Tournaments */}
                      {registrationTournaments.length > 0 && (
                        <optgroup label="📝 Registration Open">
                          {registrationTournaments.map(t => (
                            <option key={t.id} value={t.id} className="text-blue-600">
                              {t.name} - {new Date(t.date).toLocaleDateString()} ({t.currentRegistrations}/{t.maxCapacity})
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Upcoming Tournaments */}
                      {upcomingTournaments.length > 0 && (
                        <optgroup label="📅 Upcoming Tournaments">
                          {upcomingTournaments.map(t => (
                            <option key={t.id} value={t.id} className="text-gray-500">
                              {t.name} - {new Date(t.date).toLocaleDateString()}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </>
                  );
                })()}
              </select>
              
              {/* Tournament Status Indicator */}
              {(() => {
                const selectedTournament = mockTournaments.find(t => t.id === selectedTournamentId);
                if (!selectedTournament) return null;

                const getStatusInfo = (status: string) => {
                  switch (status) {
                    case 'completed':
                      return { color: 'bg-purple-100 text-purple-800', icon: '🏆', text: 'Completed' };
                    case 'ongoing':
                      return { color: 'bg-green-100 text-green-800', icon: '⚡', text: 'Live Now' };
                    case 'registration':
                      return { color: 'bg-blue-100 text-blue-800', icon: '📝', text: 'Registration Open' };
                    case 'upcoming':
                      return { color: 'bg-gray-100 text-gray-800', icon: '📅', text: 'Upcoming' };
                    default:
                      return { color: 'bg-gray-100 text-gray-800', icon: '❓', text: 'Unknown' };
                  }
                };

                const statusInfo = getStatusInfo(selectedTournament.status);

                return (
                  <div className={`mt-3 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 px-3 py-2 rounded-lg ${statusInfo.color}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{statusInfo.icon}</span>
                      <span className="font-medium text-wrap">{statusInfo.text}</span>
                    </div>
                    {selectedTournament.status === 'registration' && (
                      <span className="text-sm text-wrap">
                        • {selectedTournament.currentRegistrations}/{selectedTournament.maxCapacity} registered
                      </span>
                    )}
                    {selectedTournament.status === 'ongoing' && (
                      <span className="text-sm text-wrap">
                        • {selectedTournament.totalPlayers} players competing
                      </span>
                    )}
                    {selectedTournament.status === 'completed' && (
                      <span className="text-sm text-wrap">
                        • {selectedTournament.totalPlayers} players competed
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
            <TournamentPairings
              tournamentId={selectedTournament.id}
              tournamentName={selectedTournament.name}
              isRegistered={selectedTournament.isRegistered ?? true}
              userDivision={userSession.division}
              pairings={selectedTournament.pairings || []}
              tournament={selectedTournament}
              currentPlayerId={userSession.userId}
            />
          </div>
        );
      }

      case 'calendar':
        return (
          <div className="container-responsive space-responsive">
            <EventCalendar />
          </div>
        );

      case 'search':
        return (
          <div className="container-responsive space-responsive">
            <PlayerSearch onPlayerSelect={handlePlayerSelect} />
          </div>
        );

      case 'blog':
        if (selectedBlogPost) {
          return (
            <div className="container-responsive space-responsive">
              <BlogPostView
                post={selectedBlogPost}
                onBack={handleBlogPostBack}
                onLike={handleBlogPostLike}
                onBookmark={handleBlogPostBookmark}
                onComment={handleBlogPostComment}
              />
            </div>
          );
        }
        return (
          <div className="container-responsive space-responsive">
            <BlogTips 
              isVerifiedPlayer={userSession.division === 'master'} 
              isAdmin={false}
              isPokemonCompanyApproved={false}
              onPostSelect={handleBlogPostSelect}
            />
          </div>
        );

      case 'leaderboard':
        return (
          <div className="container-responsive space-responsive">
            <Leaderboard 
              players={mockPlayers}
              currentPlayerId={userSession.userId}
              onPlayerSelect={handlePlayerSelect}
            />
          </div>
        );

      case 'qr':
        return (
          <div className="container-responsive space-responsive">
            <QRCodeGenerator
              playerId={userSession.userId}
              tournamentId={mockTournament.id}
              playerName="TrainerMaster"
              tournamentName={mockTournament.name}
              division={userSession.division}
            />
          </div>
        );

      case 'following':
        return (
          <div className="container-responsive space-responsive">
            <FollowingFeed 
              onPlayerSelect={handlePlayerSelect} 
              onTournamentClick={handleTournamentClick}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">VGC Hub</h1>
              <p className="text-xs text-gray-500">Competitor View</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-gray-900">VGC Hub</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{userSession.name || 'TrainerMaster'}</p>
              <p className="text-xs text-gray-500 capitalize">{userSession.division} Division</p>
            </div>
            <button
              onClick={handleSettingsToggle}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={onGoHome}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
              aria-label="Go home"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
              aria-label="Logout"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Back button for player view */}
      {selectedPlayer && (
        <button
          onClick={handlePlayerBack}
          className="fixed top-20 left-4 z-40 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
          aria-label="Go back"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Settings</h3>
              <button
                onClick={handleSettingsToggle}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Switch View</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleViewSwitch('competitor')}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Competitor View</p>
                        <p className="text-sm text-gray-600">Standard player interface</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                      Current
                    </div>
                  </button>

                  <button
                    onClick={() => handleViewSwitch('professor')}
                    className="w-full flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Professor View</p>
                        <p className="text-sm text-gray-600">Tournament creation & management</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium">
                      Available
                    </div>
                  </button>

                  <button
                    onClick={() => handleViewSwitch('admin')}
                    className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Admin View</p>
                        <p className="text-sm text-gray-600">Full system administration</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
                      Available
                    </div>
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Account Settings</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Profile Settings</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Privacy Settings</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Notification Preferences</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {renderActiveTab()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default CompetitorView; 