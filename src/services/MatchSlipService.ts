import { 
  MatchSlip, 
  GameResult, 
  DigitalSignature, 
  Dispute, 
  AuditEntry, 
  DeviceInfo,
  ApiResponse,
  AppError 
} from '../types';

/**
 * Service for managing digital match slips in VGC tournaments
 * Handles game results, digital signatures, disputes, and audit trails
 * Note: Phones are banned during tournament play, so mobile features are disabled during live matches
 */
export class MatchSlipService {
  private static instance: MatchSlipService;
  private matchSlips: Map<string, MatchSlip> = new Map();
  private auditTrail: AuditEntry[] = [];
  private tournamentPhoneBans: Set<string> = new Set(); // Track tournaments with phone bans

  private constructor() {}

  static getInstance(): MatchSlipService {
    if (!MatchSlipService.instance) {
      MatchSlipService.instance = new MatchSlipService();
    }
    return MatchSlipService.instance;
  }

  /**
   * Enable phone ban for a tournament
   */
  enablePhoneBan(tournamentId: string): void {
    this.tournamentPhoneBans.add(tournamentId);
  }

  /**
   * Disable phone ban for a tournament
   */
  disablePhoneBan(tournamentId: string): void {
    this.tournamentPhoneBans.delete(tournamentId);
  }

  /**
   * Check if phones are banned for a tournament
   */
  isPhoneBanned(tournamentId: string): boolean {
    return this.tournamentPhoneBans.has(tournamentId);
  }

