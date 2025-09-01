import React, { useState, useMemo } from 'react';
import { 
  Plus, Filter, Search, Grid, List, Star, Trophy, Calendar, 
  Download, Upload, Settings, Trash2, Lock, Unlock, 
  BarChart3, Users, Clock, Tag, RefreshCw
} from 'lucide-react';
import { Team } from '../types';
import { useTeamSlots } from '../hooks/useTeamSlots';
import TeamSlot from './TeamSlot';
import Modal from './Modal';

type ViewMode = 'grid' | 'list';
type FilterMode = 'all' | 'favorites' | 'recent' | 'with-rental' | 'unused';
type SortMode = 'name' | 'updated' | 'usage' | 'winrate' | 'slot';

const TeamManagement: React.FC = () => {
  const {
    teamSlots,
    activeSlot,
    loading,
    error,
    saveTeamToSlot,
    removeTeamFromSlot,
    updateTeamInSlot,
    duplicateTeam,
    toggleFavorite,
    setActiveSlot,
    toggleSlotLock,
    updateSlotName,
    getAllTeams,
    getTeamsByFilter,
    getNextAvailableSlot,
    exportTeamData,
    clearError
  } = useTeamSlots();

  // Component state
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [sortMode, setSortMode] = useState<SortMode>('slot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newSlotNumber, setNewSlotNumber] = useState<number | null>(null);

  // Filter and sort teams
  const filteredAndSortedSlots = useMemo(() => {
    let filtered = teamSlots.filter(slot => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const team = slot.team;
        const matchesSearch = 
          slot.quickAccessName?.toLowerCase().includes(query) ||
          team?.name.toLowerCase().includes(query) ||
          team?.description?.toLowerCase().includes(query) ||
          team?.tags.some(tag => tag.toLowerCase().includes(query)) ||
          team?.pokemon.some(p => p.name?.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      switch (filterMode) {
        case 'favorites':
          return slot.team?.isFavorite === true;
        case 'recent':
          if (!slot.team) return false;
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return new Date(slot.team.updatedAt) > weekAgo;
        case 'with-rental':
          return slot.team?.rentalTeamId !== undefined;
        case 'unused':
          return slot.team === null && !slot.isLocked;
        default:
          return true;
      }
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortMode) {
        case 'name':
          const nameA = a.team?.name || a.quickAccessName || `Slot ${a.slotNumber}`;
          const nameB = b.team?.name || b.quickAccessName || `Slot ${b.slotNumber}`;
          return nameA.localeCompare(nameB);
        case 'updated':
          const dateA = new Date(a.team?.updatedAt || a.lastModified);
          const dateB = new Date(b.team?.updatedAt || b.lastModified);
          return dateB.getTime() - dateA.getTime();
        case 'usage':
          const usageA = a.team?.usageCount || 0;
          const usageB = b.team?.usageCount || 0;
          return usageB - usageA;
        case 'winrate':
          const winrateA = a.team?.winRate || 0;
          const winrateB = b.team?.winRate || 0;
          return winrateB - winrateA;
        case 'slot':
        default:
          return a.slotNumber - b.slotNumber;
      }
    });

    return filtered;
  }, [teamSlots, filterMode, sortMode, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const allTeams = getAllTeams();
    return {
      totalSlots: teamSlots.length,
      usedSlots: allTeams.length,
      emptySlots: teamSlots.filter(s => s.team === null && !s.isLocked).length,
      lockedSlots: teamSlots.filter(s => s.isLocked).length,
      favoriteTeams: allTeams.filter(t => t.isFavorite).length,
      teamsWithRental: allTeams.filter(t => t.rentalTeamId).length,
      averageWinRate: allTeams.reduce((acc, t) => acc + (t.winRate || 0), 0) / (allTeams.length || 1),
      totalUsage: allTeams.reduce((acc, t) => acc + (t.usageCount || 0), 0)
    };
  }, [teamSlots, getAllTeams]);

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(selectedSlotId === slotId ? null : slotId);
  };

  const handleCreateTeam = (slotNumber: number) => {
    setNewSlotNumber(slotNumber);
    setShowCreateModal(true);
  };

  const handleEditTeam = (team: Team) => {
    // This would open the TeamBuilder with the existing team
    console.log('Edit team:', team.name);
  };

  const handleDuplicateTeam = (team: Team) => {
    const targetSlot = getNextAvailableSlot();
    if (targetSlot) {
      duplicateTeam(team.id, targetSlot);
    } else {
      alert('No available slots for duplication');
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      const slot = teamSlots.find(s => s.team?.id === teamId);
      if (slot) {
        removeTeamFromSlot(slot.slotNumber);
      }
    }
  };

  const handleShareTeam = (team: Team) => {
    // Copy rental code or team data to clipboard
    if (team.rentalTeamId) {
      navigator.clipboard.writeText(team.rentalTeamId);
      alert(`Rental code ${team.rentalTeamId} copied to clipboard!`);
    } else {
      console.log('Share team:', team.name);
    }
  };

  const handleImportTeam = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Import functionality would be handled by the useTeamSlots hook
        console.log('Import file:', file.name);
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-green-600" />
          <span className="text-gray-600">Loading teams...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Team Management</h2>
            <p className="text-green-100">Manage your VGC team collection</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowStatsModal(true)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="View Statistics"
            >
              <BarChart3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.usedSlots}</div>
            <div className="text-xs text-green-100">Teams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.emptySlots}</div>
            <div className="text-xs text-green-100">Empty</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.favoriteTeams}</div>
            <div className="text-xs text-green-100">Favorites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(stats.averageWinRate)}%</div>
            <div className="text-xs text-green-100">Avg WR</div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center space-x-2">
          {/* Filter Dropdown */}
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Teams</option>
            <option value="favorites">Favorites</option>
            <option value="recent">Recent</option>
            <option value="with-rental">With Rental</option>
            <option value="unused">Empty Slots</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="slot">Slot Order</option>
            <option value="name">Name</option>
            <option value="updated">Last Updated</option>
            <option value="usage">Usage</option>
            <option value="winrate">Win Rate</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid' 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list' 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleImportTeam}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            title="Import Teams"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            onClick={exportTeamData}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            title="Export Teams"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Team Slots Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-4'
      }>
        {filteredAndSortedSlots.map((slot) => (
          <TeamSlot
            key={slot.slotId}
            slot={slot}
            isSelected={selectedSlotId === slot.slotId}
            showActions={true}
            onSelect={handleSlotSelect}
            onEdit={handleEditTeam}
            onDuplicate={handleDuplicateTeam}
            onDelete={handleDeleteTeam}
            onFavorite={toggleFavorite}
            onShare={handleShareTeam}
            onCreate={handleCreateTeam}
            className={viewMode === 'list' ? 'flex-row p-4' : ''}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedSlots.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filterMode !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first team to get started'
            }
          </p>
          {!searchQuery && filterMode === 'all' && (
            <button
              onClick={() => handleCreateTeam(getNextAvailableSlot() || 1)}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Team</span>
            </button>
          )}
        </div>
      )}

      {/* Statistics Modal */}
      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="Team Statistics"
        size="lg"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Slot Usage</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Slots</span>
                <span className="font-medium">{stats.totalSlots}</span>
              </div>
              <div className="flex justify-between">
                <span>Used Slots</span>
                <span className="font-medium text-green-600">{stats.usedSlots}</span>
              </div>
              <div className="flex justify-between">
                <span>Empty Slots</span>
                <span className="font-medium text-gray-500">{stats.emptySlots}</span>
              </div>
              <div className="flex justify-between">
                <span>Locked Slots</span>
                <span className="font-medium text-red-500">{stats.lockedSlots}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Team Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Favorite Teams</span>
                <span className="font-medium text-yellow-600">{stats.favoriteTeams}</span>
              </div>
              <div className="flex justify-between">
                <span>Teams w/ Rental</span>
                <span className="font-medium text-blue-600">{stats.teamsWithRental}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Win Rate</span>
                <span className="font-medium">{Math.round(stats.averageWinRate)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Usage</span>
                <span className="font-medium">{stats.totalUsage}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamManagement;