import React, { useState, useEffect } from 'react';
import { QrCode, Clock, CheckCircle, XCircle, Calendar, MapPin, Users, Plus, History, Ticket, Wallet, Camera } from 'lucide-react';
import { UserSession } from '../types';
import { qrCodeService } from '../services/QRCodeService';
import QRCodeScanner from './QRCodeScanner';

interface TicketsPageProps {
  userSession: UserSession;
}

interface TicketHistory {
  id: string;
  tournamentName: string;
  tournamentDate: string;
  location: string;
  division: string;
  checkInStatus: 'checked-in' | 'no-show' | 'cancelled' | 'pending';
  checkInTime?: string;
  qrCode?: string;
  placement?: number;
  totalPlayers?: number;
  record?: string;
}

const generateDynamicToken = (ticketId: string) => {
  return `QR_${ticketId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const TicketsPage: React.FC<TicketsPageProps> = ({ userSession }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<any>(null);
  const [ticketHistory, setTicketHistory] = useState<TicketHistory[]>([
    {
      id: 'future-1',
      tournamentName: 'San Diego Regional Championships 2025',
      tournamentDate: '2025-01-25',
      location: 'San Diego Convention Center, CA',
      division: 'master',
      checkInStatus: 'pending',
      checkInTime: undefined,
      qrCode: undefined
    },
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

  // Generate a dynamic QR code for each ticket on each render
  const [dynamicTokens, setDynamicTokens] = useState<{ [id: string]: string }>({});
  useEffect(() => {
    const tokens: { [id: string]: string } = {};
    ticketHistory.forEach(ticket => {
      tokens[ticket.id] = generateDynamicToken(ticket.id);
    });
    setDynamicTokens(tokens);

    // Subscribe to real-time check-in updates
    const subscriptionId = qrCodeService.subscribe('check-in-processed', (data) => {
      setLastCheckIn(data.data);
      // Update ticket history if needed
      setTicketHistory(prev => prev.map(ticket => {
        if (ticket.id === data.data.tournamentId) {
          return {
            ...ticket,
            checkInStatus: 'checked-in' as const,
            checkInTime: data.data.checkInTime
          };
        }
        return ticket;
      }));
    });

    return () => {
      qrCodeService.unsubscribe(subscriptionId);
    };
  }, [ticketHistory]);

  const getDivisionColor = (div: string) => {
    switch (div) {
      case 'master': return 'bg-purple-100 text-purple-800';
      case 'senior': return 'bg-green-100 text-green-800';
      case 'junior': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCheckInStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in': return 'bg-green-100 text-green-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCheckInStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in': return <CheckCircle className="h-4 w-4" />;
      case 'no-show': return <XCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
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

  // Simulate wallet add (mock)
  const handleAddToWallet = (ticket: TicketHistory, type: 'google' | 'apple') => {
    alert(`(Demo) Added ticket for ${ticket.tournamentName} to ${type === 'google' ? 'Google' : 'Apple'} Wallet!`);
  };

  const handleQRScan = async (qrData: string) => {
    try {
      const result = await qrCodeService.processCheckIn(qrData);
      if (result.success && result.data) {
        setLastCheckIn(result.data);
        // Update ticket history
        setTicketHistory(prev => prev.map(ticket => {
          if (ticket.id === result.data.tournamentId) {
            return {
              ...ticket,
              checkInStatus: 'checked-in' as const,
              checkInTime: result.data.checkInTime
            };
          }
          return ticket;
        }));
      } else {
        console.error('QR scan check-in failed:', result.message);
      }
    } catch (error) {
      console.error('Failed to process QR scan:', error);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tickets</h1>
        <p className="text-gray-600">View your current and past tournament tickets. Each ticket has a dynamic QR code for secure check-in.</p>
        {/* Remove the Scan QR Code button and QRCodeScanner for competitors */}
        {/* Only show QR code scanner if userSession.isAdmin or userSession.isStaff */}
        {/* Only display QR codes for tickets with status 'checked-in' or 'confirmed' */}
      </div>

      {/* Real-time Check-in Status */}
      {lastCheckIn && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
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
      {userSession.isAdmin || userSession.isStaff ? (
        <QRCodeScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScan={handleQRScan}
        />
      ) : null}

      {/* Tickets List */}
      <div className="space-y-6">
        {ticketHistory.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-xl p-6 border border-gray-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{ticket.tournamentName}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(ticket.tournamentDate)}</span>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{ticket.location}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDivisionColor(ticket.division)}`}>{ticket.division.charAt(0).toUpperCase() + ticket.division.slice(1)}</span>
                </div>
              </div>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getCheckInStatusColor(ticket.checkInStatus)}`}>{getCheckInStatusIcon(ticket.checkInStatus)}<span>{ticket.checkInStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span></div>
            </div>

            {/* Dynamic QR Code */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 bg-white border-4 border-blue-200 rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="h-28 w-28 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 font-mono break-all">{dynamicTokens[ticket.id]}</p>
              </div>
              <div className="flex-1 space-y-2">
                {ticket.checkInStatus === 'pending' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">Status:</span>
                      <span className="font-bold text-blue-700">Not Checked In</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-900">Event Date:</span>
                      <span className="font-bold text-gray-700">{formatDate(ticket.tournamentDate)}</span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Check-in Instructions:</strong> Present this QR code at the tournament venue on the day of the event. Check-in opens 30 minutes before the tournament starts.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {ticket.placement && (
                      <div className="flex items-center gap-2 text-sm">
                        <Ticket className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-gray-900">Placement:</span>
                        <span className="font-bold text-yellow-700">#{ticket.placement}</span>
                      </div>
                    )}
                    {ticket.record && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-900">Record:</span>
                        <span className="font-bold text-blue-700">{ticket.record}</span>
                      </div>
                    )}
                    {ticket.totalPlayers && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-gray-900">Players:</span>
                        <span className="font-bold text-green-700">{ticket.totalPlayers}</span>
                      </div>
                    )}
                    {ticket.checkInTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Checked in at:</span>
                        <span className="font-bold text-gray-700">{formatTime(ticket.checkInTime)}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex gap-2 mt-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors" onClick={() => handleAddToWallet(ticket, 'google')}>
                    <Wallet className="h-4 w-4" />
                    <span>Add to Google Wallet</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => handleAddToWallet(ticket, 'apple')}>
                    <Wallet className="h-4 w-4" />
                    <span>Add to Apple Wallet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-8">
        <h3 className="font-medium text-blue-900 mb-2">How to Use Your Tickets</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Present the QR code at tournament check-in</li>
          <li>• QR codes refresh every time you open this page</li>
          <li>• Keep your QR code secure and do not share it</li>
          <li>• Add tickets to your mobile wallet for easy access</li>
        </ul>
      </div>
    </div>
  );
};

export default TicketsPage; 