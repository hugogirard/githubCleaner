class GitHubRepoManager {
    constructor() {
        this.accessToken = localStorage.getItem('github_token');
        this.user = null;
        this.repositories = [];
        this.filteredRepositories = [];
        this.selectedRepos = new Set();
        
        this.initializeElements();
        this.bindEvents();
        this.init();
    }

    initializeElements() {
        this.authBtn = document.getElementById('authBtn');
        this.userInfo = document.getElementById('userInfo');
        this.mainContent = document.getElementById('mainContent');
        this.authInstructions = document.getElementById('authInstructions');
        this.searchInput = document.getElementById('searchInput');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.selectAllBtn = document.getElementById('selectAllBtn');
        this.deselectAllBtn = document.getElementById('deselectAllBtn');
        this.deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        this.selectedCount = document.getElementById('selectedCount');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.repositoryList = document.getElementById('repositoryList');
        this.deleteModal = document.getElementById('deleteModal');
        this.deleteList = document.getElementById('deleteList');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        this.toastContainer = document.getElementById('toastContainer');
    }

    bindEvents() {
        this.authBtn.addEventListener('click', () => this.handleAuth());
        this.searchInput.addEventListener('input', (e) => this.filterRepositories(e.target.value));
        this.refreshBtn.addEventListener('click', () => this.refreshRepositories());
        this.selectAllBtn.addEventListener('click', () => this.selectAll());
        this.deselectAllBtn.addEventListener('click', () => this.deselectAll());
        this.deleteSelectedBtn.addEventListener('click', () => this.showDeleteConfirmation());
        this.confirmDeleteBtn.addEventListener('click', () => this.deleteSelectedRepositories());
        this.cancelDeleteBtn.addEventListener('click', () => this.hideDeleteConfirmation());
        
        // Close modal when clicking outside
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) {
                this.hideDeleteConfirmation();
            }
        });
    }

    async init() {
        if (this.accessToken) {
            try {
                await this.fetchUser();
                this.updateAuthUI();
                await this.loadRepositories();
            } catch (error) {
                console.error('Token validation failed:', error);
                this.clearAuth();
            }
        }
    }

    handleAuth() {
        if (this.accessToken) {
            this.signOut();
        } else {
            this.signIn();
        }
    }

    signIn() {
        const authMethod = confirm('Choose authentication method:\n\nOK = Use Personal Access Token (Recommended - Easier & More Secure)\nCancel = Use OAuth App (Requires GitHub App setup)');
        
        if (authMethod) {
            // Personal Access Token method
            this.createPersonalAccessToken();
        } else {
            // OAuth method
            this.setupOAuth();
        }
    }

    setupOAuth() {
        const currentUrl = window.location.origin + window.location.pathname;
        const clientId = prompt(`Enter your GitHub App Client ID:\n\nTo get this:\n1. Go to GitHub Settings > Developer settings > OAuth Apps\n2. Create a new OAuth App\n3. Set Authorization callback URL to: ${currentUrl}\n4. Copy the Client ID`);
        
        if (!clientId) return;

        const scope = 'repo delete_repo';
        const redirectUri = window.location.origin + window.location.pathname;
        const state = Math.random().toString(36).substring(7);
        
        localStorage.setItem('oauth_state', state);
        
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        
        window.location.href = authUrl;
    }

    signOut() {
        this.clearAuth();
        this.showToast('Signed out successfully', 'info');
    }

    clearAuth() {
        localStorage.removeItem('github_token');
        localStorage.removeItem('oauth_state');
        this.accessToken = null;
        this.user = null;
        this.repositories = [];
        this.filteredRepositories = [];
        this.selectedRepos.clear();
        this.updateAuthUI();
        this.updateRepositoryList();
        this.updateSelectedCount();
    }

    async handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = localStorage.getItem('oauth_state');

        if (code && state === storedState) {
            try {
                // Note: In a real application, this should be done on a backend server
                // for security reasons. For this demo, we'll ask the user to create a personal access token instead
                this.showToast('OAuth flow detected. Please create a Personal Access Token instead for security.', 'info');
                this.createPersonalAccessToken();
            } catch (error) {
                console.error('OAuth error:', error);
                this.showToast('Authentication failed', 'error');
            }
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    createPersonalAccessToken() {
        const instructions = `Create a GitHub Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Repository Cleaner"
4. Select these scopes:
   ☑️ repo (Full control of private repositories)
   ☑️ delete_repo (Delete repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

Paste your token here:`;

        const token = prompt(instructions);
        
        if (token && token.trim()) {
            this.accessToken = token.trim();
            localStorage.setItem('github_token', this.accessToken);
            this.showToast('Authenticating...', 'info');
            this.init();
        }
    }

    async fetchUser() {
        const response = await this.makeRequest('https://api.github.com/user');
        this.user = response;
    }

    async loadRepositories() {
        this.showLoading(true);
        try {
            const repos = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await this.makeRequest(`https://api.github.com/user/repos?page=${page}&per_page=100&sort=updated&direction=desc`);
                repos.push(...response);
                hasMore = response.length === 100;
                page++;
            }

            this.repositories = repos;
            this.filteredRepositories = [...repos];
            this.updateRepositoryList();
            this.showToast(`Loaded ${repos.length} repositories`, 'success');
        } catch (error) {
            console.error('Failed to load repositories:', error);
            this.showToast('Failed to load repositories', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async makeRequest(url, options = {}) {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    errorMessage += ` - ${errorData.message}`;
                }
            } catch (e) {
                // Ignore JSON parse errors for error responses
            }
            throw new Error(errorMessage);
        }

        // For DELETE requests and other requests that may not return content
        if (options.method === 'DELETE') {
            // GitHub DELETE returns 204 No Content on success
            if (response.status === 204) {
                return { success: true, status: 204 }; // Successful deletion
            }
            return null; // Other DELETE responses
        }
        
        if (response.status === 204) {
            return null; // No content expected
        }

        // Only try to parse JSON if there's content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        return null;
    }

    filterRepositories(query) {
        const lowerQuery = query.toLowerCase();
        this.filteredRepositories = this.repositories.filter(repo => 
            repo.name.toLowerCase().includes(lowerQuery) ||
            (repo.description && repo.description.toLowerCase().includes(lowerQuery))
        );
        this.updateRepositoryList();
    }

    updateRepositoryList() {
        if (!this.filteredRepositories.length) {
            this.repositoryList.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7f8c8d;">
                    ${this.repositories.length === 0 ? 'No repositories found.' : 'No repositories match your search.'}
                </div>
            `;
            return;
        }

        this.repositoryList.innerHTML = this.filteredRepositories.map(repo => this.createRepositoryCard(repo)).join('');
        
        // Bind checkbox events
        this.repositoryList.querySelectorAll('.repo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const repoId = parseInt(e.target.dataset.repoId);
                if (e.target.checked) {
                    this.selectedRepos.add(repoId);
                } else {
                    this.selectedRepos.delete(repoId);
                }
                this.updateSelectedCount();
                this.updateCardSelection(repoId, e.target.checked);
            });
        });
    }

    createRepositoryCard(repo) {
        const isSelected = this.selectedRepos.has(repo.id);
        return `
            <div class="repo-card ${isSelected ? 'selected' : ''}" data-repo-id="${repo.id}">
                <div class="repo-visibility ${repo.private ? 'private' : 'public'}">
                    ${repo.private ? 'Private' : 'Public'}
                </div>
                <div class="repo-header">
                    <input type="checkbox" class="repo-checkbox" data-repo-id="${repo.id}" ${isSelected ? 'checked' : ''}>
                    <div class="repo-info">
                        <div class="repo-name">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </div>
                        ${repo.description ? `<div class="repo-description">${repo.description}</div>` : ''}
                        <div class="repo-meta">
                            ${repo.language ? `
                                <span>
                                    <div class="language-color" style="background-color: ${this.getLanguageColor(repo.language)}"></div>
                                    ${repo.language}
                                </span>
                            ` : ''}
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span>🍴 ${repo.forks_count}</span>
                            <span>📅 ${new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C#': '#239120',
            'C++': '#f34b7d',
            'C': '#555555',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'HTML': '#e34c26',
            'CSS': '#1572B6',
            'Shell': '#89e051',
            'Vue': '#2c3e50',
            'React': '#61dafb'
        };
        return colors[language] || '#586069';
    }

    updateCardSelection(repoId, selected) {
        const card = document.querySelector(`[data-repo-id="${repoId}"]`);
        if (card) {
            card.classList.toggle('selected', selected);
        }
    }

    selectAll() {
        this.filteredRepositories.forEach(repo => this.selectedRepos.add(repo.id));
        this.updateRepositoryList();
        this.updateSelectedCount();
    }

    deselectAll() {
        this.selectedRepos.clear();
        this.updateRepositoryList();
        this.updateSelectedCount();
    }

    updateSelectedCount() {
        const count = this.selectedRepos.size;
        this.selectedCount.textContent = `${count} repository${count !== 1 ? 'ies' : ''} selected`;
        this.deleteSelectedBtn.disabled = count === 0;
    }

    showDeleteConfirmation() {
        const selectedRepoData = this.repositories.filter(repo => this.selectedRepos.has(repo.id));
        
        // Debug: Log repository data
        console.log('Selected repositories for deletion:', selectedRepoData.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            owner: repo.owner?.login
        })));
        
        this.deleteList.innerHTML = `
            <ul>
                ${selectedRepoData.map(repo => `<li>${repo.name} (${repo.full_name || 'No full_name'})</li>`).join('')}
            </ul>
        `;
        
        this.deleteModal.classList.remove('hidden');
    }

    hideDeleteConfirmation() {
        this.deleteModal.classList.add('hidden');
    }

    async deleteSelectedRepositories() {
        const selectedRepoData = this.repositories.filter(repo => this.selectedRepos.has(repo.id));
        const totalRepos = selectedRepoData.length;
        let deletedCount = 0;
        let errors = [];

        this.hideDeleteConfirmation();
        this.showLoading(true, `Deleting repositories... (0/${totalRepos})`);

        for (const repo of selectedRepoData) {
            try {
                console.log(`Attempting to delete repository: ${repo.full_name}`);
                const result = await this.makeRequest(`https://api.github.com/repos/${repo.full_name}`, {
                    method: 'DELETE'
                });
                
                // GitHub returns 204 for successful deletion
                console.log(`Successfully deleted: ${repo.full_name}`, result);
                deletedCount++;
                this.showLoading(true, `Deleting repositories... (${deletedCount}/${totalRepos})`);
                
                // Remove from local arrays
                this.repositories = this.repositories.filter(r => r.id !== repo.id);
                this.filteredRepositories = this.filteredRepositories.filter(r => r.id !== repo.id);
                this.selectedRepos.delete(repo.id);
                
            } catch (error) {
                console.error(`Failed to delete ${repo.full_name}:`, error);
                errors.push(`${repo.name} (${error.message})`);
            }
        }

        this.showLoading(false);
        this.updateRepositoryList();
        this.updateSelectedCount();

        if (errors.length === 0) {
            this.showToast(`Successfully deleted ${deletedCount} repository${deletedCount !== 1 ? 'ies' : ''}`, 'success');
            
            // Auto-refresh to ensure UI is completely up to date
            if (deletedCount > 0) {
                setTimeout(() => {
                    this.showToast('Refreshing repository list...', 'info');
                    this.loadRepositories();
                }, 1000);
            }
        } else {
            const errorMessage = `Deleted ${deletedCount}/${totalRepos} repositories.\n\nFailed:\n${errors.join('\n')}`;
            console.error('Delete operation completed with errors:', errors);
            this.showToast(`Deleted ${deletedCount}/${totalRepos} repositories. Check console for details.`, 'error');
            
            // Also show detailed errors in console
            console.group('Deletion Errors:');
            errors.forEach(error => console.error(error));
            console.groupEnd();
            
            // Auto-refresh even with errors to sync the UI
            if (deletedCount > 0) {
                setTimeout(() => {
                    this.showToast('Refreshing repository list...', 'info');
                    this.loadRepositories();
                }, 2000);
            }
        }
    }

    async refreshRepositories() {
        // Clear current selections
        this.selectedRepos.clear();
        this.updateSelectedCount();
        
        // Clear search
        this.searchInput.value = '';
        
        // Reload repositories
        this.showToast('Refreshing repositories...', 'info');
        await this.loadRepositories();
    }

    updateAuthUI() {
        if (this.user) {
            this.authBtn.textContent = 'Sign Out';
            this.userInfo.innerHTML = `
                <img src="${this.user.avatar_url}" alt="Avatar">
                <span>${this.user.login}</span>
            `;
            this.userInfo.classList.remove('hidden');
            this.mainContent.classList.remove('hidden');
            this.authInstructions.classList.add('hidden');
        } else {
            this.authBtn.textContent = 'Sign In to GitHub';
            this.userInfo.classList.add('hidden');
            this.mainContent.classList.add('hidden');
            this.authInstructions.classList.remove('hidden');
        }
    }

    showLoading(show, message = 'Loading repositories...') {
        if (show) {
            this.loadingIndicator.querySelector('p').textContent = message;
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Language detection and color mapping utility
class LanguageUtils {
    static getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C#': '#239120',
            'C++': '#f34b7d',
            'C': '#555555',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'HTML': '#e34c26',
            'CSS': '#1572B6',
            'Shell': '#89e051',
            'Vue': '#2c3e50'
        };
        return colors[language] || '#586069';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new GitHubRepoManager();
    
    // Handle OAuth callback if present
    if (window.location.search.includes('code=')) {
        app.handleOAuthCallback();
    }
});
