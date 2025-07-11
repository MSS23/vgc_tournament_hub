import React from 'react';
import { Trophy, TrendingUp, MapPin, Star, UserPlus, UserCheck, Award } from 'lucide-react';
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
    if (placement === 1) return '🥇';
    if (placement === 2) return '🥈';
    if (placement === 3) return '🥉';
    if (placement <= 8) return '🏆';
    if (placement <= 16) return '⭐';
    return '📊';
  };

  const getPlacementColor = (placement: number) => {
    if (placement <= 4) return 'text-yellow-600';
    if (placement <= 8) return 'text-purple-600';
    if (placement <= 16) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getPokemonCompanyBadge = () => {
    if (!player.isPokemonCompanyApproved) return null;
    
    const getApprovalLevelIcon = (level?: string) => {
      switch (level) {
        case 'official_analyst': return '📊';
        case 'content_creator': return '✍️';
        case 'brand_ambassador': return '🌟';
        default: return '✓';
      }
    };

    const getApprovalLevelColor = (level?: string) => {
      switch (level) {
        case 'official_analyst': return 'bg-purple-100 text-purple-800';
        case 'content_creator': return 'bg-blue-100 text-blue-800';
        case 'brand_ambassador': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalLevelColor(player.approvalLevel)}`}>
        {getApprovalLevelIcon(player.approvalLevel)} Pokémon Company {player.approvalLevel?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </div>
    );
  };

  const getProfessorBadge = () => {
    if (!player.isProfessor) return null;
    
    const getProfessorLevelColor = (level?: string) => {
      switch (level) {
        case 'full': return 'bg-purple-100 text-purple-800';
        case 'associate': return 'bg-blue-100 text-blue-800';
        case 'assistant': return 'bg-green-100 text-green-800';
        case 'emeritus': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getProfessorLevelIcon = (level?: string) => {
      switch (level) {
        case 'full': return '🎓';
        case 'associate': return '📚';
        case 'assistant': return '📖';
        case 'emeritus': return '🏆';
        default: return '📚';
      }
    };

    return (
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getProfessorLevelColor(player.professorLevel)}`}>
        {getProfessorLevelIcon(player.professorLevel)} Professor {player.professorLevel?.replace(/\b\w/g, l => l.toUpperCase())}
      </div>
    );
  };

  const getSpecialBadges = () => {
    if (!player.specialBadges || player.specialBadges.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {player.specialBadges.slice(0, 2).map((badge, index) => (
          <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            {badge}
          </span>
        ))}
        {player.specialBadges.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            +{player.specialBadges.length - 2} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {player.name.charAt(0)}
            </div>
            {player.isPokemonCompanyApproved && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎮</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{player.name}</h3>
              {player.isVerified && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">ID: {player.playerId}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{player.region}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                player.division === 'master' ? 'bg-purple-100 text-purple-800' :
                player.division === 'senior' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {player.division.charAt(0).toUpperCase() + player.division.slice(1)}
              </span>
            </div>
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
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900 mb-2">Professor Information</p>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Certification:</span>
              <span className="font-mono">{player.professorCertificationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Certified:</span>
              <span>{player.professorCertificationDate ? new Date(player.professorCertificationDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            {player.canCreateTournaments && (
              <div className="flex justify-between">
                <span>Tournament Creation:</span>
                <span className="text-green-600 font-medium">✓ Enabled</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Tournament Performance */}
      {player.tournaments && player.tournaments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900 mb-2">Recent Performance</p>
          <div className="space-y-2">
            {player.tournaments.slice(0, 2).map((tournament, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate">{tournament.name}</span>
                <div className="flex items-center space-x-1">
                  <span className={getPlacementColor(tournament.placement || 0)}>
                    {getPlacementIcon(tournament.placement || 0)}
                  </span>
                  <span className="font-medium">{tournament.placement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;