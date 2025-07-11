#!/usr/bin/env tsx

import { PerformanceTestSuite, generatePerformanceReport } from './PerformanceTestSuite';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 VGC Hub Performance Test Suite');
  console.log('=====================================\n');

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'full':
      await runFullTestSuite();
      break;
    case 'quick':
      await runQuickTestSuite();
      break;
    case 'stress':
      await runStressTest();
      break;
    case 'report':
      await generateReport();
      break;
    default:
      console.log('Usage: npm run performance:report [command]');
      console.log('\nCommands:');
      console.log('  full    - Run complete performance test suite');
      console.log('  quick   - Run quick performance tests');
      console.log('  stress  - Run stress tests only');
      console.log('  report  - Generate performance report');
      console.log('\nExamples:');
      console.log('  npm run performance:report full');
      console.log('  npm run performance:report quick');
      console.log('  npm run performance:report stress');
      break;
  }
}

async function runFullTestSuite() {
  console.log('📊 Running Full Performance Test Suite...\n');
  
  const startTime = Date.now();
  const testSuite = new PerformanceTestSuite();
  
  try {
    const results = await testSuite.runFullTestSuite();
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`\n✅ Full Test Suite Complete in ${duration.toFixed(2)}s`);
    console.log(`📈 Results: ${results.length} tests completed`);
    
    const passedTests = results.filter(r => r.success).length;
    const failedTests = results.length - passedTests;
    
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Success Rate: ${((passedTests / results.length) * 100).toFixed(1)}%`);

    // Generate and save report
    const report = testSuite.generateReport();
    await saveReport(report, 'full-performance-test');
    
    // Display summary
    displaySummary(results);
    
  } catch (error) {
    console.error('❌ Performance test suite failed:', error);
    process.exit(1);
  }
}

async function runQuickTestSuite() {
  console.log('📊 Running Quick Performance Test Suite...\n');
  
  const startTime = Date.now();
  const testSuite = new PerformanceTestSuite();
  
  try {
    // Run only baseline and concurrent user tests
    const baselineTest = testSuite['runBaselineTest']();
    const concurrentTest = testSuite['runConcurrentUserTest']();
    
    const results = await Promise.all([baselineTest, concurrentTest]);
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`\n✅ Quick Test Suite Complete in ${duration.toFixed(2)}s`);
    console.log(`📈 Results: ${results.length} tests completed`);
    
    const passedTests = results.filter(r => r.success).length;
    console.log(`✅ Passed: ${passedTests}/${results.length}`);

    // Generate and save report
    const report = generateQuickReport(results);
    await saveReport(report, 'quick-performance-test');
    
  } catch (error) {
    console.error('❌ Quick performance test suite failed:', error);
    process.exit(1);
  }
}

async function runStressTest() {
  console.log('📊 Running Stress Test...\n');
  
  const startTime = Date.now();
  const testSuite = new PerformanceTestSuite();
  
  try {
    const stressTest = await testSuite['runStressTest']();
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log(`\n✅ Stress Test Complete in ${duration.toFixed(2)}s`);
    console.log(`📊 Result: ${stressTest.success ? 'PASS' : 'FAIL'}`);
    console.log(`⏱️  Response Time: ${stressTest.metrics.responseTime.toFixed(2)}ms`);
    console.log(`📈 Throughput: ${stressTest.metrics.throughput.toFixed(2)} req/s`);
    console.log(`❌ Error Rate: ${(stressTest.metrics.errorRate * 100).toFixed(2)}%`);

    // Generate and save report
    const report = generateStressReport(stressTest);
    await saveReport(report, 'stress-test');
    
  } catch (error) {
    console.error('❌ Stress test failed:', error);
    process.exit(1);
  }
}

async function generateReport() {
  console.log('📊 Generating Performance Report...\n');
  
  try {
    const report = await generatePerformanceReport();
    await saveReport(report, 'performance-report');
    console.log('✅ Performance report generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate performance report:', error);
    process.exit(1);
  }
}

function displaySummary(results: any[]) {
  console.log('\n📊 Performance Summary:');
  console.log('========================');
  
  const avgResponseTime = results.reduce((sum, r) => sum + r.metrics.responseTime, 0) / results.length;
  const avgThroughput = results.reduce((sum, r) => sum + r.metrics.throughput, 0) / results.length;
  const avgErrorRate = results.reduce((sum, r) => sum + r.metrics.errorRate, 0) / results.length;
  
  console.log(`⏱️  Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`📈 Average Throughput: ${avgThroughput.toFixed(2)} req/s`);
  console.log(`❌ Average Error Rate: ${(avgErrorRate * 100).toFixed(2)}%`);
  
  // Performance recommendations
  console.log('\n💡 Recommendations:');
  if (avgResponseTime > 1000) {
    console.log('⚠️  Response time is high - consider optimizing database queries and caching');
  }
  if (avgErrorRate > 0.01) {
    console.log('⚠️  Error rate is above 1% - review error handling and system stability');
  }
  if (avgResponseTime <= 500 && avgErrorRate <= 0.005) {
    console.log('✅ Excellent performance! System is ready for production load');
  }
}

