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
  const [followedPlayers, setFollowedPlayers] = useState<Set<string>>(new Set(['p1', 'p2', 'p3']));
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tournaments' | 'teams' | 'achievements'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'regionals' | 'internationals' | 'worlds'>('all');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [selectedPlayersForBulkAction, setSelectedPlayersForBulkAction] = useState<Set<string>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState<'follow' | 'unfollow'>('unfollow');
  // Add state for shared blogs
  const [sharedBlogs, setSharedBlogs] = useState<BlogPost[]>([
    {
      id: 'blog-1',
      title: 'Meta Analysis: VGC 2024 Regulation Set D',
      content: 'A comprehensive analysis of the current meta trends, including the rise of Miraidon teams and the decline of certain restricted Pokémon...',
      author: {
        id: 'p1',
        name: 'Alex Rodriguez'
      },
      sharedWith: ['p2', 'p3', 'p4'],
      timestamp: '2024-03-10T10:00:00Z'
    },
    {
      id: 'blog-2',
      title: 'Team Building Guide: Building Around Calyrex-Ice',
      content: 'Step-by-step guide on how to build effective teams around Calyrex-Ice, including partner selection and EV spreads...',
      author: {
        id: 'p3',
        name: 'Marcus Johnson'
      },
      sharedWith: ['p1', 'p2', 'p5'],
      timestamp: '2024-03-08T14:30:00Z'
    },
    {
      id: 'blog-3',
      title: 'Tournament Preparation: Mental Game Tips',
      content: 'Essential mental preparation techniques for high-stakes tournaments, including stress management and focus strategies...',
      author: {
        id: 'p2',
        name: 'Sarah Chen'
      },
      sharedWith: ['p1', 'p3', 'p4', 'p6'],
      timestamp: '2024-03-05T16:45:00Z'
    },
    {
      id: 'blog-4',
      title: 'EV Training Guide: Optimizing Your Pokémon',
      content: 'Detailed guide on EV training for competitive play, including common spreads and optimization strategies...',
      author: {
        id: 'p6',
        name: 'Lars Andersen'
      },
      sharedWith: ['p1', 'p2', 'p3', 'p7', 'p8'],
      timestamp: '2024-03-01T09:15:00Z'
    },
    {
      id: 'blog-5',
      title: 'Regional Championships Recap: Key Takeaways',
      content: 'Analysis of recent regional championships results and what they tell us about the evolving meta...',
      author: {
        id: 'p11',
        name: 'Yuki Tanaka'
      },
      sharedWith: ['p1', 'p2', 'p3', 'p4', 'p5'],
      timestamp: '2024-02-28T11:20:00Z'
    },
    {
      id: 'blog-6',
      title: 'Advanced Battle Strategies: Prediction and Mind Games',
      content: 'Advanced techniques for reading opponents and making game-winning predictions in high-level play...',
      author: {
        id: 'p7',
        name: 'Sophie Müller'
      },
      sharedWith: ['p1', 'p2', 'p3', 'p6', 'p9'],
      timestamp: '2024-02-25T13:10:00Z'
    },
    {
      id: 'blog-7',
      title: 'Pokémon Showdown: Practice Strategies',
      content: 'How to effectively use Pokémon Showdown for practice and improvement, including ladder climbing tips...',
      author: {
        id: 'p4',
        name: 'Emily Davis'
      },
      sharedWith: ['p1', 'p2', 'p3', 'p5', 'p8'],
      timestamp: '2024-02-20T15:30:00Z'
    },
    {
      id: 'blog-8',
      title: 'World Championships Preparation: A Year-Long Journey',
      content: 'Comprehensive guide on preparing for the World Championships, from team building to travel logistics...',
      author: {
        id: 'p12',
        name: 'Min-ji Park'
      },
      sharedWith: ['p1', 'p2', 'p3', 'p6', 'p7', 'p11'],
      timestamp: '2024-02-15T10:45:00Z'
    }
  ]); // BlogPost type from types/index.ts

  // Mock followed players data with tournament teams - using correct player IDs
  const followedPlayersData: FollowedPlayer[] = [
    {
      id: 'p1',
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
      id: 'p2',
      name: 'Sarah Chen',
      avatar: 'SC',
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
      id: 'p3',
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

  // Mock activity feed with tournament teams - using correct player IDs
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
      playerId: 'p3',
      playerName: 'Marcus Johnson',
      type: 'tournament_result',
      timestamp: '2 hours ago',
      format: 'Regional',
      data: {
        tournament: 'San Diego Regional Championships 2024',
        placement: 2,
        winRate: 89,
        record: '8-1',
        team: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W']
      }
    },
    {
      id: '2',
      playerId: 'p1',
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
      playerId: 'p2',
      playerName: 'Sarah Chen',
      type: 'achievement',
      timestamp: '1 day ago',
      format: 'Regional',
      data: {
        achievement: 'Reached 2000+ rating for the first time!'
      }
    },
    {
      id: '4',
      playerId: 'p3',
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
      playerId: 'p1',
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
      playerId: 'p2',
      playerName: 'Sarah Chen',
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
    },
    {
      id: '7',
      playerId: 'p4',
      playerName: 'Emily Davis',
      type: 'tournament_result',
      timestamp: '1 week ago',
      format: 'Regional',
      data: {
        tournament: 'Vancouver Regional Championships 2024',
        placement: 12,
        winRate: 65,
        record: '6-3',
        team: ['Flutter Mane', 'Iron Hands', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu']
      }
    },
    {
      id: '8',
      playerId: 'p5',
      playerName: 'David Kim',
      type: 'team_update',
      timestamp: '1 week ago',
      format: 'Regional',
      data: {
        team: ['Garchomp', 'Tornadus', 'Rillaboom', 'Chi-Yu', 'Iron Bundle', 'Arcanine']
      }
    },
    {
      id: '9',
      playerId: 'p6',
      playerName: 'Lars Andersen',
      type: 'tournament_result',
      timestamp: '2 weeks ago',
      format: 'International',
      data: {
        tournament: 'European International Championships 2024',
        placement: 4,
        winRate: 78,
        record: '8-1',
        team: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt']
      }
    },
    {
      id: '10',
      playerId: 'p7',
      playerName: 'Sophie Müller',
      type: 'achievement',
      timestamp: '2 weeks ago',
      format: 'Regional',
      data: {
        achievement: 'Won German National Championships 2024!'
      }
    },
    {
      id: '11',
      playerId: 'p8',
      playerName: 'Pierre Dubois',
      type: 'tournament_result',
      timestamp: '2 weeks ago',
      format: 'Regional',
      data: {
        tournament: 'Paris Regional Championships',
        placement: 16,
        winRate: 67,
        record: '6-3',
        team: ['Gholdengo', 'Urshifu', 'Amoonguss', 'Rillaboom', 'Incineroar', 'Tornadus']
      }
    },
    {
      id: '12',
      playerId: 'p9',
      playerName: 'Maria Garcia',
      type: 'team_update',
      timestamp: '3 weeks ago',
      format: 'Regional',
      data: {
        team: ['Iron Hands', 'Flutter Mane', 'Landorus-T', 'Heatran', 'Amoonguss', 'Urshifu']
      }
    },
    {
      id: '13',
      playerId: 'p10',
      playerName: 'Giuseppe Rossi',
      type: 'tournament_result',
      timestamp: '3 weeks ago',
      format: 'Regional',
      data: {
        tournament: 'Madrid Regional Championships',
        placement: 24,
        winRate: 62,
        record: '5-4',
        team: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt']
      }
    },
    {
      id: '14',
      playerId: 'p11',
      playerName: 'Yuki Tanaka',
      type: 'achievement',
      timestamp: '1 month ago',
      format: 'Regional',
      data: {
        achievement: 'Won Japan National Championships 2024!'
      }
    },
    {
      id: '15',
      playerId: 'p12',
      playerName: 'Min-ji Park',
      type: 'tournament_result',
      timestamp: '1 month ago',
      format: 'Regional',
      data: {
        tournament: 'Korean National Championships 2024',
        placement: 8,
        winRate: 75,
        record: '7-2',
        team: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri']
      }
    },
    {
      id: '16',
      playerId: 'p13',
      playerName: 'Wei Chen',
      type: 'team_update',
      timestamp: '1 month ago',
      format: 'Regional',
      data: {
        team: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W']
      }
    },
    {
      id: '17',
      playerId: 'p1',
      playerName: 'Alex Rodriguez',
      type: 'achievement',
      timestamp: '1 month ago',
      format: 'Worlds',
      data: {
        achievement: 'Won World Championships 2023!'
      }
    },
    {
      id: '18',
      playerId: 'p2',
      playerName: 'Sarah Chen',
      type: 'tournament_result',
      timestamp: '1 month ago',
      format: 'International',
      data: {
        tournament: 'North America International Championships 2023',
        placement: 16,
        winRate: 70,
        record: '7-2',
        team: ['Miraidon', 'Flutter Mane', 'Annihilape', 'Torkoal', 'Dondozo', 'Tatsugiri']
      }
    },
    {
      id: '19',
      playerId: 'p3',
      playerName: 'Marcus Johnson',
      type: 'team_update',
      timestamp: '2 months ago',
      format: 'Regional',
      data: {
        team: ['Calyrex-Ice', 'Incineroar', 'Grimmsnarl', 'Raging Bolt', 'Landorus-T', 'Ogerpon-W']
      }
    },
    {
      id: '20',
      playerId: 'p4',
      playerName: 'Emily Davis',
      type: 'achievement',
      timestamp: '2 months ago',
      format: 'Regional',
      data: {
        achievement: 'Reached 1800+ rating for the first time!'
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
                        {isFollowed ? 'Unfollow' : 'Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FollowingFeed;

