import { 
  Tournament, 
  RegistrationAttempt, 
  RegistrationQueue, 
  ScalableTournamentConfig,
  SystemHealth,
  RealTimeStats,
  LotterySettings,
  PriorityGroup,
  TicketSale
} from '../types';

export class RegistrationService {
  private static instance: RegistrationService;
  private queueMap: Map<string, RegistrationQueue[]> = new Map();
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();
  private lotteryEntries: Map<string, Set<string>> = new Map(); // tournamentId -> Set of userIds
  private lotteryWinners: Map<string, Set<string>> = new Map(); // tournamentId -> Set of winner userIds
  private lotteryInProgress: Map<string, boolean> = new Map(); // tournamentId -> lottery status
  private systemHealth: SystemHealth = {
    status: 'healthy',
    components: {
      database: { status: 'healthy', responseTime: 50, errorRate: 0.01, lastCheck: new Date().toISOString() },
      cache: { status: 'healthy', responseTime: 10, errorRate: 0.005, lastCheck: new Date().toISOString() },
      queue: { status: 'healthy', responseTime: 100, errorRate: 0.02, lastCheck: new Date().toISOString() },
      payment: { status: 'healthy', responseTime: 200, errorRate: 0.01, lastCheck: new Date().toISOString() }
    },
    metrics: {
      activeUsers: 0,
      registrationsPerSecond: 0,
      averageResponseTime: 100,
      errorRate: 0.01
    },
    lastUpdated: new Date().toISOString()
  };

  private constructor() {
    this.startHealthMonitoring();
  }

  public static getInstance(): RegistrationService {
    if (!RegistrationService.instance) {
      RegistrationService.instance = new RegistrationService();
    }
    return RegistrationService.instance;
  }

  async registerForTournament(
    userId: string, 
    tournamentId: string, 
    config: ScalableTournamentConfig
  ): Promise<RegistrationAttempt> {
    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    
    try {
      // Check rate limiting
      if (!this.checkRateLimit(userId, config.rateLimitPerUser)) {
        return this.createFailedAttempt(attemptId, userId, tournamentId, 'Rate limit exceeded. Please wait before trying again.');
      }

      const tournament = await this.getTournament(tournamentId);
      if (!tournament) {
        return this.createFailedAttempt(attemptId, userId, tournamentId, 'Tournament not found.');
      }

      // Check if lottery is in progress
      if (this.lotteryInProgress.get(tournamentId)) {
        return this.createFailedAttempt(attemptId, userId, tournamentId, 'Lottery selection in progress. Please wait.');
      }

      // Check if user is already a winner
      if (this.lotteryWinners.get(tournamentId)?.has(userId)) {
        // User is already a winner, proceed to ticket purchase
        return {
          id: attemptId,
          userId,
          tournamentId,
          timestamp: new Date().toISOString(),
          status: 'success',
          retryCount: 0,
          maxRetries: 3
        };
      }

      // Check if lottery should be triggered
      if (this.shouldUseLottery(tournament)) {
        // Check if lottery has already been drawn
        if (this.lotteryWinners.has(tournamentId)) {
          // Lottery already drawn, user is not a winner
          return this.createFailedAttempt(attemptId, userId, tournamentId, 'Lottery has been drawn. You were not selected. Better luck next time!');
        }

        // Add user to lottery entries
        if (!this.lotteryEntries.has(tournamentId)) {
          this.lotteryEntries.set(tournamentId, new Set());
        }
        this.lotteryEntries.get(tournamentId)!.add(userId);

        // Check if we should trigger the lottery draw
        const entries = this.lotteryEntries.get(tournamentId)!;
        const shouldDrawLottery = entries.size >= tournament.maxCapacity * 0.8; // Draw when 80% capacity is reached

        if (shouldDrawLottery) {
          // Pause the queue and draw lottery immediately
          this.lotteryInProgress.set(tournamentId, true);
          
          // Draw lottery winners
          const lotteryResult = await this.drawLottery(tournamentId, tournament.lotterySettings!);
          
          // Check if current user is a winner
          if (lotteryResult.winners.includes(userId)) {
            return {
              id: attemptId,
              userId,
              tournamentId,
              timestamp: new Date().toISOString(),
              status: 'success',
              retryCount: 0,
              maxRetries: 3
            };
          } else {
            return this.createFailedAttempt(attemptId, userId, tournamentId, 'Lottery has been drawn. You were not selected. Better luck next time!');
          }
        } else {
          // User entered lottery, waiting for draw
          return {
            id: attemptId,
            userId,
            tournamentId,
            timestamp: new Date().toISOString(),
            status: 'lottery_entered',
            retryCount: 0,
            maxRetries: 3
          };
        }
      }

      // Check capacity
      if (tournament.currentRegistrations >= tournament.maxCapacity) {
        if (tournament.waitlistEnabled && tournament.currentWaitlist < tournament.waitlistCapacity) {
          return await this.addToWaitlist(attemptId, userId, tournamentId, tournament);
        } else {
          return this.createFailedAttempt(attemptId, userId, tournamentId, 'Tournament is full and waitlist is closed.');
        }
      }

      // Handle different registration types
      switch (tournament.registrationType) {
        case 'first-come-first-served':
          return await this.handleFirstComeFirstServed(attemptId, userId, tournamentId, tournament, config);
        case 'lottery':
          return await this.enterLottery(userId, tournamentId);
        case 'priority-based':
          return await this.handlePriorityBasedRegistration(attemptId, userId, tournamentId, tournament);
        default:
          return await this.processDirectRegistration(attemptId, userId, tournamentId, tournament);
      }

    } catch (error) {
      console.error('Registration error:', error);
      return this.createFailedAttempt(attemptId, userId, tournamentId, 'An unexpected error occurred. Please try again.');
    }
  }

