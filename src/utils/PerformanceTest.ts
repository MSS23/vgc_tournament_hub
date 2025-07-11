import { RegistrationAttempt, ScalableTournamentConfig } from '../types';
import { RegistrationService } from '../services/RegistrationService';

export interface PerformanceTestConfig {
  concurrentUsers: number;
  duration: number; // seconds
  rampUpTime: number; // seconds
  tournamentId: string;
  registrationConfig: ScalableTournamentConfig;
}

export interface PerformanceTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  queueLength: number;
  systemHealth: {
    status: string;
    averageResponseTime: number;
    errorRate: number;
  };
}

export class PerformanceTest {
  private registrationService: RegistrationService;
  private results: RegistrationAttempt[] = [];
  private startTime: number = 0;
  private endTime: number = 0;

  constructor() {
    this.registrationService = RegistrationService.getInstance();
  }

  async runTest(config: PerformanceTestConfig): Promise<PerformanceTestResult> {
    console.log(`Starting performance test with ${config.concurrentUsers} concurrent users`);
    
    this.startTime = Date.now();
    this.results = [];

    // Create user IDs for testing
    const userIds = Array.from({ length: config.concurrentUsers }, (_, i) => `test-user-${i + 1}`);

    // Simulate ramp-up period
    const rampUpDelay = config.rampUpTime * 1000 / config.concurrentUsers;
    
    // Start concurrent registration attempts
    const promises = userIds.map((userId, index) => 
      this.simulateUserRegistration(userId, config, index * rampUpDelay)
    );

    // Wait for all registrations to complete
    await Promise.all(promises);

    this.endTime = Date.now();
    
    return this.calculateResults(config);
  }

  private async simulateUserRegistration(
    userId: string, 
    config: PerformanceTestConfig, 
    delay: number
  ): Promise<void> {
    // Simulate user delay
    await new Promise(resolve => setTimeout(resolve, delay));

    const startTime = Date.now();
    
    try {
      const attempt = await this.registrationService.registerForTournament(
        userId,
        config.tournamentId,
        config.registrationConfig
      );

      const responseTime = Date.now() - startTime;
      
      // Add response time to the attempt
      const attemptWithTiming = {
        ...attempt,
        responseTime
      };

      this.results.push(attemptWithTiming as any);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      this.results.push({
        id: `failed-${Date.now()}-${userId}`,
        userId,
        tournamentId: config.tournamentId,
        timestamp: new Date().toISOString(),
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        retryCount: 0,
        maxRetries: 3,
        responseTime
      } as any);
    }
  }

