// API Configuration
const API_CONFIG = {
    baseUrl: localStorage.getItem('apiBaseUrl') || 'https://api.idiana.io',
    apiKey: localStorage.getItem('apiKey') || '',
    ecosystem: localStorage.getItem('ecosystem') || ''
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadSavedCredentials();
    setupEventListeners();
    updateConnectionStatus();
    updateSetupProgress();
});

// Initialize the application
function initializeApp() {
    // Load saved API key and base URL
    if (API_CONFIG.apiKey) {
        document.getElementById('apiKey').value = API_CONFIG.apiKey;
    }
    if (API_CONFIG.baseUrl) {
        document.getElementById('baseUrl').value = API_CONFIG.baseUrl;
    }
    if (API_CONFIG.ecosystem) {
        document.getElementById('ecosystem').value = API_CONFIG.ecosystem;
    }
}

// UUID Generator
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Update Connection Status Indicator
function updateConnectionStatus() {
    const statusElement = document.getElementById('connectionStatus');
    const statusDot = statusElement.querySelector('.status-dot');
    const statusText = statusElement.querySelector('.status-text');
    
    const hasKey = !!API_CONFIG.apiKey;
    const hasUrl = !!API_CONFIG.baseUrl;
    const hasEcosystem = !!API_CONFIG.ecosystem;
    const isConnected = hasKey && hasUrl && hasEcosystem;
    
    if (isConnected) {
        statusDot.classList.add('connected');
        statusText.textContent = `Connected to ${API_CONFIG.ecosystem}`;
    } else {
        statusDot.classList.remove('connected');
        statusText.textContent = 'Not Connected - Complete Setup';
    }
}

// Update Setup Progress
function updateSetupProgress() {
    const progressItems = document.querySelectorAll('.progress-item');
    
    // Check each step
    if (API_CONFIG.apiKey) {
        progressItems[0].classList.add('complete');
    } else {
        progressItems[0].classList.remove('complete');
    }
    
    if (API_CONFIG.baseUrl) {
        progressItems[1].classList.add('complete');
    } else {
        progressItems[1].classList.remove('complete');
    }
    
    if (API_CONFIG.ecosystem) {
        progressItems[2].classList.add('complete');
    } else {
        progressItems[2].classList.remove('complete');
    }
}

// Test API Connection
async function testConnection() {
    if (!API_CONFIG.apiKey || !API_CONFIG.baseUrl || !API_CONFIG.ecosystem) {
        showNotification('⚠️ Please complete all setup steps first', 'error');
        return;
    }
    
    showNotification('🔄 Testing connection...', 'info');
    
    try {
        await apiCall('/api/v3/environment/subscriptions');
        showNotification('✅ Connection successful! You\'re all set up.', 'success');
        updateConnectionStatus();
    } catch (error) {
        showNotification('❌ Connection failed. Please check your settings.', 'error');
    }
}

// Load saved credentials
function loadSavedCredentials() {
    const savedKey = localStorage.getItem('apiKey');
    const savedUrl = localStorage.getItem('apiBaseUrl');
    const savedEcosystem = localStorage.getItem('ecosystem');
    
    if (savedKey) {
        API_CONFIG.apiKey = savedKey;
    }
    if (savedUrl) {
        API_CONFIG.baseUrl = savedUrl;
    }
    if (savedEcosystem) {
        API_CONFIG.ecosystem = savedEcosystem;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // API Key management
    document.getElementById('saveKey').addEventListener('click', saveApiKey);
    document.getElementById('clearKey').addEventListener('click', clearApiKey);
    document.getElementById('saveUrl').addEventListener('click', saveBaseUrl);
    document.getElementById('saveEcosystem').addEventListener('click', saveEcosystem);
    document.getElementById('testConnection').addEventListener('click', testConnection);

    // Toggle password visibility
    document.getElementById('toggleApiKey').addEventListener('click', togglePasswordVisibility);

    // UUID Generation
    document.getElementById('generateUUID').addEventListener('click', () => {
        const companyIdInput = document.getElementById('companyId');
        companyIdInput.value = generateUUID();
        showNotification('✨ New UUID generated!', 'success');
    });

    // Show UUID Info Modal
    document.getElementById('showUUIDInfo').addEventListener('click', () => {
        document.getElementById('uuidInfoModal').style.display = 'block';
    });

    // Duration Quick Buttons
    document.querySelectorAll('.btn-duration').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const days = btn.dataset.days;
            document.getElementById('durationDays').value = days;
        });
    });

    // Subscription actions
    document.getElementById('refreshSubscriptions').addEventListener('click', loadSubscriptions);
    document.getElementById('createSubscriptionForm').addEventListener('submit', createSubscription);
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    document.getElementById('refreshHistory').addEventListener('click', loadHistory);

    // Modal actions
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });

    document.getElementById('updateSubscription').addEventListener('click', openUpdateModal);
    document.getElementById('cancelSubscription').addEventListener('click', cancelSubscription);
    document.getElementById('activateSubscription').addEventListener('click', activateSubscription);
    document.getElementById('updateSubscriptionForm').addEventListener('submit', updateSubscription);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleBtn = document.getElementById('toggleApiKey');
    
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        apiKeyInput.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Load data if needed
    if (tabName === 'subscriptions') {
        loadSubscriptions();
    } else if (tabName === 'history') {
        loadHistory();
    }
}

