// Concurrent User Testing for CHIRAL Contact Form
// Tests multiple simultaneous submissions, race conditions, and data corruption

const BASE_URL = 'http://localhost:3001';
const CONTACT_ENDPOINT = `${BASE_URL}/api/contact`;

async function testConcurrentUsers() {
    console.log('👥 Starting Concurrent User Testing for CHIRAL Contact Form');
    console.log('========================================================\n');
    
    const results = {
        tests: [],
        duplicateDetection: null,
        raceConditions: null,
        resourceExhaustion: null
    };
    
    // Test 1: Multiple users submitting identical forms simultaneously
    console.log('Test 1: Duplicate Submission Detection');
    console.log('-'.repeat(50));
    
    const duplicateForm = {
        companyName: 'Acme Corp',
        contactPerson: 'John Smith',
        email: 'duplicate@test.com',
        formType: 'demo',
        message: 'This is a duplicate test'
    };
    
    const duplicatePromises = [];
    const duplicateCount = 10;
    const duplicateStart = Date.now();
    
    for (let i = 0; i < duplicateCount; i++) {
        const promise = fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(duplicateForm)
        }).then(async (response) => ({
            id: i,
            status: response.status,
            success: response.ok,
            body: await response.text(),
            timestamp: Date.now()
        })).catch(error => ({
            id: i,
            error: error.message,
            timestamp: Date.now()
        }));
        duplicatePromises.push(promise);
    }
    
    const duplicateResults = await Promise.all(duplicatePromises);
    const duplicateEnd = Date.now();
    const duplicateTime = duplicateEnd - duplicateStart;
    
    const duplicateSuccess = duplicateResults.filter(r => r.success).length;
    const duplicateErrors = duplicateResults.filter(r => !r.success).length;
    
    console.log(`Duplicate Test Results:`);
    console.log(`- Simultaneous submissions: ${duplicateCount}`);
    console.log(`- Successful: ${duplicateSuccess}`);
    console.log(`- Failed/Rejected: ${duplicateErrors}`);
    console.log(`- Total time: ${duplicateTime}ms`);
    console.log(`- Average time per request: ${(duplicateTime/duplicateCount).toFixed(2)}ms`);
    
    if (duplicateSuccess === duplicateCount) {
        console.log('⚠️  WARNING: All duplicate submissions accepted - no deduplication logic');
    } else {
        console.log('✅ Some duplicate rejection detected - review implementation');
    }
    
    results.duplicateDetection = {
        totalSubmissions: duplicateCount,
        successful: duplicateSuccess,
        failed: duplicateErrors,
        totalTime: duplicateTime
    };
    
    // Test 2: Race Condition Testing - Same email, different data
    console.log('\\n\\nTest 2: Race Condition Testing');
    console.log('-'.repeat(50));
    
    const raceEmail = 'race@condition.test';
    const racePromises = [];
    const raceCount = 20;
    const raceStart = Date.now();
    
    for (let i = 0; i < raceCount; i++) {
        const form = {
            companyName: `Company${i}`,
            contactPerson: `Person${i}`,
            email: raceEmail,
            formType: i % 2 === 0 ? 'demo' : 'sales',
            message: `Race condition test #${i}`,
            timestamp: Date.now() + i // Slight timestamp differences
        };
        
        const promise = fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        }).then(async (response) => ({
            requestId: i,
            companyName: form.companyName,
            formType: form.formType,
            status: response.status,
            success: response.ok,
            body: await response.text(),
            submissionTime: Date.now()
        })).catch(error => ({
            requestId: i,
            error: error.message,
            submissionTime: Date.now()
        }));
        
        racePromises.push(promise);
    }
    
    const raceResults = await Promise.all(racePromises);
    const raceEnd = Date.now();
    const raceTime = raceEnd - raceStart;
    
    const raceSuccess = raceResults.filter(r => r.success).length;
    const raceErrors = raceResults.filter(r => !r.success).length;
    
    console.log(`Race Condition Test Results:`);
    console.log(`- Concurrent submissions: ${raceCount}`);
    console.log(`- Successful: ${raceSuccess}`);
    console.log(`- Failed/Rejected: ${raceErrors}`);
    console.log(`- Total time: ${raceTime}ms`);
    
    // Analyze if last-write-wins or other issues occurred
    const successfulRaces = raceResults.filter(r => r.success);
    if (successfulRaces.length > 1) {
        console.log('⚠️  Multiple submissions for same email accepted - potential data inconsistency');
        console.log('   Last successful submissions:');
        successfulRaces.slice(-3).forEach(r => {
            console.log(`   - ${r.companyName} (${r.formType}) - Status: ${r.status}`);
        });
    }
    
    results.raceConditions = {
        totalSubmissions: raceCount,
        successful: raceSuccess,
        failed: raceErrors,
        totalTime: raceTime,
        potentialDataCorruption: raceSuccess > 1
    };
    
    // Test 3: Resource Exhaustion - High concurrent load
    console.log('\\n\\nTest 3: Resource Exhaustion Testing');
    console.log('-'.repeat(50));
    
    const resourceCount = 100;
    const resourceBatches = 5;
    const resourceResults = [];
    
    console.log(`Testing with ${resourceCount} requests in ${resourceBatches} batches...`);
    
    for (let batch = 0; batch < resourceBatches; batch++) {
        console.log(`\\nBatch ${batch + 1}/${resourceBatches}:`);
        const batchPromises = [];
        const batchStart = Date.now();
        
        for (let i = 0; i < resourceCount / resourceBatches; i++) {
            const form = {
                companyName: `Batch${batch}Company${i}`,
                contactPerson: `Person${batch}_${i}`,
                email: `batch${batch}_${i}@load.test`,
                formType: 'demo',
                message: `Resource exhaustion test batch ${batch} request ${i}`
            };
            
            const promise = fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            }).then(async (response) => {
                const endTime = Date.now();
                return {
                    batch,
                    requestId: i,
                    status: response.status,
                    success: response.ok,
                    responseTime: endTime - batchStart,
                    body: response.ok ? 'SUCCESS' : await response.text()
                };
            }).catch(error => ({
                batch,
                requestId: i,
                error: error.message,
                responseTime: Date.now() - batchStart
            }));
            
            batchPromises.push(promise);
        }
        
        const batchResults = await Promise.all(batchPromises);
        const batchEnd = Date.now();
        const batchTime = batchEnd - batchStart;
        
        const batchSuccess = batchResults.filter(r => r.success).length;
        const batchErrors = batchResults.filter(r => !r.success || r.error).length;
        const batchRequestCount = resourceCount / resourceBatches;
        
        console.log(`  - Requests: ${batchRequestCount}`);
        console.log(`  - Successful: ${batchSuccess}`);
        console.log(`  - Failed: ${batchErrors}`);
        console.log(`  - Batch time: ${batchTime}ms`);
        console.log(`  - Avg response time: ${(batchTime/batchRequestCount).toFixed(2)}ms`);
        
        resourceResults.push(...batchResults);
        
        // Short pause between batches to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const totalResourceSuccess = resourceResults.filter(r => r.success).length;
    const totalResourceErrors = resourceResults.filter(r => !r.success || r.error).length;
    const avgResourceTime = resourceResults
        .filter(r => r.responseTime)
        .reduce((sum, r) => sum + r.responseTime, 0) / resourceResults.length;
    
    console.log(`\\nResource Exhaustion Summary:`);
    console.log(`- Total requests: ${resourceCount}`);
    console.log(`- Total successful: ${totalResourceSuccess}`);
    console.log(`- Total failed: ${totalResourceErrors}`);
    console.log(`- Success rate: ${(totalResourceSuccess/resourceCount*100).toFixed(1)}%`);
    console.log(`- Average response time: ${avgResourceTime.toFixed(2)}ms`);
    
    if (avgResourceTime > 1000) {
        console.log('⚠️  WARNING: Average response time > 1 second under load');
    }
    if (totalResourceErrors > resourceCount * 0.1) {
        console.log('⚠️  WARNING: >10% error rate under load - potential stability issues');
    }
    
    results.resourceExhaustion = {
        totalRequests: resourceCount,
        successful: totalResourceSuccess,
        failed: totalResourceErrors,
        successRate: totalResourceSuccess/resourceCount,
        avgResponseTime: avgResourceTime
    };
    
    // Test 4: Memory Leak Detection (simulate long-running requests)
    console.log('\\n\\nTest 4: Memory Leak Simulation');
    console.log('-'.repeat(50));
    
    const memoryTestStart = Date.now();
    let memoryResults = [];
    
    // Send requests with large payloads to test memory handling
    for (let round = 0; round < 3; round++) {
        console.log(`Memory test round ${round + 1}/3:`);
        const largeMessage = 'X'.repeat(10000); // 10KB message
        
        const memoryPromises = [];
        for (let i = 0; i < 10; i++) {
            const promise = fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: `MemTest${round}_${i}`,
                    contactPerson: `Person${round}_${i}`,
                    email: `memory${round}_${i}@test.com`,
                    formType: 'sales',
                    message: largeMessage,
                    largeData: 'Y'.repeat(5000) // Additional large field
                })
            }).then(async (response) => ({
                round,
                id: i,
                success: response.ok,
                status: response.status,
                memoryTest: true
            })).catch(error => ({
                round,
                id: i,
                error: error.message,
                memoryTest: true
            }));
            
            memoryPromises.push(promise);
        }
        
        const roundResults = await Promise.all(memoryPromises);
        memoryResults.push(...roundResults);
        
        const roundSuccess = roundResults.filter(r => r.success).length;
        console.log(`  - Round ${round + 1}: ${roundSuccess}/10 successful`);
        
        // Wait between rounds to see if memory is released
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const memoryTestEnd = Date.now();
    const totalMemorySuccess = memoryResults.filter(r => r.success).length;
    
    console.log(`\\nMemory Test Summary:`);
    console.log(`- Total memory-intensive requests: ${memoryResults.length}`);
    console.log(`- Successful: ${totalMemorySuccess}`);
    console.log(`- Failed: ${memoryResults.length - totalMemorySuccess}`);
    console.log(`- Total test time: ${memoryTestEnd - memoryTestStart}ms`);
    
    // Generate comprehensive report
    console.log('\\n\\n📊 CONCURRENT TESTING COMPREHENSIVE REPORT');
    console.log('=' .repeat(70));
    
    console.log('\\n🔒 DUPLICATE HANDLING:');
    if (results.duplicateDetection.successful === results.duplicateDetection.totalSubmissions) {
        console.log('❌ CRITICAL: No duplicate detection - same form submitted multiple times');
        console.log('   Risk: Data duplication, potential spam, resource waste');
    } else {
        console.log('✅ Some duplicate handling detected');
    }
    
    console.log('\\n⚡ RACE CONDITIONS:');
    if (results.raceConditions.potentialDataCorruption) {
        console.log('❌ CRITICAL: Race condition detected - same email, multiple entries');
        console.log('   Risk: Data inconsistency, customer confusion');
    } else {
        console.log('✅ No obvious race conditions detected');
    }
    
    console.log('\\n🚀 PERFORMANCE UNDER LOAD:');
    const performanceScore = results.resourceExhaustion.successRate;
    if (performanceScore < 0.95) {
        console.log(`❌ CRITICAL: Low success rate under load (${(performanceScore*100).toFixed(1)}%)`);
    } else if (results.resourceExhaustion.avgResponseTime > 1000) {
        console.log('⚠️  WARNING: Slow response times under load');
    } else {
        console.log('✅ Good performance under concurrent load');
    }
    
    console.log('\\n💾 MEMORY HANDLING:');
    const memorySuccess = totalMemorySuccess / memoryResults.length;
    if (memorySuccess < 0.9) {
        console.log('⚠️  WARNING: Memory-intensive requests showing failures');
    } else {
        console.log('✅ Memory-intensive requests handled well');
    }
    
    console.log('\\n🎯 CONCURRENCY RECOMMENDATIONS:');
    console.log('- Implement proper duplicate detection (email + timeframe)');
    console.log('- Add database constraints to prevent race conditions');
    console.log('- Implement request queuing for high load scenarios');
    console.log('- Add connection pooling and rate limiting');
    console.log('- Monitor memory usage and implement garbage collection');
    console.log('- Consider implementing distributed locks for critical sections');
    console.log('- Add request deduplication using hashes or tokens');
    
    return results;
}

// Run the concurrent tests
testConcurrentUsers().catch(console.error);