  private calculateResults(config: PerformanceTestConfig): PerformanceTestResult {
    const totalRequests = this.results.length;
    const successfulRequests = this.results.filter(r => r.status === 'success').length;
    const failedRequests = this.results.filter(r => r.status === 'failed').length;
    const queuedRequests = this.results.filter(r => r.status === 'queued').length;

    const responseTimes = this.results.map(r => (r as any).responseTime || 0);
    const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const maxResponseTime = Math.max(...responseTimes);
    const minResponseTime = Math.min(...responseTimes);

    const testDuration = (this.endTime - this.startTime) / 1000; // seconds
    const requestsPerSecond = totalRequests / testDuration;
    const errorRate = (failedRequests / totalRequests) * 100;

    // Get system health from registration service
    const systemHealth = this.registrationService.getSystemHealth();
    const realTimeStats = this.registrationService.getRealTimeStats(config.tournamentId);

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime,
      maxResponseTime,
      minResponseTime,
      requestsPerSecond,
      errorRate,
      queueLength: realTimeStats.queueLength,
      systemHealth: {
        status: systemHealth.status,
        averageResponseTime: systemHealth.metrics.averageResponseTime,
        errorRate: systemHealth.metrics.errorRate * 100
      }
    };
  }

  // Simulate different load patterns
  static async simulateSpikeLoad(config: PerformanceTestConfig): Promise<PerformanceTestResult> {
    const test = new PerformanceTest();
    
    // Simulate sudden spike in traffic
    const spikeConfig = {
      ...config,
      concurrentUsers: config.concurrentUsers * 3, // 3x spike
      duration: config.duration / 2, // Shorter duration
      rampUpTime: 10 // Quick ramp-up
    };

    return test.runTest(spikeConfig);
  }

  static async simulateSustainedLoad(config: PerformanceTestConfig): Promise<PerformanceTestResult> {
    const test = new PerformanceTest();
    
    // Simulate sustained high load
    const sustainedConfig = {
      ...config,
      duration: config.duration * 2, // Longer duration
      rampUpTime: config.rampUpTime * 2 // Gradual ramp-up
    };

    return test.runTest(sustainedConfig);
  }

  static async simulateGradualLoad(config: PerformanceTestConfig): Promise<PerformanceTestResult> {
    const test = new PerformanceTest();
    
    // Simulate gradual increase in load
    const gradualConfig = {
      ...config,
      rampUpTime: config.duration * 0.8 // 80% of time for ramp-up
    };

    return test.runTest(gradualConfig);
  }

  // Generate test report
  static generateReport(results: PerformanceTestResult[]): string {
    const report = {
      summary: {
        totalTests: results.length,
        averageSuccessRate: results.reduce((sum, r) => sum + (r.successfulRequests / r.totalRequests), 0) / results.length * 100,
        averageResponseTime: results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length,
        averageErrorRate: results.reduce((sum, r) => sum + r.errorRate, 0) / results.length
      },
      details: results.map((result, index) => ({
        test: index + 1,
        ...result
      }))
    };

    return JSON.stringify(report, null, 2);
  }
}

// Utility functions for testing
export const createTestConfig = (
  concurrentUsers: number = 1000,
  duration: number = 300
): PerformanceTestConfig => ({
  concurrentUsers,
  duration,
  rampUpTime: 60,
  tournamentId: 'test-tournament-1',
  registrationConfig: {
    id: 'test-config',
    tournamentId: 'test-tournament-1',
    maxConcurrentRegistrations: 1000,
    rateLimitPerUser: 5,
    rateLimitPerIP: 10,
    queueEnabled: true,
    maxQueueSize: 10000,
    queueTimeoutMinutes: 30,
    useReadReplicas: true,
    cacheEnabled: true,
    cacheTTL: 300,
    enableRealTimeMonitoring: true,
    alertThresholds: {
      queueLength: 5000,
      errorRate: 0.05,
      responseTime: 2000,
      registrationRate: 100
    },
    fallbackMode: 'graceful_degradation',
    emergencyContact: 'admin@vgchub.com'
  }
});

// Example usage
export const runPerformanceTests = async () => {
  console.log('Starting comprehensive performance tests...');

  const baseConfig = createTestConfig(1000, 300);

  try {
    // Test 1: Normal load
    console.log('Test 1: Normal load');
    const normalLoad = await PerformanceTest.simulateSustainedLoad(baseConfig);
    console.log('Normal load results:', normalLoad);

    // Test 2: Spike load
    console.log('Test 2: Spike load');
    const spikeLoad = await PerformanceTest.simulateSpikeLoad(baseConfig);
    console.log('Spike load results:', spikeLoad);

    // Test 3: Gradual load
    console.log('Test 3: Gradual load');
    const gradualLoad = await PerformanceTest.simulateGradualLoad(baseConfig);
    console.log('Gradual load results:', gradualLoad);

    // Generate report
    const report = PerformanceTest.generateReport([normalLoad, spikeLoad, gradualLoad]);
    console.log('Performance test report:', report);

    return {
      normalLoad,
      spikeLoad,
      gradualLoad,
      report
    };

  } catch (error) {
    console.error('Performance test failed:', error);
    throw error;
  }
};

export default PerformanceTest; 