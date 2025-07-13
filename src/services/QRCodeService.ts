import { ApiResponse } from '../types';

export interface QRCodeData {
  token: string;
  playerId: string;
  tournamentId: string;
  division: string;
  timestamp: number;
  expiresAt: number;
  checkInStatus: 'pending' | 'checked-in' | 'expired';
  refreshCount: number;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  checkInTime?: string;
  playerName?: string;
  tournamentName?: string;
  division?: string;
  qrCode?: string;
}

export interface QRCodeValidationResult {
  isValid: boolean;
  isExpired: boolean;
  playerId?: string;
  tournamentId?: string;
  division?: string;
  message: string;
}

export class QRCodeService {
  private static instance: QRCodeService;
  private activeQRCodes: Map<string, QRCodeData> = new Map();
  private checkInHistory: Map<string, CheckInResult[]> = new Map();
  private subscribers: Map<string, (data: any) => void> = new Map();

  private constructor() {
    // Initialize with some mock data
    this.initializeMockData();
  }

  static getInstance(): QRCodeService {
    if (!QRCodeService.instance) {
      QRCodeService.instance = new QRCodeService();
    }
    return QRCodeService.instance;
  }

  private initializeMockData(): void {
    // Add some mock QR codes for testing
    const mockQRData: QRCodeData = {
      token: 'SEC_player123_tournament456_mock123',
      playerId: 'player123',
      tournamentId: 'tournament456',
      division: 'master',
      timestamp: Date.now(),
      expiresAt: Date.now() + (60 * 1000), // 1 minute from now
      checkInStatus: 'pending',
      refreshCount: 0
    };
    
    this.activeQRCodes.set(mockQRData.token, mockQRData);
  }

  async generateQRCode(
    playerId: string,
    tournamentId: string,
    division: string
  ): Promise<ApiResponse<QRCodeData>> {
    try {
      const now = Date.now();
      const expiresAt = now + (60 * 1000); // 1 minute from now

      // Generate a secure token
      const randomBytes = Math.random().toString(36).substr(2, 12);
      const timeHash = btoa(now.toString()).substr(0, 8);
      const securityToken = `${randomBytes}_${timeHash}_${Math.floor(Math.random() * 10000)}`;

      const qrData: QRCodeData = {
        token: `SEC_${playerId}_${tournamentId}_${securityToken}`,
        playerId,
        tournamentId,
        division,
        timestamp: now,
        expiresAt,
        checkInStatus: 'pending',
        refreshCount: 0
      };

      // Store the QR code
      this.activeQRCodes.set(qrData.token, qrData);

      return {
        success: true,
        data: qrData,
        message: 'QR code generated successfully',
        timestamp: new Date().toISOString(),
        requestId: this.generateId()
      };
    } catch (error) {
      return this.handleError('Failed to generate QR code', error);
    }
  }

  async validateQRCode(qrToken: string): Promise<ApiResponse<QRCodeValidationResult>> {
    try {
      const qrData = this.activeQRCodes.get(qrToken);
      
      if (!qrData) {
        return {
          success: false,
          data: {
            isValid: false,
            isExpired: false,
            message: 'Invalid QR code token'
          },
          message: 'QR code not found',
          timestamp: new Date().toISOString(),
          requestId: this.generateId()
        };
      }

      const now = Date.now();
      const isExpired = now > qrData.expiresAt;

      if (isExpired) {
        return {
          success: false,
          data: {
            isValid: false,
            isExpired: true,
            message: 'QR code has expired'
          },
          message: 'QR code expired',
          timestamp: new Date().toISOString(),
          requestId: this.generateId()
        };
      }

      return {
        success: true,
        data: {
          isValid: true,
          isExpired: false,
          playerId: qrData.playerId,
          tournamentId: qrData.tournamentId,
          division: qrData.division,
          message: 'QR code is valid'
        },
        message: 'QR code validated successfully',
        timestamp: new Date().toISOString(),
        requestId: this.generateId()
      };
    } catch (error) {
      return this.handleError('Failed to validate QR code', error);
    }
  }

  async processCheckIn(qrToken: string, scannedBy?: string): Promise<ApiResponse<CheckInResult>> {
    try {
      // First validate the QR code
      const validationResult = await this.validateQRCode(qrToken);
      
      if (!validationResult.success || !validationResult.data?.isValid) {
        return {
          success: false,
          data: {
            success: false,
            message: validationResult.data?.message || 'Invalid QR code'
          },
          message: 'Check-in failed',
          timestamp: new Date().toISOString(),
          requestId: this.generateId()
        };
      }

      const qrData = this.activeQRCodes.get(qrToken);
      if (!qrData) {
        return {
          success: false,
          data: {
            success: false,
            message: 'QR code data not found'
          },
          message: 'Check-in failed',
          timestamp: new Date().toISOString(),
          requestId: this.generateId()
        };
      }

      // Check if already checked in
      if (qrData.checkInStatus === 'checked-in') {
        return {
          success: false,
          data: {
            success: false,
            message: 'Player already checked in'
          },
          message: 'Already checked in',
          timestamp: new Date().toISOString(),
          requestId: this.generateId()
        };
      }

      // Process the check-in
      const checkInTime = new Date().toISOString();
      qrData.checkInStatus = 'checked-in';
      
      // Update the QR code data
      this.activeQRCodes.set(qrToken, qrData);

      // Store check-in history
      const checkInResult: CheckInResult = {
        success: true,
        message: 'Check-in successful',
        checkInTime,
        playerName: `Player ${qrData.playerId}`, // In real app, fetch from user service
        tournamentName: `Tournament ${qrData.tournamentId}`, // In real app, fetch from tournament service
        division: qrData.division,
        qrCode: qrToken
      };

      if (!this.checkInHistory.has(qrData.playerId)) {
        this.checkInHistory.set(qrData.playerId, []);
      }
      this.checkInHistory.get(qrData.playerId)!.push(checkInResult);

      // Notify subscribers
      this.notifySubscribers('check-in-processed', {
        playerId: qrData.playerId,
        tournamentId: qrData.tournamentId,
        checkInTime,
        qrToken
      });

      return {
        success: true,
        data: checkInResult,
        message: 'Check-in processed successfully',
        timestamp: new Date().toISOString(),
        requestId: this.generateId()
      };
    } catch (error) {
      return this.handleError('Failed to process check-in', error);
    }
  }

