// Core Pokemon and Team Types
export interface Pokemon {
  name: string;
  item?: string;
  ability?: string;
  teraType?: string;
  moves?: string[];
  nature?: string;
  evs?: { [stat: string]: number };
  ivs?: { [stat: string]: number };
  gender?: 'male' | 'female' | 'genderless';
  shiny?: boolean;
  level?: number;
}

export interface Team {
  id: string;
  name: string;
  pokemon: Pokemon[];
  format: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  usageCount: number;
  winRate?: number;
  exportFormat?: 'showdown' | 'qr' | 'json';
}

// Enhanced Tournament Types
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
  
  // Scalable registration fields
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
  
  // Tournament creation and approval
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

  // Enhanced tournament features
  tournamentType: 'swiss' | 'single-elimination' | 'double-elimination' | 'round-robin';
  structure: TournamentStructure;
  standings?: PlayerStanding[];
  brackets?: Bracket[];
  matchSlips?: MatchSlip[];
  notifications?: TournamentNotification[];
  qrCodes?: TournamentQRCode[];
}

export interface TournamentStructure {
  totalRounds: number;
  currentRound: number;
  playersPerTable: number;
  timePerRound: number;
  breakTime: number;
  cutToTop?: number;
  swissRounds?: number;
  eliminationRounds?: number;
}

export interface PlayerStanding {
  playerId: string;
  playerName: string;
  record: string; // e.g., "5-2-0"
  wins: number;
  losses: number;
  draws: number;
  resistance: number;
  opponentWinPercentage: number;
  gameWinPercentage: number;
  rank: number;
  points: number;
  isActive: boolean;
  dropped: boolean;
  lastMatchResult?: 'win' | 'loss' | 'draw';
}

export interface Bracket {
  id: string;
  name: string;
  type: 'swiss' | 'single-elimination' | 'double-elimination';
  round: number;
  matches: BracketMatch[];
  isActive: boolean;
}

export interface BracketMatch {
  id: string;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  winnerId?: string;
  score?: string;
  table: number;
  status: 'pending' | 'in-progress' | 'completed' | 'disputed';
  matchSlipId?: string;
  startTime?: string;
  endTime?: string;
}

// Digital Match Slip System
export interface MatchSlip {
  id: string;
  tournamentId: string;
  round: number;
  table: number;
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
  
  // Game results
  games: GameResult[];
  winnerId?: string;
  finalScore: string;
  
  // Digital signatures
  player1Signature?: DigitalSignature;
  player2Signature?: DigitalSignature;
  
  // Status and workflow
  status: 'pending' | 'in-progress' | 'completed' | 'disputed' | 'resolved';
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  
  // Dispute handling
  dispute?: Dispute;
  
  // Audit trail
  auditTrail: AuditEntry[];
  
  // QR code access (disabled during phone bans)
  qrCode: string | null;
  qrCodeExpiresAt: string | null;
  
  // Phone ban status
  phoneBanned: boolean;
}

export interface GameResult {
  gameNumber: number;
  winnerId: string;
  score: string; // e.g., "6-0", "2-0"
  duration: number; // in minutes
  notes?: string;
  submittedBy: string;
  submittedAt: string;
}

export interface DigitalSignature {
  playerId: string;
  signatureType: 'touch' | 'pin' | 'digital';
  signatureData: string;
  timestamp: string;
  deviceInfo: DeviceInfo;
  ipAddress?: string;
}

export interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

export interface Dispute {
  id: string;
  raisedBy: string;
  reason: string;
  description: string;
  evidence?: string[];
  status: 'open' | 'under-review' | 'resolved';
  assignedJudge?: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
  deviceInfo?: DeviceInfo;
}

export interface TournamentQRCode {
  id: string;
  tournamentId: string;
  type: 'match-slip' | 'check-in' | 'results';
  code: string;
  expiresAt: string;
  isActive: boolean;
  scannedAt?: string;
  scannedBy?: string;
  associatedData?: any;
}

// Enhanced Round and Match Types
export interface Round {
  round: number;
  opponent: string;
  opponentId?: string;
  opponentTeam?: Pokemon[];
  result?: 'win' | 'loss' | 'draw';
  score?: string;
  table?: number;
  matchSlipId?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

// Enhanced Player Types
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
  
