// Debug Contact Form - Test single request to see error details

const BASE_URL = 'http://localhost:3001';
const CONTACT_ENDPOINT = `${BASE_URL}/api/contact`;

async function debugContactForm() {
    console.log('🔍 Debugging Contact Form Request');
    console.log('=================================\n');
    
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        company: 'Test Company',
        message: 'This is a test message'
    };
    
    try {
        console.log('Sending request to:', CONTACT_ENDPOINT);
        console.log('Request payload:', JSON.stringify(testData, null, 2));
        
        const response = await fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        console.log('\nResponse Details:');
        console.log('- Status:', response.status);
        console.log('- Status Text:', response.statusText);
        console.log('- Headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('- Body:', responseText);
        
        if (!response.ok) {
            console.log('\n❌ Request failed with status:', response.status);
            try {
                const errorData = JSON.parse(responseText);
                console.log('Error details:', errorData);
            } catch (e) {
                console.log('Raw error response:', responseText);
            }
        } else {
            console.log('\n✅ Request successful!');
        }
        
    } catch (error) {
        console.log('\n💥 Network/Connection Error:');
        console.log(error.message);
        console.log('\nThis could indicate:');
        console.log('- Backend server is down');
        console.log('- CORS issues');
        console.log('- Network connectivity problems');
        console.log('- Incorrect endpoint URL');
    }
    
    // Test if backend is reachable
    try {
        console.log('\n🔗 Testing Backend Connectivity');
        const healthCheck = await fetch(`${BASE_URL}/health`);
        console.log('Health check status:', healthCheck.status);
        
        if (healthCheck.ok) {
            console.log('✅ Backend is reachable');
        } else {
            console.log('❌ Backend returned error on health check');
        }
    } catch (e) {
        console.log('❌ Backend is not reachable');
    }
}

debugContactForm().catch(console.error);