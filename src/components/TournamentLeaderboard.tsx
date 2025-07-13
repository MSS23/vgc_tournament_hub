import React, { useState, useMemo, useCallback } from 'react';
import { Trophy, Medal, Award, Users, TrendingUp, Filter, Download, Share2, Eye } from 'lucide-react';
import { Tournament, TournamentPairing, PlayerStanding } from '../types';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';

interface TournamentLeaderboardProps {
  tournament: Tournament;
  pairings: TournamentPairing[];
  isOpen: boolean;
  onClose: () => void;
  onPlayerSelect?: (playerId: string) => void;
}

interface CalculatedStanding extends PlayerStanding {
  opponentWinPercentage: number;
  opponentOpponentWinPercentage: number;
  resistance: number;
  gameWinPercentage: number;
  totalGames: number;
  gameWins: number;
  gameLosses: number;
}

const TournamentLeaderboard: React.FC<TournamentLeaderboardProps> = ({
  tournament,
  pairings,
  isOpen,
  onClose,
  onPlayerSelect = (playerId) => { /* mock handler */ },
}) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<'rank' | 'wins' | 'resistance' | 'opponentWinPercentage' | 'opponentOpponentWinPercentage'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDetails, setShowDetails] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Memoized sort options to prevent recreation
  const sortOptions = useMemo(() => [
    { value: 'rank' as const, label: 'Rank' },
    { value: 'wins' as const, label: 'Wins' },
    { value: 'resistance' as const, label: 'Resistance' },
    { value: 'opponentWinPercentage' as const, label: 'Opponent Win %' },
    { value: 'opponentOpponentWinPercentage' as const, label: 'Opponent\'s Opponent Win %' },
  ], []);

  // Calculate final standings with resistance and OOR - optimized algorithm
  const calculatedStandings = useMemo(() => {
    if (!pairings || pairings.length === 0) return [];

    // Create a map for O(1) lookups
    const playerMap = new Map<string, {
      id: string;
      name: string;
      wins: number;
      losses: number;
      draws: number;
      games: number[];
      opponents: Set<string>;
    }>();

    // Initialize player records
    pairings.forEach(pairing => {
      if (!playerMap.has(pairing.player1.id)) {
        playerMap.set(pairing.player1.id, {
          id: pairing.player1.id,
          name: pairing.player1.name,
          wins: 0,
          losses: 0,
          draws: 0,
          games: [],
          opponents: new Set()
        });
      }
      if (!playerMap.has(pairing.player2.id)) {
        playerMap.set(pairing.player2.id, {
          id: pairing.player2.id,
          name: pairing.player2.name,
          wins: 0,
          losses: 0,
          draws: 0,
          games: [],
          opponents: new Set()
        });
      }
    });

    // Process all pairings to build records
    pairings.forEach(pairing => {
      if (pairing.result) {
        const { winner, score } = pairing.result;
        const [player1Games, player2Games] = score.split('-').map(Number);
        
        const player1 = playerMap.get(pairing.player1.id)!;
        const player2 = playerMap.get(pairing.player2.id)!;
        
        // Update records
        if (winner === pairing.player1.id) {
          player1.wins++;
          player2.losses++;
        } else if (winner === pairing.player2.id) {
          player2.wins++;
          player1.losses++;
        } else {
          player1.draws++;
          player2.draws++;
        }

        // Store game results
        player1.games.push(player1Games);
        player2.games.push(player2Games);

        // Track opponents
        player1.opponents.add(pairing.player2.id);
        player2.opponents.add(pairing.player1.id);
      }
    });

    // Calculate resistance and OOR for each player
    const standings: CalculatedStanding[] = [];
    
    playerMap.forEach((player, playerId) => {
      // Calculate opponent win percentages
      let totalOpponentWins = 0;
      let totalOpponentGames = 0;
      let totalOpponentOpponentWins = 0;
      let totalOpponentOpponentGames = 0;

      player.opponents.forEach(opponentId => {
        const opponent = playerMap.get(opponentId)!;
        totalOpponentWins += opponent.wins;
        totalOpponentGames += opponent.wins + opponent.losses + opponent.draws;
        
        // Calculate opponent's opponents (excluding current player)
        opponent.opponents.forEach(opponentOpponentId => {
          if (opponentOpponentId !== playerId) {
            const opponentOpponent = playerMap.get(opponentOpponentId)!;
            totalOpponentOpponentWins += opponentOpponent.wins;
            totalOpponentOpponentGames += opponentOpponent.wins + opponentOpponent.losses + opponentOpponent.draws;
          }
        });
      });

      // Calculate percentages
      const opponentWinPercentage = totalOpponentGames > 0 ? (totalOpponentWins / totalOpponentGames) * 100 : 0;
      const opponentOpponentWinPercentage = totalOpponentOpponentGames > 0 ? (totalOpponentOpponentWins / totalOpponentOpponentGames) * 100 : 0;
      
      // Calculate game win percentage
      const totalGames = player.games.reduce((sum, games) => sum + games, 0);
      const gameWins = player.games.reduce((sum, games) => sum + games, 0);
      const gameWinPercentage = totalGames > 0 ? (gameWins / totalGames) * 100 : 0;

      // Calculate resistance (average of opponent win percentage and opponent's opponent win percentage)
      const resistance = (opponentWinPercentage + opponentOpponentWinPercentage) / 2;

      standings.push({
        playerId,
        playerName: player.name,
        record: `${player.wins}-${player.losses}-${player.draws}`,
        wins: player.wins,
        losses: player.losses,
        draws: player.draws,
        resistance,
        opponentWinPercentage,
        opponentOpponentWinPercentage,
        gameWinPercentage,
        totalGames,
        gameWins,
        gameLosses: totalGames - gameWins,
        rank: 0, // Will be calculated after sorting
        points: player.wins * 3 + player.draws,
        isActive: true,
        dropped: false
      });
    });

    // Sort standings
    standings.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'wins':
          comparison = b.wins - a.wins;
          break;
        case 'resistance':
          comparison = b.resistance - a.resistance;
          break;
        case 'opponentWinPercentage':
          comparison = b.opponentWinPercentage - a.opponentWinPercentage;
          break;
        case 'opponentOpponentWinPercentage':
          comparison = b.opponentOpponentWinPercentage - a.opponentOpponentWinPercentage;
          break;
        default: // rank
          comparison = b.wins - a.wins;
          if (comparison === 0) {
            comparison = b.resistance - a.resistance;
          }
          if (comparison === 0) {
            comparison = b.opponentWinPercentage - a.opponentWinPercentage;
          }
          if (comparison === 0) {
            comparison = b.gameWinPercentage - a.gameWinPercentage;
          }
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    // Assign ranks
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    return standings;
  }, [pairings, sortBy, sortOrder]);

  // Memoized tournament info
  const tournamentInfo = useMemo(() => ({
    totalPlayers: tournament.totalPlayers,
    roundsPlayed: Math.max(...pairings.map(p => p.round)),
    matchesCompleted: pairings.filter(p => p.result).length,
    tournamentDate: new Date(tournament.date).toLocaleDateString()
  }), [tournament, pairings]);

  // Callback functions
  const handleSort = useCallback((field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

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
      case 6: return 'text-blue-600 font-semibold';
      case 7: return 'text-blue-600 font-semibold';
      case 8: return 'text-blue-600 font-semibold';
      default: return 'text-gray-700';
    }
  }, []);

  const exportStandings = useCallback(() => {
    const csvContent = [
      ['Rank', 'Player', 'Record', 'Wins', 'Losses', 'Draws', 'Resistance', 'Opponent Win %', 'Opponent\'s Opponent Win %', 'Game Win %'],
      ...calculatedStandings.map(standing => [
        standing.rank,
        standing.playerName,
        standing.record,
        standing.wins,
        standing.losses,
        standing.draws,
        standing.resistance.toFixed(2),
        standing.opponentWinPercentage.toFixed(2),
        standing.opponentOpponentWinPercentage.toFixed(2),
        standing.gameWinPercentage.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tournament.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_standings.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [calculatedStandings, tournament.name]);

  // Memoized displayed standings
  const displayedStandings = useMemo(() => {
    return showAll ? calculatedStandings : calculatedStandings.slice(0, 5);
  }, [calculatedStandings, showAll]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center space-x-3">
          <Trophy className="h-7 w-7 text-yellow-500" />
          <span className="text-2xl font-bold text-gray-900">{tournament.name} - Final Standings</span>
        </div>
      }
      className="max-h-[90vh] overflow-hidden"
    >
      <div className="space-y-6 px-1 sm:px-2 md:px-4 pb-2">
        {/* Tournament Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 shadow-sm flex flex-wrap gap-4 justify-between items-center">
          <div className="flex-1 min-w-[120px] text-center">
            <p className="text-xs text-gray-500">Total Players</p>
            <p className="text-lg font-bold text-gray-900">{tournamentInfo.totalPlayers}</p>
          </div>
          <div className="flex-1 min-w-[120px] text-center">
            <p className="text-xs text-gray-500">Rounds Played</p>
            <p className="text-lg font-bold text-gray-900">{tournamentInfo.roundsPlayed}</p>
          </div>
          <div className="flex-1 min-w-[120px] text-center">
            <p className="text-xs text-gray-500">Matches Completed</p>
            <p className="text-lg font-bold text-gray-900">{tournamentInfo.matchesCompleted}</p>
          </div>
          <div className="flex-1 min-w-[120px] text-center">
            <p className="text-xs text-gray-500">Tournament Date</p>
            <p className="text-lg font-bold text-gray-900">{tournamentInfo.tournamentDate}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 border border-gray-100 shadow-sm sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as typeof sortBy)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-200"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-1 rounded hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle sort order"
            >
              <TrendingUp className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportStandings}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 shadow-sm"
            >
              <Eye className="h-4 w-4" />
              <span>{showDetails ? 'Hide' : 'Show'} Details</span>
            </button>
          </div>
        </div>

        {/* Standings Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-lg bg-white mt-2">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-white border-b sticky top-[180px] z-40 shadow-md">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap sticky left-0 bg-white z-40 border-r border-gray-100">Position</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">Player</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700 whitespace-nowrap">Record</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700 whitespace-nowrap">Resistance</th>
              </tr>
            </thead>
            <tbody>
              {displayedStandings.map((standing, idx) => (
                <tr
                  key={standing.playerId}
                  className={`transition-colors cursor-pointer hover:bg-blue-50 focus:bg-blue-100 outline-none ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  onClick={() => onPlayerSelect(standing.playerId)}
                  tabIndex={0}
                  aria-label={`View profile for ${standing.playerName}`}
                >
                  <td className="px-4 py-3 sticky left-0 bg-inherit z-20 border-r border-gray-100 align-middle">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(standing.rank)}
                      <span className={getRankColor(standing.rank)}>#{standing.rank}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap align-middle">{standing.playerName}</td>
                  <td className="px-4 py-3 text-center font-semibold whitespace-nowrap align-middle">{standing.record}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600 whitespace-nowrap align-middle">{standing.resistance.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {calculatedStandings.length > 5 && (
            <div className="flex justify-center py-4 border-t border-gray-100 bg-gradient-to-r from-white to-blue-50 rounded-b-2xl">
              <button
                className="text-blue-600 hover:underline text-sm font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => setShowAll(!showAll)}
                aria-label={showAll ? 'Show Top 5 Only' : `Show All (${calculatedStandings.length})`}
              >
                {showAll ? 'Show Top 5 Only' : `Show All (${calculatedStandings.length})`}
              </button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100 mt-2 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2 text-base">How Resistance is Calculated</h4>
          <ul className="text-xs text-gray-600 space-y-1 list-disc pl-5">
            <li><strong>Resistance:</strong> Average of your opponents' win percentage and your opponents' opponents' win percentage</li>
            <li><strong>Opponent Win %:</strong> The combined win percentage of all players you faced</li>
            <li><strong>Opponent's Opponent Win %:</strong> The combined win percentage of all players your opponents faced (excluding you)</li>
            <li><strong>Game Win %:</strong> Percentage of individual games won across all matches</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(TournamentLeaderboard); 