  // Pokémon Company approval
  isPokemonCompanyApproved?: boolean;
  approvalDate?: string;
  approvalLevel?: 'content_creator' | 'official_analyst' | 'brand_ambassador';
  specialBadges?: string[];
  
  // Professor status
  isProfessor?: boolean;
  professorLevel?: 'assistant' | 'associate' | 'full' | 'emeritus';
  professorCertificationDate?: string;
  professorCertificationNumber?: string;
  canCreateTournaments?: boolean;
  
  // Live tournament status
  isActiveInLiveTournament?: boolean;
  currentTournament?: string;
  currentRound?: number;
  currentTable?: number;
  currentMatch?: {
    round: number;
    table: number;
    opponent: string;
    opponentId: string;
    result: 'win' | 'loss' | 'draw' | 'pending';
  };

  // Enhanced player features
  teams: Team[];
  matchHistory: MatchHistory[];
  achievements: Achievement[];
  statistics: PlayerStatistics;
  preferences: PlayerPreferences;
  accessibilitySettings: AccessibilitySettings;
}

export interface MatchHistory {
  id: string;
  tournamentId: string;
  tournamentName: string;
  opponentId: string;
  opponentName: string;
  result: 'win' | 'loss' | 'draw';
  score: string;
  date: string;
  round: number;
  table: number;
  teamUsed: Pokemon[];
  opponentTeam?: Pokemon[];
  notes?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'tournament' | 'social' | 'team-building' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PlayerStatistics {
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  winRate: number;
  bestFinish: number;
  tournamentsPlayed: number;
  championships: number;
  currentStreak: number;
  longestStreak: number;
  averagePlacement: number;
  mostUsedPokemon: PokemonUsage[];
  mostUsedItems: ItemUsage[];
  mostUsedMoves: MoveUsage[];
  seasonalStats: SeasonalStats[];
}

export interface PokemonUsage {
  name: string;
  usage: number;
  wins: number;
  losses: number;
  winRate: number;
  tournaments: number;
}

export interface ItemUsage {
  name: string;
  usage: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface MoveUsage {
  name: string;
  usage: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface SeasonalStats {
  season: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  rating: number;
  placement: number;
}

export interface PlayerPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  display: DisplayPreferences;
  accessibility: AccessibilitySettings;
  language: string;
  timezone: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  tournamentUpdates: boolean;
  pairingNotifications: boolean;
  roundStartReminders: boolean;
  socialInteractions: boolean;
  achievementUnlocks: boolean;
}

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  compactMode: boolean;
  showAdvancedStats: boolean;
  defaultView: 'dashboard' | 'tournaments' | 'teams' | 'social';
}

export interface AccessibilitySettings {
  screenReader: boolean;
  highContrast: boolean;
  dyslexiaFriendly: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  colorBlindSupport: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'guardians-only';
  allowTeamReports: boolean;
  showTournamentHistory: boolean;
  allowQRCodeGeneration: boolean;
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  dataSharing: 'none' | 'anonymized' | 'full';
}

// Team Analytics and Meta Analysis
export interface TeamAnalytics {
  teamId: string;
  usage: TeamUsage;
  matchups: TeamMatchup[];
  weaknesses: TeamWeakness[];
  strengths: TeamStrength[];
  recommendations: TeamRecommendation[];
  metaTrends: MetaTrend[];
}

export interface TeamUsage {
  totalUsage: number;
  winRate: number;
  averagePlacement: number;
  tournaments: number;
  recentTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface TeamMatchup {
  opponentTeam: Pokemon[];
  winRate: number;
  gamesPlayed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  strategy: string;
}

export interface TeamWeakness {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  counterStrategies: string[];
}

export interface TeamStrength {
  type: string;
  description: string;
  advantage: string;
}

export interface TeamRecommendation {
  type: 'pokemon' | 'item' | 'move' | 'strategy';
  suggestion: string;
  reasoning: string;
  impact: 'low' | 'medium' | 'high';
}

export interface MetaTrend {
  period: string;
  topPokemon: PokemonUsage[];
  topItems: ItemUsage[];
  topMoves: MoveUsage[];
  formatChanges: string[];
  emergingStrategies: string[];
}

// Community Features
export interface Forum {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'strategy' | 'tournament' | 'team-building' | 'meta-discussion';
  threads: ForumThread[];
  moderators: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  replies: ForumReply[];
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
  viewCount: number;
}

export interface ForumReply {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isLiked: boolean;
  isEdited: boolean;
  parentReplyId?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file' | 'team-share';
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'team';
  url: string;
  name: string;
  size: number;
  teamData?: Team;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  messages: GroupMessage[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface GroupMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isActive: boolean;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  messageType: 'text' | 'image' | 'file' | 'team-share';
  attachments?: MessageAttachment[];
}

// Notification System
export interface Notification {
  id: string;
  userId: string;
  type: 'tournament' | 'pairing' | 'social' | 'system' | 'achievement';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface TournamentNotification extends Notification {
  tournamentId: string;
  round?: number;
  table?: number;
  actionRequired?: boolean;
}

// Calendar and Scheduling
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  type: 'tournament' | 'deadline' | 'reminder' | 'social';
  tournamentId?: string;
  isAllDay: boolean;
  location?: string;
  attendees?: string[];
  reminders: CalendarReminder[];
  recurrence?: CalendarRecurrence;
}

export interface CalendarReminder {
  id: string;
  type: 'push' | 'email' | 'sms';
  timeBeforeEvent: number; // in minutes
  isEnabled: boolean;
}

export interface CalendarRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
}

// Existing types (keeping for compatibility)
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
  email: string;
  division: 'junior' | 'senior' | 'master';
  isAdmin: boolean;
  isProfessor: boolean;
  isPokemonCompanyOfficial: boolean;
  isGuardian: boolean;
  guardianId?: string;
  permissions: string[];
  dateOfBirth?: string;
  name?: string;
  preferences?: PlayerPreferences;
  accessibilitySettings?: AccessibilitySettings;
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
  maxConcurrentRegistrations: number;
  rateLimitPerUser: number;
  rateLimitPerIP: number;
  queueEnabled: boolean;
  maxQueueSize: number;
  queueTimeoutMinutes: number;
  useReadReplicas: boolean;
  cacheEnabled: boolean;
  cacheTTL: number;
  enableRealTimeMonitoring: boolean;
  alertThresholds: AlertThresholds;
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

// PWA and Mobile Features
export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'portrait' | 'landscape' | 'any';
  scope: string;
  startUrl: string;
  icons: PWAIcon[];
  screenshots?: PWAScreenshot[];
  categories: string[];
  lang: string;
}

export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: 'maskable' | 'any';
}

