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
    document.getElementById('pauseSubscription').addEventListener('click', pauseSubscription);
    document.getElementById('updateSubscriptionForm').addEventListener('submit', updateSubscription);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
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
        showNotification('Please enter an API key', 'error');
        return;
    }
    API_CONFIG.apiKey = apiKey;
    localStorage.setItem('apiKey', apiKey);
    showNotification('API key saved successfully', 'success');
}

function clearApiKey() {
    API_CONFIG.apiKey = '';
    document.getElementById('apiKey').value = '';
    localStorage.removeItem('apiKey');
    showNotification('API key cleared', 'info');
}

function saveBaseUrl() {
    const baseUrl = document.getElementById('baseUrl').value.trim();
    if (!baseUrl) {
        showNotification('Please enter a base URL', 'error');
        return;
    }
    API_CONFIG.baseUrl = baseUrl;
    localStorage.setItem('apiBaseUrl', baseUrl);
    showNotification('Base URL saved successfully', 'success');
}

function saveEcosystem() {
    const ecosystem = document.getElementById('ecosystem').value.trim();
    if (!ecosystem) {
        showNotification('Please enter an ecosystem name', 'error');
        return;
    }
    API_CONFIG.ecosystem = ecosystem;
    localStorage.setItem('ecosystem', ecosystem);
    showNotification('Ecosystem saved successfully', 'success');
}

// API Helper Functions
async function apiCall(endpoint, method = 'GET', body = null) {
    if (!API_CONFIG.apiKey) {
        showNotification('Please enter your API key first', 'error');
        throw new Error('API key not set');
    }

    // Check if ecosystem is required (for endpoints that need it)
    if (!API_CONFIG.ecosystem && endpoint.includes('{ecosystem}')) {
        showNotification('Please enter an ecosystem name first', 'error');
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
            const corsError = 'CORS Error: Browser blocked the request due to missing CORS headers.';
            showNotification(corsError, 'error');
            // Show CORS warning modal
            setTimeout(() => {
                document.getElementById('corsWarning').style.display = 'flex';
            }, 500);
            throw new Error(corsError);
        }
        
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            const networkError = 'Network Error: Could not reach the API server. Check your connection and API URL.';
            showNotification(networkError, 'error');
            throw new Error(networkError);
        }
        
        showNotification(error.message || 'An error occurred', 'error');
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
        container.innerHTML = '<p class="info" style="color: #dc3545;">Please enter and save an ecosystem name first</p>';
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
    const pauseBtn = document.getElementById('pauseSubscription');

    cancelBtn.style.display = (status === 'Archived' || status === 'Expired') ? 'none' : 'block';
    activateBtn.style.display = status === 'Active' ? 'none' : 'block';
    pauseBtn.style.display = 'none'; // Pause not in status enum

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
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    try {
        // Use the correct endpoint for creating company subscriptions from plans
        // Endpoint: POST /api/v3/environment/subscriptions (ecosystem in header)
        const result = await apiCall('/api/v3/environment/subscriptions', 'POST', formData);

        showNotification('Subscription created successfully', 'success');
        document.getElementById('createSubscriptionForm').reset();
        loadSubscriptions();
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

        showNotification('Subscription updated successfully', 'success');
        closeModal();
        loadSubscriptions();
    } catch (error) {
        // Error already shown
    }
}

// Cancel Subscription (Archive)
async function cancelSubscription() {
    if (!currentSubscriptionId) return;

    if (!confirm('Are you sure you want to archive this subscription?')) {
        return;
    }

        try {
            // Archive subscription by updating status
            // Endpoint: PUT /api/v3/environment/subscriptions/{subscriptionId}
            const result = await apiCall(`/api/v3/environment/subscriptions/${currentSubscriptionId}`, 'PUT', { status: 'Archived' });

        showNotification('Subscription archived successfully', 'success');
        closeModal();
        loadSubscriptions();
    } catch (error) {
        // Error already shown
    }
}

// Activate Subscription
async function activateSubscription() {
    if (!currentSubscriptionId) return;

        try {
            // Endpoint: PUT /api/v3/environment/subscriptions/{subscriptionId}
            const result = await apiCall(`/api/v3/environment/subscriptions/${currentSubscriptionId}`, 'PUT', { status: 'Active' });

        showNotification('Subscription activated successfully', 'success');
        closeModal();
        loadSubscriptions();
    } catch (error) {
        // Error already shown
    }
}

// Pause Subscription (not in API, but kept for UI consistency)
async function pauseSubscription() {
    showNotification('Pause functionality not available in this API', 'info');
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
    container.innerHTML = '<p class="loading">Loading history...</p>';

    try {
        let history = [];
        
        try {
            history = await apiCall('/api/subscriptions/history');
        } catch (e) {
            try {
                history = await apiCall('/subscriptions/history');
            } catch (e2) {
                try {
                    history = await apiCall('/api/audit-log');
                } catch (e3) {
                    history = await apiCall('/audit-log');
                }
            }
        }

        if (history.data) history = history.data;
        else if (history.history) history = history.history;
        else if (history.logs) history = history.logs;
        else if (!Array.isArray(history)) history = [history];

        if (history.length === 0) {
            container.innerHTML = '<p class="info">No history found</p>';
            return;
        }

        displayHistory(history, container);
    } catch (error) {
        container.innerHTML = `<p class="info" style="color: #dc3545;">Error loading history: ${error.message}</p>`;
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