  async enterLottery(userId: string, tournamentId: string): Promise<RegistrationAttempt> {
    const attemptId = `lottery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Check if user is already in lottery
      if (this.lotteryEntries.get(tournamentId)?.has(userId)) {
        return this.createFailedAttempt(attemptId, userId, tournamentId, 'You are already entered in the lottery for this tournament.');
      }

      // Add user to lottery entries
      if (!this.lotteryEntries.has(tournamentId)) {
        this.lotteryEntries.set(tournamentId, new Set());
      }
      this.lotteryEntries.get(tournamentId)!.add(userId);

      // Create lottery entry
      const attempt: RegistrationAttempt = {
        id: attemptId,
        userId,
        tournamentId,
        timestamp: new Date().toISOString(),
        status: 'lottery_entered',
        retryCount: 0,
        maxRetries: 3
      };

      console.log(`User ${userId} entered lottery for tournament ${tournamentId}`);
      return attempt;

    } catch (error) {
      console.error('Lottery entry error:', error);
      return this.createFailedAttempt(attemptId, userId, tournamentId, 'Failed to enter lottery. Please try again.');
    }
  }

  async drawLottery(tournamentId: string, lotterySettings: LotterySettings): Promise<{
    winners: string[];
    waitlist: string[];
    statistics: {
      totalEntries: number;
      winnersSelected: number;
      waitlistSize: number;
      priorityGroupBreakdown: Record<string, number>;
    };
  }> {
    const entries = Array.from(this.lotteryEntries.get(tournamentId) || []);
    const tournament = await this.getTournament(tournamentId);
    
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    const totalCapacity = tournament.maxCapacity;
    const priorityGroups = lotterySettings.priorityGroups || [];
    
    // Initialize winners set
    const winners = new Set<string>();
    const waitlist = new Set<string>();
    const priorityGroupBreakdown: Record<string, number> = {};

    // Process priority groups first
    for (const group of priorityGroups) {
      const groupMembers = this.getPriorityGroupMembers(entries, group);
      const guaranteedSpots = Math.min(group.guaranteedSpots, groupMembers.length);
      
      // Select guaranteed winners
      const guaranteedWinners = this.selectRandomFromGroup(groupMembers, guaranteedSpots);
      guaranteedWinners.forEach(winner => winners.add(winner));
      
      priorityGroupBreakdown[group.name] = guaranteedWinners.length;
      
      // Remove selected winners from entries
      guaranteedWinners.forEach(winner => {
        const index = entries.indexOf(winner);
        if (index > -1) entries.splice(index, 1);
      });
    }

    // Fill remaining spots with weighted random selection
    const remainingSpots = totalCapacity - winners.size;
    if (remainingSpots > 0 && entries.length > 0) {
      const weightedEntries = this.createWeightedEntries(entries, lotterySettings);
      const remainingWinners = this.selectWeightedRandom(weightedEntries, remainingSpots);
      remainingWinners.forEach(winner => winners.add(winner));
    }

    // Create waitlist from remaining entries
    const remainingEntries = entries.filter(entry => !winners.has(entry));
    const waitlistSize = Math.min(lotterySettings.waitlistEnabled ? lotterySettings.maxEntries - totalCapacity : 0, remainingEntries.length);
    const waitlistWinners = this.selectRandomFromGroup(remainingEntries, waitlistSize);
    waitlistWinners.forEach(entry => waitlist.add(entry));

    // Store winners for future reference
    this.lotteryWinners.set(tournamentId, winners);
    this.lotteryInProgress.set(tournamentId, false);

    return {
      winners: Array.from(winners),
      waitlist: Array.from(waitlist),
      statistics: {
        totalEntries: this.lotteryEntries.get(tournamentId)?.size || 0,
        winnersSelected: winners.size,
        waitlistSize: waitlist.size,
        priorityGroupBreakdown
      }
    };
  }

  private shouldUseLottery(tournament: Tournament): boolean {
    // Use lottery if capacity is 80% or more full
    return tournament.currentRegistrations >= tournament.maxCapacity * 0.8;
  }

  private getPriorityGroupMembers(entries: string[], group: PriorityGroup): string[] {
    // In a real implementation, this would check user profiles against criteria
    // For now, we'll simulate priority group membership
    return entries.filter(entry => {
      // Simulate priority group logic
      const userPriority = Math.random(); // This would come from user profile
      switch (group.id) {
        case 'champions':
          return userPriority > 0.95; // Top 5%
        case 'top_players':
          return userPriority > 0.85; // Top 15%
        case 'veterans':
          return userPriority > 0.70; // Top 30%
        default:
          return false;
      }
    });
  }

  private selectRandomFromGroup(group: string[], count: number): string[] {
    const shuffled = [...group].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private createWeightedEntries(entries: string[], lotterySettings: LotterySettings): Array<{ userId: string; weight: number }> {
    return entries.map(entry => {
      // Calculate weight based on priority groups
      let weight = 1.0;
      
      for (const group of lotterySettings.priorityGroups) {
        const groupMembers = this.getPriorityGroupMembers([entry], group);
        if (groupMembers.includes(entry)) {
          weight = Math.max(weight, group.lotteryWeight);
        }
      }
      
      return { userId: entry, weight };
    });
  }

  private selectWeightedRandom(weightedEntries: Array<{ userId: string; weight: number }>, count: number): string[] {
    const totalWeight = weightedEntries.reduce((sum, entry) => sum + entry.weight, 0);
    const selected: string[] = [];
    const available = [...weightedEntries];

    for (let i = 0; i < count && available.length > 0; i++) {
      const random = Math.random() * totalWeight;
      let currentWeight = 0;
      let selectedIndex = -1;

      for (let j = 0; j < available.length; j++) {
        currentWeight += available[j].weight;
        if (random <= currentWeight) {
          selectedIndex = j;
          break;
        }
      }

      if (selectedIndex >= 0) {
        selected.push(available[selectedIndex].userId);
        available.splice(selectedIndex, 1);
      }
    }

    return selected;
  }

  async joinQueue(tournamentId: string, userId: string): Promise<RegistrationQueue> {
    const queueId = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get or create queue for tournament
    if (!this.queueMap.has(tournamentId)) {
      this.queueMap.set(tournamentId, []);
    }
    
    const queue = this.queueMap.get(tournamentId)!;
    const position = queue.length + 1;
    
    const queueEntry: RegistrationQueue = {
      id: queueId,
      tournamentId,
      status: 'waiting',
      currentPosition: position,
      estimatedWaitTime: this.calculateWaitTime(position),
      queueToken: `token_${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      lastUpdated: new Date().toISOString()
    };
    
    queue.push(queueEntry);
    
    // Start processing queue if not already running
    this.processQueue(tournamentId);
    
    return queueEntry;
  }

