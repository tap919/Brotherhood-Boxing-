# GlassFist Manager - 2P Fight Night Enhancement Template
# Cheetah Supreme Coding Sprint Template

## STAGE 1: Core 2P Fight Night Engine (Hot-Seat Play)

### 1.1 Prompt-Based Fight Flow (NEEDS IMPLEMENTATION)
```javascript
// Entry point: window.startTwoPlayerMatch() 
// Location: game.js - startTwoPlayerMatch() method
// Status: ✅ COMPLETED - Prompts for player names, fighter selection, validates input
```

### 1.2 Round Resolution System (NEEDS IMPLEMENTATION)
```javascript
// Entry point: performTwoPlayerRound() method
// Location: game.js - performTwoPlayerRound() method  
// Status: ✅ COMPLETED - Prompts for actions, calculates damage, checks knockouts
// TODO: Add stamina depletion, critical hits, special moves
```

### 1.3 Action/Defense Matrix (NEEDS IMPLEMENTATION)
```javascript
// Entry point: A object in performTwoPlayerRound()
// Location: game.js - line ~193
// Status: ✅ COMPLETED - Basic off/def multipliers
// TODO: Add style counters (Rock/Paper/Scissors system)
// ENHANCE NEEDED: Swarmer > Outboxer > Slugger > Swarmer
```

### 1.4 Health Bar Visual Feedback (NEEDS IMPLEMENTATION)
```javascript
// Entry point: updateTwoPlayerHUD() method
// Location: game.js - updateTwoPlayerHUD() method
// Status: ✅ COMPLETED - Shows fighter names
// TODO: Update health bars in real-time, add damage animations
```

## STAGE 2: Fighter Builder & Roster Management

### 2.1 Prompt-Based Fighter Creator (NEEDS IMPLEMENTATION)
```javascript
// Entry point: window.buildFighter()
// Location: game.js - buildFighterFromPrompt() method
// Status: ✅ COMPLETED - Basic prompt flow
// TODO: Add stat caps, validation, style bonuses/penalties
```

### 2.2 Roster Persistence (NEEDS IMPLEMENTATION)
```javascript
// Entry point: ensureRoster(), saveRoster() methods
// Location: game.js - lines ~33-48
// Status: ✅ COMPLETED - localStorage persistence
// TODO: Add export/import functionality, backup system
```

### 2.3 Fighter Card UI Updates (NEEDS IMPLEMENTATION)
```javascript
// Entry point: loadFighterRoster(), createFighterCard() methods
// Location: game.js - lines ~129-161
// Status: ⚠️ PARTIAL - Only shows hardcoded fighters
// TODO: Load from this.gameState.fighters, show custom fighters
```

## STAGE 3: Knockout Kings Ranking System

### 3.1 Elo Rating Implementation (NEEDS IMPLEMENTATION)
```javascript
// Entry point: updateLeaderboard() method
// Location: game.js - updateLeaderboard() method
// Status: ✅ COMPLETED - Basic Elo calculation
// TODO: Add K-factor variations, streak bonuses
```

### 3.2 Leaderboard Display (NEEDS IMPLEMENTATION)
```javascript
// Entry point: window.showLeaderboard()
// Location: game.js - showLeaderboard() method
// Status: ✅ COMPLETED - Basic alert display
// TODO: Create proper UI modal, ranking tiers, belt icons
```

### 3.3 Ranking Tiers & Achievements (NEEDS IMPLEMENTATION)
```javascript
// Entry point: NEW - calculateRankingTier() method
// Location: TO BE CREATED in game.js
// Status: ❌ NOT IMPLEMENTED
// TODO: Bronze, Silver, Gold, Platinum tiers with visual badges
```

## STAGE 4: Enhanced Fight Mechanics

### 4.1 Stamina System (NEEDS IMPLEMENTATION)
```javascript
// Entry point: ENHANCE performTwoPlayerRound()
// Location: game.js - performTwoPlayerRound() method
// Status: ❌ NOT IMPLEMENTED
// TODO: Stamina depletes per action, affects damage output
```

### 4.2 Critical Hit System (NEEDS IMPLEMENTATION)
```javascript
// Entry point: ENHANCE damage calculation
// Location: game.js - performTwoPlayerRound() method  
// Status: ❌ NOT IMPLEMENTED
// TODO: 5% chance for 2x damage, visual flash effect
```

