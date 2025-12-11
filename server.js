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
    // Users table (optional - for future use)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            // Don't fail if users table fails - it's optional
        }
        
        // Leaderboard table - make user_id nullable since we don't require login
        db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            username TEXT NOT NULL,
            score INTEGER NOT NULL,
            quotes_completed INTEGER NOT NULL,
            level INTEGER NOT NULL,
            time_taken REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
                    // Index creation failure is not critical
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

// Check if player can play (hasn't submitted a score yet)
app.get('/api/player/:username/can-play', (req, res) => {
    const username = req.params.username.trim().toLowerCase();
    
    db.get(
        'SELECT COUNT(*) as count FROM leaderboard WHERE LOWER(username) = ?',
        [username],
        (err, row) => {
            if (err) {
                console.error('Error checking player:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            const canPlay = row.count === 0;
            res.json({ canPlay, hasPlayed: !canPlay });
        }
    );
});

// Submit Score (No authentication required - uses player name)
// Only allows one score per player name
app.post('/api/leaderboard', (req, res) => {
    const { score, quotes_completed, level, time_taken, username } = req.body;

    console.log('Score submission received:', { score, quotes_completed, level, time_taken, username });

    if (typeof score !== 'number' || typeof quotes_completed !== 'number') {
        console.error('Invalid score data:', { score, quotes_completed, scoreType: typeof score, quotesType: typeof quotes_completed });
        return res.status(400).json({ error: 'Invalid score data' });
    }

    if (!username || username.trim().length === 0) {
        console.error('Username missing');
        return res.status(400).json({ error: 'Username is required' });
    }

    // Sanitize username (max 50 chars, trim)
    const sanitizedUsername = username.trim().substring(0, 50) || 'Anonymous';
    const normalizedUsername = sanitizedUsername.toLowerCase();

    // Check if player has already submitted a score
    db.get(
        'SELECT id FROM leaderboard WHERE LOWER(username) = ?',
        [normalizedUsername],
        (checkErr, existingRow) => {
            if (checkErr) {
                console.error('Error checking existing score:', checkErr);
                return res.status(500).json({ error: 'Database error', details: checkErr.message });
            }

            if (existingRow) {
                console.log('Player already has a score:', sanitizedUsername);
                return res.status(403).json({ 
                    error: 'You have already completed a game! Only one attempt per player is allowed.',
                    alreadyPlayed: true
                });
            }

            console.log('Inserting score into database:', { sanitizedUsername, score, quotes_completed, level, time_taken });

            // First ensure table exists
            db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                username TEXT NOT NULL,
                score INTEGER NOT NULL,
                quotes_completed INTEGER NOT NULL,
                level INTEGER NOT NULL,
                time_taken REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (createErr) => {
                if (createErr) {
                    console.error('Error creating leaderboard table:', createErr);
                    return res.status(500).json({ error: 'Database setup error', details: createErr.message });
                }

                // Now insert the score
                db.run(
                    'INSERT INTO leaderboard (user_id, username, score, quotes_completed, level, time_taken) VALUES (?, ?, ?, ?, ?, ?)',
                    [null, sanitizedUsername, score, quotes_completed, level || 1, time_taken || null],
                    function(err) {
                        if (err) {
                            console.error('Database error saving score:', err);
                            console.error('Error details:', {
                                code: err.code,
                                message: err.message,
                                errno: err.errno
                            });
                            return res.status(500).json({ error: 'Failed to save score', details: err.message });
                        }

                        console.log('Score saved successfully with ID:', this.lastID);
                        res.json({
                            message: 'Score saved successfully',
                            scoreId: this.lastID
                        });
                    }
                );
            });
        }
    );
});

// Get Leaderboard
app.get('/api/leaderboard', (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    console.log('Leaderboard query requested:', { limit, offset });

    // First, check if table exists and count rows
    db.get('SELECT COUNT(*) as count FROM leaderboard', (err, countRow) => {
        if (err) {
            console.error('Error counting leaderboard rows:', err);
            // Table might not exist, try to create it
            initializeDatabase((initErr) => {
                if (initErr) {
                    console.error('Failed to initialize database:', initErr);
                    return res.status(500).json({ error: 'Database error', details: initErr.message });
                }
                // Retry query after initialization
                fetchLeaderboard();
            });
            return;
        }
        console.log(`Total rows in leaderboard: ${countRow.count}`);
        fetchLeaderboard();
    });

    function fetchLeaderboard() {
        db.all(
            `SELECT username, score, quotes_completed, level, time_taken, created_at 
             FROM leaderboard 
             ORDER BY score DESC, quotes_completed DESC, time_taken ASC, created_at ASC 
             LIMIT ? OFFSET ?`,
            [limit, offset],
            (err, rows) => {
                if (err) {
                    console.error('Leaderboard query error:', err);
                    return res.status(500).json({ error: 'Failed to fetch leaderboard', details: err.message });
                }

                console.log(`Leaderboard query returned ${rows ? rows.length : 0} rows`);
                res.json({
                    leaderboard: rows || [],
                    total: rows ? rows.length : 0
                });
            }
        );
    }
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
// Use absolute path for Railway deployment
const dbPath = process.env.DATABASE_PATH || './game.db';
db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
        initializeDatabase((initErr) => {
            if (initErr) {
                console.error('Failed to initialize database:', initErr);
                process.exit(1);
            } else {
                // Verify tables exist
                db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
                    if (err) {
                        console.error('Error checking tables:', err);
                    } else {
                        console.log('Database tables:', tables.map(t => t.name));
                    }
                });
                
                // Start server after database is ready
                // Bind to 0.0.0.0 so hosts like Railway/Render can expose the port
                app.listen(PORT, '0.0.0.0', () => {
                    console.log(`Server running on port ${PORT}`);
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

