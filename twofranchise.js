// Minimal Two-Franchise MVP (offline, local-turn-based)
class TwoFranchiseManager {
  constructor() {
    this.keyA = 'gfm_franchiseA';
    this.keyB = 'gfm_franchiseB';
    this.A = null;
    this.B = null;
    this.turn = 'A'; // A starts
    this.season = 1;
    this.turnsThisSeason = { A: false, B: false };
    this.loadOrSeed();
  }

  loadOrSeed() {
    this.A = this.loadFranchise(this.keyA) || this.seedFranchise('Franchise A', 'A');
    this.B = this.loadFranchise(this.keyB) || this.seedFranchise('Franchise B', 'B');
    this.renderHub();
  }

  loadFranchise(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  saveFranchise(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  seedFranchise(name, id) {
    const f = {
      id,
      name,
      cash: 8000,
      markets: [
        { id: 'north', name: 'North Market', revenue: 1200, level: 1 },
        { id: 'east', name: 'East Market', revenue: 1000, level: 1 }
      ],
      facilities: { gym: 1, training: 1, media: 1 },
      fighters: [
        { id: id+'-F1', name: `Rookie ${id}-F1`, style: 'outboxer', power: 70, stamina: 70, speed: 70, defense: 70, chin: 70, heart: 70, aggression: 60, reach: 70, weightClass: 'Welterweight', level:1, experience:0 },
        { id: id+'-F2', name: `Rookie ${id}-F2`, style: 'slugger', power: 68, stamina: 72, speed: 65, defense: 68, chin: 65, heart: 70, aggression: 65, reach: 68, weightClass: 'Welterweight', level:1, experience:0 }
      ],
      sponsors: [],
      events: [],
      fanSentiment: 50,
      season: 1,
      currentTurnDone: false,
    };
    // Add a couple extra fighters for a starter roster
    f.fighters.push({ id: id+'-F3', name: `Rookie ${id}-F3`, style: 'swarmer', power: 60, stamina: 65, speed: 66, defense: 60, chin: 62, heart: 65, aggression: 63, reach: 70, weightClass: 'Welterweight', level:1, experience:0 });
    return f;
  }

  saveFranchiseA() { localStorage.setItem(this.keyA, JSON.stringify(this.A)); }
  saveFranchiseB() { localStorage.setItem(this.keyB, JSON.stringify(this.B)); }

  renderHub() {
    // Create basic frame if missing
    let root = document.getElementById('franchise-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'franchise-root';
      root.style.padding = '12px';
      document.body.appendChild(root);
    }
    root.innerHTML = `
      <div class="dual-franchise" style="display:flex; gap:12px; padding:8px;">
        ${this.renderPanel('A', this.A)}
        ${this.renderPanel('B', this.B)}
      </div>
      <div style="text-align:center; margin-top:8px; font-family:'Press Start 2P', cursive; color:#fff;">
        Season ${this.season} • Turn: ${this.turn}
      </div>
      <div id="fr2-log" style="font-family:monospace; padding:8px; color:#fff;"></div>
    `;
  }

  renderPanel(label, data) {
    const isA = label==='A';
    return `
      <div class="fr-panel glass-panel" style="flex:1; min-width:260px; padding:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong>Franchise ${label}</strong>
          <span class="tag" style="font-family:'Press Start 2P'; font-size:11px; color:#0f0; padding:4px 8px; border-radius:6px; background:#033;">Turn ${this.turn===label?'ACTIVE':'IDLE'}</span>
        </div>
        <div>Cash: $${data.cash.toLocaleString()}</div>
        <div>Fan Sentiment: ${data.fanSentiment}</div>
        <div>Markets: ${data.markets?.length||0}</div>
        <div style="margin-top:8px;"></div>
        <button onclick="window.TwoFranchiseManager?.takeTurn('${label}')" style="padding:6px 10px; font-family:'Press Start 2P', cursive; border-radius:6px;">Take Turn</button>
        <div id="fr-${label}-log" style="height:60px; overflow:auto; margin-top:6px; font-family:'Courier New', monospace; font-size:12px; color:#fff;"></div>
      </div>`;
  }

  takeTurn(label) {
    if (this.turn !== label) { alert('Not your turn.'); return; }
    const actionChoices = [
      'Upgrade Gym','Upgrade Training','Hire Staff','Schedule Local Event','Sponsor','Train Fighter','Marquee Fight','End Turn'
    ];
    const choice = prompt(`Franchise ${label} Turn - choose action (1-8):\n1) ${actionChoices[0]}\n2) ${actionChoices[1]}\n3) ${actionChoices[2]}\n4) ${actionChoices[3]}\n5) ${actionChoices[4]}\n6) ${actionChoices[5]}\n7) ${actionChoices[6]}\n8) ${actionChoices[7]}`);
    if (!choice) return;
    const i = parseInt(choice,10);
    switch(i){
      case 1: this.upgradeFacility(label, 'gym'); break;
      case 2: this.upgradeFacility(label, 'training'); break;
      case 3: this.hireStaff(label); break;
      case 4: this.scheduleEvent(label, 'local'); break;
      case 5: this.offerSponsor(label); break;
      case 6: this.trainFighter(label); break;
      case 7: this.marqueeFight(label); break;
      case 8: this.endTurn(label); break;
      default: alert('Invalid choice');
    }
    this.renderHub();
  }

  upgradeFacility(label, name) {
    const f = label==='A' ? this.A : this.B;
    if (!f.facilities) f.facilities = { gym:1, training:1, media:1 };
    const current = f.facilities[name] || 1;
    const cost = 2000 * current;
    if (f.cash < cost) { alert('Not enough cash.'); return; }
    f.cash -= cost;
    f.facilities[name] = Math.min(3, current+1);
    this.save();
  }

  hireStaff(label) {
    const f = label==='A' ? this.A : this.B;
    if (!f.staff) f.staff = {};
    const role = prompt('Staff role to hire (gm, coach, scout, medic, publicist):');
    if (!role) return;
    const cost = 800;
    if (f.cash < cost) { alert('Not enough cash.'); return; }
    f.cash -= cost;
    f.staff[role] = { hiredAt: new Date().toISOString() };
    this.save();
  }

  scheduleEvent(label, type='local') {
    const f = label==='A' ? this.A : this.B;
    const cost = 1200;
    if (f.cash < cost) { alert('Not enough cash.'); return; }
    f.cash -= cost;
    f.events = f.events || [];
    f.events.push({ id: Date.now(), type, date: new Date().toLocaleDateString(), name:`${type} show`});
    this.save();
  }

  offerSponsor(label) {
    const f = label==='A' ? this.A : this.B;
    const sponsor = { company: 'Indie Sponsor', monthlyAmount: 500, requirements: 'Promote events' };
    f.sponsors = f.sponsors || [];
    f.sponsors.push(sponsor);
    this.save();
  }

  trainFighter(label) {
    const f = label==='A' ? this.A : this.B;
    if (!f.fighters || f.fighters.length===0) return;
    const idx = 0;
    const t = ['power','stamina','speed','defense','chin','heart','aggression','reach'];
    const key = t[Math.floor(Math.random()*t.length)];
    f.fighters[idx][key] = Math.min(100, (f.fighters[idx][key]||50) + 5);
    this.save();
  }

  marqueeFight(label) {
    const log = `Marquee fight planned: Franchise ${label} vs opponent (stub for MVP).`;
    this.log(log);
  }

  endTurn(label) {
    // Switch turn; if both have turned, advance season and reset
    this.turn = (label === 'A') ? 'B' : 'A';
    this.season += 0; // keep simple for MVP; can increment when both have had turns
    this.renderHub();
  }

  log(msg){
    const el = document.getElementById('fr2-log') || document.body;
    const d = document.createElement('div'); d.style.fontFamily='monospace'; d.textContent = msg; el.appendChild(d);
  }
}

window.TwoFranchiseManager = new TwoFranchiseManager();
