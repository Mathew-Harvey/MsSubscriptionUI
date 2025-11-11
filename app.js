// ============================================
// MARINESTREAM SUBSCRIPTION MANAGER
// Clean & Simple
// ============================================

// Configuration - Hardcoded workspace
const CONFIG = {
    workspace: 'marinestream',
    environmentId: 'e9229623-b98c-5bef-8ee5-024f7e905a4c',
    apiKey: localStorage.getItem('apiKey') || '',
    baseUrl: localStorage.getItem('baseUrl') || 'https://api.idiana.io'
};

// State
const state = {
    selectedUser: null,
    companyId: null,
    companyName: null,
    currentResources: [] // Store current resources from subscriptions
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Load saved settings
    if (CONFIG.apiKey) {
        document.getElementById('apiKey').value = CONFIG.apiKey;
        updateConnectionStatus(true);
    }
    if (CONFIG.baseUrl) {
        document.getElementById('baseUrl').value = CONFIG.baseUrl;
    }
}

function setupEventListeners() {
    // Settings
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.getElementById('closeSettings').addEventListener('click', closeSettings);
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    document.getElementById('toggleKey').addEventListener('click', toggleKeyVisibility);

    // Step 1: Find User
    document.getElementById('createUserBtn').addEventListener('click', createUser);
    document.getElementById('findUserBtn').addEventListener('click', findUser);

    // Step 2: Create Subscription
    document.getElementById('autofillCompanyId').addEventListener('click', autofillCompanyId);
    document.getElementById('addResource').addEventListener('click', addResourceRow);
    document.getElementById('subscriptionForm').addEventListener('submit', createSubscription);
    document.getElementById('createAnother').addEventListener('click', resetForm);

    // Resource search removed - API doesn't support it

    // Duration pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            document.getElementById('durationDays').value = pill.dataset.days;
        });
    });

    // Add initial resource row
    addResourceRow();
}

// ============================================
// SETTINGS PANEL
// ============================================

function openSettings() {
    document.getElementById('settingsPanel').classList.add('open');
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('open');
}

function saveSettings() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const baseUrl = document.getElementById('baseUrl').value.trim();

    if (!apiKey) {
        showToast('Please enter your API key', 'error');
        return;
    }

    CONFIG.apiKey = apiKey;
    CONFIG.baseUrl = baseUrl;
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('baseUrl', baseUrl);

    updateConnectionStatus(true);
    closeSettings();
    showToast('Settings saved successfully!', 'success');
}

function toggleKeyVisibility() {
    const input = document.getElementById('apiKey');
    const btn = document.getElementById('toggleKey');
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
    } else {
        input.type = 'password';
        btn.textContent = 'Show';
    }
}

function updateConnectionStatus(connected) {
    const indicator = document.getElementById('statusIndicator');
    const text = document.getElementById('statusText');
    const dot = indicator.querySelector('.status-dot');

    if (connected) {
        dot.classList.add('connected');
        text.textContent = 'Connected';
    } else {
        dot.classList.remove('connected');
        text.textContent = 'Not Connected';
    }
}

// ============================================
// API HELPER
// ============================================

async function apiCall(endpoint, method = 'GET', body = null) {
    if (!CONFIG.apiKey) {
        showToast('Please configure your API key in Settings', 'error');
        throw new Error('API key not configured');
    }

    const url = `${CONFIG.baseUrl}${endpoint}`;
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.apiKey}`,
            'environment': CONFIG.workspace
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    console.log('🌐 API Call:', { method, endpoint, body });

    try {
        const response = await fetch(url, options);
        
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = text ? { message: text } : {};
        }

        if (!response.ok) {
            console.error('❌ API Error:', { status: response.status, data });
            throw new Error(data.message || `Request failed: ${response.status}`);
        }

        console.log('✅ API Response:', data);
        return data;
    } catch (error) {
        console.error('API Error:', error);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
            showToast('Connection blocked. Try using the proxy server.', 'error');
        } else {
            showToast(error.message, 'error');
        }
        
        throw error;
    }
}

// ============================================
// STEP 1: FIND USER
// ============================================

async function createUser() {
    const searchTerm = document.getElementById('userSearch').value.trim();
    
    if (!searchTerm) {
        showToast('Please enter an email address', 'error');
        return;
    }

    // Validate it's an email
    if (!validateEmail(searchTerm)) {
        showToast('Please enter a valid email address for new users', 'error');
        return;
    }

    showToast('Creating user...', 'info');

    try {
        const endpoint = `/api/v3/user/userPlaceholder/${encodeURIComponent(searchTerm)}?isGroup=false`;
        const result = await apiCall(endpoint, 'POST', {});
        
        showToast('User created! Now searching...', 'success');
        
        // Automatically search after creating user
        setTimeout(() => findUser(), 800);
        
    } catch (error) {
        console.error('User creation error:', error);
    }
}

async function findUser() {
    const searchTerm = document.getElementById('userSearch').value.trim();
    
    if (!searchTerm) {
        showToast('Please enter a search term', 'error');
        return;
    }

    showToast('Searching for users...', 'info');

    try {
        const endpoint = `/api/v3/user/search?searchString=${encodeURIComponent(searchTerm)}`;
        const result = await apiCall(endpoint, 'GET');
        
        // Extract users from response
        let users = result.data || result.users || result;
        
        if (!Array.isArray(users)) {
            users = users ? [users] : [];
        }
        
        if (users.length === 0) {
            showToast('No users found. Try creating the user first.', 'warning');
            document.getElementById('userResults').style.display = 'none';
            return;
        }

        // Display user cards
        displayUserResults(users);
        showToast(`Found ${users.length} user${users.length > 1 ? 's' : ''}`, 'success');
        
    } catch (error) {
        console.error('User search error:', error);
        document.getElementById('userResults').style.display = 'none';
    }
}

function displayUserResults(users) {
    const container = document.getElementById('userCards');
    const resultsDiv = document.getElementById('userResults');
    const countEl = document.getElementById('resultsCount');
    
    countEl.textContent = `${users.length} user${users.length > 1 ? 's' : ''} found`;
    
    container.innerHTML = users.map((user, index) => {
        const userName = user.displayName || user.name || user.email?.split('@')[0] || 'User';
        const userEmail = user.email || 'No email';
        const companyName = user.companyName || extractCompanyName(userEmail);
        const companyId = user.companyId || 'Unknown';
        
        return `
            <div class="user-card" data-index="${index}">
                <div class="user-card-header">
                    <div class="user-card-name">${userName}</div>
                    <div class="user-card-badge">User</div>
                </div>
                <div class="user-card-email">${userEmail}</div>
                <div class="user-card-company">
                    <div class="user-card-field">
                        <span class="user-card-label">Company</span>
                        <span class="user-card-value">${companyName}</span>
                    </div>
                    <div class="user-card-field">
                        <span class="user-card-label">Company ID</span>
                        <span class="user-card-value mono">${companyId.substring(0, 12)}...</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Show results
    resultsDiv.style.display = 'block';
    
    // Add click handlers
    container.querySelectorAll('.user-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            selectUser(users[index], card);
        });
    });
}

