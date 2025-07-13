import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Trophy, Medal, Award, Users, TrendingUp, Filter, Search, Globe, MapPin, Flag } from 'lucide-react';
import { Player } from '../types';
import { mockPlayers } from '../data/mockData';
import { debounce, arrayUtils } from '../utils/performance';

interface LeaderboardFilters {
  scope: 'global' | 'region' | 'country';
  region: string;
  country: string;
  division: string;
  searchQuery: string;
}

interface LeaderboardProps {
  players: Player[];
  currentPlayerId?: string;
  onPlayerSelect?: (playerId: string) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  currentPlayerId,
  onPlayerSelect
}) => {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    scope: 'global',
    region: '',
    country: '',
    division: '',
    searchQuery: ''
  });
  const [showMyCP, setShowMyCP] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<'all' | 'master' | 'senior' | 'junior'>('all');
  const [sortBy, setSortBy] = useState<'championships' | 'name' | 'region' | 'division'>('championships');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const myRowRef = useRef<HTMLTableRowElement>(null);

  // Memoized current player
  const currentPlayer = useMemo(() => 
    players.find(p => p.id === currentPlayerId), 
    [players, currentPlayerId]
  );

  // Memoized unique values for filters
  const uniqueValues = useMemo(() => {
    const regions = new Set<string>();
    const countries = new Set<string>();
    const divisions = new Set<string>();

    players.forEach(player => {
      regions.add(player.region);
      if ((player as any).country) {
        countries.add((player as any).country);
      }
      divisions.add(player.division);
    });

    return {
      regions: Array.from(regions).sort(),
      countries: Array.from(countries).sort(),
      divisions: Array.from(divisions).sort()
    };
  }, [players]);

  // Memoized region-country mapping
  const regionCountryMap = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    players.forEach(player => {
      if (!map[player.region]) {
        map[player.region] = new Set();
      }
      if ((player as any).country) {
        map[player.region].add((player as any).country);
      }
    });
    return map;
  }, [players]);

  // Memoized filtered players with optimized algorithm
  const filteredPlayers = useMemo(() => {
    let filtered = players;
    
    // Filter by division first (most restrictive)
    if (selectedDivision !== 'all') {
      filtered = filtered.filter(p => p.division === selectedDivision);
    }
    
    // Filter by scope
    if (filters.scope === 'region') {
      if (filters.region) {
        filtered = filtered.filter(p => p.region === filters.region);
      } else if (currentPlayer?.region) {
        filtered = filtered.filter(p => p.region === currentPlayer.region);
      }
    } else if (filters.scope === 'country' && (filters.country || (currentPlayer as any)?.country)) {
      const country = filters.country || (currentPlayer as any)?.country;
      const region = filters.region || currentPlayer?.region;
      if (country && region) {
        filtered = filtered.filter(p => p.region === region && (p as any).country === country);
      }
    }

    // Filter by search query (case-insensitive)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.playerId.toLowerCase().includes(query) ||
        p.region.toLowerCase().includes(query) ||
        ((p as any).country && (p as any).country.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [players, filters, currentPlayer, selectedDivision]);

  // Memoized sorted players
  const sortedPlayers = useMemo(() => {
    const sorted = [...filteredPlayers];
    
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'championships':
          aValue = a.championships || 0;
          bValue = b.championships || 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'region':
          aValue = a.region.toLowerCase();
          bValue = b.region.toLowerCase();
          break;
        case 'division':
          aValue = a.division.toLowerCase();
          bValue = b.division.toLowerCase();
          break;
        default:
          aValue = a.championships || 0;
          bValue = b.championships || 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredPlayers, sortBy, sortOrder]);

  // Memoized current player's rank
  const myRank = useMemo(() => {
    if (!currentPlayer) return null;
    return sortedPlayers.findIndex(p => p.id === currentPlayer.id) + 1;
  }, [sortedPlayers, currentPlayer]);

  // Scroll to my row if showMyCP is enabled
  useEffect(() => {
    if (showMyCP && myRowRef.current && myRank) {
      myRowRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [showMyCP, myRank]);

  // Callback functions
  const clearFilters = useCallback(() => {
    setFilters({
      scope: 'global',
      region: '',
      country: '',
      division: '',
      searchQuery: ''
    });
    setSelectedDivision('all');
  }, []);

  const handleSort = useCallback((field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  const handlePlayerClick = useCallback((playerId: string) => {
    onPlayerSelect?.(playerId);
  }, [onPlayerSelect]);

  // Memoized utility functions
  const getDivisionColor = useCallback((division: string) => {
    switch (division) {
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'senior': return 'bg-blue-100 text-blue-800';
      case 'junior': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getRankIcon = useCallback((rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return null;
    }
  }, []);

  const getRankColor = useCallback((rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600 font-bold';
      case 2: return 'text-gray-600 font-bold';
      case 3: return 'text-amber-600 font-bold';
      case 4: return 'text-blue-600 font-semibold';
      case 5: return 'text-blue-600 font-semibold';
      default: return 'text-gray-700';
    }
  }, []);

  // Debounced search handler
  const debouncedSetSearchQuery = useMemo(
    () => debounce((value: string) => {
      setFilters(prev => ({ ...prev, searchQuery: value }));
    }, 300),
    []
  );

  // Memoized filter options
  const filterOptions = useMemo(() => ({
    scope: [
      { value: 'global' as const, label: 'Global', icon: Globe },
      { value: 'region' as const, label: 'Region', icon: MapPin },
      { value: 'country' as const, label: 'Country', icon: Flag }
    ],
    divisions: [
      { value: 'all' as const, label: 'All Divisions' },
      { value: 'master' as const, label: 'Master' },
      { value: 'senior' as const, label: 'Senior' },
      { value: 'junior' as const, label: 'Junior' }
    ]
  }), []);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Global Leaderboard</h2>
              <p className="text-purple-100">Top VGC Players Worldwide</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{sortedPlayers.length}</p>
            <p className="text-sm text-purple-100">Players</p>
          </div>
        </div>
        
        {/* Current Player Stats */}
        {currentPlayer && (
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl font-bold">
                  {currentPlayer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{currentPlayer.name}</p>
                  <p className="text-sm text-purple-100">#{myRank} • {currentPlayer.region}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{currentPlayer.championships || 0}</p>
                <p className="text-sm text-purple-100">Championships</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search players..."
            onChange={(e) => debouncedSetSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Scope Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.scope}
              onChange={(e) => setFilters(prev => ({ ...prev, scope: e.target.value as any }))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-200"
            >
              {filterOptions.scope.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Division Filter */}
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-200"
            >
              {filterOptions.divisions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          {filters.scope !== 'global' && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <select
                value={filters.region}
                onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-200"
              >
                <option value="">All Regions</option>
                {uniqueValues.regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          )}

          {/* Country Filter */}
          {filters.scope === 'country' && (
            <div className="flex items-center space-x-2">
              <Flag className="h-4 w-4 text-gray-500" />
              <select
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-200"
              >
                <option value="">All Countries</option>
                {filters.region && regionCountryMap[filters.region] && 
                  Array.from(regionCountryMap[filters.region]).map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))
                }
              </select>
            </div>
          )}

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
          >
            Clear filters
          </button>
        </div>

        {/* Show My CP Button */}
        {currentPlayer && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowMyCP(!showMyCP)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showMyCP
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              {showMyCP ? 'Hide My Position' : 'Show My Position'}
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-20">
                  Rank
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Player</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('championships')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Championships</span>
                    <TrendingUp className={`h-4 w-4 transition-transform ${
                      sortBy === 'championships' && sortOrder === 'desc' ? 'rotate-180' : ''
                    }`} />
                  </div>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('region')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Region</span>
                    <TrendingUp className={`h-4 w-4 transition-transform ${
                      sortBy === 'region' && sortOrder === 'desc' ? 'rotate-180' : ''
                    }`} />
                  </div>
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('division')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Division</span>
                    <TrendingUp className={`h-4 w-4 transition-transform ${
                      sortBy === 'division' && sortOrder === 'desc' ? 'rotate-180' : ''
                    }`} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedPlayers.map((player, index) => (
                <tr
                  key={player.id}
                  ref={player.id === currentPlayerId ? myRowRef : null}
                  className={`transition-colors cursor-pointer hover:bg-purple-50 focus:bg-purple-100 outline-none ${
                    player.id === currentPlayerId ? 'bg-purple-100' : ''
                  }`}
                  onClick={() => handlePlayerClick(player.id)}
                  tabIndex={0}
                  aria-label={`View profile for ${player.name}`}
                >
                  <td className="px-4 py-3 sticky left-0 bg-inherit z-10">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(index + 1)}
                      <span className={getRankColor(index + 1)}>#{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{player.name}</p>
                        <p className="text-sm text-gray-500">{player.playerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-gray-900">{player.championships || 0}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-gray-700">{player.region}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDivisionColor(player.division)}`}>
                      {player.division}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {sortedPlayers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No players found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Results Summary */}
      {sortedPlayers.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            Showing {sortedPlayers.length} of {players.length} players
            {filters.searchQuery && ` matching "${filters.searchQuery}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(Leaderboard); 