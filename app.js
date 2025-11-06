// API Configuration
const API_CONFIG = {
    baseUrl: localStorage.getItem('apiBaseUrl') || 'https://api.idiana.io',
    apiKey: localStorage.getItem('apiKey') || '',
    ecosystem: localStorage.getItem('ecosystem') || ''
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    updateConnectionStatus();
    updateSetupProgress();
});

// Initialize the application
function initializeApp() {
    // Load saved API key and base URL
    if (API_CONFIG.apiKey) {
        document.getElementById('apiKey').value = API_CONFIG.apiKey;
        // Start expiration timer if key is already saved
        // Note: Timer restarts from 30 min on page load - user should refresh key if working for long periods
        startKeyExpirationTimer();
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
            const target = btn.dataset.target || 'durationDays';
            document.getElementById(target).value = days;
        });
    });
    
    // Show API Key Instructions
    document.getElementById('showKeyInstructions').addEventListener('click', () => {
        document.getElementById('keyInstructionsModal').style.display = 'block';
    });
    
    // Wizard Form
    document.getElementById('wizardForm').addEventListener('submit', handleWizardSubmit);
    document.getElementById('copyEmail').addEventListener('click', copyEmailToClipboard);
    document.getElementById('wizardCreateAnother').addEventListener('click', resetWizard);

    // Subscription actions
    document.getElementById('refreshSubscriptions').addEventListener('click', loadSubscriptions);
    document.getElementById('createSubscriptionForm').addEventListener('submit', createSubscription);
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);

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
    showNotification('✅ Access key saved successfully! Expires in 30 minutes.', 'success');
    updateConnectionStatus();
    updateSetupProgress();
    
    // Start the 30-minute expiration timer
    startKeyExpirationTimer();
}

function clearApiKey() {
    API_CONFIG.apiKey = '';
    document.getElementById('apiKey').value = '';
    localStorage.removeItem('apiKey');
    showNotification('🗑️ Access key cleared', 'info');
    updateConnectionStatus();
    updateSetupProgress();
    
    // Stop the expiration timer
    stopKeyExpirationTimer();
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
                data: data,
                requestBody: body
            });
            
            // Extract helpful error message from various possible formats
            let errorMessage = data.message || data.error || data.details || data.errors;
            if (Array.isArray(data.errors)) {
                errorMessage = data.errors.join(', ');
            }
            if (typeof errorMessage === 'object') {
                errorMessage = JSON.stringify(errorMessage);
            }
            
            throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
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
        // Per API docs:
        // - GET /api/v3/environment/subscriptions → Returns PLANS (templates)
        // - GET /api/v3/subscription → Returns COMPANY SUBSCRIPTIONS
        // Load both and separate them
        
        let allPlans = await apiCall('/api/v3/environment/subscriptions');
        let allSubscriptions = [];
        
        // Handle response format for plans
        if (allPlans.plans) allPlans = allPlans.plans;
        else if (allPlans.data) allPlans = allPlans.data;
        else if (!Array.isArray(allPlans)) allPlans = [allPlans];
        
        // Try to get company subscriptions from different endpoint
        try {
            const subsResponse = await apiCall('/api/v3/subscription', 'GET', null, { silent: true });
            if (subsResponse.data) allSubscriptions = subsResponse.data;
            else if (subsResponse.subscriptions) allSubscriptions = subsResponse.subscriptions;
            else if (Array.isArray(subsResponse)) allSubscriptions = subsResponse;
            else allSubscriptions = [subsResponse];
        } catch (e) {
            console.warn('Company subscriptions endpoint not available:', e.message);
            allSubscriptions = [];
        }
        
        console.log('📦 Loaded plans (templates):', allPlans.length);
        console.log('🏢 Loaded company subscriptions:', allSubscriptions.length);
        
        // Use the already-separated data
        console.log('📋 Plans (templates):', allPlans.length);
        console.log('🏢 Company Subscriptions:', allSubscriptions.length);

        // Display both sections with clear separation
        displayPlansAndSubscriptions(allPlans, allSubscriptions, container);
    } catch (error) {
        container.innerHTML = `<p class="info" style="color: #dc3545;">Error loading subscriptions: ${error.message}</p>`;
    }
}

// New function to display plans and subscriptions separately with visual relationship
function displayPlansAndSubscriptions(plans, companySubscriptions, container) {
    container.innerHTML = '';
    
    // Get unique companies and try to extract friendly names
    const uniqueCompanies = new Map();
    companySubscriptions.forEach(sub => {
        if (!uniqueCompanies.has(sub.companyId)) {
            // Try to extract company name from displayName
            // DisplayName might be like "Acme Corp - Premium" or just "Premium"
            let companyName = sub.companyId;
            if (sub.displayName && sub.displayName.includes('-')) {
                companyName = sub.displayName.split('-')[0].trim();
            } else if (sub.displayName) {
                companyName = sub.displayName;
            }
            
            uniqueCompanies.set(sub.companyId, {
                id: sub.companyId,
                name: companyName,
                subscriptionCount: 0
            });
        }
        uniqueCompanies.get(sub.companyId).subscriptionCount++;
    });
    
    // Create header with stats
    const statsBar = document.createElement('div');
    statsBar.className = 'stats-bar';
    statsBar.innerHTML = `
        <div class="stat-item">
            <span class="stat-icon">📦</span>
            <span class="stat-label">Available Plans</span>
            <span class="stat-value">${plans.length}</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🏢</span>
            <span class="stat-label">Company Subscriptions</span>
            <span class="stat-value">${companySubscriptions.length}</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">👥</span>
            <span class="stat-label">Active Customers</span>
            <span class="stat-value">${uniqueCompanies.size}</span>
        </div>
    `;
    container.appendChild(statsBar);
    
    // Add companies overview section
    if (uniqueCompanies.size > 0) {
        const companiesSection = document.createElement('div');
        companiesSection.className = 'companies-overview';
        companiesSection.innerHTML = `
            <div class="section-title">
                <h3>👥 Active Companies</h3>
                <p class="section-description">Companies with active subscriptions</p>
            </div>
            <div class="companies-grid">
                ${Array.from(uniqueCompanies.values()).map(company => `
                    <div class="company-card" data-company-id="${company.id}">
                        <div class="company-name">${company.name}</div>
                        <div class="company-id copyable" title="Click to copy Company ID" data-copy="${company.id}">
                            ID: ${company.id.substring(0, 8)}... <span class="copy-icon">📋</span>
                        </div>
                        <div class="company-subs">${company.subscriptionCount} subscription${company.subscriptionCount > 1 ? 's' : ''}</div>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(companiesSection);
        
        // Add click handlers for company ID copying
        companiesSection.querySelectorAll('.copyable').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const companyId = el.dataset.copy;
                copyToClipboard(companyId, `📋 Company ID copied: ${companyId.substring(0, 8)}...`);
            });
        });
        
        // Add click handlers to filter subscriptions by company
        companiesSection.querySelectorAll('.company-card').forEach(card => {
            card.addEventListener('click', () => {
                const companyId = card.dataset.companyId;
                filterByCompany(companyId, companySubscriptions, container);
            });
        });
    }
    
    // SECTION 1: Available Plans (Templates)
    const plansSection = document.createElement('div');
    plansSection.className = 'section-container';
    plansSection.innerHTML = `
        <div class="section-title">
            <h3>📦 Available Subscription Plans</h3>
            <p class="section-description">These are the subscription packages you can assign to companies. Click a Plan ID to copy it.</p>
        </div>
    `;
    
    const plansGrid = document.createElement('div');
    plansGrid.className = 'plans-grid';
    
    if (plans.length === 0) {
        plansGrid.innerHTML = '<p class="info">No plans available</p>';
    } else {
        plans.forEach(plan => {
            const planCard = createPlanCard(plan, companySubscriptions);
            plansGrid.appendChild(planCard);
        });
    }
    
    plansSection.appendChild(plansGrid);
    container.appendChild(plansSection);
    
    // SECTION 2: Company Subscriptions
    const subscriptionsSection = document.createElement('div');
    subscriptionsSection.className = 'section-container';
    subscriptionsSection.innerHTML = `
        <div class="section-title">
            <h3>🏢 Company Subscriptions</h3>
            <p class="section-description">Active subscriptions assigned to companies. Click to view details, edit, or archive.</p>
        </div>
    `;
    
    const subscriptionsGrid = document.createElement('div');
    subscriptionsGrid.className = 'subscriptions-list';
    
    if (companySubscriptions.length === 0) {
        subscriptionsGrid.innerHTML = `
            <div class="info-card" style="margin: 0;">
                <h4>🚀 Ready to Create Your First Subscription?</h4>
                <p>You have <strong>${plans.length} plans</strong> available but no company subscriptions yet.</p>
                <p><strong>To create a subscription:</strong></p>
                <ol style="margin: 12px 0; padding-left: 24px;">
                    <li>Copy a <strong>Plan ID</strong> from the plans above (click to copy)</li>
                    <li>Go to the <strong>"➕ Create New"</strong> tab</li>
                    <li>Paste the Plan ID and fill in company details</li>
                    <li>Click Create!</li>
                </ol>
            </div>
        `;
    } else {
        companySubscriptions.forEach(sub => {
            const subCard = createSubscriptionCard(sub, plans);
            subscriptionsGrid.appendChild(subCard);
        });
    }
    
    subscriptionsSection.appendChild(subscriptionsGrid);
    container.appendChild(subscriptionsSection);
}

