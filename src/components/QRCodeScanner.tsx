import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react';

interface QRCodeScannerProps {
  onScan: (qrData: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

interface ScanResult {
  success: boolean;
  message: string;
  data?: any;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/png');
  };

  const simulateQRScan = () => {
    // Simulate scanning a QR code for testing
    const mockQRData = `SEC_player123_tournament456_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    handleScanResult(mockQRData);
  };

  const handleScanResult = (qrData: string) => {
    setIsScanning(false);
    
    // Parse the QR data (assuming format: SEC_playerId_tournamentId_token)
    const parts = qrData.split('_');
    if (parts.length >= 4 && parts[0] === 'SEC') {
      const playerId = parts[1];
      const tournamentId = parts[2];
      const token = parts.slice(3).join('_');
      
      setScanResult({
        success: true,
        message: 'QR Code scanned successfully!',
        data: {
          playerId,
          tournamentId,
          token,
          scannedAt: new Date().toISOString()
        }
      });
      
      // Call the parent handler
      onScan(qrData);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setScanResult({
        success: false,
        message: 'Invalid QR code format'
      });
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    startScanning();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">QR Code Scanner</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {scanResult && (
          <div className={`border rounded-lg p-4 mb-4 ${
            scanResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {scanResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-sm ${
                scanResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {scanResult.message}
              </span>
            </div>
            {scanResult.data && (
              <div className="mt-2 text-xs text-gray-600">
                <p>Player ID: {scanResult.data.playerId}</p>
                <p>Tournament ID: {scanResult.data.tournamentId}</p>
                <p>Scanned: {new Date(scanResult.data.scannedAt).toLocaleTimeString()}</p>
              </div>
            )}
          </div>
        )}

        <div className="relative">
          {/* Camera View */}
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-blue-500 rounded-lg w-48 h-48 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-10 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex space-x-2">
            {!scanResult && (
              <>
                <button
                  onClick={simulateQRScan}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Test Scan</span>
                </button>
                <button
                  onClick={resetScanner}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </>
            )}
            {scanResult && (
              <button
                onClick={resetScanner}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Scan Another</span>
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-4 text-center">
          Point your camera at a QR code to scan it
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner; 