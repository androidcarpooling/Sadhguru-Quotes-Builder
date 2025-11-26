// Game Configuration
const MAX_QUOTES_PER_GAME = 7;
const GAME_TIME_LIMIT = 3 * 60 * 1000; // 3 minutes in milliseconds

// Game State
let gameState = {
    currentQuote: null,
    currentQuoteWords: [],
    jumbledWords: [],
    arrangedWords: [],
    correctOrder: [],
    revealedIndices: [], // Indices of words that are revealed as hints
    startTime: null,
    gameStartTime: null, // Track total game time
    timer: null,
    gameTimer: null, // Timer for 3-minute limit
    totalScore: 0,
    currentScore: 0,
    level: 1,
    quotesCompleted: 0,
    usedQuotes: new Set(),
    playerName: '' // Player name entered at start
};

// Initialize Game
function initGame() {
    // Game will start from start screen
    updateStats();
    
    // Set up jumbled words area to accept drops
    const jumbledArea = document.getElementById('jumbled-words');
    jumbledArea.addEventListener('dragover', handleJumbledDragOver);
    jumbledArea.addEventListener('drop', handleJumbledDrop);
    jumbledArea.addEventListener('dragleave', handleJumbledDragLeave);
}

// Start Game
function startGame() {
    const nameInput = document.getElementById('player-name-input');
    const playerName = nameInput.value.trim();
    
    if (!playerName) {
        showMessage('Please enter your name to start playing!', 'warning');
        return;
    }
    
    gameState.playerName = playerName;
    document.getElementById('start-screen').classList.add('hidden');
    
    // Reset game state
    gameState.totalScore = 0;
    gameState.quotesCompleted = 0;
    gameState.level = 1;
    gameState.usedQuotes.clear();
    gameState.gameStartTime = Date.now();
    updateStats();
    
    // Start 3-minute timer
    startGameTimer();
    
    loadNewQuote();
}

// Start 3-minute game timer
function startGameTimer() {
    // Clear any existing timer
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
    }
    
    gameState.gameTimer = setTimeout(() => {
        showMessage('Time\'s up! Game ending...', 'info');
        setTimeout(() => {
            endGame();
        }, 1000);
    }, GAME_TIME_LIMIT);
}

// Stop game timer
function stopGameTimer() {
    if (gameState.gameTimer) {
        clearTimeout(gameState.gameTimer);
        gameState.gameTimer = null;
    }
}

