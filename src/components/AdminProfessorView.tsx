import React, { useState, useCallback } from 'react';
import { Shield, Users, FileText, CheckCircle, XCircle, AlertTriangle, Filter, Search, Calendar, Award, MapPin, Plus, Settings, BarChart3, Activity, Database, Server } from 'lucide-react';
import AdminPanel from './AdminPanel';
import TournamentCreation from './TournamentCreation';
import ScalableTournamentRegistration from './ScalableTournamentRegistration';
import TournamentPairings from './TournamentPairings';
import EventCalendar from './EventCalendar';
import { UserSession, BlogPost } from '../types';
import { mockTournaments } from '../data/mockData';
import Tesseract from 'tesseract.js';

type AdminTabType = 'dashboard' | 'tournaments' | 'create-tournament' | 'admin-panel' | 'analytics' | 'system-health';

interface AdminProfessorViewProps {
  userSession: UserSession;
  onLogout: () => void;
  onGoHome: () => void;
  isAdmin: boolean;
  isProfessor: boolean;
  isPokemonCompanyOfficial: boolean;
  professorLevel?: string;
  certificationNumber?: string;
  onSwitchView?: (view: 'competitor' | 'professor' | 'admin') => void;
}

const AdminProfessorView: React.FC<AdminProfessorViewProps> = ({ 
  userSession, 
  onLogout, 
  onGoHome,
  isAdmin, 
  isProfessor, 
  isPokemonCompanyOfficial,
  professorLevel,
  certificationNumber,
  onSwitchView
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');
  const [selectedTournament, setSelectedTournament] = useState<string | null>(mockTournaments[0]?.id || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ocrImage, setOcrImage] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [matchSlipEntries, setMatchSlipEntries] = useState<any[]>([]);
  const [showDropModal, setShowDropModal] = useState(false);
  const [dropPlayerName, setDropPlayerName] = useState('');
  const [dropError, setDropError] = useState<string | null>(null);
  const [droppedPlayers, setDroppedPlayers] = useState<string[]>([]);

  const mockTournament = mockTournaments[0];

  // Mock: List of players for the selected tournament
  const playerList: { id: string; name: string }[] = (mockTournament && (mockTournament as any).players) || [
    { id: '1', name: 'Alex Rodriguez' },
    { id: '2', name: 'Sarah Kim' },
    { id: '3', name: 'Marcus Johnson' },
    { id: '4', name: 'Emily Chen' },
    { id: '5', name: 'David Lee' },
    { id: '6', name: 'Jessica Wang' },
    { id: '7', name: 'Michael Brown' },
    { id: '8', name: 'Lisa Garcia' },
    { id: '9', name: 'Robert Wilson' },
    { id: '10', name: 'Amanda Taylor' },
    { id: '11', name: 'Chris Davis' },
    { id: '12', name: 'Rachel Green' },
    { id: '13', name: 'Jennifer Lopez' },
    { id: '14', name: 'Tom Anderson' },
    { id: '15', name: 'Maria Garcia' },
  ];

  const tabs = [
    { id: 'dashboard' as AdminTabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'tournaments' as AdminTabType, label: 'Tournaments', icon: Calendar },
    ...(isProfessor ? [{ id: 'create-tournament' as AdminTabType, label: 'Create Tournament', icon: Plus }] : []),
    ...(isAdmin || isPokemonCompanyOfficial ? [{ id: 'admin-panel' as AdminTabType, label: 'Admin Panel', icon: Shield }] : []),
    { id: 'analytics' as AdminTabType, label: 'Analytics', icon: Activity },
    { id: 'system-health' as AdminTabType, label: 'System Health', icon: Server },
  ];

  const handleTournamentRegister = useCallback(async (tournamentId: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Registered for tournament:', tournamentId);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleTournamentRequestSubmit = useCallback((request: any) => {
    console.log('Tournament creation request submitted:', request);
  }, []);

  const handleTabChange = useCallback((tabId: AdminTabType) => {
    setActiveTab(tabId);
  }, []);

  const handleSettingsToggle = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const handleViewSwitch = useCallback((view: 'competitor' | 'professor' | 'admin') => {
    if (onSwitchView) {
      onSwitchView(view);
    }
    setShowSettings(false);
  }, [onSwitchView]);

  // OCR logic
  const handleOcrImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setOcrImage(e.target.files[0]);
    setOcrText('');
    setOcrResult(null);
    setOcrLoading(true);
    setOcrError(null);
    try {
      const { data } = await Tesseract.recognize(e.target.files[0], 'eng');
      setOcrText(data.text);
      // Simple parsing logic (can be improved)
      const lines = data.text.split('\n').map((l: string) => l.trim()).filter(Boolean);
      let table = '';
      let player1 = '';
      let player2 = '';
      let result = '';
      lines.forEach((line: string) => {
        if (/table/i.test(line)) table = line.replace(/[^0-9]/g, '');
        if (/player 1/i.test(line)) player1 = line.replace(/player 1/i, '').trim();
        if (/player 2/i.test(line)) player2 = line.replace(/player 2/i, '').trim();
        if (/result|score/i.test(line)) result = line.replace(/[^0-9-]/g, '');
      });
      setOcrResult({ table, player1, player2, result });
    } catch (err: any) {
      setOcrError('Failed to process image. Try a clearer photo.');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSaveOcrResult = () => {
    if (!ocrResult || !ocrResult.table || !ocrResult.player1 || !ocrResult.player2 || !ocrResult.result) {
      setOcrError('Please review and complete all fields.');
      return;
    }
    setMatchSlipEntries(prev => [...prev, ocrResult]);
    setOcrImage(null);
    setOcrText('');
    setOcrResult(null);
    setOcrError(null);
  };

  // Drop player logic
  const handleDropPlayer = () => {
    const player = playerList.find(p => p.name.toLowerCase() === dropPlayerName.toLowerCase());
    if (!player) {
      setDropError('Player not found.');
      return;
    }
    if (droppedPlayers.includes(player.id)) {
      setDropError('Player already dropped.');
      return;
    }
    setDroppedPlayers(prev => [...prev, player.id]);
    setDropPlayerName('');
    setShowDropModal(false);
    setDropError(null);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="container-responsive space-responsive space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {isPokemonCompanyOfficial ? 'Pokémon Company Official Dashboard' : 
                     isAdmin ? 'Administrator Dashboard' : 'Professor Dashboard'}
                  </h2>
                  <p className="text-red-100">
                    {isPokemonCompanyOfficial ? 'Manage official tournaments and content' :
                     isAdmin ? 'Monitor platform health and manage users' :
                     'Create and manage tournaments'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6" />
                  <span className="text-sm">
                    {isPokemonCompanyOfficial ? 'Pokémon Company Official' :
                     isAdmin ? 'Administrator' :
                     `${professorLevel} Professor`}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-red-100">Pending Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-red-100">Pending Verifications</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-red-100">Active Reports</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-red-100">Tournament Requests</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid-responsive">
              <button 
                onClick={() => handleTabChange('tournaments')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Manage Tournaments</p>
                    <p className="text-sm text-gray-600">View and edit events</p>
                  </div>
                </div>
              </button>
              {isProfessor && (
                <button 
                  onClick={() => handleTabChange('create-tournament')}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Create Tournament</p>
                      <p className="text-sm text-gray-600">Set up new event</p>
                    </div>
                  </div>
                </button>
              )}
              {(isAdmin || isPokemonCompanyOfficial) && (
                <button 
                  onClick={() => handleTabChange('admin-panel')}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Admin Panel</p>
                      <p className="text-sm text-gray-600">Manage content & users</p>
                    </div>
                  </div>
                </button>
              )}
              <button 
                onClick={() => handleTabChange('system-health')}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 card"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Server className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">System Health</p>
                    <p className="text-sm text-gray-600">Monitor performance</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New blog post submitted</p>
                    <p className="text-xs text-gray-500">Advanced Speed Control Strategies</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">User verification approved</p>
                    <p className="text-xs text-gray-500">Emily Chen - Master Division</p>
                  </div>
                  <span className="text-xs text-gray-500">5 min ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Report resolved</p>
                    <p className="text-xs text-gray-500">Inappropriate content - User warned</p>
                  </div>
                  <span className="text-xs text-gray-500">10 min ago</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tournaments':
        return (
          <div className="container-responsive space-responsive space-y-6">
            <ScalableTournamentRegistration
              tournament={mockTournament}
              userDivision={userSession.division}
              onRegister={handleTournamentRegister}
              isAdmin={true}
            />
            {/* --- MATCH SLIP PHOTO ENTRY --- */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Slip Photo Entry (OCR)</h3>
              <input type="file" accept="image/*" onChange={handleOcrImageChange} className="mb-4" />
              {ocrLoading && <div className="text-blue-600">Processing image...</div>}
              {ocrError && <div className="text-red-600 mb-2">{ocrError}</div>}
              {ocrResult && (
                <div className="mb-4">
                  <label>Table: <input value={ocrResult.table} onChange={e => setOcrResult({ ...ocrResult, table: e.target.value })} className="border p-1 rounded ml-2" /></label><br />
                  <label>Player 1: <input value={ocrResult.player1} onChange={e => setOcrResult({ ...ocrResult, player1: e.target.value })} className="border p-1 rounded ml-2" /></label><br />
                  <label>Player 2: <input value={ocrResult.player2} onChange={e => setOcrResult({ ...ocrResult, player2: e.target.value })} className="border p-1 rounded ml-2" /></label><br />
                  <label>Result: <input value={ocrResult.result} onChange={e => setOcrResult({ ...ocrResult, result: e.target.value })} className="border p-1 rounded ml-2" /></label>
                </div>
              )}
              <button onClick={handleSaveOcrResult} className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2" disabled={ocrLoading || !ocrResult}>Save Result</button>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Entered Match Slips</h4>
                <ul className="list-disc pl-6">
                  {matchSlipEntries.map((entry, idx) => (
                    <li key={idx}>Table {entry.table}: {entry.player1} vs {entry.player2} - Result: {entry.result}</li>
                  ))}
                </ul>
                {matchSlipEntries.length >= (mockTournament && (mockTournament as any).tables ? (mockTournament as any).tables.length : 15) && (
                  <div className="text-green-600 font-semibold mt-2">All matches entered!</div>
                )}
              </div>
            </div>
            {/* --- DROP PLAYER MODAL --- */}
            <button onClick={() => setShowDropModal(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-4">Drop Player</button>
            {showDropModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Drop Player from Tournament</h3>
                  <input type="text" value={dropPlayerName} onChange={e => setDropPlayerName(e.target.value)} placeholder="Enter player name..." className="border p-2 rounded w-full mb-2" />
                  {dropError && <div className="text-red-600 mb-2">{dropError}</div>}
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => setShowDropModal(false)} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                    <button onClick={handleDropPlayer} className="px-4 py-2 rounded bg-red-600 text-white">Drop</button>
                  </div>
                </div>
              </div>
            )}
            {/* (Show dropped players list somewhere in the tournament view) */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Dropped Players</h4>
              <ul className="list-disc pl-6">
                {droppedPlayers.map(pid => {
                  const p = playerList.find(pl => pl.id === pid);
                  return <li key={pid}>{p?.name || pid}</li>;
                })}
              </ul>
            </div>
          </div>
        );

      case 'create-tournament':
        return (
          <div className="container-responsive space-responsive">
            <TournamentCreation
              isProfessor={isProfessor}
              professorLevel={professorLevel}
              certificationNumber={certificationNumber}
              onRequestSubmit={handleTournamentRequestSubmit}
            />
          </div>
        );

      case 'admin-panel':
        return (
          <div className="container-responsive space-responsive">
            <AdminPanel
              isAdmin={isAdmin}
              isPokemonCompanyOfficial={isPokemonCompanyOfficial}
            />
          </div>
        );

      case 'analytics':
        return (
          <div className="container-responsive space-responsive space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Analytics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">15%</p>
                  <p className="text-sm text-gray-600">User Growth</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">2.4K</p>
                  <p className="text-sm text-gray-600">Content Engagement</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">1.2K</p>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">0.3%</p>
                  <p className="text-sm text-gray-600">Report Rate</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system-health':
        return (
          <div className="container-responsive space-responsive space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Database</span>
                  </div>
                  <p className="text-sm text-green-600">Response time: 45ms</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Cache</span>
                  </div>
                  <p className="text-sm text-green-600">Hit rate: 92%</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-yellow-800">Queue</span>
                  </div>
                  <p className="text-sm text-yellow-600">Length: 1,234</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Payment</span>
                  </div>
                  <p className="text-sm text-green-600">Success rate: 99.8%</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container-responsive flex items-center justify-between py-3">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">VGC Hub</h1>
              <p className="text-xs text-gray-500">
                {isPokemonCompanyOfficial ? 'Pokémon Company Official' :
                 isAdmin ? 'Administrator' :
                 'Professor'} View
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {isPokemonCompanyOfficial ? 'Pokémon Company Official' :
                 isAdmin ? 'Administrator' :
                 `${professorLevel} Professor`}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userSession.division} Division</p>
            </div>
            <button
              onClick={handleSettingsToggle}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={onGoHome}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Settings</h3>
              <button
                onClick={handleSettingsToggle}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Switch View</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleViewSwitch('competitor')}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Competitor View</p>
                        <p className="text-sm text-gray-600">Standard player interface</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                      Available
                    </div>
                  </button>

                  <button
                    onClick={() => handleViewSwitch('professor')}
                    className="w-full flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Professor View</p>
                        <p className="text-sm text-gray-600">Tournament creation & management</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm font-medium">
                      {isProfessor ? 'Current' : 'Available'}
                    </div>
                  </button>

                  <button
                    onClick={() => handleViewSwitch('admin')}
                    className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Admin View</p>
                        <p className="text-sm text-gray-600">Full system administration</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
                      {isAdmin ? 'Current' : 'Available'}
                    </div>
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Account Settings</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Profile Settings</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Privacy Settings</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-700">Notification Preferences</span>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20 pt-16">
        {renderActiveTab()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={isLoading}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-red-600' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-red-600' : 'text-gray-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminProfessorView; 