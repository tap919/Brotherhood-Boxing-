# Phaser 3 Fight Scene Integration Guide

## Overview

The `phaser-fight-scene.html` provides a complete auto-sim boxing fight engine using Phaser 3, featuring:

- **64x128px base (design resolution) procedural pixel sprites** for fighters in orthodox stance, scaled at runtime based on canvas resolution and game scale
- **Stats-driven auto-simulation** (stamina, health, strength, agility, speed, defense)
- **State machine** for animations: idle, jab, hook, uppercut, block, knockdown, damaged
- **Pseudo-3D ring** with ropes, mat, crowd background
- **HUD** with health/stamina bars, round timer, score display
- **Visual effects**: hit particles, screen shake, damage swelling/flash
- **Corner inputs** via JSON action queue
- **3x3-minute rounds** with 10-point must scoring system
- **60fps game loop** with deliberately **10–15fps sprite animations** for retro aesthetics (desktop-ready on typical modern desktops)
- **Keyboard controls**: SPACE (pause), N (next round), R (restart), Q (queue action)

## Quick Start

1. Open `phaser-fight-scene.html` directly in a browser
2. The fight auto-simulates between Muhammad Ali vs Mike Tyson (default fighters)
3. Press SPACE to pause, R to restart

## Integration with Brotherhood Boxing Manager

### Method 1: Embed in Existing HTML

Add to your `boxing-manager.html` or `GlassFist Manager Enhanced.html`:

```html
<!-- Add Phaser 3 CDN in <head> -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>

<!-- Add game container where you want the fight to appear -->
<div id="phaser-game-container" style="width: 800px; height: 500px;"></div>
```

### Method 2: Import Classes

The file exports these classes via `window.BrotherhoodBoxing`:

```javascript
// Access exported classes
const { FighterRenderer, Fighter, FightScene } = window.BrotherhoodBoxing;

// Start a fight with custom fighters from your roster
window.BrotherhoodBoxing.startFight(
  {
    name: 'Your Fighter 1',
    health: 100,
    stamina: 100,
    strength: 85,
    agility: 80,
    speed: 75,
    defense: 70,
    chin: 75,
    heart: 80,
    trunkColor: 0xff0000, // Red trunks (hex color)
    skinColor: 0xd4a574
  },
  {
    name: 'Your Fighter 2',
    health: 100,
    stamina: 100,
    strength: 90,
    agility: 70,
    speed: 85,
    defense: 65,
    chin: 80,
    heart: 75,
    trunkColor: 0x0066cc, // Blue trunks
    skinColor: 0xa0826d
  }
);
```

### Method 3: Corner Action Queue (Manager UI Integration)

Queue actions from your corner/manager UI:

```javascript
// Queue a jab to the head at 80% intensity
window.BrotherhoodBoxing.queueCornerAction(1, {
  action: 'jab',     // 'jab' | 'hook' | 'uppercut' | 'block'
  target: 'head',    // 'head' | 'body'
  intensity: 80      // 0-100
});

// Set fighter strategy
window.BrotherhoodBoxing.setStrategy(1, 'aggressive');
// Options: 'aggressive' | 'defensive' | 'balanced' | 'body' | 'head'

// Get current fight state for your UI
const state = window.BrotherhoodBoxing.getFightState();
console.log(state.fighter1.health, state.round, state.timer);
```

## Mapping Your Existing Fighter Class

Your `game.js` fighters have these stats:

```javascript
// Your existing fighter format
{
  power: 92,
  stamina: 90,
  speed: 88,
  defense: 85,
  chin: 90,
  heart: 95,
  aggression: 70,
  reach: 80
}
```

Map to FightScene format:

```javascript
// Helper to convert hex color string to numeric hex
function hexStringToNumber(hexStr) {
  if (typeof hexStr === 'number') return hexStr;
  if (typeof hexStr === 'string' && hexStr.startsWith('#')) {
    return parseInt(hexStr.slice(1), 16);
  }
  return 0xff0000; // Default red if invalid
}

function convertFighter(yourFighter) {
  return {
    name: yourFighter.name,
    health: yourFighter.health || 100,
    maxHealth: 100,
    stamina: yourFighter.stamina || 100,
    maxStamina: 100,
    strength: yourFighter.power,      // power -> strength (damage output)
    agility: yourFighter.speed,       // speed contributes to agility (dodge)
    speed: yourFighter.speed,         // speed -> speed (initiative)
    defense: yourFighter.defense,
    chin: yourFighter.chin,
    heart: yourFighter.heart,
    trunkColor: hexStringToNumber(yourFighter.characterColor),
    skinColor: 0xd4a574  // Default skin tone
  };
}

// Usage: safely select two fighters from your roster
function getMatchupFighters(gameState, options = {}) {
  const roster = Array.isArray(gameState.fighters) ? gameState.fighters : [];
  const { fighterIndices } = options;

  if (roster.length < 2) {
    throw new Error('Need at least 2 fighters in gameState.fighters to start a fight');
  }

  // Default to first two fighters if no indices are provided
  let [aIdx, bIdx] = fighterIndices ?? [0, 1];
  const maxIndex = roster.length - 1;

  // Clamp indices into valid range
  aIdx = Math.min(Math.max(aIdx, 0), maxIndex);
  bIdx = Math.min(Math.max(bIdx, 0), maxIndex);

  // Ensure fighters are not the same; if so, pick the next one
  if (aIdx === bIdx) {
    bIdx = (aIdx + 1) % roster.length;
  }

  const fighter1 = convertFighter(roster[aIdx]);
  const fighter2 = convertFighter(roster[bIdx]);

  return { fighter1, fighter2 };
}

// Example: use the first two fighters in the roster
const { fighter1, fighter2 } = getMatchupFighters(gameState);
window.BrotherhoodBoxing.startFight(fighter1, fighter2);
```

