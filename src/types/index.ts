export interface Pokemon {
  name: string;
  item?: string;
  ability?: string;
  teraType?: string;
  moves?: string[];
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  placement?: number;
  totalPlayers: number;
  wins?: number;
  losses?: number;
  resistance?: number;
  team?: Pokemon[];
  rounds?: Round[];
  status: 'upcoming' | 'registration' | 'ongoing' | 'completed';
  registrationStart?: string;
  registrationEnd?: string;
  isRegistered?: boolean;
  requiresLottery?: boolean;
  registrationFee?: number;
  // New scalable fields
  maxCapacity: number;
  currentRegistrations: number;
  waitlistEnabled: boolean;
  waitlistCapacity: number;
  currentWaitlist: number;
  registrationType: 'first-come-first-served' | 'lottery' | 'priority-based';
  priorityGroups?: PriorityGroup[];
  registrationQueue?: RegistrationQueue;
  lotterySettings?: LotterySettings;
  realTimeStats?: RealTimeStats;
  // New fields for tournament creation and approval
  createdBy?: string;
  createdByProfessor?: {
    id: string;
    name: string;
    professorLevel: string;
    certificationNumber: string;
  };
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'draft';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  pokemonCompanyReviewer?: {
    id: string;
    name: string;
    role: string;
  };
  tournamentDetails?: {
    format: string;
    rules: string;
    prizes: string;
    venueDetails: string;
    contactInfo: string;
    specialRequirements?: string[];
  };
}

export interface Round {
  round: number;
  opponent: string;
  opponentId?: string;
  opponentTeam?: Pokemon[];
  result?: 'win' | 'loss' | 'draw';
  score?: string;
  table?: number;
}

export interface Player {
  id: string;
  name: string;
  playerId: string;
  region: string;
  division: 'junior' | 'senior' | 'master';
  age?: number;
  championships: number;
  winRate: number;
  rating: number;
  tournaments: Tournament[];
  isVerified: boolean;
  guardianId?: string;
  privacySettings: PrivacySettings;
  mostUsedPokemon?: {
    name: string;
    usage: number;
    winRate: number;
    tournaments: number;
  }[];
  // New fields for Pokémon Company approval
  isPokemonCompanyApproved?: boolean;
  approvalDate?: string;
  approvalLevel?: 'content_creator' | 'official_analyst' | 'brand_ambassador';
  specialBadges?: string[];
  // New fields for professor status
  isProfessor?: boolean;
  professorLevel?: 'assistant' | 'associate' | 'full' | 'emeritus';
  professorCertificationDate?: string;
  professorCertificationNumber?: string;
  canCreateTournaments?: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'guardians-only';
  teamShowcaseVisibility: 'public' | 'private' | 'guardians-only';
  allowTeamReports: boolean;
  showTournamentHistory: boolean;
  allowQRCodeGeneration: boolean;
}

export interface TeamShowcase {
  id: string;
  playerId: string;
  tournamentId: string;
  team: Pokemon[];
  title: string;
  description: string;
  createdAt: string;
  visibility: 'public' | 'private' | 'guardians-only';
  isApproved?: boolean;
  // Sharing fields
  sharedType?: 'open' | 'evs'; // 'open' = Open Team Sheet, 'evs' = with EVs
  sharedWith?: 'public' | 'friend';
  sharedAt?: string;
  sharedLink?: string;
}

export interface TeamReport {
  id: string;
  playerId: string;
  tournamentId: string;
  title: string;
  content: string;
  team: Pokemon[];
  placement?: number;
  record: string;
  keyMatches?: string[];
  createdAt: string;
  visibility: 'public' | 'private' | 'guardians-only';
  isApproved?: boolean;
}

export interface QRCode {
  id: string;
  playerId: string;
  tournamentId: string;
  code: string;
  expiresAt: string;
  isActive: boolean;
  scannedAt?: string;
  scannedBy?: string;
}

export interface Guardian {
  id: string;
  name: string;
  email: string;
  childrenIds: string[];
  verificationStatus: 'pending' | 'verified';
}

export interface TournamentPairing {
  round: number;
  table: number;
  player1: {
    id: string;
    name: string;
    record: string;
  };
  player2: {
    id: string;
    name: string;
    record: string;
  };
  result?: {
    winner: string;
    score: string;
  };
}

export interface MetagameItem {
  name: string;
  usage: number;
  winRate: number;
  popularity: number;
}

export interface MetagameData {
  pokemon: MetagameItem[];
  items: MetagameItem[];
  tera: MetagameItem[];
  totalPlayers: number;
  tournaments: number;
  uniquePokemon: number;
  diversityIndex: number;
}

