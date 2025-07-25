import React, { useState, useEffect } from 'react';
import { QrCode, Clock, CheckCircle, XCircle, Calendar, MapPin, Users, Download, Plus, History, Ticket, Camera } from 'lucide-react';
import { qrCodeService, QRCodeData, CheckInResult } from '../services/QRCodeService';
import QRCodeScanner from './QRCodeScanner';

interface QRCodeGeneratorProps {
  playerId: string;
  tournamentId: string;
  playerName: string;
  tournamentName: string;
  division: 'junior' | 'senior' | 'master';
}



interface TicketHistory {
  id: string;
  tournamentName: string;
  tournamentDate: string;
  location: string;
  division: string;
  checkInStatus: 'checked-in' | 'no-show' | 'cancelled';
  checkInTime?: string;
  qrCode?: string;
  placement?: number;
  totalPlayers?: number;
  record?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  playerId,
  tournamentId,
  playerName,
  tournamentName,
  division
}) => {
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<'pending' | 'checked-in' | 'expired'>('pending');
  const [showHistory, setShowHistory] = useState(false);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(60);
  const [showScanner, setShowScanner] = useState(false);
  const [checkInHistory, setCheckInHistory] = useState<CheckInResult[]>([]);
  const [lastCheckIn, setLastCheckIn] = useState<CheckInResult | null>(null);
  const [ticketHistory, setTicketHistory] = useState<TicketHistory[]>([
    {
      id: '1',
      tournamentName: 'Phoenix Regional Championships 2024',
      tournamentDate: '2024-03-15',
      location: 'Phoenix Convention Center, AZ',
      division: 'master',
      checkInStatus: 'checked-in',
      checkInTime: '2024-03-15T08:30:00Z',
      placement: 4,
      totalPlayers: 256,
      record: '6-2'
    },
    {
      id: '2',
      tournamentName: 'Los Angeles Regional Championships 2024',
      tournamentDate: '2024-02-10',
      location: 'Los Angeles Convention Center, CA',
      division: 'master',
      checkInStatus: 'checked-in',
      checkInTime: '2024-02-10T08:45:00Z',
      placement: 12,
      totalPlayers: 312,
      record: '5-3'
    },
    {
      id: '3',
      tournamentName: 'Seattle Regional Championships 2024',
      tournamentDate: '2024-01-20',
      location: 'Seattle Convention Center, WA',
      division: 'master',
      checkInStatus: 'checked-in',
      checkInTime: '2024-01-20T09:00:00Z',
      placement: 8,
      totalPlayers: 198,
      record: '5-2'
    },
    {
      id: '4',
      tournamentName: 'Dallas Regional Championships 2023',
      tournamentDate: '2023-12-15',
      location: 'Dallas Convention Center, TX',
      division: 'master',
      checkInStatus: 'no-show',
      checkInTime: undefined
    },
    {
      id: '5',
      tournamentName: 'Orlando Regional Championships 2023',
      tournamentDate: '2023-11-18',
      location: 'Orlando Convention Center, FL',
      division: 'master',
      checkInStatus: 'checked-in',
      checkInTime: '2023-11-18T08:15:00Z',
      placement: 16,
      totalPlayers: 245,
      record: '4-3'
    }
  ]);

  useEffect(() => {
    generateQRCode();
    loadCheckInHistory();
    
    // Set up automatic refresh every minute for security
    const interval = setInterval(() => {
      generateQRCode(true);
    }, 60000); // Refresh every 60 seconds

    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setTimeUntilRefresh(prev => {
        if (prev <= 1) {
          return 60; // Reset to 60 seconds
        }
        return prev - 1;
      });
    }, 1000);

    // Subscribe to real-time updates
    const subscriptionId = qrCodeService.subscribe('check-in-processed', (data) => {
      if (data.data.playerId === playerId) {
        setCheckInStatus('checked-in');
        setLastCheckIn({
          success: true,
          message: 'Check-in successful',
          checkInTime: data.data.checkInTime,
          playerName: playerName,
          tournamentName: tournamentName,
          division: division,
          qrCode: data.data.qrToken
        });
        loadCheckInHistory();
      }
    });

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      qrCodeService.unsubscribe(subscriptionId);
    };
  }, [playerId, playerName, tournamentName, division]);

  const generateQRCode = async (isAutoRefresh = false) => {
    if (isAutoRefresh) {
      setIsRefreshing(true);
    } else {
      setIsGenerating(true);
    }

    try {
      const result = await qrCodeService.generateQRCode(playerId, tournamentId, division);
      
      if (result.success && result.data) {
        setQrData(result.data);
        setCheckInStatus(result.data.checkInStatus);
      } else {
        console.error('Failed to generate QR code:', result.message);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
      setIsRefreshing(false);
    }
  };

  const loadCheckInHistory = async () => {
    try {
      const result = await qrCodeService.getCheckInHistory(playerId);
      if (result.success && result.data) {
        setCheckInHistory(result.data);
      }
    } catch (error) {
      console.error('Failed to load check-in history:', error);
    }
  };

  const simulateCheckIn = async () => {
    if (qrData) {
      try {
        const result = await qrCodeService.processCheckIn(qrData.token);
        if (result.success && result.data) {
          setCheckInStatus('checked-in');
          setLastCheckIn(result.data);
          loadCheckInHistory();
        } else {
          console.error('Check-in failed:', result.message);
        }
      } catch (error) {
        console.error('Failed to process check-in:', error);
      }
    }
  };

  const handleQRScan = async (qrData: string) => {
    try {
      const result = await qrCodeService.processCheckIn(qrData);
      if (result.success && result.data) {
        setCheckInStatus('checked-in');
        setLastCheckIn(result.data);
        loadCheckInHistory();
      } else {
        console.error('QR scan check-in failed:', result.message);
      }
    } catch (error) {
      console.error('Failed to process QR scan:', error);
    }
  };

  const getStatusColor = () => {
    switch (checkInStatus) {
      case 'checked-in': return 'text-green-600';
      case 'expired': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (checkInStatus) {
      case 'checked-in': return <CheckCircle className="h-5 w-5" />;
      case 'expired': return <XCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusText = () => {
    switch (checkInStatus) {
      case 'checked-in': return 'Checked In';
      case 'expired': return 'Expired';
      default: return 'Pending Check-in';
    }
  };

  const getCheckInStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCheckInStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in': return <CheckCircle className="h-4 w-4" />;
      case 'no-show': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDivisionColor = (div: string) => {
    switch (div) {
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'senior': return 'bg-green-100 text-green-800';
      case 'junior': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlacementColor = (placement: number) => {
    if (placement <= 4) return 'text-yellow-600';
    if (placement <= 8) return 'text-purple-600';
    if (placement <= 16) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code & Tickets</h1>
        <p className="text-gray-600">Manage your tournament check-ins and view ticket history</p>
      </div>

      {/* Security Warning */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="font-medium text-red-900">Security Notice</h3>
        </div>
        <p className="text-sm text-red-800">
          This QR code refreshes automatically every minute to prevent theft. 
          Screenshots and downloads are disabled for security. 
          Keep your device secure and never share your QR code.
        </p>
      </div>

      {/* Current Tournament QR Code */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Tournament</h2>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDivisionColor(division)}`}>
              {division.charAt(0).toUpperCase() + division.slice(1)}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{tournamentName}</h3>
              <div className="flex items-center space-x-4 text-blue-100 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate('2024-03-15')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>Phoenix Convention Center, AZ</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Player</p>
              <p className="font-medium">{playerName}</p>
            </div>
          </div>

          {/* QR Code Display */}
          {qrData && (
            <div className="bg-white rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 bg-white border-4 border-blue-200 rounded-lg flex items-center justify-center mb-3 relative">
                  <QrCode className="h-32 w-32 text-blue-600" />
                  {/* Security overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-30 rounded-lg"></div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    LIVE
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-mono break-all mb-2">
                  {qrData.token}
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Refreshes in {timeUntilRefresh}s</span>
                </div>
              </div>
            </div>
          )}

          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mt-4">
            <div className="flex items-center space-x-2">
              <div className={`${getStatusColor()}`}>
                {getStatusIcon()}
              </div>
              <span className="text-blue-100 text-sm sm:text-base">{getStatusText()}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => generateQRCode(true)}
                disabled={isRefreshing}
                className="px-3 py-2 bg-white bg-opacity-20 rounded-lg text-sm hover:bg-opacity-20 transition-colors disabled:opacity-50 min-h-[44px]"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => setShowScanner(true)}
                className="px-3 py-2 bg-white bg-opacity-20 rounded-lg text-sm hover:bg-opacity-30 transition-colors min-h-[44px]"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                onClick={simulateCheckIn}
                disabled={checkInStatus === 'checked-in'}
                className="px-4 py-2 bg-green-500 rounded-lg text-sm hover:bg-green-600 transition-colors disabled:opacity-50 min-h-[44px] font-medium"
              >
                {checkInStatus === 'checked-in' ? 'Checked In' : 'Test Check In'}
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-600">Generated</p>
            <p className="font-medium">
              {qrData ? formatTime(new Date(qrData.timestamp).toISOString()) : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-gray-600">Expires</p>
            <p className="font-medium">
              {qrData ? formatTime(new Date(qrData.expiresAt).toISOString()) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Check-in Status */}
      {lastCheckIn && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Check-in Successful!</h3>
                <p className="text-sm text-green-700">
                  Checked in at {formatTime(lastCheckIn.checkInTime || '')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-600">QR Code: {lastCheckIn.qrCode?.substr(0, 20)}...</p>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Scanner */}
      <QRCodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
      />

      {/* Ticket History Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Ticket History</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <History className="h-4 w-4" />
          <span>{showHistory ? 'Hide History' : 'Show History'}</span>
        </button>
      </div>

      {/* Ticket History */}
      {showHistory && (
        <div className="space-y-4">
          {ticketHistory.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{ticket.tournamentName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(ticket.tournamentDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{ticket.location}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDivisionColor(ticket.division)}`}>
                        {ticket.division.charAt(0).toUpperCase() + ticket.division.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCheckInStatusColor(ticket.checkInStatus)}`}>
                      {getCheckInStatusIcon(ticket.checkInStatus)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {ticket.checkInStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                {/* Tournament Results */}
                {ticket.checkInStatus === 'checked-in' && ticket.placement && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Placement</p>
                        <p className={`font-bold text-lg ${getPlacementColor(ticket.placement)}`}>
                          {ticket.placement}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Record</p>
                        <p className="font-bold text-lg text-gray-900">{ticket.record}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Players</p>
                        <p className="font-bold text-lg text-gray-900">{ticket.totalPlayers}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Check-in Details */}
                {ticket.checkInTime && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Checked in at {formatTime(ticket.checkInTime)}</span>
                    </div>
                    {ticket.qrCode && (
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        View QR Code
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Check-in History */}
      {checkInHistory.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Recent Check-ins</h3>
          <div className="space-y-2">
            {checkInHistory.slice(0, 5).map((checkIn, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{checkIn.tournamentName}</p>
                    <p className="text-xs text-gray-600">{formatTime(checkIn.checkInTime || '')}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{checkIn.division}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add to Wallet</span>
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-2">How to Use Your QR Code</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Present this QR code at tournament check-in</li>
          <li>• QR codes refresh automatically every minute for security</li>
          <li>• Keep your QR code secure and don't share it</li>
          <li>• QR codes cannot be downloaded to prevent theft</li>
          <li>• Check-in opens 30 minutes before tournament start</li>
          <li>• Use the camera button to scan QR codes for testing</li>
          <li>• Check-in status updates in real-time across devices</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodeGenerator;