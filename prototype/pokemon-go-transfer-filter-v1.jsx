// import { useState, useCallback, useMemo } from "react";

// ─── DATA (queries use Pokédex numbers & ranges for compactness) ─────────────

const CORE = [
  { key: "shiny", label: "Shiny", q: "!shiny", icon: "✦" },
  { key: "legendary", label: "Legendary", q: "!legendary", icon: "◆" },
  { key: "mythical", label: "Mythical", q: "!mythical", icon: "★" },
  { key: "ultraBeast", label: "Ultra Beast", q: "!ultrabeast", icon: "◎" },
  { key: "lucky", label: "Lucky", q: "!lucky", icon: "☘" },
  { key: "traded", label: "Traded", q: "!traded", icon: "⇄" },
  { key: "buddy", label: "Buddy (any level)", q: "!buddy1-5", icon: "♥" },
  { key: "perfect", label: "Perfect IV (4★)", q: "!4*", icon: "💎" },
  { key: "defender", label: "Gym Defenders", q: "!defender", icon: "🛡" },
  { key: "favorite", label: "Favorited", q: "!favorite", icon: "⭐" },
  { key: "hypertraining", label: "Hyper Training", q: "!hypertraining", icon: "🏋" },
];

const OPTIONAL = [
  { key: "evolveNew", label: "New Evolutions", q: "!evolvenew", tip: "Pokémon with evolutions you haven't registered" },
  { key: "costume", label: "Costume", q: "!costume", tip: "Event costume variants" },
  { key: "shadow", label: "Shadow", q: "!shadow", tip: "Shadow Pokémon from Team Rocket" },
  { key: "purified", label: "Purified", q: "!purified", tip: "Purified former Shadow Pokémon" },
  { key: "eggsOnly", label: "Eggs Only", q: "!eggsonly", tip: "Species only available from eggs" },
  { key: "dynamax", label: "Dynamax", q: "!dynamax", tip: "Dynamax-capable Pokémon" },
  { key: "gigantamax", label: "Gigantamax", q: "!gigantamax", tip: "Gigantamax-capable Pokémon" },
  { key: "xl", label: "XL Size", q: "!xl", tip: "Extra-large for showcases" },
  { key: "xxl", label: "XXL Size", q: "!xxl", tip: "Extra-extra-large for showcases" },
  { key: "xxs", label: "XXS Size", q: "!xxs", tip: "Extra-extra-small for showcases" },
  { key: "tradeEvolve", label: "Trade Evolve", q: "!tradeevolve", tip: "Species that evolve free after trading" },
  { key: "specialMoves", label: "Special Moves", q: "!@special", tip: "Legacy / Community Day / event moves" },
  { key: "fusion", label: "Fusion", q: "!fusion", tip: "Pokémon eligible for or already fused" },
];

const GENDER = [
  { key: "combee", label: "Combee", q: "!415", dex: "#415", note: "♀ → Vespiquen" },
  { key: "snorunt", label: "Snorunt", q: "!361", dex: "#361", note: "♀ → Froslass" },
  { key: "ralts", label: "Ralts / Kirlia", q: "!280-281", dex: "#280–281", note: "♂ → Gallade (#475)" },
  { key: "salandit", label: "Salandit", q: "!757", dex: "#757", note: "♀ → Salazzle" },
  { key: "burmy", label: "Burmy", q: "!412", dex: "#412", note: "♂ → Mothim, ♀ → Wormadam forms" },
  { key: "espurr", label: "Espurr / Meowstic", q: "!677-678", dex: "#677–678", note: "♂ and ♀ have different movesets & stats" },
  { key: "litleo", label: "Litleo / Pyroar", q: "!667-668", dex: "#667–668", note: "♂ and ♀ look very different" },
  { key: "frillish", label: "Frillish / Jellicent", q: "!592-593", dex: "#592–593", note: "♂ and ♀ are distinct forms" },
];