function selectUser(user, cardElement) {
    state.selectedUser = user;
    state.companyId = user.companyId;
    state.companyName = user.companyName || extractCompanyName(user.email);
    
    // Visual feedback - mark as selected
    document.querySelectorAll('.user-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    
    // Display selection
    const userName = user.displayName || user.name || user.email?.split('@')[0] || 'User';
    document.getElementById('selectedUserName').textContent = userName;
    document.getElementById('selectedUserEmail').textContent = user.email || 'No email';
    document.getElementById('selectedCompanyName').textContent = state.companyName;
    document.getElementById('selectedCompanyId').textContent = state.companyId;
    document.getElementById('selectedUserBox').style.display = 'block';
    
    // Load current subscriptions
    loadCurrentAccess(state.companyId);
    
    // Auto-fill subscription form
    document.getElementById('subscriptionCompanyId').value = state.companyId;
    
    // Auto-suggest subscription name
    const suggestedName = `${state.companyName} - Premium Access`;
    const nameInput = document.getElementById('subscriptionName');
    if (!nameInput.value) {
        nameInput.value = suggestedName;
    }
    
    showToast(`Selected: ${userName}`, 'success');
    
    // Scroll to step 2
    setTimeout(() => {
        document.querySelector('.card:nth-child(2)').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);
}

async function loadCurrentAccess(companyId) {
    const loadingEl = document.getElementById('accessLoading');
    const contentEl = document.getElementById('accessContent');
    
    loadingEl.style.display = 'inline';
    contentEl.innerHTML = '';
    
    try {
        // Get all subscriptions for this company
        const endpoint = `/api/v3/subscription?companyId=${encodeURIComponent(companyId)}`;
        const result = await apiCall(endpoint, 'GET');
        
        let subscriptions = result.data || result.subscriptions || result;
        if (!Array.isArray(subscriptions)) {
            subscriptions = subscriptions ? [subscriptions] : [];
        }
        
        console.log('📊 Subscriptions data received:', subscriptions);
        
        if (subscriptions.length === 0) {
            loadingEl.style.display = 'none';
            contentEl.innerHTML = '<div class="access-empty">No active subscriptions yet. This will be their first!</div>';
            return;
        }
        
        loadingEl.style.display = 'none';
        
        // Extract all resources from all active subscriptions
        extractCurrentResources(subscriptions);
        
        // Display subscriptions with grouped resources
        displayCurrentSubscriptions(subscriptions);
        
        // Pre-populate Step 2 with current resources
        populateResourcesInForm();
        
    } catch (error) {
        console.error('Error loading subscriptions:', error);
        loadingEl.style.display = 'none';
        contentEl.innerHTML = '<div class="access-empty">Could not load current access</div>';
    }
}

function extractCurrentResources(subscriptions) {
    // Extract all resources from active subscriptions
    state.currentResources = [];
    
    subscriptions.forEach(sub => {
        // Only include active subscriptions
        if (sub.status === 1 || sub.status === 'Active' || sub.status === 'active') {
            const resources = sub.resources || [];
            resources.forEach(r => {
                state.currentResources.push({
                    type: r.type || r.resourceType || 'Flow',
                    originId: r.originId || r.resourceId || r.id,
                    features: r.features || r.permissions || []
                });
            });
        }
    });
    
    console.log(`📦 Extracted ${state.currentResources.length} resources from active subscriptions`);
}

function populateResourcesInForm() {
    const list = document.getElementById('resourcesList');
    
    // Clear existing rows
    list.innerHTML = '';
    
    if (state.currentResources.length === 0) {
        // No current resources, add one empty row
        addResourceRow();
        return;
    }
    
    // Add a row for each current resource
    state.currentResources.forEach(resource => {
        const row = document.createElement('div');
        row.className = 'resource-row';
        
        const shortId = resource.originId ? resource.originId.split('-')[0] : '';
        const permissions = Array.isArray(resource.features) ? resource.features.join(', ') : 'View, Start';
        
        row.innerHTML = `
            <select class="resource-type">
                <option value="Flow" ${resource.type === 'Flow' ? 'selected' : ''}>Flow</option>
                <option value="Layout" ${resource.type === 'Layout' ? 'selected' : ''}>Layout</option>
                <option value="Asset" ${resource.type === 'Asset' ? 'selected' : ''}>Asset</option>
            </select>
            <input 
                type="text" 
                class="resource-id-input" 
                value="${resource.originId}"
                placeholder="Paste resource ID from MarineStream"
                required
            />
            <input 
                type="text" 
                class="resource-permissions" 
                value="${permissions}"
                placeholder="View, Start, Edit"
                required
            />
            <button type="button" class="btn-remove" onclick="this.parentElement.remove()">
                ✕
            </button>
        `;
        
        list.appendChild(row);
    });
    
    // Add one extra empty row for adding new resources
    addResourceRow();
    
    showToast(`Pre-loaded ${state.currentResources.length} existing resources - add more or modify`, 'info');
}

function displayCurrentSubscriptions(subscriptions) {
    const contentEl = document.getElementById('accessContent');
    
    // Always show notice about technical IDs
    const noticeHtml = `
        <div class="access-notice">
            <span>ℹ️</span>
            <span>Showing technical IDs (first 8 characters) - hover over any resource to see full ID</span>
        </div>
    `;
    
    const html = subscriptions.map(sub => {
        // Handle status - could be number (1, 0) or string ("Active", "Archived")
        let status = 'Active';
        let statusClass = 'active';
        
        if (sub.status === 1 || sub.status === 'Active' || sub.status === 'active') {
            status = 'Active';
            statusClass = 'active';
        } else if (sub.status === 0 || sub.status === 'Archived' || sub.status === 'archived') {
            status = 'Archived';
            statusClass = 'archived';
        } else if (sub.status === 'Expired' || sub.status === 'expired') {
            status = 'Expired';
            statusClass = 'expired';
        } else if (sub.status) {
            status = String(sub.status);
            statusClass = String(sub.status).toLowerCase();
        }
        
        const displayName = sub.displayName || 'Subscription';
        const validTo = sub.validTo || sub.endDate;
        const expiryDate = validTo ? new Date(validTo).toLocaleDateString() : 'No expiry';
        
        // Get resources and group by type
        const resources = sub.resources || [];
        let resourcesHtml = '';
        
        if (resources.length > 0) {
            // Log first resource to see structure
            if (resources[0]) {
                console.log('📋 Sample resource structure:', resources[0]);
            }
            
            // Group resources by type
            const grouped = {
                Flow: [],
                Layout: [],
                Asset: [],
                Other: []
            };
            
            resources.forEach(r => {
                const type = r.type || r.resourceType || 'Other';
                const group = grouped[type] || grouped.Other;
                group.push(r);
            });
            
            // Display each group
            const groupOrder = ['Flow', 'Layout', 'Asset', 'Other'];
            
            resourcesHtml = groupOrder.map(groupType => {
                const items = grouped[groupType];
                if (!items || items.length === 0) return '';
                
                const icon = groupType === 'Flow' ? '🔄' : groupType === 'Layout' ? '📐' : groupType === 'Asset' ? '📦' : '📄';
                const plural = items.length === 1 ? '' : 's';
                
                const groupHeader = `
                    <div class="resource-group-header">
                        <span class="resource-group-icon">${icon}</span>
                        <span class="resource-group-title">${groupType}${plural} (${items.length})</span>
                    </div>
                `;
                
                const groupItems = items.map(r => {
                    const resourceId = r.originId || r.resourceId || r.id;
                    
                    // Try to get friendly name, otherwise show shortened UUID
                    let displayName = r.name || r.displayName;
                    
                    if (!displayName && resourceId) {
                        const shortId = resourceId.split('-')[0];
                        displayName = shortId;
                    } else if (!displayName) {
                        displayName = 'Unknown';
                    }
                    
                    // Handle features/permissions
                    let perms = '';
                    if (r.features && Array.isArray(r.features)) {
                        perms = r.features.slice(0, 4).join(', ');
                        if (r.features.length > 4) perms += '...';
                    } else if (r.permissions && Array.isArray(r.permissions)) {
                        perms = r.permissions.slice(0, 4).join(', ');
                        if (r.permissions.length > 4) perms += '...';
                    }
                    
                    return `
                        <div class="subscription-resource" title="Full ID: ${resourceId || 'Unknown'}\nType: ${groupType}">
                            <span class="subscription-resource-name">${displayName}</span>
                            <span class="subscription-resource-perms">${perms}</span>
                        </div>
                    `;
                }).join('');
                
                return groupHeader + groupItems;
            }).filter(html => html).join('');
            
        } else {
            resourcesHtml = '<div class="subscription-resource"><span class="subscription-resource-name">Full access (no restrictions)</span></div>';
        }
        
        return `
            <div class="subscription-item">
                <div class="subscription-name">
                    <span>${displayName}</span>
                    <span class="subscription-status ${statusClass}">${status}</span>
                </div>
                <div class="subscription-details">
                    Expires: ${expiryDate}
                </div>
                <div class="subscription-resources">
                    ${resourcesHtml}
                </div>
            </div>
        `;
    }).join('');
    
    contentEl.innerHTML = noticeHtml + html;
}

function extractCompanyName(email) {
    if (!email || !email.includes('@')) return 'Unknown Company';
    const domain = email.split('@')[1];
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function autofillCompanyId() {
    if (state.companyId) {
        document.getElementById('subscriptionCompanyId').value = state.companyId;
        
        // Also fill subscription name if empty
        const nameInput = document.getElementById('subscriptionName');
        if (!nameInput.value && state.companyName) {
            nameInput.value = `${state.companyName} - Premium Access`;
        }
        
        showToast('Company details filled from Step 1', 'success');
    } else {
        showToast('Please select a user from Step 1 first', 'warning');
    }
}

function addResourceRow() {
    const list = document.getElementById('resourcesList');
    
    // Remove empty state if exists
    const emptyState = list.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const row = document.createElement('div');
    row.className = 'resource-row';
    row.innerHTML = `
        <select class="resource-type">
            <option value="Flow">Flow</option>
            <option value="Layout">Layout</option>
            <option value="Asset">Asset</option>
        </select>
        <input 
            type="text" 
            class="resource-id-input" 
            placeholder="Paste resource ID from MarineStream"
            required
        />
        <input 
            type="text" 
            class="resource-permissions" 
            placeholder="View, Start, Edit"
            value="View, Start"
            required
        />
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">
            ✕
        </button>
    `;
    
    list.appendChild(row);
}

// Resource search removed - API endpoints don't exist

async function createSubscription(e) {
    e.preventDefault();

    const companyId = document.getElementById('subscriptionCompanyId').value.trim();
    const displayName = document.getElementById('subscriptionName').value.trim();
    const durationDays = parseInt(document.getElementById('durationDays').value, 10);

    if (!companyId || !displayName) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Collect resources
    const resourceRows = document.querySelectorAll('.resource-row');
    const resources = [];
    let hasError = false;

    resourceRows.forEach(row => {
        if (hasError) return;
        
        const type = row.querySelector('.resource-type').value;
        const originId = row.querySelector('.resource-id-input').value.trim();
        const permissionsText = row.querySelector('.resource-permissions').value.trim();

        if (!originId) {
            showToast('Please enter resource IDs for all flows/assets', 'error');
            hasError = true;
            return;
        }

        if (!permissionsText) {
            showToast('Please enter permissions for all resources', 'error');
            hasError = true;
            return;
        }

        const features = permissionsText.split(',').map(p => p.trim()).filter(p => p);
        resources.push({
            originId: originId,
            type: type,
            features: features
        });
    });

    if (hasError) return;

    if (resources.length === 0) {
        showToast('Please add at least one resource (click + Add)', 'error');
        return;
    }

    showToast('Creating subscription...', 'info');

    try {
        // Step 1: Create the plan
        const planBody = {
            environmentId: CONFIG.environmentId,
            displayName: displayName,
            description: `Subscription for ${displayName}`,
            features: {},
            status: 1,
            resources: resources
        };

        console.log('📦 Creating plan:', planBody);
        const planResult = await apiCall('/api/v3/environment/subscriptions', 'POST', planBody);
        const planId = planResult.id || planResult.planId || planResult.data?.id;

        if (!planId) {
            throw new Error('Plan created but no ID returned');
        }

        console.log('✅ Plan created:', planId);

        // Step 2: Assign plan to company
        const assignBody = {
            planId: planId,
            companyId: companyId,
            durationDays: durationDays
        };

        console.log('🔗 Assigning subscription:', assignBody);
        const assignResult = await apiCall('/api/v3/subscription/assign', 'POST', assignBody);

        console.log('🎉 Subscription assigned:', assignResult);

        // Show success
        const successMsg = `${displayName} can now access ${resources.length} resource${resources.length > 1 ? 's' : ''} for ${durationDays} days.`;
        document.getElementById('successMessage').textContent = successMsg;
        document.getElementById('subscriptionResult').style.display = 'block';
        
        // Hide form
        document.getElementById('subscriptionForm').style.display = 'none';
        
        showToast('Subscription created successfully!', 'success');

    } catch (error) {
        console.error('Subscription creation error:', error);
    }
}

function resetForm() {
    // Reset state
    state.selectedUser = null;
    state.companyId = null;
    state.companyName = null;
    state.currentResources = [];
    
    // Reset search
    document.getElementById('userSearch').value = '';
    document.getElementById('userResults').style.display = 'none';
    document.getElementById('selectedUserBox').style.display = 'none';
    
    // Reset form
    document.getElementById('subscriptionForm').reset();
    document.getElementById('subscriptionForm').style.display = 'block';
    document.getElementById('subscriptionResult').style.display = 'none';
    document.getElementById('durationDays').value = 365;
    
    // Reset active pill
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    document.querySelector('.pill[data-days="365"]').classList.add('active');
    
    // Reset resources list to empty
    const list = document.getElementById('resourcesList');
    list.innerHTML = '';
    addResourceRow();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showToast('Ready for new subscription', 'info');
}

// ============================================
// UTILITIES
// ============================================

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ============================================
// QUICK START ON LOAD
// ============================================

// If no API key, show settings on first load
window.addEventListener('load', () => {
    if (!CONFIG.apiKey) {
        setTimeout(() => {
            showToast('👋 Welcome! Please configure your API key to get started.', 'info');
            setTimeout(() => openSettings(), 1000);
        }, 500);
    }
});
