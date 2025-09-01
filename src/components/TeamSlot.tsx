import React from 'react';
import { Edit, Star, Trophy, Calendar, Users, Plus, Lock, Trash2, Copy, Share2 } from 'lucide-react';
import { Team, TeamSlot as ITeamSlot } from '../types';

interface TeamSlotProps {
  slot: ITeamSlot;
  isSelected?: boolean;
  showActions?: boolean;
  onSelect?: (slotId: string) => void;
  onEdit?: (team: Team) => void;
  onDuplicate?: (team: Team) => void;
  onDelete?: (teamId: string) => void;
  onFavorite?: (teamId: string) => void;
  onShare?: (team: Team) => void;
  onCreate?: (slotNumber: number) => void;
  className?: string;
}

const TeamSlot: React.FC<TeamSlotProps> = ({
  slot,
  isSelected = false,
  showActions = false,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  onFavorite,
  onShare,
  onCreate,
  className = ''
}) => {
  const { team, slotNumber, isLocked, quickAccessName } = slot;

  const handleSlotClick = () => {
    if (onSelect) {
      onSelect(slot.slotId);
    }
  };

  const handleCreateTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreate) {
      onCreate(slotNumber);
    }
  };

  const handleEditTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (team && onEdit) {
      onEdit(team);
    }
  };

  const handleDuplicateTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (team && onDuplicate) {
      onDuplicate(team);
    }
  };

  const handleDeleteTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (team && onDelete) {
      onDelete(team.id);
    }
  };

  const handleFavoriteTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (team && onFavorite) {
      onFavorite(team.id);
    }
  };

  const handleShareTeam = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (team && onShare) {
      onShare(team);
    }
  };

  // Empty slot display
  if (!team) {
    return (
      <div
        onClick={handleSlotClick}
        className={`
          group relative bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 
          transition-all duration-200 cursor-pointer hover:border-green-400 hover:bg-green-50
          ${isSelected ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : ''}
          ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {/* Slot Number */}
        <div className="absolute top-2 left-2 text-xs font-medium text-gray-400">
          #{slotNumber}
        </div>

        {/* Lock Icon */}
        {isLocked && (
          <div className="absolute top-2 right-2">
            <Lock className="h-3 w-3 text-gray-400" />
          </div>
        )}

        {/* Empty Slot Content */}
        <div className="flex flex-col items-center justify-center min-h-[120px] space-y-2">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center group-hover:border-green-400 transition-colors">
            <Plus className="h-6 w-6 text-gray-400 group-hover:text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 group-hover:text-green-600">
              {isLocked ? 'Locked Slot' : 'Empty Slot'}
            </p>
            {quickAccessName && (
              <p className="text-xs text-gray-400">{quickAccessName}</p>
            )}
            {!isLocked && (
              <button
                onClick={handleCreateTeam}
                className="mt-2 text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Create Team
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Team slot display
  return (
    <div
      onClick={handleSlotClick}
      className={`
        group relative bg-white border-2 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer
        ${isSelected 
          ? 'border-green-500 ring-2 ring-green-200 shadow-lg' 
          : 'border-gray-200 hover:border-green-300 hover:shadow-md'
        }
        ${className}
      `}
    >
      {/* Header */}
      <div className="relative p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        {/* Slot Number */}
        <div className="absolute top-2 left-2 text-xs font-medium text-gray-500">
          #{slotNumber}
        </div>

        {/* Favorite Icon */}
        {team.isFavorite && (
          <div className="absolute top-2 right-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </div>
        )}

        {/* Team Name */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 truncate pr-6">
            {team.name}
          </h3>
          {quickAccessName && quickAccessName !== team.name && (
            <p className="text-xs text-gray-500 truncate">{quickAccessName}</p>
          )}
        </div>

        {/* Battle Team Name */}
        {team.battleTeamName && (
          <p className="text-xs text-blue-600 mt-1 truncate">
            Battle: {team.battleTeamName}
          </p>
        )}
      </div>

      {/* Pokemon Preview */}
      <div className="p-3">
        <div className="flex flex-wrap gap-1 mb-3">
          {team.pokemon.slice(0, 6).map((pokemon, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1"
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {pokemon.name?.charAt(0) || '?'}
              </div>
              <span className="text-xs font-medium text-gray-700 truncate max-w-[60px]">
                {pokemon.name || 'Unknown'}
              </span>
            </div>
          ))}
          {team.pokemon.length < 6 && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-gray-300 text-gray-400">
              <span className="text-xs">{6 - team.pokemon.length}</span>
            </div>
          )}
        </div>

        {/* Team Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {team.winRate && (
              <span className="flex items-center space-x-1">
                <Trophy className="h-3 w-3" />
                <span>{Math.round(team.winRate)}%</span>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{team.usageCount}</span>
            </span>
            {team.lastUsedInTournament && (
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Recent</span>
              </span>
            )}
          </div>
          <div className="text-gray-400">
            {new Date(team.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex space-x-2">
            <button
              onClick={handleEditTeam}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              title="Edit Team"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleFavoriteTeam}
              className={`p-2 text-white rounded-full transition-colors ${
                team.isFavorite 
                  ? 'bg-yellow-500 hover:bg-yellow-600' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              title={team.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Star className={`h-4 w-4 ${team.isFavorite ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={handleDuplicateTeam}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              title="Duplicate Team"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={handleShareTeam}
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              title="Share Team"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDeleteTeam}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              title="Delete Team"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Rental Team ID Indicator */}
      {team.rentalTeamId && (
        <div className="absolute bottom-1 right-1">
          <div className="w-2 h-2 rounded-full bg-green-500" title="Has Rental Code" />
        </div>
      )}
    </div>
  );
};

export default TeamSlot;