export interface UserSession {
  userId: string;
  division: 'junior' | 'senior' | 'master';
  isGuardian: boolean;
  guardianId?: string;
  permissions: string[];
  dateOfBirth?: string; // Added for division determination
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    achievements: string[];
    // New fields for Pokémon Company approved authors
    isPokemonCompanyApproved?: boolean;
    approvalLevel?: 'content_creator' | 'official_analyst' | 'brand_ambassador';
    specialBadges?: string[];
  };
  category: 'meta-analysis' | 'team-building' | 'tournament-report' | 'strategy-guide' | 'official-announcement' | 'pokemon-company-content';
  tags: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  publishedAt?: string;
  readTime: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  featuredImage?: string;
  summary: string;
  // New fields for Pokémon Company content
  isOfficialContent?: boolean;
  requiresApproval?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator';
  permissions: string[];
  createdAt: string;
}

// New scalable types for high-traffic registration
export interface RegistrationQueue {
  id: string;
  tournamentId: string;
  status: 'waiting' | 'active' | 'closed';
  currentPosition?: number;
  estimatedWaitTime?: number;
  queueToken: string;
  expiresAt: string;
  lastUpdated: string;
}

export interface LotterySettings {
  enabled: boolean;
  registrationDeadline: string;
  lotteryDrawTime: string;
  maxEntries: number;
  currentEntries: number;
  winnersAnnounced: boolean;
  waitlistEnabled: boolean;
  priorityGroups: PriorityGroup[];
}

export interface PriorityGroup {
  id: string;
  name: string;
  description: string;
  priority: number;
  guaranteedSpots: number;
  lotteryWeight: number;
  criteria: PriorityCriteria[];
}

export interface PriorityCriteria {
  type: 'championship_points' | 'previous_placement' | 'region' | 'division' | 'veteran_status';
  operator: 'gte' | 'lte' | 'eq' | 'in';
  value: any;
}

export interface RealTimeStats {
  registrationsPerMinute: number;
  queueLength: number;
  averageWaitTime: number;
  successRate: number;
  errorRate: number;
  lastUpdated: string;
}

export interface RegistrationAttempt {
  id: string;
  userId: string;
  tournamentId: string;
  timestamp: string;
  status: 'pending' | 'success' | 'failed' | 'queued' | 'lottery_entered';
  queuePosition?: number;
  waitTime?: number;
  errorMessage?: string;
  retryCount: number;
  maxRetries: number;
}

export interface TicketSale {
  id: string;
  tournamentId: string;
  userId: string;
  status: 'reserved' | 'confirmed' | 'cancelled' | 'expired';
  reservationExpiresAt: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScalableTournamentConfig {
  id: string;
  tournamentId: string;
  // Load balancing
  maxConcurrentRegistrations: number;
  rateLimitPerUser: number;
  rateLimitPerIP: number;
  
  // Queue management
  queueEnabled: boolean;
  maxQueueSize: number;
  queueTimeoutMinutes: number;
  
  // Database optimization
  useReadReplicas: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
  
  // Monitoring
  enableRealTimeMonitoring: boolean;
  alertThresholds: AlertThresholds;
  
  // Fallback systems
  fallbackMode: 'graceful_degradation' | 'maintenance_mode' | 'emergency_shutdown';
  emergencyContact: string;
}

export interface AlertThresholds {
  queueLength: number;
  errorRate: number;
  responseTime: number;
  registrationRate: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  components: {
    database: ComponentHealth;
    cache: ComponentHealth;
    queue: ComponentHealth;
    payment: ComponentHealth;
  };
  metrics: {
    activeUsers: number;
    registrationsPerSecond: number;
    averageResponseTime: number;
    errorRate: number;
  };
  lastUpdated: string;
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  errorRate: number;
  lastCheck: string;
}

export interface TournamentCreationRequest {
  id: string;
  professorId: string;
  professorName: string;
  professorLevel: string;
  certificationNumber: string;
  tournamentData: {
    name: string;
    date: string;
    location: string;
    maxCapacity: number;
    format: string;
    rules: string;
    prizes: string;
    venueDetails: string;
    contactInfo: string;
    specialRequirements?: string[];
  };
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerRole?: string;
  comments?: string;
  rejectionReason?: string;
  requiresPokemonCompanyApproval: boolean;
  pokemonCompanyStatus?: 'pending' | 'approved' | 'rejected';
  pokemonCompanyReviewer?: {
    id: string;
    name: string;
    role: string;
  };
  pokemonCompanyComments?: string;
}