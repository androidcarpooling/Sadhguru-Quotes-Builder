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

// Update Auth UI
function updateAuthUI(isLoggedIn) {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');

    if (isLoggedIn && authState.user) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userInfo.classList.remove('hidden');
        userInfo.textContent = `👤 ${authState.user.username}`;
    } else {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userInfo.classList.add('hidden');
    }
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
            alert('Failed to save score: ' + (data.error || 'Unknown error'));
            return { success: false, error: data.error || 'Unknown error' };
        }
    } catch (error) {
        console.error('Failed to submit score - Exception:', error);
        alert('Error saving score: ' + error.message);
        return { success: false, error: error.message };
    }
}

// Show Leaderboard Modal
async function showLeaderboardModal() {
    const modal = document.getElementById('leaderboard-modal');
    const listEl = document.getElementById('leaderboard-list');
    modal.classList.remove('hidden');
    await loadLeaderboardData(listEl);
}

// Load Leaderboard Data (separate function for reuse)
async function loadLeaderboardData(listEl) {
    if (!listEl) {
        listEl = document.getElementById('leaderboard-list');
    }
    
    listEl.innerHTML = '<p>Loading leaderboard...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard?limit=50&t=${Date.now()}`);
        const data = await response.json();

        if (!response.ok) {
            listEl.innerHTML = '<p class="error-message">Failed to load leaderboard</p>';
            return;
        }

        if (!data.leaderboard || data.leaderboard.length === 0) {
            listEl.innerHTML = '<p>No scores yet. Be the first!</p>';
            return;
        }

        let html = '<div style="margin-bottom: 15px;"><button class="btn btn-secondary btn-small" onclick="loadLeaderboardData()">🔄 Refresh</button></div>';
        html += '<table class="leaderboard-table"><thead><tr><th>Rank</th><th>Name</th><th>Score</th><th>Quotes</th><th>Time</th></tr></thead><tbody>';
        
        data.leaderboard.forEach((entry, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
            const timeDisplay = entry.time_taken ? `${parseFloat(entry.time_taken).toFixed(1)}s` : '-';
            html += `
                <tr>
                    <td>${medal} ${rank}</td>
                    <td>${entry.username || 'Anonymous'}</td>
                    <td>${entry.score ? entry.score.toLocaleString() : 0}</td>
                    <td>${entry.quotes_completed || 0}</td>
                    <td>${timeDisplay}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        listEl.innerHTML = html;
    } catch (error) {
        console.error('Leaderboard error:', error);
        listEl.innerHTML = '<p class="error-message">Network error. Please try again.</p>';
    }
}

// Close Leaderboard Modal
function closeLeaderboardModal() {
    document.getElementById('leaderboard-modal').classList.add('hidden');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
});