// API Key Management
function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (!apiKey) {
        showNotification('⚠️ Please enter an access key', 'error');
        return;
    }
    API_CONFIG.apiKey = apiKey;
    localStorage.setItem('apiKey', apiKey);
    showNotification('✅ Access key saved successfully!', 'success');
    updateConnectionStatus();
    updateSetupProgress();
}

function clearApiKey() {
    API_CONFIG.apiKey = '';
    document.getElementById('apiKey').value = '';
    localStorage.removeItem('apiKey');
    showNotification('🗑️ Access key cleared', 'info');
    updateConnectionStatus();
    updateSetupProgress();
}

function saveBaseUrl() {
    const baseUrl = document.getElementById('baseUrl').value.trim();
    if (!baseUrl) {
        showNotification('⚠️ Please enter a system address', 'error');
        return;
    }
    API_CONFIG.baseUrl = baseUrl;
    localStorage.setItem('apiBaseUrl', baseUrl);
    showNotification('✅ System address saved successfully!', 'success');
    updateConnectionStatus();
    updateSetupProgress();
}

function saveEcosystem() {
    const ecosystem = document.getElementById('ecosystem').value.trim();
    if (!ecosystem) {
        showNotification('⚠️ Please enter a workspace name', 'error');
        return;
    }
    API_CONFIG.ecosystem = ecosystem;
    localStorage.setItem('ecosystem', ecosystem);
    showNotification('✅ Workspace saved successfully!', 'success');
    updateConnectionStatus();
    updateSetupProgress();
}

// API Helper Functions
async function apiCall(endpoint, method = 'GET', body = null, config = {}) {
    const { silent = false } = config; // Add silent option to suppress user-facing errors
    
    if (!API_CONFIG.apiKey) {
        if (!silent) showNotification('🔑 Please enter and save your access key first', 'error');
        throw new Error('API key not set');
    }

    // Check if ecosystem is required (for endpoints that need it)
    if (!API_CONFIG.ecosystem && endpoint.includes('{ecosystem}')) {
        if (!silent) showNotification('🏢 Please enter and save your workspace name first', 'error');
        throw new Error('Ecosystem not set');
    }

    // Remove {ecosystem} placeholder from endpoint - ecosystem goes in header, not URL
    const finalEndpoint = endpoint.replace('/{ecosystem}', '').replace('{ecosystem}', '');
    
    // Fix URL construction to avoid double slashes
    const baseUrl = API_CONFIG.baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
    const cleanEndpoint = finalEndpoint.startsWith('/') ? finalEndpoint : `/${finalEndpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;
    
    console.log('🌐 API Call:', {
        method,
        baseUrl: API_CONFIG.baseUrl,
        endpoint: finalEndpoint,
        finalUrl: url,
        ecosystem: API_CONFIG.ecosystem
    });
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.apiKey}`
        }
    };
    
    // Add ecosystem as a header (not in URL path)
    if (API_CONFIG.ecosystem) {
        options.headers['environment'] = API_CONFIG.ecosystem;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        
        // Handle empty responses
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            if (!text) {
                data = {};
            } else {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { message: text };
                }
            }
        }

        if (!response.ok) {
            // Log detailed error information
            console.error('❌ API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                url: url,
                data: data
            });
            throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        
        // Handle CORS errors specifically
        if (error.message.includes('Failed to fetch') || error.message.includes('CORS') || 
            error.message.includes('Access-Control')) {
            const corsError = '⚠️ Connection Blocked: Your browser blocked the request. Try using the proxy server.';
            if (!silent) {
                showNotification(corsError, 'error');
                // Show CORS warning modal
                setTimeout(() => {
                    document.getElementById('corsWarning').style.display = 'flex';
                }, 500);
            }
            throw new Error(corsError);
        }
        
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            const networkError = '🌐 Network Error: Cannot reach the server. Check your System Address setting.';
            if (!silent) showNotification(networkError, 'error');
            throw new Error(networkError);
        }
        
        // Only show user notifications if not silent
        if (!silent) {
            // Handle 401 Unauthorized
            if (error.message.includes('401')) {
                showNotification('🔑 Invalid Access Key: Please check your API key is correct.', 'error');
            } 
            // Handle 404 Not Found
            else if (error.message.includes('404')) {
                showNotification('❌ Not Found: The subscription or endpoint does not exist.', 'error');
            }
            // Handle 403 Forbidden
            else if (error.message.includes('403')) {
                showNotification('🚫 Access Denied: You don\'t have permission for this action.', 'error');
            }
            // Generic error
            else {
                showNotification(error.message || '❌ An error occurred', 'error');
            }
        }
        
        throw error;
    }
}

// Load Subscriptions
let currentSubscriptionId = null;

async function loadSubscriptions() {
    const container = document.getElementById('subscriptionsList');
    container.innerHTML = '<p class="loading">Loading subscriptions...</p>';

    // Check if ecosystem is set
    if (!API_CONFIG.ecosystem) {
        container.innerHTML = '<p class="info" style="color: #dc3545;">⚠️ Please complete the setup in the sidebar: enter and save your workspace name</p>';
        return;
    }

    try {
        // Based on Postman screenshot: GET /api/v3/environment/subscriptions
        // Ecosystem is passed as a header 'environment', not in the URL path
        let subscriptions = await apiCall('/api/v3/environment/subscriptions');

        // Handle response format - API returns { plans: [...] } for ecosystem plans
        // The endpoint /api/v3/environment/{ecosystem}/subscriptions returns PLANS (templates)
        // For actual company subscriptions, there might be a different endpoint
        if (subscriptions.plans) {
            subscriptions = subscriptions.plans;
            console.log('📋 Found plans:', subscriptions.length);
        } else if (subscriptions.data) {
            subscriptions = subscriptions.data;
        } else if (subscriptions.subscriptions) {
            subscriptions = subscriptions.subscriptions;
        } else if (!Array.isArray(subscriptions)) {
            subscriptions = [subscriptions];
        }
        
        console.log('📦 Processed subscriptions/plans:', subscriptions.length);

        if (subscriptions.length === 0) {
            container.innerHTML = '<p class="info">No subscriptions found</p>';
            return;
        }

        displaySubscriptions(subscriptions, container);
    } catch (error) {
        container.innerHTML = `<p class="info" style="color: #dc3545;">Error loading subscriptions: ${error.message}</p>`;
    }
}

function displaySubscriptions(subscriptions, container) {
    container.innerHTML = '';

    subscriptions.forEach(sub => {
        const card = document.createElement('div');
        card.className = 'subscription-card';
        const status = sub.status || 'Unknown';
        const statusLower = status.toLowerCase();
        card.innerHTML = `
            <div class="subscription-card-header">
                <span class="subscription-id">${sub.displayName || sub.id || 'N/A'}</span>
                <span class="status-badge status-${statusLower}">
                    ${status}
                </span>
            </div>
            <div class="subscription-details">
                <div class="detail-item">
                    <span class="detail-label">Plan ID</span>
                    <span class="detail-value">${sub.id || sub.planId || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Company ID</span>
                    <span class="detail-value">${sub.companyId || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Valid From</span>
                    <span class="detail-value">${formatDate(sub.validFrom || sub.startDate)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Valid To</span>
                    <span class="detail-value">${formatDate(sub.validTo || sub.endDate)}</span>
                </div>
            </div>
        `;

        card.addEventListener('click', () => viewSubscriptionDetails(sub));
        container.appendChild(card);
    });
}