const RARE_FORMS = [
  { key: "sinistea", label: "Sinistea / Polteageist", q: "!854-855", dex: "#854–855", note: "Antique form ~5%, costs 400 candy to evolve" },
  { key: "rockruff", label: "Rockruff / Lycanroc", q: "!744-745", dex: "#744–745", note: "Dusk Form needs special Rockruff, evolve at dusk" },
  { key: "dunsparce", label: "Dunsparce / Dudunsparce", q: "!206&!982", dex: "#206, #982", note: "Three-Segment is 1% evolution chance" },
  { key: "tandemaus", label: "Tandemaus / Maushold", q: "!924-925", dex: "#924–925", note: "Family of Three is rare evolution variant" },
  { key: "pumpkaboo", label: "Pumpkaboo / Gourgeist", q: "!710-711", dex: "#710–711", note: "Super Size is rare, event-limited" },
  { key: "shellos", label: "Shellos / Gastrodon", q: "!422-423", dex: "#422–423", note: "East/West Sea forms split by hemisphere" },
  { key: "deerling", label: "Deerling / Sawsbuck", q: "!585-586", dex: "#585–586", note: "Seasonal forms — some very rare" },
  { key: "spinda", label: "Spinda", q: "!327", dex: "#327", note: "Many pattern variants, field research only" },
];

const RARE_SPECIES = [
  { key: "hisui", label: "Hisui region forms", q: "!hisui", dex: "keyword", note: "Hisuian Voltorb, Growlithe, Zorua, etc." },
  { key: "galar", label: "Galar region forms", q: "!galar", dex: "keyword", note: "Galarian Ponyta, Zigzagoon, Stunfisk, etc." },
  { key: "paldea", label: "Paldea region forms", q: "!paldea", dex: "keyword", note: "Paldean Tauros breeds, Wooper, etc." },
  { key: "unown", label: "Unown", q: "!201", dex: "#201", note: "28 letter/symbol forms, most event-only" },
  { key: "furfrou", label: "Furfrou", q: "!676", dex: "#676", note: "Trims locked by real-world region" },
  { key: "vivillon", label: "Scatterbug / Spewpa / Vivillon", q: "!664-666", dex: "#664–666", note: "Patterns by real-world region" },
  { key: "oricorio", label: "Oricorio", q: "!741", dex: "#741", note: "4 styles locked by real-world region" },
  { key: "flabebe", label: "Flabébé / Floette / Florges", q: "!669-671", dex: "#669–671", note: "Colors by real-world region" },
];

