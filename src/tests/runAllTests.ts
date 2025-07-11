#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface TestResult {
  type: string;
  passed: number;
  failed: number;
  total: number;
  duration: number;
  errors: string[];
}

interface TestReport {
  timestamp: string;
  summary: {
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalDuration: number;
    successRate: number;
  };
  results: TestResult[];
  coverage?: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  performance?: {
    averageResponseTime: number;
    maxResponseTime: number;
    throughput: number;
  };
}

class TestRunner {
  private results: TestResult[] = [];
  private startTime: number = 0;

  async runAllTests(): Promise<TestReport> {
    console.log('🚀 Starting comprehensive test suite...\n');
    this.startTime = Date.now();

    try {
      // Run unit tests
      await this.runUnitTests();

      // Run integration tests
      await this.runIntegrationTests();

      // Run performance tests
      await this.runPerformanceTests();

      // Run E2E tests (if Playwright is available)
      await this.runE2ETests();

      // Generate coverage report
      await this.generateCoverageReport();

      // Generate final report
      const report = this.generateReport();
      this.saveReport(report);

      return report;
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }

  private async runUnitTests(): Promise<void> {
    console.log('📋 Running unit tests...');
    const startTime = Date.now();

    try {
      const output = execSync('npm run test:unit -- --verbose --json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const duration = Date.now() - startTime;
      const result = this.parseJestOutput(output, 'Unit Tests', duration);
      this.results.push(result);

      console.log(`✅ Unit tests completed: ${result.passed}/${result.total} passed (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result = this.parseJestError(error, 'Unit Tests', duration);
      this.results.push(result);

      console.log(`❌ Unit tests failed: ${result.failed}/${result.total} failed (${duration}ms)`);
    }
  }

  private async runIntegrationTests(): Promise<void> {
    console.log('🔗 Running integration tests...');
    const startTime = Date.now();

    try {
      const output = execSync('npm run test:integration -- --verbose --json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const duration = Date.now() - startTime;
      const result = this.parseJestOutput(output, 'Integration Tests', duration);
      this.results.push(result);

      console.log(`✅ Integration tests completed: ${result.passed}/${result.total} passed (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result = this.parseJestError(error, 'Integration Tests', duration);
      this.results.push(result);

      console.log(`❌ Integration tests failed: ${result.failed}/${result.total} failed (${duration}ms)`);
    }
  }

  private async runPerformanceTests(): Promise<void> {
    console.log('⚡ Running performance tests...');
    const startTime = Date.now();

    try {
      const output = execSync('npm run test:performance -- --verbose --json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const duration = Date.now() - startTime;
      const result = this.parseJestOutput(output, 'Performance Tests', duration);
      this.results.push(result);

      console.log(`✅ Performance tests completed: ${result.passed}/${result.total} passed (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result = this.parseJestError(error, 'Performance Tests', duration);
      this.results.push(result);

      console.log(`❌ Performance tests failed: ${result.failed}/${result.total} failed (${duration}ms)`);
    }
  }

  private async runE2ETests(): Promise<void> {
    console.log('🌐 Running E2E tests...');
    const startTime = Date.now();

    try {
      const output = execSync('npm run test:e2e -- --reporter=json', {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      const duration = Date.now() - startTime;
      const result = this.parsePlaywrightOutput(output, 'E2E Tests', duration);
      this.results.push(result);

      console.log(`✅ E2E tests completed: ${result.passed}/${result.total} passed (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const result = this.parsePlaywrightError(error, 'E2E Tests', duration);
      this.results.push(result);

      console.log(`❌ E2E tests failed: ${result.failed}/${result.total} failed (${duration}ms)`);
    }
  }

  private async generateCoverageReport(): Promise<void> {
    console.log('📊 Generating coverage report...');

    try {
      execSync('npm run test:coverage', {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      console.log('✅ Coverage report generated');
    } catch (error) {
      console.log('⚠️ Coverage report generation failed');
    }
  }

  private parseJestOutput(output: string, type: string, duration: number): TestResult {
    try {
      const lines = output.split('\n');
      const jsonLine = lines.find(line => line.startsWith('{"'));
      
      if (jsonLine) {
        const data = JSON.parse(jsonLine);
        return {
          type,
          passed: data.numPassedTests || 0,
          failed: data.numFailedTests || 0,
          total: data.numTotalTests || 0,
          duration,
          errors: data.testResults?.flatMap((result: any) => 
            result.assertionResults?.filter((assertion: any) => assertion.status === 'failed')
              .map((assertion: any) => `${result.name}: ${assertion.title}`) || []
          ) || []
        };
      }
    } catch (error) {
      console.warn('Failed to parse Jest output:', error);
    }

    // Fallback parsing
    const passed = (output.match(/✓/g) || []).length;
    const failed = (output.match(/✗/g) || []).length;
    const total = passed + failed;

    return {
      type,
      passed,
      failed,
      total,
      duration,
      errors: []
    };
  }

  private parseJestError(error: any, type: string, duration: number): TestResult {
    const output = error.stdout || error.stderr || '';
    return this.parseJestOutput(output, type, duration);
  }

  private parsePlaywrightOutput(output: string, type: string, duration: number): TestResult {
    try {
      const data = JSON.parse(output);
      return {
        type,
        passed: data.stats.passed || 0,
        failed: data.stats.failed || 0,
        total: data.stats.total || 0,
        duration,
        errors: data.suites?.flatMap((suite: any) => 
          suite.specs?.flatMap((spec: any) => 
            spec.tests?.filter((test: any) => test.results?.some((r: any) => r.status === 'failed'))
              .map((test: any) => `${spec.title}: ${test.title}`) || []
          ) || []
        ) || []
      };
    } catch (error) {
      console.warn('Failed to parse Playwright output:', error);
      return {
        type,
        passed: 0,
        failed: 0,
        total: 0,
        duration,
        errors: []
      };
    }
  }

  private parsePlaywrightError(error: any, type: string, duration: number): TestResult {
    const output = error.stdout || error.stderr || '';
    return this.parsePlaywrightOutput(output, type, duration);
  }

  private generateReport(): TestReport {
    const totalDuration = Date.now() - this.startTime;
    const totalTests = this.results.reduce((sum, result) => sum + result.total, 0);
    const totalPassed = this.results.reduce((sum, result) => sum + result.passed, 0);
    const totalFailed = this.results.reduce((sum, result) => sum + result.failed, 0);
    const successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        totalDuration,
        successRate
      },
      results: this.results
    };
  }

  private saveReport(report: TestReport): void {
    try {
      // Create reports directory if it doesn't exist
      const reportsDir = join(process.cwd(), 'test-reports');
      mkdirSync(reportsDir, { recursive: true });

      // Save JSON report
      const jsonPath = join(reportsDir, `test-report-${Date.now()}.json`);
      writeFileSync(jsonPath, JSON.stringify(report, null, 2));

      // Save HTML report
      const htmlPath = join(reportsDir, `test-report-${Date.now()}.html`);
      const htmlContent = this.generateHTMLReport(report);
      writeFileSync(htmlPath, htmlContent);

      console.log(`📄 Test reports saved to:`);
      console.log(`   JSON: ${jsonPath}`);
      console.log(`   HTML: ${htmlPath}`);
    } catch (error) {
      console.error('Failed to save test report:', error);
    }
  }

  private generateHTMLReport(report: TestReport): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VGC Hub Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .summary-card.success { border-left: 4px solid #4caf50; }
        .summary-card.failure { border-left: 4px solid #f44336; }
        .summary-card.warning { border-left: 4px solid #ff9800; }
        .results { margin-bottom: 30px; }
        .result-item { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 15px; }
        .result-item.success { border-left: 4px solid #4caf50; }
        .result-item.failure { border-left: 4px solid #f44336; }
        .errors { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin-top: 10px; }
        .error-item { color: #856404; margin-bottom: 5px; }
        .progress-bar { width: 100%; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #4caf50, #8bc34a); transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="header">
        <h1>VGC Hub Test Report</h1>
        <p>Generated on: ${new Date(report.timestamp).toLocaleString()}</p>
    </div>

    <div class="summary">
        <div class="summary-card ${report.summary.successRate >= 90 ? 'success' : report.summary.successRate >= 70 ? 'warning' : 'failure'}">
            <h3>Success Rate</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${report.summary.successRate}%"></div>
            </div>
            <p><strong>${report.summary.successRate.toFixed(1)}%</strong></p>
        </div>
        <div class="summary-card">
            <h3>Total Tests</h3>
            <p><strong>${report.summary.totalTests}</strong></p>
        </div>
        <div class="summary-card success">
            <h3>Passed</h3>
            <p><strong>${report.summary.totalPassed}</strong></p>
        </div>
        <div class="summary-card failure">
            <h3>Failed</h3>
            <p><strong>${report.summary.totalFailed}</strong></p>
        </div>
        <div class="summary-card">
            <h3>Duration</h3>
            <p><strong>${(report.summary.totalDuration / 1000).toFixed(2)}s</strong></p>
        </div>
    </div>

    <div class="results">
        <h2>Test Results</h2>
        ${report.results.map(result => `
            <div class="result-item ${result.failed === 0 ? 'success' : 'failure'}">
                <h3>${result.type}</h3>
                <p><strong>${result.passed}</strong> passed, <strong>${result.failed}</strong> failed, <strong>${result.total}</strong> total (${result.duration}ms)</p>
                ${result.errors.length > 0 ? `
                    <div class="errors">
                        <h4>Errors:</h4>
                        ${result.errors.map(error => `<div class="error-item">• ${error}</div>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>
    `;
  }

  printSummary(report: TestReport): void {
    console.log('\n📊 Test Summary');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.totalPassed}`);
    console.log(`Failed: ${report.summary.totalFailed}`);
    console.log(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
    console.log(`Total Duration: ${(report.summary.totalDuration / 1000).toFixed(2)}s`);
    console.log('='.repeat(50));

    console.log('\n📋 Detailed Results:');
    report.results.forEach(result => {
      const status = result.failed === 0 ? '✅' : '❌';
      console.log(`${status} ${result.type}: ${result.passed}/${result.total} passed (${result.duration}ms)`);
    });

    if (report.summary.totalFailed > 0) {
      console.log('\n❌ Failed Tests:');
      report.results.forEach(result => {
        if (result.errors.length > 0) {
          console.log(`\n${result.type}:`);
          result.errors.forEach(error => console.log(`  • ${error}`));
        }
      });
    }

    console.log('\n🎯 Overall Status:', report.summary.successRate >= 90 ? '✅ EXCELLENT' : 
                                       report.summary.successRate >= 70 ? '⚠️ GOOD' : '❌ NEEDS IMPROVEMENT');
  }
}

// Main execution
async function main() {
  const runner = new TestRunner();
  
  try {
    const report = await runner.runAllTests();
    runner.printSummary(report);
    
    // Exit with appropriate code
    process.exit(report.summary.totalFailed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Test suite execution failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { TestRunner, TestReport, TestResult }; 