import React, { useState, useEffect, useRef } from 'react';
import { Settings, Share2, Award, Calendar, TrendingUp, Users, ArrowLeft, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockPlayerStats, mockTournaments, mockPlayers, mockUserSession } from '../data/mockData';
import { TeamShowcase as TeamShowcaseType } from '../types';
import { useTranslation } from 'react-i18next';
import TournamentPairings from './TournamentPairings';
import LanguageDropdown from './LanguageDropdown';

interface ProfileProps {
  isOwnProfile?: boolean;
  playerId?: string;
  activeTab?: 'overview' | 'achievements' | 'history';
  onTabChange?: (tab: 'overview' | 'achievements' | 'history') => void;
  selectedTournamentName?: string;
}

const Profile: React.FC<ProfileProps> = ({ isOwnProfile = true, playerId, activeTab: controlledTab, onTabChange, selectedTournamentName }) => {
  const navigate = useNavigate();
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

  // Fetch player data if playerId is provided
  const player = playerId ? mockPlayers.find(p => p.id === playerId) : null;

  // Defensive check for required fields - only check tournaments and achievements
  if (playerId && !player) {
    return (
      <div className="px-4 py-6 text-center text-gray-500">
        <h2 className="text-xl font-semibold mb-2">Player Not Found</h2>
        <p>Player with ID "{playerId}" could not be found.</p>
        <p className="text-sm mt-2">Available players: {mockPlayers.slice(0, 5).map(p => p.id).join(', ')}...</p>
      </div>
    );
  }

  // If player exists but has missing data, provide fallbacks
  const safePlayer = player || {
    name: 'Unknown Player',
    region: 'Unknown',
    division: 'master',
    championships: 0,
    winRate: 0,
    rating: 0,
    tournaments: [],
    achievements: [],
    privacySettings: { profileVisibility: 'public', teamShowcaseVisibility: 'public', allowTeamReports: true, showTournamentHistory: true, allowQRCodeGeneration: true },
    isVerified: false,
    playerId: playerId || 'unknown',
  };

  // Use player-specific stats and tournaments if available
  const stats = safePlayer
    ? {
        totalTournaments: safePlayer.tournaments?.length || 0,
        winRate: safePlayer.winRate || 0,
        bestFinish: safePlayer.tournaments?.reduce((min, t) => t.placement && t.placement < min ? t.placement : min, 999) || '-',
        seasonWins: safePlayer.tournaments?.reduce((sum, t) => sum + (t.wins || 0), 0) || 0,
        seasonLosses: safePlayer.tournaments?.reduce((sum, t) => sum + (t.losses || 0), 0) || 0,
        resistance: safePlayer.tournaments?.reduce((sum, t) => sum + (t.resistance || 0), 0) / (safePlayer.tournaments?.length || 1),
        opponentsBeat: safePlayer.tournaments?.reduce((sum, t) => sum + (t.wins || 0), 0) || 0,
        monthlyGames: safePlayer.tournaments?.slice(-3).reduce((sum, t) => sum + ((t.wins || 0) + (t.losses || 0)), 0) || 0,
      }
    : mockPlayerStats;

  // Always declare recentTournaments before any use
  const recentTournaments = safePlayer.tournaments?.slice(0, 5) || [];

  // If selectedTournamentName is provided, expand that tournament
  useEffect(() => {
    if (selectedTournamentName) {
      setActiveTab('history');
      setExpandedTournament(selectedTournamentName);
    } else if (recentTournaments.length > 0) {
      setExpandedTournament(recentTournaments[0].name);
    }
  }, [selectedTournamentName, recentTournaments]);

  // Get most recent team from the most recent completed tournament (not ongoing)
  const getMostRecentTeam = () => {
    if (!safePlayer.tournaments || safePlayer.tournaments.length === 0) return null;
    const sortedTournaments = [...safePlayer.tournaments]
      .filter(t => t.status === 'completed' && t.team && t.team.length > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedTournaments.length > 0 ? sortedTournaments[0].team : null;
  };

  // Get current or most recent tournament run
  const getCurrentTournamentRun = () => {
    if (!safePlayer.tournaments || safePlayer.tournaments.length === 0) return null;
    const sortedTournaments = [...safePlayer.tournaments].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sortedTournaments[0];
  };

  // Get tournament history (last 5 tournaments)
  const getTournamentHistory = () => {
    if (!safePlayer.tournaments || safePlayer.tournaments.length === 0) return [];
    return [...safePlayer.tournaments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  // Get achievements with proper structure
  const getPlayerAchievements = () => {
    if (!safePlayer.achievements || safePlayer.achievements.length === 0) return [];
    return safePlayer.achievements.map((achievement: any, index: number) => ({
      id: `achievement-${index}`,
      title: typeof achievement === 'string' ? achievement : achievement.name || 'Achievement',
      description: typeof achievement === 'string' ? '' : achievement.description || '',
      icon: typeof achievement === 'string' ? '🏆' : achievement.icon || '🏆',
      date: typeof achievement === 'string' ? '2024-01-01' : achievement.unlockedAt || '2024-01-01',
      category: 'tournament' as const,
      rarity: 'common' as const,
    }));
  };

  const getAchievementDescription = (achievement: string) => {
    if (achievement.includes('Champion')) return 'Won a major tournament championship';
    if (achievement.includes('Top')) return 'Achieved top placement in a major tournament';
    if (achievement.includes('Regional')) return 'Won a regional championship';
    if (achievement.includes('Worlds')) return 'Competed at the World Championships';
    return 'Achievement unlocked through tournament performance';
  };

  const getAchievementIcon = (achievement: string) => {
    if (achievement.includes('Champion')) return '🏆';
    if (achievement.includes('Worlds')) return '🌍';
    if (achievement.includes('Regional')) return '🏅';
    if (achievement.includes('Top')) return '⭐';
    return '🎯';
  };

  const getAchievementDate = (achievement: string) => {
    const year = achievement.match(/\d{4}/)?.[0] || '2024';
    return `${year}-01-01`;
  };

  const getAchievementRarity = (achievement: string) => {
    if (achievement.includes('Worlds')) return 'legendary' as const;
    if (achievement.includes('Champion')) return 'epic' as const;
    if (achievement.includes('Regional')) return 'rare' as const;
    return 'common' as const;
  };

  const mostRecentTeam = getMostRecentTeam();
  const currentTournamentRun = getCurrentTournamentRun();
  const tournamentHistory = getTournamentHistory();
  const playerAchievements = getPlayerAchievements();

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

  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [privateTeams, setPrivateTeams] = useState(mockUserSession.privateTeams || []);
  const [pasteError, setPasteError] = useState<string | null>(null);

  // Showdown paste parser (simple)
  function parseShowdownPaste(paste: string) {
    const lines = paste.split('\n').map(l => l.trim()).filter(Boolean);
    const team = [];
    let current = null;
    for (const line of lines) {
      if (line === '' || line.startsWith('---')) continue;
      if (/^[A-Za-z0-9\- ]+( @ .+)?$/.test(line)) {
        if (current) team.push(current);
        current = { name: line.split(' @ ')[0].split('(')[0].trim() };
      }
    }
    if (current) team.push(current);
    return team.length === 6 ? team : null;
  }

  const handleImportPaste = () => {
    const team = parseShowdownPaste(pasteText);
    if (!team) {
      setPasteError('Invalid Showdown paste. Please paste a full 6-Pokémon team.');
      return;
    }
    const newTeam = {
      id: `team-${Date.now()}`,
      name: `Imported Team ${privateTeams.length + 1}`,
      pokemon: team,
      dateSaved: new Date().toISOString().slice(0, 10),
      notes: ''
    };
    setPrivateTeams([newTeam, ...privateTeams]);
    setShowPasteModal(false);
    setPasteText('');
    setPasteError(null);
  };

  const handleDeleteTeam = (id: string) => {
    setPrivateTeams(privateTeams.filter(t => t.id !== id));
  };

  const anyTournamentOngoing = mockTournaments.some(t => t.status === 'ongoing');

  return (
    <>
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {!isOwnProfile && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors mr-2"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
                {safePlayer.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{safePlayer.name}</h2>
                <p className="text-indigo-100">VGC Player • {safePlayer.region}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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

        {isOwnProfile && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">My Teams</h3>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowPasteModal(true)}
              >
                + Import Showdown Paste
              </button>
            </div>
            {privateTeams.length === 0 ? (
              <div className="text-gray-500">No teams saved yet.</div>
            ) : (
              <div className="space-y-3">
                {privateTeams.map(team => (
                  <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div>
                      <div className="font-medium text-gray-900">{team.name}</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {team.pokemon.map((p: any, i: number) => (
                          <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">{p.name}</span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Saved: {team.dateSaved}</div>
                    </div>
                    <button
                      className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Showdown Paste Modal */}
            {showPasteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h4 className="text-lg font-bold mb-2">Import Showdown Paste</h4>
                  <textarea
                    className="w-full border rounded p-2 mb-2"
                    rows={8}
                    value={pasteText}
                    onChange={e => setPasteText(e.target.value)}
                    placeholder={"Paste your full Showdown team here..."}
                  />
                  {pasteError && <div className="text-red-600 text-sm mb-2">{pasteError}</div>}
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowPasteModal(false)}>Cancel</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleImportPaste}>Save Team</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
              onClick={() => {
                // Always update internal tab state for local tab switching
                setInternalTab(tab.id);
                // If a parent handler is provided, call it too
                if (onTabChange) onTabChange(tab.id);
              }}
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
            {/* Most Recent Team */}
            {mostRecentTeam && !anyTournamentOngoing && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Most Recent Team</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {mostRecentTeam.map((pokemon, index) => (
                    <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {pokemon.name.charAt(0)}
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{pokemon.name}</h4>
                        {pokemon.item && (
                          <p className="text-xs text-gray-600 mb-1">{pokemon.item}</p>
                        )}
                        {pokemon.ability && (
                          <p className="text-xs text-gray-500">{pokemon.ability}</p>
                        )}
                        {pokemon.teraType && (
                          <div className="mt-1">
                            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                              Tera {pokemon.teraType}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {currentTournamentRun && (
                  <div className="mt-3 text-sm text-gray-600">
                    Used in: {currentTournamentRun.name} ({new Date(currentTournamentRun.date).toLocaleDateString()})
                  </div>
                )}
              </div>
            )}
            {anyTournamentOngoing && (
              <div className="bg-yellow-100 text-yellow-900 rounded-lg p-4 text-center font-semibold mb-4">
                Teams are hidden while a tournament is ongoing.
              </div>
            )}

            {/* Current/Recent Tournament Run */}
            {currentTournamentRun && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {currentTournamentRun.status === 'ongoing' ? 'Current Tournament' : 'Recent Tournament'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentTournamentRun.status === 'ongoing' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentTournamentRun.status === 'ongoing' ? 'Live' : 'Completed'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{currentTournamentRun.name}</h4>
                    <span className="text-sm text-gray-600">{new Date(currentTournamentRun.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">{currentTournamentRun.placement || '—'}</p>
                      <p className="text-xs text-gray-600">Placement</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">{currentTournamentRun.wins || 0}W-{currentTournamentRun.losses || 0}L</p>
                      <p className="text-xs text-gray-600">Record</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-900">{currentTournamentRun.resistance || 0}%</p>
                      <p className="text-xs text-gray-600">Resistance</p>
                    </div>
                  </div>

                  {currentTournamentRun.rounds && currentTournamentRun.rounds.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Round Results:</h5>
                      <div className="grid grid-cols-4 gap-2">
                        {currentTournamentRun.rounds.map((round, index) => (
                          <div key={index} className={`text-center p-2 rounded-lg text-sm font-medium ${
                            round.result === 'win' 
                              ? 'bg-green-100 text-green-800' 
                              : round.result === 'loss' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <div>R{round.round}</div>
                            <div>{round.result === 'win' ? 'W' : round.result === 'loss' ? 'L' : 'D'}</div>
                            <div className="text-xs">{round.score || '—'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tournament History */}
            {tournamentHistory.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Tournament History</h3>
                <div className="space-y-3">
                  {tournamentHistory.map((tournament, index) => (
                    <div key={tournament.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{tournament.name}</h4>
                        <p className="text-sm text-gray-600">
                          {tournament.location} • {new Date(tournament.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          #{tournament.placement || '—'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {tournament.wins || 0}W-{tournament.losses || 0}L
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {playerAchievements.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {playerAchievements.slice(0, 6).map((achievement) => (
                    <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                        <div className="flex items-center mt-2">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            achievement.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                            achievement.rarity === 'epic' ? 'bg-blue-100 text-blue-800' :
                            achievement.rarity === 'rare' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <p className="text-xl font-bold text-gray-900">{stats.resistance.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Avg Resistance</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-gray-900">{stats.monthlyGames}</p>
                  <p className="text-sm text-gray-600">Monthly Games</p>
                </div>
              </div>
            </div>

            {/* Live Tournament Status - Special for Manraj Sidhu */}
            {safePlayer.id === 'manraj-sidhu' && safePlayer.isActiveInLiveTournament && !dropped && (
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
                    <span className="font-medium text-red-800">Round {safePlayer.currentRound}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700">Table:</span>
                    <span className="font-medium text-red-800">Table {safePlayer.currentTable}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700">Opponent:</span>
                    <span className="font-medium text-red-800">{safePlayer.currentMatch?.opponent}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700">Record:</span>
                    <span className="font-medium text-red-800">{safePlayer.currentMatch?.round === 1 ? '0-0' : 
                      safePlayer.currentMatch?.round === 2 ? '1-0' : '2-0'}</span>
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
            {playerAchievements.length > 0 ? (
              <>
                {/* Achievement Summary */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Achievement Summary</h3>
                      <p className="text-sm text-gray-600">Total Achievements: {playerAchievements.length}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-600">{playerAchievements.length}</div>
                      <div className="text-xs text-gray-600">Unlocked</div>
                    </div>
                  </div>
                </div>

                {/* Achievement Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playerAchievements.map((achievement, index) => (
                    <div key={achievement.id} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(achievement.date).toLocaleDateString()}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              achievement.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                              achievement.rarity === 'epic' ? 'bg-blue-100 text-blue-800' :
                              achievement.rarity === 'rare' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {achievement.rarity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Achievements Yet</h3>
                <p className="text-gray-600">Start competing in tournaments to unlock achievements!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tournament History</h3>
              <p className="text-gray-600">Tournament history will be displayed here.</p>
            </div>
          </div>
        )}

        {/* Teams Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Teams</h3>
          <div className="text-center py-8 text-gray-500">Teams will be displayed here.</div>
        </div>
      </div>
    </>
  );
};

export default Profile;