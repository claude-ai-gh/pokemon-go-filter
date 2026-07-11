// import { useState, useCallback, useMemo } from "react";
const { useState, useCallback, useMemo } = React;

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

// Species sections use a numeric `dex` field. The query generator merges all
// enabled dex numbers into consecutive ranges (e.g. 265,266,267 → !265-267)
// and deduplicates species that appear in more than one subsection.

const BRANCHING_GROUPS = [
  { group: "Branched Evolutions", items: [
    { key: "bv206", label: "Dunsparce", dex: 206, note: "Three-Segment Dudunsparce is a 1% evolution" },
    { key: "bv265", label: "Wurmple", dex: 265, note: "Randomly evolves into Silcoon or Cascoon" },
    { key: "bv266", label: "Silcoon", dex: 266, note: "Wurmple branch → Beautifly" },
    { key: "bv267", label: "Beautifly", dex: 267, note: "Silcoon branch outcome" },
    { key: "bv268", label: "Cascoon", dex: 268, note: "Wurmple branch → Dustox" },
    { key: "bv269", label: "Dustox", dex: 269, note: "Cascoon branch outcome" },
    { key: "bv366", label: "Clamperl", dex: 366, note: "Evolves into Huntail or Gorebyss" },
    { key: "bv744", label: "Rockruff", dex: 744, note: "Midday / Midnight / rare Dusk Lycanroc" },
    { key: "bv848", label: "Toxel", dex: 848, note: "Amped or Low Key Toxtricity" },
    { key: "bv924", label: "Tandemaus", dex: 924, note: "Family of Three Maushold is rare" },
    { key: "bv935", label: "Charcadet", dex: 935, note: "Evolves into Armarouge or Ceruledge" },
  ]},
  { group: "Gender-based Evolutions", items: [
    { key: "bv280", label: "Ralts", dex: 280, note: "♂ line → Gallade" },
    { key: "bv281", label: "Kirlia", dex: 281, note: "♂ → Gallade, ♀ → Gardevoir" },
    { key: "bv361", label: "Snorunt", dex: 361, note: "♀ → Froslass" },
    { key: "bv412", label: "Burmy", dex: 412, note: "♂ → Mothim, ♀ → Wormadam forms" },
  ]},
  { group: "Gender Appearance Differences", items: [
    { key: "bv415", label: "Combee", dex: 415, note: "♀ only evolves (Vespiquen), ♂ looks different" },
    { key: "bv519", label: "Pidove", dex: 519, note: "Line has gendered appearances" },
    { key: "bv520", label: "Tranquill", dex: 520, note: "Line has gendered appearances" },
    { key: "bv521", label: "Unfezant", dex: 521, note: "♂ and ♀ look very different" },
    { key: "bv592", label: "Frillish", dex: 592, note: "♂ and ♀ are distinct forms" },
    { key: "bv593", label: "Jellicent", dex: 593, note: "♂ and ♀ are distinct forms" },
    { key: "bv667", label: "Litleo", dex: 667, note: "♂ and ♀ look different" },
    { key: "bv668", label: "Pyroar", dex: 668, note: "♂ and ♀ look very different" },
    { key: "bv677", label: "Espurr", dex: 677, note: "Evolves by gender into distinct Meowstic" },
    { key: "bv678", label: "Meowstic", dex: 678, note: "♂ and ♀ differ in looks, stats, moves" },
    { key: "bv876", label: "Indeedee", dex: 876, note: "♂ and ♀ differ in stats and moves" },
    { key: "bv902", label: "Basculegion", dex: 902, note: "♂ and ♀ differ in appearance and stats" },
  ]},
  { group: "Regional Variants", items: [
    { key: "bv26", label: "Raichu", dex: 26, note: "Alolan form" },
    { key: "bv103", label: "Exeggutor", dex: 103, note: "Alolan form" },
    { key: "bv105", label: "Marowak", dex: 105, note: "Alolan form" },
    { key: "bv110", label: "Weezing", dex: 110, note: "Galarian form" },
  ]},
  { group: "Form Variation", items: [
    { key: "bv351", label: "Castform", dex: 351, note: "Weather forms (Sunny / Rainy / Snowy)" },
    { key: "bv421", label: "Cherrim", dex: 421, note: "Overcast / Sunshine forms" },
    { key: "bv550", label: "Basculin", dex: 550, note: "Red / Blue / White-Striped forms" },
    { key: "bv585", label: "Deerling", dex: 585, note: "Four seasonal forms — some very rare" },
    { key: "bv586", label: "Sawsbuck", dex: 586, note: "Four seasonal forms — some very rare" },
  ]},
];

const HARD_TO_GET_GROUPS = [
  { group: "Biome Exclusive", items: [
    { key: "htg843", label: "Silicobra", dex: 843, note: "Desert / arid biome" },
    { key: "htg960", label: "Wiglett", dex: 960, note: "Beach / coastline biome" },
    { key: "htg961", label: "Wugtrio", dex: 961, note: "Beach / coastline biome" },
  ]},
  { group: "Regional Exclusive", items: [
    { key: "htg83", label: "Farfetch'd", dex: 83, note: "Japan / Korea / Taiwan / HK" },
    { key: "htg115", label: "Kangaskhan", dex: 115, note: "Australia" },
    { key: "htg122", label: "Mr. Mime", dex: 122, note: "Europe" },
    { key: "htg128", label: "Tauros", dex: 128, note: "US / Southern Canada" },
    { key: "htg214", label: "Heracross", dex: 214, note: "Latin America / S. Florida / S. Texas" },
    { key: "htg222", label: "Corsola", dex: 222, note: "Tropics (near equator)" },
    { key: "htg313", label: "Volbeat", dex: 313, note: "Rotates hemispheres" },
    { key: "htg314", label: "Illumise", dex: 314, note: "Rotates hemispheres" },
    { key: "htg324", label: "Torkoal", dex: 324, note: "South / Southeast Asia" },
    { key: "htg336", label: "Seviper", dex: 336, note: "Rotates hemispheres" },
    { key: "htg337", label: "Lunatone", dex: 337, note: "Rotates hemispheres" },
    { key: "htg338", label: "Solrock", dex: 338, note: "Rotates hemispheres" },
    { key: "htg357", label: "Tropius", dex: 357, note: "Africa / Mediterranean" },
    { key: "htg369", label: "Relicanth", dex: 369, note: "New Zealand / Fiji" },
    { key: "htg417", label: "Pachirisu", dex: 417, note: "Far North (Canada / Alaska / Russia)" },
    { key: "htg422", label: "Shellos", dex: 422, note: "East / West Sea by hemisphere" },
    { key: "htg423", label: "Gastrodon", dex: 423, note: "East / West Sea by hemisphere" },
    { key: "htg439", label: "Mime Jr.", dex: 439, note: "Europe" },
    { key: "htg441", label: "Chatot", dex: 441, note: "Southern Hemisphere" },
    { key: "htg455", label: "Carnivine", dex: 455, note: "Southeast United States" },
    { key: "htg511", label: "Pansage", dex: 511, note: "Asia-Pacific" },
    { key: "htg512", label: "Simisage", dex: 512, note: "Asia-Pacific" },
    { key: "htg513", label: "Pansear", dex: 513, note: "Europe / Middle East / Africa / India" },
    { key: "htg514", label: "Simisear", dex: 514, note: "Europe / Middle East / Africa / India" },
    { key: "htg515", label: "Panpour", dex: 515, note: "The Americas / Greenland" },
    { key: "htg516", label: "Simipour", dex: 516, note: "The Americas / Greenland" },
    { key: "htg538", label: "Throh", dex: 538, note: "Split by hemisphere" },
    { key: "htg539", label: "Sawk", dex: 539, note: "Split by hemisphere" },
    { key: "htg550", label: "Basculin", dex: 550, note: "Stripe forms split by region" },
    { key: "htg556", label: "Maractus", dex: 556, note: "Mexico / Central & South America" },
    { key: "htg561", label: "Sigilyph", dex: 561, note: "Egypt / Greece" },
    { key: "htg626", label: "Bouffalant", dex: 626, note: "New York City area" },
    { key: "htg631", label: "Heatmor", dex: 631, note: "Split by hemisphere" },
    { key: "htg632", label: "Durant", dex: 632, note: "Split by hemisphere" },
    { key: "htg664", label: "Scatterbug", dex: 664, note: "Vivillon patterns by real-world region" },
    { key: "htg665", label: "Spewpa", dex: 665, note: "Vivillon patterns by real-world region" },
    { key: "htg666", label: "Vivillon", dex: 666, note: "18 patterns by real-world region" },
    { key: "htg669", label: "Flabébé", dex: 669, note: "Flower colors by real-world region" },
    { key: "htg670", label: "Floette", dex: 670, note: "Flower colors by real-world region" },
    { key: "htg671", label: "Florges", dex: 671, note: "Flower colors by real-world region" },
    { key: "htg701", label: "Hawlucha", dex: 701, note: "Mexico" },
    { key: "htg707", label: "Klefki", dex: 707, note: "France area" },
    { key: "htg741", label: "Oricorio", dex: 741, note: "4 styles locked by real-world region" },
    { key: "htg764", label: "Comfey", dex: 764, note: "Hawaii" },
    { key: "htg874", label: "Stonjourner", dex: 874, note: "Region-limited availability" },
    { key: "htg931", label: "Squawkabilly", dex: 931, note: "Plumage forms split by region" },
    { key: "htg978", label: "Tatsugiri", dex: 978, note: "Forms split by region" },
  ]},
  { group: "Rare Encounters", items: [
    { key: "htg132", label: "Ditto", dex: 132, note: "Hides as other species — rare find" },
    { key: "htg201", label: "Unown", dex: 201, note: "28 letter/symbol forms, mostly event-only" },
    { key: "htg290", label: "Nincada", dex: 290, note: "Rare spawn" },
    { key: "htg291", label: "Ninjask", dex: 291, note: "Rare — from Nincada" },
    { key: "htg292", label: "Shedinja", dex: 292, note: "Research-only special evolution" },
    { key: "htg327", label: "Spinda", dex: 327, note: "Field research only, many patterns" },
    { key: "htg349", label: "Feebas", dex: 349, note: "Rare spawn" },
    { key: "htg352", label: "Kecleon", dex: 352, note: "Rare PokéStop encounter" },
    { key: "htg442", label: "Spiritomb", dex: 442, note: "Event research only" },
    { key: "htg479", label: "Rotom", dex: 479, note: "Event-only appliance forms" },
    { key: "htg621", label: "Druddigon", dex: 621, note: "Raids / events only" },
    { key: "htg775", label: "Komala", dex: 775, note: "Rare spawn" },
    { key: "htg776", label: "Turtonator", dex: 776, note: "Rare spawn / raids" },
    { key: "htg777", label: "Togedemaru", dex: 777, note: "Rare spawn" },
    { key: "htg778", label: "Mimikyu", dex: 778, note: "Very limited availability" },
    { key: "htg779", label: "Bruxish", dex: 779, note: "Rare spawn" },
    { key: "htg780", label: "Drampa", dex: 780, note: "Raids only" },
    { key: "htg840", label: "Applin", dex: 840, note: "Rare spawn / events" },
    { key: "htg854", label: "Sinistea", dex: 854, note: "Rare — Antique form ~5%" },
    { key: "htg965", label: "Varoom", dex: 965, note: "Rare spawn / events" },
    { key: "htg966", label: "Revavroom", dex: 966, note: "Rare — from Varoom" },
    { key: "htg968", label: "Orthworm", dex: 968, note: "Rare spawn" },
    { key: "htg999", label: "Gimmighoul", dex: 999, note: "Golden PokéStop / coin mechanic" },
    { key: "htg1000", label: "Gholdengo", dex: 1000, note: "Requires 999 Gimmighoul Coins" },
    { key: "htg1012", label: "Poltchageist", dex: 1012, note: "Very limited availability" },
  ]},
];