  async processQueue(tournamentId: string): Promise<void> {
    const queue = this.queueMap.get(tournamentId);
    if (!queue || queue.length === 0) return;

    // Process queue entries in batches
    const batchSize = 10;
    const batch = queue.splice(0, batchSize);
    
    for (const entry of batch) {
      try {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update entry status
        entry.status = 'active';
        entry.currentPosition = 0;
        entry.estimatedWaitTime = 0;
        entry.lastUpdated = new Date().toISOString();
        
        console.log(`Processed queue entry ${entry.id} for tournament ${tournamentId}`);
        
      } catch (error) {
        console.error(`Failed to process queue entry ${entry.id}:`, error);
        entry.status = 'closed';
      }
    }
    
    // Update remaining queue positions
    queue.forEach((entry, index) => {
      entry.currentPosition = index + 1;
      entry.estimatedWaitTime = this.calculateWaitTime(entry.currentPosition);
      entry.lastUpdated = new Date().toISOString();
    });
  }

  async processPayment(ticketSale: TicketSale): Promise<TicketSale> {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedSale = {
      ...ticketSale,
      status: 'confirmed' as const,
      paymentStatus: 'completed' as const,
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      updatedAt: new Date().toISOString()
    };
    
    return updatedSale;
  }

  getSystemHealth(): SystemHealth {
    this.updateSystemHealth();
    return this.systemHealth;
  }

