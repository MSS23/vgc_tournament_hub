import React, { useState, useEffect } from 'react';
import { QrCode, Camera, CheckCircle, XCircle, Users, Clock, RefreshCw } from 'lucide-react';
import { qrCodeService, QRCodeData } from '../services/QRCodeService';
import QRCodeScanner from './QRCodeScanner';

interface QRCodeTestPageProps {
  userSession: any;
}

const QRCodeTestPage: React.FC<QRCodeTestPageProps> = ({ userSession }) => {
  // Restrict access to admin/staff only
  if (!userSession?.isAdmin && !userSession?.isStaff) {
    return <div className="text-center py-12 text-red-600 font-semibold">Access Denied: This page is for staff/admin only.</div>;
  }

  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [checkInHistory, setCheckInHistory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateTestQRCode();
    loadStatistics();
    
    // Subscribe to real-time updates
    const subscriptionId = qrCodeService.subscribe('check-in-processed', (data) => {
      console.log('Real-time check-in update:', data);
      loadCheckInHistory();
      loadStatistics();
    });

    return () => {
      qrCodeService.unsubscribe(subscriptionId);
    };
  }, []);

  const generateTestQRCode = async () => {
    setIsGenerating(true);
    try {
      const result = await qrCodeService.generateQRCode(
        'test-player-123',
        'test-tournament-456',
        'master'
      );
      
      if (result.success && result.data) {
        setQrData(result.data);
      }
    } catch (error) {
      console.error('Failed to generate test QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadCheckInHistory = async () => {
    try {
      const result = await qrCodeService.getCheckInHistory('test-player-123');
      if (result.success && result.data) {
        setCheckInHistory(result.data);
      }
    } catch (error) {
      console.error('Failed to load check-in history:', error);
    }
  };

  const loadStatistics = () => {
    const stats = qrCodeService.getStatistics();
    setStatistics(stats);
  };

  const handleQRScan = async (qrData: string) => {
    try {
      const result = await qrCodeService.processCheckIn(qrData);
      if (result.success && result.data) {
        console.log('Check-in successful:', result.data);
        loadCheckInHistory();
        loadStatistics();
      } else {
        console.error('Check-in failed:', result.message);
      }
    } catch (error) {
      console.error('Failed to process QR scan:', error);
    }
  };

  const simulateCheckIn = async () => {
    if (qrData) {
      try {
        const result = await qrCodeService.processCheckIn(qrData.token);
        if (result.success && result.data) {
          console.log('Simulated check-in successful:', result.data);
          loadCheckInHistory();
          loadStatistics();
        }
      } catch (error) {
        console.error('Failed to simulate check-in:', error);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Test Page</h1>
        <p className="text-gray-600">Test the QR code functionality with real-time updates across devices</p>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">System Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{statistics.activeQRCodes}</p>
              <p className="text-sm text-gray-600">Active QR Codes</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{statistics.checkedInCount}</p>
              <p className="text-sm text-gray-600">Checked In</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{statistics.expiredCount}</p>
              <p className="text-sm text-gray-600">Expired</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{statistics.totalCheckIns}</p>
              <p className="text-sm text-gray-600">Total Check-ins</p>
            </div>
          </div>
        </div>
      )}

      {/* Current QR Code */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Test QR Code</h2>
          <button
            onClick={generateTestQRCode}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate New'}</span>
          </button>
        </div>

        {qrData && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">Test Tournament</h3>
                <p className="text-blue-100">Test Player • Master Division</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Status</p>
                <p className="font-medium">{qrData.checkInStatus}</p>
              </div>
            </div>

            {/* QR Code Display */}
            <div className="bg-white rounded-lg p-4 flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-48 h-48 bg-white border-4 border-blue-200 rounded-lg flex items-center justify-center mb-3 relative">
                  <QrCode className="h-32 w-32 text-blue-600" />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    TEST
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-mono break-all">
                  {qrData.token}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowScanner(true)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Scan QR Code</span>
              </button>
              <button
                onClick={simulateCheckIn}
                disabled={qrData.checkInStatus === 'checked-in'}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Simulate Check-in</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Check-in History */}
      {checkInHistory.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Check-in History</h3>
          <div className="space-y-2">
            {checkInHistory.map((checkIn, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{checkIn.tournamentName}</p>
                    <p className="text-sm text-gray-600">{checkIn.playerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{checkIn.division}</p>
                  <p className="text-xs text-gray-600">{formatTime(checkIn.checkInTime || '')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-2">How to Test</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Generate a new QR code using the button above</li>
          <li>• Open this page on multiple devices/browsers</li>
          <li>• Use the "Scan QR Code" button to simulate scanning</li>
          <li>• Use the "Simulate Check-in" button for direct testing</li>
          <li>• Watch real-time updates across all devices</li>
          <li>• Check the statistics to see system activity</li>
        </ul>
      </div>

      {/* QR Code Scanner */}
      <QRCodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleQRScan}
      />
    </div>
  );
};

export default QRCodeTestPage; 