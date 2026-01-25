// Enhanced Retro Boxing Manager with Visual Characters
class GlassFistManager {
  constructor() {
    this.currentView = "map";
    this.isTwoPlayerMode = false;
    this.tacticalSystem = new TacticalCombatSystem();
    this.gameState = {
      bankBalance: 10000,
      reputation: 1250,
      week: 1,
      year: 2024,
      fighters: [],
      currentFight: null,
      carPosition: { x: 100, y: 50 },
      // Enhanced economic system
      gymLevel: 1,
      equipmentLevel: 1,
      promotionBudget: 5000,
      upcomingEvents: [],
      activeContracts: [],
      // Fighter development tracking
      trainingHistory: {},
      fightAnalytics: {},
      // AI enhancement data
      opponentAnalysis: {},
      fightPredictions: {},
    };

    // Load or seed roster
    this.ensureRoster();
    // Initialize game
    this.initializeGame();
  }

  initializeGame() {
    this.updateHUD();
    this.showView("map");
    // ensure some basic fighters exist
    if (!this.gameState.fighters || this.gameState.fighters.length === 0) {
      this.generateFighters();
    }
  }

  // Navigation and Screen Management
  showView(viewName) {
    // Hide all screens
    document.querySelectorAll(".game-screen").forEach(s => s.classList.remove("active"));
    
    // Show selected screen
    const view = document.getElementById(`${viewName}-view`);
    if (view) {
      view.classList.add("active");
      this.currentView = viewName;
      
      // Initialize view-specific content
      this.initializeView(viewName);
    }
  }

  initializeView(viewName) {
    switch(viewName) {
      case 'map':
        this.initializeMapView();
        break;
      case 'gym':
        this.initializeGymView();
        break;
      case 'office':
        this.initializeOfficeView();
        break;
      case 'fight':
        this.initializeFightView();
        break;
      case 'corner':
        this.initializeCornerView();
        break;
      case 'franchise':
        if (window.TwoFranchiseManager) {
          window.TwoFranchiseManager.renderHub();
        }
        break;
    }
  }

  initializeMapView() {
    console.log("Map view initialized");
    this.setupMapInteractions();
  }

  initializeGymView() {
    console.log("Gym view initialized");
    this.loadFighterRoster();
    this.setupGymInteractions();
  }

  initializeOfficeView() {
    console.log("Office view initialized");
    this.setupOfficeInteractions();
  }

  initializeFightView() {
    console.log("Fight view initialized");
    this.setupFightInteractions();
  }

  initializeCornerView() {
    console.log("Corner view initialized");
    this.setupCornerInteractions();
  }

