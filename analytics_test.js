// Analytics Testing for CHIRAL Website
// Tests Google Analytics 4 event firing and tracking

const FRONTEND_URL = 'http://localhost:5173';

async function testAnalyticsTrackingAdvanced() {
    console.log('📊 Advanced Analytics Testing (requires Puppeteer)');
    console.log('==================================================\\n');
    
    try {
        const puppeteer = await import('puppeteer');
        let browser = null;
        const results = {
            gaLoaded: false,
            gtagPresent: false,
            eventsFired: [],
            networkRequests: [],
            errors: []
        };
        
        // Launch browser with network interception
        browser = await puppeteer.default.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Enable request interception to monitor GA requests
        await page.setRequestInterception(true);
        
        const gaRequests = [];
        const consoleMessages = [];
        
        // Monitor network requests for GA calls
        page.on('request', (request) => {
            if (request.url().includes('google-analytics') || 
                request.url().includes('googletagmanager') ||
                request.url().includes('/g/collect') ||
                request.url().includes('/analytics')) {
                gaRequests.push({
                    url: request.url(),
                    method: request.method(),
                    timestamp: Date.now()
                });
            }
            request.continue();
        });
        
        // Monitor console for analytics-related messages
        page.on('console', (msg) => {
            const text = msg.text();
            if (text.includes('gtag') || text.includes('analytics') || text.includes('GA')) {
                consoleMessages.push({
                    type: msg.type(),
                    text: text,
                    timestamp: Date.now()
                });
            }
        });
        
        // Monitor for JavaScript errors
        page.on('pageerror', (error) => {
            results.errors.push({
                message: error.message,
                stack: error.stack,
                timestamp: Date.now()
            });
        });
        
        console.log('🌐 Loading CHIRAL website...');
        await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait a bit for analytics to load
        await page.waitForTimeout(2000);
        
        // Check if Google Analytics is loaded
        console.log('\\n📈 Checking Google Analytics Implementation...');
        
        const gaImplementation = await page.evaluate(() => {
            return {
                gtagPresent: typeof gtag !== 'undefined',
                dataLayerPresent: typeof dataLayer !== 'undefined' && Array.isArray(dataLayer),
                gaScriptPresent: !!document.querySelector('script[src*="googletagmanager"]'),
                configPresent: document.documentElement.innerHTML.includes('G-'),
                trackingId: document.documentElement.innerHTML.match(/G-[A-Z0-9]+/g)
            };
        });
        
        console.log('GA Implementation Status:');
        console.log(`- gtag function present: ${gaImplementation.gtagPresent ? '✅' : '❌'}`);
        console.log(`- dataLayer present: ${gaImplementation.dataLayerPresent ? '✅' : '❌'}`);
        console.log(`- GA script loaded: ${gaImplementation.gaScriptPresent ? '✅' : '❌'}`);
        console.log(`- Config present: ${gaImplementation.configPresent ? '✅' : '❌'}`);
        console.log(`- Tracking IDs found: ${gaImplementation.trackingId || 'None'}`);
        
        results.gaLoaded = gaImplementation.gaScriptPresent;
        results.gtagPresent = gaImplementation.gtagPresent;
        
        // Test form submission analytics
        console.log('\\n📝 Testing Contact Form Analytics...');
        
        // Navigate to contact page
        await page.click('a[href="/contact"]');
        await page.waitForTimeout(1000);
        
        // Fill out demo form
        await page.type('input[id="demo-company"]', 'Analytics Test Company');
        await page.type('input[id="demo-contact"]', 'Test Analytics User');
        await page.type('input[id="demo-email"]', 'analytics@test.com');
        
        // Set up event listener for form submission tracking
        const initialRequests = gaRequests.length;
        
        // Submit form and monitor for analytics events
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000); // Wait for form submission and analytics
        
        const newRequests = gaRequests.slice(initialRequests);
        
        console.log('Form Submission Analytics:');
        console.log(`- GA requests triggered: ${newRequests.length}`);
        
        if (newRequests.length > 0) {
            console.log('Recent GA requests:');
            newRequests.forEach((req, index) => {
                console.log(`  ${index + 1}. ${req.method} ${req.url.substring(0, 100)}...`);
            });
        }
        
        // Test navigation analytics
        console.log('\\n🧭 Testing Navigation Analytics...');
        
        const navLinks = ['/products', '/applications', '/about'];
        
        for (const link of navLinks) {
            const beforeNav = gaRequests.length;
            await page.click(`a[href="${link}"]`);
            await page.waitForTimeout(1000);
            const afterNav = gaRequests.length;
            
            console.log(`Navigation to ${link}: ${afterNav - beforeNav} GA requests`);
        }
        
        // Test custom event firing (if implemented)
        console.log('\\n🎯 Testing Custom Event Tracking...');
        
        // Look for trackLead function and test it
        const customEvents = await page.evaluate(() => {
            const events = [];
            
            // Test if trackLead function exists (from previous analysis)
            if (typeof window.trackLead === 'function') {
                try {
                    window.trackLead('demo');
                    events.push('trackLead(demo) called');
                } catch (e) {
                    events.push('trackLead error: ' + e.message);
                }
            }
            
            // Test manual gtag call
            if (typeof gtag === 'function') {
                try {
                    gtag('event', 'test_event', {
                        event_category: 'Testing',
                        event_label: 'Analytics Test'
                    });
                    events.push('Manual gtag event fired');
                } catch (e) {
                    events.push('Manual gtag error: ' + e.message);
                }
            }
            
            return events;
        });
        
        console.log('Custom Events:');
        customEvents.forEach(event => console.log(`- ${event}`));
        
        // Final analytics summary
        results.networkRequests = gaRequests;
        results.eventsFired = customEvents;
        
        console.log('\\n\\n📊 ANALYTICS TESTING COMPREHENSIVE REPORT');
        console.log('=' .repeat(60));
        
        console.log('\\n🔧 IMPLEMENTATION STATUS:');
        if (!results.gaLoaded) {
            console.log('❌ CRITICAL: Google Analytics script not loaded');
        } else if (!results.gtagPresent) {
            console.log('❌ CRITICAL: gtag function not available');
        } else {
            console.log('✅ Google Analytics properly implemented');
        }
        
        console.log('\\n📡 TRACKING ACTIVITY:');
        console.log(`- Total GA network requests: ${results.networkRequests.length}`);
        console.log(`- Custom events fired: ${results.eventsFired.length}`);
        
        if (results.networkRequests.length === 0) {
            console.log('⚠️  WARNING: No GA network requests detected - tracking may not be working');
        } else {
            console.log('✅ Network tracking activity detected');
        }
        
        console.log('\\n🐛 ERROR ANALYSIS:');
        if (results.errors.length > 0) {
            console.log(`❌ ${results.errors.length} JavaScript errors detected:`);
            results.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error.message}`);
            });
        } else {
            console.log('✅ No JavaScript errors detected');
        }
        
        console.log('\\n🎯 RECOMMENDATIONS:');
        if (!results.gaLoaded || !results.gtagPresent) {
            console.log('- Verify Google Analytics tracking ID is correct');
            console.log('- Check if GA script is being blocked');
            console.log('- Ensure proper gtag implementation');
        }
        console.log('- Implement enhanced e-commerce tracking for form conversions');
        console.log('- Add custom events for key user interactions');
        console.log('- Set up goal tracking in GA4 dashboard');
        console.log('- Consider implementing server-side tracking for accuracy');
        console.log('- Add privacy compliance for GDPR/cookie consent');
        
        return results;
        
        } catch (error) {
            console.error('Advanced analytics test failed:', error.message);
            results.errors.push({
                message: error.message,
                stack: error.stack,
                timestamp: Date.now()
            });
            return results;
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    } catch (error) {
        console.log('⚠️  Puppeteer not available, skipping advanced tests');
        return null;
    }
}

// Alternative test without Puppeteer (basic HTTP check)
async function basicAnalyticsTest() {
    console.log('🔍 Basic Analytics Test (HTTP-based)');
    console.log('====================================\\n');
    
    try {
        // Check if frontend loads and contains GA code
        const response = await fetch(FRONTEND_URL);
        const html = await response.text();
        
        const checks = {
            gaScript: html.includes('googletagmanager.com/gtag/js'),
            gtagFunction: html.includes('function gtag()'),
            trackingId: html.match(/G-[A-Z0-9]+/g),
            dataLayer: html.includes('dataLayer'),
            trackLead: html.includes('trackLead'),
            formTracking: html.includes('form_submit')
        };
        
        console.log('Basic Analytics Implementation:');
        Object.entries(checks).forEach(([check, result]) => {
            const status = result ? '✅' : '❌';
            console.log(`- ${check}: ${status} ${Array.isArray(result) ? result.join(', ') : ''}`);
        });
        
        return checks;
    } catch (error) {
        console.error('Basic analytics test failed:', error.message);
        return null;
    }
}

// Run tests
async function runTests() {
    // First try basic test
    const basicResults = await basicAnalyticsTest();
    
    // Then try advanced test with Puppeteer if available
    try {
        console.log('\\n\\nAttempting advanced analytics test with Puppeteer...');
        const advancedResults = await testAnalyticsTrackingAdvanced();
        return { basic: basicResults, advanced: advancedResults };
    } catch (error) {
        console.log('\\n⚠️  Advanced test failed (Puppeteer not available)');
        console.log('   Install with: npm install puppeteer');
        console.log('   Basic test results only:\\n');
        return { basic: basicResults, advanced: null };
    }
}

runTests().catch(console.error);