// Load New Quote
function loadNewQuote() {
    // Get a random quote that hasn't been used yet
    let availableQuotes = SADHGURU_QUOTES_FILTERED.filter(q => !gameState.usedQuotes.has(q.quote));
    
    if (availableQuotes.length === 0) {
        // All quotes used, reset
        gameState.usedQuotes.clear();
        availableQuotes = SADHGURU_QUOTES_FILTERED;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    gameState.currentQuote = availableQuotes[randomIndex];
    gameState.usedQuotes.add(gameState.currentQuote.quote);
    
    // Process quote
    processQuote(gameState.currentQuote.quote);
    
    // Update quote source
    document.getElementById('quote-source').textContent = `- Sadhguru (${gameState.currentQuote.category})`;
    
    // Start timer
    startTimer();
    
    // Enable check button
    document.getElementById('check-button').disabled = false;
}

// Process Quote - Split and Jumble
function processQuote(quote) {
    // Split quote into words, preserving punctuation
    gameState.correctOrder = quote.split(' ').map((word, index) => ({
        word: word.trim(),
        index: index
    }));
    
    // Reveal hints based on quote length (Very Easy Difficulty - Maximum Hints)
    // Maximum hints for very easy gameplay
    const numWords = gameState.correctOrder.length;
    let numRevealed;
    if (numWords <= 5) {
        numRevealed = Math.max(3, Math.floor(numWords * 0.6)); // Short quotes: 60% of words as hints (min 3)
    } else if (numWords <= 10) {
        numRevealed = Math.max(5, Math.floor(numWords * 0.5)); // Medium quotes: 50% of words as hints (min 5)
    } else if (numWords <= 15) {
        numRevealed = Math.max(7, Math.floor(numWords * 0.45)); // Long quotes: 45% of words as hints (min 7)
    } else if (numWords <= 20) {
        numRevealed = Math.max(9, Math.floor(numWords * 0.4)); // Very long quotes: 40% of words as hints (min 9)
    } else {
        numRevealed = Math.max(10, Math.floor(numWords * 0.4)); // Extra long: 40% of words as hints (minimum 10)
    }
    gameState.revealedIndices = [];
    
    // Select random indices to reveal
    const indices = Array.from({length: numWords}, (_, i) => i);
    shuffleArray(indices);
    gameState.revealedIndices = indices.slice(0, numRevealed).sort((a, b) => a - b);
    
    // Create jumbled array (excluding revealed words)
    gameState.jumbledWords = gameState.correctOrder
        .filter((_, index) => !gameState.revealedIndices.includes(index))
        .map(wordObj => ({...wordObj}));
    shuffleArray(gameState.jumbledWords);
    
    // Initialize arranged words with revealed words in correct positions
    gameState.arrangedWords = [];
    gameState.correctOrder.forEach((wordObj, index) => {
        if (gameState.revealedIndices.includes(index)) {
            gameState.arrangedWords[index] = {...wordObj};
        } else {
            gameState.arrangedWords[index] = null; // Placeholder for blank
        }
    });
    
    // Render
    renderJumbledWords();
    renderQuoteBuilder();
}

// Shuffle Array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle Jumbled Words Button
function shuffleJumbledWords() {
    if (gameState.jumbledWords.length === 0) return;
    
    shuffleArray(gameState.jumbledWords);
    renderJumbledWords();
}

// Shuffle Arranged Words (reorder non-revealed words)
function shuffleArrangedWords() {
    // Get all non-revealed, filled words
    const filledIndices = [];
    const filledWords = [];
    
    gameState.arrangedWords.forEach((wordObj, index) => {
        if (wordObj !== null && !gameState.revealedIndices.includes(index)) {
            filledIndices.push(index);
            filledWords.push(wordObj);
        }
    });
    
    if (filledWords.length <= 1) return;
    
    // Shuffle the words
    shuffleArray(filledWords);
    
    // Put them back in random positions (but not in revealed positions)
    let wordIndex = 0;
    filledIndices.forEach(index => {
        gameState.arrangedWords[index] = filledWords[wordIndex++];
    });
    
    renderQuoteBuilder();
}

// Render Jumbled Words
function renderJumbledWords() {
    const container = document.getElementById('jumbled-words');
    container.innerHTML = '';
    
    gameState.jumbledWords.forEach((wordObj, index) => {
        const chip = document.createElement('div');
        chip.className = 'word-chip';
        chip.textContent = wordObj.word;
        chip.draggable = true;
        chip.dataset.index = index;
        chip.dataset.wordIndex = wordObj.index;
        
        // Drag event listeners
        chip.addEventListener('dragstart', handleDragStart);
        chip.addEventListener('dragend', handleDragEnd);
        
        container.appendChild(chip);
    });
    
    // If no words left, show message
    if (gameState.jumbledWords.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; width: 100%; padding: 20px;">Drop words here to send them back</p>';
        container.classList.add('empty-drop-zone');
    } else {
        container.classList.remove('empty-drop-zone');
    }
}

// Render Quote Builder
function renderQuoteBuilder() {
    const container = document.getElementById('quote-builder');
    
    if (gameState.arrangedWords.length === 0) {
        container.innerHTML = '<p class="placeholder-text">Drag words here to build the quote...</p>';
        return;
    }
    
    container.innerHTML = '';
    
    gameState.arrangedWords.forEach((wordObj, index) => {
        if (wordObj === null) {
            // Blank slot
            const blankSlot = document.createElement('span');
            blankSlot.className = 'quote-blank';
            blankSlot.dataset.index = index;
            blankSlot.innerHTML = '<span class="blank-placeholder">____</span>';
            blankSlot.addEventListener('dragover', handleBlankDragOver);
            blankSlot.addEventListener('dragenter', handleBlankDragEnter);
            blankSlot.addEventListener('dragleave', handleBlankDragLeave);
            blankSlot.addEventListener('drop', handleBlankDrop);
            container.appendChild(blankSlot);
        } else {
            // Word slot (revealed or filled)
            const wordElement = document.createElement('span');
            const isRevealed = gameState.revealedIndices.includes(index);
            wordElement.className = `quote-word ${isRevealed ? 'revealed-hint' : ''}`;
            wordElement.textContent = wordObj.word;
            wordElement.dataset.index = index;
            wordElement.dataset.wordIndex = wordObj.index;
            wordElement.draggable = !isRevealed; // Revealed words can't be dragged
            
            if (!isRevealed) {
                // Click to send back to jumbled (only for non-revealed words)
                wordElement.addEventListener('click', () => removeWordFromQuote(index));
                // Make draggable for reordering
                wordElement.addEventListener('dragstart', handleWordDragStart);
                wordElement.addEventListener('dragend', handleWordDragEnd);
                wordElement.title = 'Click or drag to send back to jumbled words';
            } else {
                wordElement.title = 'Hint: This word is revealed';
            }
            
            container.appendChild(wordElement);
        }
    });
}

// Drag and Drop Handlers
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Word drag handlers for reordering within quote builder
let draggedWordIndex = null;
let draggedWordFromQuote = false;

function handleWordDragStart(e) {
    draggedWordIndex = parseInt(this.dataset.index);
    draggedWordFromQuote = true;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleWordDragEnd(e) {
    this.classList.remove('dragging');
    // Reset after a short delay to allow drop handlers to process
    setTimeout(() => {
        draggedWordIndex = null;
        draggedWordFromQuote = false;
    }, 100);
}

// Blank slot handlers with improved detection
let dragOverTimeout = null;

function handleBlankDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    // Clear any existing timeout
    if (dragOverTimeout) {
        clearTimeout(dragOverTimeout);
    }
    
    this.classList.add('drag-over-blank');
}

function handleBlankDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('drag-over-blank');
}

function handleBlankDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Only remove if actually leaving the element (not just moving to a child)
    const rect = this.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        dragOverTimeout = setTimeout(() => {
            this.classList.remove('drag-over-blank');
        }, 50);
    }
}

function handleBlankDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (dragOverTimeout) {
        clearTimeout(dragOverTimeout);
    }
    
    this.classList.remove('drag-over-blank');
    
    const targetIndex = parseInt(this.dataset.index);
    
    if (draggedElement && draggedElement.classList.contains('word-chip')) {
        // Dropping from jumbled words
        const jumbledIndex = parseInt(draggedElement.dataset.index);
        const wordObj = gameState.jumbledWords[jumbledIndex];
        
        // Place word at target index
        gameState.arrangedWords[targetIndex] = wordObj;
        
        // Remove from jumbled words
        gameState.jumbledWords.splice(jumbledIndex, 1);
        
        draggedElement = null;
    } else if (draggedWordIndex !== null) {
        // Reordering within quote builder
        const wordObj = gameState.arrangedWords[draggedWordIndex];
        if (wordObj) {
            gameState.arrangedWords[draggedWordIndex] = null;
            gameState.arrangedWords[targetIndex] = wordObj;
        }
        draggedWordIndex = null;
        draggedWordFromQuote = false;
    }
    
    renderJumbledWords();
    renderQuoteBuilder();
}

// Quote Builder Drop Zone (for general area drops) - improved
const quoteBuilder = document.getElementById('quote-builder');

quoteBuilder.addEventListener('dragover', (e) => {
    // Allow drops on the container itself
    if (draggedElement && draggedElement.classList.contains('word-chip')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        // Don't add class if already over a blank
        if (!e.target.closest('.quote-blank.drag-over-blank')) {
            quoteBuilder.classList.add('drag-over');
        }
    }
});

quoteBuilder.addEventListener('dragleave', (e) => {
    // Only remove if actually leaving the container
    if (!quoteBuilder.contains(e.relatedTarget)) {
        quoteBuilder.classList.remove('drag-over');
    }
});

quoteBuilder.addEventListener('drop', (e) => {
    quoteBuilder.classList.remove('drag-over');
    
    // If dropped on container but not on a blank, find nearest blank
    if (draggedElement && draggedElement.classList.contains('word-chip') && 
        !e.target.classList.contains('quote-blank')) {
        const blanks = quoteBuilder.querySelectorAll('.quote-blank');
        if (blanks.length > 0) {
            // Find first empty blank
            let targetBlank = null;
            blanks.forEach(blank => {
                if (!targetBlank && blank.classList.contains('quote-blank')) {
                    targetBlank = blank;
                }
            });
            if (targetBlank) {
                handleBlankDrop.call(targetBlank, e);
                return;
            }
        }
    }
});

// Jumbled Words Area Drop Handlers (to accept words back from quote builder)
function handleJumbledDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const container = document.getElementById('jumbled-words');
    container.classList.add('drag-over');
}

function handleJumbledDragLeave(e) {
    const container = document.getElementById('jumbled-words');
    // Only remove class if actually leaving the container
    if (!container.contains(e.relatedTarget)) {
        container.classList.remove('drag-over');
    }
}

