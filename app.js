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
    companyId: null,
    companyName: null,
    userEmail: null
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

    // Step 1: Find Company
    document.getElementById('createUserBtn').addEventListener('click', createUser);
    document.getElementById('findCompanyBtn').addEventListener('click', findCompany);
    document.getElementById('copyCompanyId').addEventListener('click', copyCompanyId);

    // Step 2: Create Subscription
    document.getElementById('autofillCompanyId').addEventListener('click', autofillCompanyId);
    document.getElementById('addResource').addEventListener('click', addResourceRow);
    document.getElementById('subscriptionForm').addEventListener('submit', createSubscription);
    document.getElementById('createAnother').addEventListener('click', resetForm);

    // Resource Search
    document.getElementById('closeSearch').addEventListener('click', closeSearchModal);
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchResources(e.target.value.trim());
        }, 300);
    });

    // Close search modal on backdrop click
    document.getElementById('searchModal').addEventListener('click', (e) => {
        if (e.target.id === 'searchModal') {
            closeSearchModal();
        }
    });

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
// STEP 1: FIND COMPANY
// ============================================

async function createUser() {
    const email = document.getElementById('userEmail').value.trim();
    
    if (!email || !validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    state.userEmail = email;
    showToast('Creating user...', 'info');

    try {
        const endpoint = `/api/v3/user/userPlaceholder/${encodeURIComponent(email)}?isGroup=false`;
        await apiCall(endpoint, 'POST', {});
        
        showToast('User created! Now finding company...', 'success');
        
        // Automatically find company after creating user
        setTimeout(() => findCompany(), 500);
        
    } catch (error) {
        console.error('User creation error:', error);
    }
}

async function findCompany() {
    const email = document.getElementById('userEmail').value.trim();
    
    if (!email || !validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    const domain = email.split('@')[1];
    state.userEmail = email;
    
    showToast('Searching for company...', 'info');

    try {
        const endpoint = `/api/v3/user/search?searchString=@${domain}`;
        const result = await apiCall(endpoint, 'GET');
        
        // Extract company ID from response
        let companyId = null;
        let users = result.data || result;
        
        if (!Array.isArray(users)) {
            users = [users];
        }
        
        if (users.length > 0 && users[0].companyId) {
            companyId = users[0].companyId;
        }
        
        if (!companyId) {
            throw new Error('No company found. Try creating the user first.');
        }

        // Extract company name from email domain
        const companyName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
        
        // Store in state
        state.companyId = companyId;
        state.companyName = companyName;

        // Display result
        document.getElementById('companyName').textContent = companyName;
        document.getElementById('companyId').textContent = companyId;
        document.getElementById('companyResult').style.display = 'block';
        
        showToast('Company found!', 'success');
        
        // Smooth scroll to step 2
        setTimeout(() => {
            document.querySelector('.card:nth-child(2)').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 500);
        
    } catch (error) {
        console.error('Company search error:', error);
    }
}

function copyCompanyId() {
    const companyId = document.getElementById('companyId').textContent;
    navigator.clipboard.writeText(companyId).then(() => {
        showToast('Company ID copied!', 'success');
    }).catch(() => {
        showToast('Could not copy to clipboard', 'error');
    });
}

// ============================================
// STEP 2: CREATE SUBSCRIPTION
// ============================================

function autofillCompanyId() {
    if (state.companyId) {
        document.getElementById('subscriptionCompanyId').value = state.companyId;
        showToast('Company ID filled from Step 1', 'success');
    } else {
        showToast('Please complete Step 1 first', 'warning');
    }
}

let currentSearchRow = null;

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
            <option value="Asset">Asset</option>
        </select>
        <div class="resource-input-wrapper">
            <input 
                type="text" 
                class="resource-name" 
                placeholder="Flow or Asset name"
                readonly
                required
            />
            <input type="hidden" class="resource-id" />
            <button type="button" class="btn-search-resource">🔍</button>
        </div>
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
    
    // Add search button listener
    const searchBtn = row.querySelector('.btn-search-resource');
    searchBtn.addEventListener('click', () => {
        currentSearchRow = row;
        openSearchModal();
    });
    
    list.appendChild(row);
}

// ============================================
// RESOURCE SEARCH
// ============================================

function openSearchModal() {
    document.getElementById('searchModal').classList.add('open');
    document.getElementById('searchInput').focus();
}

function closeSearchModal() {
    document.getElementById('searchModal').classList.remove('open');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '<div class="search-empty">Type to search...</div>';
}

let searchTimeout = null;

async function searchResources(query) {
    if (!query || query.length < 2) {
        document.getElementById('searchResults').innerHTML = '<div class="search-empty">Type at least 2 characters...</div>';
        return;
    }

    document.getElementById('searchResults').innerHTML = '<div class="search-loading">Searching...</div>';

    try {
        // Search both flows and assets in parallel
        const [flowsResult, assetsResult] = await Promise.allSettled([
            apiCall(`/api/v3/flows?name=${encodeURIComponent(query)}`).catch(() => ({ data: [] })),
            apiCall(`/api/v3/assets?name=${encodeURIComponent(query)}`).catch(() => ({ data: [] }))
        ]);

        let flows = [];
        let assets = [];

        if (flowsResult.status === 'fulfilled') {
            flows = flowsResult.value?.data || flowsResult.value?.flows || [];
            if (!Array.isArray(flows)) flows = flows ? [flows] : [];
        }

        if (assetsResult.status === 'fulfilled') {
            assets = assetsResult.value?.data || assetsResult.value?.assets || [];
            if (!Array.isArray(assets)) assets = assets ? [assets] : [];
        }

        const results = [
            ...flows.map(f => ({ ...f, type: 'Flow' })),
            ...assets.map(a => ({ ...a, type: 'Asset' }))
        ];

        displaySearchResults(results);

    } catch (error) {
        console.error('Search error:', error);
        document.getElementById('searchResults').innerHTML = '<div class="search-empty">Search failed. Please try again.</div>';
    }
}

function displaySearchResults(results) {
    const container = document.getElementById('searchResults');

    if (results.length === 0) {
        container.innerHTML = '<div class="search-empty">No results found</div>';
        return;
    }

    container.innerHTML = results.map(item => {
        const resourceId = item.resourceId || item.id || item.originId;
        const name = item.name || item.displayName || 'Unnamed';
        
        return `
            <div class="search-item" data-id="${resourceId}" data-name="${name}" data-type="${item.type}">
                <div class="search-item-header">
                    <span class="search-item-name">${name}</span>
                    <span class="search-item-type">${item.type}</span>
                </div>
                <div class="search-item-id">ID: ${resourceId}</div>
            </div>
        `;
    }).join('');

    // Add click handlers
    container.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('click', () => {
            selectResource(
                item.dataset.id,
                item.dataset.name,
                item.dataset.type
            );
        });
    });
}

