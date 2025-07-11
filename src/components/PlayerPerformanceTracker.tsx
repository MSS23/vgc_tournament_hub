import React, { useState } from 'react';
import { Trophy, TrendingUp, Calendar, Users, Target, Award, BarChart3, Filter, Medal, Star } from 'lucide-react';
import { Player } from '../types';

interface TournamentPerformance {
  id: string;
  name: string;
  date: string;
  placement: number;
  totalPlayers: number;
  wins: number;
  losses: number;
  resistance: number;
  team: string[];
  format: string;
  rounds?: Round[]; // Added rounds property
}

interface Round {
  round: number;
  opponent: string;
  opponentTeam: { name: string }[];
  result: 'win' | 'loss' | 'draw';
  score: string;
}

interface PlayerStats {
  totalTournaments: number;
  averagePlacement: number;
  bestPlacement: number;
  totalWins: number;
  totalLosses: number;
  topCutRate: number;
  favoriteTeam: string[];
  strongestFormat: string;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  type: 'placement' | 'milestone' | 'special';
}

interface PlayerPerformanceTrackerProps {
  playerId: string;
  playerName: string;
  isFollowing: boolean;
  onFollowToggle: () => void;
  playerData?: Player;
}

const PlayerPerformanceTracker: React.FC<PlayerPerformanceTrackerProps> = ({
  playerId,
  playerName,
  isFollowing,
  onFollowToggle,
  playerData
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | '2024' | '2023' | 'recent'>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'regionals' | 'internationals' | 'worlds'>('all');

  // Mock data for demonstration
  const mockPerformances: TournamentPerformance[] = [
    {
      id: '1',
      name: 'San Diego Regional Championships 2024',
      date: '2024-02-10',
      placement: 4,
      totalPlayers: 580,
      wins: 7,
      losses: 1,
      resistance: 68.5,
      team: ['Charizard', 'Gholdengo', 'Amoonguss', 'Urshifu', 'Rillaboom', 'Incineroar'],
      format: 'VGC 2024',
      rounds: [
        {
          round: 1,
          opponent: 'Sarah Chen',
          opponentTeam: [
            { name: 'Flutter Mane' }, { name: 'Iron Hands' }, { name: 'Landorus-T' }, 
            { name: 'Heatran' }, { name: 'Amoonguss' }, { name: 'Urshifu' }
          ],
          result: 'win',
          score: '2-1'
        },
        {
          round: 2,
          opponent: 'Marcus Johnson',
          opponentTeam: [
            { name: 'Garchomp' }, { name: 'Tornadus' }, { name: 'Rillaboom' }, 
            { name: 'Chi-Yu' }, { name: 'Iron Bundle' }, { name: 'Arcanine' }
          ],
          result: 'win',
          score: '2-0'
        },
        {
          round: 3,
          opponent: 'Lars Andersen',
          opponentTeam: [
            { name: 'Calyrex-Ice' }, { name: 'Urshifu' }, { name: 'Amoonguss' }, 
            { name: 'Incineroar' }, { name: 'Tornadus' }, { name: 'Raging Bolt' }
          ],
          result: 'loss',
          score: '1-2'
        },
        {
          round: 4,
          opponent: 'Sophie Müller',
          opponentTeam: [
            { name: 'Flutter Mane' }, { name: 'Iron Bundle' }, { name: 'Landorus-T' }, 
            { name: 'Rillaboom' }, { name: 'Heatran' }, { name: 'Amoonguss' }
          ],
          result: 'win',
          score: '2-0'
        },
        {
          round: 5,
          opponent: 'Pierre Dubois',
          opponentTeam: [
            { name: 'Gholdengo' }, { name: 'Urshifu' }, { name: 'Amoonguss' }, 
            { name: 'Rillaboom' }, { name: 'Incineroar' }, { name: 'Tornadus' }
          ],
          result: 'win',
          score: '2-1'
        },
        {
          round: 6,
          opponent: 'Maria Garcia',
          opponentTeam: [
            { name: 'Iron Hands' }, { name: 'Flutter Mane' }, { name: 'Landorus-T' }, 
            { name: 'Heatran' }, { name: 'Amoonguss' }, { name: 'Urshifu' }
          ],
          result: 'win',
          score: '2-0'
        },
        {
          round: 7,
          opponent: 'Giuseppe Rossi',
          opponentTeam: [
            { name: 'Calyrex-Ice' }, { name: 'Urshifu' }, { name: 'Amoonguss' }, 
            { name: 'Incineroar' }, { name: 'Tornadus' }, { name: 'Raging Bolt' }
          ],
          result: 'win',
          score: '2-1'
        },
        {
          round: 8,
          opponent: 'Yuki Tanaka',
          opponentTeam: [
            { name: 'Garchomp' }, { name: 'Tornadus' }, { name: 'Rillaboom' }, 
            { name: 'Chi-Yu' }, { name: 'Iron Bundle' }, { name: 'Arcanine' }
          ],
          result: 'win',
          score: '2-0'
        }
      ]
    },
    {
      id: '2',
      name: 'Los Angeles Regional Championships 2024',
      date: '2024-01-20',
      placement: 8,
      totalPlayers: 520,
      wins: 6,
      losses: 2,
      resistance: 65.2,
      team: ['Miraidon', 'Flutter Mane', 'Incineroar', 'Amoonguss', 'Urshifu', 'Rillaboom'],
      format: 'VGC 2024'
    },
    {
      id: '3',
      name: 'Seattle Regional Championships 2023',
      date: '2023-12-15',
      placement: 2,
      totalPlayers: 480,
      wins: 8,
      losses: 0,
      resistance: 72.1,
      team: ['Calyrex-Ice', 'Urshifu', 'Amoonguss', 'Incineroar', 'Tornadus', 'Raging Bolt'],
      format: 'VGC 2023'
    }
  ];

  // Use player data if available, otherwise use mock data
  const performances = playerData?.tournaments?.length > 0 
    ? playerData.tournaments.map(t => ({
        id: t.id,
        name: t.name,
        date: t.date,
        placement: t.placement || 0,
        totalPlayers: t.totalPlayers,
        wins: t.wins || 0,
        losses: t.losses || 0,
        resistance: t.resistance || 0,
        team: t.team?.map(p => typeof p === 'string' ? p : p.name) || [],
        format: 'VGC 2024',
        rounds: t.rounds || []
      }))
    : mockPerformances;

  // Generate achievements based on tournament performances
  const generateAchievements = (): Achievement[] => {
    const achievements: Achievement[] = [];
    
    // Best placement achievement
    const bestPlacement = Math.min(...performances.map(p => p.placement));
    if (bestPlacement <= 3) {
      achievements.push({
        id: 'best-placement',
        title: bestPlacement === 1 ? 'Tournament Champion' : bestPlacement === 2 ? 'Runner Up' : 'Top 3 Finish',
        description: `Achieved ${bestPlacement === 1 ? '1st' : bestPlacement === 2 ? '2nd' : '3rd'} place at a major tournament`,
        date: performances.find(p => p.placement === bestPlacement)?.date || '',
        icon: '🏆',
        type: 'placement'
      });
    }

    // Top cut achievements
    const topCutCount = performances.filter(p => p.placement <= 8).length;
    if (topCutCount >= 5) {
      achievements.push({
        id: 'top-cut-master',
        title: 'Top Cut Master',
        description: `Made top cut in ${topCutCount} tournaments`,
        date: performances[0]?.date || '',
        icon: '🎯',
        type: 'milestone'
      });
    }

    // Regional achievements
    const regionalWins = performances.filter(p => p.format === 'Regional' && p.placement <= 3).length;
    if (regionalWins >= 2) {
      achievements.push({
        id: 'regional-dominator',
        title: 'Regional Dominator',
        description: `Achieved top 3 in ${regionalWins} Regional Championships`,
        date: performances[0]?.date || '',
        icon: '⭐',
        type: 'milestone'
      });
    }

    // Worlds achievement
    const worldsPerformance = performances.find(p => p.format === 'Worlds');
    if (worldsPerformance && worldsPerformance.placement <= 32) {
      achievements.push({
        id: 'worlds-contender',
        title: 'Worlds Contender',
        description: `Qualified and competed at World Championships`,
        date: worldsPerformance.date,
        icon: '🌍',
        type: 'special'
      });
    }

    // Consistency achievement
    const recentPerformances = performances.slice(0, 3);
    if (recentPerformances.length >= 3 && recentPerformances.every(p => p.placement <= 16)) {
      achievements.push({
        id: 'consistent-performer',
        title: 'Consistent Performer',
        description: 'Achieved top 16 in 3 consecutive tournaments',
        date: recentPerformances[0]?.date || '',
        icon: '📈',
        type: 'milestone'
      });
    }

    return achievements;
  };

  const stats: PlayerStats = {
    totalTournaments: performances.length,
    averagePlacement: Math.round(performances.reduce((sum, p) => sum + p.placement, 0) / performances.length),
    bestPlacement: Math.min(...performances.map(p => p.placement)),
    totalWins: performances.reduce((sum, p) => sum + p.wins, 0),
    totalLosses: performances.reduce((sum, p) => sum + p.losses, 0),
    topCutRate: Math.round((performances.filter(p => p.placement <= 8).length / performances.length) * 100),
    favoriteTeam: playerData?.mostUsedPokemon?.map(p => p.name) || ['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss', 'Incineroar'],
    strongestFormat: 'Regional Championships',
    achievements: generateAchievements()
  };

  const filteredPerformances = performances.filter(perf => {
    const yearMatch = selectedTimeframe === 'all' || 
      (selectedTimeframe === '2024' && perf.date.startsWith('2024')) ||
      (selectedTimeframe === '2023' && perf.date.startsWith('2023')) ||
      (selectedTimeframe === 'recent' && new Date(perf.date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
    
    const formatMatch = selectedFormat === 'all' ||
      (selectedFormat === 'regionals' && perf.format === 'Regional') ||
      (selectedFormat === 'internationals' && perf.format === 'International') ||
      (selectedFormat === 'worlds' && perf.format === 'Worlds');
    
    return yearMatch && formatMatch;
  });

  const getPlacementColor = (placement: number) => {
    if (placement <= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (placement <= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (placement <= 16) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getPlacementIcon = (placement: number) => {
    if (placement === 1) return '🥇';
    if (placement === 2) return '🥈';
    if (placement === 3) return '🥉';
    if (placement <= 8) return '🎯';
    if (placement <= 16) return '⭐';
    return '📊';
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Player Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
              {playerName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{playerName}</h2>
              <p className="text-blue-100">Tournament Profile</p>
            </div>
          </div>
          <button
            onClick={onFollowToggle}
            className={`px-4 py-2 rounded-full transition-colors ${
              isFollowing
                ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                : 'bg-white text-blue-600 hover:bg-gray-100'
            }`}
          >
            <Users className="h-4 w-4 inline mr-1" />
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.totalTournaments}</p>
            <p className="text-sm text-blue-100">Tournaments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{getPlacementIcon(stats.bestPlacement)}</p>
            <p className="text-sm text-blue-100">Best: #{stats.bestPlacement}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.topCutRate}%</p>
            <p className="text-sm text-blue-100">Top Cut Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.achievements.length}</p>
            <p className="text-sm text-blue-100">Achievements</p>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      {stats.achievements.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Achievements</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {stats.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  achievement.type === 'placement' ? 'bg-yellow-100 text-yellow-800' :
                  achievement.type === 'milestone' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {achievement.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Time Period</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'all' as const, label: 'All Time' },
              { id: '2024' as const, label: '2024' },
              { id: '2023' as const, label: '2023' },
              { id: 'recent' as const, label: 'Last 3 Months' },
            ].map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setSelectedTimeframe(timeframe.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedTimeframe === timeframe.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Tournament Format</h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[
              { id: 'all' as const, label: 'All Formats' },
              { id: 'regionals' as const, label: 'Regionals' },
              { id: 'internationals' as const, label: 'Internationals' },
              { id: 'worlds' as const, label: 'Worlds' },
            ].map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedFormat === format.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tournament Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Tournament History</h3>
          <span className="text-sm text-gray-500">{filteredPerformances.length} tournaments</span>
        </div>
        {filteredPerformances.map((performance) => (
          <div key={performance.id} className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{performance.name}</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(performance.date).toLocaleDateString()}
                  <Users className="h-4 w-4 ml-3 mr-1" />
                  {performance.totalPlayers} players
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">{getPlacementIcon(performance.placement)}</div>
                <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getPlacementColor(performance.placement)}`}>#{performance.placement}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="font-semibold text-gray-900">{performance.wins}W-{performance.losses}L</p>
                <p className="text-xs text-gray-600">Record</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">{performance.resistance}%</p>
                <p className="text-xs text-gray-600">Resistance</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm text-gray-600 mb-2">Team Used:</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {performance.team.map((pokemon, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 text-center">{pokemon}</span>
                ))}
              </div>
            </div>
            {/* Round-by-round breakdown */}
            {performance.rounds && performance.rounds.length > 0 && (
              <div className="mt-4">
                <h5 className="font-semibold text-gray-900 mb-2">Round-by-Round Breakdown</h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs border rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-2 py-1 text-left">Round</th>
                        <th className="px-2 py-1 text-left">Opponent</th>
                        <th className="px-2 py-1 text-left">Opponent Team</th>
                        <th className="px-2 py-1 text-left">Result</th>
                        <th className="px-2 py-1 text-left">Score</th>
                        <th className="px-2 py-1 text-left">Your Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performance.rounds.map((round, i) => (
                        <tr key={i} className={
                          round.result === 'win' ? 'bg-green-50' : round.result === 'loss' ? 'bg-red-50' : 'bg-gray-50'
                        }>
                          <td className="px-2 py-1 font-semibold">{round.round}</td>
                          <td className="px-2 py-1">{round.opponent}</td>
                          <td className="px-2 py-1">
                            {round.opponentTeam && round.opponentTeam.length > 0 ? round.opponentTeam.map((p, j) => (
                              <span key={j} className="inline-block px-1 py-0.5 bg-gray-200 rounded text-[10px] font-medium text-gray-700 mr-1">{p.name}</span>
                            )) : <span className="text-gray-400">—</span>}
                          </td>
                          <td className="px-2 py-1 font-bold">
                            {round.result === 'win' ? <span className="text-green-600">Win</span> : round.result === 'loss' ? <span className="text-red-600">Loss</span> : <span className="text-gray-600">Draw</span>}
                          </td>
                          <td className="px-2 py-1">{round.score || '—'}</td>
                          <td className="px-2 py-1">
                            {performance.team && performance.team.length > 0 ? performance.team.map((p, j) => (
                              <span key={j} className="inline-block px-1 py-0.5 bg-blue-200 rounded text-[10px] font-medium text-blue-700 mr-1">{p}</span>
                            )) : <span className="text-gray-400">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Most Used Pokemon */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Most Used Pokémon</h3>
          <span className="text-sm text-gray-500">Usage Rate</span>
        </div>
        <div className="space-y-3">
          {playerData?.mostUsedPokemon?.slice(0, 5).map((pokemon, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {pokemon.name.charAt(0)}
                </div>
                <span className="font-medium text-gray-900">{pokemon.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{pokemon.usage}%</p>
                  <p className="text-xs text-gray-500">{pokemon.winRate}% WR</p>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${pokemon.usage}%` }}
                  />
                </div>
              </div>
            </div>
          )) || stats.favoriteTeam.map((pokemon, index) => {
            const usage = Math.max(85 - index * 12, 25);
            const winRate = Math.max(75 - index * 5, 55);
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {pokemon.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{pokemon}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{usage}%</p>
                    <p className="text-xs text-gray-500">{winRate}% WR</p>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${usage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tournament Teams */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Tournament Teams</h3>
        <div className="space-y-4">
          {filteredPerformances.map((performance) => (
            <div key={performance.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{performance.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getPlacementIcon(performance.placement)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    performance.placement <= 3 ? 'bg-yellow-100 text-yellow-800' :
                    performance.placement <= 8 ? 'bg-green-100 text-green-800' :
                    performance.placement <= 16 ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    #{performance.placement}
                  </span>
                </div>
              </div>
              
              {/* Team Display */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {performance.team.map((pokemon, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 text-center"
                  >
                    {pokemon}
                  </div>
                ))}
              </div>
              
              {/* Tournament Stats */}
              <div className="grid grid-cols-2 gap-4 text-center text-xs">
                <div>
                  <p className="font-medium text-gray-900">{performance.wins}W-{performance.losses}L</p>
                  <p className="text-gray-500">Record</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{performance.resistance}%</p>
                  <p className="text-gray-500">Resistance</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredPerformances.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            No tournament results match your selected filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerPerformanceTracker;