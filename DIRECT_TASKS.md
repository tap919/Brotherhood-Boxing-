# GlassFist Manager - 2P Fight Night Enhancement Tasks
# Direct Implementation Plan

## PRIORITY 1: STAMINA SYSTEM
```javascript
// ENHANCE performTwoPlayerRound() in game.js
// Add stamina depletion per action
// Affect damage output based on stamina level
// Add stamina recovery in corner
```

## PRIORITY 2: STYLE ADVANTAGES  
```javascript
// ENHANCE A object in performTwoPlayerRound()
// Swarmer > Outboxer > Slugger > Swarmer
// Add 15% damage bonus for advantageous styles
```

## PRIORITY 3: CRITICAL HITS
```javascript
// ADD to damage calculation
// 5% chance for 2x damage
// Visual flash effect for criticals
```

## PRIORITY 4: FIGHTER ROSTER
```javascript
// FIX loadFighterRoster() to use this.gameState.fighters
// Display custom fighters created via buildFighter()
```

## PRIORITY 5: RANKING TIERS
```javascript
// CREATE calculateRankingTier() method
// Bronze (1000-1199), Silver (1200-1399), Gold (1400-1599), Platinum (1600+)
// Add belt icons: 🥉🥈🥇💎
```

## QUICK TASKS TO IMPLEMENT:

1. STAMINA DEPLETION
```javascript
// In performTwoPlayerRound():
p1.stamina = Math.max(0, p1.stamina - 10);
p2.stamina = Math.max(0, p2.stamina - 10);

// Apply stamina penalty to damage:
const staminaPenalty1 = p1.stamina < 30 ? 0.7 : 1.0;
const staminaPenalty2 = p2.stamina < 30 ? 0.7 : 1.0;

const d2 = Math.max(0, (p1.power * A[a1].off * staminaPenalty1) - p2.defense * 0.3);
const d1 = Math.max(0, (p2.power * A[a2].off * staminaPenalty2) - p1.defense * 0.3);
```

2. STYLE ADVANTAGES
```javascript
// Add to performTwoPlayerRound():
const styleAdvantage = {
  'swarmer-vs-outboxer': 1.15,
  'outboxer-vs-slugger': 1.15, 
  'slugger-vs-swarmer': 1.15
};

const matchup1 = `${p1.style}-vs-${p2.style}`;
const matchup2 = `${p2.style}-vs-${p1.style}`;

const styleBonus1 = styleAdvantage[matchup1] || 1.0;
const styleBonus2 = styleAdvantage[matchup2] || 1.0;

// Apply to damage:
const d2 = Math.max(0, (p1.power * A[a1].off * staminaPenalty1 * styleBonus1) - p2.defense * 0.3);
const d1 = Math.max(0, (p2.power * A[a2].off * staminaPenalty2 * styleBonus2) - p1.defense * 0.3);
```

3. CRITICAL HITS
```javascript
// Add to performTwoPlayerRound():
const isCritical1 = Math.random() < 0.05; // 5% chance
const isCritical2 = Math.random() < 0.05;

const critMultiplier1 = isCritical1 ? 2.0 : 1.0;
const critMultiplier2 = isCritical2 ? 2.0 : 1.0;

// Apply to damage:
const d2 = Math.max(0, (p1.power * A[a1].off * staminaPenalty1 * styleBonus1 * critMultiplier1) - p2.defense * 0.3);
const d1 = Math.max(0, (p2.power * A[a2].off * staminaPenalty2 * styleBonus2 * critMultiplier2) - p1.defense * 0.3);

// Visual feedback:
if (isCritical1) this.showToast('CRITICAL HIT by ' + m.p1Name);
if (isCritical2) this.showToast('CRITICAL HIT by ' + m.p2Name);
```

4. FIX ROSTER LOADING
```javascript
// Replace loadFighterRoster() in game.js:
loadFighterRoster() {
    const rosterContainer = document.getElementById('fighter-roster');
    if (!rosterContainer) return;

    rosterContainer.innerHTML = '';
    
    this.gameState.fighters.forEach(fighter => {
        const fighterCard = this.createFighterCard(fighter);
        rosterContainer.appendChild(fighterCard);
    });
}
```

5. RANKING TIERS
```javascript
// Add to game.js:
calculateRankingTier(elo) {
    if (elo >= 1600) return { tier: 'Platinum', icon: '💎' };
    if (elo >= 1400) return { tier: 'Gold', icon: '🥇' };
    if (elo >= 1200) return { tier: 'Silver', icon: '🥈' };
    return { tier: 'Bronze', icon: '🥉' };
}

// Enhance showLeaderboard():
showLeaderboard() {
    const list = this.getLeaderboard().sort((a,b)=> b.elo - a.elo);
    let html = '🏆 Leaderboard\n';
    list.forEach((e, idx) => {
        const tier = this.calculateRankingTier(e.elo);
        html += `${idx+1}. ${tier.icon} ${e.name} - Elo ${e.elo} (${tier.tier}) (W${e.wins}/L${e.losses})\n`;
    });
    alert(html);
}
```

IMPLEMENT IN ORDER:
1. Stamina depletion 
2. Style advantages
3. Critical hits
4. Fix roster loading
5. Ranking tiers