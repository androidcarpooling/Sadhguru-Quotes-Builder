const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
// Port configuration - works with Railway, Render, Fly.io, etc.
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database variable (will be initialized)
let db;

function initializeDatabase(callback) {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            if (callback) callback(err);
            return;
        }
        
        // Leaderboard table
        db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            username TEXT NOT NULL,
            score INTEGER NOT NULL,
            quotes_completed INTEGER NOT NULL,
            level INTEGER NOT NULL,
            time_taken REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`, (err) => {
            if (err) {
                console.error('Error creating leaderboard table:', err);
                if (callback) callback(err);
                return;
            }
            
            // Create index for faster leaderboard queries
            db.run(`CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC)`, (err) => {
                if (err) {
                    console.error('Error creating index:', err);
                    if (callback) callback(err);
                    return;
                }
                console.log('Database tables initialized successfully');
                if (callback) callback(null);
            });
        });
    });
}

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Register
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }

                const token = jwt.sign(
                    { id: this.lastID, username, email },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                res.json({
                    message: 'User registered successfully',
                    token,
                    user: { id: this.lastID, username, email }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    db.get(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, username],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: { id: user.id, username: user.username, email: user.email }
            });
        }
    );
});

// Submit Score (No authentication required - uses player name)
app.post('/api/leaderboard', (req, res) => {
    const { score, quotes_completed, level, time_taken, username } = req.body;

    if (typeof score !== 'number' || typeof quotes_completed !== 'number') {
        return res.status(400).json({ error: 'Invalid score data' });
    }

    if (!username || username.trim().length === 0) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Sanitize username (max 50 chars, trim)
    const sanitizedUsername = username.trim().substring(0, 50) || 'Anonymous';

    db.run(
        'INSERT INTO leaderboard (user_id, username, score, quotes_completed, level, time_taken) VALUES (?, ?, ?, ?, ?, ?)',
        [null, sanitizedUsername, score, quotes_completed, level || 1, time_taken || null],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to save score' });
            }

            res.json({
                message: 'Score saved successfully',
                scoreId: this.lastID
            });
        }
    );
});

// Get Leaderboard
app.get('/api/leaderboard', (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    db.all(
        `SELECT username, score, quotes_completed, level, time_taken, created_at 
         FROM leaderboard 
         ORDER BY score DESC, quotes_completed DESC, time_taken ASC, created_at ASC 
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, rows) => {
            if (err) {
                console.error('Leaderboard query error:', err);
                return res.status(500).json({ error: 'Failed to fetch leaderboard' });
            }

            console.log(`Leaderboard query returned ${rows.length} rows`);
            res.json({
                leaderboard: rows || [],
                total: rows ? rows.length : 0
            });
        }
    );
});

// Get User's Best Score
app.get('/api/leaderboard/my-best', authenticateToken, (req, res) => {
    db.get(
        `SELECT username, score, quotes_completed, level, time_taken, created_at 
         FROM leaderboard 
         WHERE user_id = ? 
         ORDER BY score DESC 
         LIMIT 1`,
        [req.user.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch best score' });
            }

            res.json({ bestScore: row || null });
        }
    );
});

// Get User's Rank
app.get('/api/leaderboard/my-rank', authenticateToken, (req, res) => {
    db.get(
        `SELECT COUNT(*) + 1 as rank 
         FROM leaderboard 
         WHERE score > (SELECT MAX(score) FROM leaderboard WHERE user_id = ?)`,
        [req.user.id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch rank' });
            }

            res.json({ rank: row.rank || 0 });
        }
    );
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize Database and start server
db = new sqlite3.Database('./game.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase((initErr) => {
            if (initErr) {
                console.error('Failed to initialize database:', initErr);
                process.exit(1);
            } else {
                // Start server after database is ready
                app.listen(PORT, () => {
                    console.log(`Server running on http://localhost:${PORT}`);
                    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
                });
            }
        });
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});

