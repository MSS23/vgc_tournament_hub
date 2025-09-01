import React from 'react';
import { Trophy, Star, UserCheck, Shield, Award, Medal, Crown, Gem, Zap } from 'lucide-react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  isFollowing?: boolean;
  onFollowToggle?: (playerId: string) => void;
  onClick?: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isFollowing = false, onFollowToggle, onClick }) => {
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollowToggle?.(player.id);
  };

  const getPlacementIcon = (placement: number) => {
    if (placement === 1) return <Crown className="h-4 w-4 text-yellow-600" />;
    if (placement <= 4) return <Medal className="h-4 w-4 text-purple-600" />;
    if (placement <= 8) return <Star className="h-4 w-4 text-blue-600" />;
    return <Trophy className="h-4 w-4 text-gray-600" />;
  };

  const getPlacementColor = (placement: number) => {
    if (placement === 1) return 'text-yellow-600';
    if (placement <= 4) return 'text-purple-600';
    if (placement <= 8) return 'text-blue-600';
    if (placement <= 16) return 'text-green-600';
    return 'text-gray-600';
  };

  const getPokemonCompanyBadge = () => {
    if (!player.isPokemonCompanyApproved) return null;

    const getApprovalLevelIcon = (level?: string) => {
      switch (level) {
        case 'brand_ambassador': return <Crown className="h-4 w-4" />;
        case 'official_analyst': return <Award className="h-4 w-4" />;
        case 'content_creator': return <Star className="h-4 w-4" />;
        default: return <Shield className="h-4 w-4" />;
      }
    };

    const getApprovalLevelColor = (level?: string) => {
      switch (level) {
        case 'brand_ambassador': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
        case 'official_analyst': return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
        case 'content_creator': return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
        default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      }
    };

    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getApprovalLevelColor(player.approvalLevel)}`}>
        {getApprovalLevelIcon(player.approvalLevel)}
        <span>{player.approvalLevel?.replace('_', ' ').toUpperCase() || 'APPROVED'}</span>
      </div>
    );
  };

  const getProfessorBadge = () => {
    if (!player.isProfessor) return null;

    const getProfessorLevelColor = (level?: string) => {
      switch (level) {
        case 'emeritus': return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
        case 'full': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
        case 'associate': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
        case 'assistant': return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
        default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      }
    };

    const getProfessorLevelIcon = (level?: string) => {
      switch (level) {
        case 'emeritus': return <Crown className="h-4 w-4" />;
        case 'full': return <Award className="h-4 w-4" />;
        case 'associate': return <Star className="h-4 w-4" />;
        case 'assistant': return <Trophy className="h-4 w-4" />;
        default: return <Shield className="h-4 w-4" />;
      }
    };

    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getProfessorLevelColor(player.professorLevel)}`}>
        {getProfessorLevelIcon(player.professorLevel)}
        <span>{player.professorLevel?.toUpperCase() || 'PROFESSOR'}</span>
      </div>
    );
  };

  const getSpecialBadges = () => {
    if (!player.specialBadges || player.specialBadges.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1">
        {player.specialBadges.map((badge, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full text-xs font-medium"
          >
            {badge}
          </span>
        ))}
      </div>
    );
  };

  const getChampionshipPointsDisplay = () => {
    const breakdown = player.championshipPointsBreakdown;
    const total = breakdown?.total || player.championshipPoints || 0;

    return (
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Championship Points</span>
          <span className="text-lg font-bold text-gray-900">{total.toLocaleString()}</span>
        </div>

        {/* Format breakdown */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Gem className="h-3 w-3 text-purple-500" />
            <span className="text-gray-600">TCG:</span>
            <span className="font-medium">{breakdown?.tcg?.current || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-3 w-3 text-blue-500" />
            <span className="text-gray-600">VGC:</span>
            <span className="font-medium">{breakdown?.vgc?.current || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Crown className="h-3 w-3 text-green-500" />
            <span className="text-gray-600">GO:</span>
            <span className="font-medium">{breakdown?.go?.current || 0}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {player.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{player.name}</h3>
            <p className="text-sm text-gray-600">{player.playerId}</p>
          </div>
        </div>
        <button
          onClick={handleFollowClick}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isFollowing
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Championship Points Display */}
      {getChampionshipPointsDisplay()}

      {/* Pokémon Company Approval Badge */}
      {getPokemonCompanyBadge()}

      {/* Professor Badge */}
      {getProfessorBadge()}

      {/* Special Badges */}
      {getSpecialBadges()}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">{player.championships}</p>
          <p className="text-xs text-gray-600">Championships</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{player.winRate}%</p>
          <p className="text-xs text-gray-600">Win Rate</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{player.rating}</p>
          <p className="text-xs text-gray-600">Rating</p>
        </div>
      </div>

      {/* Professor Information */}
      {player.isProfessor && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Professor Level:</span>
            <span className="font-medium text-blue-700">{player.professorLevel}</span>
          </div>
          {player.certificationNumber && (
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-600">Cert #:</span>
              <span className="font-medium text-blue-700">{player.certificationNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Live Tournament Status */}
      {player.isActiveInLiveTournament && (
        <div className="mt-3 p-2 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Live Tournament:</span>
            <span className="font-medium text-green-700">{player.currentTournament}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-gray-600">Round {player.currentRound}, Table {player.currentTable}</span>
            <span className="font-medium text-green-700">Active</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;