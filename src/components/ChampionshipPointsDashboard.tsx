import React, { useState, useMemo } from 'react';
import { Trophy, TrendingUp, Calendar, Users, Target, Award, BarChart3, Filter, Medal, Star, ChevronRight, Zap, Crown, Gem } from 'lucide-react';
import { ChampionshipPointsBreakdown, ChampionshipPointsFormat, ChampionshipEvent } from '../types';
import { useTranslation } from 'react-i18next';

interface ChampionshipPointsDashboardProps {
  pointsBreakdown: ChampionshipPointsBreakdown;
  playerName?: string;
  onEventClick?: (event: ChampionshipEvent) => void;
}

const ChampionshipPointsDashboard: React.FC<ChampionshipPointsDashboardProps> = ({
  pointsBreakdown,
  playerName = 'Trainer',
  onEventClick
}) => {
  const { t } = useTranslation();
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'tcg' | 'vgc' | 'go'>('all');
  const [selectedSeason, setSelectedSeason] = useState<'current' | 'season' | 'lifetime'>('current');

  const formats = [
    { id: 'all', label: t('championship.allFormats', 'All Formats'), icon: Trophy },
    { id: 'tcg', label: t('championship.tcg', 'TCG'), icon: Gem },
    { id: 'vgc', label: t('championship.vgc', 'VGC'), icon: Zap },
    { id: 'go', label: t('championship.go', 'GO'), icon: Crown },
  ];

  const seasons = [
    { id: 'current', label: t('championship.current', 'Current'), icon: TrendingUp },
    { id: 'season', label: t('championship.season', 'Season'), icon: Calendar },
    { id: 'lifetime', label: t('championship.lifetime', 'Lifetime'), icon: Award },
  ];

  const getFormatData = (format: 'tcg' | 'vgc' | 'go'): ChampionshipPointsFormat => {
    return pointsBreakdown[format];
  };

  const getCurrentValue = (format: 'tcg' | 'vgc' | 'go'): number => {
    const data = getFormatData(format);
    switch (selectedSeason) {
      case 'current': return data.current;
      case 'season': return data.season;
      case 'lifetime': return data.lifetime;
      default: return data.current;
    }
  };

  const getTotalValue = (): number => {
    if (selectedFormat === 'all') {
      return formats.slice(1).reduce((total, format) => {
        return total + getCurrentValue(format.id as 'tcg' | 'vgc' | 'go');
      }, 0);
    }
    return getCurrentValue(selectedFormat as 'tcg' | 'vgc' | 'go');
  };

  const getTierInfo = (points: number): { tier: string; color: string; icon: any } => {
    if (points >= 1000) return { tier: 'Diamond', color: 'text-cyan-500', icon: Crown };
    if (points >= 750) return { tier: 'Platinum', color: 'text-purple-500', icon: Gem };
    if (points >= 500) return { tier: 'Gold', color: 'text-yellow-500', icon: Medal };
    if (points >= 250) return { tier: 'Silver', color: 'text-gray-400', icon: Star };
    if (points >= 100) return { tier: 'Bronze', color: 'text-orange-600', icon: Award };
    return { tier: 'None', color: 'text-gray-500', icon: Target };
  };

  const getFormatColor = (format: string): string => {
    switch (format) {
      case 'tcg': return 'text-purple-600';
      case 'vgc': return 'text-blue-600';
      case 'go': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getFormatBgColor = (format: string): string => {
    switch (format) {
      case 'tcg': return 'bg-purple-100';
      case 'vgc': return 'bg-blue-100';
      case 'go': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'worlds': return 'bg-red-100 text-red-800';
      case 'international': return 'bg-orange-100 text-orange-800';
      case 'regional': return 'bg-blue-100 text-blue-800';
      case 'special': return 'bg-purple-100 text-purple-800';
      case 'league_cup': return 'bg-green-100 text-green-800';
      case 'league_challenge': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlacementColor = (placement: number): string => {
    if (placement === 1) return 'text-yellow-600';
    if (placement <= 4) return 'text-purple-600';
    if (placement <= 8) return 'text-blue-600';
    if (placement <= 16) return 'text-green-600';
    return 'text-gray-600';
  };

  const getPlacementIcon = (placement: number) => {
    if (placement === 1) return <Crown className="h-4 w-4 text-yellow-600" />;
    if (placement <= 4) return <Medal className="h-4 w-4 text-purple-600" />;
    if (placement <= 8) return <Star className="h-4 w-4 text-blue-600" />;
    return <Target className="h-4 w-4 text-gray-600" />;
  };

  const filteredEvents = useMemo(() => {
    if (selectedFormat === 'all') {
      return [
        ...pointsBreakdown.tcg.events,
        ...pointsBreakdown.vgc.events,
        ...pointsBreakdown.go.events
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    const formatData = getFormatData(selectedFormat as 'tcg' | 'vgc' | 'go');
    return formatData.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedFormat, pointsBreakdown]);

  const tierInfo = getTierInfo(getTotalValue());

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {t('championship.title', '🏆 Championship Points Dashboard')}
            </h2>
            <p className="text-indigo-100">
              {t('championship.subtitle', 'Track your progress across all Pokémon formats')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <tierInfo.icon className="h-8 w-8" />
            <div className="text-right">
              <p className="text-sm text-indigo-100">{tierInfo.tier}</p>
              <p className="text-xs text-indigo-200">{t('championship.tier', 'Tier')}</p>
            </div>
          </div>
        </div>

        {/* Total Points Display */}
        <div className="text-center">
          <p className="text-4xl font-bold mb-2">{getTotalValue().toLocaleString()}</p>
          <p className="text-indigo-100">{t('championship.totalPoints', 'Total Championship Points')}</p>
        </div>
      </div>

      {/* Format Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {formats.map((format) => {
          const Icon = format.icon;
          return (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedFormat === format.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{format.label}</span>
            </button>
          );
        })}
      </div>

      {/* Season Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {seasons.map((season) => {
          const Icon = season.icon;
          return (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedSeason === season.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{season.label}</span>
            </button>
          );
        })}
      </div>

      {/* Points Breakdown */}
      {selectedFormat === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formats.slice(1).map((format) => {
            const Icon = format.icon;
            const value = getCurrentValue(format.id as 'tcg' | 'vgc' | 'go');
            const formatTier = getTierInfo(value);
            const formatData = getFormatData(format.id as 'tcg' | 'vgc' | 'go');
            
            return (
              <div key={format.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${getFormatBgColor(format.id)}`}>
                    <Icon className={`h-6 w-6 ${getFormatColor(format.id)}`} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatTier.tier}</p>
                    <formatTier.icon className="h-4 w-4 mx-auto" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mb-2">{format.label} {t('championship.points', 'Points')}</p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>{formatData.events.length} {t('championship.events', 'Events')}</span>
                    {formatData.rank && (
                      <span>#{formatData.rank} {t('championship.rank', 'Rank')}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Format View */}
      {selectedFormat !== 'all' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${getFormatBgColor(selectedFormat)}`}>
                {(() => {
                  const Icon = formats.find(f => f.id === selectedFormat)?.icon || Trophy;
                  return <Icon className={`h-6 w-6 ${getFormatColor(selectedFormat)}`} />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {formats.find(f => f.id === selectedFormat)?.label} {t('championship.points', 'Points')}
                </h3>
                <p className="text-sm text-gray-600">
                  {getCurrentValue(selectedFormat as 'tcg' | 'vgc' | 'go').toLocaleString()} {t('championship.points', 'Points')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {getCurrentValue(selectedFormat as 'tcg' | 'vgc' | 'go').toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">{t('championship.total', 'Total')}</p>
            </div>
          </div>

          {/* Format Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {getFormatData(selectedFormat as 'tcg' | 'vgc' | 'go').events.length}
              </p>
              <p className="text-sm text-gray-600">{t('championship.events', 'Events')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {getFormatData(selectedFormat as 'tcg' | 'vgc' | 'go').events.filter(e => e.placement <= 8).length}
              </p>
              <p className="text-sm text-gray-600">{t('championship.top8', 'Top 8')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {getFormatData(selectedFormat as 'tcg' | 'vgc' | 'go').rank || '-'}
              </p>
              <p className="text-sm text-gray-600">{t('championship.rank', 'Rank')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Events */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('championship.recentEvents', 'Recent Championship Events')}
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredEvents.slice(0, 10).map((event) => (
            <div
              key={event.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getPlacementIcon(event.placement)}
                    <span className={`font-semibold ${getPlacementColor(event.placement)}`}>
                      #{event.placement}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{event.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{event.location}</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.totalPlayers} {t('championship.players', 'players')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">+{event.points}</p>
                  <p className="text-sm text-gray-600">{t('championship.points', 'Points')}</p>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-auto mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
            <Trophy className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {filteredEvents.filter(e => e.placement === 1).length}
          </p>
          <p className="text-sm text-gray-600">{t('championship.wins', 'Wins')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
            <Medal className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {filteredEvents.filter(e => e.placement <= 4).length}
          </p>
          <p className="text-sm text-gray-600">{t('championship.top4', 'Top 4')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
            <Star className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {filteredEvents.filter(e => e.placement <= 8).length}
          </p>
          <p className="text-sm text-gray-600">{t('championship.top8', 'Top 8')}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <div className="p-2 bg-yellow-100 rounded-lg w-fit mx-auto mb-2">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {filteredEvents.length}
          </p>
          <p className="text-sm text-gray-600">{t('championship.events', 'Events')}</p>
        </div>
      </div>
    </div>
  );
};

export default ChampionshipPointsDashboard; 