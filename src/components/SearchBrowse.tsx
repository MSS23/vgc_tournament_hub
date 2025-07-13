import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Clock, X, Filter, Award, Trophy, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { List } from 'react-window';
import { mockPlayers, mockTournaments } from '../data/mockData';
import PlayerCard from './PlayerCard';

interface SearchBrowseProps {
  onPlayerSelect?: (playerId: string) => void;
}

interface RecentSearch {
  id: string;
  type: 'player' | 'tournament';
  query: string;
  timestamp: number;
  resultCount: number;
}

// Debounce utility function
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

const SearchBrowse: React.FC<SearchBrowseProps> = ({ onPlayerSelect }) => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'players' | 'tournaments'>('players');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [followedPlayers, setFollowedPlayers] = useState<Set<string>>(new Set());
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('vgc-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
        // Clear corrupted data
        localStorage.removeItem('vgc-recent-searches');
      }
    }
  }, []);

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('vgc-recent-searches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Memoized filters to prevent recreation on every render
  const filters = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'regionals', label: 'Regionals' },
    { id: 'internationals', label: 'Internationals' },
    { id: 'worlds', label: 'Worlds' },
  ], []);

  // Memoized debounced search function
  const debouncedSetSearchQuery = useMemo(
    () => debounce(setSearchQuery, 300),
    []
  );

  // Memoized filtered players with proper dependencies
  const memoizedFilteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return mockPlayers.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(query) ||
                           player.region.toLowerCase().includes(query) ||
                           player.playerId.toLowerCase().includes(query);
      
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'regionals' && player.tournaments.some(t => t.name.includes('Regional'))) ||
        (selectedFilter === 'internationals' && player.tournaments.some(t => t.name.includes('International'))) ||
        (selectedFilter === 'worlds' && player.tournaments.some(t => t.name.includes('World')));
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  // Memoized filtered tournaments
  const filteredTournaments = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return mockTournaments.filter(tournament => {
      const matchesSearch = tournament.name.toLowerCase().includes(query) ||
                           tournament.location.toLowerCase().includes(query);
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'regionals' && tournament.name.includes('Regional')) ||
        (selectedFilter === 'internationals' && tournament.name.includes('International')) ||
        (selectedFilter === 'worlds' && tournament.name.includes('World'));
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, selectedFilter]);

  // Callback functions with useCallback to prevent unnecessary re-renders
  const addRecentSearch = useCallback((query: string, type: 'player' | 'tournament', resultCount: number) => {
    if (!query.trim()) return;
    
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      type,
      query: query.trim(),
      timestamp: Date.now(),
      resultCount
    };

    setRecentSearches(prev => {
      // Remove duplicate searches for the same query and type
      const filtered = prev.filter(s => !(s.query === query.trim() && s.type === type));
      // Add new search at the beginning
      const updated = [newSearch, ...filtered];
      // Keep only the last 10 searches
      return updated.slice(0, 10);
    });
  }, []);

  const removeRecentSearch = useCallback((searchId: string) => {
    setRecentSearches(prev => prev.filter(s => s.id !== searchId));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      const resultCount = searchType === 'players' 
        ? memoizedFilteredPlayers.length 
        : filteredTournaments.length;
      
      addRecentSearch(query, searchType === 'players' ? 'player' : 'tournament', resultCount);
    }
  }, [searchType, memoizedFilteredPlayers.length, filteredTournaments.length, addRecentSearch]);

  const handleRecentSearchClick = useCallback((search: RecentSearch) => {
    setSearchQuery(search.query);
    setSearchType(search.type === 'player' ? 'players' : 'tournaments');
  }, []);

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

  const handlePlayerClick = useCallback((playerId: string) => {
    navigate(`/profile/${playerId}`);
  }, [navigate]);

  // Memoized utility functions
  const getPlacementIcon = useCallback((placement: number) => {
    if (placement === 1) return '🥇';
    if (placement === 2) return '🥈';
    if (placement === 3) return '🥉';
    if (placement <= 8) return '🎯';
    if (placement <= 16) return '⭐';
    return '📊';
  }, []);

  const formatTimeAgo = useCallback((timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }, []);

  const getSearchTypeIcon = useCallback((type: 'player' | 'tournament') => {
    return type === 'player' ? <Award className="h-4 w-4" /> : <Trophy className="h-4 w-4" />;
  }, []);

  const getSearchTypeColor = useCallback((type: 'player' | 'tournament') => {
    return type === 'player' ? 'text-blue-600' : 'text-yellow-600';
  }, []);

  // Memoized row renderer for react-window
  const PlayerRow = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const player = memoizedFilteredPlayers[index];
    return (
      <div style={style} className="bg-white rounded-xl p-4 border border-gray-200">
        <PlayerCard 
          player={player}
          isFollowing={followedPlayers.has(player.id)}
          onFollowToggle={handleFollowToggle}
          onClick={() => handlePlayerClick(player.id)}
        />
      </div>
    );
  }, [memoizedFilteredPlayers, followedPlayers, handleFollowToggle, handlePlayerClick]);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Search & Browse</h2>
        <p className="text-green-100">Find players and tournaments</p>
      </div>

      {/* Search Type Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSearchType('players')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            searchType === 'players'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Players
        </button>
        <button
          onClick={() => setSearchType('tournaments')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            searchType === 'tournaments'
              ? 'bg-green-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Tournaments
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => debouncedSetSearchQuery(e.target.value)}
          placeholder="Search players or tournaments..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Recently Searched Section */}
      {!searchQuery.trim() && recentSearches.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">Recently Searched</h3>
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2">
            {recentSearches.slice(0, 5).map((search) => (
              <div
                key={search.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleRecentSearchClick(search)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-full bg-white ${getSearchTypeColor(search.type)}`}>
                    {getSearchTypeIcon(search.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{search.query}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="capitalize">{search.type}s</span>
                      <span>•</span>
                      <span>{search.resultCount} results</span>
                      <span>•</span>
                      <span>{formatTimeAgo(search.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRecentSearch(search.id);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {searchQuery.trim() && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Filter by Type</h3>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searchQuery.trim() && (
        <div className="space-y-4">
          {searchType === 'players' && memoizedFilteredPlayers.length > 0 && (
            <List
              height={600}
              itemCount={memoizedFilteredPlayers.length}
              itemSize={100}
              width="100%"
            >
              {PlayerRow}
            </List>
          )}
          {searchType === 'tournaments' && filteredTournaments.length > 0 && (
            <div className="space-y-4">
              {filteredTournaments.map((tournament) => (
                <div key={tournament.id} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{tournament.name}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {tournament.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {new Date(tournament.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{tournament.totalPlayers} players</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tournament.name.includes('Regional') ? 'bg-blue-100 text-blue-800' :
                      tournament.name.includes('International') ? 'bg-purple-100 text-purple-800' :
                      tournament.name.includes('World') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.name.includes('Regional') ? 'Regional' :
                       tournament.name.includes('International') ? 'International' :
                       tournament.name.includes('World') ? 'Worlds' : 'Tournament'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {searchQuery.trim() && ((searchType === 'players' && memoizedFilteredPlayers.length === 0) ||
        (searchType === 'tournaments' && filteredTournaments.length === 0)) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}

      {/* Empty State for No Recent Searches */}
      {!searchQuery.trim() && recentSearches.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Searching</h3>
          <p className="text-gray-600">
            Search for players or tournaments to get started. Your recent searches will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchBrowse);