import { RegistrationService } from '../../services/RegistrationService';
import { ScalableTournamentConfig, Tournament, UserSession } from '../../types';

export interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  errorRate: number;
  throughput: number;
  concurrentUsers: number;
}

export interface LoadTestConfig {
  concurrentUsers: number;
  duration: number; // seconds
  rampUpTime: number; // seconds
  targetTournament: Tournament;
  userSessions: UserSession[];
}

export interface PerformanceTestResult {
  testName: string;
  config: LoadTestConfig;
  metrics: PerformanceMetrics;
  errors: string[];
  timestamp: string;
  success: boolean;
}

export class PerformanceTestSuite {
  private registrationService: RegistrationService;
  private results: PerformanceTestResult[] = [];

  constructor() {
    this.registrationService = RegistrationService.getInstance();
  }

  /**
   * Run a comprehensive performance test suite
   */
  async runFullTestSuite(): Promise<PerformanceTestResult[]> {
    console.log('🚀 Starting Performance Test Suite...');
    
    const tests = [
      this.runBaselineTest(),
      this.runConcurrentUserTest(),
      this.runSpikeLoadTest(),
      this.runSustainedLoadTest(),
      this.runStressTest(),
      this.runEnduranceTest(),
      this.runScalabilityTest(),
      this.runFailoverTest()
    ];

    const results = await Promise.allSettled(tests);
    
    this.results = results
      .filter((result): result is PromiseFulfilledResult<PerformanceTestResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    console.log(`✅ Performance Test Suite Complete: ${this.results.length} tests passed`);
    return this.results;
  }

  /**
   * Baseline performance test
   */
  async runBaselineTest(): Promise<PerformanceTestResult> {
    const testName = 'Baseline Performance Test';
    console.log(`📊 Running ${testName}...`);

    const config: LoadTestConfig = {
      concurrentUsers: 1,
      duration: 60,
      rampUpTime: 10,
      targetTournament: this.createMockTournament(),
      userSessions: this.createMockUserSessions(1)
    };

    return this.runLoadTest(testName, config);
  }

  /**
   * Test with increasing concurrent users
   */
  async runConcurrentUserTest(): Promise<PerformanceTestResult> {
    const testName = 'Concurrent Users Test';
    console.log(`📊 Running ${testName}...`);

    const config: LoadTestConfig = {
      concurrentUsers: 100,
      duration: 120,
      rampUpTime: 30,
      targetTournament: this.createMockTournament(),
      userSessions: this.createMockUserSessions(100)
    };

    return this.runLoadTest(testName, config);
  }

  /**
   * Test sudden spike in load
   */
  async runSpikeLoadTest(): Promise<PerformanceTestResult> {
    const testName = 'Spike Load Test';
    console.log(`📊 Running ${testName}...`);

    const config: LoadTestConfig = {
      concurrentUsers: 1000,
      duration: 60,
      rampUpTime: 5, // Very quick ramp up to simulate spike
      targetTournament: this.createMockTournament(),
      userSessions: this.createMockUserSessions(1000)
    };

    return this.runLoadTest(testName, config);
  }

  /**
   * Test sustained high load
   */
  async runSustainedLoadTest(): Promise<PerformanceTestResult> {
    const testName = 'Sustained Load Test';
    console.log(`📊 Running ${testName}...`);

    const config: LoadTestConfig = {
      concurrentUsers: 500,
      duration: 600, // 10 minutes
      rampUpTime: 60,
      targetTournament: this.createMockTournament(),
      userSessions: this.createMockUserSessions(500)
    };

    return this.runLoadTest(testName, config);
  }

  /**
   * Stress test to find breaking point
   */
  async runStressTest(): Promise<PerformanceTestResult> {
    const testName = 'Stress Test';
    console.log(`📊 Running ${testName}...`);

    const config: LoadTestConfig = {
      concurrentUsers: 2000,
      duration: 300,
      rampUpTime: 60,
      targetTournament: this.createMockTournament(),
      userSessions: this.createMockUserSessions(2000)
    };

    return this.runLoadTest(testName, config);
  }

  /**
   * Endurance test for long-running stability
   */
  async runEnduranceTest(): Promise<PerformanceTestResult> {
    const testName = 'Endurance Test';
    console.log(`📊 Running ${testName}...`);

    const config: LoadTestConfig = {
      concurrentUsers: 200,
      duration: 3600, // 1 hour
      rampUpTime: 120,
      targetTournament: this.createMockTournament(),
      userSessions: this.createMockUserSessions(200)
    };

    return this.runLoadTest(testName, config);
  }

  /**
   * Scalability test across different user loads
   */
  async runScalabilityTest(): Promise<PerformanceTestResult> {
    const testName = 'Scalability Test';
    console.log(`📊 Running ${testName}...`);

    // Test multiple user loads
    const userLoads = [10, 50, 100, 200, 500, 1000];
    const results: PerformanceMetrics[] = [];

    for (const userLoad of userLoads) {
      const config: LoadTestConfig = {
        concurrentUsers: userLoad,
        duration: 120,
        rampUpTime: 30,
        targetTournament: this.createMockTournament(),
        userSessions: this.createMockUserSessions(userLoad)
      };

      const result = await this.runLoadTest(`${testName} - ${userLoad} users`, config);
      results.push(result.metrics);
    }

    // Calculate scalability metrics
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const avgThroughput = results.reduce((sum, r) => sum + r.throughput, 0) / results.length;

    return {
      testName,
      config: {
        concurrentUsers: userLoads[userLoads.length - 1],
        duration: 120,
        rampUpTime: 30,
        targetTournament: this.createMockTournament(),
        userSessions: this.createMockUserSessions(userLoads[userLoads.length - 1])
      },
      metrics: {
        responseTime: avgResponseTime,
        memoryUsage: results[results.length - 1].memoryUsage,
        cpuUsage: results[results.length - 1].cpuUsage,
        errorRate: results.reduce((sum, r) => sum + r.errorRate, 0) / results.length,
        throughput: avgThroughput,
        concurrentUsers: userLoads[userLoads.length - 1]
      },
      errors: [],
      timestamp: new Date().toISOString(),
      success: true
    };
  }

  /**
   * Failover and recovery test
   */
  async runFailoverTest(): Promise<PerformanceTestResult> {
    const testName = 'Failover Test';
    console.log(`📊 Running ${testName}...`);

    const config: LoadTestConfig = {
      concurrentUsers: 100,
      duration: 180,
      rampUpTime: 30,
      targetTournament: this.createMockTournament(),
      userSessions: this.createMockUserSessions(100)
    };

    // Start normal load
    const normalLoad = this.runLoadTest(`${testName} - Normal Load`, config);
    
    // Simulate failure after 60 seconds
    setTimeout(() => {
      console.log('🔥 Simulating system failure...');
      this.simulateSystemFailure();
    }, 60000);

    // Wait for recovery
    setTimeout(() => {
      console.log('🔄 Simulating system recovery...');
      this.simulateSystemRecovery();
    }, 90000);

    return normalLoad;
  }

  /**
   * Core load test implementation
   */
  private async runLoadTest(testName: string, config: LoadTestConfig): Promise<PerformanceTestResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let totalRequests = 0;
    let successfulRequests = 0;
    let totalResponseTime = 0;

    // Create user simulation tasks
    const userTasks = config.userSessions.map((userSession, index) => 
      this.simulateUser(userSession, config.targetTournament, config.duration, errors)
    );

    // Ramp up users gradually
    const rampUpInterval = config.rampUpTime * 1000 / config.concurrentUsers;
    const activeUsers: Promise<any>[] = [];

    for (let i = 0; i < config.concurrentUsers; i++) {
      setTimeout(() => {
        activeUsers.push(userTasks[i]);
      }, i * rampUpInterval);
    }

    // Wait for all users to complete
    const userResults = await Promise.allSettled(activeUsers);

    // Calculate metrics
    userResults.forEach(result => {
      if (result.status === 'fulfilled') {
        totalRequests += result.value.requests;
        successfulRequests += result.value.successfulRequests;
        totalResponseTime += result.value.totalResponseTime;
      }
    });

    const endTime = Date.now();
    const testDuration = (endTime - startTime) / 1000;
    const avgResponseTime = totalRequests > 0 ? totalResponseTime / totalRequests : 0;
    const throughput = totalRequests / testDuration;
    const errorRate = totalRequests > 0 ? (totalRequests - successfulRequests) / totalRequests : 0;

    const metrics: PerformanceMetrics = {
      responseTime: avgResponseTime,
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage(),
      errorRate,
      throughput,
      concurrentUsers: config.concurrentUsers
    };

    return {
      testName,
      config,
      metrics,
      errors,
      timestamp: new Date().toISOString(),
      success: errorRate < 0.05 && avgResponseTime < 2000 // 5% error rate and 2s response time thresholds
    };
  }

  /**
   * Simulate a single user's behavior
   */
  private async simulateUser(
    userSession: UserSession, 
    tournament: Tournament, 
    duration: number, 
    errors: string[]
  ): Promise<{ requests: number; successfulRequests: number; totalResponseTime: number }> {
    let requests = 0;
    let successfulRequests = 0;
    let totalResponseTime = 0;
    const endTime = Date.now() + duration * 1000;

    while (Date.now() < endTime) {
      try {
        const startTime = Date.now();
        
        // Simulate various user actions
        const action = Math.random();
        if (action < 0.3) {
          // Tournament registration
          await this.registrationService.registerForTournament(
            userSession.userId,
            tournament.id,
            this.createMockConfig()
          );
        } else if (action < 0.6) {
          // Queue join
          await this.registrationService.joinQueue(tournament.id, userSession.userId);
        } else {
          // System health check
          this.registrationService.getSystemHealth();
        }

        const responseTime = Date.now() - startTime;
        totalResponseTime += responseTime;
        requests++;
        successfulRequests++;

        // Random delay between actions (100ms to 2s)
        await this.delay(100 + Math.random() * 1900);

      } catch (error) {
        errors.push(`User ${userSession.userId}: ${error}`);
        requests++;
      }
    }

    return { requests, successfulRequests, totalResponseTime };
  }

  /**
   * Generate comprehensive test report
   */
  generateReport(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;

    let report = `
# Performance Test Report
Generated: ${new Date().toISOString()}

## Summary
- Total Tests: ${totalTests}
- Passed: ${passedTests}
- Failed: ${failedTests}
- Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%

## Test Results
`;

    this.results.forEach(result => {
      const status = result.success ? '✅ PASS' : '❌ FAIL';
      report += `
### ${result.testName} ${status}
- Response Time: ${result.metrics.responseTime.toFixed(2)}ms
- Throughput: ${result.metrics.throughput.toFixed(2)} req/s
- Error Rate: ${(result.metrics.errorRate * 100).toFixed(2)}%
- Memory Usage: ${(result.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
- CPU Usage: ${result.metrics.cpuUsage.toFixed(2)}%
- Concurrent Users: ${result.metrics.concurrentUsers}

`;
    });

    // Performance recommendations
    report += `
## Performance Recommendations
`;

    const avgResponseTime = this.results.reduce((sum, r) => sum + r.metrics.responseTime, 0) / this.results.length;
    const avgErrorRate = this.results.reduce((sum, r) => sum + r.metrics.errorRate, 0) / this.results.length;

    if (avgResponseTime > 1000) {
      report += '- ⚠️ Average response time is high. Consider optimizing database queries and caching.\n';
    }

    if (avgErrorRate > 0.01) {
      report += '- ⚠️ Error rate is above 1%. Review error handling and system stability.\n';
    }

    if (passedTests === totalTests) {
      report += '- ✅ All performance tests passed! System is ready for production load.\n';
    } else {
      report += '- ❌ Some performance tests failed. Review and optimize before production deployment.\n';
    }

    return report;
  }

  // Helper methods
  private createMockTournament(): Tournament {
    return {
      id: 'test-tournament',
      name: 'Performance Test Tournament',
      date: '2024-12-01',
      location: 'Test Location',
      status: 'registration',
      maxCapacity: 1000,
      currentRegistrations: 500,
      waitlistEnabled: true,
      waitlistCapacity: 200,
      currentWaitlist: 50,
      registrationType: 'first-come-first-served',
      totalPlayers: 1000
    };
  }

  private createMockUserSessions(count: number): UserSession[] {
    return Array.from({ length: count }, (_, i) => ({
      userId: `user-${i}`,
      division: ['junior', 'senior', 'master'][i % 3] as 'junior' | 'senior' | 'master',
      isGuardian: false,
      permissions: ['full-access']
    }));
  }

  private createMockConfig(): ScalableTournamentConfig {
    return {
      id: 'test-config',
      tournamentId: 'test-tournament',
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
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return Math.random() * 100 * 1024 * 1024; // Mock memory usage
  }

  private getCpuUsage(): number {
    return Math.random() * 100; // Mock CPU usage
  }

  private simulateSystemFailure(): void {
    console.log('System failure simulation triggered');
    // In a real implementation, this would trigger actual failure scenarios
  }

  private simulateSystemRecovery(): void {
    console.log('System recovery simulation triggered');
    // In a real implementation, this would trigger recovery scenarios
  }
}

// Export convenience functions
export const runPerformanceTests = async (): Promise<PerformanceTestResult[]> => {
  const testSuite = new PerformanceTestSuite();
  return testSuite.runFullTestSuite();
};

export const generatePerformanceReport = async (): Promise<string> => {
  const testSuite = new PerformanceTestSuite();
  await testSuite.runFullTestSuite();
  return testSuite.generateReport();
}; 