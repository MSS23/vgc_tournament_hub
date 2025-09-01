import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Filter, MapPin, Trophy, Star, UserCheck, Gem, Zap, Crown } from 'lucide-react';
import { Player } from '../types';
import { mockPlayers } from '../data/mockData';
import { FixedSizeList as List } from 'react-window';
import debounce from 'lodash.debounce';

const PlayerSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'champions' | 'region'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const regions = ['all', 'North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Oceania'];

  // Helper: Get CP number (playerId)
  const getCPNumber = (player: Player) => player.playerId;

  // Helper: Get active tournament
  const getActiveTournament = (player: Player) => {
    if (player.isActiveInLiveTournament && player.currentTournament) {
      return player.currentTournament;
    }
    // Fallback: most recent tournament
    if (player.tournaments && player.tournaments.length > 0) {
      return player.tournaments[player.tournaments.length - 1].name;
    }
    return null;
  };

  // Helper: Get most recent team
  const getMostRecentTeam = (player: Player) => {
    const recentTournament = player.tournaments?.slice().reverse().find(t => t.team && t.team.length > 0);
    return recentTournament?.team || [];
  };

  // Helper: Get top achievements
  const getTopAchievements = (player: Player) => {
    if (!player.achievements || player.achievements.length === 0) return [];
    return player.achievements.slice(0, 2);
  };

  // Helper: Get tournament history (last 2)
  const getTournamentHistory = (player: Player) => {
    if (!player.tournaments || player.tournaments.length === 0) return [];
    return player.tournaments.slice(-2).reverse();
  };

  const memoizedFilteredPlayers = React.useMemo(() => {
    if (searchQuery.trim() === '') {
      return [...mockPlayers].sort((a, b) => a.name.localeCompare(b.name));
    }
    return mockPlayers.filter(player =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.playerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.region.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery]);

  const debouncedSetSearchQuery = React.useMemo(() => debounce(setSearchQuery, 250), []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Show all players alphabetically by default
      setFilteredPlayers([...mockPlayers].sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }

    setIsLoading(true);
    
    // Simulate search delay
    const timeoutId = setTimeout(() => {
      const filtered = mockPlayers.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            player.playerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            player.region.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        // Apply filters
        switch (selectedFilter) {
          case 'verified':
            return player.isVerified;
          case 'champions':
            return player.championships > 0;
          case 'region':
            return selectedRegion === 'all' || player.region === selectedRegion;
          default:
            return true;
        }
      });

      setFilteredPlayers(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedFilter, selectedRegion]);

  const handlePlayerClick = (player: Player) => {
    if (!player || !player.id) {
      // Navigate to a not-found page or show a message (fallback)
      navigate('/profile/not-found');
    } else {
      navigate(`/profile/${player.id}`);
    }
  };

  const getAchievementBadge = (player: Player) => {
    if (player.championships > 0) {
      return (
        <div className="flex items-center space-x-1">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-xs font-medium text-yellow-700">{player.championships} Champ{player.championships > 1 ? 's' : ''}</span>
        </div>
      );
    }
    if (player.isVerified) {
      return (
        <div className="flex items-center space-x-1">
          <UserCheck className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium text-blue-700">Verified</span>
        </div>
      );
    }
    return null;
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'senior': return 'bg-green-100 text-green-800';
      case 'junior': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlayerRecord = (player: Player) => {
    if (!player.tournaments || player.tournaments.length === 0) return null;
    let wins = 0, losses = 0;
    player.tournaments.forEach(t => {
      wins += t.wins || 0;
      losses += t.losses || 0;
    });
    return `${wins}W-${losses}L`;
  };

  const getTeamPreview = (player: Player) => {
    // Use most recent tournament with a team, else most used Pokémon
    const recentTeam = player.tournaments?.slice().reverse().find(t => t.team && t.team.length > 0)?.team;
    if (recentTeam && recentTeam.length > 0) {
      return recentTeam.map((p, i) => (
        <span key={i} className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 mr-1">{p.name}</span>
      ));
    }
    if (player.mostUsedPokemon && player.mostUsedPokemon.length > 0) {
      return player.mostUsedPokemon.slice(0, 6).map((p, i) => (
        <span key={i} className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 mr-1">{p.name}</span>
      ));
    }
    return <span className="text-xs text-gray-400">No team data</span>;
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Players</h1>
        <p className="text-gray-600">Find and explore player profiles, achievements, and tournament history</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => debouncedSetSearchQuery(e.target.value)}
          placeholder="Search by name, player ID, or region..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'verified', 'champions', 'region'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {selectedFilter === 'region' && (
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedRegion === region
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {region === 'all' ? 'All Regions' : region}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Searching players...</p>
          </div>
        )}

        {!isLoading && memoizedFilteredPlayers.length > 0 && (
          <List
            height={600}
            itemCount={memoizedFilteredPlayers.length}
            itemSize={120}
            width={"100%"}
          >
            {({ index, style }) => {
              const player = memoizedFilteredPlayers[index];
              return (
                <div
                  style={style}
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  tabIndex={0}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer w-full max-w-full overflow-hidden flex flex-col sm:flex-row gap-4 items-center focus:ring-2 focus:ring-blue-400 outline-none"
                  aria-label={`View profile for ${player.name}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-md mb-2 sm:mb-0">
                    {player.name.charAt(0)}
                  </div>
                  {/* Main Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    {/* Name & Region */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg sm:text-xl truncate max-w-[140px] sm:max-w-none">{player.name}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">{player.region}</span>
                      {player.isVerified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium flex items-center gap-1"><UserCheck className="h-3 w-3" />Verified</span>
                      )}
                    </div>
                    {/* Quick Stats Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">
                        <Trophy className="h-3 w-3" />
                        CP: {player.championshipPointsBreakdown?.total || player.championshipPoints || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium">
                        <Star className="h-3 w-3" />
                        {player.winRate}% WR
                      </span>
                      <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                        <Users className="h-3 w-3" />
                        {player.tournaments.length} Tourn.
                      </span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${getDivisionColor(player.division)}`}>
                        {player.division.charAt(0).toUpperCase() + player.division.slice(1)}
                      </span>
                    </div>
                    
                    {/* Championship Points Breakdown */}
                    {player.championshipPointsBreakdown && (
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                        <span className="flex items-center gap-1">
                          <Gem className="h-3 w-3 text-purple-500" />
                          TCG: {player.championshipPointsBreakdown.tcg.current}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-blue-500" />
                          VGC: {player.championshipPointsBreakdown.vgc.current}
                        </span>
                        <span className="flex items-center gap-1">
                          <Crown className="h-3 w-3 text-green-500" />
                          GO: {player.championshipPointsBreakdown.go.current}
                        </span>
                      </div>
                    )}
                    {/* Team Preview */}
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                      <span className="text-xs text-gray-500">Team:</span>
                      {getMostRecentTeam(player).length > 0 ? (
                        getMostRecentTeam(player).slice(0, 6).map((poke, i) => (
                          <span key={i} className="inline-block px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800 rounded-full text-xs font-semibold shadow-sm" title={poke.name}>{poke.name.charAt(0)}</span>
                        ))
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded">No team data</span>
                      )}
                      {getMostRecentTeam(player).length > 6 && (
                        <span className="inline-block px-2 py-1 bg-gray-200 rounded text-xs font-medium text-gray-500">+{getMostRecentTeam(player).length - 6} more</span>
                      )}
                    </div>
                    {/* Achievements & History */}
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                      <span className="text-xs text-gray-500">Achievements:</span>
                      {getTopAchievements(player).length > 0 ? (
                        getTopAchievements(player).slice(0, 2).map((ach, i) => (
                          <span key={i} className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold mr-1 mb-1">{ach}</span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                      {getTopAchievements(player).length > 2 && (
                        <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-700 rounded-full text-xs font-medium mr-1 mb-1">+{getTopAchievements(player).length - 2} more</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-xs text-gray-500">Recent:</span>
                      {getTournamentHistory(player).length > 0 ? (
                        getTournamentHistory(player).slice(0, 2).map((t, i) => (
                          <span key={i} className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold mr-1 mb-1">{t.name} #{t.placement || 'N/A'}</span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No history</span>
                      )}
                      {getTournamentHistory(player).length > 2 && (
                        <span className="inline-block px-2 py-1 bg-indigo-200 text-indigo-700 rounded-full text-xs font-medium mr-1 mb-1">+{getTournamentHistory(player).length - 2} more</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          </List>
        )}

        {!isLoading && searchQuery && memoizedFilteredPlayers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No players found matching your search</p>
            <p className="text-sm text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}

        {!isLoading && !searchQuery && memoizedFilteredPlayers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No players found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSearch; 