function handleJumbledDrop(e) {
    e.preventDefault();
    const container = document.getElementById('jumbled-words');
    container.classList.remove('drag-over');
    
    // If dragging a word from quote builder
    if (draggedWordFromQuote && draggedWordIndex !== null) {
        const wordObj = gameState.arrangedWords[draggedWordIndex];
        
        // Don't allow removing revealed words
        if (!gameState.revealedIndices.includes(draggedWordIndex)) {
            // Remove from arranged
            gameState.arrangedWords[draggedWordIndex] = null;
            
            // Add back to jumbled
            gameState.jumbledWords.push(wordObj);
            
            // Re-render
            renderJumbledWords();
            renderQuoteBuilder();
        }
        
        draggedWordIndex = null;
        draggedWordFromQuote = false;
    }
}

// Remove Word from Quote (send back to jumbled words)
function removeWordFromQuote(index) {
    // Don't remove revealed words
    if (gameState.revealedIndices.includes(index)) {
        showMessage('Cannot remove revealed hint words!', 'warning');
        return;
    }
    
    const wordObj = gameState.arrangedWords[index];
    
    if (!wordObj) return; // Already empty
    
    // Remove from arranged (set to null to maintain position)
    gameState.arrangedWords[index] = null;
    
    // Add back to jumbled
    gameState.jumbledWords.push(wordObj);
    
    // Re-render
    renderJumbledWords();
    renderQuoteBuilder();
    
    // Visual feedback
    showMessage(`"${wordObj.word}" sent back to jumbled words`, 'info');
}

// Start Timer
function startTimer() {
    gameState.startTime = Date.now();
    gameState.timer = setInterval(() => {
        const elapsed = (Date.now() - gameState.startTime) / 1000;
        document.getElementById('timer').textContent = elapsed.toFixed(1) + 's';
        
        // Show warning when approaching 3-minute limit
        const totalElapsed = gameState.gameStartTime ? (Date.now() - gameState.gameStartTime) / 1000 : 0;
        const timeLeft = GAME_TIME_LIMIT / 1000 - totalElapsed;
        if (timeLeft <= 30 && timeLeft > 0 && Math.floor(timeLeft) % 10 === 0) {
            showMessage(`⏰ ${Math.floor(timeLeft)} seconds remaining!`, 'warning');
        }
    }, 100);
}

// Stop Timer
function stopTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

// Calculate Time Taken
function getTimeTaken() {
    if (!gameState.startTime) return 0;
    return (Date.now() - gameState.startTime) / 1000;
}

// Check Quote
function checkQuote() {
    // Check if all blanks are filled
    const hasBlanks = gameState.arrangedWords.some((word, index) => 
        word === null && !gameState.revealedIndices.includes(index)
    );
    
    if (hasBlanks) {
        showMessage('Please fill all blanks before checking!', 'warning');
        return;
    }
    
    stopTimer();
    const timeTaken = getTimeTaken();
    
    // Check accuracy by comparing the reconstructed quote string
    const reconstructedQuote = gameState.arrangedWords
        .map(wordObj => wordObj ? wordObj.word : '')
        .join(' ')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' '); // Normalize multiple spaces
    
    const originalQuote = gameState.currentQuote.quote
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' '); // Normalize multiple spaces
    
    // Compare strings for exact match
    const isExactMatch = reconstructedQuote === originalQuote;
    
    // Check word-by-word position accuracy (for partial scoring)
    let correctCount = 0;
    const originalWords = gameState.currentQuote.quote.split(' ').map(w => w.trim().toLowerCase());
    
    gameState.arrangedWords.forEach((wordObj, index) => {
        if (wordObj) {
            const arrangedWord = wordObj.word.trim().toLowerCase();
            const correctWord = originalWords[index] ? originalWords[index] : '';
            if (arrangedWord === correctWord) {
                correctCount++;
            }
        }
    });
    
    // Accuracy: Use exact match for perfect score, otherwise use position accuracy
    let accuracy;
    let isCorrect;
    
    if (isExactMatch) {
        accuracy = 1;
        isCorrect = true;
    } else {
        accuracy = correctCount / gameState.correctOrder.length;
        isCorrect = false;
    }
    
    // Visual feedback
    provideVisualFeedback(isCorrect);
    
    // Calculate score
    const scoreBreakdown = calculateScore(timeTaken, accuracy, isCorrect);
    gameState.currentScore = scoreBreakdown.total;
    gameState.totalScore += scoreBreakdown.total;
    
    // Update stats
    updateStats();
    
    // Show result
    setTimeout(() => {
        showResult(scoreBreakdown, timeTaken, accuracy, isCorrect);
    }, isCorrect ? 1000 : 500);
}