export interface PWAScreenshot {
  src: string;
  sizes: string;
  type: string;
  formFactor: 'wide' | 'narrow';
  label: string;
}

// Feedback and Support
export interface Feedback {
  id: string;
  userId: string;
  type: 'bug' | 'feature-request' | 'general' | 'accessibility';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
}

// Data Export and Privacy
export interface DataExport {
  id: string;
  userId: string;
  type: 'tournament-history' | 'teams' | 'profile' | 'all-data';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'json' | 'csv' | 'pdf';
  downloadUrl?: string;
  expiresAt: string;
  createdAt: string;
  completedAt?: string;
  fileSize?: number;
}

// Pokémon Trainer Club Integration
export interface PokemonTrainerClubAccount {
  id: string;
  userId: string;
  ptcId: string;
  ptcUsername: string;
  isLinked: boolean;
  linkedAt: string;
  lastSync: string;
  syncEnabled: boolean;
  permissions: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: string;
  userId?: string;
}

export interface PairingUpdateEvent extends WebSocketEvent {
  type: 'pairing-update';
  data: {
    tournamentId: string;
    round: number;
    pairings: TournamentPairing[];
  };
}

export interface MatchResultEvent extends WebSocketEvent {
  type: 'match-result';
  data: {
    tournamentId: string;
    matchSlipId: string;
    result: MatchSlip;
  };
}

export interface NotificationEvent extends WebSocketEvent {
  type: 'notification';
  data: Notification;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  userId?: string;
  requestId?: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  progress?: number;
  message?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'time';
  required: boolean;
  placeholder?: string;
  options?: FormOption[];
  validation?: ValidationRule[];
  defaultValue?: any;
}

export interface FormOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'custom';
  value?: any;
  message: string;
}

// Theme and Styling
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}