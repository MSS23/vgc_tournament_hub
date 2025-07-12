import React, { useState } from 'react';
import { Users, Trophy, Eye, EyeOff, Lock, Calendar, MapPin, Award, Clock, CheckCircle, XCircle, Filter } from 'lucide-react';
import { TournamentPairing, Tournament } from '../types';
import PokemonModal from './PokemonModal';
import { mockPlayers, mockTournaments } from '../data/mockData';
import TournamentPhoneBanHandler from './TournamentPhoneBanHandler';

interface TournamentPairingsProps {
  tournamentId: string;
  tournamentName: string;
  isRegistered: boolean;
  userDivision: 'junior' | 'senior' | 'master';
  pairings?: TournamentPairing[];
  tournament?: Tournament;
  currentPlayerId?: string; // NEW
  onViewFullRun?: (playerId: string, tournamentName: string) => void;
}

const TournamentPairings: React.FC<TournamentPairingsProps> = ({
  tournamentId,
  tournamentName,
  isRegistered,
  userDivision,
  pairings: propPairings,
  tournament,
  currentPlayerId, // NEW
  onViewFullRun // NEW
}) => {
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [showTeams, setShowTeams] = useState(false);
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  const [showMyPairingOnly, setShowMyPairingOnly] = useState(false);
  const [selectedPairing, setSelectedPairing] = useState<TournamentPairing | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [modalPlayerName, setModalPlayerName] = useState<string | undefined>(undefined);
  const [modalTournamentName, setModalTournamentName] = useState<string | undefined>(undefined);
  const [showFullRun, setShowFullRun] = useState<{ playerName: string; rounds: any[]; team: any[] } | null>(null);

  // Mock pairings data if not provided
  const pairings: TournamentPairing[] = propPairings || [
    // Manraj Sidhu's pairings
    {
      round: 1,
      table: 15,
      player1: { id: 'manraj-sidhu', name: 'Manraj Sidhu', record: '0-0' },
      player2: { id: 'p1', name: 'Alex Rodriguez', record: '0-0' },
      result: { winner: 'manraj-sidhu', score: '2-1' }
    },
    {
      round: 2,
      table: 8,
      player1: { id: 'manraj-sidhu', name: 'Manraj Sidhu', record: '1-0' },
      player2: { id: 'p3', name: 'Marcus Johnson', record: '1-0' },
      result: { winner: 'manraj-sidhu', score: '2-0' }
    },
    {
      round: 3,
      table: 12,
      player1: { id: 'manraj-sidhu', name: 'Manraj Sidhu', record: '2-0' },
      player2: { id: 'p2', name: 'Sarah Chen', record: '2-0' }
      // No result - current live match
    },
    {
      round: 1,
      table: 1,
      player1: { id: '1', name: 'Alex Rodriguez', record: '0-0' },
      player2: { id: '2', name: 'Sarah Kim', record: '0-0' },
      result: { winner: '1', score: '2-0' }
    },
    {
      round: 1,
      table: 2,
      player1: { id: '3', name: 'Marcus Johnson', record: '0-0' },
      player2: { id: '4', name: 'Emily Chen', record: '0-0' },
      result: { winner: '4', score: '2-1' }
    },
    {
      round: 1,
      table: 3,
      player1: { id: '5', name: 'David Lee', record: '0-0' },
      player2: { id: '6', name: 'Jessica Wang', record: '0-0' },
      result: { winner: '5', score: '2-0' }
    },
    {
      round: 1,
      table: 4,
      player1: { id: '7', name: 'Michael Brown', record: '0-0' },
      player2: { id: '8', name: 'Lisa Garcia', record: '0-0' }
      // No result - incomplete match
    },
    {
      round: 1,
      table: 5,
      player1: { id: '9', name: 'Robert Wilson', record: '0-0' },
      player2: { id: '10', name: 'Amanda Taylor', record: '0-0' }
      // No result - incomplete match
    },
    {
      round: 1,
      table: 6,
      player1: { id: '11', name: 'Chris Davis', record: '0-0' },
      player2: { id: '12', name: 'Rachel Green', record: '0-0' },
      result: { winner: '11', score: '2-1' }
    },
    {
      round: 2,
      table: 1,
      player1: { id: '1', name: 'Alex Rodriguez', record: '1-0' },
      player2: { id: '4', name: 'Emily Chen', record: '1-0' },
      result: { winner: '1', score: '2-1' }
    },
    {
      round: 2,
      table: 2,
      player1: { id: '5', name: 'David Lee', record: '1-0' },
      player2: { id: '7', name: 'Michael Brown', record: '1-0' },
      result: { winner: '5', score: '2-0' }
    },
    {
      round: 2,
      table: 3,
      player1: { id: '11', name: 'Chris Davis', record: '1-0' },
      player2: { id: '13', name: 'Jennifer Lopez', record: '1-0' }
      // No result - incomplete match
    },
    {
      round: 3,
      table: 1,
      player1: { id: '1', name: 'Alex Rodriguez', record: '2-0' },
      player2: { id: '5', name: 'David Lee', record: '2-0' }
      // No result - incomplete match (current live round)
    },
    {
      round: 3,
      table: 2,
      player1: { id: '14', name: 'Tom Anderson', record: '2-0' },
      player2: { id: '15', name: 'Maria Garcia', record: '2-0' }
      // No result - incomplete match (current live round)
    }
  ];

  // Mock tournament data if not provided
  const tournamentData: Tournament = tournament || {
    id: tournamentId,
    name: tournamentName,
    date: '2024-03-15',
    location: 'Phoenix Convention Center, AZ',
    totalPlayers: 700,
    status: 'ongoing',
    maxCapacity: 700,
    currentRegistrations: 700,
    waitlistEnabled: true,
    waitlistCapacity: 200,
    currentWaitlist: 0,
    registrationType: 'first-come-first-served'
  };

  const rounds = Array.from(new Set(pairings.map(p => p.round))).sort((a, b) => a - b);
  const currentRound = Math.max(...rounds);
  const isTournamentFinished = tournamentData.status === 'completed';
  const isTournamentOngoing = tournamentData.status === 'ongoing';
  const canViewTeams = false; // Teams are hidden by default for everyone

  // Determine if teams should be shown
  const canShowTeams = tournamentData.status === 'completed';

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
    let roundPairings = getRoundPairings(round);
    if (showIncompleteOnly && round === currentRound && isTournamentOngoing) {
      roundPairings = getIncompleteMatches(round);
    }
    if (showMyPairingOnly && currentPlayerId) {
      roundPairings = roundPairings.filter(
        p => p.player1.id === currentPlayerId || p.player2.id === currentPlayerId
      );
    }
    return roundPairings;
  };

  // Helper to check if a player qualifies for Day 2 (6-2 or better after round 8)
  const isDay2Qualified = (playerRecord: string, round: number) => {
    if (round !== 8) return false;
    const [wins, losses] = playerRecord.split('-').map(Number);
    // Must have 6+ wins and exactly 8 total games played
    return wins >= 6 && wins + losses === 8;
  };

  const getPlayerResult = (pairing: TournamentPairing, playerId: string) => {
    if (!pairing.result) return null;
    return pairing.result.winner === playerId ? 'win' : 'loss';
  };

  const getResultColor = (result: 'win' | 'loss' | null) => {
    switch (result) {
      case 'win': return 'text-green-600 bg-green-50 border-green-200';
      case 'loss': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTournamentStatusColor = () => {
    switch (tournamentData.status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'registration': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPlayerName = (name: string, playerId: string) => {
    // In a real app, this would check if the player is the current user
    const isCurrentUser = playerId === 'current-user-id';
    return isCurrentUser ? `${name} (You)` : name;
  };

  const getMatchStatusIcon = (pairing: TournamentPairing) => {
    if (pairing.result) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
  };

  const getMatchStatusText = (pairing: TournamentPairing) => {
    if (pairing.result) {
      return 'Completed';
    }
    return 'In Progress';
  };

  const getMatchStatusColor = (pairing: TournamentPairing) => {
    if (pairing.result) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  // Helper to get full run for a player by name (demo: Alex Rodriguez)
  const getFullRunForPlayer = (playerName: string, tournamentName?: string) => {
    // Find player in mockPlayers
    const player = mockPlayers.find(p => p.name === playerName);
    if (player && player.tournaments && player.tournaments.length > 0) {
      let tournament = player.tournaments[0];
      if (tournamentName) {
        const found = player.tournaments.find(t => t.name === tournamentName);
        if (found) tournament = found;
      }
      if (tournament && tournament.rounds) {
        return {
          tournamentName: tournament.name,
          team: tournament.team || [],
          rounds: tournament.rounds || []
        };
      }
    }
    return null;
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Tournament Header */}
      <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white flex items-center justify-between`}>
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold">{tournamentData.name}</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getTournamentStatusColor()}`}>
              {tournamentData.status === 'completed' && <span>🏆</span>}
              {tournamentData.status === 'ongoing' && <span>⚡</span>}
              {tournamentData.status === 'registration' && <span>📝</span>}
              {tournamentData.status === 'upcoming' && <span>📅</span>}
              <span>{tournamentData.status.charAt(0).toUpperCase() + tournamentData.status.slice(1)}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span className="text-wrap">{new Date(tournamentData.date).toLocaleDateString()}</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span className="text-wrap">{tournamentData.location}</span>
            </div>
            <div className="hidden sm:block">•</div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{tournamentData.totalPlayers} players</span>
            </div>
            {tournamentData.status === 'ongoing' && (
              <>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 animate-pulse" />
                  <span className="text-wrap font-medium text-green-600">Live Now</span>
                </div>
              </>
            )}
            {tournamentData.status === 'registration' && (
              <>
                <div className="hidden sm:block">•</div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-wrap">{tournamentData.currentRegistrations}/{tournamentData.maxCapacity} registered</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Phone Ban Handler */}
      {tournamentData.status === 'ongoing' && (
        <TournamentPhoneBanHandler
          tournamentId={tournamentId}
          operation="pairing_check"
          onMethodSelected={(method) => {
            console.log('Selected pairing check method:', method);
            // Handle the selected method
          }}
        />
      )}

      {/* Cutoff Message */}
      {tournamentData.status === 'completed' && (
        <div className="bg-purple-100 border border-purple-200 rounded-xl p-4 text-center text-purple-800 font-semibold">
          Pairings are now locked. No further results will be posted.
        </div>
      )}
      {/* Round Selector and Filters */}
      <div className="space-y-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {rounds.map((round) => (
            <button
              key={round}
              onClick={() => setSelectedRound(round)}
              className={`px-4 py-3 rounded-full whitespace-nowrap transition-all min-w-fit text-sm sm:text-base ${
                selectedRound === round
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Round {round}
            </button>
          ))}
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {currentPlayerId && tournamentData.status === 'ongoing' && (
            <button
              onClick={() => setShowMyPairingOnly(!showMyPairingOnly)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showMyPairingOnly
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {showMyPairingOnly ? 'Show All Pairings' : 'Show My Pairing'}
            </button>
          )}
          {tournamentData.status === 'ongoing' && (
            <button
              onClick={() => setShowIncompleteOnly(!showIncompleteOnly)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showIncompleteOnly
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {showIncompleteOnly ? 'Show All Matches' : 'Show Incomplete Only'}
            </button>
          )}
        </div>
      </div>
      {/* Pairings Table */}
      <div className="space-y-4">
        {getFilteredPairings(selectedRound).map((pairing, idx) => (
          <div
            key={idx}
            className={`bg-gray-50 rounded-xl p-4 shadow-sm md:shadow-md flex flex-col md:flex-row md:items-center md:justify-between transition-shadow border border-gray-100 ${canShowTeams && pairing.player1.team && pairing.player2.team ? 'cursor-pointer hover:shadow-xl ring-2 ring-purple-200' : ''}`}
            onClick={() => {
              if (tournamentData.status === 'completed') {
                // Default to player 1's run
                const run = getFullRunForPlayer(pairing.player1.name, tournamentData.name);
                if (run) setShowFullRun({ playerName: pairing.player1.name, ...run });
              } else if (canShowTeams && pairing.player1.team && pairing.player2.team) {
                setSelectedPairing(pairing);
              }
            }}
          >
            <div className="flex-1">
              {/* Player 1 */}
              <div className="flex-1 mb-2 md:mb-0">
                <div className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span>{pairing.player1.name}</span>
                  {/* If completed, allow clicking player 1's name to open their run */}
                  {tournamentData.status === 'completed' && (
                    <button
                      className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!pairing.player1.team || pairing.player1.team.length === 0}
                      title={!pairing.player1.team || pairing.player1.team.length === 0 ? 'No team data available' : ''}
                      onClick={e => {
                        e.stopPropagation();
                        if (onViewFullRun && pairing.player1.team && pairing.player1.team.length > 0) {
                          onViewFullRun(pairing.player1.id, tournamentData.name);
                        }
                      }}
                    >
                      View Full Run
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500">Record: {pairing.player1.record}</div>
                  {selectedRound === 8 && isDay2Qualified(pairing.player1.record, 8) && (
                    <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                      <span>🏆</span>
                      <span>Day 2</span>
                    </div>
                  )}
                </div>
                {canShowTeams && pairing.player1.team && (
                  <div className="mt-2 text-xs text-gray-700">
                    <span className="font-medium">Team:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pairing.player1.team.map((p: any, i: number) => (
                        <button
                          key={i}
                          className="px-2 py-1 rounded bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-bold hover:scale-110 transition-transform"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedPokemon(p);
                            setModalPlayerName(pairing.player1.name);
                            setModalTournamentName(tournamentData.name);
                          }}
                          title={p.name}
                        >
                          {p.name.charAt(0)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-xs text-gray-500 mb-1">Table {pairing.table}</div>
              {getMatchStatusIcon(pairing)}
              <div className="text-xs text-gray-500 mt-1">{getMatchStatusText(pairing)}</div>
              {pairing.result && (
                <div className="text-xs font-semibold text-gray-700 mt-1">{pairing.result.score}</div>
              )}
            </div>
            {/* Player 2 */}
            <div className="flex-1 mt-2 md:mt-0">
              <div className="font-semibold text-gray-900 flex items-center space-x-2">
                <span>{pairing.player2.name}</span>
                {/* If completed, allow clicking player 2's name to open their run */}
                {tournamentData.status === 'completed' && (
                  <button
                    className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!pairing.player2.team || pairing.player2.team.length === 0}
                    title={!pairing.player2.team || pairing.player2.team.length === 0 ? 'No team data available' : ''}
                    onClick={e => {
                      e.stopPropagation();
                      if (onViewFullRun && pairing.player2.team && pairing.player2.team.length > 0) {
                        onViewFullRun(pairing.player2.id, tournamentData.name);
                      }
                    }}
                  >
                    View Full Run
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">Record: {pairing.player2.record}</div>
                {selectedRound === 8 && isDay2Qualified(pairing.player2.record, 8) && (
                  <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center space-x-1">
                    <span>🏆</span>
                    <span>Day 2</span>
                  </div>
                )}
              </div>
              {canShowTeams && pairing.player2.team && (
                <div className="mt-2 text-xs text-gray-700">
                  <span className="font-medium">Team:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {pairing.player2.team.map((p: any, i: number) => (
                      <button
                        key={i}
                        className="px-2 py-1 rounded bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-bold hover:scale-110 transition-transform"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedPokemon(p);
                          setModalPlayerName(pairing.player2.name);
                          setModalTournamentName(tournamentData.name);
                        }}
                        title={p.name}
                      >
                        {p.name.charAt(0)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Team Modal for completed tournaments - remove View Full Run button */}
      {canShowTeams && selectedPairing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Full Teams - Table {selectedPairing.table}</h3>
              <button onClick={() => setSelectedPairing(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player 1 Team */}
              <div>
                <div className="font-semibold text-gray-900 mb-2">{selectedPairing.player1.name}'s Team</div>
                {selectedPairing.player1.team ? (
                  <div className="space-y-3">
                    {selectedPairing.player1.team.map((poke: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{poke.name.charAt(0)}</div>
                        <div>
                          <div className="font-medium text-gray-900">{poke.name}</div>
                          <div className="text-xs text-gray-600">Tera: {poke.teraType || '—'} | Item: {poke.item || '—'}</div>
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
                <div className="font-semibold text-gray-900 mb-2">{selectedPairing.player2.name}'s Team</div>
                {selectedPairing.player2.team ? (
                  <div className="space-y-3">
                    {selectedPairing.player2.team.map((poke: any, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{poke.name.charAt(0)}</div>
                        <div>
                          <div className="font-medium text-gray-900">{poke.name}</div>
                          <div className="text-xs text-gray-600">Tera: {poke.teraType || '—'} | Item: {poke.item || '—'}</div>
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{showFullRun.playerName}'s Tournament Run</h3>
              <button onClick={() => setShowFullRun(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            {/* Tournament Dropdown for multiple tournaments */}
            {(() => {
              // Find the player by name
              const player = mockPlayers.find(p => p.name === showFullRun.playerName);
              if (!player || !player.tournaments || player.tournaments.length <= 1) return null;
              // Find the current tournament index
              const currentTournamentIndex = player.tournaments.findIndex(t => t.name === showFullRun.tournamentName);
              return (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Tournament</label>
                  <select
                    className="w-full border rounded p-2"
                    value={showFullRun.tournamentName}
                    onChange={e => {
                      const selectedTournament = player.tournaments.find(t => t.name === e.target.value);
                      if (selectedTournament) {
                        // Find the run for this tournament
                        const run = getFullRunForPlayer(showFullRun.playerName, selectedTournament.name);
                        if (run) setShowFullRun({ playerName: showFullRun.playerName, ...run });
                      }
                    }}
                  >
                    {player.tournaments.map((t, idx) => (
                      <option key={idx} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              );
            })()}
            <div className="mb-4">
              <div className="font-semibold text-gray-900 mb-2">Team</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {showFullRun.team.map((poke: any, i: number) => (
                  <span key={i} className="px-2 py-1 rounded bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs font-bold">{poke.name}</span>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1">Round</th>
                      <th className="px-2 py-1">Opponent</th>
                      <th className="px-2 py-1">Opponent Team</th>
                      <th className="px-2 py-1">Result</th>
                      <th className="px-2 py-1">Score</th>
                      <th className="px-2 py-1">Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showFullRun.rounds.map((round, i) => (
                      <tr key={i} className={round.result === 'win' ? 'bg-green-50' : round.result === 'loss' ? 'bg-red-50' : 'bg-gray-50'}>
                        <td className="px-2 py-1 font-semibold">{round.round}</td>
                        <td className="px-2 py-1">{round.opponent}</td>
                        <td className="px-2 py-1">
                          <div className="flex flex-wrap gap-1">
                            {round.opponentTeam && round.opponentTeam.map((poke: any, j: number) => (
                              <span key={j} className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium">{poke.name}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-2 py-1 font-bold">{round.result?.toUpperCase()}</td>
                        <td className="px-2 py-1">{round.score}</td>
                        <td className="px-2 py-1">{round.table}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pokemon Modal for full details */}
      <PokemonModal
        pokemon={selectedPokemon}
        isOpen={!!selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
        tournamentName={modalTournamentName}
        playerName={modalPlayerName}
      />
    </div>
  );
};

export default TournamentPairings;