// Regionals grouped by generation. Each item is an evolution line.
const REGIONAL_GROUPS = [
  { group: "Gen 1 — Kanto", items: [
    { key: "r_farfetchd", label: "Farfetch'd", q: "!83", dex: "#83", note: "Japan / Korea / Taiwan / HK" },
    { key: "r_kangaskhan", label: "Kangaskhan", q: "!115", dex: "#115", note: "Australia" },
    { key: "r_mrmime", label: "Mr. Mime / Mime Jr.", q: "!122&!439", dex: "#122, #439", note: "Europe" },
    { key: "r_tauros", label: "Tauros", q: "!128", dex: "#128", note: "US / Southern Canada" },
  ]},
  { group: "Gen 2 — Johto", items: [
    { key: "r_heracross", label: "Heracross", q: "!214", dex: "#214", note: "Latin America / S. Florida / S. Texas" },
    { key: "r_corsola", label: "Corsola", q: "!222", dex: "#222", note: "Tropics (near equator)" },
  ]},
  { group: "Gen 3 — Hoenn", items: [
    { key: "r_volbeatillumise", label: "Volbeat / Illumise", q: "!313-314", dex: "#313–314", note: "Rotate hemispheres" },
    { key: "r_torkoal", label: "Torkoal", q: "!324", dex: "#324", note: "South / Southeast Asia / India" },
    { key: "r_zangooseseviper", label: "Zangoose / Seviper", q: "!335-336", dex: "#335–336", note: "Rotate hemispheres" },
    { key: "r_lunatonesolrock", label: "Lunatone / Solrock", q: "!337-338", dex: "#337–338", note: "Rotate hemispheres" },
    { key: "r_tropius", label: "Tropius", q: "!357", dex: "#357", note: "Africa / Mediterranean" },
    { key: "r_relicanth", label: "Relicanth", q: "!369", dex: "#369", note: "New Zealand / Fiji" },
  ]},
  { group: "Gen 4 — Sinnoh", items: [
    { key: "r_pachirisu", label: "Pachirisu", q: "!417", dex: "#417", note: "Far North (Canada / Alaska / Russia)" },
    { key: "r_chatot", label: "Chatot", q: "!441", dex: "#441", note: "Southern Hemisphere" },
    { key: "r_carnivine", label: "Carnivine", q: "!455", dex: "#455", note: "Southeast United States" },
  ]},
  { group: "Gen 5 — Unova", items: [
    { key: "r_monkeys", label: "Pansage / Pansear / Panpour", q: "!511&!513&!515", dex: "#511,513,515", note: "Split by continent" },
    { key: "r_throhsawk", label: "Throh / Sawk", q: "!538-539", dex: "#538–539", note: "Split by hemisphere" },
    { key: "r_maractus", label: "Maractus", q: "!556", dex: "#556", note: "Mexico / Central & South America" },
    { key: "r_sigilyph", label: "Sigilyph", q: "!561", dex: "#561", note: "Egypt / Greece" },
    { key: "r_bouffalant", label: "Bouffalant", q: "!626", dex: "#626", note: "New York City area" },
    { key: "r_heatmordurant", label: "Heatmor / Durant", q: "!631-632", dex: "#631–632", note: "Split by hemisphere" },
  ]},
  { group: "Gen 6+ — Kalos / Alola", items: [
    { key: "r_hawlucha", label: "Hawlucha", q: "!701", dex: "#701", note: "Mexico" },
    { key: "r_klefki", label: "Klefki", q: "!707", dex: "#707", note: "France area" },
    { key: "r_comfey", label: "Comfey", q: "!764", dex: "#764", note: "Hawaii" },
  ]},
];

const ALL_REGIONAL_ITEMS = REGIONAL_GROUPS.flatMap(g => g.items);