  getRealTimeStats(tournamentId: string): RealTimeStats {
    const queue = this.queueMap.get(tournamentId) || [];
    
    return {
      registrationsPerMinute: this.calculateRegistrationsPerMinute(tournamentId),
      queueLength: queue.length,
      averageWaitTime: this.calculateAverageWaitTime(queue),
      successRate: this.calculateSuccessRate(tournamentId),
      errorRate: this.calculateErrorRate(tournamentId),
      lastUpdated: new Date().toISOString()
    };
  }

  private checkRateLimit(userId: string, limit: number): boolean {
    const now = Date.now();
    const key = `rate_limit_${userId}`;
    const current = this.rateLimitMap.get(key);
    
    if (!current || now > current.resetTime) {
      this.rateLimitMap.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
      return true;
    }
    
    if (current.count >= limit) {
      return false;
    }
    
    current.count++;
    return true;
  }

  private async handleFirstComeFirstServed(
    attemptId: string, 
    userId: string, 
    tournamentId: string, 
    tournament: Tournament,
    config: ScalableTournamentConfig
  ): Promise<RegistrationAttempt> {
    // Check if queue should be used
    if (this.shouldUseQueue(tournament)) {
      const queue = await this.joinQueue(tournamentId, userId);
      return {
        id: attemptId,
        userId,
        tournamentId,
        timestamp: new Date().toISOString(),
        status: 'queued',
        queuePosition: queue.currentPosition,
        waitTime: queue.estimatedWaitTime,
        retryCount: 0,
        maxRetries: 3
      };
    }
    
    return await this.processDirectRegistration(attemptId, userId, tournamentId, tournament);
  }

  private async handleLotteryRegistration(
    attemptId: string, 
    userId: string, 
    tournamentId: string, 
    tournament: Tournament
  ): Promise<RegistrationAttempt> {
    return await this.enterLottery(userId, tournamentId);
  }

  private async handlePriorityBasedRegistration(
    attemptId: string, 
    userId: string, 
    tournamentId: string, 
    tournament: Tournament
  ): Promise<RegistrationAttempt> {
    // Check if user qualifies for priority registration
    const priorityGroup = this.getUserPriorityGroup(userId, tournament.priorityGroups || []);
    
    if (priorityGroup) {
      // Process priority registration
      return await this.processDirectRegistration(attemptId, userId, tournamentId, tournament);
    } else {
      // Fall back to lottery or queue
      if (this.shouldUseLottery(tournament)) {
        return await this.enterLottery(userId, tournamentId);
      } else {
        return await this.joinQueue(tournamentId, userId).then(queue => ({
          id: attemptId,
          userId,
          tournamentId,
          timestamp: new Date().toISOString(),
          status: 'queued',
          queuePosition: queue.currentPosition,
          waitTime: queue.estimatedWaitTime,
          retryCount: 0,
          maxRetries: 3
        }));
      }
    }
  }