// Provide Visual Feedback
function provideVisualFeedback(isCorrect) {
    const words = document.querySelectorAll('.quote-word');
    const originalWords = gameState.currentQuote.quote.split(' ');
    
    words.forEach((wordEl) => {
        const index = parseInt(wordEl.dataset.index);
        const wordText = wordEl.textContent.trim();
        const correctWordText = originalWords[index] ? originalWords[index].trim() : '';
        
        // Compare actual word text (case-insensitive) for accurate feedback
        if (wordText.toLowerCase() === correctWordText.toLowerCase()) {
            wordEl.classList.add('correct-position');
        } else {
            wordEl.classList.add('incorrect-position');
        }
    });
    
    // Also highlight blanks
    const blanks = document.querySelectorAll('.quote-blank');
    blanks.forEach((blankEl) => {
        blankEl.classList.add('incorrect-blank');
    });
    
    if (isCorrect) {
        showSuccessAnimation();
    }
}

// Show Success Animation
function showSuccessAnimation() {
    const animation = document.getElementById('success-animation');
    animation.classList.remove('hidden');
    
    setTimeout(() => {
        animation.classList.add('hidden');
    }, 1500);
}

// Calculate Score
function calculateScore(timeTaken, accuracy, isCorrect) {
    let baseScore = 0;
    let timeBonus = 0;
    let accuracyBonus = 0;
    let speedBonus = 0;
    
    // Base score for correct answer
    if (isCorrect) {
        baseScore = 500;
    } else {
        baseScore = Math.floor(500 * accuracy);
    }
    
    // Time bonus (more points for faster completion)
    // Ideal time is 30 seconds, full bonus up to 60 seconds
    if (timeTaken <= 60) {
        timeBonus = Math.floor(1000 * (1 - timeTaken / 60));
    }
    
    // Accuracy bonus
    accuracyBonus = Math.floor(300 * accuracy);
    
    // Speed bonus (if completed in under 30 seconds and correct)
    if (isCorrect && timeTaken <= 30) {
        speedBonus = Math.floor(500 * (1 - timeTaken / 30));
    }
    
    const total = baseScore + timeBonus + accuracyBonus + speedBonus;
    
    return {
        baseScore,
        timeBonus,
        accuracyBonus,
        speedBonus,
        total
    };
}

// Show Result Modal
function showResult(scoreBreakdown, timeTaken, accuracy, isCorrect) {
    const modal = document.getElementById('result-modal');
    const content = document.getElementById('result-content');
    
    content.innerHTML = `
        <h2>${isCorrect ? '✨ Perfect! ✨' : 'Keep Trying!'}</h2>
        <div class="final-quote">
            "${gameState.currentQuote.quote}"
        </div>
        <div class="result-stats">
            <div class="result-stat">
                <div class="result-stat-label">Time</div>
                <div class="result-stat-value">${timeTaken.toFixed(1)}s</div>
            </div>
            <div class="result-stat">
                <div class="result-stat-label">Accuracy</div>
                <div class="result-stat-value">${Math.floor(accuracy * 100)}%</div>
            </div>
            <div class="result-stat">
                <div class="result-stat-label">Score</div>
                <div class="result-stat-value">${scoreBreakdown.total}</div>
            </div>
        </div>
        <div class="score-breakdown">
            <h4>Score Breakdown:</h4>
            <div class="breakdown-item">
                <span class="breakdown-label">Base Score:</span>
                <span class="breakdown-value">${scoreBreakdown.baseScore} points</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Time Bonus:</span>
                <span class="breakdown-value">${scoreBreakdown.timeBonus} points</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Accuracy Bonus:</span>
                <span class="breakdown-value">${scoreBreakdown.accuracyBonus} points</span>
            </div>
            ${scoreBreakdown.speedBonus > 0 ? `
            <div class="breakdown-item speed-bonus">
                <span class="breakdown-label">Speed Bonus:</span>
                <span class="breakdown-value">${scoreBreakdown.speedBonus} points 🚀</span>
            </div>
            ` : ''}
        </div>
        ${isCorrect ? '<p class="result-message success">Well done! You arranged it perfectly!</p>' : '<p class="result-message error">Try again to get a perfect score!</p>'}
    `;
    
    // Update button based on progress
    const nextBtn = document.getElementById('next-quote-btn');
    if (nextBtn) {
        if (gameState.quotesCompleted >= MAX_QUOTES_PER_GAME - 1) {
            nextBtn.textContent = 'Finish Game →';
            nextBtn.onclick = () => {
                nextQuote(); // This will trigger endGame()
            };
        } else {
            nextBtn.textContent = `Next Quote → (${MAX_QUOTES_PER_GAME - gameState.quotesCompleted - 1} left)`;
            nextBtn.onclick = nextQuote;
        }
    }
    
    modal.classList.remove('hidden');
}