const AGE_OPTIONS = [
  { value: "none", label: "No filter" },
  { value: "1", label: "1 day" }, { value: "3", label: "3 days" },
  { value: "7", label: "7 days" }, { value: "14", label: "2 weeks" },
  { value: "30", label: "30 days" }, { value: "90", label: "3 months" },
  { value: "180", label: "6 months" }, { value: "365", label: "1 year" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const mkOn = items => Object.fromEntries(items.map(e => [e.key, true]));
const mkOff = items => Object.fromEntries(items.map(e => [e.key, false]));

const PRESETS = {
  quick:  { core: mkOn(CORE), opt: mkOn(OPTIONAL), gen: mkOn(GENDER), rf: mkOn(RARE_FORMS), rs: mkOn(RARE_SPECIES), reg: mkOn(ALL_REGIONAL_ITEMS), age: "7" },
  normal: { core: mkOn(CORE), opt: mkOn(OPTIONAL), gen: mkOn(GENDER), rf: mkOn(RARE_FORMS), rs: mkOn(RARE_SPECIES), reg: mkOff(ALL_REGIONAL_ITEMS), age: "30" },
  deep:   { core: mkOn(CORE), opt: mkOff(OPTIONAL), gen: mkOff(GENDER), rf: mkOff(RARE_FORMS), rs: mkOff(RARE_SPECIES), reg: mkOff(ALL_REGIONAL_ITEMS), age: "none" },
};

// ─── REUSABLE UI ─────────────────────────────────────────────────────────────

const s = { // shared micro-styles
  card: { background: "rgba(255,255,255,0.02)", borderRadius: 11, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 10, overflow: "hidden" },
  mono: { fontFamily: "'JetBrains Mono',monospace" },
};

const Toggle = ({ on, set }) => (
  <button onClick={() => set(!on)} style={{
    width: 38, height: 21, borderRadius: 11, border: "none",
    background: on ? "#3dd8a5" : "#363644", position: "relative",
    cursor: "pointer", transition: "background 0.15s", flexShrink: 0,
  }}>
    <span style={{
      position: "absolute", top: 2, left: on ? 19 : 2,
      width: 17, height: 17, borderRadius: 9, background: "#fff",
      transition: "left 0.12s", boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
    }} />
  </button>
);

function Pill({ items, state }) {
  const ct = items.filter(e => state[e.key]).length;
  const t = items.length;
  const color = ct === t ? "#3dd8a5" : ct === 0 ? "#ff6b6b" : "#ffc832";
  const bg = ct === t ? "rgba(61,216,165,0.12)" : ct === 0 ? "rgba(255,100,100,0.1)" : "rgba(255,200,50,0.1)";
  return <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 6px", borderRadius: 5, background: bg, color, whiteSpace: "nowrap" }}>
    {ct === t ? `All ${t}` : ct === 0 ? "None" : `${ct}/${t}`}
  </span>;
}

function BulkBtns({ items, setState, setPreset }) {
  const go = val => { setState(p => { const n = { ...p }; items.forEach(e => n[e.key] = val); return n; }); setPreset(null); };
  return <div style={{ display: "flex", gap: 4 }}>
    {[["All on", true], ["All off", false]].map(([l, v]) => (
      <button key={l} onClick={() => go(v)} style={{ fontSize: 9.5, padding: "2px 8px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#5a5a6a", cursor: "pointer" }}>{l}</button>
    ))}
  </div>;
}

function ItemRow({ item, checked, toggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0", gap: 8 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5, fontSize: 12.5, color: "#bbbbc8" }}>
          {item.icon && <span style={{ fontSize: 12, flexShrink: 0 }}>{item.icon}</span>}
          <span>{item.label}</span>
          {item.dex && <span style={{ ...s.mono, fontSize: 9.5, color: "#444458", flexShrink: 0 }}>{item.dex}</span>}
        </div>
        {(item.note || item.tip) && <div style={{ fontSize: 10, color: "#444458", marginLeft: item.icon ? 19 : 0, marginTop: 1 }}>{item.note || item.tip}</div>}
      </div>
      <Toggle on={checked} set={toggle} />
    </div>
  );
}

// Flat section (core, optional, gender, rare forms, rare species)
function Section({ emoji, title, subtitle, items, state, setState, setPreset, startOpen }) {
  const [open, setOpen] = useState(startOpen || false);
  return (
    <div style={s.card}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "11px 13px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>{emoji}</span>
        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#dddde8" }}>{title}</span>
          {!open && subtitle && <div style={{ fontSize: 9.5, color: "#4a4a58", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
        </div>
        <Pill items={items} state={state} />
        <span style={{ color: "#3a3a48", fontSize: 12, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 13px 10px" }}>
          {subtitle && <div style={{ fontSize: 10.5, color: "#4a4a58", marginBottom: 6, lineHeight: 1.4 }}>{subtitle}</div>}
          <div style={{ marginBottom: 6 }}><BulkBtns items={items} setState={setState} setPreset={setPreset} /></div>
          {items.map(e => <ItemRow key={e.key} item={e} checked={state[e.key]} toggle={v => { setState(p => ({ ...p, [e.key]: v })); setPreset(null); }} />)}
        </div>
      )}
    </div>
  );
}

// Grouped section (regionals — has sub-groups with their own all-on/off)
function GroupedSection({ emoji, title, subtitle, groups, allItems, state, setState, setPreset }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const toggleGroup = g => setExpanded(p => ({ ...p, [g]: !p[g] }));

  return (
    <div style={s.card}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "11px 13px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>{emoji}</span>
        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#dddde8" }}>{title}</span>
          {!open && subtitle && <div style={{ fontSize: 9.5, color: "#4a4a58", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
        </div>
        <Pill items={allItems} state={state} />
        <span style={{ color: "#3a3a48", fontSize: 12, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 13px 10px" }}>
          {subtitle && <div style={{ fontSize: 10.5, color: "#4a4a58", marginBottom: 6, lineHeight: 1.4 }}>{subtitle}</div>}
          <div style={{ marginBottom: 8 }}><BulkBtns items={allItems} setState={setState} setPreset={setPreset} /></div>
          {groups.map(g => {
            const isOpen = expanded[g.group];
            const gCt = g.items.filter(e => state[e.key]).length;
            const gT = g.items.length;
            return (
              <div key={g.group} style={{ marginBottom: 4 }}>
                <button onClick={() => toggleGroup(g.group)} style={{
                  width: "100%", background: "rgba(255,255,255,0.015)", border: "none", borderRadius: 7,
                  cursor: "pointer", padding: "7px 10px", display: "flex", alignItems: "center", gap: 6,
                  marginBottom: isOpen ? 2 : 0,
                }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "#8a8a9a", flex: 1, textAlign: "left" }}>{g.group}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                    background: gCt === gT ? "rgba(61,216,165,0.1)" : gCt === 0 ? "rgba(255,100,100,0.08)" : "rgba(255,200,50,0.08)",
                    color: gCt === gT ? "#3dd8a5" : gCt === 0 ? "#ff6b6b" : "#ffc832",
                  }}>{gCt}/{gT}</span>
                  <div style={{ display: "flex", gap: 3 }} onClick={e => e.stopPropagation()}>
                    {[["On", true], ["Off", false]].map(([l, v]) => (
                      <button key={l} onClick={() => { setState(p => { const n = { ...p }; g.items.forEach(i => n[i.key] = v); return n; }); setPreset(null); }} style={{
                        fontSize: 9, padding: "1px 6px", borderRadius: 4,
                        border: "1px solid rgba(255,255,255,0.05)", background: "transparent",
                        color: "#555568", cursor: "pointer",
                      }}>{l}</button>
                    ))}
                  </div>
                  <span style={{ color: "#3a3a48", fontSize: 10, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                </button>
                {isOpen && (
                  <div style={{ paddingLeft: 10 }}>
                    {g.items.map(e => <ItemRow key={e.key} item={e} checked={state[e.key]} toggle={v => { setState(p => ({ ...p, [e.key]: v })); setPreset(null); }} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [preset, setPreset] = useState("normal");
  const d = PRESETS.normal;
  const [core, setCore] = useState(d.core);
  const [opt, setOpt] = useState(d.opt);
  const [gen, setGen] = useState(d.gen);
  const [rf, setRf] = useState(d.rf);
  const [rs, setRs] = useState(d.rs);
  const [reg, setReg] = useState(d.reg);
  const [age, setAge] = useState("30");
  const [copied, setCopied] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const applyPreset = useCallback(p => {
    setPreset(p); const v = PRESETS[p];
    setCore(v.core); setOpt(v.opt); setGen(v.gen);
    setRf(v.rf); setRs(v.rs); setReg(v.reg); setAge(v.age);
  }, []);

  const searchString = useMemo(() => {
    const parts = [];
    const add = (items, st) => items.forEach(e => { if (st[e.key]) parts.push(e.q); });
    add(CORE, core); add(OPTIONAL, opt); add(GENDER, gen);
    add(RARE_FORMS, rf); add(RARE_SPECIES, rs); add(ALL_REGIONAL_ITEMS, reg);
    if (age !== "none") parts.push(`age0-${age}`);
    return parts.join("&");
  }, [core, opt, gen, rf, rs, reg, age]);

  const len = searchString.length;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(searchString); } catch {
      const ta = document.createElement("textarea"); ta.value = searchString;
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#13131b", fontFamily: "'DM Sans',sans-serif", color: "#dddde8" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(145deg,#183848 0%,#13131b 55%)", borderBottom: "1px solid rgba(61,216,165,0.1)", padding: "18px 14px 14px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 2px", display: "flex", alignItems: "center", gap: 7 }}>
            <span>📦</span>
            <span style={{ background: "linear-gradient(90deg,#3dd8a5,#60e8c0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Transfer Filter Builder</span>
          </h1>
          <p style={{ fontSize: 11, color: "#4a7080", margin: 0 }}>Pokémon GO search string builder — uses dex numbers for compact queries</p>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "10px 10px 120px" }}>

        {/* ── Sticky Output ── */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#13131b", paddingTop: 5, paddingBottom: 3, borderBottom: "1px solid rgba(255,255,255,0.03)", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 9, color: "#3a4858", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Search String</span>
            <span style={{ ...s.mono, fontSize: 9, color: len > 450 ? "#ff6b6b" : len > 350 ? "#ffd93d" : "#3a4858" }}>{len} chars{len > 450 ? " ⚠" : ""}</span>
          </div>
          <div onClick={handleCopy} style={{
            background: "rgba(61,216,165,0.035)", border: "1px solid rgba(61,216,165,0.13)",
            borderRadius: 8, padding: "8px 10px", cursor: "pointer", position: "relative",
            ...s.mono, fontSize: 10, color: "#7aaa98", lineHeight: 1.55,
            wordBreak: "break-all", maxHeight: 80, overflowY: "auto",
          }}>
            {searchString || <span style={{ color: "#2a2a38" }}>No filters selected</span>}
            <span style={{
              position: "absolute", top: 4, right: 6,
              background: copied ? "#3dd8a5" : "rgba(61,216,165,0.1)",
              color: copied ? "#13131b" : "#3dd8a5",
              padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700,
              fontFamily: "'DM Sans',sans-serif",
            }}>{copied ? "✓ Copied!" : "Copy"}</span>
          </div>
        </div>

        {/* ── Presets ── */}
        <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
          {[["quick", "Quick Clean", "Max exclusions, 7d"], ["normal", "Normal", "Safe defaults, 30d"], ["deep", "Deep Dive", "Fewer exclusions, all ages"]].map(([k, l, d]) => (
            <button key={k} onClick={() => applyPreset(k)} style={{
              flex: 1, padding: "7px 8px", borderRadius: 8, cursor: "pointer", textAlign: "left",
              background: preset === k ? "rgba(61,216,165,0.07)" : "rgba(255,255,255,0.015)",
              border: `1px solid ${preset === k ? "rgba(61,216,165,0.25)" : "rgba(255,255,255,0.03)"}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: preset === k ? "#3dd8a5" : "#9090a0" }}>{l}</div>
              <div style={{ fontSize: 9, color: "#444458", marginTop: 1 }}>{d}</div>
            </button>
          ))}
        </div>

        {/* ── Sections ── */}
        <Section emoji="🔒" title="Core Keepers" subtitle="Always excluded — never accidentally transfer these" items={CORE} state={core} setState={setCore} setPreset={setPreset} />
        <Section emoji="🎯" title="Optional Exclusions" subtitle="Excluded by default — toggle off for deeper dives" items={OPTIONAL} state={opt} setState={setOpt} setPreset={setPreset} />
        <Section emoji="♀♂" title="Gender-Dependent Pokémon" subtitle="Gender-based evolutions and form differences — keep both genders" items={GENDER} state={gen} setState={setGen} setPreset={setPreset} />
        <Section emoji="🎲" title="Rare Form Variants" subtitle="Species with rare evolution outcomes or limited forms" items={RARE_FORMS} state={rf} setState={setRf} setPreset={setPreset} />
        <Section emoji="💎" title="Rare & Regional-Form Species" subtitle="Hard-to-get species and forms locked by real-world region" items={RARE_SPECIES} state={rs} setState={setRs} setPreset={setPreset} />
        <GroupedSection emoji="🌍" title="Regional Exclusives" subtitle="Real-world region-locked species — grouped by generation, off by default" groups={REGIONAL_GROUPS} allItems={ALL_REGIONAL_ITEMS} state={reg} setState={setReg} setPreset={setPreset} />

        {/* ── Age Filter ── */}
        <div style={{ ...s.card, padding: "11px 13px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>📅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>Age Filter</div>
              <div style={{ fontSize: 10, color: "#4a4a58", marginTop: 1 }}>Newer catches first — older ones are better lucky trade fodder</div>
            </div>
            <span style={{
              fontSize: 9.5, fontWeight: 700, padding: "2px 6px", borderRadius: 5,
              background: age === "none" ? "rgba(255,100,100,0.1)" : "rgba(61,216,165,0.12)",
              color: age === "none" ? "#ff6b6b" : "#3dd8a5",
            }}>{age === "none" ? "Off" : `≤${age}d`}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {AGE_OPTIONS.map(o => (
              <button key={o.value} onClick={() => { setAge(o.value); setPreset(null); }} style={{
                padding: "5px 9px", borderRadius: 6, border: "none", cursor: "pointer",
                background: age === o.value ? "rgba(61,216,165,0.08)" : "rgba(255,255,255,0.02)",
                outline: age === o.value ? "1px solid rgba(61,216,165,0.22)" : "none",
                fontSize: 10.5, color: age === o.value ? "#dddde8" : "#5a5a68",
                fontWeight: age === o.value ? 600 : 400,
              }}>{o.label}</button>
            ))}
          </div>
        </div>

        {/* ── Notes ── */}
        <div style={s.card}>
          <button onClick={() => setNotesOpen(!notesOpen)} style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            padding: "11px 13px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#5a5a6a" }}>📝 Notes & Tips</span>
            <span style={{ color: "#3a3a48", fontSize: 12, transition: "transform 0.2s", transform: notesOpen ? "rotate(180deg)" : "none" }}>▾</span>
          </button>
          {notesOpen && (
            <div style={{ padding: "0 13px 10px", fontSize: 10.5, color: "#5a5a68", lineHeight: 1.65 }}>
              <p style={{ margin: "0 0 6px" }}><b style={{ color: "#8888a0" }}>How to use:</b> Copy → Pokémon GO → Storage → Search bar → Paste. Results are transfer candidates.</p>
              <p style={{ margin: "0 0 6px" }}><b style={{ color: "#8888a0" }}>Why numbers?</b> Dex numbers (e.g. <code style={{ ...s.mono, fontSize: 9.5, background: "rgba(255,255,255,0.04)", padding: "1px 3px", borderRadius: 3 }}>!83</code> instead of <code style={{ ...s.mono, fontSize: 9.5, background: "rgba(255,255,255,0.04)", padding: "1px 3px", borderRadius: 3 }}>!farfetch'd</code>) are much shorter. Ranges like <code style={{ ...s.mono, fontSize: 9.5, background: "rgba(255,255,255,0.04)", padding: "1px 3px", borderRadius: 3 }}>!313-314</code> cover consecutive dex entries. This keeps the string under the ~500 char limit.</p>
              <p style={{ margin: "0 0 6px" }}><b style={{ color: "#8888a0" }}>Lucky trades:</b> Pokémon older than ~1 year have higher lucky trade odds. Age filter helps you transfer newer catches first.</p>
              <p style={{ margin: "0 0 6px" }}><b style={{ color: "#8888a0" }}>Not in GO yet:</b> Indeedee, Oinkologne (Lechonk), Basculegion — will need entries when released.</p>
              <p style={{ margin: 0 }}><b style={{ color: "#8888a0" }}>Reference:</b>{" "}<a href="https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/1486-searching-filtering-your-pokemon-inventory/" target="_blank" rel="noopener" style={{ color: "#3dd8a5" }}>Niantic's official search guide</a>. Dex number search and ranges are confirmed by the <a href="https://pokemongo.fandom.com/wiki/Pok%C3%A9mon_search" target="_blank" rel="noopener" style={{ color: "#3dd8a5" }}>Pokémon GO Wiki</a>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
