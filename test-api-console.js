// ============================================
// API Testing Script for Browser Console
// ============================================
// Copy and paste this entire script into your browser console
// when you're logged into tmarinestream

// Step 1: Set your credentials here
const CONFIG = {
    apiKey: 'PASTE_YOUR_API_KEY_HERE', // Get from Network tab in DevTools
    ecosystem: 'marinestream', // Your ecosystem name
    baseUrl: 'https://api.rise-x.io'
};

// Step 2: Test functions
async function testGetSubscriptions() {
    console.log('🔍 Testing GET subscriptions...');
    console.log(`Endpoint: ${CONFIG.baseUrl}/api/v3/environment/${CONFIG.ecosystem}/subscriptions`);
    
    try {
        const response = await fetch(`${CONFIG.baseUrl}/api/v3/environment/${CONFIG.ecosystem}/subscriptions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Response Status:', response.status, response.statusText);
        console.log('📋 Response Headers:');
        [...response.headers.entries()].forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error Response:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('✅ Success! Data:', data);
        console.log('📊 Data structure:', {
            type: Array.isArray(data) ? 'Array' : typeof data,
            keys: Array.isArray(data) ? `Length: ${data.length}` : Object.keys(data),
            firstItem: Array.isArray(data) && data.length > 0 ? data[0] : data
        });
        
        return data;
    } catch (error) {
        console.error('❌ Fetch Error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}

async function testCreateSubscription(planId, companyId, durationDays = 365) {
    console.log('🔍 Testing CREATE subscription...');
    
    const payload = {
        planId: planId,
        companyId: companyId,
        durationDays: durationDays
    };
    
    console.log('📤 Payload:', payload);
    
    try {
        const response = await fetch(`${CONFIG.baseUrl}/api/v3/environment/${CONFIG.ecosystem}/subscriptions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log('✅ Response Status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error Response:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('✅ Success! Created subscription:', data);
        return data;
    } catch (error) {
        console.error('❌ Fetch Error:', error);
    }
}

async function testGetSubscription(subscriptionId) {
    console.log('🔍 Testing GET single subscription...');
    
    try {
        const response = await fetch(`${CONFIG.baseUrl}/api/v3/environment/${CONFIG.ecosystem}/subscriptions/${subscriptionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Response Status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error Response:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('✅ Success! Subscription data:', data);
        return data;
    } catch (error) {
        console.error('❌ Fetch Error:', error);
    }
}

// Helper: Find API key from Network requests
function findApiKeyFromNetwork() {
    console.log('🔍 Looking for API key in recent network requests...');
    console.log('📝 Instructions:');
    console.log('1. Open DevTools Network tab');
    console.log('2. Filter by "api.rise-x.io" or "rise-x"');
    console.log('3. Click on any request');
    console.log('4. Go to "Headers" tab → "Request Headers"');
    console.log('5. Look for "Authorization: Bearer ..."');
    console.log('6. Copy the token after "Bearer "');
    console.log('');
    console.log('💡 Or check localStorage/sessionStorage for stored tokens:');
    console.log('localStorage:', localStorage);
    console.log('sessionStorage:', sessionStorage);
}

// Quick test - just run this
async function quickTest() {
    console.log('🚀 Starting quick API test...');
    console.log('📋 Configuration:', CONFIG);
    console.log('');
    
    if (!CONFIG.apiKey || CONFIG.apiKey === 'PASTE_YOUR_API_KEY_HERE') {
        console.warn('⚠️  Please set your API key in CONFIG first!');
        findApiKeyFromNetwork();
        return;
    }
    
    await testGetSubscriptions();
}

// Export functions to global scope so you can call them
window.testAPI = {
    getSubscriptions: testGetSubscriptions,
    createSubscription: testCreateSubscription,
    getSubscription: testGetSubscription,
    quickTest: quickTest,
    findApiKey: findApiKeyFromNetwork,
    config: CONFIG
};

console.log('✅ API testing functions loaded!');
console.log('');
console.log('📚 Available functions:');
console.log('  testAPI.quickTest() - Run a quick test');
console.log('  testAPI.getSubscriptions() - Get all subscriptions');
console.log('  testAPI.createSubscription(planId, companyId, days) - Create subscription');
console.log('  testAPI.getSubscription(id) - Get single subscription');
console.log('  testAPI.findApiKey() - Help finding API key');
console.log('');
console.log('⚙️  Edit CONFIG object at the top to set your API key and ecosystem');
console.log('');
console.log('🚀 Run: testAPI.quickTest() to start');

