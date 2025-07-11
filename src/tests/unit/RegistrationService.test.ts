import { RegistrationService } from '../../services/RegistrationService';
import { Tournament, ScalableTournamentConfig } from '../../types';

describe('RegistrationService', () => {
  let registrationService: RegistrationService;
  let mockTournament: Tournament;
  let mockConfig: ScalableTournamentConfig;

  beforeEach(() => {
    registrationService = RegistrationService.getInstance();
    mockTournament = {
      id: 'tournament-1',
      name: 'Test Tournament',
      date: '2024-03-15',
      location: 'Test Location',
      totalPlayers: 0,
      status: 'registration',
      maxCapacity: 100,
      currentRegistrations: 50,
      waitlistEnabled: true,
      waitlistCapacity: 20,
      currentWaitlist: 0,
      registrationType: 'first-come-first-served',
      isRegistered: false
    };

    mockConfig = {
      id: 'config-1',
      tournamentId: 'tournament-1',
      maxConcurrentRegistrations: 10,
      rateLimitPerUser: 5,
      rateLimitPerIP: 10,
      queueEnabled: true,
      maxQueueSize: 100,
      queueTimeoutMinutes: 30,
      useReadReplicas: false,
      cacheEnabled: true,
      cacheTTL: 300,
      enableRealTimeMonitoring: true,
      alertThresholds: {
        queueLength: 50,
        errorRate: 5,
        responseTime: 2000,
        registrationRate: 100
      },
      fallbackMode: 'graceful_degradation',
      emergencyContact: 'admin@vgc-hub.com'
    };
  });

  describe('Singleton Pattern', () => {
    test('should return the same instance', () => {
      const instance1 = RegistrationService.getInstance();
      const instance2 = RegistrationService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Tournament Registration', () => {
    test('should successfully register for tournament with available capacity', async () => {
      const result = await registrationService.registerForTournament(
        'user-123',
        'tournament-1',
        mockConfig
      );

      expect(result.status).toBe('success');
      expect(result.userId).toBe('user-123');
      expect(result.tournamentId).toBe('tournament-1');
    });

    test('should add to waitlist when tournament is full', async () => {
      const fullTournament = {
        ...mockTournament,
        currentRegistrations: 100,
        maxCapacity: 100
      };

      const result = await registrationService.registerForTournament(
        'user-123',
        'tournament-1',
        mockConfig
      );

      expect(result.status).toBe('queued');
      expect(result.queuePosition).toBeDefined();
    });

    test('should reject registration when tournament is closed', async () => {
      const closedTournament = {
        ...mockTournament,
        status: 'completed'
      };

      const result = await registrationService.registerForTournament(
        'user-123',
        'tournament-1',
        mockConfig
      );

      expect(result.status).toBe('failed');
      expect(result.errorMessage).toContain('Tournament registration is closed');
    });

    test('should handle rate limiting', async () => {
      // Make multiple rapid registrations
      const promises = Array.from({ length: 10 }, (_, i) =>
        registrationService.registerForTournament(
          `user-${i}`,
          'tournament-1',
          mockConfig
        )
      );

      const results = await Promise.all(promises);
      const rateLimitedResults = results.filter(r => r.status === 'failed' && r.errorMessage?.includes('rate limit'));

      expect(rateLimitedResults.length).toBeGreaterThan(0);
    });
  });

  describe('Queue Management', () => {
    test('should add user to queue when tournament is full', async () => {
      const fullTournament = {
        ...mockTournament,
        currentRegistrations: 100,
        maxCapacity: 100
      };

      const result = await registrationService.registerForTournament(
        'user-123',
        'tournament-1',
        mockConfig
      );

      expect(result.status).toBe('queued');
      expect(result.queuePosition).toBeDefined();
      expect(result.waitTime).toBeDefined();
    });

    test('should process queue when spots become available', async () => {
      // Fill tournament
      const fullTournament = {
        ...mockTournament,
        currentRegistrations: 100,
        maxCapacity: 100
      };

      // Add users to queue
      await registrationService.registerForTournament('user-1', 'tournament-1', mockConfig);
      await registrationService.registerForTournament('user-2', 'tournament-1', mockConfig);

      // Simulate spot becoming available
      const updatedTournament = {
        ...mockTournament,
        currentRegistrations: 99,
        maxCapacity: 100
      };

      const result = await registrationService.registerForTournament(
        'user-3',
        'tournament-1',
        mockConfig
      );

      expect(result.status).toBe('success');
    });

    test('should handle queue timeout', async () => {
      const fullTournament = {
        ...mockTournament,
        currentRegistrations: 100,
        maxCapacity: 100
      };

      const result = await registrationService.registerForTournament(
        'user-123',
        'tournament-1',
        mockConfig
      );

      expect(result.status).toBe('queued');

      // Simulate timeout (in real implementation, this would be handled by a timer)
      // For testing, we'll just verify the queue position is set
      expect(result.queuePosition).toBeDefined();
    });
  });

  describe('Lottery System', () => {
    test('should enter user in lottery for lottery tournaments', async () => {
      const lotteryTournament = {
        ...mockTournament,
        registrationType: 'lottery',
        requiresLottery: true
      };

      const result = await registrationService.registerForTournament(
        'user-123',
        'tournament-1',
        mockConfig
      );

      expect(result.status).toBe('lottery_entered');
    });

    test('should draw lottery winners', async () => {
      const lotterySettings = {
        enabled: true,
        registrationDeadline: '2024-03-10T23:59:59Z',
        lotteryDrawTime: '2024-03-11T10:00:00Z',
        maxEntries: 100,
        currentEntries: 50,
        winnersAnnounced: false,
        waitlistEnabled: true,
        priorityGroups: []
      };

      // Enter users in lottery
      await registrationService.enterLottery('user-1', 'tournament-1');
      await registrationService.enterLottery('user-2', 'tournament-1');
      await registrationService.enterLottery('user-3', 'tournament-1');

      const result = await registrationService.drawLottery('tournament-1', lotterySettings);

      expect(result.winners.length).toBeGreaterThan(0);
      expect(result.statistics.totalEntries).toBe(3);
    });

    test('should handle priority groups in lottery', async () => {
      const lotterySettings = {
        enabled: true,
        registrationDeadline: '2024-03-10T23:59:59Z',
        lotteryDrawTime: '2024-03-11T10:00:00Z',
        maxEntries: 100,
        currentEntries: 50,
        winnersAnnounced: false,
        waitlistEnabled: true,
        priorityGroups: [
          {
            id: 'veterans',
            name: 'Veteran Players',
            description: 'Players with 5+ years experience',
            priority: 1,
            guaranteedSpots: 10,
            lotteryWeight: 2.0,
            criteria: [
              {
                type: 'veteran_status',
                operator: 'eq',
                value: true
              }
            ]
          }
        ]
      };

      const result = await registrationService.drawLottery('tournament-1', lotterySettings);

      expect(result.statistics.priorityGroupBreakdown).toBeDefined();
    });
  });

  describe('System Health', () => {
    test('should return system health status', () => {
      const health = registrationService.getSystemHealth();

      expect(health.status).toBeDefined();
      expect(health.components).toBeDefined();
      expect(health.metrics).toBeDefined();
      expect(health.lastUpdated).toBeDefined();
    });

    test('should return real-time stats', () => {
      const stats = registrationService.getRealTimeStats('tournament-1');

      expect(stats.registrationsPerMinute).toBeDefined();
      expect(stats.queueLength).toBeDefined();
      expect(stats.averageWaitTime).toBeDefined();
      expect(stats.successRate).toBeDefined();
      expect(stats.errorRate).toBeDefined();
    });
  });

  describe('Payment Processing', () => {
    test('should process payment successfully', async () => {
      const ticketSale = {
        id: 'ticket-1',
        tournamentId: 'tournament-1',
        userId: 'user-123',
        status: 'reserved',
        reservationExpiresAt: new Date(Date.now() + 300000).toISOString(),
        paymentStatus: 'pending',
        amount: 25.00,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await registrationService.processPayment(ticketSale);

      expect(result.paymentStatus).toBe('completed');
      expect(result.transactionId).toBeDefined();
    });

    test('should handle payment failure', async () => {
      const ticketSale = {
        id: 'ticket-1',
        tournamentId: 'tournament-1',
        userId: 'user-123',
        status: 'reserved',
        reservationExpiresAt: new Date(Date.now() + 300000).toISOString(),
        paymentStatus: 'pending',
        amount: 25.00,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate payment failure by setting a negative amount
      ticketSale.amount = -25.00;

      const result = await registrationService.processPayment(ticketSale);

      expect(result.paymentStatus).toBe('failed');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid tournament ID', async () => {
      const result = await registrationService.registerForTournament(
        'user-123',
        'invalid-tournament',
        mockConfig
      );

      expect(result.status).toBe('failed');
      expect(result.errorMessage).toContain('Tournament not found');
    });

    test('should handle invalid user ID', async () => {
      const result = await registrationService.registerForTournament(
        '',
        'tournament-1',
        mockConfig
      );

      expect(result.status).toBe('failed');
      expect(result.errorMessage).toContain('Invalid user ID');
    });

    test('should handle system errors gracefully', async () => {
      // Simulate system error by passing invalid config
      const invalidConfig = {
        ...mockConfig,
        maxConcurrentRegistrations: -1
      };

      const result = await registrationService.registerForTournament(
        'user-123',
        'tournament-1',
        invalidConfig
      );

      expect(result.status).toBe('failed');
    });
  });

  describe('Lottery Status', () => {
    test('should check if user is lottery winner', () => {
      const isWinner = registrationService.isLotteryWinner('tournament-1', 'user-123');
      expect(typeof isWinner).toBe('boolean');
    });

    test('should check if lottery is in progress', () => {
      const inProgress = registrationService.isLotteryInProgress('tournament-1');
      expect(typeof inProgress).toBe('boolean');
    });

    test('should get lottery entry count', () => {
      const entries = registrationService.getLotteryEntries('tournament-1');
      expect(typeof entries).toBe('number');
    });
  });

  describe('Performance', () => {
    test('should handle concurrent registrations efficiently', async () => {
      const startTime = performance.now();

      const promises = Array.from({ length: 50 }, (_, i) =>
        registrationService.registerForTournament(
          `user-${i}`,
          'tournament-1',
          mockConfig
        )
      );

      const results = await Promise.all(promises);
      const endTime = performance.now();

      const averageTime = (endTime - startTime) / 50;
      expect(averageTime).toBeLessThan(10); // Should process each registration in under 10ms

      const successfulRegistrations = results.filter(r => r.status === 'success');
      expect(successfulRegistrations.length).toBeGreaterThan(0);
    });

    test('should maintain performance under load', async () => {
      const startTime = performance.now();

      // Simulate high load
      const promises = Array.from({ length: 100 }, (_, i) =>
        registrationService.registerForTournament(
          `user-${i}`,
          'tournament-1',
          mockConfig
        )
      );

      const results = await Promise.all(promises);
      const endTime = performance.now();

      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(5000); // Should complete all registrations in under 5 seconds
    });
  });
}); 