function selectResource(resourceId, name, type) {
    if (!currentSearchRow) return;

    // Fill the row with selected resource
    currentSearchRow.querySelector('.resource-type').value = type;
    currentSearchRow.querySelector('.resource-name').value = name;
    currentSearchRow.querySelector('.resource-id').value = resourceId;

    // Close modal
    closeSearchModal();
    showToast(`Added: ${name}`, 'success');
}

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

    resourceRows.forEach(row => {
        const type = row.querySelector('.resource-type').value;
        const originId = row.querySelector('.resource-id').value.trim(); // Hidden input
        const permissionsText = row.querySelector('.resource-permissions').value.trim();
        const name = row.querySelector('.resource-name').value.trim();

        if (!originId) {
            showToast('Please search and select all flows/assets', 'error');
            return;
        }

        if (originId && permissionsText) {
            const features = permissionsText.split(',').map(p => p.trim()).filter(p => p);
            resources.push({
                originId: originId,
                type: type,
                features: features
            });
        }
    });

    if (resources.length === 0) {
        showToast('Please add at least one resource (flow or asset)', 'error');
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
    // Reset form
    document.getElementById('subscriptionForm').reset();
    document.getElementById('subscriptionForm').style.display = 'block';
    document.getElementById('subscriptionResult').style.display = 'none';
    document.getElementById('durationDays').value = 365;
    
    // Reset resources list
    const list = document.getElementById('resourcesList');
    list.innerHTML = '';
    addResourceRow();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