// View Subscription Details
function viewSubscriptionDetails(subscription) {
    currentSubscriptionId = subscription.id || subscription.subscriptionId;
    const modal = document.getElementById('subscriptionModal');
    const modalBody = document.getElementById('modalBody');
    const status = subscription.status || 'Unknown';
    const statusLower = status.toLowerCase();

    modalBody.innerHTML = `
        <div class="subscription-detail-view">
            <div class="detail-row">
                <div class="detail-row-label">Subscription ID:</div>
                <div class="detail-row-value">${subscription.id || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Display Name:</div>
                <div class="detail-row-value">${subscription.displayName || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Plan ID:</div>
                <div class="detail-row-value">${subscription.planId || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Company ID:</div>
                <div class="detail-row-value">${subscription.companyId || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Environment ID:</div>
                <div class="detail-row-value">${subscription.environmentId || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Status:</div>
                <div class="detail-row-value">
                    <span class="status-badge status-${statusLower}">
                        ${status}
                    </span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Valid From:</div>
                <div class="detail-row-value">${formatDate(subscription.validFrom || subscription.startDate)}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Valid To:</div>
                <div class="detail-row-value">${formatDate(subscription.validTo || subscription.endDate)}</div>
            </div>
            ${subscription.description ? `
            <div class="detail-row">
                <div class="detail-row-label">Description:</div>
                <div class="detail-row-value">${subscription.description}</div>
            </div>
            ` : ''}
            ${subscription.features ? `
            <div class="detail-row">
                <div class="detail-row-label">Features:</div>
                <div class="detail-row-value">
                    <div class="json-view">${JSON.stringify(subscription.features, null, 2)}</div>
                </div>
            </div>
            ` : ''}
            ${subscription.resources ? `
            <div class="detail-row">
                <div class="detail-row-label">Resources:</div>
                <div class="detail-row-value">
                    <div class="json-view">${JSON.stringify(subscription.resources, null, 2)}</div>
                </div>
            </div>
            ` : ''}
            <div class="detail-row">
                <div class="detail-row-label">Full Data:</div>
                <div class="detail-row-value">
                    <div class="json-view">${JSON.stringify(subscription, null, 2)}</div>
                </div>
            </div>
        </div>
    `;

    // Show/hide action buttons based on status
    const cancelBtn = document.getElementById('cancelSubscription');
    const activateBtn = document.getElementById('activateSubscription');

    if (cancelBtn) {
        cancelBtn.style.display = (status === 'Archived' || status === 'Expired') ? 'none' : 'block';
    }
    if (activateBtn) {
        activateBtn.style.display = status === 'Active' ? 'none' : 'block';
    }

    modal.style.display = 'block';
}

// Create Subscription
async function createSubscription(e) {
    e.preventDefault();

    // Use PlanRequest structure: planId, companyId, durationDays
    const formData = {
        planId: document.getElementById('planId').value.trim(),
        companyId: document.getElementById('companyId').value.trim(),
        durationDays: parseInt(document.getElementById('durationDays').value, 10)
    };

    if (!formData.planId || !formData.companyId || !formData.durationDays) {
        showNotification('⚠️ Please fill in all required fields (marked with *)', 'error');
        return;
    }

    try {
        // Use the correct endpoint for creating company subscriptions from plans
        // Endpoint: POST /api/v3/environment/subscriptions (ecosystem in header)
        const result = await apiCall('/api/v3/environment/subscriptions', 'POST', formData);

        showNotification('✅ Subscription created successfully! The customer now has access.', 'success');
        document.getElementById('createSubscriptionForm').reset();
        
        // Reset duration to default
        document.getElementById('durationDays').value = 365;
        
        // Switch to subscriptions tab to see the new subscription
        setTimeout(() => {
            switchTab('subscriptions');
        }, 1500);
    } catch (error) {
        // Error already shown by apiCall
    }
}

// Update Subscription
function openUpdateModal() {
    if (!currentSubscriptionId) return;

    // Fetch current subscription data
    fetchSubscriptionDetails(currentSubscriptionId).then(subscription => {
        document.getElementById('updateSubscriptionId').value = currentSubscriptionId;
        document.getElementById('updatePlanId').value = subscription.planId || '';
        document.getElementById('updateStartDate').value = subscription.validFrom || subscription.startDate || '';
        document.getElementById('updateEndDate').value = subscription.validTo || subscription.endDate || '';
        document.getElementById('updateStatus').value = subscription.status || 'Active';
        document.getElementById('updateMetadata').value = subscription.metadata 
            ? JSON.stringify(subscription.metadata, null, 2) 
            : '';

        document.getElementById('subscriptionModal').style.display = 'none';
        document.getElementById('updateModal').style.display = 'block';
    });
}

