import React, { useState, useCallback } from 'react';
import { Trophy, Calendar, Users, QrCode, Eye, UserCheck, BookOpen, Search, Heart, Award, MapPin, Clock, TrendingUp } from 'lucide-react';
import TournamentPairings from './TournamentPairings';
import ScalableTournamentRegistration from './ScalableTournamentRegistration';
import QRCodeGenerator from './QRCodeGenerator';
import TeamShowcase from './TeamShowcase';
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

type CompetitorTabType = 'tournaments' | 'pairings' | 'showcase' | 'qr' | 'calendar' | 'following' | 'search' | 'blog' | 'leaderboard';

interface CompetitorViewProps {
  userSession: UserSession;
  onLogout: () => void;
}

const CompetitorView: React.FC<CompetitorViewProps> = ({ userSession, onLogout }) => {
  const [activeTab, setActiveTab] = useState<CompetitorTabType>('tournaments');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<'overview' | 'achievements' | 'history'>('overview');
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [followedPlayers, setFollowedPlayers] = useState<Set<string>>(new Set());
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
    { id: 'tournaments' as CompetitorTabType, label: 'Events', icon: Trophy },
    { id: 'pairings' as CompetitorTabType, label: 'Pairings', icon: Users },
    { id: 'showcase' as CompetitorTabType, label: 'Showcase', icon: Eye },
    { id: 'qr' as CompetitorTabType, label: 'QR Code', icon: QrCode },
    { id: 'calendar' as CompetitorTabType, label: 'Calendar', icon: Calendar },
    { id: 'following' as CompetitorTabType, label: 'Following', icon: UserCheck },
    { id: 'search' as CompetitorTabType, label: 'Search', icon: Search },
    { id: 'blog' as CompetitorTabType, label: 'Tips & Blog', icon: BookOpen },
    { id: 'leaderboard' as CompetitorTabType, label: 'Leaderboard', icon: TrendingUp },
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

  const handleTeamShowcaseSave = useCallback((showcase: any) => {
    console.log('Team showcase saved:', showcase);
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
      case 'tournaments':
        return (
          <div className="container-responsive space-responsive space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome, Trainer!</h2>
              <p className="text-blue-100">Ready to compete in the next tournament?</p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold capitalize">{userSession.division}</p>
                  <p className="text-sm text-blue-100">Division</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-blue-100">Upcoming Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-blue-100">Following</p>
                </div>
              </div>
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
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">View Calendar</p>
                    <p className="text-sm text-gray-600">Find tournaments</p>
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
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Search Players</p>
                    <p className="text-sm text-gray-600">Find competitors</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Tournament Registration */}
            <ScalableTournamentRegistration
              tournament={mockTournament}
              userDivision={userSession.division}
              onRegister={handleTournamentRegister}
              isAdmin={false}
            />
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div className={`mt-3 flex items-center space-x-2 px-3 py-2 rounded-lg ${statusInfo.color}`}>
                    <span className="text-lg">{statusInfo.icon}</span>
                    <span className="font-medium">{statusInfo.text}</span>
                    {selectedTournament.status === 'registration' && (
                      <span className="text-sm">
                        • {selectedTournament.currentRegistrations}/{selectedTournament.maxCapacity} registered
                      </span>
                    )}
                    {selectedTournament.status === 'ongoing' && (
                      <span className="text-sm">
                        • {selectedTournament.totalPlayers} players competing
                      </span>
                    )}
                    {selectedTournament.status === 'completed' && (
                      <span className="text-sm">
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

      case 'showcase':
        return (
          <div className="container-responsive space-responsive">
            <TeamShowcase
              userDivision={userSession.division}
              isGuardianApprovalRequired={userSession.division !== 'master'}
              onSave={handleTeamShowcaseSave}
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

      case 'calendar':
        return (
          <div className="container-responsive space-responsive">
            <EventCalendar />
          </div>
        );

      case 'following':
        return (
          <div className="container-responsive space-responsive">
            <FollowingFeed onPlayerSelect={handlePlayerSelect} />
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-responsive flex items-center justify-between py-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">VGC Hub</h1>
              <p className="text-xs text-gray-500">Competitor View</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">TrainerMaster</p>
              <p className="text-xs text-gray-500 capitalize">{userSession.division} Division</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
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
          className="fixed top-20 left-4 z-40 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
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

      {/* Main Content */}
      <main className="pb-20 pt-16">
        {renderActiveTab()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={isLoading}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CompetitorView; 