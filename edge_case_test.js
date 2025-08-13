// Edge Case Testing for CHIRAL Contact Form
// Tests unusual inputs, emoji, very long text, special characters, etc.

const BASE_URL = 'http://localhost:3001';
const CONTACT_ENDPOINT = `${BASE_URL}/api/contact`;

async function testEdgeCases() {
    console.log('🧪 Starting Edge Case Testing for CHIRAL Contact Form');
    console.log('==================================================\n');
    
    const results = [];
    let testId = 1;
    
    async function runTest(testName, payload, expectedResult = 'should handle gracefully') {
        console.log(`Test ${testId}: ${testName}`);
        console.log('-'.repeat(50));
        
        const startTime = Date.now();
        let result = {
            testId,
            testName,
            payload: JSON.stringify(payload).length > 100 ? '[Large payload - truncated]' : payload,
            success: false,
            statusCode: null,
            responseTime: 0,
            error: null,
            response: null
        };
        
        try {
            const response = await fetch(CONTACT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            const endTime = Date.now();
            result.responseTime = endTime - startTime;
            result.statusCode = response.status;
            
            const responseText = await response.text();
            result.response = responseText;
            
            if (response.ok) {
                result.success = true;
                console.log(`✅ Status: ${response.status} | Time: ${result.responseTime}ms`);
                console.log(`Response: ${responseText.substring(0, 100)}...`);
            } else {
                console.log(`❌ Status: ${response.status} | Time: ${result.responseTime}ms`);
                console.log(`Error: ${responseText.substring(0, 200)}...`);
                result.error = responseText;
            }
            
        } catch (error) {
            const endTime = Date.now();
            result.responseTime = endTime - startTime;
            result.error = error.message;
            console.log(`💥 Network Error: ${error.message} | Time: ${result.responseTime}ms`);
        }
        
        results.push(result);
        console.log(`Expected: ${expectedResult}\n`);
        testId++;
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Test 1: Normal valid request (baseline)
    await runTest('Normal Valid Request (Baseline)', {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'john@testcompany.com',
        formType: 'demo'
    }, 'should succeed');
    
    // Test 2: Emoji in all fields
    await runTest('Emoji in All Fields', {
        companyName: '🚀 RoboTech Inc 🤖',
        contactPerson: '👨‍💼 John Smith 🎯',
        email: 'test@company.com',
        formType: 'demo',
        message: 'We need robots! 🦾🔥💯 Best product ever! 🌟⭐✨'
    }, 'should sanitize or reject emoji');
    
    // Test 3: Very long strings (potential buffer overflow)
    const longString = 'A'.repeat(10000);
    await runTest('Very Long Strings (10k chars)', {
        companyName: longString,
        contactPerson: 'B'.repeat(5000),
        email: 'test@' + 'long'.repeat(100) + '.com',
        formType: 'demo',
        message: 'C'.repeat(50000)
    }, 'should reject or truncate long input');
    
    // Test 4: Special characters and encoding
    await runTest('Special Characters & Encoding', {
        companyName: 'Test & <script>alert("XSS")</script> Company™',
        contactPerson: 'José María Ñoño-González & Associates <>"\\',
        email: 'test+special@company-name.co.uk',
        formType: 'sales',
        message: 'Special chars: çñáéíóúü @#$%^&*()_+-={}[]|\\:";\'<>?,./'
    }, 'should sanitize HTML/JS and preserve valid special chars');
    
    // Test 5: SQL Injection attempts
    await runTest('SQL Injection Attempts', {
        companyName: "'; DROP TABLE users; --",
        contactPerson: "1' OR '1'='1",
        email: 'test@company.com',
        formType: 'demo',
        message: "UNION SELECT * FROM sensitive_data WHERE '1'='1"
    }, 'should prevent SQL injection');
    
    // Test 6: XSS attempts
    await runTest('XSS Injection Attempts', {
        companyName: '<script>alert("XSS")</script>',
        contactPerson: '<img src="x" onerror="alert(1)">',
        email: 'test@company.com',
        formType: 'sales',
        message: 'javascript:alert("XSS")'
    }, 'should sanitize and prevent XSS');
    
    // Test 7: Unicode and international characters
    await runTest('Unicode & International Characters', {
        companyName: '北京科技有限公司',
        contactPerson: 'محمد عبد الله',
        email: 'test@пример.рф',
        formType: 'demo',
        message: 'Iñtërnâtiônàlizætiøn tëst: 你好 مرحبا Здравствуйте'
    }, 'should handle international text properly');
    
    // Test 8: Null bytes and control characters
    await runTest('Null Bytes & Control Characters', {
        companyName: 'Test\\x00Company',
        contactPerson: 'John\\x01\\x02\\x03Doe',
        email: 'test@company.com',
        formType: 'sales',
        message: 'Message with\\r\\n\\t control chars'
    }, 'should handle control characters safely');
    
    // Test 9: Empty strings and whitespace
    await runTest('Empty Strings & Whitespace', {
        companyName: '   ',
        contactPerson: '\\t\\n\\r',
        email: '  test@company.com  ',
        formType: 'demo',
        message: ''
    }, 'should validate required fields and trim whitespace');
    
    // Test 10: Invalid email formats
    await runTest('Invalid Email Formats', {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'not-an-email',
        formType: 'demo'
    }, 'should reject invalid email format');
    
    // Test 11: Invalid formType
    await runTest('Invalid Form Type', {
        companyName: 'Test Company',
        contactPerson: 'John Doe',  
        email: 'test@company.com',
        formType: 'invalid'
    }, 'should reject invalid form type');
    
    // Test 12: Missing required fields
    await runTest('Missing Required Fields', {
        companyName: 'Test Company',
        // Missing contactPerson, email, formType
    }, 'should reject missing required fields');
    
    // Test 13: Extra/unexpected fields
    await runTest('Extra Unexpected Fields', {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'test@company.com',
        formType: 'demo',
        maliciousField: '<script>alert("hack")</script>',
        adminAccess: true,
        __proto__: { admin: true }
    }, 'should ignore unexpected fields safely');
    
    // Test 14: Numeric inputs where strings expected
    await runTest('Numeric Inputs in String Fields', {
        companyName: 12345,
        contactPerson: 67890,
        email: 'test@company.com',
        formType: 'demo'
    }, 'should handle type conversion properly');
    
    // Test 15: Boolean/null inputs
    await runTest('Boolean/Null Inputs', {
        companyName: true,
        contactPerson: null,
        email: 'test@company.com',
        formType: 'demo'
    }, 'should handle null/boolean values');
    
    // Test 16: Array inputs
    await runTest('Array Inputs', {
        companyName: ['Test', 'Company'],
        contactPerson: 'John Doe',
        email: 'test@company.com',
        formType: 'demo'
    }, 'should reject or handle array inputs');
    
    // Test 17: Object inputs
    await runTest('Object Inputs', {
        companyName: { name: 'Test Company', admin: true },
        contactPerson: 'John Doe',
        email: 'test@company.com', 
        formType: 'demo'
    }, 'should reject or handle object inputs');
    
    // Test 18: Very large JSON payload
    const largePayload = {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'test@company.com',
        formType: 'demo'
    };
    // Add many extra fields to make it large
    for (let i = 0; i < 1000; i++) {
        largePayload[`extraField${i}`] = 'x'.repeat(1000);
    }
    await runTest('Very Large JSON Payload', largePayload, 'should handle or reject large payloads');
    
    // Test 19: International domain names
    await runTest('International Domain Names', {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'test@münchen.de',
        formType: 'demo'
    }, 'should handle international domains');
    
    // Test 20: Plus addressing and edge email cases
    await runTest('Email Edge Cases (Plus Addressing)', {
        companyName: 'Test Company',
        contactPerson: 'John Doe',
        email: 'user+tag@example.co.uk',
        formType: 'sales'
    }, 'should handle plus addressing correctly');
    
    // Generate summary report
    console.log('\n📊 EDGE CASE TEST SUMMARY REPORT');
    console.log('=' .repeat(60));
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const errors = results.filter(r => r.error && !r.statusCode).length;
    
    console.log(`Total Tests: ${results.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed/Rejected: ${failed}`);
    console.log(`Network Errors: ${errors}`);
    console.log(`Success Rate: ${(successful/results.length*100).toFixed(1)}%`);
    
    // Response time analysis
    const validTimes = results.filter(r => r.responseTime > 0);
    if (validTimes.length > 0) {
        const avgTime = validTimes.reduce((sum, r) => sum + r.responseTime, 0) / validTimes.length;
        const maxTime = Math.max(...validTimes.map(r => r.responseTime));
        const minTime = Math.min(...validTimes.map(r => r.responseTime));
        
        console.log(`\nResponse Times:`);
        console.log(`- Average: ${avgTime.toFixed(2)}ms`);
        console.log(`- Min: ${minTime}ms`);
        console.log(`- Max: ${maxTime}ms`);
    }
    
    // Vulnerability analysis
    console.log('\n🔐 SECURITY ANALYSIS:');
    
    const xssTest = results.find(r => r.testName.includes('XSS'));
    const sqlTest = results.find(r => r.testName.includes('SQL'));
    const longStringTest = results.find(r => r.testName.includes('Long Strings'));
    
    if (xssTest && xssTest.success) {
        console.log('⚠️  XSS: Server accepted XSS payload - potential vulnerability');
    } else if (xssTest) {
        console.log('✅ XSS: Server properly rejected XSS attempts');
    }
    
    if (sqlTest && sqlTest.success) {
        console.log('⚠️  SQL: Server accepted SQL injection payload - potential vulnerability');
    } else if (sqlTest) {
        console.log('✅ SQL: Server properly handled SQL injection attempts');
    }
    
    if (longStringTest && (longStringTest.responseTime > 5000)) {
        console.log('⚠️  DoS: Long strings caused slow response - potential DoS vector');
    } else if (longStringTest) {
        console.log('✅ DoS: Server handled long strings efficiently');
    }
    
    // Error handling analysis
    const errorResponses = results.filter(r => !r.success && r.statusCode);
    const commonErrors = {};
    
    errorResponses.forEach(r => {
        commonErrors[r.statusCode] = (commonErrors[r.statusCode] || 0) + 1;
    });
    
    console.log('\n📋 ERROR CODE BREAKDOWN:');
    Object.entries(commonErrors).forEach(([code, count]) => {
        console.log(`- HTTP ${code}: ${count} occurrences`);
    });
    
    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('- Implement proper input sanitization for all fields');
    console.log('- Add length limits to prevent buffer overflow attacks');
    console.log('- Validate email format on server side');
    console.log('- Implement rate limiting per IP address');
    console.log('- Add CAPTCHA for suspicious patterns');
    console.log('- Log and monitor unusual input patterns');
    console.log('- Consider implementing CSP headers');
    
    return results;
}

// Run the tests
testEdgeCases().catch(console.error);