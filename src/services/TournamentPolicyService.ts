import { 
  Tournament, 
  ApiResponse, 
  AppError 
} from '../types';

/**
 * Service for managing tournament policies and restrictions
 * Handles phone bans, device restrictions, and alternative tournament methods
 */
export class TournamentPolicyService {
  private static instance: TournamentPolicyService;
  private phoneBannedTournaments: Set<string> = new Set();
  private tournamentPolicies: Map<string, TournamentPolicy> = new Map();

  private constructor() {}

  static getInstance(): TournamentPolicyService {
    if (!TournamentPolicyService.instance) {
      TournamentPolicyService.instance = new TournamentPolicyService();
    }
    return TournamentPolicyService.instance;
  }

  /**
   * Set phone ban policy for a tournament
   */
  async setPhoneBanPolicy(
    tournamentId: string, 
    phoneBanned: boolean, 
    policy: PhoneBanPolicy
  ): Promise<ApiResponse<boolean>> {
    try {
      if (phoneBanned) {
        this.phoneBannedTournaments.add(tournamentId);
      } else {
        this.phoneBannedTournaments.delete(tournamentId);
      }

      this.tournamentPolicies.set(tournamentId, {
        phoneBanned,
        policy,
        updatedAt: new Date().toISOString(),
      });

      return {
        success: true,
        data: true,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to set phone ban policy', error);
    }
  }

  /**
   * Check if phones are banned for a tournament
   */
  isPhoneBanned(tournamentId: string): boolean {
    return this.phoneBannedTournaments.has(tournamentId);
  }

  /**
   * Get tournament policy
   */
  getTournamentPolicy(tournamentId: string): TournamentPolicy | null {
    return this.tournamentPolicies.get(tournamentId) || null;
  }

  /**
   * Get alternative methods for tournament operations when phones are banned
   */
  getAlternativeMethods(tournamentId: string, operation: TournamentOperation): AlternativeMethod[] {
    const policy = this.getTournamentPolicy(tournamentId);
    if (!policy || !policy.phoneBanned) {
      return [];
    }

    const alternatives: { [key: string]: AlternativeMethod[] } = {
      'match_reporting': [
        {
          method: 'paper_slip',
          description: 'Use paper match slips with manual entry',
          instructions: 'Fill out paper match slip and submit to judge for manual entry',
          requiresJudge: true,
        },
        {
          method: 'table_terminal',
          description: 'Use dedicated tournament terminals at tables',
          instructions: 'Use the provided tablet/terminal at your table for match reporting',
          requiresJudge: false,
        },
        {
          method: 'judge_assisted',
          description: 'Have a judge assist with match reporting',
          instructions: 'Call a judge to your table for match result entry',
          requiresJudge: true,
        },
      ],
      'pairing_check': [
        {
          method: 'pairing_board',
          description: 'Check physical pairing board',
          instructions: 'Look at the tournament pairing board for your match',
          requiresJudge: false,
        },
        {
          method: 'table_display',
          description: 'Check table display',
          instructions: 'Look at the display at your table for pairing information',
          requiresJudge: false,
        },
        {
          method: 'judge_announcement',
          description: 'Listen for judge announcements',
          instructions: 'Listen for judge announcements of pairings',
          requiresJudge: true,
        },
      ],
      'tournament_updates': [
        {
          method: 'announcement_board',
          description: 'Check announcement board',
          instructions: 'Check the tournament announcement board for updates',
          requiresJudge: false,
        },
        {
          method: 'judge_announcement',
          description: 'Listen for judge announcements',
          instructions: 'Listen for judge announcements of tournament updates',
          requiresJudge: true,
        },
        {
          method: 'table_display',
          description: 'Check table display',
          instructions: 'Check the display at your table for tournament updates',
          requiresJudge: false,
        },
      ],
      'team_verification': [
        {
          method: 'paper_team_sheet',
          description: 'Use paper team sheet',
          instructions: 'Submit paper team sheet for verification',
          requiresJudge: true,
        },
        {
          method: 'table_terminal',
          description: 'Use dedicated tournament terminal',
          instructions: 'Use the provided tablet/terminal for team verification',
          requiresJudge: false,
        },
        {
          method: 'judge_assisted',
          description: 'Have judge assist with team verification',
          instructions: 'Call a judge to verify your team',
          requiresJudge: true,
        },
      ],
      'dispute_resolution': [
        {
          method: 'judge_call',
          description: 'Call a judge to your table',
          instructions: 'Raise your hand or use the judge call button',
          requiresJudge: true,
        },
        {
          method: 'paper_dispute_form',
          description: 'Fill out paper dispute form',
          instructions: 'Fill out dispute form and submit to judge',
          requiresJudge: true,
        },
      ],
    };

    return alternatives[operation] || [];
  }

  /**
   * Get allowed devices for a tournament
   */
  getAllowedDevices(tournamentId: string): AllowedDevice[] {
    const policy = this.getTournamentPolicy(tournamentId);
    if (!policy || !policy.phoneBanned) {
      return [
        { type: 'phone', allowed: true, restrictions: [] },
        { type: 'tablet', allowed: true, restrictions: [] },
        { type: 'laptop', allowed: true, restrictions: [] },
        { type: 'desktop', allowed: true, restrictions: [] },
      ];
    }

    const phoneBanPolicy = policy.policy;
    
    return [
      {
        type: 'phone',
        allowed: phoneBanPolicy.allowPhones,
        restrictions: phoneBanPolicy.phoneRestrictions,
      },
      {
        type: 'tablet',
        allowed: phoneBanPolicy.allowTablets,
        restrictions: phoneBanPolicy.tabletRestrictions,
      },
      {
        type: 'laptop',
        allowed: phoneBanPolicy.allowLaptops,
        restrictions: phoneBanPolicy.laptopRestrictions,
      },
      {
        type: 'desktop',
        allowed: phoneBanPolicy.allowDesktops,
        restrictions: phoneBanPolicy.desktopRestrictions,
      },
    ];
  }

  /**
   * Check if a device is allowed for a tournament
   */
  isDeviceAllowed(tournamentId: string, deviceType: string, userAgent: string): boolean {
    const allowedDevices = this.getAllowedDevices(tournamentId);
    const device = allowedDevices.find(d => d.type === deviceType);
    
    if (!device || !device.allowed) {
      return false;
    }

    // Check restrictions
    for (const restriction of device.restrictions) {
      if (restriction.type === 'user_agent' && userAgent.includes(restriction.value)) {
        return false;
      }
      if (restriction.type === 'app' && userAgent.includes(restriction.value)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get tournament check-in methods
   */
  getCheckInMethods(tournamentId: string): CheckInMethod[] {
    const policy = this.getTournamentPolicy(tournamentId);
    const isPhoneBanned = this.isPhoneBanned(tournamentId);

    const methods: CheckInMethod[] = [
      {
        method: 'qr_code',
        description: 'QR Code Check-in',
        available: !isPhoneBanned,
        instructions: 'Scan QR code with your phone',
      },
      {
        method: 'manual_checkin',
        description: 'Manual Check-in',
        available: true,
        instructions: 'Check in with tournament staff',
      },
      {
        method: 'table_terminal',
        description: 'Table Terminal Check-in',
        available: isPhoneBanned,
        instructions: 'Use the terminal at your table to check in',
      },
      {
        method: 'judge_assisted',
        description: 'Judge-Assisted Check-in',
        available: true,
        instructions: 'Have a judge check you in',
      },
    ];

    return methods.filter(method => method.available);
  }

  /**
   * Get tournament result submission methods
   */
  getResultSubmissionMethods(tournamentId: string): ResultSubmissionMethod[] {
    const policy = this.getTournamentPolicy(tournamentId);
    const isPhoneBanned = this.isPhoneBanned(tournamentId);

    const methods: ResultSubmissionMethod[] = [
      {
        method: 'digital_match_slip',
        description: 'Digital Match Slip',
        available: !isPhoneBanned,
        instructions: 'Submit results through the app',
      },
      {
        method: 'paper_match_slip',
        description: 'Paper Match Slip',
        available: isPhoneBanned,
        instructions: 'Fill out paper match slip and submit to judge',
      },
      {
        method: 'table_terminal',
        description: 'Table Terminal',
        available: isPhoneBanned,
        instructions: 'Use the terminal at your table to submit results',
      },
      {
        method: 'judge_assisted',
        description: 'Judge-Assisted Submission',
        available: true,
        instructions: 'Have a judge enter your results',
      },
    ];

    return methods.filter(method => method.available);
  }

  /**
   * Get communication methods during tournament
   */
  getCommunicationMethods(tournamentId: string): CommunicationMethod[] {
    const policy = this.getTournamentPolicy(tournamentId);
    const isPhoneBanned = this.isPhoneBanned(tournamentId);

    const methods: CommunicationMethod[] = [
      {
        method: 'push_notifications',
        description: 'Push Notifications',
        available: !isPhoneBanned,
        instructions: 'Receive notifications on your phone',
      },
      {
        method: 'table_display',
        description: 'Table Display',
        available: isPhoneBanned,
        instructions: 'Check the display at your table for updates',
      },
      {
        method: 'announcement_board',
        description: 'Announcement Board',
        available: true,
        instructions: 'Check the tournament announcement board',
      },
      {
        method: 'judge_announcements',
        description: 'Judge Announcements',
        available: true,
        instructions: 'Listen for judge announcements',
      },
      {
        method: 'email_notifications',
        description: 'Email Notifications',
        available: true,
        instructions: 'Check your email for tournament updates',
      },
    ];

    return methods.filter(method => method.available);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Handle errors
   */
  private handleError(message: string, error: any): ApiResponse<any> {
    const appError: AppError = {
      code: 'TOURNAMENT_POLICY_ERROR',
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

// Types for tournament policies
export interface TournamentPolicy {
  phoneBanned: boolean;
  policy: PhoneBanPolicy;
  updatedAt: string;
}

export interface PhoneBanPolicy {
  allowPhones: boolean;
  allowTablets: boolean;
  allowLaptops: boolean;
  allowDesktops: boolean;
  phoneRestrictions: DeviceRestriction[];
  tabletRestrictions: DeviceRestriction[];
  laptopRestrictions: DeviceRestriction[];
  desktopRestrictions: DeviceRestriction[];
  alternativeMethods: AlternativeMethod[];
}

export interface DeviceRestriction {
  type: 'user_agent' | 'app' | 'feature';
  value: string;
  description: string;
}

export interface AlternativeMethod {
  method: string;
  description: string;
  instructions: string;
  requiresJudge: boolean;
}

export interface AllowedDevice {
  type: string;
  allowed: boolean;
  restrictions: DeviceRestriction[];
}

export interface CheckInMethod {
  method: string;
  description: string;
  available: boolean;
  instructions: string;
}

export interface ResultSubmissionMethod {
  method: string;
  description: string;
  available: boolean;
  instructions: string;
}

export interface CommunicationMethod {
  method: string;
  description: string;
  available: boolean;
  instructions: string;
}

export type TournamentOperation = 
  | 'match_reporting' 
  | 'pairing_check' 
  | 'tournament_updates' 
  | 'team_verification' 
  | 'dispute_resolution';

export default TournamentPolicyService.getInstance(); 