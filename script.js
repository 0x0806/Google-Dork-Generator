
// Global variables
let savedDorks = JSON.parse(localStorage.getItem('savedDorks') || '[]');
let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
let currentTheme = localStorage.getItem('theme') || 'light';

// Preset dorks database
const presetDorks = [
    {
        id: 1,
        name: "Admin Login Pages",
        description: "Find admin login pages and panels",
        dork: 'site:example.com inurl:admin inurl:login',
        category: "admin",
        tags: ["admin", "login", "security"]
    },
    {
        id: 2,
        name: "Config Files",
        description: "Search for configuration files",
        dork: 'filetype:conf OR filetype:config OR filetype:cfg',
        category: "security",
        tags: ["config", "files", "security"]
    },
    {
        id: 3,
        name: "Database Files",
        description: "Find database dump files",
        dork: 'filetype:sql OR filetype:db OR filetype:dbf',
        category: "database",
        tags: ["database", "sql", "files"]
    },
    {
        id: 4,
        name: "PDF Documents",
        description: "Search for PDF documents",
        dork: 'filetype:pdf',
        category: "documents",
        tags: ["pdf", "documents"]
    },
    {
        id: 5,
        name: "Login Portals",
        description: "Find various login portals",
        dork: 'intitle:"login" OR intitle:"sign in" OR intitle:"log in"',
        category: "login",
        tags: ["login", "portal", "authentication"]
    },
    {
        id: 6,
        name: "Directory Listings",
        description: "Find open directory listings",
        dork: 'intitle:"index of" OR intitle:"directory listing"',
        category: "security",
        tags: ["directory", "listing", "open"]
    },
    {
        id: 7,
        name: "Backup Files",
        description: "Search for backup files",
        dork: 'filetype:bak OR filetype:backup OR filetype:bkp',
        category: "security",
        tags: ["backup", "files", "security"]
    },
    {
        id: 8,
        name: "Log Files",
        description: "Find log files",
        dork: 'filetype:log OR intitle:"access log" OR intitle:"error log"',
        category: "security",
        tags: ["logs", "files", "error"]
    },
    {
        id: 9,
        name: "WordPress Admin",
        description: "Find WordPress admin panels",
        dork: 'site:example.com inurl:wp-admin',
        category: "admin",
        tags: ["wordpress", "admin", "cms"]
    },
    {
        id: 10,
        name: "Error Pages",
        description: "Find error pages that may reveal information",
        dork: 'intitle:"error" OR intitle:"404" OR intitle:"500"',
        category: "security",
        tags: ["error", "404", "500"]
    },
    {
        id: 11,
        name: "FTP Servers",
        description: "Find FTP servers",
        dork: 'intitle:"FTP" OR inurl:ftp OR "index of" ftp',
        category: "security",
        tags: ["ftp", "server", "file"]
    },
    {
        id: 12,
        name: "Excel Files",
        description: "Search for Excel spreadsheets",
        dork: 'filetype:xls OR filetype:xlsx',
        category: "documents",
        tags: ["excel", "spreadsheet", "documents"]
    },
    {
        id: 13,
        name: "Email Lists",
        description: "Find email lists and contacts",
        dork: 'filetype:xls OR filetype:csv "email" OR "@"',
        category: "documents",
        tags: ["email", "contacts", "lists"]
    },
    {
        id: 14,
        name: "Web Cameras",
        description: "Find publicly accessible web cameras",
        dork: 'intitle:"webcam" OR intitle:"camera" OR inurl:view/view.shtml',
        category: "security",
        tags: ["webcam", "camera", "surveillance"]
    },
    {
        id: 15,
        name: "SQL Errors",
        description: "Find SQL error messages",
        dork: 'intext:"mysql_fetch_array()" OR intext:"ORA-" OR intext:"Microsoft OLE DB"',
        category: "database",
        tags: ["sql", "error", "database"]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    generateDork();
    loadPresets();
    loadHistory();
    updateTheme();
});