  private async processDirectRegistration(
    attemptId: string, 
    userId: string, 
    tournamentId: string, 
    tournament: Tournament
  ): Promise<RegistrationAttempt> {
    // Simulate registration processing
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Update tournament capacity
    tournament.currentRegistrations++;
    
    return {
      id: attemptId,
      userId,
      tournamentId,
      timestamp: new Date().toISOString(),
      status: 'success',
      retryCount: 0,
      maxRetries: 3
    };
  }

  private async addToWaitlist(
    attemptId: string, 
    userId: string, 
    tournamentId: string, 
    tournament: Tournament
  ): Promise<RegistrationAttempt> {
    if (tournament.waitlistEnabled && tournament.currentWaitlist < tournament.waitlistCapacity) {
      tournament.currentWaitlist++;
      
      return {
        id: attemptId,
        userId,
        tournamentId,
        timestamp: new Date().toISOString(),
        status: 'success',
        retryCount: 0,
        maxRetries: 3
      };
    }
    
    return this.createFailedAttempt(attemptId, userId, tournamentId, 'Tournament is full and waitlist is closed.');
  }

  private createFailedAttempt(
    attemptId: string, 
    userId: string, 
    tournamentId: string, 
    errorMessage: string
  ): RegistrationAttempt {
    return {
      id: attemptId,
      userId,
      tournamentId,
      timestamp: new Date().toISOString(),
      status: 'failed',
      errorMessage,
      retryCount: 0,
      maxRetries: 3
    };
  }

  private shouldUseQueue(tournament: Tournament): boolean {
    return tournament.currentRegistrations >= tournament.maxCapacity * 0.9;
  }

  private calculateWaitTime(position: number): number {
    // Estimate 30 seconds per position
    return position * 30;
  }

  private calculateAverageWaitTime(queue: RegistrationQueue[]): number {
    if (queue.length === 0) return 0;
    const totalWaitTime = queue.reduce((sum, entry) => sum + (entry.estimatedWaitTime || 0), 0);
    return Math.round(totalWaitTime / queue.length);
  }

  private calculateRegistrationsPerMinute(tournamentId: string): number {
    // Simulate registration rate
    return Math.floor(Math.random() * 20) + 10; // 10-30 per minute
  }

  private calculateSuccessRate(tournamentId: string): number {
    // Simulate success rate
    return Math.random() * 20 + 80; // 80-100%
  }

  private calculateErrorRate(tournamentId: string): number {
    // Simulate error rate
    return Math.random() * 5; // 0-5%
  }

  private getUserPriorityGroup(userId: string, priorityGroups: PriorityGroup[]): PriorityGroup | null {
    // In a real implementation, this would check user profile against criteria
    // For now, return null (no priority)
    return null;
  }

  private async getTournament(tournamentId: string): Promise<Tournament | null> {
    // Simulate tournament lookup
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Return mock tournament data
    return {
      id: tournamentId,
      name: 'Phoenix Regional Championships',
      date: '2024-03-15',
      location: 'Phoenix Convention Center, AZ',
      totalPlayers: 256,
      status: 'registration',
      maxCapacity: 700,
      currentRegistrations: 650,
      waitlistEnabled: true,
      waitlistCapacity: 200,
      currentWaitlist: 50,
      registrationType: 'first-come-first-served'
    };
  }

  private startHealthMonitoring(): void {
    setInterval(() => this.updateSystemHealth(), 30000); // Update every 30 seconds
  }

  private updateSystemHealth(): void {
    // Simulate system health updates
    this.systemHealth.metrics.activeUsers = Math.floor(Math.random() * 500) + 1000;
    this.systemHealth.metrics.registrationsPerSecond = Math.random() * 10 + 10;
    this.systemHealth.metrics.averageResponseTime = Math.random() * 100 + 150;
    this.systemHealth.metrics.errorRate = Math.random() * 0.02;
    this.systemHealth.lastUpdated = new Date().toISOString();
  }

  isLotteryWinner(tournamentId: string, userId: string): boolean {
    return this.lotteryWinners.get(tournamentId)?.has(userId) || false;
  }

  isLotteryInProgress(tournamentId: string): boolean {
    return this.lotteryInProgress.get(tournamentId) || false;
  }

  getLotteryEntries(tournamentId: string): number {
    return this.lotteryEntries.get(tournamentId)?.size || 0;
  }
} 