async function fetchSubscriptionDetails(subscriptionId) {
    try {
        // Use the correct endpoint pattern: GET /api/v3/environment/subscriptions/{subscriptionId}
        const subscription = await apiCall(`/api/v3/environment/subscriptions/${subscriptionId}`);

        if (subscription.data) return subscription.data;
        return subscription;
    } catch (error) {
        showNotification('Error fetching subscription details', 'error');
        throw error;
    }
}

async function updateSubscription(e) {
    e.preventDefault();

    const subscriptionId = document.getElementById('updateSubscriptionId').value;
    const formData = {};

    const planId = document.getElementById('updatePlanId').value.trim();
    const status = document.getElementById('updateStatus').value;
    const validFrom = document.getElementById('updateStartDate').value;
    const validTo = document.getElementById('updateEndDate').value;
    const metadataText = document.getElementById('updateMetadata').value.trim();

    if (planId) formData.planId = planId;
    if (status) formData.status = status;
    if (validFrom) formData.validFrom = validFrom;
    if (validTo) formData.validTo = validTo;
    if (metadataText) {
        try {
            formData.metadata = JSON.parse(metadataText);
        } catch (e) {
            showNotification('Invalid JSON in metadata field', 'error');
            return;
        }
    }

        try {
            // Endpoint: PUT /api/v3/environment/subscriptions/{subscriptionId}
            const result = await apiCall(`/api/v3/environment/subscriptions/${subscriptionId}`, 'PUT', formData);

        showNotification('✅ Subscription updated successfully! Changes are now live.', 'success');
        closeModal();
        loadSubscriptions();
    } catch (error) {
        // Error already shown
    }
}

// Cancel Subscription (Archive)
async function cancelSubscription() {
    if (!currentSubscriptionId) return;

    if (!confirm('⚠️ Are you sure you want to archive this subscription?\n\nThis will STOP the subscription and the customer will LOSE ACCESS immediately.\n\nYou can reactivate it later if needed.')) {
        return;
    }

        try {
            // Archive subscription by updating status
            // Endpoint: PUT /api/v3/environment/subscriptions/{subscriptionId}
            const result = await apiCall(`/api/v3/environment/subscriptions/${currentSubscriptionId}`, 'PUT', { status: 'Archived' });

        showNotification('✅ Subscription archived. The customer no longer has access.', 'success');
        closeModal();
        loadSubscriptions();
    } catch (error) {
        // Error already shown
    }
}

// Activate Subscription
async function activateSubscription() {
    if (!currentSubscriptionId) return;

    if (!confirm('Activate this subscription?\n\nThe customer will regain access immediately.')) {
        return;
    }

        try {
            // Endpoint: PUT /api/v3/environment/subscriptions/{subscriptionId}
            const result = await apiCall(`/api/v3/environment/subscriptions/${currentSubscriptionId}`, 'PUT', { status: 'Active' });

        showNotification('✅ Subscription activated! The customer now has access.', 'success');
        closeModal();
        loadSubscriptions();
    } catch (error) {
        // Error already shown
    }
}

// Search & Filter
async function applyFilters() {
    const companyId = document.getElementById('searchCompanyId').value.trim();
    const companyName = document.getElementById('searchCompanyName').value.trim();
    const planId = document.getElementById('searchPlanId').value.trim();
    const status = document.getElementById('searchStatus').value;
    const dateFrom = document.getElementById('searchDateFrom').value;
    const dateTo = document.getElementById('searchDateTo').value;

    const container = document.getElementById('filteredResults');
    container.innerHTML = '<p class="loading">Searching...</p>';

    try {
        // Build query parameters according to GetSubscriptionsRequest
        const params = new URLSearchParams();
        if (companyId) params.append('companyId', companyId);
        if (companyName) params.append('companyName', companyName);
        if (planId) params.append('planId', planId);
        if (status) params.append('status', status);
        if (dateFrom) params.append('dateFrom', dateFrom);
        if (dateTo) params.append('dateTo', dateTo);

            const queryString = params.toString();
            // Use the correct endpoint with query parameters
            // Endpoint: GET /api/v3/environment/subscriptions?{queryParams}
            let subscriptions = await apiCall(`/api/v3/environment/subscriptions?${queryString}`);

        // Handle different response formats
        if (subscriptions.plans) subscriptions = subscriptions.plans;
        else if (subscriptions.data) subscriptions = subscriptions.data;
        else if (subscriptions.subscriptions) subscriptions = subscriptions.subscriptions;
        else if (!Array.isArray(subscriptions)) subscriptions = [subscriptions];

        if (subscriptions.length === 0) {
            container.innerHTML = '<p class="info">No subscriptions found matching your filters</p>';
            return;
        }

        displaySubscriptions(subscriptions, container);
    } catch (error) {
        container.innerHTML = `<p class="info" style="color: #dc3545;">Error searching: ${error.message}</p>`;
    }
}

