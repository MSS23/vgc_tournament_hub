import React, { useState, useEffect } from 'react';
import { Search, Users, Filter, MapPin, Trophy, Star, UserCheck } from 'lucide-react';
import { Player } from '../types';
import { mockPlayers } from '../data/mockData';

interface PlayerSearchProps {
  onPlayerSelect: (playerId: string) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ onPlayerSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'champions' | 'region'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const regions = ['all', 'North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Oceania'];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlayers([]);
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
    onPlayerSelect(player.id);
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
          onChange={(e) => setSearchQuery(e.target.value)}
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

        {!isLoading && searchQuery && filteredPlayers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No players found matching your search</p>
            <p className="text-sm text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}

        {!isLoading && searchQuery && filteredPlayers.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-3">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => handlePlayerClick(player)}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {player.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{player.name}</h3>
                          {getAchievementBadge(player)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">ID: {player.playerId}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{player.region}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDivisionColor(player.division)}`}>
                            {player.division.charAt(0).toUpperCase() + player.division.slice(1)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{player.rating}</span>
                          </div>
                          {/* Record */}
                          {getPlayerRecord(player) && (
                            <div className="flex items-center space-x-1">
                              <Trophy className="h-4 w-4 text-green-500" />
                              <span>{getPlayerRecord(player)}</span>
                            </div>
                          )}
                        </div>
                        {/* Team Preview */}
                        <div className="mt-2 flex flex-wrap items-center gap-1">
                          {getTeamPreview(player)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{player.winRate}% WR</p>
                      <p className="text-xs text-gray-500">{player.tournaments.length} tournaments</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!searchQuery && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Start typing to search for players</p>
            <p className="text-sm text-gray-500">Search by name, player ID, or region</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerSearch; 