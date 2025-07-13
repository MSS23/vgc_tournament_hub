import React, { memo, useState, useEffect } from 'react';
import { Users, Trophy, Eye, EyeOff, Lock, Calendar, MapPin, Award, Clock, CheckCircle, XCircle, Filter, ChevronRight, Table, Target, Medal, BarChart3 } from 'lucide-react';
import { TournamentPairing, Tournament } from '../types';
import PokemonModal from './PokemonModal';
import { mockPlayers, mockTournaments } from '../data/mockData';
import TournamentPhoneBanHandler from './TournamentPhoneBanHandler';
import TournamentLeaderboard from './TournamentLeaderboard';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';

interface TournamentPairingsProps {
  tournamentId: string;
  tournamentName: string;
  isRegistered: boolean;
  userDivision: 'junior' | 'senior' | 'master';
  pairings?: TournamentPairing[];
  tournament?: Tournament;
  currentPlayerId?: string;
  highlightPlayerId?: string;
  highlightRound?: number;
  highlightTable?: number;
  onViewFullRun?: (playerId: string, tournamentName: string) => void;
  onRoundChange?: (round: number) => void;
}

const TournamentPairings: React.FC<TournamentPairingsProps> = ({
  tournamentId,
  tournamentName,
  isRegistered,
  userDivision,
  pairings: propPairings,
  tournament,
  currentPlayerId,
  highlightPlayerId,
  highlightRound,
  highlightTable,
  onViewFullRun,
  onRoundChange
}) => {
  const { t } = useTranslation();
  // Use provided pairings or get from tournament data
  const pairings: TournamentPairing[] = React.useMemo(() => {
    // First try to use provided pairings
    if (propPairings && propPairings.length > 0) {
      return propPairings;
    }
    
    // If no provided pairings, try to get from tournament data
    const tournamentData = tournament || mockTournaments.find(t => t.id === tournamentId);
    if (tournamentData && tournamentData.pairings && tournamentData.pairings.length > 0) {
      return tournamentData.pairings;
    }
    
    // Fallback to empty array if no pairings available
    return [];
  }, [propPairings, tournament, tournamentId]);

  // Get unique rounds - ensure we have at least round 1
  const rounds = Array.from(new Set(pairings.map(p => p.round))).sort((a, b) => a - b);
  if (rounds.length === 0) {
    rounds.push(1);
  }

  // Find the round where the highlighted player is currently playing
  const getHighlightedPlayerRound = () => {
    if (!highlightPlayerId) return 1;
    
    const playerPairings = pairings.filter(p => 
      (p.player1.id === highlightPlayerId || p.player2.id === highlightPlayerId) && !p.result
    );
    
    if (playerPairings.length > 0) {
      return Math.max(...playerPairings.map(p => p.round));
    }
    
    const allPlayerPairings = pairings.filter(p => 
      p.player1.id === highlightPlayerId || p.player2.id === highlightPlayerId
    );
    
    if (allPlayerPairings.length > 0) {
      return Math.max(...allPlayerPairings.map(p => p.round));
    }
    
    return 1;
  };

  const [selectedRound, setSelectedRound] = useState<number>(() => {
    const initialRound = highlightRound || getHighlightedPlayerRound();
    // Ensure the selected round exists in the available rounds
    return rounds.includes(initialRound) ? initialRound : (rounds.length > 0 ? rounds[0] : 1);
  });
  const [showTeams, setShowTeams] = useState(false);
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  const [showMyPairingOnly, setShowMyPairingOnly] = useState(false);
  const [selectedPairing, setSelectedPairing] = useState<TournamentPairing | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [modalPlayerName, setModalPlayerName] = useState<string | undefined>(undefined);
  const [modalTournamentName, setModalTournamentName] = useState<string | undefined>(undefined);
  const [showFullRun, setShowFullRun] = useState<{ playerName: string; rounds: any[]; team: any[] } | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Get tournament data
  const tournamentData = tournament || mockTournaments.find(t => t.id === tournamentId) || mockTournaments[0];

  // For Phoenix Regional, simulate it's ongoing and currently in round 5
  const isPhoenixRegional = tournamentData.name.includes('Phoenix') || tournamentId === 'phoenix-regional-2024';
  const simulatedCurrentRound = isPhoenixRegional ? 5 : null;
  
  // Determine the highest completed round (for ongoing tournaments)
  const highestCompletedRound = Math.max(
    0,
    ...pairings.filter(p => p.result).map(p => p.round)
  );
  const currentRound = simulatedCurrentRound || (tournamentData.status === 'ongoing' ? (highestCompletedRound > 0 ? highestCompletedRound + 1 : 1) : rounds[rounds.length - 1]);
  
  // Check if we can show teams (completed tournament only)
  const canShowTeams = tournamentData.status === 'completed';

  const anyTournamentOngoing = mockTournaments.some(t => t.status === 'ongoing');

  // Helper functions
  const getRoundPairings = (round: number) => {
    return pairings.filter(p => p.round === round);
  };

  const getCompletedMatches = (round: number) => {
    return getRoundPairings(round).filter(p => p.result);
  };

  const getIncompleteMatches = (round: number) => {
    return getRoundPairings(round).filter(p => !p.result);
  };

  const getFilteredPairings = (round: number) => {
    let filtered = getRoundPairings(round);
    
    if (showMyPairingOnly && currentPlayerId) {
      filtered = filtered.filter(p => 
        p.player1.id === currentPlayerId || p.player2.id === currentPlayerId
      );
    }
    
    if (showIncompleteOnly) {
      filtered = filtered.filter(p => !p.result);
    }
    
    return filtered;
  };

  const isDay2Qualified = (playerRecord: string, round: number) => {
    if (round !== 8) return false;
    const [wins, losses] = playerRecord.split('-').map(Number);
    return wins >= 6;
  };

  const getPlayerResult = (pairing: TournamentPairing, playerId: string) => {
    if (!pairing.result) return null;
    return pairing.result.winner === playerId ? 'win' : 'loss';
  };

  const getResultColor = (result: 'win' | 'loss' | null) => {
    if (result === 'win') return 'text-green-600';
    if (result === 'loss') return 'text-red-600';
    return 'text-gray-500';
  };

  const getTournamentStatusColor = () => {
    switch (tournamentData.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'registration': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPlayerName = (name: string, playerId: string) => {
    if (playerId === currentPlayerId) {
      return <span className="font-bold text-blue-600">{name} (You)</span>;
    }
    return name;
  };

  const getMatchStatusIcon = (pairing: TournamentPairing) => {
    if (pairing.result) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <Clock className="h-5 w-5 text-orange-500 animate-pulse" />;
  };

  const getMatchStatusText = (pairing: TournamentPairing) => {
    if (pairing.result) {
      return 'Completed';
    }
    return 'In Progress';
  };

  const getMatchStatusColor = (pairing: TournamentPairing) => {
    if (pairing.result) {
      return 'text-green-600';
    }
    return 'text-orange-600';
  };

  const getFullRunForPlayer = (playerName: string, tournamentName?: string) => {
    const playerPairings = pairings
      .filter(p => p.player1.name === playerName || p.player2.name === playerName)
      .sort((a, b) => a.round - b.round)
      .slice(0, 8); // Only first 8 rounds

    if (playerPairings.length === 0) return null;

    const rounds = playerPairings.map(p => {
      const isPlayer1 = p.player1.name === playerName;
      return {
        round: p.round,
        opponent: isPlayer1 ? p.player2.name : p.player1.name,
        opponentTeam: isPlayer1 ? p.player2.team : p.player1.team,
        playerTeam: isPlayer1 ? p.player1.team : p.player2.team,
        result: isPlayer1
          ? (p.result?.winner === p.player1.id ? 'win' : p.result?.winner === p.player2.id ? 'loss' : null)
          : (p.result?.winner === p.player2.id ? 'win' : p.result?.winner === p.player1.id ? 'loss' : null),
        score: p.result?.score,
        table: p.table
      };
    });

    const team = rounds[0]?.playerTeam || [];
    return { rounds, team };
  };

  // Memoized pairings for the selected round
  const memoizedPairings = React.useMemo(() => {
    return getFilteredPairings(selectedRound);
  }, [selectedRound, showMyPairingOnly, showIncompleteOnly]);

  // Update selectedRound when rounds change
  React.useEffect(() => {
    if (rounds.length > 0 && !rounds.includes(selectedRound)) {
      setSelectedRound(rounds[0]);
    }
  }, [rounds, selectedRound]);

  // Scroll to highlighted table if highlightTable is set
  React.useEffect(() => {
    if (highlightRound && selectedRound !== highlightRound) {
      setSelectedRound(highlightRound);
    }
    if (highlightTable) {
      setTimeout(() => {
        const el = document.getElementById(`pairing-table-${highlightTable}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
          }, 2000);
        }
      }, 300);
    }
  }, [highlightRound, highlightTable, selectedRound]);



  // Render fallback UI if no pairings for the round
  if (!memoizedPairings || memoizedPairings.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700">No pairings available for this round.</h3>
          <p className="text-sm text-gray-500 mt-2">
            Selected Round: {selectedRound} | Total Pairings: {pairings.length} | Available Rounds: {rounds.join(', ')}
          </p>
        </div>
        {pairings.length > 0 && (
          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Available pairings by round:</h4>
            {rounds.map(round => (
              <div key={round} className="text-sm text-gray-600">
                Round {round}: {pairings.filter(p => p.round === round).length} matches
              </div>
            ))}
          </div>
        )}
        {pairings.length === 0 && (
          <div className="text-left bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">No pairings data available</h4>
            <p className="text-sm text-gray-600">
              This tournament doesn't have any pairings data yet. This could be because:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
              <li>The tournament hasn't started yet</li>
              <li>Pairings haven't been generated</li>
              <li>There was an issue loading the data</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Pairing Row Component
  const PairingRow = memo(({ index, data }: { index: number; data: TournamentPairing[] }) => {
    const pairing = data[index];
    const isHighlighted = highlightTable && pairing.table === highlightTable;
    // Determine win/loss for each player
    const player1Result = getPlayerResult(pairing, pairing.player1.id);
    const player2Result = getPlayerResult(pairing, pairing.player2.id);
    return (
      <div
        id={pairing.table ? `pairing-table-${pairing.table}` : undefined}
        className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-4 ${
          (pairing.player1.id === currentPlayerId || pairing.player2.id === currentPlayerId) 
            ? 'ring-2 ring-blue-500 ring-opacity-50' 
            : ''
        } ${isHighlighted ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        onClick={() => {
          if (tournamentData.status === 'completed') {
            const run = getFullRunForPlayer(pairing.player1.name, tournamentData.name);
            if (run) setShowFullRun({ playerName: pairing.player1.name, ...run });
          } else if (tournamentData.status === 'completed' && pairing.player1.team && pairing.player2.team) {
            setSelectedPairing(pairing);
          }
        }}
      >
        <div className="flex items-center justify-between">
          {/* Player 1 */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {pairing.player1.name.charAt(0)}
                </div>
                <div>
                  <div className={`font-semibold text-gray-900 text-sm ${player1Result === 'win' ? 'text-green-600' : player1Result === 'loss' ? 'text-red-600' : ''}`}> {/* Highlight win/loss */}
                    {formatPlayerName(pairing.player1.name, pairing.player1.id)}
                  </div>
                  <div className="text-xs text-gray-500">Record: {pairing.player1.record}</div>
                </div>
              </div>
              {tournamentData.status === 'completed' && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors">
                  Table {pairing.table}
                </span>
              )}
            </div>
            
            {/* Team Preview */}
            {tournamentData.status === 'completed' && pairing.player1.team && (
              <div className="mt-1 flex flex-wrap gap-1">
                {pairing.player1.team.map((pokemon: any, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 border">{pokemon.name || pokemon}</span>
                ))}
              </div>
            )}
            {(tournamentData.status === 'ongoing' || isPhoenixRegional) && (
              <div className="mt-1 text-xs text-gray-500 italic">
                Teams hidden during live tournament
              </div>
            )}
          </div>

          {/* Match Center */}
          <div className="flex flex-col items-center justify-center px-4">
            <div className="flex items-center space-x-2 mb-2">
              <Table className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">{pairing.table}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-1">
              {getMatchStatusIcon(pairing)}
              <span className={`text-xs font-medium ${getMatchStatusColor(pairing)}`}>
                {getMatchStatusText(pairing)}
              </span>
            </div>
            
            {pairing.result && (
              <div className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-full">
                {pairing.result.score}
              </div>
            )}
          </div>

          {/* Player 2 */}
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end mb-2">
              <div className="flex flex-col items-end">
                <div className={`font-semibold text-gray-900 text-sm ${player2Result === 'win' ? 'text-green-600' : player2Result === 'loss' ? 'text-red-600' : ''}`}> {/* Highlight win/loss */}
                  {formatPlayerName(pairing.player2.name, pairing.player2.id)}
                </div>
                <div className="text-xs text-gray-500">Record: {pairing.player2.record}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm ml-3">
                {pairing.player2.name.charAt(0)}
              </div>
            </div>
            {/* Team Preview */}
            {tournamentData.status === 'completed' && pairing.player2.team && (
              <div className="mt-1 flex flex-wrap gap-1">
                {pairing.player2.team.map((pokemon: any, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 border">{pokemon.name || pokemon}</span>
                ))}
              </div>
            )}
            {(tournamentData.status === 'ongoing' || isPhoenixRegional) && (
              <div className="mt-1 text-xs text-gray-500 italic">
                Teams hidden during live tournament
              </div>
            )}
          </div>
        </div>
        {/* Result/Score */}
        <div className="flex items-center justify-center mt-2">
          {pairing.result ? (
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
              {pairing.result.score}
            </span>
          ) : (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              vs
            </span>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <Trophy className="h-8 w-8 text-yellow-300" />
              <h2 className="text-2xl font-bold">{tournamentData.name}</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getTournamentStatusColor()}`}>
                {tournamentData.status === 'completed' && <span>🏆</span>}
                {(tournamentData.status === 'ongoing' || isPhoenixRegional) && <span>⚡</span>}
                {tournamentData.status === 'registration' && <span>📝</span>}
                {tournamentData.status === 'upcoming' && <span>📅</span>}
                <span>{(tournamentData.status === 'ongoing' || isPhoenixRegional) ? 'Live Now' : tournamentData.status.charAt(0).toUpperCase() + tournamentData.status.slice(1)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-200" />
                <span>{new Date(tournamentData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-200" />
                <span>{tournamentData.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-200" />
                <span>{tournamentData.totalPlayers} players</span>
              </div>
              {(tournamentData.status === 'ongoing' || isPhoenixRegional) && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-300 animate-pulse" />
                  <span className="font-medium text-green-300">Live Now - Round {currentRound}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            {tournamentData.status === 'completed' && (
              <button
                onClick={() => setShowLeaderboard(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg"
              >
                <BarChart3 className="h-4 w-4" />
                <span>League Table</span>
              </button>
            )}
            
            {tournamentData.status === 'completed' && (
              <button
                onClick={() => setShowTeams(!showTeams)}
                className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200"
              >
                <Eye className="h-4 w-4" />
                <span>{showTeams ? 'Hide' : 'Show'} Teams</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pairings Coming Soon for Upcoming and Registration Open Tournaments */}
      {(tournamentData.status === 'upcoming' || tournamentData.status === 'registration') && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center space-x-3 text-blue-800 font-semibold mb-2">
            <Clock className="h-6 w-6" />
            <span className="text-lg">Pairings Coming Soon</span>
          </div>
          <p className="text-blue-600 text-sm">
            Tournament pairings will be available once the event begins. Check back on {new Date(tournamentData.date).toLocaleDateString()} for live updates.
          </p>
        </div>
      )}

      {/* Phone Ban Handler */}
      {(tournamentData.status === 'ongoing' || isPhoenixRegional) && (
        <TournamentPhoneBanHandler
          tournamentId={tournamentId}
          operation="pairing_check"
          onMethodSelected={(method) => {
            console.log('Selected pairing check method:', method);
          }}
        />
      )}

      {/* Tournament Status Messages */}
      {tournamentData.status === 'completed' && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-purple-800 font-semibold">
            <Lock className="h-5 w-5" />
            <span>Tournament completed. Teams and results are now visible.</span>
          </div>
        </div>
      )}
      
      {(tournamentData.status === 'ongoing' || isPhoenixRegional) && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-orange-800 font-semibold">
            <Eye className="h-5 w-5" />
            <span>Live tournament in progress. Teams are hidden until completion.</span>
          </div>
        </div>
      )}

      {/* Round Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Round Selection</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Target className="h-4 w-4" />
            <span>{getCompletedMatches(selectedRound).length} completed</span>
            <span>•</span>
            <span>{getIncompleteMatches(selectedRound).length} in progress</span>
          </div>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {rounds.map((round) => {
            // Disable future rounds if tournament is ongoing and not all rounds are completed
            const isFutureRound = (tournamentData.status === 'ongoing' || isPhoenixRegional) && round > currentRound;
            const isCurrentRound = round === currentRound;
            return (
              <button
                key={round}
                onClick={() => { setSelectedRound(round); onRoundChange?.(round); }}
                disabled={isFutureRound}
                className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all min-w-fit text-sm font-medium ${
                  selectedRound === round
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : isFutureRound
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                      : isCurrentRound
                        ? 'bg-orange-100 text-orange-700 border border-orange-300 hover:bg-orange-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
                title={isFutureRound ? 'This round is not available yet' : isCurrentRound ? 'Current round in progress' : ''}
              >
                Round {round}
                {isCurrentRound && <span className="ml-1 text-xs">●</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {currentPlayerId && (tournamentData.status === 'ongoing' || isPhoenixRegional) && (
          <button
            onClick={() => setShowMyPairingOnly(!showMyPairingOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
              showMyPairingOnly
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{showMyPairingOnly ? 'Show All' : 'My Pairing'}</span>
          </button>
        )}
        
        {(tournamentData.status === 'ongoing' || isPhoenixRegional) && (
          <button
            onClick={() => setShowIncompleteOnly(!showIncompleteOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
              showIncompleteOnly
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{showIncompleteOnly ? 'Show All' : 'Incomplete Only'}</span>
          </button>
        )}
      </div>

      {/* Pairings List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Round {selectedRound} Pairings
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {memoizedPairings.length} matches found
            {tournamentData.status === 'completed' && ' • Teams visible'}
            {(tournamentData.status === 'ongoing' || isPhoenixRegional) && ' • Teams hidden during live tournament'}
          </p>
        </div>
        
        <div className="p-4 space-y-3">
          {memoizedPairings.map((pairing, index) => (
            <PairingRow
              key={`${pairing.round}-${pairing.table}-${pairing.player1.id}-${pairing.player2.id}`}
              index={index}
              data={memoizedPairings}
            />
          ))}
        </div>
      </div>

      {/* Team Modal */}
      {tournamentData.status === 'completed' && selectedPairing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Full Teams - Table {selectedPairing.table}</h3>
              <button onClick={() => setSelectedPairing(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player 1 Team */}
              <div>
                <div className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {selectedPairing.player1.name.charAt(0)}
                  </div>
                  <span>{selectedPairing.player1.name}'s Team</span>
                </div>
                {selectedPairing.player1.team ? (
                  <div className="space-y-3">
                    {selectedPairing.player1.team.map((poke: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {poke.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{poke.name}</div>
                          <div className="text-sm text-gray-600">
                            Tera: {poke.teraType || '—'} • Item: {poke.item || '—'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No team data</div>
                )}
              </div>
              {/* Player 2 Team */}
              <div>
                <div className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                    {selectedPairing.player2.name.charAt(0)}
                  </div>
                  <span>{selectedPairing.player2.name}'s Team</span>
                </div>
                {selectedPairing.player2.team ? (
                  <div className="space-y-3">
                    {selectedPairing.player2.team.map((poke: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                          {poke.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{poke.name}</div>
                          <div className="text-sm text-gray-600">
                            Tera: {poke.teraType || '—'} • Item: {poke.item || '—'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">No team data</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Run Modal */}
      {showFullRun && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{showFullRun.playerName}'s Full Tournament Run</h3>
                <div className="text-sm text-gray-500 font-medium">{showFullRun.tournamentName}</div>
              </div>
              <button onClick={() => setShowFullRun(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Team Display */}
              <div className="mb-6">
                <div className="font-semibold text-gray-900 mb-3 text-lg">Team</div>
                <div className="flex flex-wrap gap-2">
                  {showFullRun.team.map((poke: any, i: number) => (
                    <span
                      key={i}
                      className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer"
                      title={`${poke.name}${poke.item ? ' @ ' + poke.item : ''}${poke.ability ? '\nAbility: ' + poke.ability : ''}${poke.teraType ? '\nTera: ' + poke.teraType : ''}`}
                    >
                      {poke.name.charAt(0)}
                      <span className="ml-2 text-xs font-normal">{poke.name}</span>
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Rounds Table */}
              <div>
                <div className="font-semibold text-gray-900 mb-3 text-lg">Round-by-Round Results</div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 font-semibold text-left text-sm">Round</th>
                        <th className="px-4 py-3 font-semibold text-left text-sm">Opponent</th>
                        <th className="px-4 py-3 font-semibold text-left text-sm">Player Team</th>
                        <th className="px-4 py-3 font-semibold text-left text-sm">Opponent Team</th>
                        <th className="px-4 py-3 font-semibold text-left text-sm">Result</th>
                        <th className="px-4 py-3 font-semibold text-left text-sm">Score</th>
                        <th className="px-4 py-3 font-semibold text-left text-sm">Table</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showFullRun.rounds.map((round, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-sm">{round.round}</td>
                          <td className="px-4 py-3 text-sm">{round.opponent}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {round.playerTeam && round.playerTeam.map((poke: any, j: number) => (
                                <span key={j} className="inline-block px-2 py-1 rounded bg-blue-200 text-blue-800 text-xs font-medium" title={poke.name}>
                                  {poke.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {round.opponentTeam && round.opponentTeam.map((poke: any, j: number) => (
                                <span key={j} className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium" title={poke.name}>
                                  {poke.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {round.result ? (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                round.result === 'win'
                                  ? 'bg-green-100 text-green-800'
                                  : round.result === 'loss'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {round.result.charAt(0).toUpperCase() + round.result.slice(1)}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{round.score || <span className="text-gray-400">—</span>}</td>
                          <td className="px-4 py-3 text-sm">{round.table || <span className="text-gray-400">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pokemon Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={!!selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        tournamentName={modalTournamentName}
        playerName={modalPlayerName}
      />

      {/* Tournament Leaderboard Modal */}
      <TournamentLeaderboard
        tournament={tournamentData}
        pairings={pairings}
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  );
};

export default TournamentPairings;