  // Map Interactions
  setupMapInteractions() {
    const tiles = document.querySelectorAll('.city-tile');
    tiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        const location = e.currentTarget.dataset;
        this.handleLocationClick(location);
      });
      
      // Add hover effects
      tile.addEventListener('mouseenter', () => {
        tile.style.transform = 'scale(1.05)';
        tile.style.filter = 'brightness(1.2)';
      });
      
      tile.addEventListener('mouseleave', () => {
        tile.style.transform = 'scale(1)';
        tile.style.filter = 'brightness(1)';
      });
    });
  }

  handleLocationClick(location) {
    // Animate car movement
    this.animateCarToLocation(location);
    
    // Show appropriate view after animation
    setTimeout(() => {
      if (location.gym) {
        this.showView('gym');
      } else if (location.arena) {
        this.showToast('Arena selected - Book a fight here!');
      } else if (location.hospital) {
        this.showToast('Hospital selected - Treat injuries here!');
      }
    }, 1000);
  }

  animateCarToLocation(location) {
    const car = document.getElementById("manager-car");
    if (!car) return;

    // Add driving animation
    car.classList.add("driving");

    // Calculate target position
    const positions = {
      downtown: { x: 200, y: 100 },
      main: { x: 400, y: 150 },
      general: { x: 300, y: 200 },
    };

    const targetPosition = positions[location.gym] || positions[location.arena] || positions[location.hospital];
    
    // Move car with animation
    car.style.transition = "all 1s ease-in-out";
    car.style.left = `${targetPosition.x}px`;
    car.style.bottom = `${targetPosition.y}px`;

    // Remove driving class after animation
    setTimeout(() => {
      car.classList.remove("driving");
    }, 1000);
  }

  // Gym Interactions
  setupGymInteractions() {
    // Setup fighter card interactions
    this.setupFighterCardInteractions();
    
    // Setup training buttons
    this.setupTrainingInteractions();
  }

  setupFighterCardInteractions() {
    document.addEventListener('click', (e) => {
      const fighterCard = e.target.closest('.fighter-card');
      if (fighterCard) {
        this.handleFighterCardClick(fighterCard);
      }
    });
  }

  handleFighterCardClick(card) {
    const fighterId = parseInt(card.dataset.fighterId);
    const fighter = this.gameState.fighters.find(f => f.id === fighterId);
    
    if (fighter) {
      this.showFighterDetails(fighter);
    }
  }

  showFighterDetails(fighter) {
    // Create detailed fighter view
    const details = `
FIGHTER DETAILS
${fighter.name} (${fighter.style})
Weight Class: ${fighter.weightClass}

STATS:
Power: ${fighter.power}
Stamina: ${fighter.stamina}
Speed: ${fighter.speed}
Defense: ${fighter.defense}
Chin: ${fighter.chin}
Heart: ${fighter.heart}
Aggression: ${fighter.aggression}
Reach: ${fighter.reach}"

RECORD:
Wins: ${fighter.record.wins}
Losses: ${fighter.record.losses}
KOs: ${fighter.record.kos}
ELO: ${fighter.elo}

CONTRACT:
${fighter.contract ? `Under Contract: ${fighter.contract.term} weeks, $${fighter.contract.salary}/wk` : 'Free Agent'}
    `;
    
    alert(details);
  }

  setupTrainingInteractions() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('train-btn')) {
        const fighterId = parseInt(e.target.dataset.fighterId);
        this.trainFighter(fighterId);
      }
    });
  }

  // Office Interactions
  setupOfficeInteractions() {
    // Setup upgrade buttons
    this.setupUpgradeButtons();
    
    // Setup event scheduling
    this.setupEventScheduling();
  }

  setupUpgradeButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('upgrade-btn')) {
        const type = e.target.dataset.type;
        this.upgradeFacility(type);
      }
    });
  }

  upgradeFacility(type) {
    const costs = {
      gym: 5000,
      equipment: 3000,
      promotion: 2000
    };
    
    const cost = costs[type];
    
    if (this.gameState.bankBalance >= cost) {
      this.gameState.bankBalance -= cost;
      
      if (type === 'gym') {
        this.gameState.gymLevel++;
      } else if (type === 'equipment') {
        this.gameState.equipmentLevel++;
      }
      
      this.updateHUD();
      this.showToast(`Upgraded ${type}! Level increased!`);
    } else {
      this.showToast('Insufficient funds for upgrade!');
    }
  }

  setupEventScheduling() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('schedule-btn')) {
        this.scheduleEvent();
      }
    });
  }

  scheduleEvent() {
    const cost = 2000;
    
    if (this.gameState.bankBalance >= cost) {
      this.gameState.bankBalance -= cost;
      
      const event = {
        id: Date.now(),
        name: 'Local Fight Night',
        date: new Date().toLocaleDateString(),
        revenue: Math.floor(Math.random() * 5000) + 3000
      };
      
      this.gameState.upcomingEvents.push(event);
      this.updateHUD();
      this.showToast('Event scheduled successfully!');
    } else {
      this.showToast('Insufficient funds for event!');
    }
  }

  // Fight Interactions
  setupFightInteractions() {
    // Setup 2-player fight button
    this.setupTwoPlayerFight();
    
    // Setup fight controls
    this.setupFightControls();
  }

  setupTwoPlayerFight() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('two-player-btn')) {
        this.startTwoPlayerMatch();
      }
    });
  }

  setupFightControls() {
    document.addEventListener('keydown', (e) => {
      // Basic fight controls
      if (this.currentView === 'fight') {
        this.handleFightInput(e.key);
      }
    });
  }

  handleFightInput(key) {
    // Handle fight inputs (placeholder for now)
    switch(key) {
      case 'ArrowLeft':
        console.log('Move left');
        break;
      case 'ArrowRight':
        console.log('Move right');
        break;
      case ' ':
        console.log('Punch');
        this.playPunchSound();
        break;
      case 'Escape':
        this.showView('map');
        break;
    }
  }

  // Corner Interactions
  setupCornerInteractions() {
    // Setup corner treatment buttons
    this.setupCornerTreatments();
  }

  setupCornerTreatments() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('treatment-btn')) {
        const treatment = e.target.dataset.treatment;
        this.applyTreatment(treatment);
      }
    });
  }

  applyTreatment(treatment) {
    // Basic treatment application (placeholder)
    const effects = {
      'water': 'Stamina restored!',
      'ice': 'Swelling reduced!',
      'medicine': 'Health restored!'
    };
    
    this.showToast(effects[treatment] || 'Treatment applied!');
  }

  // Audio System
  playPunchSound() {
    // Create simple punch sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'square';
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  // Existing methods (simplified for MVP)
  ensureRoster() {
    const saved = localStorage.getItem("gfm_roster");
    if (saved) {
      try {
        this.gameState.fighters = JSON.parse(saved);
        return;
      } catch (e) {
        // fall through to regen
      }
    }
    this.generateFighters();
  }

  saveRoster() {
    localStorage.setItem("gfm_roster", JSON.stringify(this.gameState.fighters));
  }

  generateFighters() {
    const realBoxers = [
      {
        id: 1,
        name: "Muhammad Ali",
        style: "outboxer",
        power: 92,
        stamina: 90,
        speed: 88,
        defense: 85,
        chin: 90,
        heart: 95,
        aggression: 70,
        reach: 80,
        weightClass: "Heavyweight",
        potential: 95,
        potentialClass: "bright-green",
        record: { wins: 37, losses: 4, kos: 25 },
        elo: 1850,
        marketValue: 250000,
        contract: { term: 24, salary: 15000, bonus: 5000 },
        health: 100,
        swelling: 0,
        cuts: 0,
        characterColor: "#FFD700" // Gold for Ali
      },
      {
        id: 2,
        name: "Mike Tyson",
        style: "slugger",
        power: 95,
        stamina: 85,
        speed: 84,
        defense: 82,
        chin: 88,
        heart: 90,
        aggression: 95,
        reach: 71,
        weightClass: "Heavyweight",
        potential: 90,
        potentialClass: "bright-green",
        record: { wins: 44, losses: 2, kos: 40 },
        elo: 1800,
        marketValue: 300000,
        contract: { term: 18, salary: 20000, bonus: 8000 },
        health: 100,
        swelling: 0,
        cuts: 0,
        characterColor: "#FF4444" // Black for Tyson
      }
    ];

    this.gameState.fighters = realBoxers;
    this.saveRoster();
  }

  updateHUD() {
    document.getElementById("bank-balance").textContent = `$${this.gameState.bankBalance.toLocaleString()}`;
    document.getElementById("reputation").textContent = this.gameState.reputation.toLocaleString();
    document.getElementById("game-date").textContent = `Week ${this.gameState.week}, ${this.gameState.year}`;
  }

  showToast(message) {
    const t = document.createElement("div");
    t.textContent = message;
    t.style.position = "fixed";
    t.style.top = "40px";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.background = "rgba(0,0,0,0.8)";
    t.style.color = "#fff";
    t.style.padding = "8px 12px";
    t.style.borderRadius = "6px";
    t.style.zIndex = "9999";
    t.style.fontFamily = "Press Start 2P, cursive";
    t.style.fontSize = "12px";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }

  loadFighterRoster() {
    const rosterContainer = document.getElementById("fighter-roster");
    if (!rosterContainer) return;

    rosterContainer.innerHTML = "";
    
    if (!this.gameState.fighters || this.gameState.fighters.length === 0) {
      this.ensureRoster();
    }
    
    this.gameState.fighters.forEach(fighter => {
      const fighterCard = this.createFighterCard(fighter);
      rosterContainer.appendChild(fighterCard);
    });
  }

  createFighterCard(fighter) {
    const card = document.createElement("div");
    card.className = `fighter-card ${fighter.potentialClass}`;
    card.dataset.fighterId = fighter.id;

    // Create visual character representation
    const characterSprite = document.createElement("div");
    characterSprite.className = "character-sprite";
    characterSprite.style.width = "60px";
    characterSprite.style.height = "80px";
    characterSprite.style.backgroundColor = fighter.characterColor || "#4169E1";
    characterSprite.style.border = "2px solid #333";
    characterSprite.style.borderRadius = "4px";
    characterSprite.style.marginBottom = "8px";
    
    // Add simple face features
    characterSprite.innerHTML = `
      <div style="width: 8px; height: 8px; background: #333; border-radius: 50%; position: absolute; top: 20px; left: 50%; transform: translateX(-50%);"></div>
      <div style="width: 30px; height: 4px; background: #fff; position: absolute; top: 40px; left: 50%; transform: translateX(-50%);"></div>
    `;

    card.innerHTML = `
      <div class="fighter-sprite-container">
        ${characterSprite.outerHTML}
      </div>
      <div class="fighter-info">
        <h3 class="fighter-name">${fighter.name}</h3>
        <div class="fighter-stats">
          <span class="potential-indicator" title="Potential: ${fighter.potential}">${fighter.potential} POT</span>
          <span class="style-icon" title="${fighter.style}">${this.getStyleIcon(fighter.style)}</span>
          <span class="weight-class" title="Weight Class">${fighter.weightClass}</span>
          <div class="stat-breakdown">
            <span class="stat-value">PWR: ${fighter.power}</span>
            <span class="stat-value">STM: ${fighter.stamina}</span>
            <span class="stat-value">SPD: ${fighter.speed}</span>
            <span class="stat-value">DEF: ${fighter.defense}</span>
            <span class="stat-value">CHN: ${fighter.chin}</span>
            <span class="stat-value">HRT: ${fighter.heart}</span>
            <span class="stat-value">AGG: ${fighter.aggression}</span>
            <span class="stat-value">RCH: ${fighter.reach}"</span>
          </div>
        </div>
        <div class="fighter-records">
          <span class="record-value">W-L-KO: ${fighter.record.wins}-${fighter.record.losses}-${fighter.record.kos}</span>
          <span class="elo-value">ELO: ${fighter.elo}</span>
        </div>
        <div class="contract-status">${fighter.contract ? `Under Contract (${fighter.contract.term} weeks)` : 'Free Agent'}</div>
        <div class="fighter-actions">
          <button class="train-btn" data-fighter-id="${fighter.id}">🏋️ Train</button>
          <button class="details-btn" data-fighter-id="${fighter.id}">📊 Details</button>
        </div>
      </div>
    `;

    return card;
  }

  getStyleIcon(style) {
    const icons = {
      outboxer: "🥊",
      slugger: "👊",
      swarmer: "🌪️",
    };
    return icons[style] || "🥊";
  }

  trainFighter(fighterId) {
    const fighter = this.gameState.fighters.find(f => f.id === fighterId);
    if (!fighter) {
      this.showToast('Fighter not found!');
      return;
    }

    const cost = 500;
    
    if (this.gameState.bankBalance < cost) {
      this.showToast('Insufficient funds for training!');
      return;
    }
    
    // Random stat improvement
    const stats = ['power', 'stamina', 'speed', 'defense', 'chin', 'heart', 'aggression'];
    const stat = stats[Math.floor(Math.random() * stats.length)];
    
    fighter[stat] = Math.min(100, fighter[stat] + 5);
    this.gameState.bankBalance -= cost;
    
    this.updateHUD();
    this.saveRoster();
    this.showToast(`${fighter.name}'s ${stat} improved! Cost: $${cost}`);
    this.loadFighterRoster();
  }

  // Placeholder for 2-player fight (will be expanded)
  startTwoPlayerMatch() {
    this.showToast("2-Player Fight mode coming soon!");
  }
}

// Global instance
const game = new GlassFistManager();

// Initialize game when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  game.initializeGame();
});