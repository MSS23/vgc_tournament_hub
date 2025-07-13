import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import { Trophy, Calendar, Users, QrCode, UserCheck, BookOpen, Search, Heart, Award, MapPin, Clock, TrendingUp, Settings, HelpCircle, Ticket } from 'lucide-react';
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
import SupportAndFAQs from './SupportAndFAQs';
import TicketsPage from './TicketsPage';
import TournamentLeaderboard from './TournamentLeaderboard';
import { UserSession, BlogPost, Tournament } from '../types';
import { mockTournaments, mockPlayers } from '../data/mockData';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageDropdown from './LanguageDropdown';
import AppLayout from './AppLayout';

type CompetitorTabType = 'home' | 'tournaments' | 'pairings' | 'calendar' | 'search' | 'blog' | 'following' | 'support' | 'tickets';

interface CompetitorViewProps {
  userSession: UserSession;
  onLogout: () => void;
  onGoHome: () => void;
  onSwitchView?: (view: 'competitor' | 'professor' | 'admin') => void;
}

const CompetitorView: React.FC<CompetitorViewProps> = ({ userSession, onLogout, onGoHome, onSwitchView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<CompetitorTabType>('home');
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
  const [highlightedPlayerId, setHighlightedPlayerId] = useState<string | undefined>(undefined);
  const [highlightRound, setHighlightRound] = useState<number | undefined>(undefined);
  const [highlightTable, setHighlightTable] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTournamentName, setSelectedTournamentName] = useState<string | null>(null);
  const [tournamentFilter, setTournamentFilter] = useState<'all' | 'registration' | 'upcoming' | 'live'>('all');
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<{ open: boolean; tournament: any | null }>({ open: false, tournament: null });

  const mockTournament = mockTournaments[0];

  const tabs = [
    { id: 'home' as CompetitorTabType, label: t('tabs.home', 'Home'), icon: Trophy },
    { id: 'tournaments' as CompetitorTabType, label: t('tabs.events', 'Events'), icon: Trophy },
    { id: 'pairings' as CompetitorTabType, label: t('tabs.pairings', 'Pairings'), icon: Users },
    { id: 'calendar' as CompetitorTabType, label: t('tabs.calendar', 'Calendar'), icon: Calendar },
    { id: 'search' as CompetitorTabType, label: t('tabs.search', 'Search'), icon: Search },
    { id: 'blog' as CompetitorTabType, label: t('tabs.blog', 'Blog'), icon: BookOpen },
    { id: 'following' as CompetitorTabType, label: t('tabs.following', 'Following'), icon: Heart },
    { id: 'tickets' as CompetitorTabType, label: t('tabs.tickets', 'Tickets'), icon: Ticket },
    { id: 'support' as CompetitorTabType, label: t('tabs.support', 'Support'), icon: HelpCircle },
  ];

  // Sync tab state with URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab') as CompetitorTabType;
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search, tabs]);

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
    // Update URL with tab parameter
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('tab', tabId);
    navigate(`/competitor?${urlParams.toString()}`);
  }, [navigate, location.search]);

  const handlePlayerSelect = useCallback((playerId: string) => {
    navigate(`/profile/${playerId}`);
  }, [navigate]);

  const handleViewFullRun = useCallback((playerId: string, tournamentName: string) => {
    // setSelectedPlayer(playerId); // Removed
    setProfileActiveTab('history');
    setSelectedTournamentName(tournamentName);
    setActiveTab('search'); // or whatever tab shows the profile
  }, []);

  const handlePlayerBack = useCallback(() => {
    // setSelectedPlayer(null); // Removed
    setSelectedTournamentName(null);
    // Do NOT reset profileActiveTab so it is preserved
  }, []);

  const handleTournamentSelect = useCallback((tournamentId: string) => {
    setSelectedTournamentId(tournamentId);
  }, []);

  const handleTournamentClick = useCallback((tournamentId: string, playerId?: string, round?: number, table?: number) => {
    // Update state and URL with all relevant params
    setSelectedTournamentId(tournamentId);
    setHighlightedPlayerId(playerId);
    setActiveTab('pairings');
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('tab', 'pairings');
    urlParams.set('tournamentId', tournamentId);
    if (playerId) urlParams.set('highlightPlayerId', playerId);
    if (round) urlParams.set('highlightRound', String(round));
    if (table) urlParams.set('highlightTable', String(table));
    navigate(`/competitor?${urlParams.toString()}`);
  }, [navigate, location.search]);

  // On mount or location change, read highlight params from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab') as CompetitorTabType;
    const tournamentIdParam = urlParams.get('tournamentId');
    const highlightPlayerIdParam = urlParams.get('highlightPlayerId');
    const highlightRoundParam = urlParams.get('highlightRound');
    const highlightTableParam = urlParams.get('highlightTable');
    if (tournamentIdParam) setSelectedTournamentId(tournamentIdParam);
    if (highlightPlayerIdParam) setHighlightedPlayerId(highlightPlayerIdParam);
    if (highlightRoundParam) setHighlightRound(Number(highlightRoundParam));
    if (highlightTableParam) setHighlightTable(Number(highlightTableParam));
  }, [location.search]);

  const handleSettingsToggle = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleViewSwitch = useCallback((view: 'competitor' | 'professor' | 'admin') => {
    if (onSwitchView) {
      onSwitchView(view);
    }
    setShowSettings(false);
  }, [onSwitchView]);

  // Add a handler for round change that clears highlight params
  const handlePairingsRoundChange = useCallback((round: number) => {
    setHighlightedPlayerId(undefined);
    setHighlightRound(undefined);
    setHighlightTable(undefined);
    // Remove highlight params from URL
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete('highlightPlayerId');
    urlParams.delete('highlightRound');
    urlParams.delete('highlightTable');
    // Update URL without the highlight params
    const newUrl = `${location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [location.search]);

  // Tournament filtering logic
  const filteredTournaments = mockTournaments.filter(t => {
    if (tournamentFilter === 'all') return true;
    if (tournamentFilter === 'registration') return t.status === 'registration';
    if (tournamentFilter === 'upcoming') return t.status === 'upcoming';
    if (tournamentFilter === 'live') return t.status === 'ongoing';
    return true;
  });

  const renderActiveTab = () => {
    // Show player profile if a player is selected AND we're on a profile-related tab
    // if (selectedPlayer && (activeTab === 'following' || activeTab === 'search')) { // Removed
    //   const selectedPlayerData = mockPlayers.find(p => p.id === selectedPlayer); // Removed
    //   if (selectedPlayerData) { // Removed
    //     return ( // Removed
    //       <Profile // Removed
    //         isOwnProfile={false} // Removed
    //         playerId={selectedPlayer} // Removed
    //         activeTab={profileActiveTab} // Removed
    //         onTabChange={setProfileActiveTab} // Removed
    //         selectedTournamentName={selectedTournamentName} // Removed
    //       /> // Removed
    //     ); // Removed
    //   } // Removed
    // } // Removed

    switch (activeTab) {
      case 'home':
        return (
          <div className="container-responsive space-responsive space-y-6">
            {/* Personalized Greeting */}
            <div className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {userSession.name ? t('dashboard.greetingWithName', { name: userSession.name }) : t('dashboard.greeting')}
            </div>
            {/* Personal Dashboard Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">{t('dashboard.yourDashboard')}</h2>
                  <p className="text-indigo-100 text-wrap">{t('dashboard.trackYourJourney')}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{userSession.division.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              
              {/* Personal Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-indigo-100">{t('dashboard.tournaments')}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-xs text-indigo-100">{t('dashboard.winRate')}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-indigo-100">{t('dashboard.top8s')}</p>
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
                    <p className="font-semibold text-gray-900 text-wrap">{t('dashboard.browseEvents')}</p>
                    <p className="text-sm text-gray-600 text-wrap">{t('dashboard.findTournaments')}</p>
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
                    <p className="font-semibold text-gray-900 text-wrap">{t('dashboard.leaderboard')}</p>
                    <p className="text-sm text-gray-600 text-wrap">{t('dashboard.seeRankings')}</p>
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
                    <p className="font-semibold text-gray-900 text-wrap">{t('dashboard.following')}</p>
                    <p className="text-sm text-gray-600 text-wrap">{t('dashboard.trackPlayers')}</p>
                  </div>
                </div>
              </button>
              <button 
                onClick={() => setActiveTab('tickets')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Ticket className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-wrap">{t('dashboard.tickets')}</p>
                    <p className="text-sm text-gray-600 text-wrap">{t('dashboard.checkIn')}</p>
                  </div>
                </div>
              </button>
              {/* Only show QR Test button if user is admin or staff */}
              {/* {userSession.isAdmin || userSession.isStaff ? (
                <button 
                  onClick={() => window.location.href = '/qr-test'}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-wrap">QR Test</p>
                      <p className="text-sm text-gray-600 text-wrap">Test QR codes</p>
                    </div>
                  </div>
                </button>
              ) : null} */}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentActivity')}</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500 cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => {
                    // Find the Phoenix Regional Championships tournament
                    const phoenixTournament = mockTournaments.find(t => t.name.includes('Phoenix Regional'));
                    if (phoenixTournament) {
                      // Find the round 3 pairing for Manraj Sidhu vs David Kim
                      const round3Pairings = phoenixTournament.pairings?.filter(p => p.round === 3) || [];
                      const manrajVsDavid = round3Pairings.find(p =>
                        (p.player1.name === 'Manraj Sidhu' && p.player2.name === 'David Kim') ||
                        (p.player1.name === 'David Kim' && p.player2.name === 'Manraj Sidhu')
                      );
                      const table = manrajVsDavid?.table;
                      // Navigate to pairings page, round 3, highlight Manraj Sidhu
                      handleTournamentClick(
                        phoenixTournament.id,
                        'manraj-sidhu',
                        3,
                        table
                      );
                    }
                  }}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('dashboard.top4Finish')}</p>
                    <p className="text-xs text-gray-600">{t('dashboard.phoenixRegionalChampionships')}</p>
                  </div>
                  <span className="text-xs text-gray-500">{t('dashboard.twoDaysAgo')}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('dashboard.registered')}</p>
                    <p className="text-xs text-gray-600">{t('dashboard.seattleSpringChampionships')}</p>
                  </div>
                  <span className="text-xs text-gray-500">{t('dashboard.oneWeekAgo')}</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t('dashboard.startedFollowing')}</p>
                    <p className="text-xs text-gray-600">{t('dashboard.alexRodriguez')}</p>
                  </div>
                  <span className="text-xs text-gray-500">{t('dashboard.oneWeekAgo')}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events Preview */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.upcomingEvents')}</h3>
                <button 
                  onClick={() => handleTabChange('tournaments')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('dashboard.viewAll')}
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
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">{t('tournaments.tournaments')}</h2>
                  <p className="text-blue-100 text-wrap">{t('tournaments.findAndRegisterForEvents')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'registration').length}</p>
                    <p className="text-xs text-blue-100">{t('tournaments.openForRegistration')}</p>
                  </div>
                </div>
              </div>
              
              {/* Tournament Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'upcoming').length}</p>
                  <p className="text-xs text-blue-100">{t('tournaments.upcoming')}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'ongoing').length}</p>
                  <p className="text-xs text-blue-100">{t('tournaments.liveNow')}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-2xl font-bold">{mockTournaments.filter(t => t.status === 'completed').length}</p>
                  <p className="text-xs text-blue-100">{t('tournaments.completed')}</p>
                </div>
              </div>
            </div>

            {/* Tournament Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${tournamentFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setTournamentFilter('all')}
                >
                  {t('tournaments.allEvents')}
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${tournamentFilter === 'registration' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setTournamentFilter('registration')}
                >
                  {t('tournaments.registrationOpen')}
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${tournamentFilter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setTournamentFilter('upcoming')}
                >
                  {t('tournaments.upcoming')}
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium ${tournamentFilter === 'live' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setTournamentFilter('live')}
                >
                  {t('tournaments.liveNow')}
                </button>
              </div>
            </div>

            {/* Tournament Listings */}
            <div className="space-y-4">
              {filteredTournaments.map((tournament) => (
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
                          <span>{tournament.currentRegistrations}/{tournament.maxCapacity} {t('tournaments.registered')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for Registration */}
                  {tournament.status === 'registration' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t('tournaments.capacity')}</span>
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
                          {t('tournaments.registerNow')}
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
                          {t('tournaments.viewPairings')}
                        </button>
                      )}
                      {tournament.status === 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedTournamentId(tournament.id);
                            handleTabChange('pairings');
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-colors text-sm font-medium"
                        >
                          {t('tournaments.viewLeaderboard')}
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
                        {t('tournaments.viewDetails')}
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${tournament.entryFee}</p>
                      <p className="text-xs text-gray-500">{t('tournaments.entryFee')}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTournaments.length === 0 && (
                <div className="text-center text-gray-500 py-8">{t('tournaments.noTournamentsFound')}</div>
              )}
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
                    <p className="font-semibold text-gray-900 text-wrap">{t('dashboard.calendarView')}</p>
                    <p className="text-sm text-gray-600 text-wrap">{t('dashboard.seeAllEvents')}</p>
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
                    <p className="font-semibold text-gray-900 text-wrap">{t('dashboard.searchPlayers')}</p>
                    <p className="text-sm text-gray-600 text-wrap">{t('dashboard.findCompetitors')}</p>
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
                <h3 className="text-lg font-semibold text-gray-900">{t('pairings.tournamentPairings')}</h3>
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
                        <optgroup label={t('pairings.completedTournaments')}>
                          {completedTournaments.map(tournament => (
                            <option key={tournament.id} value={tournament.id} className="text-gray-600">
                              {tournament.name} - {new Date(tournament.date).toLocaleDateString()}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Active Tournaments */}
                      {activeTournaments.length > 0 && (
                        <optgroup label={t('pairings.activeTournaments')}>
                          {activeTournaments.map(tournament => (
                            <option key={tournament.id} value={tournament.id} className="text-green-600 font-semibold">
                              {tournament.name} - {t('pairings.live')}
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Registration Open Tournaments */}
                      {registrationTournaments.length > 0 && (
                        <optgroup label={t('pairings.registrationOpen')}>
                          {registrationTournaments.map(tournament => (
                            <option key={tournament.id} value={tournament.id} className="text-blue-600">
                              {tournament.name} - {new Date(tournament.date).toLocaleDateString()} ({tournament.currentRegistrations}/{tournament.maxCapacity})
                            </option>
                          ))}
                        </optgroup>
                      )}

                      {/* Upcoming Tournaments */}
                      {upcomingTournaments.length > 0 && (
                        <optgroup label={t('pairings.upcomingTournaments')}>
                          {upcomingTournaments.map(tournament => (
                            <option key={tournament.id} value={tournament.id} className="text-gray-500">
                              {tournament.name} - {new Date(tournament.date).toLocaleDateString()}
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
                      return { color: 'bg-purple-100 text-purple-800', icon: '🏆', text: t('pairings.completed') };
                    case 'ongoing':
                      return { color: 'bg-green-100 text-green-800', icon: '⚡', text: t('pairings.liveNow') };
                    case 'registration':
                      return { color: 'bg-blue-100 text-blue-800', icon: '📝', text: t('pairings.registrationOpen') };
                    case 'upcoming':
                      return { color: 'bg-gray-100 text-gray-800', icon: '📅', text: t('pairings.upcoming') };
                    default:
                      return { color: 'bg-gray-100 text-gray-800', icon: '❓', text: t('pairings.unknown') };
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
                        • {selectedTournament.currentRegistrations}/{selectedTournament.maxCapacity} {t('pairings.registered')}
                      </span>
                    )}
                    {selectedTournament.status === 'ongoing' && (
                      <span className="text-sm text-wrap">
                        • {selectedTournament.totalPlayers} {t('pairings.playersCompeting')}
                      </span>
                    )}
                    {selectedTournament.status === 'completed' && (
                      <span className="text-sm text-wrap">
                        • {selectedTournament.totalPlayers} {t('pairings.playersCompeted')}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
            <Suspense fallback={<div>Loading Pairings...</div>}>
              <TournamentPairings
                tournamentId={selectedTournament.id}
                tournamentName={selectedTournament.name}
                isRegistered={selectedTournament.isRegistered ?? true}
                userDivision={userSession.division}
                pairings={selectedTournament.pairings || []}
                tournament={selectedTournament}
                currentPlayerId={userSession.userId}
                highlightPlayerId={highlightedPlayerId}
                highlightRound={highlightRound}
                highlightTable={highlightTable}
                onViewFullRun={handleViewFullRun}
                onRoundChange={handlePairingsRoundChange}
              />
            </Suspense>
          </div>
        );
      }

      case 'calendar':
        return (
          <div className="container-responsive space-responsive">
            <Suspense fallback={<div>Loading Calendar...</div>}>
              <EventCalendar />
            </Suspense>
          </div>
        );

      case 'search':
        return (
          <div className="container-responsive space-responsive">
            <Suspense fallback={<div>Loading Search...</div>}>
              <PlayerSearch onPlayerSelect={handlePlayerSelect} />
            </Suspense>
          </div>
        );

      case 'blog':
        if (selectedBlogPost) {
          return (
            <div className="container-responsive space-responsive">
              <Suspense fallback={<div>Loading Blog Post...</div>}>
                <BlogPostView
                  post={selectedBlogPost}
                  onBack={handleBlogPostBack}
                  onLike={handleBlogPostLike}
                  onBookmark={handleBlogPostBookmark}
                  onComment={handleBlogPostComment}
                />
              </Suspense>
            </div>
          );
        }
        return (
          <div className="container-responsive space-responsive">
            <Suspense fallback={<div>Loading Blog Tips...</div>}>
              <BlogTips 
                isVerifiedPlayer={userSession.division === 'master'} 
                isAdmin={false}
                isPokemonCompanyApproved={false}
                onPostSelect={handleBlogPostSelect}
              />
            </Suspense>
          </div>
        );

      case 'leaderboard':
        return (
          <div className="container-responsive space-responsive">
            <Suspense fallback={<div>Loading Leaderboard...</div>}>
              <Leaderboard 
                players={mockPlayers}
                currentPlayerId={userSession.userId}
                onPlayerSelect={handlePlayerSelect}
              />
            </Suspense>
          </div>
        );

      case 'tickets':
        return (
          <div className="container-responsive space-responsive">
            <Suspense fallback={<div>Loading Tickets...</div>}>
              <TicketsPage userSession={userSession} />
            </Suspense>
          </div>
        );

      case 'following':
        return (
          <div className="container-responsive space-responsive">
            <Suspense fallback={<div>Loading Following Feed...</div>}>
              <FollowingFeed 
                onPlayerSelect={handlePlayerSelect}
                onTournamentClick={handleTournamentClick}
                currentUserId={userSession.userId}
              />
            </Suspense>
          </div>
        );

      case 'support':
        return (
          <div className="container-responsive space-responsive">
            <Suspense fallback={<div>Loading Support & FAQs...</div>}>
              <SupportAndFAQs />
            </Suspense>
          </div>
        );

      default:
        return null;
    }
  };

  // Handler for League Table navigation
  const handleLeagueTablePlayerSelect = useCallback((playerId: string) => {
    // Navigate to the player's profile page
    navigate(`/profile/${playerId}`);
    setShowLeaderboardModal({ open: false, tournament: null });
  }, [navigate]);

  return (
    <AppLayout 
      userSession={userSession} 
      onLogout={onLogout}
      showBottomNav={true}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className="container-responsive mx-auto px-4 py-6">
        {/* Blog Post View */}
        {selectedBlogPost && (
          <BlogPostView
            post={selectedBlogPost}
            onBack={handleBlogPostBack}
            onLike={handleBlogPostLike}
            onBookmark={handleBlogPostBookmark}
            onComment={handleBlogPostComment}
          />
        )}

        {/* Main Content */}
        {!selectedBlogPost && (
          <>
            {renderActiveTab()}
            {/* League Table Modal for completed tournaments */}
            {showLeaderboardModal.open && showLeaderboardModal.tournament && (
              <TournamentLeaderboard
                tournament={showLeaderboardModal.tournament}
                pairings={showLeaderboardModal.tournament.pairings || []}
                isOpen={showLeaderboardModal.open}
                onClose={() => setShowLeaderboardModal({ open: false, tournament: null })}
                onPlayerSelect={handleLeagueTablePlayerSelect}
              />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default CompetitorView; 