// Create a plan card with usage stats
function createPlanCard(plan, companySubscriptions) {
    const card = document.createElement('div');
    card.className = 'plan-card';
    
    // Count how many companies use this plan
    const usageCount = companySubscriptions.filter(sub => sub.planId === plan.id).length;
    const planId = plan.id || 'N/A';
    
    card.innerHTML = `
        <div class="plan-card-header">
            <span class="plan-name">${plan.displayName || 'Unnamed Plan'}</span>
            ${usageCount > 0 ? `<span class="usage-badge">${usageCount} ${usageCount === 1 ? 'company' : 'companies'}</span>` : ''}
        </div>
        <div class="plan-details">
            <div class="plan-id-row">
                <span class="detail-label">Plan ID</span>
                <span class="detail-value copyable plan-id-copy" title="Click to copy Plan ID" data-copy="${planId}">
                    ${planId} <span class="copy-icon">📋</span>
                </span>
            </div>
            ${plan.description ? `<div class="plan-description">${plan.description}</div>` : ''}
        </div>
    `;
    
    // Make plan ID copyable
    const copyable = card.querySelector('.copyable');
    if (copyable && planId !== 'N/A') {
        copyable.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(planId, '📋 Plan ID copied! Paste it in the "Create New" tab.');
        });
    }
    
    // Click to view plan details
    card.addEventListener('click', () => {
        viewPlanDetails(plan, companySubscriptions);
    });
    
    return card;
}

