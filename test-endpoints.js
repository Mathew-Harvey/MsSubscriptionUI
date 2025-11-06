// Endpoint Testing Script
// Run this in the browser console when testing
// Tests various endpoint patterns to find the correct one

const API_CONFIG = {
    apiKey: 'YOUR_API_KEY_HERE',
    ecosystem: 'marinestream',
    baseUrl: 'http://localhost:3000' // or 'https://api.rise-x.io' if testing directly
};

const endpointsToTest = [
    // Ecosystem Plans (from documentation)
    '/api/v3/environment/{ecosystem}/subscriptions',
    
    // Alternative patterns
    '/api/v3/environment/{ecosystem}/plans',
    '/api/v3/subscriptions',
    '/api/v3/diana/subscriptions',
    '/api/subscriptions',
    '/subscriptions',
    '/v3/subscriptions',
    
    // Company-specific
    '/api/v3/companies/{ecosystem}/subscriptions',
    '/api/v3/environment/{ecosystem}/company-subscriptions',
];

async function testEndpoint(endpoint) {
    const url = endpoint.replace('{ecosystem}', API_CONFIG.ecosystem);
    const fullUrl = `${API_CONFIG.baseUrl}${url}`;
    
    console.log(`\n🔍 Testing: ${url}`);
    
    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ SUCCESS!`);
            console.log(`   Response type:`, Array.isArray(data) ? 'Array' : typeof data);
            console.log(`   Keys:`, Object.keys(data));
            if (Array.isArray(data)) {
                console.log(`   Length: ${data.length}`);
                if (data.length > 0) {
                    console.log(`   First item keys:`, Object.keys(data[0]));
                }
            } else if (data.plans) {
                console.log(`   Plans array length: ${data.plans.length}`);
            }
            return { success: true, endpoint: url, data };
        } else {
            const errorText = await response.text();
            console.log(`   ❌ Failed: ${errorText.substring(0, 100)}`);
            return { success: false, endpoint: url, status: response.status };
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return { success: false, endpoint: url, error: error.message };
    }
}

async function testAllEndpoints() {
    console.log('🚀 Testing all endpoint patterns...');
    console.log(`Base URL: ${API_CONFIG.baseUrl}`);
    console.log(`Ecosystem: ${API_CONFIG.ecosystem}`);
    console.log('='.repeat(60));
    
    const results = [];
    
    for (const endpoint of endpointsToTest) {
        const result = await testEndpoint(endpoint);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(60));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    if (successful.length > 0) {
        console.log(`\n✅ Working endpoints (${successful.length}):`);
        successful.forEach(r => {
            console.log(`   ${r.endpoint}`);
        });
    }
    
    if (failed.length > 0) {
        console.log(`\n❌ Failed endpoints (${failed.length}):`);
        failed.slice(0, 5).forEach(r => {
            console.log(`   ${r.endpoint} - ${r.status || r.error}`);
        });
    }
    
    return results;
}

// Export for use
window.testEndpoints = testAllEndpoints;

console.log('✅ Endpoint testing functions loaded!');
console.log('Run: testEndpoints() to test all endpoint patterns');

