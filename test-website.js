// Playwright test to verify CHIRAL website functionality
import { chromium } from 'playwright';

async function testWebsite() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🚀 Starting CHIRAL website functionality test...\n');
  
  try {
    // Start local dev server first if not running
    console.log('📡 Testing local preview server - PRODUCTION BUILD (http://localhost:4173)...');
    
    // Navigate to local preview server (production build)
    await page.goto('http://localhost:4173', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    // Wait for any potential React hydration
    await page.waitForTimeout(3000);
    
    console.log('✅ Page loaded successfully');
    
    // Check if React app has mounted by looking for the root content
    const hasContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });
    
    if (hasContent) {
      console.log('✅ React app mounted - content is rendering');
    } else {
      console.log('❌ React app not mounted - root div is empty');
      await page.screenshot({ path: 'debug-empty-root.png' });
      return false;
    }
    
    // Test 1: Check if header/navigation exists
    const headerExists = await page.locator('header, nav, [data-testid="header"]').first().isVisible();
    console.log(`${headerExists ? '✅' : '❌'} Header/Navigation: ${headerExists ? 'Found' : 'Missing'}`);
    
    // Test 2: Check for CHIRAL branding
    const chiralBranding = await page.getByText('CHIRAL').first().isVisible().catch(() => false);
    console.log(`${chiralBranding ? '✅' : '❌'} CHIRAL Branding: ${chiralBranding ? 'Found' : 'Missing'}`);
    
    // Test 3: Check for main content area
    const mainContent = await page.locator('main, [role="main"], .hero, .home').first().isVisible().catch(() => false);
    console.log(`${mainContent ? '✅' : '❌'} Main Content: ${mainContent ? 'Found' : 'Missing'}`);
    
    // Test 4: Check if navigation links exist
    const navLinks = await page.locator('a[href*="products"], a[href*="applications"], a[href*="about"], a[href*="contact"]').count();
    console.log(`${navLinks > 0 ? '✅' : '❌'} Navigation Links: ${navLinks} found`);
    
    // Test 5: Check for JavaScript errors in console
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(2000);
    
    if (consoleErrors.length === 0) {
      console.log('✅ No JavaScript console errors');
    } else {
      console.log(`❌ JavaScript Errors Found:`);
      consoleErrors.forEach(error => console.log(`   • ${error}`));
    }
    
    // Test 6: Try navigating to different pages
    const testRoutes = ['/products', '/applications', '/about', '/contact'];
    
    for (const route of testRoutes) {
      try {
        await page.goto(`http://localhost:4173${route}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 5000 
        });
        
        // Check if page has content
        const pageHasContent = await page.evaluate(() => {
          const root = document.getElementById('root');
          return root && root.textContent.trim().length > 100; // More than just header
        });
        
        console.log(`${pageHasContent ? '✅' : '❌'} Route ${route}: ${pageHasContent ? 'Working' : 'Empty/Broken'}`);
        
        if (!pageHasContent) {
          await page.screenshot({ path: `debug-route-${route.replace('/', '')}.png` });
        }
        
      } catch (error) {
        console.log(`❌ Route ${route}: Error - ${error.message}`);
      }
    }
    
    // Test 7: Check for product images (if on products page)
    await page.goto('http://localhost:4173/products', { waitUntil: 'domcontentloaded' });
    const productImages = await page.locator('img[src*="x30"], img[src*="x20"], img[src*="lite3"]').count();
    console.log(`${productImages > 0 ? '✅' : '❌'} Product Images: ${productImages} found`);
    
    // Overall assessment
    console.log('\n📊 TEST SUMMARY:');
    const totalTests = 7;
    const passedTests = [
      hasContent,
      headerExists, 
      chiralBranding,
      mainContent,
      navLinks > 0,
      consoleErrors.length === 0,
      productImages > 0
    ].filter(Boolean).length;
    
    console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`${passedTests === totalTests ? '🎉 ALL TESTS PASSED!' : '⚠️  Some issues found - see details above'}`);
    
    // Take a screenshot of the final state
    await page.screenshot({ path: 'website-final-state.png', fullPage: true });
    console.log('📸 Full page screenshot saved as website-final-state.png');
    
    return passedTests === totalTests;
    
  } catch (error) {
    console.log(`❌ Critical Error: ${error.message}`);
    await page.screenshot({ path: 'debug-critical-error.png' });
    return false;
  } finally {
    await browser.close();
  }
}

// Run the test
testWebsite().then(success => {
  if (success) {
    console.log('\n🎉 Website is working correctly!');
    process.exit(0);
  } else {
    console.log('\n❌ Website has issues that need to be fixed.');
    process.exit(1);
  }
}).catch(error => {
  console.error('\n💥 Test failed to run:', error);
  process.exit(1);
});