const ALL_BRANCHING_ITEMS = BRANCHING_GROUPS.flatMap(g => g.items);
const ALL_HARD_TO_GET_ITEMS = HARD_TO_GET_GROUPS.flatMap(g => g.items);

const AGE_OPTIONS = [
  { value: "none", label: "No filter" },
  { value: "1", label: "1 day" }, { value: "3", label: "3 days" },
  { value: "7", label: "7 days" }, { value: "14", label: "2 weeks" },
  { value: "30", label: "30 days" }, { value: "90", label: "3 months" },
  { value: "180", label: "6 months" }, { value: "365", label: "1 year" },
];

// Catch years available for exclusion (Pokémon GO launched July 2016).
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [];
for (let y = 2016; y <= CURRENT_YEAR; y++) YEARS.push(String(y));

// In-game search bar truncates around ~500 characters. Compaction aims a bit
// lower to leave margin, since Niantic hasn't documented the exact limit.
const CHAR_LIMIT = 500;
const COMPACT_TARGET = 490;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const mkOn = items => Object.fromEntries(items.map(e => [e.key, true]));
const mkOff = items => Object.fromEntries(items.map(e => [e.key, false]));
const mkYearsOff = () => Object.fromEntries(YEARS.map(y => [y, false]));

// Normal preset: protect biome + rare encounters, leave regionals off
// (regionals add a lot of characters and only matter to some players).
const normalHardToGet = () => ({
  ...mkOn(HARD_TO_GET_GROUPS[0].items),   // Biome Exclusive
  ...mkOff(HARD_TO_GET_GROUPS[1].items),  // Regional Exclusive
  ...mkOn(HARD_TO_GET_GROUPS[2].items),   // Rare Encounters
});

const PRESETS = {
  quick:  { core: mkOn(CORE), opt: mkOn(OPTIONAL), bv: mkOn(ALL_BRANCHING_ITEMS), htg: mkOn(ALL_HARD_TO_GET_ITEMS), age: "7" },
  normal: { core: mkOn(CORE), opt: mkOn(OPTIONAL), bv: mkOn(ALL_BRANCHING_ITEMS), htg: normalHardToGet(), age: "30" },
  deep:   { core: mkOn(CORE), opt: mkOff(OPTIONAL), bv: mkOff(ALL_BRANCHING_ITEMS), htg: mkOff(ALL_HARD_TO_GET_ITEMS), age: "none" },
};

// Collapse a list of dex numbers into sorted, deduplicated {s,e} ranges.
const toRanges = nums => {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const ranges = [];
  for (const n of sorted) {
    const last = ranges[ranges.length - 1];
    if (last && n === last.e + 1) last.e = n;
    else ranges.push({ s: n, e: n });
  }
  return ranges;
};
const rangeTerm = (r, prefix) => r.s === r.e ? `${prefix}${r.s}` : `${prefix}${r.s}-${r.e}`;
const rangesLen = ranges => ranges.reduce((sum, r) => sum + rangeTerm(r, "!").length, 0) + Math.max(0, ranges.length - 1);