// Close Result Modal
function closeResultModal() {
    document.getElementById('result-modal').classList.add('hidden');
}

// Next Quote
function nextQuote() {
    closeResultModal();
    gameState.quotesCompleted++;
    gameState.level = Math.floor(gameState.quotesCompleted / 5) + 1;
    updateStats();
    
    // Check if reached max quotes (10)
    if (gameState.quotesCompleted >= MAX_QUOTES_PER_GAME) {
        endGame();
        return;
    }
    
    loadNewQuote();
}

// End Game - Record final score
function endGame() {
    stopTimer();
    stopGameTimer();
    const totalTime = gameState.gameStartTime ? (Date.now() - gameState.gameStartTime) / 1000 : 0;
    
    // Submit final score to leaderboard with player name
    if (typeof submitScore === 'function' && gameState.playerName) {
        submitScore(gameState.totalScore, gameState.quotesCompleted, gameState.level, totalTime, gameState.playerName);
    }
    
    // Show end game modal
    showEndGameModal(totalTime);
}

// Show End Game Modal
function showEndGameModal(totalTime) {
    const modal = document.getElementById('result-modal');
    const content = document.getElementById('result-content');
    const actionsEl = document.getElementById('result-actions');
    
    const avgScore = gameState.quotesCompleted > 0 ? Math.floor(gameState.totalScore / gameState.quotesCompleted) : 0;
    const minutes = Math.floor(totalTime / 60);
    const seconds = Math.floor(totalTime % 60);
    const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    content.innerHTML = `
        <h2>🎉 Game Complete! 🎉</h2>
        <div class="final-quote">
            You completed ${gameState.quotesCompleted} out of ${MAX_QUOTES_PER_GAME} quotes!
        </div>
        <div class="result-stats">
            <div class="result-stat">
                <div class="result-stat-label">Total Score</div>
                <div class="result-stat-value">${gameState.totalScore.toLocaleString()}</div>
            </div>
            <div class="result-stat">
                <div class="result-stat-label">Quotes Completed</div>
                <div class="result-stat-value">${gameState.quotesCompleted} / ${MAX_QUOTES_PER_GAME}</div>
            </div>
            <div class="result-stat">
                <div class="result-stat-label">Total Time</div>
                <div class="result-stat-value">${timeDisplay}</div>
            </div>
        </div>
        <div class="score-breakdown">
            <h4>Final Stats:</h4>
            <div class="breakdown-item">
                <span class="breakdown-label">Level Reached:</span>
                <span class="breakdown-value">${gameState.level}</span>
            </div>
            <div class="breakdown-item">
                <span class="breakdown-label">Average Score per Quote:</span>
                <span class="breakdown-value">${avgScore}</span>
            </div>
        </div>
        <p class="result-message success">Your score has been saved to the leaderboard as "${gameState.playerName}"!</p>
    `;
    
    // Update actions
    if (actionsEl) {
        actionsEl.innerHTML = `
            <button class="btn btn-primary" onclick="showLeaderboardModal(); closeResultModal();">View Leaderboard</button>
            <button class="btn btn-secondary" onclick="closeResultModal(); document.getElementById('start-screen').classList.remove('hidden');">Play Again</button>
        `;
    }
    
    modal.classList.remove('hidden');
}

// Update Stats
function updateStats() {
    document.getElementById('total-score').textContent = gameState.totalScore;
    document.getElementById('current-level').textContent = gameState.level;
    document.getElementById('quotes-completed').textContent = gameState.quotesCompleted;
    document.getElementById('current-score').textContent = gameState.currentScore || 0;
    const progressEl = document.getElementById('quote-progress');
    if (progressEl) {
        progressEl.textContent = `${gameState.quotesCompleted} / ${MAX_QUOTES_PER_GAME}`;
    }
}

// Show Message
function showMessage(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'warning' ? '#ffc107' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideDown 0.3s ease-out;
        font-weight: 600;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideDown {
            from {
                transform: translateX(-50%) translateY(-100px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            to {
                transform: translateX(-50%) translateY(-100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
