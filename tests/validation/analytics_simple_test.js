// Simple Analytics Testing for CHIRAL Website
// Tests Google Analytics 4 implementation without browser automation

const FRONTEND_URL = 'http://localhost:5173';

async function testAnalyticsImplementation() {
    console.log('📊 Analytics Implementation Testing for CHIRAL Website');
    console.log('=====================================================\n');
    
    const results = {
        gaScriptLoaded: false,
        gtagFunctionPresent: false,
        trackingIdsFound: [],
        dataLayerPresent: false,
        customTrackingPresent: false,
        formTrackingPresent: false,
        errors: []
    };
    
    try {
        // Test 1: Check frontend for GA implementation
        console.log('Test 1: Frontend Analytics Implementation');
        console.log('-'.repeat(45));
        
        const response = await fetch(FRONTEND_URL);
        if (!response.ok) {
            throw new Error(`Frontend not accessible: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Check for Google Analytics script
        results.gaScriptLoaded = html.includes('googletagmanager.com/gtag/js');
        console.log(`GA Script Present: ${results.gaScriptLoaded ? '✅' : '❌'}`);
        
        // Check for gtag function
        results.gtagFunctionPresent = html.includes('function gtag()') || html.includes('gtag(');
        console.log(`gtag Function Present: ${results.gtagFunctionPresent ? '✅' : '❌'}`);
        
        // Extract tracking IDs
        const trackingIdPattern = /G-[A-Z0-9]{10,}/g;
        const foundIds = html.match(trackingIdPattern) || [];
        results.trackingIdsFound = [...new Set(foundIds)]; // Remove duplicates
        console.log(`Tracking IDs Found: ${results.trackingIdsFound.length > 0 ? '✅' : '❌'} ${results.trackingIdsFound.join(', ')}`);
        
        // Check for dataLayer
        results.dataLayerPresent = html.includes('dataLayer');
        console.log(`dataLayer Present: ${results.dataLayerPresent ? '✅' : '❌'}`);
        
        // Check for custom tracking functions
        results.customTrackingPresent = html.includes('trackLead') || html.includes('trackFormSubmission');
        console.log(`Custom Tracking Functions: ${results.customTrackingPresent ? '✅' : '❌'}`);
        
        // Check for form tracking events
        results.formTrackingPresent = html.includes('form_submit') || html.includes('lead_generated');
        console.log(`Form Event Tracking: ${results.formTrackingPresent ? '✅' : '❌'}`);
        
        console.log('\nTest 2: Analytics Configuration Analysis');
        console.log('-'.repeat(45));
        
        // Check if tracking ID is placeholder
        const hasPlaceholderID = results.trackingIdsFound.some(id => id.includes('XXXXXXXXXX') || id.includes('PLACEHOLDER'));
        if (hasPlaceholderID) {
            console.log('⚠️  WARNING: Placeholder tracking ID detected');
            results.errors.push('Placeholder tracking ID found - analytics not properly configured');
        }
        
        // Check for privacy compliance
        const hasPrivacyCompliance = html.includes('cookie') && html.includes('consent') || html.includes('privacy');
        console.log(`Privacy/Cookie Compliance: ${hasPrivacyCompliance ? '✅' : '⚠️'}`);
        
        // Check for proper configuration
        const hasProperConfig = html.includes("gtag('config'") && results.trackingIdsFound.length > 0;
        console.log(`Proper GA Configuration: ${hasProperConfig ? '✅' : '❌'}`);
        
        console.log('\nTest 3: Event Tracking Analysis');
        console.log('-'.repeat(45));
        
        // Look for common events
        const events = {
            'page_view': html.includes('page_view'),
            'form_submit': html.includes('form_submit'),
            'newsletter_signup': html.includes('newsletter_signup'),
            'contact_form': html.includes('contact_form'),
            'lead_generation': html.includes('lead_generation'),
            'click_tracking': html.includes('click') && html.includes('gtag')
        };
        
        Object.entries(events).forEach(([event, present]) => {
            console.log(`${event} event: ${present ? '✅' : '❌'}`);
        });
        
        console.log('\nTest 4: Network Request Test');
        console.log('-'.repeat(45));
        
        // Test if GA endpoints are reachable
        const gaEndpoints = [
            'https://www.googletagmanager.com/gtag/js',
            'https://www.google-analytics.com/g/collect'
        ];
        
        for (const endpoint of gaEndpoints) {
            try {
                const testResponse = await fetch(endpoint, { method: 'HEAD' });
                console.log(`${endpoint}: ${testResponse.ok ? '✅ Reachable' : '❌ Not reachable'}`);
            } catch (error) {
                console.log(`${endpoint}: ❌ Error - ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('Analytics test failed:', error.message);
        results.errors.push(error.message);
    }
    
    // Generate comprehensive report
    console.log('\n📊 ANALYTICS IMPLEMENTATION REPORT');
    console.log('=' .repeat(50));
    
    const implementationScore = [
        results.gaScriptLoaded,
        results.gtagFunctionPresent, 
        results.trackingIdsFound.length > 0,
        results.dataLayerPresent,
        !results.trackingIdsFound.some(id => id.includes('XXXXXXXXXX'))
    ].filter(Boolean).length;
    
    console.log(`\\nImplementation Score: ${implementationScore}/5`);
    
    if (implementationScore >= 4) {
        console.log('✅ GOOD: Analytics implementation appears complete');
    } else if (implementationScore >= 2) {
        console.log('⚠️  WARNING: Analytics partially implemented');
    } else {
        console.log('❌ CRITICAL: Analytics implementation incomplete');
    }
    
    console.log('\\n🔍 DETAILED ANALYSIS:');
    
    if (!results.gaScriptLoaded) {
        console.log('❌ Google Analytics script not loaded - no tracking possible');
    }
    
    if (!results.gtagFunctionPresent) {
        console.log('❌ gtag function not found - events cannot be tracked');
    }
    
    if (results.trackingIdsFound.length === 0) {
        console.log('❌ No tracking IDs found - analytics data has nowhere to go');
    } else if (results.trackingIdsFound.some(id => id.includes('XXXXXXXXXX'))) {
        console.log('❌ Placeholder tracking ID detected - replace with real GA4 property ID');
    }
    
    if (!results.dataLayerPresent) {
        console.log('⚠️  dataLayer not detected - advanced tracking may not work');
    }
    
    if (!results.customTrackingPresent) {
        console.log('⚠️  No custom tracking functions detected - limited business intelligence');
    }
    
    if (!results.formTrackingPresent) {
        console.log('❌ Form tracking not implemented - lead conversion tracking missing');
    }
    
    console.log('\\n🎯 RECOMMENDATIONS:');
    
    if (results.trackingIdsFound.some(id => id.includes('XXXXXXXXXX'))) {
        console.log('1. Replace placeholder tracking ID with real GA4 property ID');
    }
    
    if (!results.formTrackingPresent) {
        console.log('2. Implement form submission tracking for lead generation');
    }
    
    if (!results.customTrackingPresent) {
        console.log('3. Add custom events for business-specific interactions');
    }
    
    console.log('4. Set up enhanced e-commerce tracking for conversion funnels');
    console.log('5. Implement server-side tracking for accuracy and privacy');
    console.log('6. Add proper GDPR/privacy compliance for cookie consent');
    console.log('7. Set up custom dimensions for lead qualification');
    console.log('8. Configure goal tracking in GA4 dashboard');
    console.log('9. Test analytics in real-time view during form submissions');
    
    if (results.errors.length > 0) {
        console.log('\\n🐛 ERRORS ENCOUNTERED:');
        results.errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error}`);
        });
    }
    
    return results;
}

// Test email format edge cases
async function testEmailEdgeCases() {
    console.log('\\n\\n📧 Email Format Edge Cases Testing');
    console.log('=====================================\\n');
    
    const testCases = [
        // Valid edge cases
        { email: 'user+tag@example.com', valid: true, description: 'Plus addressing' },
        { email: 'test.email@example.co.uk', valid: true, description: 'Dot in local part' },
        { email: 'user@münchen.de', valid: true, description: 'International domain' },
        { email: 'test@example-company.com', valid: true, description: 'Hyphen in domain' },
        { email: 'a@b.co', valid: true, description: 'Short valid email' },
        { email: 'test@localhost', valid: true, description: 'Local domain (technically valid)' },
        
        // Invalid cases
        { email: 'notanemail', valid: false, description: 'No @ symbol' },
        { email: 'test@', valid: false, description: 'Missing domain' },
        { email: '@example.com', valid: false, description: 'Missing local part' },
        { email: 'test..test@example.com', valid: false, description: 'Double dots' },
        { email: 'test@.example.com', valid: false, description: 'Domain starts with dot' },
        { email: 'test@example..com', valid: false, description: 'Double dots in domain' },
        { email: '', valid: false, description: 'Empty string' },
        { email: 'test space@example.com', valid: false, description: 'Space in local part' },
    ];
    
    const results = [];
    
    for (const testCase of testCases) {
        console.log(`Testing: ${testCase.email} (${testCase.description})`);
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: 'Test Company',
                    contactPerson: 'Test User',
                    email: testCase.email,
                    formType: 'demo',
                    message: 'Email validation test'
                })
            });
            
            const responseData = await response.text();
            const success = response.ok;
            const result = {
                email: testCase.email,
                expectedValid: testCase.valid,
                actualValid: success,
                status: response.status,
                correct: testCase.valid === success,
                response: responseData.substring(0, 100)
            };
            
            results.push(result);
            
            const status = result.correct ? '✅' : '❌';
            console.log(`  Result: ${status} ${success ? 'ACCEPTED' : 'REJECTED'} (${response.status})`);
            
        } catch (error) {
            console.log(`  Error: ${error.message}`);
            results.push({
                email: testCase.email,
                error: error.message,
                correct: false
            });
        }
    }
    
    const correctValidations = results.filter(r => r.correct).length;
    const totalTests = results.length;
    
    console.log(`\\nEmail Validation Summary: ${correctValidations}/${totalTests} correct`);
    
    return results;
}

const BACKEND_URL = 'http://localhost:3001';

// Run all tests
async function runAllTests() {
    const analyticsResults = await testAnalyticsImplementation();
    const emailResults = await testEmailEdgeCases();
    
    return {
        analytics: analyticsResults,
        emailValidation: emailResults
    };
}

runAllTests().catch(console.error);