// Create a subscription card with plan reference
function createSubscriptionCard(sub, plans) {
    const card = document.createElement('div');
    card.className = 'subscription-card';
    const status = sub.status ? String(sub.status) : 'Unknown';
    const statusLower = status.toLowerCase();
    const companyId = sub.companyId || 'N/A';
    
    // Try to extract company name from displayName
    let companyName = 'Unknown Company';
    if (sub.displayName && sub.displayName.includes('-')) {
        companyName = sub.displayName.split('-')[0].trim();
    } else if (sub.displayName) {
        companyName = sub.displayName;
    }
    
    // Find which plan this subscription uses
    const relatedPlan = plans.find(p => p.id === sub.planId);
    const planName = relatedPlan ? relatedPlan.displayName : sub.planId || 'Unknown Plan';
    
    card.innerHTML = `
        <div class="subscription-card-header">
            <span class="subscription-id">${companyName}</span>
            <span class="status-badge status-${statusLower}">
                ${status}
            </span>
        </div>
        <div class="subscription-details">
            <div class="detail-item">
                <span class="detail-label">📦 Using Plan</span>
                <span class="detail-value plan-reference">${planName}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Company ID</span>
                <span class="detail-value copyable company-id-short" title="Click to copy full ID: ${companyId}" data-copy="${companyId}">
                    ${companyId.substring(0, 8)}... <span class="copy-icon">📋</span>
                </span>
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

    // Make company ID copyable
    const copyable = card.querySelector('.copyable');
    if (copyable && companyId !== 'N/A') {
        copyable.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(companyId, `📋 Company ID copied: ${companyName}`);
        });
    }
    
    // Click to view subscription details
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.copyable')) {
            viewSubscriptionDetails(sub);
        }
    });
    
    return card;
}

// Filter subscriptions by company
function filterByCompany(companyId, allSubscriptions, container) {
    const companySubscriptions = allSubscriptions.filter(sub => sub.companyId === companyId);
    const companyName = companySubscriptions[0]?.displayName?.split('-')[0]?.trim() || companyId;
    
    container.innerHTML = `
        <div class="filtered-view">
            <div class="filter-header">
                <button class="btn btn-secondary" onclick="loadSubscriptions()">← Back to All</button>
                <h3>Subscriptions for: ${companyName}</h3>
            </div>
            <div class="subscriptions-list">
                ${companySubscriptions.map(sub => {
                    const status = sub.status ? String(sub.status) : 'Unknown';
                    const statusLower = status.toLowerCase();
                    return `
                        <div class="subscription-card" onclick='viewSubscriptionDetails(${JSON.stringify(sub).replace(/'/g, "&#39;")})'>
                            <div class="subscription-card-header">
                                <span class="subscription-id">${sub.displayName || 'Subscription'}</span>
                                <span class="status-badge status-${statusLower}">${status}</span>
                            </div>
                            <div class="subscription-details">
                                <div class="detail-item">
                                    <span class="detail-label">Plan ID</span>
                                    <span class="detail-value">${sub.planId || 'N/A'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Valid Until</span>
                                    <span class="detail-value">${formatDate(sub.validTo || sub.endDate)}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// View plan details (read-only, can't edit templates)
function viewPlanDetails(plan, companySubscriptions) {
    const modal = document.getElementById('subscriptionModal');
    const modalBody = document.getElementById('modalBody');
    
    // Find all subscriptions using this plan
    const usedBy = companySubscriptions.filter(sub => sub.planId === plan.id);
    
    modalBody.innerHTML = `
        <div class="subscription-detail-view">
            <div class="info-card" style="margin-bottom: 16px; background: #f0f9ff; border-color: #0ea5e9;">
                <p style="margin: 0;"><strong>📦 This is a Plan Template</strong> - You can't edit templates directly. Create subscriptions that use this plan instead.</p>
            </div>
            
            <div class="detail-row">
                <div class="detail-row-label">Plan Name:</div>
                <div class="detail-row-value">${plan.displayName || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Plan ID:</div>
                <div class="detail-row-value"><code>${plan.id || 'N/A'}</code></div>
            </div>
            ${plan.description ? `
            <div class="detail-row">
                <div class="detail-row-label">Description:</div>
                <div class="detail-row-value">${plan.description}</div>
            </div>
            ` : ''}
            <div class="detail-row">
                <div class="detail-row-label">Status:</div>
                <div class="detail-row-value">${plan.status || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Used By:</div>
                <div class="detail-row-value">
                    ${usedBy.length === 0 
                        ? '<em>No companies using this plan yet</em>' 
                        : `<strong>${usedBy.length} ${usedBy.length === 1 ? 'company' : 'companies'}</strong><br><small>${usedBy.map(s => s.displayName).join(', ')}</small>`
                    }
                </div>
            </div>
            ${plan.features ? `
            <div class="detail-row">
                <div class="detail-row-label">✨ Features:</div>
                <div class="detail-row-value">
                    <div class="json-view">${formatFeatures(plan.features)}</div>
                </div>
            </div>
            ` : ''}
            <div class="detail-row">
                <div class="detail-row-label">Full Data:</div>
                <div class="detail-row-value">
                    <div class="json-view">${JSON.stringify(plan, null, 2)}</div>
                </div>
            </div>
        </div>
    `;
    
    // Hide action buttons for plans (can't edit templates)
    const cancelBtn = document.getElementById('cancelSubscription');
    const activateBtn = document.getElementById('activateSubscription');
    const updateBtn = document.getElementById('updateSubscription');
    
    if (cancelBtn) cancelBtn.style.display = 'none';
    if (activateBtn) activateBtn.style.display = 'none';
    if (updateBtn) updateBtn.style.display = 'none';
    
    modal.style.display = 'block';
}

// View Subscription Details
function viewSubscriptionDetails(subscription) {
    currentSubscriptionId = subscription.id || subscription.subscriptionId;
    const modal = document.getElementById('subscriptionModal');
    const modalBody = document.getElementById('modalBody');
    const status = subscription.status ? String(subscription.status) : 'Unknown';
    const statusLower = status.toLowerCase();
    
    // Extract company name from displayName if possible
    let companyName = 'Unknown Company';
    if (subscription.displayName && subscription.displayName.includes('-')) {
        companyName = subscription.displayName.split('-')[0].trim();
    } else if (subscription.displayName) {
        companyName = subscription.displayName;
    }

    modalBody.innerHTML = `
        <div class="subscription-detail-view">
            <div class="detail-row" style="background: #e0f2fe; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <div class="detail-row-label" style="font-size: 14px;">🏢 Company:</div>
                <div class="detail-row-value" style="font-size: 18px; font-weight: 600; color: #0369a1;">${companyName}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Subscription ID:</div>
                <div class="detail-row-value"><code>${subscription.id || 'N/A'}</code></div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Display Name:</div>
                <div class="detail-row-value">${subscription.displayName || 'N/A'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Plan ID:</div>
                <div class="detail-row-value"><code>${subscription.planId || 'N/A'}</code></div>
            </div>
            <div class="detail-row">
                <div class="detail-row-label">Company ID:</div>
                <div class="detail-row-value">
                    <code>${subscription.companyId || 'N/A'}</code>
                    ${subscription.companyId ? `<button class="btn-link" onclick="copyToClipboard('${subscription.companyId}', '📋 Company ID copied!')" style="margin-left: 8px;">Copy 📋</button>` : ''}
                </div>
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
                <div class="detail-row-label">✨ Features:</div>
                <div class="detail-row-value">
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
                        <strong>What can this subscription do?</strong> These features come from the plan and determine what capabilities users have.
                    </p>
                    <div class="json-view">${formatFeatures(subscription.features)}</div>
                </div>
            </div>
            ` : ''}
            ${subscription.resources ? `
            <div class="detail-row">
                <div class="detail-row-label">📊 Resources:</div>
                <div class="detail-row-value">
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
                        <strong>What can they access?</strong> Specific items and their permissions.
                    </p>
                    <div class="json-view">${formatResources(subscription.resources)}</div>
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

    const displayName = document.getElementById('displayName').value.trim();
    const planId = document.getElementById('planId').value.trim();
    const companyId = document.getElementById('companyId').value.trim();
    const durationDays = parseInt(document.getElementById('durationDays').value, 10);

    if (!displayName || !planId || !companyId || !durationDays) {
        showNotification('⚠️ Please fill in all required fields (marked with *)', 'error');
        return;
    }

    // Per API documentation: Use /api/v3/subscription/assign endpoint
    // This assigns an existing plan to a company (creates company subscription)
    const requestBody = {
        planId: planId,
        companyId: companyId,
        durationDays: durationDays
    };

    console.log('📝 Assigning plan to company via /api/v3/subscription/assign');
    console.log('   Request:', requestBody);

    try {
        const result = await apiCall('/api/v3/subscription/assign', 'POST', requestBody);
        
        console.log('✅ Subscription assigned successfully!', result);
        showNotification(`✅ Subscription created! ${displayName} now has access to the plan.`, 'success');
        
        document.getElementById('createSubscriptionForm').reset();
        document.getElementById('durationDays').value = 365;
        
        setTimeout(() => {
            switchTab('subscriptions');
        }, 1500);
    } catch (error) {
        console.error('❌ Failed to assign subscription:', error);
        showNotification(`❌ Could not create subscription: ${error.message}`, 'error');
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
        // Per API docs: GET /api/v3/subscription/{subscriptionId} (singular!)
        const subscription = await apiCall(`/api/v3/subscription/${subscriptionId}`);

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
        // Per API docs: PATCH /api/v3/subscription/{subscriptionId} (singular!)
        const result = await apiCall(`/api/v3/subscription/${subscriptionId}`, 'PATCH', formData);

        showNotification('✅ Subscription updated successfully! Changes are now live.', 'success');
        closeModal();
        
        // Force refresh the subscriptions list to show updated status
        setTimeout(() => {
            loadSubscriptions();
        }, 500);
    } catch (error) {
        console.error('❌ Failed to update subscription:', error);
        // Error notification already shown by apiCall
    }
}

// Cancel Subscription (Archive)
async function cancelSubscription() {
    if (!currentSubscriptionId) return;

    if (!confirm('⚠️ Are you sure you want to archive this subscription?\n\nThis will STOP the subscription and the customer will LOSE ACCESS immediately.\n\nYou can reactivate it later if needed.')) {
        return;
    }

    try {
        // Per API docs: DELETE /api/v3/subscription/{subscriptionId} archives the subscription
        const result = await apiCall(`/api/v3/subscription/${currentSubscriptionId}`, 'DELETE');

        console.log('✅ Archive result:', result);
        console.log('📝 Expected status: Archived, Returned status:', result.status);
        
        showNotification('✅ Subscription archived. The customer no longer has access.', 'success');
        closeModal();
        
        // Force refresh the subscriptions list to show updated status
        setTimeout(() => {
            loadSubscriptions();
        }, 500);
    } catch (error) {
        console.error('❌ Failed to archive subscription:', error);
        // Error notification already shown by apiCall
    }
}

// Activate Subscription
async function activateSubscription() {
    if (!currentSubscriptionId) return;

    if (!confirm('Activate this subscription?\n\nThe customer will regain access immediately.')) {
        return;
    }

    try {
        // Per API docs: PATCH /api/v3/subscription/{subscriptionId} to reactivate
        const result = await apiCall(`/api/v3/subscription/${currentSubscriptionId}`, 'PATCH', { status: 'Active' });

        showNotification('✅ Subscription activated! The customer now has access.', 'success');
        closeModal();
        
        // Force refresh the subscriptions list to show updated status
        setTimeout(() => {
            loadSubscriptions();
        }, 500);
    } catch (error) {
        console.error('❌ Failed to activate subscription:', error);
        // Error notification already shown by apiCall
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
        // Per API docs: GET /api/v3/subscription?{queryParams} for company subscriptions
        let subscriptions = await apiCall(`/api/v3/subscription?${queryString}`);

        // Handle different response formats
        if (subscriptions.data) subscriptions = subscriptions.data;
        else if (subscriptions.subscriptions) subscriptions = subscriptions.subscriptions;
        else if (!Array.isArray(subscriptions)) subscriptions = [subscriptions];

        if (subscriptions.length === 0) {
            container.innerHTML = '<p class="info">No company subscriptions found matching your filters</p>';
            return;
        }

        // Display filtered company subscriptions (these should all have companyId)
        container.innerHTML = '';
        subscriptions.forEach(sub => {
            const card = createSubscriptionCard(sub, []);
            container.appendChild(card);
        });
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

// Format features in a user-friendly way
function formatFeatures(features) {
    if (!features) return 'No features defined';
    
    let html = '';
    
    if (features.baseFeatures && Array.isArray(features.baseFeatures)) {
        html += '<div style="margin-bottom: 12px;"><strong>✅ Base Features:</strong><br>';
        features.baseFeatures.forEach(feature => {
            html += `<span style="display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 4px; margin: 4px 4px 0 0; font-size: 12px;">${feature}</span>`;
        });
        html += '</div>';
    }
    
    if (features.advancedFeatures && Array.isArray(features.advancedFeatures) && features.advancedFeatures.length > 0) {
        html += '<div style="margin-bottom: 12px;"><strong>⭐ Advanced Features:</strong><br>';
        features.advancedFeatures.forEach(feature => {
            html += `<span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; margin: 4px 4px 0 0; font-size: 12px;">${feature}</span>`;
        });
        html += '</div>';
    }
    
    // Show raw JSON for other properties
    const otherProps = {};
    for (const key in features) {
        if (key !== 'baseFeatures' && key !== 'advancedFeatures') {
            otherProps[key] = features[key];
        }
    }
    
    if (Object.keys(otherProps).length > 0) {
        html += '<div style="margin-top: 12px;"><strong>Other Properties:</strong><br>';
        html += `<pre style="margin-top: 4px;">${JSON.stringify(otherProps, null, 2)}</pre>`;
        html += '</div>';
    }
    
    return html || JSON.stringify(features, null, 2);
}

// Format resources in a user-friendly way
function formatResources(resources) {
    if (!resources) return 'No resources defined';
    if (!Array.isArray(resources)) return JSON.stringify(resources, null, 2);
    
    if (resources.length === 0) {
        return '<p style="color: #94a3b8; font-style: italic;">No specific resources assigned</p>';
    }
    
    let html = '<div style="display: grid; gap: 8px;">';
    resources.forEach((resource, index) => {
        html += `
            <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                <div style="font-weight: 600; color: #0f172a; margin-bottom: 6px;">
                    ${resource.resourceType || 'Resource'} #${index + 1}
                </div>
                ${resource.resourceId ? `<div style="font-size: 12px; color: #64748b;">ID: <code>${resource.resourceId}</code></div>` : ''}
                ${resource.permissions && Array.isArray(resource.permissions) ? `
                    <div style="margin-top: 6px;">
                        <strong style="font-size: 12px;">Permissions:</strong><br>
                        ${resource.permissions.map(p => `<span style="display: inline-block; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 3px; margin: 2px 2px 0 0; font-size: 11px;">${p}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    });
    html += '</div>';
    
    return html;
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

// API Key Expiration Timer
let keyExpirationTimer = null;
let keyExpirationTime = null;
let warningShown = false; // Track if warning notification has been shown

function startKeyExpirationTimer() {
    // Clear any existing timer
    if (keyExpirationTimer) {
        clearInterval(keyExpirationTimer);
    }
    
    // Reset warning flag
    warningShown = false;
    
    // Set expiration to 30 minutes from now
    keyExpirationTime = Date.now() + (30 * 60 * 1000);
    const timerElement = document.getElementById('keyTimer');
    const expirationElement = document.getElementById('keyExpiration');
    
    expirationElement.style.display = 'block';
    expirationElement.classList.remove('warning');
    
    keyExpirationTimer = setInterval(() => {
        const remaining = keyExpirationTime - Date.now();
        
        if (remaining <= 0) {
            clearInterval(keyExpirationTimer);
            timerElement.textContent = 'EXPIRED';
            expirationElement.classList.add('warning');
            showNotification('🔑 API Key expired! Please refresh your key from MarineStream.', 'error');
            return;
        }
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Warning at 5 minutes - only show once
        if (remaining <= 5 * 60 * 1000) {
            expirationElement.classList.add('warning');
            if (!warningShown) {
                showNotification('⚠️ API Key expires in 5 minutes! Get a fresh key soon.', 'warning');
                warningShown = true;
            }
        }
    }, 1000);
}

function stopKeyExpirationTimer() {
    if (keyExpirationTimer) {
        clearInterval(keyExpirationTimer);
        keyExpirationTimer = null;
    }
    document.getElementById('keyExpiration').style.display = 'none';
}

// Wizard Functions
async function handleWizardSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('wizardName').value.trim();
    const email = document.getElementById('wizardEmail').value.trim();
    const companyName = document.getElementById('wizardCompanyName').value.trim();
    const planId = document.getElementById('wizardPlanId').value.trim();
    const durationDays = parseInt(document.getElementById('wizardDuration').value, 10);
    const workflowsText = document.getElementById('wizardWorkflows').value.trim();
    
    if (!name || !email || !companyName || !planId || !durationDays) {
        showNotification('⚠️ Please fill in all required fields', 'error');
        return;
    }
    
    // Generate Company ID
    const companyId = generateUUID();
    const displayName = `${companyName} - ${name}`;
    
    // Parse workflows if provided
    let resources = null;
    if (workflowsText) {
        const workflowIds = workflowsText.split(',').map(id => id.trim()).filter(id => id);
        resources = workflowIds.map(workflowId => ({
            resourceId: workflowId,
            resourceType: 'Flow',
            permissions: ['read', 'execute']
        }));
    }
    
    // Build subscription data
    const subscriptionData = {
        DisplayName: displayName,
        planId: planId,
        companyId: companyId,
        durationDays: durationDays
    };
    
    // Add resources if specified
    if (resources && resources.length > 0) {
        subscriptionData.resources = resources;
    }
    
    console.log('🧙‍♂️ Wizard assigning plan to company via /api/v3/subscription/assign');
    
    // Per API documentation: Use /api/v3/subscription/assign
    const requestBody = {
        planId: planId,
        companyId: companyId,
        durationDays: durationDays
    };
    
    // Note: DisplayName is for UI only, API might not accept it for assign endpoint
    console.log('   Request:', requestBody);
    
    try {
        const result = await apiCall('/api/v3/subscription/assign', 'POST', requestBody);
        
        console.log('✅ Wizard subscription assigned!', result);
        showNotification('✅ User subscription created successfully!', 'success');
        
        // Show results
        document.getElementById('wizardCompanyId').textContent = companyId;
        document.getElementById('wizardDisplayNameResult').textContent = displayName;
        
        // Generate email template
        const emailText = generateWelcomeEmail(name, email, companyName, planId, durationDays);
        document.getElementById('emailPreview').textContent = emailText;
        
        // Show results, hide form
        document.getElementById('wizardForm').style.display = 'none';
        document.getElementById('wizardResults').style.display = 'block';
        
    } catch (error) {
        console.error('Wizard error:', error);
        // Error already shown by apiCall
    }
}

function generateWelcomeEmail(name, email, companyName, planId, durationDays) {
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    const formattedExpiry = expiryDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    return `Subject: Welcome to MarineStream - Your Access is Ready!

Dear ${name},

Great news! Your subscription to MarineStream has been activated.

SUBSCRIPTION DETAILS:
━━━━━━━━━━━━━━━━━━━━
Company: ${companyName}
Plan: ${planId}
Valid Until: ${formattedExpiry} (${durationDays} days)

HOW TO ACCESS:
━━━━━━━━━━━━━━━━━━━━
1. Go to: https://app.marinestream.io
2. Log in with your email: ${email}
3. You now have access to all features included in your plan!

WHAT YOU CAN DO:
━━━━━━━━━━━━━━━━━━━━
Your subscription includes access to workflows, assets, and other features based on your plan.

NEED HELP?
━━━━━━━━━━━━━━━━━━━━
If you have any questions or need assistance getting started, please don't hesitate to reach out.

Welcome aboard!

Best regards,
The MarineStream Team

---
This is an automated message. Please do not reply to this email.`;
}

function copyEmailToClipboard() {
    const emailText = document.getElementById('emailPreview').textContent;
    navigator.clipboard.writeText(emailText).then(() => {
        showNotification('📋 Email copied to clipboard! You can now paste it into your email client.', 'success');
    }).catch(err => {
        showNotification('❌ Could not copy to clipboard. Please select and copy manually.', 'error');
        console.error('Copy failed:', err);
    });
}

function resetWizard() {
    document.getElementById('wizardForm').reset();
    document.getElementById('wizardForm').style.display = 'block';
    document.getElementById('wizardResults').style.display = 'none';
    document.getElementById('wizardDuration').value = 365;
}

// Utility function to copy text to clipboard
function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(successMessage, 'success');
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification(successMessage, 'success');
        } catch (err) {
            showNotification('Could not copy to clipboard', 'error');
            console.error('Copy failed:', err);
        }
        document.body.removeChild(textArea);
    });
}