### 4.3 Style Advantages (NEEDS IMPLEMENTATION)
```javascript
// Entry point: ENHANCE A object with style counters
// Location: game.js - line ~193
// Status: ❌ NOT IMPLEMENTED
// TODO: Swarmer(+15% vs Outboxer), Outboxer(+15% vs Slugger), Slugger(+15% vs Swarmer)
```

## STAGE 5: UI/UX Enhancements

### 5.1 Fight Visuals (NEEDS IMPLEMENTATION)
```javascript
// Entry point: ENHANCE fight-view DOM
// Location: index.html - fight-view section
// Status: ⚠️ STATIC - No animations yet
// TODO: Sprite animations, hit effects, crowd reactions
```

### 5.2 Leaderboard Modal (NEEDS IMPLEMENTATION)
```javascript
// Entry point: ENHANCE showLeaderboard()
// Location: game.js - showLeaderboard() method
// Status: ✅ WORKING - Uses alert
// TODO: Create modal with rankings, belts, stats
```

### 5.3 Fighter Stats Display (NEEDS IMPLEMENTATION)
```javascript
// Entry point: ENHANCE fighter cards
// Location: index.html - fighter-card template
// Status: ⚠️ BASIC - Shows limited stats
// TODO: Full stat breakdown, win/loss record, ranking
```

## STAGE 6: Advanced Features

### 6.1 Fight Highlights (NEEDS IMPLEMENTATION)
```javascript
// Entry point: NEW - generateFightSummary() method
// Location: TO BE CREATED in game.js
// Status: ❌ NOT IMPLEMENTED
// TODO: Round-by-round summary, KO type, damage stats
```

### 6.2 Training System (NEEDS IMPLEMENTATION)
```javascript
// Entry point: NEW - trainFighter() method
// Location: TO BE CREATED in game.js
// Status: ❌ NOT IMPLEMENTED
// TODO: Spend money to improve fighter stats between fights
```

### 6.3 Tournament Mode (NEEDS IMPLEMENTATION)
```javascript
// Entry point: NEW - startTournament() method
// Location: TO BE CREATED in game.js
// Status: ❌ NOT IMPLEMENTED
// TODO: 4/8/16 player brackets, progressive rewards
```

---

## QUICK START FOR CHEETAH SUPREME

### High-Priority Tasks (Implement in Order):

1. **STAMINA SYSTEM** - Add stamina depletion to performTwoPlayerRound()
2. **STYLE ADVANTAGES** - Implement Rock/Paper/Scissors counters
3. **CRITICAL HITS** - Add 5% chance for 2x damage with visual feedback
4. **FIGHTER CARDS** - Make loadFighterRoster() use this.gameState.fighters
5. **RANKING TIERS** - Create calculateRankingTier() with belt icons

### Medium Priority:

6. **LEADERBOARD MODAL** - Replace alert() with proper UI modal
7. **TRAINING SYSTEM** - Allow stat improvements between fights
8. **FIGHT ANIMATIONS** - Add sprite movements and hit effects

### Low Priority:

9. **TOURNAMENT MODE** - Bracket-based competitions
10. **FIGHT HIGHLIGHTS** - Detailed post-fight summaries

---

## FILE STRUCTURE & ENTRY POINTS

```javascript
// PRIMARY ENTRY POINTS (All exposed globally):
window.startTwoPlayerMatch()    // Start 2P fight
window.showLeaderboard()         // Show rankings
window.buildFighter()            // Create custom fighter
window.GFM                      // Access game instance

// CORE METHODS TO ENHANCE:
performTwoPlayerRound()          // Main fight logic (HIGH PRIORITY)
updateTwoPlayerHUD()            // Visual feedback (HIGH PRIORITY)
updateLeaderboard()             // Ranking system (HIGH PRIORITY)
loadFighterRoster()            // UI updates (HIGH PRIORITY)

// NEW METHODS TO CREATE:
calculateRankingTier()          // Ranking tiers (HIGH PRIORITY)
trainFighter()                 // Training system (MEDIUM)
startTournament()              // Tournaments (LOW)
generateFightSummary()          // Fight highlights (LOW)
```

---

## TESTING CHECKLIST

After each enhancement, test:

- [ ] 2P fight flows from start to finish
- [ ] Health bars update correctly
- [ ] Leaderboard updates with proper Elo
- [ ] Custom fighters appear in roster
- [ ] No console errors
- [ ] localStorage persists data

---

## CODING CONVENTIONS

- Use camelCase for method names
- Store data in this.gameState
- Persist with localStorage
- Use showToast() for user feedback
- Keep prompts simple and validated
- Maintain existing glassmorphism UI style

Ready for Cheetah Supreme marathon coding! 🐆💨