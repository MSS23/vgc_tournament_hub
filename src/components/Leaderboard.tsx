import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Trophy, 
  MapPin, 
  Globe, 
  TrendingUp, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Star,
  Award,
  Target,
  Users,
  Flag
} from 'lucide-react';
import { Player } from '../types';

interface LeaderboardProps {
  players: Player[];
  currentPlayerId?: string;
  onPlayerSelect?: (playerId: string) => void;
}

interface LeaderboardFilters {
  scope: 'global' | 'region' | 'country';
  region: string;
  country: string;
  division: string;
  searchQuery: string;
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
  const myRowRef = useRef<HTMLTableRowElement>(null);

  // Find current player
  const currentPlayer = useMemo(() => players.find(p => p.id === currentPlayerId), [players, currentPlayerId]);

  // Filtered players
  const filteredPlayers = useMemo(() => {
    let filtered = players;
    if (filters.scope === 'region') {
      // If a region is selected, filter by that region (e.g., Europe)
      if (filters.region) {
        filtered = filtered.filter(p => p.region === filters.region);
      } else if (currentPlayer?.region) {
        filtered = filtered.filter(p => p.region === currentPlayer.region);
      }
    } else if (filters.scope === 'country' && (filters.country || (currentPlayer?.country && currentPlayer?.region))) {
      // Only filter by country if selected or if currentPlayer has country/region
      const country = filters.country || (currentPlayer as any)?.country;
      const region = filters.region || currentPlayer?.region;
      if (country && region) {
        filtered = filtered.filter(p => p.region === region && (p as any).country === country);
      }
    }
    if (filters.division) {
      filtered = filtered.filter(p => p.division === filters.division);
    }
    if (filters.searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()));
    }
    // Sort by CP descending
    return filtered.slice().sort((a, b) => (b.championships || 0) - (a.championships || 0));
  }, [players, filters, currentPlayer]);

  // Find current player's rank in filtered list
  const myRank = useMemo(() => {
    if (!currentPlayer) return null;
    return filteredPlayers.findIndex(p => p.id === currentPlayer.id) + 1;
  }, [filteredPlayers, currentPlayer]);

  // Scroll to my row if showMyCP is enabled
  useEffect(() => {
    if (showMyCP && myRowRef.current) {
      myRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showMyCP, myRank]);

  // Unique regions and countries for filter dropdowns
  const regions = Array.from(new Set(players.map(p => p.region))).sort();
  const countries = Array.from(new Set((players as any[]).map(p => p.country).filter(Boolean))).sort();
  const divisions = Array.from(new Set(players.map(p => p.division))).sort();

  const clearFilters = () => {
    setFilters({
      scope: 'global',
      region: '',
      country: '',
      division: '',
      searchQuery: ''
    });
  };

  const getDivisionColor = (division: string) => {
    switch (division) {
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'senior': return 'bg-blue-100 text-blue-800';
      case 'junior': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-50';
      case 2: return 'text-gray-600 bg-gray-50';
      case 3: return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600';
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'global': return <Globe className="h-4 w-4" />;
      case 'region': return <MapPin className="h-4 w-4" />;
      case 'country': return <Flag className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg flex items-center"><Trophy className="w-5 h-5 mr-1 text-yellow-500" /> Leaderboard</span>
          <button
            className={`ml-4 px-3 py-1 rounded-full border text-sm font-medium transition-colors ${showMyCP ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50'}`}
            onClick={() => setShowMyCP(v => !v)}
          >
            {showMyCP ? 'Hide My CP' : 'Show My CP'}
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filters.scope}
            onChange={e => setFilters(f => ({ ...f, scope: e.target.value as any }))}
          >
            <option value="global">Global</option>
            <option value="region">Region</option>
            <option value="country">Country</option>
          </select>
          {filters.scope === 'region' && (
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filters.region || ''}
              onChange={e => setFilters(f => ({ ...f, region: e.target.value }))}
            >
              <option value="">All Regions</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          )}
          {filters.scope === 'country' && (
            <select
              className="border rounded px-2 py-1 text-sm"
              value={filters.country || (currentPlayer as any)?.country || ''}
              onChange={e => setFilters(f => ({ ...f, country: e.target.value }))}
            >
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filters.division}
            onChange={e => setFilters(f => ({ ...f, division: e.target.value }))}
          >
            <option value="">All Divisions</option>
            {divisions.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)})</option>)}
          </select>
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm"
            placeholder="Search player..."
            value={filters.searchQuery}
            onChange={e => setFilters(f => ({ ...f, searchQuery: e.target.value }))}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-2 text-left">#</th>
              <th className="px-2 py-2 text-left">Player</th>
              <th className="px-2 py-2 text-left">Region</th>
              <th className="px-2 py-2 text-left">Division</th>
              <th className="px-2 py-2 text-left">CP</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player, idx) => {
              const isMe = player.id === currentPlayerId;
              return (
                <tr
                  key={player.id}
                  ref={isMe && showMyCP ? myRowRef : undefined}
                  className={`transition-colors ${isMe && showMyCP ? 'bg-blue-100 border-2 border-blue-500 font-bold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isMe ? 'shadow-inner' : ''}`}
                  onClick={() => onPlayerSelect && onPlayerSelect(player.id)}
                  style={{ cursor: onPlayerSelect ? 'pointer' : undefined }}
                >
                  <td className="px-2 py-2 font-semibold">{idx + 1}</td>
                  <td className="px-2 py-2 flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 w-7 h-7 flex items-center justify-center font-bold text-gray-700">
                      {player.name.charAt(0)}
                    </span>
                    {player.name}
                    {isMe && showMyCP && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">You</span>
                    )}
                  </td>
                  <td className="px-2 py-2">{player.region}</td>
                  <td className="px-2 py-2 capitalize">{player.division}</td>
                  <td className="px-2 py-2 font-mono text-blue-700 font-bold">{player.championships ?? 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showMyCP && currentPlayer && myRank && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-4">
          <span className="font-bold text-blue-700 text-lg">Your CP: {currentPlayer.championships ?? 0}</span>
          <span className="text-gray-700">Rank: <span className="font-bold">#{myRank}</span></span>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 