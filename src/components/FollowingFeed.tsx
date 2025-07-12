import React, { useState } from 'react';
import { Users, Trophy, TrendingUp, Calendar, Bell, Settings, UserPlus, UserCheck, Search, Filter, X, Check, UserMinus } from 'lucide-react';
import { mockPlayers, mockTournaments } from '../data/mockData';
import PlayerCard from './PlayerCard';

interface FollowedPlayer {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastTournament?: {
    name: string;
    placement: number;
    date: string;
    team: string[];
  };
  recentPerformance: {
    wins: number;
    losses: number;
    winRate: number;
  };
  favoriteUsage: {
    pokemon: string;
    usage: number;
    winRate: number;
  }[];
}

interface PlayerActivity {
  id: string;
  playerId: string;
  playerName: string;
  type: 'tournament_result' | 'team_update' | 'achievement';
  timestamp: string;
  format: string;
  data: {
    tournament?: string;
    placement?: number;
    team?: string[];
    achievement?: string;
    winRate?: number;
    record?: string;
    isLive?: boolean;
    currentRound?: number;
    currentTable?: number;
    currentOpponent?: string;
  };
}

interface FollowingFeedProps {
  onPlayerSelect?: (playerId: string) => void;
  onTournamentClick?: (tournamentId: string) => void;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  sharedWith: string[];
  timestamp: string;
}

const FollowingFeed: React.FC<FollowingFeedProps> = ({ onPlayerSelect, onTournamentClick }) => {
  const [followedPlayers, setFollowedPlayers] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tournaments' | 'teams' | 'achievements'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'regionals' | 'internationals' | 'worlds'>('all');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedPlayersForBulkAction, setSelectedPlayersForBulkAction] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState<'follow' | 'unfollow'>('unfollow');
  // Add state for shared blogs
  const [sharedBlogs, setSharedBlogs] = useState<BlogPost[]>([]); // BlogPost type from types/index.ts

  // Mock followed players data with tournament teams
  const followedPlayersData: FollowedPlayer[] = [
    {
      id: '1',
      name: 'Alex Rodriguez',
      avatar: 'AR',
      isOnline: true,
      lastTournament: {
        name: 'Phoenix Regional',
        placement: 4,
        date: '2024-03-15',
        team: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee']
      },
      recentPerformance: { wins: 7, losses: 2, winRate: 78 },
      favoriteUsage: [
        { pokemon: 'Charizard', usage: 85, winRate: 72 },
        { pokemon: 'Gholdengo', usage: 78, winRate: 68 },
        { pokemon: 'Urshifu', usage: 71, winRate: 75 },
        { pokemon: 'Rillaboom', usage: 65, winRate: 69 }
      ]
    },
    {
      id: '2',
      name: 'Sarah Kim',
      avatar: 'SK',
      isOnline: false,
      lastTournament: {
        name: 'Charlotte Regional',
        placement: 8,
        date: '2024-03-10',
        team: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri']
      },
      recentPerformance: { wins: 6, losses: 3, winRate: 67 },
      favoriteUsage: [
        { pokemon: 'Miraidon', usage: 92, winRate: 74 },
        { pokemon: 'Flutter Mane', usage: 88, winRate: 71 },
        { pokemon: 'Annihilape', usage: 76, winRate: 69 },
        { pokemon: 'Torkoal', usage: 68, winRate: 65 }
      ]
    },
    {
      id: '3',
      name: 'Marcus Johnson',
      avatar: 'MJ',
      isOnline: true,
      lastTournament: {
        name: 'San Diego Regional',
        placement: 2,
        date: '2024-03-08',
        team: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W']
      },
      recentPerformance: { wins: 8, losses: 1, winRate: 89 },
      favoriteUsage: [
        { pokemon: 'Calyrex-Ice', usage: 95, winRate: 82 },
        { pokemon: 'Incineroar', usage: 89, winRate: 76 },
        { pokemon: 'Grimmsnarl', usage: 84, winRate: 73 },
        { pokemon: 'Raging Bolt', usage: 79, winRate: 78 }
      ]
    }
  ];

  // Mock activity feed with tournament teams
  const activities: PlayerActivity[] = [
    {
      id: 'live-1',
      playerId: 'manraj-sidhu',
      playerName: 'Manraj Sidhu',
      type: 'tournament_result',
      timestamp: 'Live Now',
      format: 'Regional',
      data: {
        tournament: 'Phoenix Regional Championships',
        placement: null,
        winRate: 100,
        record: '2-0',
        team: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee'],
        isLive: true,
        currentRound: 3,
        currentTable: 12,
        currentOpponent: 'Sarah Chen'
      }
    },
    {
      id: '1',
      playerId: '3',
      playerName: 'Marcus Johnson',
      type: 'tournament_result',
      timestamp: '2 hours ago',
      format: 'Regional',
      data: {
        tournament: 'San Diego Regional Championships',
        placement: 2,
        winRate: 89,
        record: '8-1',
        team: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W']
      }
    },
    {
      id: '2',
      playerId: '1',
      playerName: 'Alex Rodriguez',
      type: 'team_update',
      timestamp: '5 hours ago',
      format: 'Regional',
      data: {
        team: ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Indeedee']
      }
    },
    {
      id: '3',
      playerId: '2',
      playerName: 'Sarah Kim',
      type: 'achievement',
      timestamp: '1 day ago',
      format: 'Regional',
      data: {
        achievement: 'Reached 2000+ rating for the first time!'
      }
    },
    {
      id: '4',
      playerId: '3',
      playerName: 'Marcus Johnson',
      type: 'tournament_result',
      timestamp: '2 days ago',
      format: 'Regional',
      data: {
        tournament: 'Charlotte Regional Championships',
        placement: 8,
        winRate: 67,
        record: '6-3',
        team: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri']
      }
    },
    {
      id: '5',
      playerId: '1',
      playerName: 'Alex Rodriguez',
      type: 'tournament_result',
      timestamp: '3 days ago',
      format: 'International',
      data: {
        tournament: 'EUIC 2024',
        placement: 16,
        winRate: 72,
        record: '7-2',
        team: ['Koraidon', 'Chien-Pao', 'Amoonguss', 'Incineroar', 'Grimmsnarl', 'Electabuzz']
      }
    },
    {
      id: '6',
      playerId: '2',
      playerName: 'Sarah Kim',
      type: 'tournament_result',
      timestamp: '1 week ago',
      format: 'Worlds',
      data: {
        tournament: 'World Championships 2023',
        placement: 32,
        winRate: 64,
        record: '5-4',
        team: ['Miraidon', 'Flutter Mane', 'Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt']
      }
    }
  ];

  const suggestedPlayers = mockPlayers.filter(player => !followedPlayers.has(player.id)).slice(0, 3);

  const filteredActivities = activities.filter(activity => {
    const typeMatch = selectedFilter === 'all' || 
      (selectedFilter === 'tournaments' && activity.type === 'tournament_result') ||
      (selectedFilter === 'teams' && activity.type === 'team_update') ||
      (selectedFilter === 'achievements' && activity.type === 'achievement');
    
    const formatMatch = formatFilter === 'all' ||
      (formatFilter === 'regionals' && activity.format === 'Regional') ||
      (formatFilter === 'internationals' && activity.format === 'International') ||
      (formatFilter === 'worlds' && activity.format === 'Worlds');
    
    const searchMatch = searchQuery === '' ||
      activity.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.data.tournament?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && formatMatch && searchMatch;
  });

  const handleFollowToggle = (playerId: string) => {
    setFollowedPlayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  const handlePlayerClick = (playerId: string) => {
    if (onPlayerSelect) {
      onPlayerSelect(playerId);
    }
  };

  const handleTournamentClick = (tournamentName: string) => {
    // Find tournament by name and call the click handler
    if (onTournamentClick) {
      // For now, we'll use a simple mapping - in a real app, you'd have tournament IDs
      const tournament = mockTournaments.find(t => t.name.includes(tournamentName) || tournamentName.includes(t.name));
      if (tournament) {
        onTournamentClick(tournament.id);
      }
    }
  };

  const handleFollowingModalOpen = () => {
    setShowFollowingModal(true);
    setSelectedPlayersForBulkAction(new Set());
    setBulkActionMode('unfollow');
  };

  const handleFollowingModalClose = () => {
    setShowFollowingModal(false);
    setSelectedPlayersForBulkAction(new Set());
  };

  const handlePlayerSelectionToggle = (playerId: string) => {
    setSelectedPlayersForBulkAction(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerId)) {
        newSet.delete(playerId);
      } else {
        newSet.add(playerId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (bulkActionMode === 'unfollow') {
      setSelectedPlayersForBulkAction(new Set(followedPlayers));
    } else {
      setSelectedPlayersForBulkAction(new Set(mockPlayers.filter(p => !followedPlayers.has(p.id)).map(p => p.id)));
    }
  };

  const handleDeselectAll = () => {
    setSelectedPlayersForBulkAction(new Set());
  };

  const handleBulkAction = () => {
    if (bulkActionMode === 'unfollow') {
      // Unfollow selected players
      setFollowedPlayers(prev => {
        const newSet = new Set(prev);
        selectedPlayersForBulkAction.forEach(playerId => {
          newSet.delete(playerId);
        });
        return newSet;
      });
    } else {
      // Follow selected players
      setFollowedPlayers(prev => {
        const newSet = new Set(prev);
        selectedPlayersForBulkAction.forEach(playerId => {
          newSet.add(playerId);
        });
        return newSet;
      });
    }
    setSelectedPlayersForBulkAction(new Set());
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tournament_result': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'team_update': return <Users className="h-5 w-5 text-blue-500" />;
      case 'achievement': return <TrendingUp className="h-5 w-5 text-green-500" />;
      default: return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPlacementColor = (placement: number) => {
    if (placement <= 3) return 'text-yellow-600 bg-yellow-50';
    if (placement <= 8) return 'text-green-600 bg-green-50';
    if (placement <= 16) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'Regional': return 'bg-blue-100 text-blue-800';
      case 'International': return 'bg-purple-100 text-purple-800';
      case 'Worlds': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Following</h2>
            <p className="text-indigo-100">Track your favorite players' performances</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleFollowingModalOpen}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <UserCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Following ({followedPlayers.size})</span>
            </button>
            <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{followedPlayers.size}</p>
            <p className="text-sm text-indigo-100">Following</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{filteredActivities.length}</p>
            <p className="text-sm text-indigo-100">Recent Activities</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{followedPlayersData.filter(p => p.isOnline).length}</p>
            <p className="text-sm text-indigo-100">Online Now</p>
          </div>
        </div>
      </div>

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Manage Following</h3>
                <p className="text-sm text-gray-600">
                  {bulkActionMode === 'unfollow' ? 'Select players to unfollow' : 'Select players to follow'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBulkActionMode(bulkActionMode === 'unfollow' ? 'follow' : 'unfollow')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    bulkActionMode === 'unfollow' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {bulkActionMode === 'unfollow' ? 'Unfollow Mode' : 'Follow Mode'}
                </button>
                <button
                  onClick={handleFollowingModalClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Bulk Actions */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedPlayersForBulkAction.size} selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Deselect All
                  </button>
                  {selectedPlayersForBulkAction.size > 0 && (
                    <button
                      onClick={handleBulkAction}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        bulkActionMode === 'unfollow'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {bulkActionMode === 'unfollow' ? 'Unfollow Selected' : 'Follow Selected'}
                    </button>
                  )}
                </div>
              </div>

              {/* Players List */}
              <div className="space-y-3">
                {(bulkActionMode === 'unfollow' ? followedPlayersData : mockPlayers.filter(p => !followedPlayers.has(p.id))).map((player) => {
                  const isSelected = selectedPlayersForBulkAction.has(player.id);
                  const isFollowed = followedPlayers.has(player.id);
                  
                  return (
                    <div
                      key={player.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => handlePlayerSelectionToggle(player.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </button>

                      {/* Player Avatar */}
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {player.name.charAt(0)}
                        </div>
                        {isFollowed && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <UserCheck className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{player.name}</p>
                          {isFollowed && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Following
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{player.region || 'Unknown Region'}</span>
                          <span>•</span>
                          <span>{player.winRate || 0}% WR</span>
                          {player.lastTournament && (
                            <>
                              <span>•</span>
                              <span>#{player.lastTournament.placement} at {player.lastTournament.name}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Individual Action Button */}
                      <button
                        onClick={() => handleFollowToggle(player.id)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          isFollowed
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <UserMinus className="h-4 w-4" />
                            <span>Unfollow</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {bulkActionMode === 'unfollow' && followedPlayersData.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No players followed</h4>
                  <p className="text-gray-600">Start following players to see them here.</p>
                </div>
              )}

              {bulkActionMode === 'follow' && mockPlayers.filter(p => !followedPlayers.has(p.id)).length === 0 && (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Following everyone!</h4>
                  <p className="text-gray-600">You're already following all available players.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {bulkActionMode === 'unfollow' 
                  ? `${followedPlayersData.length} players followed`
                  : `${mockPlayers.filter(p => !followedPlayers.has(p.id)).length} players available to follow`
                }
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleFollowingModalClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search players or tournaments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Quick Stats of Followed Players */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Performances</h3>
        <div className="space-y-3">
          {followedPlayersData.map((player) => (
            <div 
              key={player.id} 
              className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handlePlayerClick(player.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {player.avatar}
                    </div>
                    {player.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{player.name}</p>
                    {player.lastTournament && (
                      <p className="text-sm text-gray-600">
                        #{player.lastTournament.placement} at {player.lastTournament.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {player.recentPerformance.wins}W-{player.recentPerformance.losses}L
                  </p>
                  <p className="text-xs text-gray-500">Recent Record</p>
                </div>
              </div>

              {/* Last Tournament Team */}
              {player.lastTournament && (
                <div className="border-t pt-3">
                  <p className="text-xs text-gray-600 mb-2">Latest Tournament Team:</p>
                  <div className="flex flex-wrap gap-1">
                    {player.lastTournament.team.map((pokemon, index) => (
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

              {/* Favorite Pokemon Usage */}
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600 mb-2">Most Used Pokémon:</p>
                <div className="space-y-1">
                  {player.favoriteUsage.slice(0, 2).map((usage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 to-orange-500"></div>
                        <span className="text-xs font-medium text-gray-700">{usage.pokemon}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full"
                            style={{ width: `${usage.usage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{usage.usage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tournament History */}
              {player.lastTournament && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-2">Recent Tournament History:</p>
                  <div className="space-y-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{player.lastTournament.name}</span>
                        <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                          player.lastTournament.placement <= 3 ? 'bg-yellow-100 text-yellow-800' :
                          player.lastTournament.placement <= 8 ? 'bg-green-100 text-green-800' :
                          player.lastTournament.placement <= 16 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          #{player.lastTournament.placement}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {player.lastTournament.team.slice(0, 3).map((pokemon, index) => (
                          <span
                            key={index}
                            className="px-1 py-0.5 bg-white rounded text-xs font-medium text-gray-700 border"
                          >
                            {pokemon}
                          </span>
                        ))}
                        {player.lastTournament.team.length > 3 && (
                          <span className="text-xs text-gray-500">+{player.lastTournament.team.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Filters */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Activity Type</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'all' as const, label: 'All Activity', icon: Calendar },
              { id: 'tournaments' as const, label: 'Tournaments', icon: Trophy },
              { id: 'teams' as const, label: 'Teams', icon: Users },
              { id: 'achievements' as const, label: 'Achievements', icon: TrendingUp },
            ].map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Tournament Format</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'all' as const, label: 'All Formats' },
              { id: 'regionals' as const, label: 'Regionals' },
              { id: 'internationals' as const, label: 'Internationals' },
              { id: 'worlds' as const, label: 'Worlds' },
            ].map((format) => (
              <button
                key={format.id}
                onClick={() => setFormatFilter(format.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  formatFilter === format.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <div 
                className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform"
                onClick={() => handlePlayerClick(activity.playerId)}
              >
                {activity.playerName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <p 
                    className="font-medium text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => handlePlayerClick(activity.playerId)}
                  >
                    {activity.playerName}
                  </p>
                  {getActivityIcon(activity.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormatColor(activity.format)}`}>
                    {activity.format}
                  </span>
                  <span className="text-sm text-gray-500">{activity.timestamp}</span>
                </div>

                {activity.type === 'tournament_result' && activity.data.tournament && (
                  <div 
                    className={`rounded-lg p-3 cursor-pointer transition-colors ${
                      activity.data.isLive 
                        ? 'bg-red-50 hover:bg-red-100 border border-red-200' 
                        : 'bg-yellow-50 hover:bg-yellow-100'
                    }`}
                    onClick={() => {
                      if (activity.data.isLive) {
                        // For live tournaments, show the player's current pairing
                        if (onPlayerSelect) {
                          onPlayerSelect(activity.playerId);
                        }
                      } else {
                        // For completed tournaments, navigate to tournament
                        handleTournamentClick(activity.data.tournament!);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={`font-medium ${
                          activity.data.isLive ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {activity.data.tournament}
                        </p>
                        <p className={`text-sm ${
                          activity.data.isLive ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          Record: {activity.data.record} • Win Rate: {activity.data.winRate}%
                          {activity.data.isLive && activity.data.currentOpponent && (
                            <span> • vs {activity.data.currentOpponent}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {activity.data.placement && (
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            getPlacementColor(activity.data.placement)
                          }`}>
                            #{activity.data.placement}
                          </div>
                        )}
                        {/* Live tournament indicators */}
                        {activity.data.isLive && (
                          <div className="flex flex-col items-end space-y-1">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium animate-pulse">
                              Live Now
                            </span>
                            <span className="text-xs text-red-600">
                              Round {activity.data.currentRound} • Table {activity.data.currentTable}
                            </span>
                          </div>
                        )}
                        {!activity.data.isLive && activity.data.tournament.includes('San Diego') && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium animate-pulse">
                            Live Now
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {activity.data.team && (
                      <div>
                        <p className="text-sm text-yellow-800 mb-2">Tournament Team:</p>
                        <div className="flex flex-wrap gap-2">
                          {activity.data.team.map((pokemon, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white rounded-full text-xs font-medium text-yellow-700 border border-yellow-200"
                            >
                              {pokemon}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activity.type === 'team_update' && activity.data.team && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800 mb-2">Updated tournament team:</p>
                    <div className="flex flex-wrap gap-2">
                      {activity.data.team.map((pokemon, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white rounded-full text-xs font-medium text-blue-700 border border-blue-200"
                        >
                          {pokemon}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activity.type === 'achievement' && activity.data.achievement && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <p className="font-medium text-green-800">{activity.data.achievement}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Players */}
      {showSuggestions && suggestedPlayers.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Suggested Players</h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
          <div className="space-y-3">
            {suggestedPlayers.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div 
                  className="flex items-center space-x-3 cursor-pointer flex-1"
                  onClick={() => handlePlayerClick(player.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                    {player.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{player.name}</p>
                    <p className="text-sm text-gray-600">{player.region} • {player.winRate}% WR</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFollowToggle(player.id)}
                  className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm">Follow</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add a section at the top for shared blogs */}
      {sharedBlogs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Shared with You</h3>
          <div className="space-y-2">
            {sharedBlogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-lg p-3 border border-blue-200 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900">{blog.title}</h4>
                  <p className="text-xs text-gray-500">by {blog.author.name}</p>
                </div>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-xs"
                  onClick={() => onPlayerSelect && onPlayerSelect(blog.author.id)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {followedPlayers.size === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No players followed yet</h3>
          <p className="text-gray-600 mb-4">
            Start following players to see their tournament performances and teams here.
          </p>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            Discover Players
          </button>
        </div>
      )}

      {/* No Results State */}
      {followedPlayers.size > 0 && filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms to see more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default FollowingFeed;