## Connecting to Corner Screen

In your corner screen handlers:

```javascript
// When cutman applies ice
function cutmanAction(playerNum, action) {
  if (action === 'ice') {
    // Your existing logic...
    
    // Also set defensive strategy to protect swelling
    window.BrotherhoodBoxing.setStrategy(playerNum, 'defensive');
  }
}

// When trainer sets strategy
function setStrategy(playerNum, strategy) {
  // Your existing logic...
  
  // Sync with Phaser fight
  window.BrotherhoodBoxing.setStrategy(playerNum, strategy);
}
```

## FighterRenderer Class API

Use independently for rendering fighters elsewhere:

```javascript
const renderer = new FighterRenderer(scene, x, y, {
  trunkColor: 0xff0000,    // Trunk/shorts color (hex)
  skinColor: 0xd4a574,     // Skin tone
  gloveColor: 0x8b0000,    // Glove color
  hairColor: 0x1a1a1a,     // Hair color
  facing: 'right',         // 'left' or 'right'
  scale: 1.5               // Size multiplier
});

// Set animation state
renderer.setState('idle');   // 'idle' | 'jab' | 'hook' | 'uppercut' | 'block' | 'knockdown' | 'damaged'

// Apply damage (triggers flash + swelling)
renderer.takeDamage(15);

// Update each frame (call in scene update)
renderer.update(delta);

// Cleanup
renderer.destroy();
```

## Stats Effects on Combat

| Stat | Effect |
|------|--------|
| **Strength** | Damage multiplier for all punches |
| **Speed** | Who acts first, jab frequency |
| **Agility** | Dodge chance, movement |
| **Defense** | Damage reduction when hit |
| **Chin** | Resistance to knockdowns |
| **Heart** | Recovery speed, getting up from knockdowns |
| **Stamina** | Depletes with each action, recovers between rounds |

## Keyboard Controls

| Key | Action |
|-----|--------|
| **SPACE** | Pause/Resume fight |
| **N** | Skip to next round |
| **R** | Restart fight |
| **Q** | Queue jab action for Fighter 1 |

## Electron Packaging Notes

To package as a desktop app:

```bash
# Install Electron
npm install electron --save-dev

# Download Phaser locally for offline use (CDN won't work without internet)
curl -o phaser.min.js https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js

# Update phaser-fight-scene.html to use local Phaser:
# Change: <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
# To:     <script src="phaser.min.js"></script>

# Create main.js
const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });
  win.loadFile('phaser-fight-scene.html');
});

# Add to package.json
{
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  }
}

# Run
npm start
```

**Note:** For true offline functionality, download the Phaser library locally and update the script tag. The CDN version requires internet connectivity.

## File Structure

```
Brotherhood-Boxing-/
├── phaser-fight-scene.html    # Complete Phaser 3 fight engine
├── PHASER_INTEGRATION.md      # This file
├── boxing-manager.html        # Your existing manager game
├── game.js                    # Your existing game logic
└── ...
```

## Customization

### Change Round Length

In `FightScene.create()`:
```javascript
this.roundTime = 180; // 3 minutes (180 seconds)
this.maxRounds = 3;   // Best of 3 rounds
```

### Modify Animation Speed

In `FighterRenderer.update()`:
```javascript
// Change from 80ms to faster/slower
if (this.frameTimer > 66) { // ~15fps
```

### Add New Punch Types

In `Fighter.generateAutoAction()`:
```javascript
const bodyHookChance = /* ... */;
// Add to action selection logic
```

## Credits

- Built with [Phaser 3](https://phaser.io/)
- Inspired by Punch-Out!! and Evander Holyfield's Real Deal Boxing (Sega Genesis)
- Part of the Brotherhood Boxing project
