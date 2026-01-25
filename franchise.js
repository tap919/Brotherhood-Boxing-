// Lightweight, standalone Franchise Manager for Phase 1 MVP
class FranchiseManager {
  constructor() {
    this.key = 'gfm_franchise';
    this.franchise = null;
    this.load();
  }

  load() {
    const raw = localStorage.getItem(this.key);
    if (raw) {
      try { this.franchise = JSON.parse(raw); } catch (e) { this.franchise = null; }
    }
    if (!this.franchise) {
      // Initialize minimal franchise state
      this.franchise = {
        cash: 5000,
        markets: [
          { id: 'north', name: 'North Market', revenue: 1200, level: 1, growth: 0 },
          { id: 'east', name: 'East Market', revenue: 1000, level: 1, growth: 0 },
          { id: 'west', name: 'West Market', revenue: 1100, level: 1, growth: 0 }
        ],
        facilities: { gym: 1, training: 1, media: 1 },
        staff: { gm: null, coach: null, scout: null, medic: null, publicist: null },
        sponsors: [],
        events: [],
        fanSentiment: 50,
        name: 'Your Franchise',
      };
      this.save();
    }
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.franchise));
  }

  // Minimal rendering: creates a franchise hub panel with basic visuals
  renderHub() {
    const root = document.getElementById('franchise-root') || document.body;
    // Build container if missing
    if (!document.getElementById('franchise-root')) {
      const wrap = document.createElement('div');
      wrap.id = 'franchise-root';
      wrap.style.padding = '12px';
      root.appendChild(wrap);
    }

    const hub = document.getElementById('franchise-root');
    hub.innerHTML = `
      <div class="franchise-panel glass-panel" style="padding:14px; max-width: 980px; margin:0 auto;">
        <h2 style="font-family:'Press Start 2P', cursive; color:#00ff88; text-align:center;">Franchise Hub</h2>
        <div id="franchise-stats" style="display:flex; justify-content:space-between; gap:12px; margin:12px 0;">
          <div>Cash: $${this.franchise.cash.toLocaleString()}</div>
          <div>Fan Sentiment: ${this.franchise.fanSentiment}</div>
          <div>Markets: ${this.franchise.markets.length}</div>
        </div>
        <div id="franchise-markets" class="franchise-section"></div>
        <div id="franchise-facilities" class="franchise-section"></div>
        <div id="franchise-staff" class="franchise-section"></div>
        <div id="franchise-sponsors" class="franchise-section"></div>
        <div id="franchise-events" class="franchise-section"></div>
      </div>`;

    // Markets section
    this.renderMarkets();
    // Facilities
    this.renderFacilities();
    // Staff
    this.renderStaff();
    // Sponsors
    this.renderSponsors();
    // Events
    this.renderEvents();
  }

  renderMarkets() {
    const el = document.getElementById('franchise-markets');
    if (!el) return;
    const markets = this.franchise.markets;
    el.innerHTML = `<h3 style="text-align:center; font-family:'Press Start 2P', cursive; color:#fff;">Markets</h3>`;
    markets.forEach((m, idx) => {
      el.innerHTML += `
        <div style="border:1px solid #555; padding:10px; margin:6px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; background: rgba(0,0,0,.25);">
          <div>${m.name} <span style="font-size:10px; color:#aaa;">lvl ${m.level}</span></div>
          <div>Rev: $${m.revenue}</div>
        </div>`;
    });
  }

  renderFacilities() {
    const el = document.getElementById('franchise-facilities');
    if (!el) return;
    const f = this.franchise.facilities;
    el.innerHTML = `<h3 style="text-align:center; font-family:'Press Start 2P', cursive; color:#fff;">Facilities</h3>`;
    Object.keys(f).forEach(name => {
      const level = f[name];
      const cost = 3000 * level;
      el.innerHTML += `<div style="border:1px solid #555; padding:8px; margin:6px; border-radius:6px; display:flex; justify-content:space-between; background:rgba(0,0,0,.25);">
        <div>${name} (lvl ${level})</div>
        <div>$${cost}</div>
        <button onclick="window.franchise?.upgradeFacility('${name}')" class="franchise-btn" style="padding:6px 10px; font-family: 'Press Start 2P', cursive; border-radius:4px; border:1px solid #888;">Upgrade</button>
      </div>`;
    });
  }

  renderStaff() {
    const el = document.getElementById('franchise-staff');
    if (!el) return;
    el.innerHTML = `<h3 style="text-align:center; font-family:'Press Start 2P', cursive; color:#fff;">Staff</h3>`;
    const s = this.franchise.staff;
    Object.keys(s).forEach(role => {
      const isSet = !!s[role];
      el.innerHTML += `<div style="border:1px solid #555; padding:6px; margin:6px; border-radius:6px; background: rgba(0,0,0,.25); display:flex; justify-content:space-between; align-items:center;">
        <div>${role.toUpperCase()} ${isSet ? '(Assigned)' : '(Open)'}</div>
        <button onclick="window.franchise?.hireStaff('${role}')" class="franchise-btn" style="padding:4px 8px; font-family:'Press Start 2P', cursive; border-radius:4px; border:1px solid #888;">Hire</button>
      </div>`;
    });
  }

  renderSponsors() {
    const el = document.getElementById('franchise-sponsors');
    if (!el) return;
    el.innerHTML = `<h3 style="text-align:center; font-family:'Press Start 2P', cursive; color:#fff;">Sponsors</h3>`;
    (this.franchise.sponsors || []).forEach((sp) => {
      el.innerHTML += `<div style="border:1px solid #555; padding:6px; margin:6px; border-radius:6px; background: rgba(0,0,0,.25);">${sp.company} - $${sp.monthlyAmount}/mo</div>`;
    });
    el.innerHTML += `<button onclick="window.franchise?.offerSponsor()" class="franchise-btn" style="padding:6px 10px; font-family:'Press Start 2P', cursive; border-radius:4px; border:1px solid #888;">Offer Sponsor</button>`;
  }

  renderEvents() {
    const el = document.getElementById('franchise-events');
    if (!el) return;
    el.innerHTML = `<h3 style="text-align:center; font-family:'Press Start 2P', cursive; color:#fff;">Upcoming Events</h3>`;
    (this.franchise.events || []).forEach(ev => {
      el.innerHTML += `<div style="border:1px solid #555; padding:6px; margin:6px; border-radius:6px; background: rgba(0,0,0,.25);">${ev.name ?? 'Event'} on ${ev.date} — ${ev.type ?? 'Local'}</div>`;
    });
    el.innerHTML += `<button onclick="window.franchise?.scheduleEvent('local')" class="franchise-btn" style="padding:6px 10px; font-family:'Press Start 2P', cursive; border-radius:4px; border:1px solid #888;">Schedule Local Event</button>`;
  }

  upgradeFacility(name) {
    const current = this.franchise.facilities[name] || 1;
    const cost = 2000 * current;
    if (this.franchise.cash < cost) {
      alert('Not enough cash to upgrade.');
      return;
    }
    this.franchise.cash -= cost;
    this.franchise.facilities[name] = Math.min(3, current + 1);
    this.save();
    this.renderHub();
  }

  scheduleEvent(type) {
    const cost = 2000;
    if (this.franchise.cash < cost) {
      alert('Not enough cash to schedule event.');
      return;
    }
    this.franchise.cash -= cost;
    const e = { id: Date.now(), type, date: new Date().toLocaleDateString(), name: `${type.toUpperCase()} Event` };
    this.franchise.events.push(e);
    this.save();
    this.renderHub();
  }

  offerSponsor() {
    const offers = [
      { company: 'Local Brand', monthlyAmount: 250, requirements: 'Win 1 local event' },
      { company: 'Regional Brand', monthlyAmount: 800, requirements: 'Win 2 events' }
    ];
    const o = offers[Math.floor(Math.random() * offers.length)];
    this.franchise.sponsors.push(o);
    this.save();
    this.renderHub();
  }

  hireStaff(role) {
    const cost = 1000;
    if (this.franchise.cash < cost) {
      alert('Not enough cash to hire.');
      return;
    }
    this.franchise.cash -= cost;
    this.franchise.staff[role] = { hiredAt: new Date().toISOString() };
    this.save();
    this.renderHub();
  }
}

// Expose a global FranchiseManager and lightweight wrappers for simple integration
window.FranchiseManager = new FranchiseManager();

// Lightweight wrappers so the HTML inline handlers can call into the Franchise module
window.franchise = {
  renderHub: () => window.FranchiseManager?.renderHub?.(),
  upgradeFacility: (name) => window.FranchiseManager?.upgradeFacility?.(name),
  hireStaff: (role) => window.FranchiseManager?.hireStaff?.(role),
  scheduleEvent: (type) => window.FranchiseManager?.scheduleEvent?.(type),
  offerSponsor: () => window.FranchiseManager?.offerSponsor?.(),
  addMarket: () => void 0
};