function initializeApp() {
    // Set theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle icon
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Form inputs
    const inputs = document.querySelectorAll('#generator input, #generator select');
    inputs.forEach(input => {
        input.addEventListener('input', generateDork);
    });
    
    // URL input specific event
    const targetUrlInput = document.getElementById('targetUrl');
    let urlAnalysisTimeout;
    targetUrlInput.addEventListener('input', function() {
        if (document.getElementById('urlAnalysis').checked) {
            // Debounce URL analysis
            clearTimeout(urlAnalysisTimeout);
            urlAnalysisTimeout = setTimeout(analyzeUrl, 1000);
        }
        generateDork();
    });
    
    // Checkboxes
    const checkboxes = document.querySelectorAll('#generator input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', generateDork);
    });
    
    // File import
    document.getElementById('importFile').addEventListener('change', importDorks);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function updateTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function generateDork() {
    try {
        const dorkParts = [];
        
        // Basic search parameters
        const searchTerm = document.getElementById('searchTerm')?.value?.trim() || '';
        const exactPhrase = document.getElementById('exactPhrase')?.value?.trim() || '';
        const anyWords = document.getElementById('anyWords')?.value?.trim() || '';
        const noneWords = document.getElementById('noneWords')?.value?.trim() || '';
    
    // Site parameters
    const site = document.getElementById('site').value.trim();
    const fileType = document.getElementById('fileType').value;
    const inurl = document.getElementById('inurl').value.trim();
    const intitle = document.getElementById('intitle').value.trim();
    
    // Advanced parameters
    const intext = document.getElementById('intext').value.trim();
    const inanchor = document.getElementById('inanchor').value.trim();
    const related = document.getElementById('related').value.trim();
    const cache = document.getElementById('cache').value.trim();
    
    // Custom URL parameters
    const targetUrl = document.getElementById('targetUrl').value.trim();
    const urlPattern = document.getElementById('urlPattern').value;
    
    // Security checkboxes
    const securityOptions = {
        adminPages: document.getElementById('adminPages').checked,
        loginPages: document.getElementById('loginPages').checked,
        configFiles: document.getElementById('configFiles').checked,
        logFiles: document.getElementById('logFiles').checked,
        backupFiles: document.getElementById('backupFiles').checked,
        databaseFiles: document.getElementById('databaseFiles').checked,
        directoryListings: document.getElementById('directoryListings').checked,
        errorPages: document.getElementById('errorPages').checked
    };
    
    // Build the dork query
    if (searchTerm) {
        dorkParts.push(searchTerm);
    }
    
    if (exactPhrase) {
        dorkParts.push(`"${exactPhrase}"`);
    }
    
    if (anyWords) {
        const words = anyWords.split(/\s+/);
        dorkParts.push(`(${words.join(' OR ')})`);
    }
    
    if (noneWords) {
        const words = noneWords.split(/\s+/);
        words.forEach(word => {
            dorkParts.push(`-${word}`);
        });
    }
    
    if (site) {
        dorkParts.push(`site:${site}`);
    }
    
    if (fileType) {
        dorkParts.push(`filetype:${fileType}`);
    }
    
    if (inurl) {
        dorkParts.push(`inurl:${inurl}`);
    }
    
    if (intitle) {
        dorkParts.push(`intitle:${intitle}`);
    }
    
    if (intext) {
        dorkParts.push(`intext:${intext}`);
    }
    
    if (inanchor) {
        dorkParts.push(`inanchor:${inanchor}`);
    }
    
    if (related) {
        dorkParts.push(`related:${related}`);
    }
    
    if (cache) {
        dorkParts.push(`cache:${cache}`);
    }
    
    // Process custom URL targeting
    if (targetUrl) {
        const processedUrl = processTargetUrl(targetUrl, urlPattern);
        if (processedUrl) {
            dorkParts.push(processedUrl);
        }
    }
    
    // Add security-focused dorks
    if (securityOptions.adminPages) {
        dorkParts.push('inurl:admin');
    }
    
    if (securityOptions.loginPages) {
        dorkParts.push('(inurl:login OR intitle:login)');
    }
    
    if (securityOptions.configFiles) {
        dorkParts.push('(filetype:conf OR filetype:config OR filetype:cfg)');
    }
    
    if (securityOptions.logFiles) {
        dorkParts.push('(filetype:log OR intitle:"access log")');
    }
    
    if (securityOptions.backupFiles) {
        dorkParts.push('(filetype:bak OR filetype:backup)');
    }
    
    if (securityOptions.databaseFiles) {
        dorkParts.push('(filetype:sql OR filetype:db)');
    }
    
    if (securityOptions.directoryListings) {
        dorkParts.push('intitle:"index of"');
    }
    
    if (securityOptions.errorPages) {
        dorkParts.push('(intitle:error OR intitle:404)');
    }
    
    // Create final dork
    const finalDork = dorkParts.join(' ') || 'Your generated dork will appear here...';
    
    // Update display
        document.getElementById('generatedDork').textContent = finalDork;
        
        // Store current dork
        window.currentDork = finalDork;
    } catch (error) {
        console.error('Error generating dork:', error);
        document.getElementById('generatedDork').textContent = 'Error generating dork. Please check your inputs.';
        showNotification('Error generating dork', 'error');
    }
}