  async getQRCodeStatus(qrToken: string): Promise<ApiResponse<QRCodeData | null>> {
    try {
      const qrData = this.activeQRCodes.get(qrToken);
      
      return {
        success: true,
        data: qrData || null,
        message: qrData ? 'QR code found' : 'QR code not found',
        timestamp: new Date().toISOString(),
        requestId: this.generateId()
      };
    } catch (error) {
      return this.handleError('Failed to get QR code status', error);
    }
  }

  async getCheckInHistory(playerId: string): Promise<ApiResponse<CheckInResult[]>> {
    try {
      const history = this.checkInHistory.get(playerId) || [];
      
      return {
        success: true,
        data: history,
        message: 'Check-in history retrieved',
        timestamp: new Date().toISOString(),
        requestId: this.generateId()
      };
    } catch (error) {
      return this.handleError('Failed to get check-in history', error);
    }
  }

  async refreshQRCode(qrToken: string): Promise<ApiResponse<QRCodeData>> {
    try {
      const existingQR = this.activeQRCodes.get(qrToken);
      if (!existingQR) {
        return {
          success: false,
          data: undefined,
          message: 'QR code not found',
          timestamp: new Date().toISOString(),
          requestId: this.generateId()
        };
      }

      // Generate new QR code with same player/tournament but new token
      const result = await this.generateQRCode(
        existingQR.playerId,
        existingQR.tournamentId,
        existingQR.division
      );

      if (result.success && result.data) {
        // Remove old QR code
        this.activeQRCodes.delete(qrToken);
        
        // Update refresh count
        result.data.refreshCount = existingQR.refreshCount + 1;
        this.activeQRCodes.set(result.data.token, result.data);
      }

      return result;
    } catch (error) {
      return this.handleError('Failed to refresh QR code', error);
    }
  }

  async expireQRCode(qrToken: string): Promise<ApiResponse<boolean>> {
    try {
      const qrData = this.activeQRCodes.get(qrToken);
      if (qrData) {
        qrData.checkInStatus = 'expired';
        this.activeQRCodes.set(qrToken, qrData);
        
        // Notify subscribers
        this.notifySubscribers('qr-code-expired', {
          playerId: qrData.playerId,
          tournamentId: qrData.tournamentId,
          qrToken
        });
      }

      return {
        success: true,
        data: true,
        message: 'QR code expired',
        timestamp: new Date().toISOString(),
        requestId: this.generateId()
      };
    } catch (error) {
      return this.handleError('Failed to expire QR code', error);
    }
  }

  // Subscription methods for real-time updates
  subscribe(event: string, callback: (data: any) => void): string {
    const subscriptionId = this.generateId();
    this.subscribers.set(subscriptionId, callback);
    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): boolean {
    return this.subscribers.delete(subscriptionId);
  }

  private notifySubscribers(event: string, data: any): void {
    this.subscribers.forEach(callback => {
      try {
        callback({ event, data, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  // Cleanup expired QR codes
  cleanupExpiredQRCodes(): void {
    const now = Date.now();
    for (const [token, qrData] of this.activeQRCodes.entries()) {
      if (now > qrData.expiresAt && qrData.checkInStatus === 'pending') {
        this.expireQRCode(token);
      }
    }
  }

  // Get statistics
  getStatistics(): {
    activeQRCodes: number;
    checkedInCount: number;
    expiredCount: number;
    totalCheckIns: number;
  } {
    let checkedInCount = 0;
    let expiredCount = 0;
    let totalCheckIns = 0;

    for (const qrData of this.activeQRCodes.values()) {
      if (qrData.checkInStatus === 'checked-in') {
        checkedInCount++;
      } else if (qrData.checkInStatus === 'expired') {
        expiredCount++;
      }
    }

    for (const history of this.checkInHistory.values()) {
      totalCheckIns += history.length;
    }

    return {
      activeQRCodes: this.activeQRCodes.size,
      checkedInCount,
      expiredCount,
      totalCheckIns
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private handleError(message: string, error: any): ApiResponse<any> {
    console.error(message, error);
    return {
      success: false,
      error: message,
      message: 'An error occurred',
      timestamp: new Date().toISOString(),
      requestId: this.generateId()
    };
  }
}

// Export singleton instance
export const qrCodeService = QRCodeService.getInstance(); 