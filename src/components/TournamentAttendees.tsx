import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  MapPin, 
  Trophy, 
  Star, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  User,
  Award,
  Target,
  Calendar,
  Clock
} from 'lucide-react';
import { Player, Tournament } from '../types';

interface TournamentAttendeesProps {
  tournament: Tournament;
  attendees: Player[];
  isOpen: boolean;
  onClose: () => void;
  onPlayerSelect?: (playerId: string) => void;
}

interface AttendeeFilters {
  region: string;
  division: string;
  verifiedOnly: boolean;
  hasChampionships: boolean;
  searchQuery: string;
}

const TournamentAttendees: React.FC<TournamentAttendeesProps> = ({
  tournament,
  attendees,
  isOpen,
  onClose,
  onPlayerSelect
}) => {
  const [filters, setFilters] = useState<AttendeeFilters>({
    region: '',
    division: '',
    verifiedOnly: false,
    hasChampionships: false,
    searchQuery: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'championships' | 'region' | 'division'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get unique regions and divisions for filters
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(attendees.map(p => p.region))];
    return uniqueRegions.sort();
  }, [attendees]);

  const divisions = useMemo(() => {
    const uniqueDivisions = [...new Set(attendees.map(p => p.division))];
    return uniqueDivisions.sort();
  }, [attendees]);

  // Filter and sort attendees
  const filteredAndSortedAttendees = useMemo(() => {
    let filtered = attendees.filter(attendee => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = attendee.name.toLowerCase().includes(query);
        const matchesPlayerId = attendee.playerId.toLowerCase().includes(query);
        const matchesRegion = attendee.region.toLowerCase().includes(query);
        if (!matchesName && !matchesPlayerId && !matchesRegion) {
          return false;
        }
      }

      // Region filter
      if (filters.region && attendee.region !== filters.region) {
        return false;
      }

      // Division filter
      if (filters.division && attendee.division !== filters.division) {
        return false;
      }

      // Verified only filter
      if (filters.verifiedOnly && !attendee.isVerified) {
        return false;
      }

      // Has championships filter
      if (filters.hasChampionships && attendee.championships === 0) {
        return false;
      }

      return true;
    });

    // Sort attendees
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'championships':
          aValue = a.championships;
          bValue = b.championships;
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
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [attendees, filters, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      region: '',
      division: '',
      verifiedOnly: false,
      hasChampionships: false,
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

  const getChampionshipIcon = (championships: number) => {
    if (championships >= 3) return '🥇';
    if (championships >= 1) return '🥈';
    return '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{tournament.name} - Attendees</h2>
              <div className="flex items-center space-x-4 text-blue-100">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{attendees.length} registered</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(tournament.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, player ID, or region..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {Object.values(filters).some(v => v !== '' && v !== false) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <select
                    value={filters.region}
                    onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* Division Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
                  <select
                    value={filters.division}
                    onChange={(e) => setFilters(prev => ({ ...prev, division: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Divisions</option>
                    {divisions.map(division => (
                      <option key={division} value={division}>{division.charAt(0).toUpperCase() + division.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Checkbox Filters */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Verified only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.hasChampionships}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasChampionships: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Has CP</span>
                  </label>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    Showing {filteredAndSortedAttendees.length} of {attendees.length} attendees
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Attendees List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredAndSortedAttendees.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No attendees match your current filters.</p>
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAndSortedAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onPlayerSelect?.(attendee.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {attendee.name.split(' ').map(n => n[0]).join('')}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{attendee.name}</h3>
                          {attendee.isVerified && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-blue-600 fill-current" />
                              <span className="text-xs text-blue-600 font-medium">Verified</span>
                            </div>
                          )}
                          {getChampionshipIcon(attendee.championships)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-mono">{attendee.playerId}</span>
                          <span>{attendee.region}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDivisionColor(attendee.division)}`}>
                            {attendee.division.charAt(0).toUpperCase() + attendee.division.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Championship Points */}
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-600">
                          {attendee.championships}
                        </div>
                        <div className="text-xs text-gray-500">CP</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">{filteredAndSortedAttendees.length}</span> attendees shown
            </div>
            <div className="flex items-center space-x-4">
              <span>Sort by:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [typeof sortBy, 'asc' | 'desc'];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="championships-desc">CP (High-Low)</option>
                <option value="championships-asc">CP (Low-High)</option>
                <option value="region-asc">Region (A-Z)</option>
                <option value="division-asc">Division (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentAttendees; 