function copyDork() {
    const dork = document.getElementById('generatedDork').textContent;
    if (dork && dork !== 'Your generated dork will appear here...') {
        navigator.clipboard.writeText(dork).then(() => {
            showNotification('Dork copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy dork', 'error');
        });
    }
}

function searchGoogle() {
    const dork = document.getElementById('generatedDork').textContent;
    if (dork && dork !== 'Your generated dork will appear here...') {
        // Add to history
        addToHistory(dork);
        
        // Open Google search
        const encodedDork = encodeURIComponent(dork);
        window.open(`https://www.google.com/search?q=${encodedDork}`, '_blank');
        
        showNotification('Opening Google search...', 'info');
    }
}

function saveDork() {
    const dork = document.getElementById('generatedDork').textContent;
    if (dork && dork !== 'Your generated dork will appear here...') {
        const name = prompt('Enter a name for this dork:');
        if (name) {
            const savedDork = {
                id: Date.now(),
                name: name,
                dork: dork,
                created: new Date().toISOString(),
                category: 'custom'
            };
            
            savedDorks.push(savedDork);
            localStorage.setItem('savedDorks', JSON.stringify(savedDorks));
            
            showNotification('Dork saved successfully!', 'success');
        }
    }
}

function clearGenerator() {
    // Clear all form inputs
    document.querySelectorAll('#generator input').forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    document.querySelectorAll('#generator select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Regenerate dork
    generateDork();
    
    showNotification('Generator cleared!', 'info');
}

function loadPresets() {
    const presetsGrid = document.getElementById('presetsGrid');
    presetsGrid.innerHTML = '';
    
    presetDorks.forEach(preset => {
        const presetCard = document.createElement('div');
        presetCard.className = 'preset-card';
        presetCard.dataset.category = preset.category;
        
        presetCard.innerHTML = `
            <div class="preset-tag">${preset.category}</div>
            <h4>${preset.name}</h4>
            <p>${preset.description}</p>
            <div class="preset-dork">${preset.dork}</div>
            <div class="preset-actions">
                <button class="btn btn-primary" onclick="usePreset(${preset.id})">
                    <i class="fas fa-magic"></i> Use
                </button>
                <button class="btn btn-secondary" onclick="copyPreset(${preset.id})">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="btn btn-success" onclick="searchPreset(${preset.id})">
                    <i class="fas fa-search"></i> Search
                </button>
            </div>
        `;
        
        presetsGrid.appendChild(presetCard);
    });
}

function filterPresets(category) {
    const presetCards = document.querySelectorAll('.preset-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter cards
    presetCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function usePreset(presetId) {
    const preset = presetDorks.find(p => p.id === presetId);
    if (preset) {
        // Clear current generator
        clearGenerator();
        
        // Parse and fill the preset dork
        document.getElementById('generatedDork').textContent = preset.dork;
        window.currentDork = preset.dork;
        
        // Scroll to generator
        scrollToSection('generator');
        
        showNotification(`Preset "${preset.name}" loaded!`, 'success');
    }
}

function copyPreset(presetId) {
    const preset = presetDorks.find(p => p.id === presetId);
    if (preset) {
        navigator.clipboard.writeText(preset.dork).then(() => {
            showNotification('Preset dork copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy preset dork', 'error');
        });
    }
}

function searchPreset(presetId) {
    const preset = presetDorks.find(p => p.id === presetId);
    if (preset) {
        // Add to history
        addToHistory(preset.dork);
        
        // Open Google search
        const encodedDork = encodeURIComponent(preset.dork);
        window.open(`https://www.google.com/search?q=${encodedDork}`, '_blank');
        
        showNotification('Opening Google search...', 'info');
    }
}

function addToHistory(dork) {
    const historyItem = {
        id: Date.now(),
        dork: dork,
        timestamp: new Date().toISOString()
    };
    
    // Remove duplicate if exists
    searchHistory = searchHistory.filter(item => item.dork !== dork);
    
    // Add to beginning
    searchHistory.unshift(historyItem);
    
    // Keep only last 50 items
    searchHistory = searchHistory.slice(0, 50);
    
    // Save to localStorage
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    
    // Reload history display
    loadHistory();
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    
    if (searchHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">No search history yet.</p>';
        return;
    }
    
    historyList.innerHTML = '';
    
    searchHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(item.timestamp).toLocaleString();
        
        const escapedDork = item.dork.replace(/'/g, '&apos;').replace(/"/g, '&quot;');
        historyItem.innerHTML = `
            <div class="history-meta">
                <span class="history-date">${date}</span>
                <div class="history-actions">
                    <button class="btn btn-primary" onclick="copyHistoryItem('${escapedDork}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button class="btn btn-success" onclick="searchHistoryItem('${escapedDork}')">
                        <i class="fas fa-search"></i> Search
                    </button>
                    <button class="btn btn-danger" onclick="removeHistoryItem(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
            <div class="history-dork">${item.dork.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function copyHistoryItem(dork) {
    navigator.clipboard.writeText(dork).then(() => {
        showNotification('History item copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy history item', 'error');
    });
}

function searchHistoryItem(dork) {
    const encodedDork = encodeURIComponent(dork);
    window.open(`https://www.google.com/search?q=${encodedDork}`, '_blank');
    showNotification('Opening Google search...', 'info');
}

function removeHistoryItem(itemId) {
    searchHistory = searchHistory.filter(item => item.id !== itemId);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    loadHistory();
    showNotification('History item removed!', 'info');
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all search history?')) {
        searchHistory = [];
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        loadHistory();
        showNotification('Search history cleared!', 'info');
    }
}

function exportDorks(format) {
    const dorks = [...savedDorks, ...presetDorks];
    
    if (dorks.length === 0) {
        showNotification('No dorks to export', 'error');
        return;
    }
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch (format) {
        case 'txt':
            content = dorks.map(d => `${d.name}: ${d.dork}`).join('\n');
            filename = 'google_dorks.txt';
            mimeType = 'text/plain';
            break;
        case 'json':
            content = JSON.stringify(dorks, null, 2);
            filename = 'google_dorks.json';
            mimeType = 'application/json';
            break;
        case 'csv':
            content = 'Name,Dork,Category,Description\n';
            content += dorks.map(d => `"${d.name}","${d.dork}","${d.category}","${d.description || ''}"`).join('\n');
            filename = 'google_dorks.csv';
            mimeType = 'text/csv';
            break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`Dorks exported as ${format.toUpperCase()}!`, 'success');
}

function importDorks(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let importedDorks = [];
            
            if (file.name.endsWith('.json')) {
                importedDorks = JSON.parse(content);
            } else if (file.name.endsWith('.csv')) {
                const lines = content.split('\n');
                const headers = lines[0].split(',');
                
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',');
                    if (values.length >= 2) {
                        importedDorks.push({
                            id: Date.now() + i,
                            name: values[0].replace(/"/g, ''),
                            dork: values[1].replace(/"/g, ''),
                            category: values[2] ? values[2].replace(/"/g, '') : 'imported',
                            description: values[3] ? values[3].replace(/"/g, '') : ''
                        });
                    }
                }
            } else if (file.name.endsWith('.txt')) {
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (line.trim()) {
                        const parts = line.split(':');
                        if (parts.length >= 2) {
                            importedDorks.push({
                                id: Date.now() + index,
                                name: parts[0].trim(),
                                dork: parts.slice(1).join(':').trim(),
                                category: 'imported',
                                description: ''
                            });
                        }
                    }
                });
            }
            
            if (importedDorks.length > 0) {
                savedDorks = [...savedDorks, ...importedDorks];
                localStorage.setItem('savedDorks', JSON.stringify(savedDorks));
                showNotification(`Imported ${importedDorks.length} dorks successfully!`, 'success');
            } else {
                showNotification('No valid dorks found in file', 'error');
            }
            
        } catch (error) {
            showNotification('Error importing file: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Remove on click
    notification.addEventListener('click', () => {
        notification.remove();
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to search
    if (e.ctrlKey && e.key === 'Enter') {
        searchGoogle();
    }
    
    // Ctrl+C to copy (when focused on dork display)
    if (e.ctrlKey && e.key === 'c' && document.activeElement.closest('.dork-display')) {
        copyDork();
    }
    
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveDork();
    }
    
    // Escape to clear
    if (e.key === 'Escape') {
        clearGenerator();
    }
});

// URL Processing Functions
function processTargetUrl(url, pattern) {
    try {
        const urlObj = new URL(url);
        
        switch (pattern) {
            case 'exact':
                return `site:${url}`;
            case 'domain':
                return `site:${urlObj.hostname}`;
            case 'subdomain':
                const domain = urlObj.hostname.split('.').slice(-2).join('.');
                return `site:*.${domain}`;
            case 'path':
                return `site:${urlObj.hostname} inurl:${urlObj.pathname}`;
            default:
                return `site:${urlObj.hostname}`;
        }
    } catch (e) {
        showNotification('Invalid URL format', 'error');
        return null;
    }
}

function analyzeUrl() {
    const targetUrl = document.getElementById('targetUrl').value.trim();
    
    if (!targetUrl) {
        showNotification('Please enter a URL to analyze', 'error');
        return;
    }
    
    try {
        const urlObj = new URL(targetUrl);
        const analysis = {
            protocol: urlObj.protocol,
            hostname: urlObj.hostname,
            pathname: urlObj.pathname,
            search: urlObj.search,
            hash: urlObj.hash,
            domain: urlObj.hostname.split('.').slice(-2).join('.'),
            subdomain: urlObj.hostname.split('.').slice(0, -2).join('.') || 'www',
            pathSegments: urlObj.pathname.split('/').filter(segment => segment.length > 0),
            parameters: new URLSearchParams(urlObj.search)
        };
        
        // Auto-fill relevant fields based on analysis
        if (document.getElementById('urlAnalysis').checked) {
            document.getElementById('site').value = analysis.hostname;
            
            if (analysis.pathSegments.length > 0) {
                document.getElementById('inurl').value = analysis.pathSegments[0];
            }
            
            // Generate dork after analysis
            generateDork();
        }
        
        // Show analysis results
        showNotification(`URL analyzed: ${analysis.hostname} (${analysis.pathSegments.length} path segments)`, 'success');
        
    } catch (e) {
        showNotification('Invalid URL format', 'error');
    }
}

function generateUrlDorks() {
    const targetUrl = document.getElementById('targetUrl').value.trim();
    const generateVariants = document.getElementById('generateVariants').checked;
    
    if (!targetUrl) {
        showNotification('Please enter a URL first', 'error');
        return;
    }
    
    try {
        const urlObj = new URL(targetUrl);
        const dorkVariants = [];
        
        // Basic site dorks
        dorkVariants.push(`site:${urlObj.hostname}`);
        dorkVariants.push(`site:${urlObj.hostname} inurl:admin`);
        dorkVariants.push(`site:${urlObj.hostname} inurl:login`);
        dorkVariants.push(`site:${urlObj.hostname} filetype:pdf`);
        dorkVariants.push(`site:${urlObj.hostname} intitle:"index of"`);
        
        if (generateVariants) {
            // Add more comprehensive variants
            const domain = urlObj.hostname.split('.').slice(-2).join('.');
            dorkVariants.push(`site:*.${domain}`);
            dorkVariants.push(`site:${urlObj.hostname} intext:"password"`);
            dorkVariants.push(`site:${urlObj.hostname} filetype:sql`);
            dorkVariants.push(`site:${urlObj.hostname} inurl:config`);
            dorkVariants.push(`site:${urlObj.hostname} intitle:"error" OR intitle:"404"`);
        }
        
        // Add to presets or display
        const customPresets = dorkVariants.map((dork, index) => ({
            id: Date.now() + index,
            name: `Custom ${urlObj.hostname} #${index + 1}`,
            description: `Generated dork for ${urlObj.hostname}`,
            dork: dork,
            category: 'custom',
            tags: ['custom', 'generated', urlObj.hostname]
        }));
        
        // Add to saved dorks
        savedDorks.push(...customPresets);
        localStorage.setItem('savedDorks', JSON.stringify(savedDorks));
        
        showNotification(`Generated ${dorkVariants.length} custom dorks for ${urlObj.hostname}`, 'success');
        
    } catch (e) {
        showNotification('Invalid URL format', 'error');
    }
}

// Auto-save current state
setInterval(() => {
    const currentState = {
        searchTerm: document.getElementById('searchTerm').value,
        exactPhrase: document.getElementById('exactPhrase').value,
        anyWords: document.getElementById('anyWords').value,
        noneWords: document.getElementById('noneWords').value,
        site: document.getElementById('site').value,
        fileType: document.getElementById('fileType').value,
        inurl: document.getElementById('inurl').value,
        intitle: document.getElementById('intitle').value,
        intext: document.getElementById('intext').value,
        inanchor: document.getElementById('inanchor').value,
        related: document.getElementById('related').value,
        cache: document.getElementById('cache').value,
        targetUrl: document.getElementById('targetUrl').value,
        urlPattern: document.getElementById('urlPattern').value
    };
    
    localStorage.setItem('currentState', JSON.stringify(currentState));
}, 5000);

// Load saved state on page load
window.addEventListener('load', function() {
    const savedState = localStorage.getItem('currentState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            Object.keys(state).forEach(key => {
                const element = document.getElementById(key);
                if (element && state[key]) {
                    element.value = state[key];
                }
            });
            generateDork();
        } catch (error) {
            console.error('Error loading saved state:', error);
        }
    }
});