// Auto-compaction for transfer mode: excluding extra dex numbers only protects
// MORE Pokémon, so bridging small gaps between ranges is always safe. Greedily
// merge the pair of adjacent ranges with the smallest gap (fewest in-between
// species over-protected) until the dex portion fits its character budget.
// Returns the merged ranges plus how many extra species got absorbed.
const compactRanges = (ranges, budget) => {
  ranges = ranges.map(r => ({ ...r }));
  let hidden = 0;
  while (ranges.length > 1 && rangesLen(ranges) > budget) {
    let best = 0, bestGap = Infinity, bestSaved = -1;
    for (let i = 0; i < ranges.length - 1; i++) {
      const gap = ranges[i + 1].s - ranges[i].e - 1;
      const saved = rangeTerm(ranges[i], "!").length + 1 + rangeTerm(ranges[i + 1], "!").length
        - rangeTerm({ s: ranges[i].s, e: ranges[i + 1].e }, "!").length;
      if (gap < bestGap || (gap === bestGap && saved > bestSaved)) { best = i; bestGap = gap; bestSaved = saved; }
    }
    hidden += bestGap;
    ranges.splice(best, 2, { s: ranges[best].s, e: ranges[best + 1].e });
  }
  return { ranges, hidden };
};

// ─── REUSABLE UI ─────────────────────────────────────────────────────────────

const s = { // shared micro-styles
  card: { background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 12, overflow: "hidden" },
  mono: { fontFamily: "'JetBrains Mono',monospace" },
};

const Toggle = ({ on, set }) => (
  <button aria-pressed={on} onClick={() => set(!on)} style={{
    width: 46, height: 26, borderRadius: 13, border: "none",
    background: on ? "#3dd8a5" : "#363644", position: "relative",
    cursor: "pointer", transition: "background 0.15s", flexShrink: 0, padding: 0,
  }}>
    <span style={{
      position: "absolute", top: 2, left: on ? 22 : 2,
      width: 22, height: 22, borderRadius: 11, background: "#fff",
      transition: "left 0.12s", boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
    }} />
  </button>
);

function Pill({ items, state, neutralEmpty }) {
  const ct = items.filter(e => state[e.key]).length;
  const t = items.length;
  const empty = ct === 0;
  const color = ct === t ? "#3dd8a5" : empty ? (neutralEmpty ? "#6a6a7a" : "#ff6b6b") : "#ffc832";
  const bg = ct === t ? "rgba(61,216,165,0.12)" : empty ? (neutralEmpty ? "rgba(255,255,255,0.04)" : "rgba(255,100,100,0.1)") : "rgba(255,200,50,0.1)";
  return <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: bg, color, whiteSpace: "nowrap" }}>
    {ct === t ? `All ${t}` : empty ? "None" : `${ct}/${t}`}
  </span>;
}

