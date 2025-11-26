// Authentication and API Integration
const API_BASE_URL = window.location.origin;

// Auth State
let authState = {
    token: localStorage.getItem('authToken'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
};

// Initialize auth UI
function initAuth() {
    if (authState.token && authState.user) {
        updateAuthUI(true);
    } else {
        updateAuthUI(false);
    }
}

// Update Auth UI (no longer needed since we removed login, but keep for compatibility)
function updateAuthUI(isLoggedIn) {
    // Auth UI elements removed - no login required
    // This function kept for compatibility but does nothing
    return;
}

// Show Login Modal
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('login-error').textContent = '';
}

// Close Login Modal
function closeLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('login-form').reset();
}

// Show Register Modal
function showRegisterModal() {
    document.getElementById('register-modal').classList.remove('hidden');
    document.getElementById('register-error').textContent = '';
}

// Close Register Modal
function closeRegisterModal() {
    document.getElementById('register-modal').classList.add('hidden');
    document.getElementById('register-form').reset();
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.error || 'Login failed';
            return;
        }

        // Save auth state
        authState.token = data.token;
        authState.user = data.user;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        updateAuthUI(true);
        closeLoginModal();
        showMessage('Login successful!', 'success');
    } catch (error) {
        errorEl.textContent = 'Network error. Please try again.';
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    const errorEl = document.getElementById('register-error');
    errorEl.textContent = '';

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.error || 'Registration failed';
            return;
        }

        // Save auth state
        authState.token = data.token;
        authState.user = data.user;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        updateAuthUI(true);
        closeRegisterModal();
        showMessage('Registration successful!', 'success');
    } catch (error) {
        errorEl.textContent = 'Network error. Please try again.';
    }
}

// Logout
function logout() {
    authState.token = null;
    authState.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    updateAuthUI(false);
    showMessage('Logged out successfully', 'info');
}

// Submit Score to Leaderboard (No authentication required - uses player name)
async function submitScore(score, quotesCompleted, level, timeTaken, playerName) {
    if (!playerName) {
        console.log('No player name provided, skipping score submission');
        return { success: false, error: 'No player name' };
    }

    try {
        console.log('Submitting score:', { score, quotesCompleted, level, timeTaken, playerName });
        const response = await fetch(`${API_BASE_URL}/api/leaderboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score: Number(score),
                quotes_completed: Number(quotesCompleted),
                level: Number(level || 1),
                time_taken: Number(timeTaken) || null,
                username: String(playerName)
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Score submitted successfully:', data);
            // Wait a bit before allowing leaderboard refresh
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true, data };
        } else {
            console.error('Failed to submit score - Response:', response.status, data);
            return { 
                success: false, 
                error: data.error || 'Unknown error',
                alreadyPlayed: data.alreadyPlayed || response.status === 403
            };
        }
    } catch (error) {
        console.error('Failed to submit score - Exception:', error);
        return { success: false, error: error.message };
    }
}

// Show Leaderboard Modal (global function)
async function showLeaderboardModal() {
    console.log('showLeaderboardModal called');
    const modal = document.getElementById('leaderboard-modal');
    if (!modal) {
        console.error('Leaderboard modal not found');
        alert('Leaderboard modal not found. Please refresh the page.');
        return;
    }
    
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl) {
        console.error('Leaderboard list element not found');
        alert('Leaderboard list element not found. Please refresh the page.');
        return;
    }
    
    console.log('Showing modal and loading data...');
    modal.classList.remove('hidden');
    await loadLeaderboardData(listEl);
    console.log('Leaderboard data loaded');
}

// Make it globally accessible
window.showLeaderboardModal = showLeaderboardModal;

// Load Leaderboard Data (separate function for reuse, global)
async function loadLeaderboardData(listEl) {
    console.log('loadLeaderboardData called with listEl:', listEl);
    
    if (!listEl) {
        listEl = document.getElementById('leaderboard-list');
        console.log('Got listEl from DOM:', listEl);
    }
    
    if (!listEl) {
        console.error('No listEl element found!');
        return;
    }
    
    listEl.innerHTML = '<p>Loading leaderboard...</p>';

    try {
        const apiUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : window.location.origin;
        const url = `${apiUrl}/api/leaderboard?limit=50&t=${Date.now()}`;
        console.log('Fetching leaderboard from:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status, response.statusText);
        
        const data = await response.json();
        console.log('Leaderboard data received:', data);

        if (!response.ok) {
            console.error('Failed to load leaderboard:', response.status, data);
            listEl.innerHTML = `<p class="error-message">Failed to load leaderboard: ${data.error || response.statusText}</p>`;
            return;
        }

        if (!data.leaderboard || data.leaderboard.length === 0) {
            console.log('No leaderboard data');
            listEl.innerHTML = '<p>No scores yet. Be the first!</p>';
            return;
        }
        
        console.log('Rendering leaderboard with', data.leaderboard.length, 'entries');

        // Get current player name from gameState (if available)
        const currentPlayerName = typeof gameState !== 'undefined' && gameState.playerName 
            ? gameState.playerName.toLowerCase().trim() 
            : null;

        let html = '<div style="margin-bottom: 15px;"><button class="btn btn-secondary btn-small" onclick="window.loadLeaderboardData && window.loadLeaderboardData(document.getElementById(\'leaderboard-list\'))">🔄 Refresh</button></div>';
        html += '<table class="leaderboard-table"><thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Quotes</th><th>Time</th></tr></thead><tbody>';
        
        data.leaderboard.forEach((entry, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            const timeDisplay = entry.time_taken ? `${parseFloat(entry.time_taken).toFixed(1)}s` : '-';
            
            // Check if this is the current player's score
            const entryName = (entry.username || '').toLowerCase().trim();
            const isMyScore = currentPlayerName && entryName === currentPlayerName;
            const rowClass = isMyScore ? 'my-score' : '';
            
            html += `
                <tr class="${rowClass}">
                    <td>${medal} ${rank}</td>
                    <td>${entry.username || 'Anonymous'}${isMyScore ? ' 👤' : ''}</td>
                    <td>${entry.score ? entry.score.toLocaleString() : 0}</td>
                    <td>${entry.quotes_completed || 0}</td>
                    <td>${timeDisplay}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        listEl.innerHTML = html;
        
        // Scroll to player's score if it exists
        if (currentPlayerName) {
            setTimeout(() => {
                const myScoreRow = listEl.querySelector('tr.my-score');
                if (myScoreRow) {
                    myScoreRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    } catch (error) {
        console.error('Leaderboard error:', error);
        if (listEl) {
            listEl.innerHTML = `<p class="error-message">Network error: ${error.message}. Please try again.</p>`;
        } else {
            console.error('Cannot display error - listEl is null');
        }
    }
}

// Close Leaderboard Modal (global)
function closeLeaderboardModal() {
    document.getElementById('leaderboard-modal').classList.add('hidden');
}

// Make functions globally accessible
window.loadLeaderboardData = loadLeaderboardData;
window.closeLeaderboardModal = closeLeaderboardModal;

// Initialize on page load (no auth needed, but keep for compatibility)
document.addEventListener('DOMContentLoaded', () => {
    // No auth initialization needed - players just enter name
});