  /**
   * Create a new match slip for a tournament match
   */
  async createMatchSlip(
    tournamentId: string,
    round: number,
    table: number,
    player1Id: string,
    player1Name: string,
    player2Id: string,
    player2Name: string
  ): Promise<ApiResponse<MatchSlip>> {
    try {
      const isPhoneBanned = this.isPhoneBanned(tournamentId);
      
      const matchSlip: MatchSlip = {
        id: this.generateId(),
        tournamentId,
        round,
        table,
        player1Id,
        player1Name,
        player2Id,
        player2Name,
        games: [],
        status: 'pending',
        auditTrail: [],
        qrCode: isPhoneBanned ? null : this.generateQRCode(), // No QR codes if phones banned
        qrCodeExpiresAt: isPhoneBanned ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        phoneBanned: isPhoneBanned,
      };

      this.matchSlips.set(matchSlip.id, matchSlip);
      this.addAuditEntry(matchSlip.id, 'match_slip_created', 'system', 
        `Match slip created${isPhoneBanned ? ' (phones banned)' : ''}`);

      return {
        success: true,
        data: matchSlip,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to create match slip', error);
    }
  }

  /**
   * Submit game results for a match
   */
  async submitGameResult(
    matchSlipId: string,
    gameNumber: number,
    winnerId: string,
    score: string,
    duration: number,
    submittedBy: string,
    notes?: string
  ): Promise<ApiResponse<GameResult>> {
    try {
      const matchSlip = this.matchSlips.get(matchSlipId);
      if (!matchSlip) {
        throw new Error('Match slip not found');
      }

      if (matchSlip.status === 'completed') {
        throw new Error('Match slip is already completed');
      }

      const gameResult: GameResult = {
        gameNumber,
        winnerId,
        score,
        duration,
        notes,
        submittedBy,
        submittedAt: new Date().toISOString(),
      };

      matchSlip.games.push(gameResult);
      matchSlip.status = 'in-progress';

      // Update final score and winner if all games are complete
      this.updateMatchResult(matchSlip);

      this.addAuditEntry(matchSlipId, 'game_result_submitted', submittedBy, `Game ${gameNumber} result submitted`);

      return {
        success: true,
        data: gameResult,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to submit game result', error);
    }
  }

  /**
   * Submit digital signature for a match slip
   * Note: Touch signatures are disabled during phone bans
   */
  async submitSignature(
    matchSlipId: string,
    playerId: string,
    signatureType: 'touch' | 'pin' | 'digital',
    signatureData: string,
    deviceInfo: DeviceInfo
  ): Promise<ApiResponse<DigitalSignature>> {
    try {
      const matchSlip = this.matchSlips.get(matchSlipId);
      if (!matchSlip) {
        throw new Error('Match slip not found');
      }

      if (matchSlip.player1Id !== playerId && matchSlip.player2Id !== playerId) {
        throw new Error('Player not authorized to sign this match slip');
      }

      // Check phone ban restrictions
      if (matchSlip.phoneBanned && signatureType === 'touch') {
        throw new Error('Touch signatures are not allowed during tournament play due to phone bans');
      }

      // Check if device is mobile during phone ban
      if (matchSlip.phoneBanned && this.isMobileDevice(deviceInfo)) {
        throw new Error('Mobile devices are not allowed during tournament play');
      }

      const signature: DigitalSignature = {
        playerId,
        signatureType,
        signatureData,
        timestamp: new Date().toISOString(),
        deviceInfo,
      };

      if (matchSlip.player1Id === playerId) {
        matchSlip.player1Signature = signature;
      } else {
        matchSlip.player2Signature = signature;
      }

      // Check if both players have signed
      if (matchSlip.player1Signature && matchSlip.player2Signature) {
        matchSlip.status = 'completed';
        matchSlip.submittedAt = new Date().toISOString();
      }

      this.addAuditEntry(matchSlipId, 'signature_submitted', playerId, 
        `${signatureType} signature submitted${matchSlip.phoneBanned ? ' (non-mobile)' : ''}`);

      return {
        success: true,
        data: signature,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to submit signature', error);
    }
  }

  /**
   * Submit paper-based match slip (alternative to digital when phones are banned)
   */
  async submitPaperMatchSlip(
    matchSlipId: string,
    submittedBy: string,
    paperSlipNumber: string,
    judgeSignature?: string
  ): Promise<ApiResponse<MatchSlip>> {
    try {
      const matchSlip = this.matchSlips.get(matchSlipId);
      if (!matchSlip) {
        throw new Error('Match slip not found');
      }

      if (!matchSlip.phoneBanned) {
        throw new Error('Paper match slips are only allowed when phones are banned');
      }

      // Create a special signature for paper submission
      const paperSignature: DigitalSignature = {
        playerId: submittedBy,
        signatureType: 'digital',
        signatureData: `PAPER_SLIP_${paperSlipNumber}`,
        timestamp: new Date().toISOString(),
        deviceInfo: {
          userAgent: 'Paper Match Slip',
          screenResolution: 'N/A',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
        },
      };

      if (matchSlip.player1Id === submittedBy) {
        matchSlip.player1Signature = paperSignature;
      } else if (matchSlip.player2Id === submittedBy) {
        matchSlip.player2Signature = paperSignature;
      } else {
        throw new Error('Player not authorized to submit this match slip');
      }

      // If judge signature is provided, mark as completed
      if (judgeSignature) {
        matchSlip.status = 'completed';
        matchSlip.submittedAt = new Date().toISOString();
        matchSlip.reviewedBy = 'judge';
        matchSlip.reviewedAt = new Date().toISOString();
      }

      this.addAuditEntry(matchSlipId, 'paper_slip_submitted', submittedBy, 
        `Paper match slip ${paperSlipNumber} submitted${judgeSignature ? ' (judge verified)' : ''}`);

      return {
        success: true,
        data: matchSlip,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to submit paper match slip', error);
    }
  }

  /**
   * Get match slip by QR code (disabled during phone bans)
   */
  async getMatchSlipByQRCode(qrCode: string): Promise<ApiResponse<MatchSlip>> {
    try {
      const matchSlip = Array.from(this.matchSlips.values()).find(
        slip => slip.qrCode === qrCode && slip.qrCodeExpiresAt > new Date().toISOString()
      );

      if (!matchSlip) {
        throw new Error('Match slip not found or QR code expired');
      }

      if (matchSlip.phoneBanned) {
        throw new Error('QR code access is disabled during tournament play due to phone bans');
      }

      return {
        success: true,
        data: matchSlip,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to get match slip by QR code', error);
    }
  }

  /**
   * Get match slip by table number (alternative when phones are banned)
   */
  async getMatchSlipByTable(
    tournamentId: string,
    round: number,
    table: number
  ): Promise<ApiResponse<MatchSlip>> {
    try {
      const matchSlip = Array.from(this.matchSlips.values()).find(
        slip => slip.tournamentId === tournamentId && 
               slip.round === round && 
               slip.table === table
      );

      if (!matchSlip) {
        throw new Error('Match slip not found for this table');
      }

      return {
        success: true,
        data: matchSlip,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to get match slip by table', error);
    }
  }

  /**
   * Get available signature methods for a match slip
   */
  getAvailableSignatureMethods(matchSlipId: string): string[] {
    const matchSlip = this.matchSlips.get(matchSlipId);
    if (!matchSlip) return [];

    if (matchSlip.phoneBanned) {
      return ['pin', 'digital']; // No touch signatures during phone bans
    } else {
      return ['touch', 'pin', 'digital'];
    }
  }

  /**
   * Check if device is mobile
   */
  private isMobileDevice(deviceInfo: DeviceInfo): boolean {
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'phone'];
    return mobileKeywords.some(keyword => 
      deviceInfo.userAgent.toLowerCase().includes(keyword)
    );
  }

  /**
   * Get match slip by ID
   */
  async getMatchSlip(matchSlipId: string): Promise<ApiResponse<MatchSlip>> {
    try {
      const matchSlip = this.matchSlips.get(matchSlipId);
      if (!matchSlip) {
        throw new Error('Match slip not found');
      }

      return {
        success: true,
        data: matchSlip,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to get match slip', error);
    }
  }

  /**
   * Get match slips for a tournament
   */
  async getTournamentMatchSlips(tournamentId: string): Promise<ApiResponse<MatchSlip[]>> {
    try {
      const matchSlips = Array.from(this.matchSlips.values()).filter(
        slip => slip.tournamentId === tournamentId
      );

      return {
        success: true,
        data: matchSlips,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to get tournament match slips', error);
    }
  }

  /**
   * Get match slips for a player
   */
  async getPlayerMatchSlips(playerId: string): Promise<ApiResponse<MatchSlip[]>> {
    try {
      const matchSlips = Array.from(this.matchSlips.values()).filter(
        slip => slip.player1Id === playerId || slip.player2Id === playerId
      );

      return {
        success: true,
        data: matchSlips,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to get player match slips', error);
    }
  }

  /**
   * Get audit trail for a match slip
   */
  async getAuditTrail(matchSlipId: string): Promise<ApiResponse<AuditEntry[]>> {
    try {
      const matchSlip = this.matchSlips.get(matchSlipId);
      if (!matchSlip) {
        throw new Error('Match slip not found');
      }

      return {
        success: true,
        data: matchSlip.auditTrail,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to get audit trail', error);
    }
  }

  /**
   * Raise a dispute for a match slip
   */
  async raiseDispute(
    matchSlipId: string,
    raisedBy: string,
    reason: string,
    description: string,
    evidence?: string[]
  ): Promise<ApiResponse<Dispute>> {
    try {
      const matchSlip = this.matchSlips.get(matchSlipId);
      if (!matchSlip) {
        throw new Error('Match slip not found');
      }

      if (matchSlip.player1Id !== raisedBy && matchSlip.player2Id !== raisedBy) {
        throw new Error('Player not authorized to raise dispute');
      }

      const dispute: Dispute = {
        id: this.generateId(),
        raisedBy,
        reason,
        description,
        evidence,
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      matchSlip.dispute = dispute;
      matchSlip.status = 'disputed';

      this.addAuditEntry(matchSlipId, 'dispute_raised', raisedBy, `Dispute raised: ${reason}`);

      return {
        success: true,
        data: dispute,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to raise dispute', error);
    }
  }

  /**
   * Resolve a dispute
   */
  async resolveDispute(
    matchSlipId: string,
    judgeId: string,
    resolution: string
  ): Promise<ApiResponse<Dispute>> {
    try {
      const matchSlip = this.matchSlips.get(matchSlipId);
      if (!matchSlip || !matchSlip.dispute) {
        throw new Error('Dispute not found');
      }

      matchSlip.dispute.status = 'resolved';
      matchSlip.dispute.assignedJudge = judgeId;
      matchSlip.dispute.resolution = resolution;
      matchSlip.dispute.resolvedAt = new Date().toISOString();

      matchSlip.status = 'resolved';
      matchSlip.reviewedBy = judgeId;
      matchSlip.reviewedAt = new Date().toISOString();

      this.addAuditEntry(matchSlipId, 'dispute_resolved', judgeId, `Dispute resolved: ${resolution}`);

      return {
        success: true,
        data: matchSlip.dispute,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to resolve dispute', error);
    }
  }

  /**
   * Update match result based on game results
   */
  private updateMatchResult(matchSlip: MatchSlip): void {
    if (matchSlip.games.length === 0) return;

    const player1Wins = matchSlip.games.filter(game => game.winnerId === matchSlip.player1Id).length;
    const player2Wins = matchSlip.games.filter(game => game.winnerId === matchSlip.player2Id).length;

    if (player1Wins > player2Wins) {
      matchSlip.winnerId = matchSlip.player1Id;
      matchSlip.finalScore = `${player1Wins}-${player2Wins}`;
    } else if (player2Wins > player1Wins) {
      matchSlip.winnerId = matchSlip.player2Id;
      matchSlip.finalScore = `${player2Wins}-${player1Wins}`;
    } else {
      // Handle draws if needed
      matchSlip.finalScore = `${player1Wins}-${player2Wins}`;
    }
  }

  /**
   * Add audit entry
   */
  private addAuditEntry(
    matchSlipId: string,
    action: string,
    userId: string,
    details: string
  ): void {
    const auditEntry: AuditEntry = {
      id: this.generateId(),
      action,
      userId,
      timestamp: new Date().toISOString(),
      details,
    };

    const matchSlip = this.matchSlips.get(matchSlipId);
    if (matchSlip) {
      matchSlip.auditTrail.push(auditEntry);
    }

    this.auditTrail.push(auditEntry);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate QR code
   */
  private generateQRCode(): string {
    return `MS-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  /**
   * Handle errors
   */
  private handleError(message: string, error: any): ApiResponse<any> {
    const appError: AppError = {
      code: 'MATCH_SLIP_ERROR',
      message,
      details: error.message,
      timestamp: new Date().toISOString(),
    };

    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      requestId: this.generateId(),
    };
  }
}

export default MatchSlipService.getInstance(); 