function BulkBtns({ items, setState, setPreset }) {
  const go = val => { setState(p => { const n = { ...p }; items.forEach(e => n[e.key] = val); return n; }); setPreset(null); };
  return <div style={{ display: "flex", gap: 6 }}>
    {[["All on", true], ["All off", false]].map(([l, v]) => (
      <button key={l} onClick={() => go(v)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#8a8a9a", cursor: "pointer" }}>{l}</button>
    ))}
  </div>;
}

function ItemRow({ item, checked, toggle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", gap: 10 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontSize: 14.5, color: "#c8c8d4" }}>
          {item.icon && <span style={{ fontSize: 13.5, flexShrink: 0 }}>{item.icon}</span>}
          <span>{item.label}</span>
          {item.dex && <span style={{ ...s.mono, fontSize: 11, color: "#55556a", flexShrink: 0 }}>#{item.dex}</span>}
        </div>
        {(item.note || item.tip) && <div style={{ fontSize: 11.5, color: "#55556a", marginLeft: item.icon ? 20 : 0, marginTop: 2 }}>{item.note || item.tip}</div>}
      </div>
      <Toggle on={checked} set={toggle} />
    </div>
  );
}

// Flat section (core, optional)
function Section({ emoji, title, subtitle, items, state, setState, setPreset, neutralEmpty, startOpen }) {
  const [open, setOpen] = useState(startOpen || false);
  return (
    <div style={s.card}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 15px", display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ fontSize: 16 }}>{emoji}</span>
        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: "#dddde8" }}>{title}</span>
          {!open && subtitle && <div style={{ fontSize: 11, color: "#5a5a6c", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
        </div>
        <Pill items={items} state={state} neutralEmpty={neutralEmpty} />
        <span style={{ color: "#3a3a48", fontSize: 13, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 15px 12px" }}>
          {subtitle && <div style={{ fontSize: 12, color: "#5a5a6c", marginBottom: 8, lineHeight: 1.45 }}>{subtitle}</div>}
          <div style={{ marginBottom: 8 }}><BulkBtns items={items} setState={setState} setPreset={setPreset} /></div>
          {items.map(e => <ItemRow key={e.key} item={e} checked={state[e.key]} toggle={v => { setState(p => ({ ...p, [e.key]: v })); setPreset(null); }} />)}
        </div>
      )}
    </div>
  );
}

// Grouped section (Branching & Variants, Hard to Get — subsections with their own all-on/off)
function GroupedSection({ emoji, title, subtitle, groups, allItems, state, setState, setPreset, neutralEmpty }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const toggleGroup = g => setExpanded(p => ({ ...p, [g]: !p[g] }));

  return (
    <div style={s.card}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "14px 15px", display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ fontSize: 16 }}>{emoji}</span>
        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: "#dddde8" }}>{title}</span>
          {!open && subtitle && <div style={{ fontSize: 11, color: "#5a5a6c", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
        </div>
        <Pill items={allItems} state={state} neutralEmpty={neutralEmpty} />
        <span style={{ color: "#3a3a48", fontSize: 13, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 15px 12px" }}>
          {subtitle && <div style={{ fontSize: 12, color: "#5a5a6c", marginBottom: 8, lineHeight: 1.45 }}>{subtitle}</div>}
          <div style={{ marginBottom: 10 }}><BulkBtns items={allItems} setState={setState} setPreset={setPreset} /></div>
          {groups.map(g => {
            const isOpen = expanded[g.group];
            const gCt = g.items.filter(e => state[e.key]).length;
            const gT = g.items.length;
            return (
              <div key={g.group} style={{ marginBottom: 5 }}>
                <div role="button" tabIndex={0} onClick={() => toggleGroup(g.group)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") toggleGroup(g.group); }}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.015)", borderRadius: 8,
                    cursor: "pointer", padding: "11px 12px", display: "flex", alignItems: "center", gap: 7,
                    marginBottom: isOpen ? 3 : 0,
                  }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#9a9aaa", flex: 1, textAlign: "left" }}>{g.group}</span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                    background: gCt === gT ? "rgba(61,216,165,0.1)" : gCt === 0 ? (neutralEmpty ? "rgba(255,255,255,0.04)" : "rgba(255,100,100,0.08)") : "rgba(255,200,50,0.08)",
                    color: gCt === gT ? "#3dd8a5" : gCt === 0 ? (neutralEmpty ? "#6a6a7a" : "#ff6b6b") : "#ffc832",
                  }}>{gCt}/{gT}</span>
                  <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                    {[["On", true], ["Off", false]].map(([l, v]) => (
                      <button key={l} onClick={() => { setState(p => { const n = { ...p }; g.items.forEach(i => n[i.key] = v); return n; }); setPreset(null); }} style={{
                        fontSize: 11, padding: "5px 11px", borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.07)", background: "transparent",
                        color: "#77778a", cursor: "pointer",
                      }}>{l}</button>
                    ))}
                  </div>
                  <span style={{ color: "#3a3a48", fontSize: 11, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                </div>
                {isOpen && (
                  <div style={{ paddingLeft: 12 }}>
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

// Each mode keeps its own toggle state: transfer mode starts from the Normal
// preset (exclude keepers), find mode starts empty (select what to look for).
const initTransferState = () => ({ ...PRESETS.normal, customAge: "", years: mkYearsOff() });
const initFindState = () => ({
  core: mkOff(CORE), opt: mkOff(OPTIONAL),
  bv: mkOff(ALL_BRANCHING_ITEMS), htg: mkOff(ALL_HARD_TO_GET_ITEMS),
  age: "none", customAge: "", years: mkYearsOff(),
});

function App() {
  const [mode, setMode] = useState("transfer"); // "transfer" | "find"
  const [preset, setPreset] = useState("normal");
  const [slabs, setSlabs] = useState({ transfer: initTransferState(), find: initFindState() });
  const [copied, setCopied] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const st = slabs[mode];
  const find = mode === "find";
  // Field updater scoped to the active mode; accepts a value or an updater fn.
  const patch = useCallback(field => updater => setSlabs(p => ({
    ...p, [mode]: { ...p[mode], [field]: typeof updater === "function" ? updater(p[mode][field]) : updater },
  })), [mode]);
  const clearPreset = find ? () => {} : setPreset;

  const applyPreset = useCallback(p => {
    setPreset(p);
    setSlabs(prev => ({ ...prev, transfer: { ...PRESETS[p], customAge: "", years: mkYearsOff() } }));
  }, []);

  const ageDays = st.age === "custom" ? (/^\d+$/.test(st.customAge) && +st.customAge > 0 ? st.customAge : null)
    : st.age !== "none" ? st.age : null;
  const excludedYears = YEARS.filter(y => st.years[y]);

  const { searchString, compactedCount } = useMemo(() => {
    const enabledDex = [];
    ALL_BRANCHING_ITEMS.forEach(e => { if (st.bv[e.key]) enabledDex.push(e.dex); });
    ALL_HARD_TO_GET_ITEMS.forEach(e => { if (st.htg[e.key]) enabledDex.push(e.dex); });
    const yearTerms = excludedYears.map(y => `!year${y}`);
    const ageTerms = ageDays ? [`age0-${ageDays}`] : [];

    if (!find) {
      // Transfer mode: AND of exclusions. Results = transfer candidates.
      const keywords = [];
      CORE.forEach(e => { if (st.core[e.key]) keywords.push(e.q); });
      OPTIONAL.forEach(e => { if (st.opt[e.key]) keywords.push(e.q); });
      const fixed = [...keywords, ...yearTerms, ...ageTerms];
      let ranges = toRanges(enabledDex);
      let hidden = 0;
      const fixedLen = fixed.join("&").length;
      const budget = COMPACT_TARGET - fixedLen - (fixed.length && ranges.length ? 1 : 0);
      if (rangesLen(ranges) > budget) ({ ranges, hidden } = compactRanges(ranges, budget));
      const str = [...keywords, ...ranges.map(r => rangeTerm(r, "!")), ...yearTerms, ...ageTerms].join("&");
      return { searchString: str, compactedCount: hidden };
    }

    // Find mode: AND of OR-clauses (GO syntax: `,` = OR within a clause,
    // `&` = AND between clauses). Species clause AND qualities clause:
    // e.g. "83,115&shiny,4*" = (Farfetch'd OR Kangaskhan) AND (shiny OR perfect).
    const species = toRanges(enabledDex).map(r => rangeTerm(r, "")).join(",");
    const qualities = [
      ...CORE.filter(e => st.core[e.key]),
      ...OPTIONAL.filter(e => st.opt[e.key]),
    ].map(e => e.q.replace(/^!/, "")).join(",");
    const str = [species, qualities, ...yearTerms, ...ageTerms].filter(Boolean).join("&");
    return { searchString: str, compactedCount: 0 };
  }, [st, find, ageDays, excludedYears.join(",")]);

  const len = searchString.length;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(searchString); } catch {
      const ta = document.createElement("textarea"); ta.value = searchString;
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const ageSummary = [
    ageDays ? `≤${ageDays}d` : st.age === "custom" ? "Custom…" : "Off",
    excludedYears.length ? `−${excludedYears.length} yr` : null,
  ].filter(Boolean).join(" ");
  const ageActive = !!ageDays || excludedYears.length > 0;

  const chip = (active, activeBg, activeColor) => ({
    padding: "9px 13px", borderRadius: 8, border: "none", cursor: "pointer",
    minHeight: 40, background: active ? activeBg : "rgba(255,255,255,0.02)",
    outline: active ? `1px solid ${activeColor}44` : "none",
    fontSize: 13, color: active ? activeColor : "#6a6a7a",
    fontWeight: active ? 600 : 400,
  });

  return (
    <div style={{ minHeight: "100vh", background: "#13131b", fontFamily: "'DM Sans',sans-serif", color: "#dddde8" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        button, [role="button"] { touch-action: manipulation; }
        html { -webkit-text-size-adjust: 100%; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(145deg,#183848 0%,#13131b 55%)", borderBottom: "1px solid rgba(61,216,165,0.1)", padding: "18px 14px 14px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 8 }}>
            <span>📦</span>
            <span style={{ background: "linear-gradient(90deg,#3dd8a5,#60e8c0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Transfer Filter Builder</span>
          </h1>
          <p style={{ fontSize: 12.5, color: "#4a7080", margin: 0 }}>Pokémon GO search string builder — uses dex numbers for compact queries</p>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "12px 12px 120px" }}>

        {/* ── Sticky Output ── */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#13131b", paddingTop: 6, paddingBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.03)", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10.5, color: "#3a4858", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>
              {find ? "Find Query" : "Transfer Query"}
            </span>
            <span style={{ ...s.mono, fontSize: 10.5, color: len > CHAR_LIMIT ? "#ff6b6b" : len > 400 ? "#ffd93d" : "#3a4858" }}>
              {len}/{CHAR_LIMIT} chars{len > CHAR_LIMIT ? " ⚠ too long!" : ""}
            </span>
          </div>
          <div onClick={handleCopy} style={{
            background: "rgba(61,216,165,0.035)", border: "1px solid rgba(61,216,165,0.13)",
            borderRadius: 9, padding: "10px 12px", cursor: "pointer", position: "relative",
            ...s.mono, fontSize: 11.5, color: "#7aaa98", lineHeight: 1.55,
            wordBreak: "break-all", maxHeight: 96, overflowY: "auto",
          }}>
            {searchString || <span style={{ color: "#3a3a4a" }}>Nothing selected yet — toggle some filters below</span>}
            <span style={{
              position: "absolute", top: 5, right: 7,
              background: copied ? "#3dd8a5" : "rgba(61,216,165,0.1)",
              color: copied ? "#13131b" : "#3dd8a5",
              padding: "4px 9px", borderRadius: 5, fontSize: 11, fontWeight: 700,
              fontFamily: "'DM Sans',sans-serif",
            }}>{copied ? "✓ Copied!" : "Copy"}</span>
          </div>
          {compactedCount > 0 && (
            <div style={{ fontSize: 11, color: "#ffc832", marginTop: 4, lineHeight: 1.4 }}>
              ⚡ Auto-compacted to fit the {CHAR_LIMIT}-char limit: nearby dex ranges merged, protecting {compactedCount} extra in-between species.
            </div>
          )}
        </div>

        {/* ── Mode Switch ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {[["transfer", "📦 Transfer Cleanup", "Exclude keepers — results are safe to transfer"],
            ["find", "🔍 Find Pokémon", "Select what to search for — results match filters"]].map(([k, l, d]) => (
            <button key={k} onClick={() => setMode(k)} style={{
              flex: 1, padding: "10px 10px", borderRadius: 9, cursor: "pointer", textAlign: "left",
              background: mode === k ? "rgba(61,216,165,0.09)" : "rgba(255,255,255,0.015)",
              border: `1px solid ${mode === k ? "rgba(61,216,165,0.3)" : "rgba(255,255,255,0.04)"}`,
            }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: mode === k ? "#3dd8a5" : "#9090a0" }}>{l}</div>
              <div style={{ fontSize: 11, color: "#55556a", marginTop: 2, lineHeight: 1.35 }}>{d}</div>
            </button>
          ))}
        </div>

        {/* ── Presets (transfer) / hint (find) ── */}
        {!find ? (
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[["quick", "Quick Clean", "Max exclusions, 7d"], ["normal", "Normal", "Safe defaults, 30d"], ["deep", "Deep Dive", "Fewer exclusions, all ages"]].map(([k, l, d]) => (
              <button key={k} onClick={() => applyPreset(k)} style={{
                flex: 1, padding: "10px 10px", borderRadius: 9, cursor: "pointer", textAlign: "left",
                background: preset === k ? "rgba(61,216,165,0.07)" : "rgba(255,255,255,0.015)",
                border: `1px solid ${preset === k ? "rgba(61,216,165,0.25)" : "rgba(255,255,255,0.03)"}`,
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: preset === k ? "#3dd8a5" : "#9090a0" }}>{l}</div>
                <div style={{ fontSize: 10.5, color: "#55556a", marginTop: 2, lineHeight: 1.3 }}>{d}</div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ ...s.card, padding: "12px 15px", fontSize: 12.5, color: "#7a8a95", lineHeight: 1.55 }}>
            <b style={{ color: "#3dd8a5" }}>Find mode:</b> toggles now <b>select</b> Pokémon to show instead of excluding them.
            Selected species combine with OR; selected qualities (from Core / Optional) narrow the results.
            Example: turn on <i>Regional Exclusive</i> + <i>Shiny</i> + <i>Perfect IV</i> → every regional that is shiny <i>or</i> perfect.
          </div>
        )}

        {/* ── Sections ── */}
        <Section emoji={find ? "✨" : "🔒"} title={find ? "Qualities" : "Core Keepers"}
          subtitle={find ? "Show Pokémon matching any selected quality" : "Always excluded — never accidentally transfer these"}
          items={CORE} state={st.core} setState={patch("core")} setPreset={clearPreset} neutralEmpty={find} />
        <Section emoji={find ? "🏷" : "🎯"} title={find ? "More Qualities" : "Optional Exclusions"}
          subtitle={find ? "Costume, shadow, size and other property matches" : "Excluded by default — toggle off for deeper dives"}
          items={OPTIONAL} state={st.opt} setState={patch("opt")} setPreset={clearPreset} neutralEmpty={find} />
        <GroupedSection emoji="🌿" title="Branching & Variants"
          subtitle={find ? "Show any selected species" : "Branched evolutions, gender differences, regional & form variants"}
          groups={BRANCHING_GROUPS} allItems={ALL_BRANCHING_ITEMS} state={st.bv} setState={patch("bv")} setPreset={clearPreset} neutralEmpty={find} />
        <GroupedSection emoji="💎" title="Hard to Get"
          subtitle={find ? "Show any selected species" : "Biome-locked, real-world regionals, and rare encounters"}
          groups={HARD_TO_GET_GROUPS} allItems={ALL_HARD_TO_GET_ITEMS} state={st.htg} setState={patch("htg")} setPreset={clearPreset} neutralEmpty={find} />

        {/* ── Age Filter ── */}
        <div style={{ ...s.card, padding: "14px 15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>📅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>Age Filter</div>
              <div style={{ fontSize: 11.5, color: "#55556a", marginTop: 2 }}>
                {find ? "Only match recent catches, or skip whole years" : "Newer catches first — older ones are better lucky trade fodder"}
              </div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
              background: ageActive ? "rgba(61,216,165,0.12)" : find ? "rgba(255,255,255,0.04)" : "rgba(255,100,100,0.1)",
              color: ageActive ? "#3dd8a5" : find ? "#6a6a7a" : "#ff6b6b",
            }}>{ageSummary}</span>
          </div>

          {/* Preset age buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {AGE_OPTIONS.map(o => (
              <button key={o.value} onClick={() => { patch("age")(o.value); patch("customAge")(""); clearPreset(null); }}
                style={chip(st.age === o.value, "rgba(61,216,165,0.08)", "#3dd8a5")}>{o.label}</button>
            ))}
            {/* Custom age input */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5, padding: "4px 13px", borderRadius: 8, minHeight: 40, boxSizing: "border-box",
              background: st.age === "custom" ? "rgba(61,216,165,0.08)" : "rgba(255,255,255,0.02)",
              outline: st.age === "custom" ? "1px solid rgba(61,216,165,0.27)" : "none",
            }}>
              <span style={{ fontSize: 13, color: st.age === "custom" ? "#3dd8a5" : "#6a6a7a", fontWeight: st.age === "custom" ? 600 : 400 }}>Custom:</span>
              <input
                type="number" min="1" inputMode="numeric" placeholder="N"
                value={st.customAge}
                onFocus={() => { patch("age")("custom"); clearPreset(null); }}
                onChange={e => { patch("customAge")(e.target.value.replace(/\D/g, "")); patch("age")("custom"); clearPreset(null); }}
                style={{
                  width: 56, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6, color: "#dddde8", fontSize: 16, padding: "4px 7px",
                  ...s.mono, outline: "none",
                }}
              />
              <span style={{ fontSize: 13, color: "#6a6a7a" }}>days</span>
            </div>
          </div>

          {/* Year exclusions */}
          <div style={{ fontSize: 11, color: "#55556a", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600, marginBottom: 6 }}>
            Exclude catch years <span style={{ textTransform: "none", fontWeight: 400 }}>— hide Pokémon caught in these years</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {YEARS.map(y => (
              <button key={y} onClick={() => { patch("years")(p => ({ ...p, [y]: !p[y] })); clearPreset(null); }}
                style={{ ...chip(st.years[y], "rgba(255,200,50,0.1)", "#ffc832"), ...s.mono }}>
                {st.years[y] ? `!${y}` : y}
              </button>
            ))}
          </div>
        </div>

        {/* ── Notes ── */}
        <div style={s.card}>
          <button onClick={() => setNotesOpen(!notesOpen)} style={{
            width: "100%", background: "none", border: "none", cursor: "pointer",
            padding: "14px 15px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#7a7a8a" }}>📝 Notes & Tips</span>
            <span style={{ color: "#3a3a48", fontSize: 13, transition: "transform 0.2s", transform: notesOpen ? "rotate(180deg)" : "none" }}>▾</span>
          </button>
          {notesOpen && (
            <div style={{ padding: "0 15px 12px", fontSize: 12.5, color: "#6a6a7a", lineHeight: 1.65 }}>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#9898b0" }}>How to use:</b> Copy → Pokémon GO → Storage → Search bar → Paste. In Transfer mode, results are transfer candidates. In Find mode, results are the Pokémon you selected.</p>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#9898b0" }}>Why numbers?</b> Dex numbers (e.g. <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>!83</code> instead of <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>!farfetch'd</code>) are much shorter. Enabled Pokémon with consecutive dex numbers are automatically merged into ranges like <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>!265-269</code>.</p>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#9898b0" }}>Auto-compact:</b> if a Transfer query would exceed the game's ~{CHAR_LIMIT}-char limit, nearby ranges are merged (e.g. <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>!103&!105</code> → <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>!103-105</code>). This only ever protects <i>more</i> Pokémon — the in-between species just won't show as transfer candidates.</p>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#9898b0" }}>Find mode syntax:</b> <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>,</code> means OR and <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>&</code> means AND — e.g. <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>83,115&shiny,4*</code> shows Farfetch'd or Kangaskhan that are shiny or perfect.</p>
              <p style={{ margin: "0 0 7px" }}><b style={{ color: "#9898b0" }}>Lucky trades:</b> Pokémon older than ~1 year have higher lucky trade odds. Age filter helps you transfer newer catches first; year exclusions like <code style={{ ...s.mono, fontSize: 11, background: "rgba(255,255,255,0.04)", padding: "1px 4px", borderRadius: 3 }}>!year2016</code> protect whole years of old catches.</p>
              <p style={{ margin: 0 }}><b style={{ color: "#9898b0" }}>Reference:</b>{" "}<a href="https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/1486-searching-filtering-your-pokemon-inventory/" target="_blank" rel="noopener" style={{ color: "#3dd8a5" }}>Niantic's official search guide</a>. Dex number search and ranges are confirmed by the <a href="https://pokemongo.fandom.com/wiki/Pok%C3%A9mon_search" target="_blank" rel="noopener" style={{ color: "#3dd8a5" }}>Pokémon GO Wiki</a>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
