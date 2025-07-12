import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Ticket, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  TrendingUp, 
  Activity,
  Shield,
  Zap,
  BarChart3,
  RefreshCw,
  Gift,
  Target,
  Award,
  Users2
} from 'lucide-react';
import { 
  Tournament, 
  RegistrationAttempt, 
  RegistrationQueue, 
  ScalableTournamentConfig,
  SystemHealth,
  RealTimeStats,
  LotterySettings,
  Player
} from '../types';
import { RegistrationService } from '../services/RegistrationService';
import TournamentAttendees from './TournamentAttendees';

interface ScalableTournamentRegistrationProps {
  tournament: Tournament;
  userDivision: 'junior' | 'senior' | 'master';
  onRegister: (tournamentId: string) => void;
  isAdmin?: boolean; // Add admin flag to control what's shown
}

const ScalableTournamentRegistration: React.FC<ScalableTournamentRegistrationProps> = ({
  tournament,
  userDivision,
  onRegister,
  isAdmin = false
}) => {
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'registering' | 'success' | 'failed' | 'lottery_entered' | 'lottery_winner' | 'lottery_loser'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(null);
  const [lotteryInProgress, setLotteryInProgress] = useState(false);
  const [lotteryEntries, setLotteryEntries] = useState(0);
  const [isLotteryWinner, setIsLotteryWinner] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);

  // Mock attendees data - in a real app, this would come from the backend
  const mockAttendees: Player[] = [
    {
      id: 'p1',
      name: 'Alex Rodriguez',
      playerId: 'AR2024',
      region: 'North America',
      division: 'master',
      championships: 3,
      winRate: 78,
      rating: 2100,
      tournaments: [],
      isVerified: true,
      privacySettings: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true
      },
      // Adding achievements as a custom property for display purposes
      achievements: ['Worlds Champion 2023', 'North America Champion 2022', 'Regional Champion x5']
    } as Player & { achievements: string[] },
    {
      id: 'p2',
      name: 'Sarah Chen',
      playerId: 'SC2024',
      region: 'North America',
      division: 'master',
      championships: 2,
      winRate: 72,
      rating: 1950,
      tournaments: [],
      isVerified: true,
      privacySettings: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true
      },
      achievements: ['Regional Champion x3', 'Top 8 Worlds 2023', 'Meta Expert']
    } as Player & { achievements: string[] },
    {
      id: 'p3',
      name: 'Marcus Johnson',
      playerId: 'MJ2024',
      region: 'North America',
      division: 'master',
      championships: 1,
      winRate: 68,
      rating: 1850,
      tournaments: [],
      isVerified: true,
      privacySettings: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true
      },
      achievements: ['Regional Champion 2023', 'Community Leader']
    } as Player & { achievements: string[] },
    {
      id: 'p4',
      name: 'Emily Davis',
      playerId: 'ED2024',
      region: 'North America',
      division: 'senior',
      championships: 0,
      winRate: 65,
      rating: 1750,
      tournaments: [],
      isVerified: false,
      privacySettings: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true
      },
      achievements: ['Top 16 Regionals 2023', 'Rising Star']
    } as Player & { achievements: string[] },
    {
      id: 'p5',
      name: 'David Kim',
      playerId: 'DK2024',
      region: 'North America',
      division: 'master',
      championships: 0,
      winRate: 62,
      rating: 1700,
      tournaments: [],
      isVerified: false,
      privacySettings: {
        profileVisibility: 'public',
        allowTeamReports: true,
        showTournamentHistory: true,
        allowQRCodeGeneration: true
      },
      achievements: ['Top 32 Regionals 2023']
    } as Player & { achievements: string[] }
  ];

  const registrationService = RegistrationService.getInstance();

  useEffect(() => {
    // Initialize system health and stats
    setSystemHealth(registrationService.getSystemHealth());
    setRealTimeStats(registrationService.getRealTimeStats(tournament.id));
    setLotteryEntries(registrationService.getLotteryEntries(tournament.id));
    setLotteryInProgress(registrationService.isLotteryInProgress(tournament.id));
    setIsLotteryWinner(registrationService.isLotteryWinner(tournament.id, 'user-123')); // Mock user ID

    // Update stats every 5 seconds
    const interval = setInterval(() => {
      setSystemHealth(registrationService.getSystemHealth());
      setRealTimeStats(registrationService.getRealTimeStats(tournament.id));
      setLotteryEntries(registrationService.getLotteryEntries(tournament.id));
      setLotteryInProgress(registrationService.isLotteryInProgress(tournament.id));
      setIsLotteryWinner(registrationService.isLotteryWinner(tournament.id, 'user-123'));
    }, 5000);

    return () => clearInterval(interval);
  }, [tournament.id]);

  const handleRegister = async () => {
    setRegistrationStatus('registering');
    setErrorMessage('');

    try {
      const config: ScalableTournamentConfig = {
        id: `config-${tournament.id}`,
        tournamentId: tournament.id,
        maxConcurrentRegistrations: 1000,
        rateLimitPerUser: 5,
        rateLimitPerIP: 10,
        queueEnabled: true,
        maxQueueSize: 10000,
        queueTimeoutMinutes: 30,
        useReadReplicas: true,
        cacheEnabled: true,
        cacheTTL: 300,
        enableRealTimeMonitoring: true,
        alertThresholds: {
          queueLength: 5000,
          errorRate: 0.05,
          responseTime: 2000,
          registrationRate: 100
        },
        fallbackMode: 'graceful_degradation',
        emergencyContact: 'admin@vgchub.com'
      };

      const result = await registrationService.registerForTournament('user-123', tournament.id, config);

      switch (result.status) {
        case 'success':
          setRegistrationStatus('success');
          onRegister(tournament.id);
          break;
        case 'lottery_entered':
          setRegistrationStatus('lottery_entered');
          break;
        case 'failed':
          setRegistrationStatus('failed');
          setErrorMessage(result.errorMessage || 'Registration failed');
          break;
        default:
          setRegistrationStatus('failed');
          setErrorMessage('Unexpected registration status');
      }
    } catch (error) {
      setRegistrationStatus('failed');
      setErrorMessage('An error occurred during registration');
    }
  };

  const getRegistrationStatus = () => {
    if (tournament.status === 'completed') return 'completed';
    if (tournament.status === 'ongoing') return 'ongoing';
    if (tournament.currentRegistrations >= tournament.maxCapacity) return 'full';
    if (shouldShowLotteryNotice()) return 'lottery';
    return 'open';
  };

  const getStatusColor = () => {
    const status = getRegistrationStatus();
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'lottery': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-red-100 text-red-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    const status = getRegistrationStatus();
    switch (status) {
      case 'open': return 'Registration Open';
      case 'lottery': return 'Lottery Registration';
      case 'full': return 'Registration Full';
      case 'ongoing': return 'Tournament in Progress';
      case 'completed': return 'Tournament Completed';
      default: return 'Unknown Status';
    }
  };

  const shouldShowLotteryNotice = () => {
    return tournament.currentRegistrations >= tournament.maxCapacity * 0.7;
  };

  const getLotteryChance = () => {
    if (lotteryEntries === 0) return 100;
    const chance = (tournament.maxCapacity / lotteryEntries) * 100;
    return Math.min(chance, 100);
  };

  const getCapacityPercentage = () => {
    return Math.min(100, Math.round((tournament.currentRegistrations / tournament.maxCapacity) * 100));
  };

  const renderLotteryStatus = () => {
    if (lotteryInProgress) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
            <span className="text-yellow-800 font-medium">Lottery selection in progress...</span>
          </div>
          <p className="text-yellow-700 text-sm mt-2">
            The queue has been paused and winners are being randomly selected. Please wait.
          </p>
        </div>
      );
    }

    if (isLotteryWinner) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">🎉</span>
            <span className="text-green-800 font-medium">Congratulations! You're a lottery winner!</span>
          </div>
          <p className="text-green-700 text-sm mt-2">
            You can now proceed to purchase your ticket for this tournament.
          </p>
        </div>
      );
    }

    if (lotteryEntries > 0 && !lotteryInProgress) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-800 font-medium">Lottery Registration Active</span>
              <p className="text-blue-700 text-sm mt-1">
                {lotteryEntries} entries • {getLotteryChance().toFixed(1)}% chance of selection
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">{lotteryEntries}</span>
              <p className="text-xs text-blue-600">Entries</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderRegistrationButton = () => {
    if (registrationStatus === 'registering') {
      return (
        <button
          disabled
          className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium"
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        </button>
      );
    }

    if (registrationStatus === 'success' || isLotteryWinner) {
      return (
        <button
          onClick={() => onRegister(tournament.id)}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Purchase Ticket
        </button>
      );
    }

    if (registrationStatus === 'lottery_entered') {
      return (
        <button
          disabled
          className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-medium"
        >
          Entered Lottery - Waiting for Selection
        </button>
      );
    }

    if (registrationStatus === 'lottery_loser') {
      return (
        <button
          disabled
          className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium"
        >
          Not Selected - Better Luck Next Time
        </button>
      );
    }

    return (
      <button
        onClick={handleRegister}
        disabled={getRegistrationStatus() !== 'open' && getRegistrationStatus() !== 'lottery'}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          getRegistrationStatus() === 'open' || getRegistrationStatus() === 'lottery'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-400 text-white cursor-not-allowed'
        }`}
      >
        {getRegistrationStatus() === 'lottery' ? 'Enter Lottery' : 'Register Now'}
      </button>
    );
  };

  return (
    <div className="mobile-padding space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-wrap">{tournament.name}</h2>
        <p className="text-blue-100 mb-4 text-wrap">{tournament.location}</p>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div 
            className="cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors"
            onClick={() => setShowAttendees(true)}
          >
            <p className="text-xl sm:text-2xl font-bold">{tournament.currentRegistrations}</p>
            <p className="text-xs sm:text-sm text-blue-100">Registered</p>
            <p className="text-xs text-blue-200 mt-1 hidden sm:block">Click to view attendees</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold">{tournament.maxCapacity}</p>
            <p className="text-xs sm:text-sm text-blue-100">Capacity</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold">{getCapacityPercentage()}%</p>
            <p className="text-xs sm:text-sm text-blue-100">Full</p>
          </div>
        </div>
      </div>

      {/* Lottery Status */}
      {renderLotteryStatus()}

      {/* Registration Status */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Registration Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} self-start sm:self-auto`}>
            {getStatusText()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Capacity</span>
            <span>{tournament.currentRegistrations} / {tournament.maxCapacity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                getCapacityPercentage() >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${getCapacityPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Registration Button */}
        {renderRegistrationButton()}

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm text-wrap">{errorMessage}</p>
          </div>
        )}
      </div>

      {/* System Health - Admin Only */}
      {isAdmin && systemHealth && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{systemHealth.metrics.registrationsPerSecond}</p>
              <p className="text-xs sm:text-sm text-gray-600">Registrations/sec</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{systemHealth.metrics.averageResponseTime}ms</p>
              <p className="text-xs sm:text-sm text-gray-600">Avg Response</p>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Stats - Admin Only */}
      {isAdmin && realTimeStats && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Queue Length:</span>
              <span className="font-medium text-sm">{realTimeStats.queueLength}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Success Rate:</span>
              <span className="font-medium text-sm">{(realTimeStats.successRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Error Rate:</span>
              <span className="font-medium text-sm">{(realTimeStats.errorRate * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Attendees Modal */}
      {showAttendees && (
        <TournamentAttendees
          tournament={tournament}
          attendees={mockAttendees}
          isOpen={showAttendees}
          onClose={() => setShowAttendees(false)}
          onPlayerSelect={(playerId) => {
            console.log('Selected player:', playerId);
            // In a real app, this would navigate to the player's profile
            setShowAttendees(false);
          }}
        />
      )}
    </div>
  );
};

// Scalable configuration for high-traffic events
const scalableConfig: ScalableTournamentConfig = {
  id: 'config_default',
  tournamentId: 'default',
  maxConcurrentRegistrations: 1000,
  rateLimitPerUser: 5, // 5 attempts per minute
  rateLimitPerIP: 10, // 10 attempts per minute per IP
  queueEnabled: true,
  maxQueueSize: 10000,
  queueTimeoutMinutes: 30,
  useReadReplicas: true,
  cacheEnabled: true,
  cacheTTL: 300, // 5 minutes
  enableRealTimeMonitoring: true,
  alertThresholds: {
    queueLength: 5000,
    errorRate: 0.05,
    responseTime: 2000,
    registrationRate: 100
  },
  fallbackMode: 'graceful_degradation',
  emergencyContact: 'admin@vgchub.com'
};

export default ScalableTournamentRegistration; 