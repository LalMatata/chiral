#!/usr/bin/env node

// Rate Limiting Test Script for CHIRAL Contact Form
// Tests rapid request submission to identify rate limiting vulnerabilities

// Using built-in fetch (Node 18+)

const BASE_URL = 'http://localhost:3001';
const CONTACT_ENDPOINT = `${BASE_URL}/api/contact`;

// Test configuration
const CONCURRENT_REQUESTS = 50;
const RAPID_REQUESTS = 100;
const DELAY_BETWEEN_BATCHES = 1000; // ms

async function testRateLimit() {
    console.log('🚀 Starting Rate Limit Testing for CHIRAL System');
    console.log('============================================\n');
    
    const testData = {
        name: 'Rate Limit Test',
        email: 'test@example.com',
        company: 'Test Company',
        message: 'This is a rate limit test message'
    };

    // Test 1: Rapid Sequential Requests
    console.log('Test 1: Rapid Sequential Requests');
    console.log('-'.repeat(40));
    
    const sequentialStart = Date.now();
    let successCount = 0;
    let errorCount = 0;
    let responses = [];
    
    for (let i = 0; i < RAPID_REQUESTS; i++) {
        try {
            const startTime = Date.now();
            const response = await fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...testData,
                    email: `test${i}@example.com`
                })
            });
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            const result = {
                requestId: i + 1,
                status: response.status,
                statusText: response.statusText,
                responseTime: responseTime
            };
            
            if (response.ok) {
                successCount++;
                result.body = await response.text();
            } else {
                errorCount++;
                result.error = await response.text();
            }
            
            responses.push(result);
            
            // Log progress every 10 requests
            if ((i + 1) % 10 === 0) {
                console.log(`Progress: ${i + 1}/${RAPID_REQUESTS} requests sent`);
            }
            
        } catch (error) {
            errorCount++;
            responses.push({
                requestId: i + 1,
                error: error.message,
                responseTime: null
            });
        }
    }
    
    const sequentialEnd = Date.now();
    const totalTime = sequentialEnd - sequentialStart;
    
    console.log(`\nSequential Test Results:`);
    console.log(`- Total requests: ${RAPID_REQUESTS}`);
    console.log(`- Successful: ${successCount}`);
    console.log(`- Failed: ${errorCount}`);
    console.log(`- Total time: ${totalTime}ms`);
    console.log(`- Average time per request: ${(totalTime / RAPID_REQUESTS).toFixed(2)}ms`);
    
    // Calculate response time statistics
    const validResponseTimes = responses.filter(r => r.responseTime).map(r => r.responseTime);
    if (validResponseTimes.length > 0) {
        const avgResponseTime = validResponseTimes.reduce((a, b) => a + b, 0) / validResponseTimes.length;
        const minResponseTime = Math.min(...validResponseTimes);
        const maxResponseTime = Math.max(...validResponseTimes);
        
        console.log(`- Average response time: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`- Min response time: ${minResponseTime}ms`);
        console.log(`- Max response time: ${maxResponseTime}ms`);
    }
    
    // Show error breakdown
    const errorBreakdown = {};
    responses.filter(r => r.status && r.status !== 200).forEach(r => {
        const key = `${r.status} ${r.statusText}`;
        errorBreakdown[key] = (errorBreakdown[key] || 0) + 1;
    });
    
    if (Object.keys(errorBreakdown).length > 0) {
        console.log('\nError Breakdown:');
        Object.entries(errorBreakdown).forEach(([error, count]) => {
            console.log(`- ${error}: ${count} occurrences`);
        });
    }
    
    // Test 2: Concurrent Requests
    console.log('\n\nTest 2: Concurrent Requests');
    console.log('-'.repeat(40));
    
    const concurrentStart = Date.now();
    const concurrentPromises = [];
    
    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
        const promise = fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...testData,
                email: `concurrent${i}@example.com`
            })
        }).then(async (response) => {
            return {
                requestId: i + 1,
                status: response.status,
                statusText: response.statusText,
                body: response.ok ? await response.text() : await response.text()
            };
        }).catch(error => ({
            requestId: i + 1,
            error: error.message
        }));
        
        concurrentPromises.push(promise);
    }
    
    const concurrentResults = await Promise.all(concurrentPromises);
    const concurrentEnd = Date.now();
    const concurrentTotalTime = concurrentEnd - concurrentStart;
    
    const concurrentSuccess = concurrentResults.filter(r => r.status === 200).length;
    const concurrentError = concurrentResults.length - concurrentSuccess;
    
    console.log(`Concurrent Test Results:`);
    console.log(`- Total requests: ${CONCURRENT_REQUESTS}`);
    console.log(`- Successful: ${concurrentSuccess}`);
    console.log(`- Failed: ${concurrentError}`);
    console.log(`- Total time: ${concurrentTotalTime}ms`);
    
    // Test 3: Burst Testing (waves of requests)
    console.log('\n\nTest 3: Burst Testing (5 waves of 10 requests)');
    console.log('-'.repeat(40));
    
    let totalBurstSuccess = 0;
    let totalBurstError = 0;
    
    for (let wave = 0; wave < 5; wave++) {
        console.log(`\nWave ${wave + 1}:`);
        const waveStart = Date.now();
        const wavePromises = [];
        
        for (let i = 0; i < 10; i++) {
            const promise = fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...testData,
                    email: `wave${wave}_${i}@example.com`
                })
            });
            wavePromises.push(promise);
        }
        
        const waveResults = await Promise.allSettled(wavePromises);
        const waveEnd = Date.now();
        
        let waveSuccess = 0;
        let waveError = 0;
        
        for (const result of waveResults) {
            if (result.status === 'fulfilled' && result.value.ok) {
                waveSuccess++;
            } else {
                waveError++;
            }
        }
        
        totalBurstSuccess += waveSuccess;
        totalBurstError += waveError;
        
        console.log(`- Success: ${waveSuccess}, Errors: ${waveError}, Time: ${waveEnd - waveStart}ms`);
        
        // Wait between waves
        if (wave < 4) {
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
    }
    
    console.log(`\nBurst Test Summary:`);
    console.log(`- Total successful: ${totalBurstSuccess}/50`);
    console.log(`- Total failed: ${totalBurstError}/50`);
    
    // Rate Limit Analysis
    console.log('\n\n📊 RATE LIMIT ANALYSIS');
    console.log('='.repeat(40));
    
    if (errorCount === 0 && concurrentError === 0 && totalBurstError === 0) {
        console.log('❌ CRITICAL: No rate limiting detected!');
        console.log('   The system accepted all requests without throttling.');
        console.log('   This could lead to DoS attacks and resource exhaustion.');
    } else {
        console.log('✅ Some form of rate limiting or error handling detected.');
        console.log('   However, review the specific error messages to confirm');
        console.log('   these are intentional rate limits vs. system failures.');
    }
    
    // Resource exhaustion warnings
    if (validResponseTimes.length > 0) {
        const avgTime = validResponseTimes.reduce((a, b) => a + b, 0) / validResponseTimes.length;
        const maxTime = Math.max(...validResponseTimes);
        
        if (avgTime > 1000) {
            console.log('⚠️  WARNING: Average response time > 1 second');
            console.log('    This may indicate system stress or inefficient handling');
        }
        
        if (maxTime > 5000) {
            console.log('⚠️  WARNING: Max response time > 5 seconds');
            console.log('    This suggests potential timeout or resource issues');
        }
    }
    
    console.log('\n🔍 RECOMMENDATIONS:');
    console.log('- Implement rate limiting (e.g., max 5 requests per minute per IP)');
    console.log('- Add request queuing for high load scenarios');
    console.log('- Implement CAPTCHA for suspicious activity');
    console.log('- Monitor server resources during high load');
    console.log('- Add proper error responses for rate limit violations');
    
    return {
        sequential: { success: successCount, error: errorCount, totalTime },
        concurrent: { success: concurrentSuccess, error: concurrentError, totalTime: concurrentTotalTime },
        burst: { success: totalBurstSuccess, error: totalBurstError }
    };
}

// Run the test
testRateLimit().catch(console.error);