# 🧘 Sadhguru Quotes Builder

An interactive word arrangement game featuring inspiring quotes from Sadhguru. Unscramble jumbled words to form complete quotes and score points based on speed and accuracy!

## 🎮 How to Play

1. **Start the Game**: Click "Start Playing" on the welcome screen
2. **Arrange Words**: Drag words from the jumbled words area to the quote builder area
3. **Build the Quote**: Arrange words in the correct order to form the complete quote
4. **Check Answer**: Click "Check Answer" when you're ready
5. **Score Points**: Earn points based on:
   - **Speed**: Faster completion = more time bonus points
   - **Accuracy**: Correct word positions = accuracy bonus
   - **Perfect Score**: Complete in under 30 seconds for a speed bonus!

## 🎯 Features

- **100 Official Sadhguru Quotes** from Isha Foundation
- **User Authentication** - Sign up, login, and track your progress
- **Leaderboard System** - Compete with other players globally
- **Drag & Drop Interface** for easy word arrangement
- **Real-time Timer** tracking your completion time
- **Dynamic Scoring System**:
  - Base Score: 500 points for correct answer
  - Time Bonus: Up to 1000 points (faster = more points)
  - Accuracy Bonus: Up to 300 points
  - Speed Bonus: Up to 500 extra points for quick completion
- **Visual Feedback** showing correct/incorrect word positions
- **Success Animations** when you complete quotes perfectly
- **Progress Tracking** with levels and completion counter
- **Shuffle Feature** to rearrange jumbled words
- **Adaptive Hints** - More hints for longer quotes (easy difficulty)

## 📦 Getting Started

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set a secure JWT_SECRET
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Quick Start (Development Mode)
```bash
npm run dev  # Auto-reload on file changes
```

See `QUICKSTART.md` for more details and `DEPLOYMENT.md` for production deployment.

### Deployment note
- On Railway, the server binds to `process.env.PORT` (default 3000) and listens on `0.0.0.0`.
- A health check is available at `/api/health` to verify the service and database connectivity after deploys.

## 🏆 Scoring Breakdown

- **Base Score**: 500 points for getting it right
- **Time Bonus**: Decreasing from 1000 points (60s) to 0 points
- **Accuracy Bonus**: Up to 300 points based on correct positions
- **Speed Bonus**: Extra 500 points if completed in under 30 seconds

**Maximum Possible Score**: ~2300 points per quote!

## 🎨 Game Design

- Beautiful gradient UI with spiritual theme
- Smooth drag & drop interactions
- Responsive design for different screen sizes
- Clear visual feedback for correct/incorrect answers
- Engaging animations and transitions

Enjoy building wisdom through quotes! 🕉️