function generateQuickReport(results: any[]): string {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  
  let report = `
# Quick Performance Test Report
Generated: ${new Date().toISOString()}

## Summary
- Total Tests: ${totalTests}
- Passed: ${passedTests}
- Failed: ${totalTests - passedTests}
- Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%

## Test Results
`;

  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    report += `
### ${result.testName} ${status}
- Response Time: ${result.metrics.responseTime.toFixed(2)}ms
- Throughput: ${result.metrics.throughput.toFixed(2)} req/s
- Error Rate: ${(result.metrics.errorRate * 100).toFixed(2)}%
- Concurrent Users: ${result.metrics.concurrentUsers}

`;
  });

  return report;
}

function generateStressReport(result: any): string {
  const status = result.success ? '✅ PASS' : '❌ FAIL';
  
  return `
# Stress Test Report
Generated: ${new Date().toISOString()}

## Test Result: ${status}

### Metrics
- Response Time: ${result.metrics.responseTime.toFixed(2)}ms
- Throughput: ${result.metrics.throughput.toFixed(2)} req/s
- Error Rate: ${(result.metrics.errorRate * 100).toFixed(2)}%
- Memory Usage: ${(result.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
- CPU Usage: ${result.metrics.cpuUsage.toFixed(2)}%
- Concurrent Users: ${result.metrics.concurrentUsers}

### Configuration
- Duration: ${result.config.duration}s
- Ramp Up Time: ${result.config.rampUpTime}s
- Target Tournament: ${result.config.targetTournament.name}

### Analysis
${result.success ? 
  '✅ System handled stress test successfully. Performance is acceptable for production load.' :
  '❌ System failed stress test. Performance needs improvement before production deployment.'
}

### Recommendations
${result.metrics.responseTime > 2000 ? 
  '- ⚠️ Response time is too high. Consider optimizing database queries and implementing caching.' : 
  '- ✅ Response time is acceptable.'
}
${result.metrics.errorRate > 0.05 ? 
  '- ⚠️ Error rate is too high. Review error handling and system stability.' : 
  '- ✅ Error rate is acceptable.'
}
`;
}

async function saveReport(report: string, filename: string) {
  const reportsDir = path.join(process.cwd(), 'reports');
  
  // Create reports directory if it doesn't exist
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filepath = path.join(reportsDir, `${filename}-${timestamp}.md`);
  
  try {
    fs.writeFileSync(filepath, report);
    console.log(`📄 Report saved to: ${filepath}`);
  } catch (error) {
    console.error('❌ Failed to save report:', error);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Performance tests interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️  Performance tests terminated');
  process.exit(0);
});

// Run the main function
main().catch(error => {
  console.error('❌ Performance test runner failed:', error);
  process.exit(1);
}); 