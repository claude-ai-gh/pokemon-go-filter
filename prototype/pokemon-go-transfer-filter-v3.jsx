// import { useState, useCallback, useMemo } from "react";
const { useState, useCallback, useMemo } = React;

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRESETS = {
  quick: { label: "Quick Clean", desc: "Fast daily cleanup — max exclusions, newest catches", age: "7" },
  normal: { label: "Normal Session", desc: "Standard transfer session — safe defaults, recent catches", age: "30" },
  deep: { label: "Deep Dive", desc: "Careful review — fewer exclusions, all ages", age: "none" },
};

const CORE = [
  { key: "shiny", label: "Shiny", query: "!shiny", icon: "✦" },
  { key: "legendary", label: "Legendary", query: "!legendary", icon: "◆" },
  { key: "mythical", label: "Mythical", query: "!mythical", icon: "★" },
  { key: "ultraBeast", label: "Ultra Beast", query: "!ultrabeast", icon: "◎" },
  { key: "lucky", label: "Lucky", query: "!lucky", icon: "☘" },
  { key: "traded", label: "Traded", query: "!traded", icon: "⇄" },
  { key: "buddy", label: "Buddy (any level)", query: "!buddy1-5", icon: "♥" },
  { key: "perfect", label: "Perfect IV (4★)", query: "!4*", icon: "💎" },
  { key: "defender", label: "Gym Defenders", query: "!defender", icon: "🛡" },
  { key: "favorite", label: "Favorited", query: "!favorite", icon: "⭐" },
  { key: "hypertraining", label: "Hyper Training", query: "!hypertraining", icon: "🏋" },
];

const OPTIONAL = [
  { key: "evolveNew", label: "New Evolutions", query: "!evolvenew", tip: "Pokémon with evolutions you haven't registered" },
  { key: "costume", label: "Costume", query: "!costume", tip: "Event costume variants" },
  { key: "shadow", label: "Shadow", query: "!shadow", tip: "Shadow Pokémon from Team Rocket" },
  { key: "purified", label: "Purified", query: "!purified", tip: "Purified former Shadow Pokémon" },
  { key: "eggsOnly", label: "Eggs Only", query: "!eggsonly", tip: "Species only available from eggs" },
  { key: "dynamax", label: "Dynamax", query: "!dynamax", tip: "Dynamax-capable Pokémon" },
  { key: "gigantamax", label: "Gigantamax", query: "!gigantamax", tip: "Gigantamax-capable Pokémon" },
  { key: "xl", label: "XL Size", query: "!xl", tip: "Extra-large for showcases" },
  { key: "xxl", label: "XXL Size", query: "!xxl", tip: "Extra-extra-large for showcases" },
  { key: "xxs", label: "XXS Size", query: "!xxs", tip: "Extra-extra-small for showcases" },
  { key: "tradeEvolve", label: "Trade Evolve", query: "!tradeevolve", tip: "Species that evolve free after trading" },
  { key: "specialMoves", label: "Special Moves", query: "!@special", tip: "Legacy / Community Day / event moves" },
  { key: "fusion", label: "Fusion", query: "!fusion", tip: "Pokémon eligible for or already fused" },
];

const GENDER_POKEMON = [
  { key: "combee", label: "Combee", query: "!combee", note: "♀ → Vespiquen" },
  { key: "snorunt", label: "Snorunt", query: "!snorunt", note: "♀ → Froslass" },
  { key: "ralts", label: "Ralts / Kirlia", query: "!ralts&!kirlia", note: "♂ → Gallade" },
  { key: "salandit", label: "Salandit", query: "!salandit", note: "♀ → Salazzle" },
  { key: "burmy", label: "Burmy", query: "!burmy", note: "♂ → Mothim, ♀ → Wormadam forms" },
  { key: "espurr", label: "Espurr / Meowstic", query: "!espurr&!meowstic", note: "♂ and ♀ have different movesets & stats" },
  { key: "litleo", label: "Litleo / Pyroar", query: "!litleo&!pyroar", note: "♂ and ♀ look very different" },
  { key: "frillish", label: "Frillish / Jellicent", query: "!frillish&!jellicent", note: "♂ and ♀ are distinct forms" },
];

const RARE_FORMS = [
  { key: "sinistea", label: "Sinistea / Polteageist", query: "!sinistea&!polteageist", note: "Antique form ~5% chance, costs 400 candy to evolve" },
  { key: "rockruff", label: "Rockruff / Lycanroc", query: "!rockruff&!lycanroc", note: "Dusk Form requires special Rockruff, evolve at dusk" },
  { key: "dunsparce", label: "Dunsparce / Dudunsparce", query: "!dunsparce&!dudunsparce", note: "Three-Segment form is 1% evolution chance" },
  { key: "tandemaus", label: "Tandemaus / Maushold", query: "!tandemaus&!maushold", note: "Family of Three is rare evolution variant" },
  { key: "pumpkaboo", label: "Pumpkaboo / Gourgeist", query: "!pumpkaboo&!gourgeist", note: "Super Size is rare, event-limited" },
  { key: "shellos", label: "Shellos / Gastrodon", query: "!shellos&!gastrodon", note: "East/West Sea forms split by hemisphere" },
  { key: "deerling", label: "Deerling / Sawsbuck", query: "!deerling&!sawsbuck", note: "Seasonal forms — some very rare" },
  { key: "spinda", label: "Spinda", query: "!spinda", note: "Many pattern variants, all from field research" },
];

const RARE_SPECIES = [
  { key: "hisui", label: "Hisui Region", query: "!hisui", note: "Hisuian forms (Voltorb, Growlithe, etc.)" },
  { key: "galar", label: "Galar Region", query: "!galar", note: "Galarian forms (Ponyta, Zigzagoon, etc.)" },
  { key: "paldea", label: "Paldea Region", query: "!paldea", note: "Paldean forms (Tauros breeds, Wooper, etc.)" },
  { key: "unown", label: "Unown", query: "!unown", note: "28 letter/symbol forms, most event-only" },
  { key: "furfrou", label: "Furfrou", query: "!furfrou", note: "Trims locked by real-world region" },
  { key: "vivillon", label: "Vivillon line", query: "!vivillon&!scatterbug&!spewpa", note: "Patterns by region — includes Scatterbug & Spewpa" },
  { key: "oricorio", label: "Oricorio", query: "!oricorio", note: "4 styles locked by real-world region" },
  { key: "flabebe", label: "Flabébé line", query: "!flabebe&!floette&!florges", note: "Colors by real-world region" },
];

const REGIONALS = [
  { key: "farfetchd", label: "Farfetch'd", query: "!farfetch'd", note: "Japan / S. Korea / Taiwan / Hong Kong" },
  { key: "kangaskhan", label: "Kangaskhan", query: "!kangaskhan", note: "Australia" },
  { key: "mrmime", label: "Mr. Mime / Mime Jr.", query: "!mr. mime&!mime jr.", note: "Europe" },
  { key: "tauros", label: "Tauros", query: "!tauros", note: "United States / Southern Canada" },
  { key: "heracross", label: "Heracross", query: "!heracross", note: "Latin America / S. Florida / S. Texas" },
  { key: "corsola", label: "Corsola", query: "!corsola", note: "Tropics (near equator)" },
  { key: "torkoal", label: "Torkoal", query: "!torkoal", note: "South / Southeast Asia / India" },
  { key: "tropius", label: "Tropius", query: "!tropius", note: "Africa / Mediterranean" },
  { key: "relicanth", label: "Relicanth", query: "!relicanth", note: "New Zealand / Fiji" },
  { key: "pachirisu", label: "Pachirisu", query: "!pachirisu", note: "Far North (Canada / Alaska / Russia)" },
  { key: "chatot", label: "Chatot", query: "!chatot", note: "Southern Hemisphere" },
  { key: "carnivine", label: "Carnivine", query: "!carnivine", note: "Southeast United States" },
  { key: "pansage", label: "Pansage", query: "!pansage", note: "Asia-Pacific" },
  { key: "pansear", label: "Pansear", query: "!pansear", note: "Europe / Middle East / Africa" },
  { key: "panpour", label: "Panpour", query: "!panpour", note: "Americas" },
  { key: "throh", label: "Throh", query: "!throh", note: "Americas / Africa" },
  { key: "sawk", label: "Sawk", query: "!sawk", note: "Europe / Asia / Australia" },
  { key: "bouffalant", label: "Bouffalant", query: "!bouffalant", note: "New York City area" },
  { key: "durant", label: "Durant", query: "!durant", note: "Eastern Hemisphere" },
  { key: "heatmor", label: "Heatmor", query: "!heatmor", note: "Western Hemisphere" },
  { key: "maractus", label: "Maractus", query: "!maractus", note: "Mexico / Central & South America" },
  { key: "sigilyph", label: "Sigilyph", query: "!sigilyph", note: "Egypt / Greece" },
  { key: "klefki", label: "Klefki", query: "!klefki", note: "France area" },
  { key: "hawlucha", label: "Hawlucha", query: "!hawlucha", note: "Mexico" },
  { key: "comfey", label: "Comfey", query: "!comfey", note: "Hawaii" },
  { key: "zangoose", label: "Zangoose", query: "!zangoose", note: "Rotates hemispheres" },
  { key: "seviper", label: "Seviper", query: "!seviper", note: "Rotates hemispheres" },
  { key: "volbeat", label: "Volbeat", query: "!volbeat", note: "Rotates hemispheres" },
  { key: "illumise", label: "Illumise", query: "!illumise", note: "Rotates hemispheres" },
  { key: "lunatone", label: "Lunatone", query: "!lunatone", note: "Rotates hemispheres" },
  { key: "solrock", label: "Solrock", query: "!solrock", note: "Rotates hemispheres" },
];

const AGE_OPTIONS = [
  { value: "none", label: "No filter" },
  { value: "1", label: "1 day" },
  { value: "3", label: "3 days" },
  { value: "7", label: "7 days" },
  { value: "14", label: "2 weeks" },
  { value: "30", label: "30 days" },
  { value: "90", label: "3 months" },
  { value: "180", label: "6 months" },
  { value: "365", label: "1 year" },
];

// ─── PRESET DEFAULTS ─────────────────────────────────────────────────────────

const on = (items) => Object.fromEntries(items.map(e => [e.key, true]));
const off = (items) => Object.fromEntries(items.map(e => [e.key, false]));

const PRESET_DEFAULTS = {
  quick:  { core: on(CORE), optional: on(OPTIONAL), gender: on(GENDER_POKEMON), rareForms: on(RARE_FORMS), rareSpecies: on(RARE_SPECIES), regionals: on(REGIONALS), age: "7" },
  normal: { core: on(CORE), optional: on(OPTIONAL), gender: on(GENDER_POKEMON), rareForms: on(RARE_FORMS), rareSpecies: on(RARE_SPECIES), regionals: off(REGIONALS), age: "30" },
  deep:   { core: on(CORE), optional: off(OPTIONAL), gender: off(GENDER_POKEMON), rareForms: off(RARE_FORMS), rareSpecies: off(RARE_SPECIES), regionals: off(REGIONALS), age: "none" },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} aria-pressed={checked} style={{
    width: 40, height: 22, borderRadius: 11, border: "none",
    background: checked ? "#3dd8a5" : "#3a3a48", position: "relative",
    cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
  }}>
    <span style={{
      position: "absolute", top: 2, left: checked ? 20 : 2,
      width: 18, height: 18, borderRadius: 9, background: "#fff",
      transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
    }} />
  </button>
);

function StatusPill({ state, items }) {
  const ct = items.filter(e => state[e.key]).length;
  const t = items.length;
  const bg = ct === t ? "rgba(61,216,165,0.12)" : ct === 0 ? "rgba(255,100,100,0.1)" : "rgba(255,200,50,0.1)";
  const color = ct === t ? "#3dd8a5" : ct === 0 ? "#ff6b6b" : "#ffc832";
  const text = ct === t ? `All ${t}` : ct === 0 ? "None" : `${ct}/${t}`;
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: bg, color, whiteSpace: "nowrap", letterSpacing: "0.02em" }}>{text}</span>;
}

function Section({ title, subtitle, emoji, items, state, setState, setPreset, startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  const toggleAll = (val) => { setState(Object.fromEntries(items.map(e => [e.key, val]))); setPreset(null); };

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", borderRadius: 11,
      border: "1px solid rgba(255,255,255,0.05)", marginBottom: 10, overflow: "hidden",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        padding: "12px 14px", display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 15, flexShrink: 0 }}>{emoji}</span>
        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#dddde8" }}>{title}</div>
          {!open && subtitle && <div style={{ fontSize: 10, color: "#555568", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
        </div>
        <StatusPill state={state} items={items} />
        <span style={{ color: "#4a4a5a", fontSize: 13, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>▾</span>
      </button>

      {open && (
        <div style={{ padding: "0 14px 12px" }}>
          {subtitle && <div style={{ fontSize: 11, color: "#555568", marginBottom: 8, lineHeight: 1.4 }}>{subtitle}</div>}
          <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
            <button onClick={() => toggleAll(true)} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "#6a6a7a", cursor: "pointer" }}>All on</button>
            <button onClick={() => toggleAll(false)} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "#6a6a7a", cursor: "pointer" }}>All off</button>
          </div>
          {items.map(e => (
            <div key={e.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", gap: 8 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, color: "#bbbbc8", display: "flex", alignItems: "center", gap: 5 }}>
                  {e.icon && <span style={{ width: 16, textAlign: "center", fontSize: 12, flexShrink: 0 }}>{e.icon}</span>}
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</span>
                </div>
                {(e.note || e.tip) && <div style={{ fontSize: 10.5, color: "#4a4a5a", marginLeft: e.icon ? 21 : 0, marginTop: 1 }}>{e.note || e.tip}</div>}
              </div>
              <Toggle checked={state[e.key]} onChange={v => { setState(p => ({ ...p, [e.key]: v })); setPreset(null); }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

function PokemonGOFilterBuilder() {
  const [preset, setPreset] = useState("normal");
  const init = PRESET_DEFAULTS.normal;
  const [core, setCore] = useState(init.core);
  const [optional, setOptional] = useState(init.optional);
  const [gender, setGender] = useState(init.gender);
  const [rareForms, setRareForms] = useState(init.rareForms);
  const [rareSpecies, setRareSpecies] = useState(init.rareSpecies);
  const [regionals, setRegionals] = useState(init.regionals);
  const [age, setAge] = useState("30");
  const [copied, setCopied] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const applyPreset = useCallback((p) => {
    setPreset(p);
    const d = PRESET_DEFAULTS[p];
    setCore(d.core); setOptional(d.optional); setGender(d.gender);
    setRareForms(d.rareForms); setRareSpecies(d.rareSpecies);
    setRegionals(d.regionals); setAge(d.age);
  }, []);

  const searchString = useMemo(() => {
    const parts = [];
    const add = (items, st) => items.forEach(e => { if (st[e.key]) parts.push(e.query); });
    add(CORE, core); add(OPTIONAL, optional); add(GENDER_POKEMON, gender);
    add(RARE_FORMS, rareForms); add(RARE_SPECIES, rareSpecies); add(REGIONALS, regionals);
    if (age !== "none") parts.push(`age0-${age}`);
    return parts.join("&");
  }, [core, optional, gender, rareForms, rareSpecies, regionals, age]);

  const len = searchString.length;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(searchString); } catch {
      const ta = document.createElement("textarea"); ta.value = searchString;
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#14141c", fontFamily: "'DM Sans', sans-serif", color: "#dddde8" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(145deg, #193848 0%, #14141c 55%)", borderBottom: "1px solid rgba(61,216,165,0.1)", padding: "20px 16px 16px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h1 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>📦</span>
            <span style={{ background: "linear-gradient(90deg,#3dd8a5,#5be8c0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Transfer Filter Builder
            </span>
          </h1>
          <p style={{ fontSize: 11.5, color: "#5a7a88", margin: 0 }}>Build search strings for Pokémon GO — copy &amp; paste into the in-game search bar</p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "12px 12px 120px" }}>

        {/* Sticky output */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#14141c", paddingTop: 6, paddingBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.03)", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 9.5, color: "#4a5868", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Search String</span>
            <span style={{ fontSize: 9.5, fontFamily: "'JetBrains Mono',monospace", color: len > 450 ? "#ff6b6b" : len > 350 ? "#ffd93d" : "#4a5868" }}>
              {len} chars{len > 450 ? " ⚠" : ""}
            </span>
          </div>
          <div onClick={handleCopy} style={{
            background: "rgba(61,216,165,0.04)", border: "1px solid rgba(61,216,165,0.15)",
            borderRadius: 9, padding: "9px 11px", cursor: "pointer", position: "relative",
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#88b8a8",
            lineHeight: 1.6, wordBreak: "break-all", maxHeight: 88, overflowY: "auto",
          }}>
            {searchString || <span style={{ color: "#334" }}>No filters selected</span>}
            <span style={{
              position: "absolute", top: 5, right: 7,
              background: copied ? "#3dd8a5" : "rgba(61,216,165,0.1)",
              color: copied ? "#14141c" : "#3dd8a5",
              padding: "2px 7px", borderRadius: 4, fontSize: 9.5, fontWeight: 700,
              fontFamily: "'DM Sans',sans-serif",
            }}>{copied ? "✓ Copied!" : "Copy"}</span>
          </div>
        </div>

        {/* Presets */}
        <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
          {Object.entries(PRESETS).map(([k, p]) => (
            <button key={k} onClick={() => applyPreset(k)} style={{
              flex: 1, minWidth: 85, padding: "8px 9px",
              background: preset === k ? "rgba(61,216,165,0.08)" : "rgba(255,255,255,0.015)",
              border: `1px solid ${preset === k ? "rgba(61,216,165,0.3)" : "rgba(255,255,255,0.04)"}`,
              borderRadius: 9, cursor: "pointer", textAlign: "left",
            }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: preset === k ? "#3dd8a5" : "#a0a0b0" }}>{p.label}</div>
              <div style={{ fontSize: 9.5, color: "#4a4a58", lineHeight: 1.3, marginTop: 1 }}>{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Sections */}
        <Section emoji="🔒" title="Core Keepers" subtitle="Always excluded — never accidentally transfer these" items={CORE} state={core} setState={setCore} setPreset={setPreset} />
        <Section emoji="🎯" title="Optional Exclusions" subtitle="Excluded by default — toggle off for deeper dives" items={OPTIONAL} state={optional} setState={setOptional} setPreset={setPreset} />
        <Section emoji="♀♂" title="Gender-Dependent Pokémon" subtitle="Gender-based evolutions and form differences worth keeping both genders" items={GENDER_POKEMON} state={gender} setState={setGender} setPreset={setPreset} />
        <Section emoji="🎲" title="Rare Form Variants" subtitle="Species with rare evolution outcomes or limited forms" items={RARE_FORMS} state={rareForms} setState={setRareForms} setPreset={setPreset} />
        <Section emoji="💎" title="Rare & Regional-Form Species" subtitle="Hard-to-get species and forms locked by real-world region" items={RARE_SPECIES} state={rareSpecies} setState={setRareSpecies} setPreset={setPreset} />
        <Section emoji="🌍" title="Regional Exclusives" subtitle="Real-world region-locked species — off by default since they add many characters" items={REGIONALS} state={regionals} setState={setRegionals} setPreset={setPreset} />

        {/* Age Filter */}
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 11,
          border: "1px solid rgba(255,255,255,0.05)", marginBottom: 10, padding: "12px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 15 }}>📅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#dddde8" }}>Age Filter</div>
              <div style={{ fontSize: 10, color: "#555568", marginTop: 1 }}>Newer catches first — older Pokémon are better for lucky trades</div>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
              background: age === "none" ? "rgba(255,100,100,0.1)" : "rgba(61,216,165,0.12)",
              color: age === "none" ? "#ff6b6b" : "#3dd8a5",
            }}>{age === "none" ? "Off" : `≤${age}d`}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {AGE_OPTIONS.map(o => (
              <button key={o.value} onClick={() => { setAge(o.value); setPreset(null); }} style={{
                padding: "6px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                background: age === o.value ? "rgba(61,216,165,0.1)" : "rgba(255,255,255,0.025)",
                outline: age === o.value ? "1px solid rgba(61,216,165,0.25)" : "none",
                fontSize: 11, color: age === o.value ? "#dddde8" : "#6a6a78",
                fontWeight: age === o.value ? 600 : 400,
              }}>{o.label}</button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 11,
          border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden",
        }}>
          <button onClick={() => setNotesOpen(!notesOpen)} style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6a6a7a" }}>📝 Usage Notes &amp; Tips</span>
            <span style={{ color: "#4a4a5a", fontSize: 13, transition: "transform 0.2s", transform: notesOpen ? "rotate(180deg)" : "none" }}>▾</span>
          </button>
          {notesOpen && (
            <div style={{ padding: "0 14px 12px", fontSize: 11, color: "#6a6a78", lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#8a8a9a" }}>How to use:</b> Copy the string → open Pokémon GO → Pokémon storage → search bar → paste. Everything shown is a transfer candidate.</p>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#8a8a9a" }}>Workflow:</b> <em>Quick Clean</em> daily. <em>Normal</em> weekly. <em>Deep Dive</em> when storage is critically full — review each one carefully.</p>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#8a8a9a" }}>Lucky trades:</b> Pokémon older than ~1 year have higher lucky trade odds. Age filter helps you transfer newer catches first.</p>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#8a8a9a" }}>Character limit:</b> GO's search bar caps around ~500 chars. Regionals add a lot — leave them off unless doing a focused session. Watch the counter above.</p>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#8a8a9a" }}>Not in GO yet:</b> Indeedee, Oinkologne (Lechonk), and Basculegion will need gender-form entries when they're eventually released.</p>
              <p style={{ margin: 0 }}><b style={{ color: "#8a8a9a" }}>Reference:</b>{" "}<a href="https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/1486-searching-filtering-your-pokemon-inventory/" target="_blank" rel="noopener" style={{ color: "#3dd8a5" }}>Niantic's official search guide</a>. Verify terms work in your game language.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PokemonGOFilterBuilder />);