function clearFilters() {
    document.getElementById('searchCompanyId').value = '';
    document.getElementById('searchCompanyName').value = '';
    document.getElementById('searchPlanId').value = '';
    document.getElementById('searchStatus').value = '';
    document.getElementById('searchDateFrom').value = '';
    document.getElementById('searchDateTo').value = '';
    document.getElementById('filteredResults').innerHTML = '<p class="info">Use filters above to search subscriptions</p>';
}

// Load History
async function loadHistory() {
    const container = document.getElementById('historyList');
    container.innerHTML = '<p class="loading">Checking for history...</p>';

    // Note: History/audit log endpoints may not be available in all API versions
    // This attempts to load from common endpoints, but gracefully handles if unavailable
    
    try {
        let history = [];
        let historyEndpoint = null;
        
        // Try various possible history endpoints
        const endpointsToTry = [
            '/api/v3/environment/audit-log',
            '/api/v3/audit-log',
            '/api/subscriptions/history',
            '/api/v3/environment/subscriptions/history'
        ];
        
        for (const endpoint of endpointsToTry) {
            try {
                history = await apiCall(endpoint, 'GET', null, { silent: true });
                historyEndpoint = endpoint;
                console.log(`✅ History found at: ${endpoint}`);
                break;
            } catch (e) {
                // Silently try next endpoint
                continue;
            }
        }

        if (!historyEndpoint) {
            // No history endpoint found - show friendly message
            container.innerHTML = `
                <div class="info-card" style="margin: 0;">
                    <h4>📜 History Not Available</h4>
                    <p>The audit log/history feature is not available in your current API setup.</p>
                    <p><strong>What you can do instead:</strong></p>
                    <ul>
                        <li>View all subscriptions in the "📋 All Subscriptions" tab</li>
                        <li>Use the "🔍 Search" tab to find specific subscriptions by status or date</li>
                        <li>Check subscription details by clicking on any subscription card</li>
                    </ul>
                    <p style="margin-top: 12px; font-size: 12px; color: var(--text-hint);">
                        💡 History tracking may need to be enabled by your system administrator.
                    </p>
                </div>
            `;
            return;
        }

        // Parse response
        if (history.data) history = history.data;
        else if (history.history) history = history.history;
        else if (history.logs) history = history.logs;
        else if (!Array.isArray(history)) history = [history];

        if (history.length === 0) {
            container.innerHTML = `
                <div class="info-card" style="margin: 0;">
                    <h4>📜 No History Yet</h4>
                    <p>No subscription activity has been recorded yet.</p>
                    <p>History will appear here after you create, update, or modify subscriptions.</p>
                </div>
            `;
            return;
        }

        displayHistory(history, container);
        showNotification('✅ History loaded successfully', 'success');
        
    } catch (error) {
        console.error('History error:', error);
        container.innerHTML = `
            <div class="info-card" style="margin: 0; border-left-color: #f59e0b;">
                <h4>⚠️ Cannot Load History</h4>
                <p>Unable to access the history feature at this time.</p>
                <p><strong>This might mean:</strong></p>
                <ul>
                    <li>Your API doesn't support history tracking</li>
                    <li>You don't have permission to view history</li>
                    <li>The feature needs to be enabled by an administrator</li>
                </ul>
                <p style="margin-top: 12px;">
                    <strong>Try:</strong> Using the Search tab to find subscriptions by date range instead.
                </p>
            </div>
        `;
    }
}

function displayHistory(history, container) {
    container.innerHTML = '';

    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-item-info">
                <strong>${item.action || item.event || 'Unknown Action'}</strong>
                <p>Subscription: ${item.subscriptionId || item.id || 'N/A'}</p>
                ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
            <div class="history-item-time">${formatDate(item.timestamp || item.createdAt || item.date)}</div>
        `;
        container.appendChild(historyItem);
    });
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
        return dateString;
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    currentSubscriptionId = null;
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}
