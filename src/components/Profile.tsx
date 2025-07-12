import React, { useState, useEffect, useRef } from 'react';
import { Settings, Share2, Download, Award, Calendar, TrendingUp, Users } from 'lucide-react';
import { mockPlayerStats, mockTournaments, mockPlayers } from '../data/mockData';
import { TeamShowcase as TeamShowcaseType } from '../types';
import { useTranslation } from 'react-i18next';
import TournamentPairings from './TournamentPairings';

interface ProfileProps {
  isOwnProfile?: boolean;
  playerId?: string;
  activeTab?: 'overview' | 'achievements' | 'history';
  onTabChange?: (tab: 'overview' | 'achievements' | 'history') => void;
  selectedTournamentName?: string;
}

const Profile: React.FC<ProfileProps> = ({ isOwnProfile = true, playerId, activeTab: controlledTab, onTabChange, selectedTournamentName }) => {
  const [internalTab, setInternalTab] = useState<'overview' | 'achievements' | 'history'>('overview');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = onTabChange ?? setInternalTab;
  const [isFollowing, setIsFollowing] = useState(false);
  const [publicTeams, setPublicTeams] = useState<TeamShowcaseType[]>([]); // Only public teams
  const [showDropModal, setShowDropModal] = useState(false);
  const [dropConfirmText, setDropConfirmText] = useState('');
  const [dropError, setDropError] = useState<string | null>(null);
  const [dropped, setDropped] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showPairingsModal, setShowPairingsModal] = useState<{ open: boolean; tournament: any | null }>({ open: false, tournament: null });
  const { t } = useTranslation();

  // Accordion state for expanded tournament
  const [expandedTournament, setExpandedTournament] = useState<string | null>(null);

  // If selectedTournamentName is provided, default to history tab
  useEffect(() => {
    if (selectedTournamentName) {
      setActiveTab('history');
    }
  }, [selectedTournamentName]);

  // If selectedTournamentName is provided, expand that tournament
  useEffect(() => {
    if (selectedTournamentName) {
      setActiveTab('history');
      setExpandedTournament(selectedTournamentName);
    } else if (recentTournaments.length > 0) {
      setExpandedTournament(recentTournaments[0].name);
    }
  }, [selectedTournamentName, recentTournaments]);

  // Fetch player data if playerId is provided
  const player = playerId ? mockPlayers.find(p => p.id === playerId) : null;

  if (playerId && !player) {
    return (
      <div className="px-4 py-6 text-center text-gray-500">
        Player not found.
      </div>
    );
  }

  // Defensive fallback for stats
  const stats = player
    ? {
        totalTournaments: player.tournaments?.length || 0,
        winRate: typeof player.winRate === 'number' ? player.winRate : 0,
        bestFinish: player.tournaments?.reduce((min, t) => t.placement && t.placement < min ? t.placement : min, 999) || '-',
        seasonWins: player.tournaments?.reduce((sum, t) => sum + (t.wins || 0), 0) || 0,
        seasonLosses: player.tournaments?.reduce((sum, t) => sum + (t.losses || 0), 0) || 0,
        resistance: player.tournaments?.length ? (player.tournaments?.reduce((sum, t) => sum + (t.resistance || 0), 0) / (player.tournaments?.length || 1)) : 0,
        opponentsBeat: player.tournaments?.reduce((sum, t) => sum + (t.wins || 0), 0) || 0,
        monthlyGames: player.tournaments?.slice(-3).reduce((sum, t) => sum + ((t.wins || 0) + (t.losses || 0)), 0) || 0,
      }
    : mockPlayerStats;

  // Defensive fallback for recentTournaments
  const recentTournaments = player && Array.isArray(player.tournaments)
    ? (player.tournaments.slice(0, 5) || [])
    : mockTournaments.slice(0, 5);

  // Defensive fallback for teams
  const teams = player && Array.isArray(player.teams) ? player.teams : [];

  const achievements = player
    ? (player.achievements?.map((title, i) => ({
        title,
        description: '',
        date: '',
        icon: '🏆',
      })) || [])
    : [
        { title: 'Regional Champion', description: 'Won a Regional Championship', date: '2024-02-15', icon: '🏆' },
        { title: 'Top Cut Master', description: 'Made top cut in 10 tournaments', date: '2024-01-20', icon: '🎯' },
        { title: 'Consistency King', description: 'Maintained 70%+ win rate for 3 months', date: '2023-12-01', icon: '⭐' },
        { title: 'Meta Breaker', description: 'Used unique team composition', date: '2023-11-15', icon: '🔥' },
      ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'achievements' as const, label: 'Achievements' },
    { id: 'history' as const, label: 'History' },
  ];

  // Drop logic
  const handleDropTournament = () => {
    if (dropConfirmText.trim().toLowerCase() !== 'phoenix regional championships'.toLowerCase()) {
      setDropError('Please type the tournament name exactly to confirm.');
      return;
    }
    setDropped(true);
    setShowDropModal(false);
    setDropError(null);
  };

  // In the history tab, use an accordion/toggle for tournaments
  const tournamentRefs = useRef<{ [name: string]: HTMLDivElement | null }>({});
  useEffect(() => {
    if (expandedTournament && tournamentRefs.current[expandedTournament]) {
      tournamentRefs.current[expandedTournament]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [expandedTournament, recentTournaments]);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
              {player ? player.name.charAt(0) : 'T'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{player ? player.name : 'TrainerMaster'}</h2>
              <p className="text-indigo-100">VGC Player • {player ? player.region : 'North America'}</p>
            </div>
          </div>
          {isOwnProfile ? (
            <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors" aria-label="Open account settings" onClick={() => setShowProfileSettings(true)}>
              <Settings className="h-6 w-6" />
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  isFollowing
                    ? 'bg-white bg-opacity-20 hover:bg-opacity-30'
                    : 'bg-white text-indigo-600 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4 inline mr-1" />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.totalTournaments}</p>
            <p className="text-sm text-indigo-100">Tournaments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.winRate}%</p>
            <p className="text-sm text-indigo-100">Win Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">#{stats.bestFinish}</p>
            <p className="text-sm text-indigo-100">Best Finish</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isOwnProfile && (
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <Share2 className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Share Profile</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <Download className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Export Data</span>
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Stats */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">{stats.seasonWins}</p>
                <p className="text-sm text-gray-600">Season Wins</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">{stats.opponentsBeat}</p>
                <p className="text-sm text-gray-600">Opponents Beat</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">{stats.resistance}%</p>
                <p className="text-sm text-gray-600">Avg Resistance</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-gray-900">{stats.monthlyGames}</p>
                <p className="text-sm text-gray-600">Monthly Games</p>
              </div>
            </div>
          </div>

          {/* Live Tournament Status - Special for Manraj Sidhu */}
          {player?.id === 'manraj-sidhu' && player.isActiveInLiveTournament && !dropped && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-red-800">Live Tournament</h3>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium animate-pulse">
                  Live Now
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Tournament:</span>
                  <span className="font-medium text-red-800">Phoenix Regional Championships</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Current Round:</span>
                  <span className="font-medium text-red-800">Round {player.currentRound}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Table:</span>
                  <span className="font-medium text-red-800">Table {player.currentTable}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Opponent:</span>
                  <span className="font-medium text-red-800">{player.currentMatch?.opponent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Record:</span>
                  <span className="font-medium text-red-800">{player.currentMatch?.round === 1 ? '0-0' : 
                    player.currentMatch?.round === 2 ? '1-0' : '2-0'}</span>
                </div>
              </div>
              {/* Drop from Tournament Button */}
              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700"
                onClick={() => setShowDropModal(true)}
              >
                Drop from Tournament
              </button>
              {showDropModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">Confirm Drop from Tournament</h3>
                    <p className="mb-2 text-gray-700">Type <span className="font-bold">Phoenix Regional Championships</span> to confirm you want to drop from this tournament. This cannot be undone.</p>
                    <input
                      type="text"
                      value={dropConfirmText}
                      onChange={e => setDropConfirmText(e.target.value)}
                      placeholder="Type tournament name..."
                      className="border p-2 rounded w-full mb-2"
                    />
                    {dropError && <div className="text-red-600 mb-2">{dropError}</div>}
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => setShowDropModal(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                      <button onClick={handleDropTournament} className="px-4 py-2 rounded bg-red-600 text-white">Confirm Drop</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {dropped && (
            <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-4 text-yellow-800 font-semibold mt-4">
              You have dropped from the tournament.
            </div>
          )}

          {/* Favorite Pokémon */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Most Used Pokémon</h3>
            <div className="space-y-3">
              {['Charizard', 'Gholdengo', 'Urshifu', 'Rillaboom', 'Amoonguss'].map((pokemon, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {pokemon.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{pokemon}</span>
                  </div>
                  <span className="text-sm text-gray-500">{85 - index * 5}% usage</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </div>
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {recentTournaments.map((tournament) => {
            const isExpanded = expandedTournament === tournament.name;
            return (
              <div
                key={tournament.id}
                ref={el => tournamentRefs.current[tournament.name] = el}
                className={`bg-white rounded-xl border border-gray-200 transition-all ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none focus:ring"
                  onClick={() => setExpandedTournament(isExpanded ? null : tournament.name)}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{tournament.name}</h4>
                    <p className="text-sm text-gray-600">{tournament.location} • {new Date(tournament.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`ml-4 text-lg transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                </button>
                {isExpanded && (
                  <div className="p-4 pt-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-right">
                        <span className="text-sm font-medium text-blue-600">#{tournament.placement}</span>
                        <p className="text-xs text-gray-500">{tournament.wins}W-{tournament.losses}L</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-500">
                        {new Date(tournament.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{tournament.resistance}%</span>
                      </div>
                    </div>
                    {/* Player's Team */}
                    {tournament.team && tournament.team.length > 0 && (
                      <div className="mb-2">
                        <h5 className="font-semibold text-gray-800 text-sm mb-1">Team Used:</h5>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tournament.team.map((p, i) => (
                            <span key={i} className="px-2 py-1 bg-indigo-50 rounded-full text-xs font-medium text-indigo-700 border border-indigo-200">{p.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Show My Pairings Button for completed tournaments */}
                    {tournament.status === 'completed' && (
                      <button
                        className="mt-2 mb-2 px-4 py-2 rounded bg-purple-600 text-white font-medium hover:bg-purple-700 focus:outline-none focus:ring"
                        onClick={() => setShowPairingsModal({ open: true, tournament })}
                      >
                        Show My Pairings
                      </button>
                    )}
                    {/* Export Data Button (always visible) */}
                    <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-xl p-2 hover:bg-gray-50 transition-colors mt-2">
                      <Download className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Export Data</span>
                    </button>
                    {/* Round-by-round breakdown */}
                    {tournament.rounds && tournament.rounds.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs text-left border mt-2">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-2 py-1 font-semibold">Round</th>
                              <th className="px-2 py-1 font-semibold">Opponent</th>
                              <th className="px-2 py-1 font-semibold">Opponent Team</th>
                              <th className="px-2 py-1 font-semibold">Result</th>
                              <th className="px-2 py-1 font-semibold">Score</th>
                              <th className="px-2 py-1 font-semibold">Table</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tournament.rounds.map((round, i) => (
                              <tr key={i} className={round.result === 'win' ? 'bg-green-50' : round.result === 'loss' ? 'bg-red-50' : 'bg-gray-50'}>
                                <td className="px-2 py-1 font-semibold">{round.round}</td>
                                <td className="px-2 py-1">{round.opponent}</td>
                                <td className="px-2 py-1">
                                  {round.opponentTeam && round.opponentTeam.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {round.opponentTeam.map((poke, idx) => (
                                        <span key={idx} className="px-1 py-0.5 bg-gray-100 rounded text-xs text-gray-700 border border-gray-200">{poke.name}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">N/A</span>
                                  )}
                                </td>
                                <td className="px-2 py-1 font-semibold">
                                  {round.result ? (round.result === 'win' ? 'Win' : round.result === 'loss' ? 'Loss' : 'Draw') : '—'}
                                </td>
                                <td className="px-2 py-1">{round.score || '—'}</td>
                                <td className="px-2 py-1">{round.table || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {/* Pairings Modal */}
          {showPairingsModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">My Pairings - {showPairingsModal.tournament.name}</h3>
                <TournamentPairings
                  tournamentId={showPairingsModal.tournament.id}
                  tournamentName={showPairingsModal.tournament.name}
                  isRegistered={true}
                  userDivision={player?.division || 'master'}
                  pairings={showPairingsModal.tournament.rounds?.map((r, i) => ({
                    round: r.round,
                    table: r.table,
                    player1: { id: player?.id || 'me', name: player?.name || 'Me', record: r.result || '' },
                    player2: { id: r.opponentId || 'opponent', name: r.opponent || 'Opponent', record: '' },
                    result: r.result ? { winner: r.result === 'win' ? (player?.id || 'me') : (r.opponentId || 'opponent'), score: r.score || '' } : undefined
                  }))}
                  currentPlayerId={player?.id}
                  tournament={{ ...showPairingsModal.tournament, status: 'completed' }}
                />
                <div className="flex justify-end mt-4">
                  <button onClick={() => setShowPairingsModal({ open: false, tournament: null })} className="px-4 py-2 rounded bg-gray-200">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Teams Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Teams</h3>
        <div className="space-y-4">
          {teams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No teams available for this player.</div>
          ) : (
            teams.map((team) => (
              <div key={team.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{team.title || 'Untitled Team'}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${team.sharedType === 'evs' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {team.sharedType === 'evs' ? 'With EVs' : 'Open Team Sheet'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{team.description || 'No description.'}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(team.team) && team.team.length > 0 ? (
                    team.team.map((p, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">{p.name}</span>
                    ))
                  ) : (
                    <span className="text-gray-400">No Pokémon in this team.</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Shared {team.sharedAt ? new Date(team.sharedAt).toLocaleDateString() : ''}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{t('Profile Settings')}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Play! Pokémon Player ID')}</label>
                <input type="text" value={player?.playerId || '000000'} readOnly className="w-full border p-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Name')}</label>
                <input type="text" value={player?.name || 'TrainerMaster'} readOnly className="w-full border p-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Country')}</label>
                <input type="text" value={player?.region || 'Unknown'} readOnly className="w-full border p-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Date of Birth')}</label>
                <input type="text" value={player?.dateOfBirth || '2000-01-01'} readOnly className="w-full border p-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Notification Preferences')}</label>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>{t('Email')}: {player?.preferences?.notifications?.email ? 'On' : 'Off'}</li>
                  <li>{t('Push')}: {player?.preferences?.notifications?.push ? 'On' : 'Off'}</li>
                  <li>{t('SMS')}: {player?.preferences?.notifications?.sms ? 'On' : 'Off'}</li>
                  <li>{t('Tournament Updates')}: {player?.preferences?.notifications?.tournamentUpdates ? 'On' : 'Off'}</li>
                  <li>{t('Pairing Notifications')}: {player?.preferences?.notifications?.pairingNotifications ? 'On' : 'Off'}</li>
                  <li>{t('Round Start Reminders')}: {player?.preferences?.notifications?.roundStartReminders ? 'On' : 'Off'}</li>
                  <li>{t('Social Interactions')}: {player?.preferences?.notifications?.socialInteractions ? 'On' : 'Off'}</li>
                  <li>{t('Achievement Unlocks')}: {player?.preferences?.notifications?.achievementUnlocks ? 'On' : 'Off'}</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button onClick={() => setShowProfileSettings(false)} className="px-4 py-2 rounded bg-gray-200">{t('Close')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;