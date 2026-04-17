// import { useState, useCallback, useMemo } from "react";
const { useState, useCallback, useMemo } = React;

const PRESETS = {
  quick: { label: "Quick Clean", desc: "Fast daily cleanup — newest catches, maximum exclusions", age: "7" },
  normal: { label: "Normal Session", desc: "Standard transfer session — recent catches, safe defaults", age: "30" },
  deep: { label: "Deep Dive", desc: "Careful review — all ages, fewer exclusions", age: "none" },
};

const CORE_EXCLUSIONS = [
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

const OPTIONAL_EXCLUSIONS = [
  { key: "evolveNew", label: "New Evolutions", query: "!evolvenew", icon: "↑", tip: "Pokémon with evolutions you haven't registered" },
  { key: "costume", label: "Costume", query: "!costume", icon: "🎩", tip: "Event costume variants" },
  { key: "shadow", label: "Shadow", query: "!shadow", icon: "🌑", tip: "Shadow Pokémon from Team Rocket" },
  { key: "purified", label: "Purified", query: "!purified", icon: "🌟", tip: "Purified former Shadow Pokémon" },
  { key: "eggsOnly", label: "Eggs Only", query: "!eggsonly", icon: "🥚", tip: "Species only available from eggs" },
  { key: "dynamax", label: "Dynamax", query: "!dynamax", icon: "⬆", tip: "Dynamax-capable Pokémon" },
  { key: "gigantamax", label: "Gigantamax", query: "!gigantamax", icon: "🔺", tip: "Gigantamax-capable Pokémon" },
  { key: "xl", label: "XL Size", query: "!xl", icon: "📏", tip: "Extra-large for showcases" },
  { key: "xxl", label: "XXL Size", query: "!xxl", icon: "📐", tip: "Extra-extra-large for showcases" },
  { key: "xxs", label: "XXS Size", query: "!xxs", icon: "🔬", tip: "Extra-extra-small for showcases" },
  { key: "tradeEvolve", label: "Trade Evolve", query: "!tradeevolve", icon: "🔄", tip: "Species that evolve free after trading" },
  { key: "specialMoves", label: "Special Moves", query: "!@special", icon: "⚡", tip: "Legacy / Community Day / event moves" },
];

const GENDER_EVO_POKEMON = [
  { key: "combee", label: "Combee", query: "!combee", note: "♀ → Vespiquen" },
  { key: "snorunt", label: "Snorunt", query: "!snorunt", note: "♀ → Froslass" },
  { key: "ralts", label: "Ralts line", query: "!ralts&!kirlia", note: "♂ → Gallade" },
  { key: "salandit", label: "Salandit", query: "!salandit", note: "♀ → Salazzle" },
  { key: "burmy", label: "Burmy", query: "!burmy", note: "♂ → Mothim, ♀ → Wormadam" },
];

const RARE_POKEMON = [
  { key: "hisuian", label: "Hisuian Forms", query: "!hisuian" },
  { key: "galarian", label: "Galarian Forms", query: "!galarian" },
  { key: "unown", label: "Unown", query: "!unown" },
  { key: "basculin", label: "Basculin", query: "!basculin" },
  { key: "flabebe", label: "Flabébé line", query: "!flabebe&!floette&!florges" },
  { key: "furfrou", label: "Furfrou", query: "!furfrou" },
  { key: "vivillon", label: "Vivillon line", query: "!vivillon&!scatterbug&!spewpa" },
  { key: "oricorio", label: "Oricorio", query: "!oricorio" },
];

const AGE_OPTIONS = [
  { value: "none", label: "No age filter", desc: "All Pokémon regardless of age" },
  { value: "1", label: "Last 1 day", desc: "Today's catches only" },
  { value: "3", label: "Last 3 days", desc: "Very recent catches" },
  { value: "7", label: "Last 7 days", desc: "This week's catches" },
  { value: "14", label: "Last 2 weeks", desc: "Recent catches" },
  { value: "30", label: "Last 30 days", desc: "This month's catches" },
  { value: "90", label: "Last 3 months", desc: "Recent season" },
  { value: "180", label: "Last 6 months", desc: "Half year" },
  { value: "365", label: "Last year", desc: "This year's catches" },
];

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!checked)}
    style={{
      width: 42, height: 24, borderRadius: 12, border: "none",
      background: disabled ? "#555" : checked ? "#3dd8a5" : "#4a4a5a",
      position: "relative", cursor: disabled ? "not-allowed" : "pointer",
      transition: "background 0.2s", flexShrink: 0, opacity: disabled ? 0.5 : 1,
    }}
  >
    <span style={{
      position: "absolute", top: 2, left: checked ? 20 : 2,
      width: 20, height: 20, borderRadius: 10,
      background: "#fff", transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    }} />
  </button>
);

const SectionHeader = ({ children, subtitle }) => (
  <div style={{ marginBottom: 12, marginTop: 4 }}>
    <h3 style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
      color: "#e8e8ec", margin: 0, letterSpacing: "0.02em",
      textTransform: "uppercase",
    }}>{children}</h3>
    {subtitle && <p style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8888a0",
      margin: "3px 0 0 0",
    }}>{subtitle}</p>}
  </div>
);

function PokemonGOFilterBuilder() {
  const [preset, setPreset] = useState("normal");

  const defaultCore = Object.fromEntries(CORE_EXCLUSIONS.map(e => [e.key, true]));
  const defaultOptional = Object.fromEntries(OPTIONAL_EXCLUSIONS.map(e => [e.key, true]));
  const defaultGender = Object.fromEntries(GENDER_EVO_POKEMON.map(e => [e.key, true]));
  const defaultRare = Object.fromEntries(RARE_POKEMON.map(e => [e.key, true]));

  const deepOptionalOff = {
    evolveNew: false, costume: false, shadow: false, purified: false,
    eggsOnly: false, dynamax: false, gigantamax: false, xl: false, xxl: false, xxs: false,
    tradeEvolve: false, specialMoves: false,
  };

  const [core, setCore] = useState(defaultCore);
  const [optional, setOptional] = useState(defaultOptional);
  const [gender, setGender] = useState(defaultGender);
  const [rare, setRare] = useState(defaultRare);
  const [age, setAge] = useState("30");
  const [copied, setCopied] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const applyPreset = useCallback((p) => {
    setPreset(p);
    setCore(defaultCore);
    if (p === "quick") {
      setOptional(defaultOptional);
      setGender(defaultGender);
      setRare(defaultRare);
      setAge("7");
    } else if (p === "normal") {
      setOptional(defaultOptional);
      setGender(defaultGender);
      setRare(defaultRare);
      setAge("30");
    } else {
      setOptional(deepOptionalOff);
      setGender(Object.fromEntries(GENDER_EVO_POKEMON.map(e => [e.key, false])));
      setRare(Object.fromEntries(RARE_POKEMON.map(e => [e.key, false])));
      setAge("none");
    }
  }, []);

  const searchString = useMemo(() => {
    const parts = [];
    CORE_EXCLUSIONS.forEach(e => { if (core[e.key]) parts.push(e.query); });
    OPTIONAL_EXCLUSIONS.forEach(e => { if (optional[e.key]) parts.push(e.query); });
    GENDER_EVO_POKEMON.forEach(e => { if (gender[e.key]) parts.push(e.query); });
    RARE_POKEMON.forEach(e => { if (rare[e.key]) parts.push(e.query); });
    if (age !== "none") parts.push(`age0-${age}`);
    return parts.join("&");
  }, [core, optional, gender, rare, age]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(searchString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = searchString;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleAllInGroup = (group, setGroup, items, value) => {
    setGroup(Object.fromEntries(items.map(e => [e.key, value])));
    setPreset(null);
  };

  const groupAllOn = (group, items) => items.every(e => group[e.key]);
  const groupAllOff = (group, items) => items.every(e => !group[e.key]);

  const cardStyle = {
    background: "rgba(255,255,255,0.03)", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.06)", padding: "16px 18px",
    marginBottom: 14,
  };

  const rowStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "7px 0", gap: 10,
  };

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#c8c8d8",
    display: "flex", alignItems: "center", gap: 8,
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#16161e",
      fontFamily: "'DM Sans', sans-serif", color: "#e8e8ec",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a4a 0%, #16161e 70%)",
        borderBottom: "1px solid rgba(61,216,165,0.15)",
        padding: "24px 20px 20px",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>📦</span>
            <h1 style={{
              fontSize: 22, fontWeight: 700, margin: 0,
              background: "linear-gradient(90deg, #3dd8a5, #5be8c0)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Transfer Filter Builder</h1>
          </div>
          <p style={{ fontSize: 13, color: "#7898a8", margin: 0, lineHeight: 1.5 }}>
            Build search strings for Pokémon GO to find transfer candidates.
            Copy the string below and paste it into the in-game search bar.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 16px 100px" }}>

        {/* Search String Output - Sticky */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "#16161e", paddingTop: 10, paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#7888a0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
              Generated Search String
            </span>
            <span style={{
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              color: searchString.length > 450 ? "#ff6b6b" : searchString.length > 350 ? "#ffd93d" : "#5a6a7a",
            }}>
              {searchString.length} chars
            </span>
          </div>
          <div
            onClick={handleCopy}
            style={{
              background: "rgba(61,216,165,0.06)", border: "1px solid rgba(61,216,165,0.2)",
              borderRadius: 10, padding: "12px 14px", cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: "#a0d8c8", lineHeight: 1.6, wordBreak: "break-all",
              maxHeight: 120, overflowY: "auto",
              transition: "border-color 0.2s, background 0.2s",
              position: "relative",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(61,216,165,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(61,216,165,0.2)"; }}
          >
            {searchString || <span style={{ color: "#556" }}>No filters selected</span>}
            <div style={{
              position: "absolute", top: 8, right: 10,
              background: copied ? "#3dd8a5" : "rgba(61,216,165,0.15)",
              color: copied ? "#16161e" : "#3dd8a5",
              padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s",
            }}>
              {copied ? "Copied!" : "Tap to copy"}
            </div>
          </div>
          {searchString.length > 450 && (
            <p style={{ fontSize: 11, color: "#ff6b6b", margin: "6px 0 0 0" }}>
              ⚠ This string may exceed Pokémon GO's search character limit. Try disabling some filters.
            </p>
          )}
        </div>

        {/* Presets */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              style={{
                flex: 1, minWidth: 100, padding: "10px 12px",
                background: preset === key ? "rgba(61,216,165,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${preset === key ? "rgba(61,216,165,0.4)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 10, cursor: "pointer", textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: preset === key ? "#3dd8a5" : "#c8c8d8", marginBottom: 2 }}>
                {p.label}
              </div>
              <div style={{ fontSize: 11, color: "#6a6a7a", lineHeight: 1.3 }}>{p.desc}</div>
            </button>
          ))}
        </div>

        {/* Core Exclusions */}
        <div style={cardStyle}>
          <SectionHeader subtitle="Always excluded — the Pokémon you never want to accidentally transfer">
            🔒 Core Keepers
          </SectionHeader>
          {CORE_EXCLUSIONS.map(e => (
            <div key={e.key} style={rowStyle}>
              <span style={labelStyle}>
                <span style={{ width: 20, textAlign: "center", fontSize: 14 }}>{e.icon}</span>
                {e.label}
              </span>
              <Toggle checked={core[e.key]} onChange={(v) => { setCore(p => ({ ...p, [e.key]: v })); setPreset(null); }} />
            </div>
          ))}
        </div>

        {/* Optional Exclusions */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <SectionHeader subtitle="Excluded by default — toggle off individually for deeper dives">
              🎯 Optional Exclusions
            </SectionHeader>
            <div style={{ display: "flex", gap: 6, flexShrink: 0, paddingTop: 2 }}>
              <button
                onClick={() => toggleAllInGroup(optional, setOptional, OPTIONAL_EXCLUSIONS, true)}
                disabled={groupAllOn(optional, OPTIONAL_EXCLUSIONS)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: groupAllOn(optional, OPTIONAL_EXCLUSIONS) ? "#444" : "#8888a0",
                  cursor: groupAllOn(optional, OPTIONAL_EXCLUSIONS) ? "default" : "pointer",
                }}>All on</button>
              <button
                onClick={() => toggleAllInGroup(optional, setOptional, OPTIONAL_EXCLUSIONS, false)}
                disabled={groupAllOff(optional, OPTIONAL_EXCLUSIONS)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: groupAllOff(optional, OPTIONAL_EXCLUSIONS) ? "#444" : "#8888a0",
                  cursor: groupAllOff(optional, OPTIONAL_EXCLUSIONS) ? "default" : "pointer",
                }}>All off</button>
            </div>
          </div>
          {OPTIONAL_EXCLUSIONS.map(e => (
            <div key={e.key} style={rowStyle}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={labelStyle}>
                  <span style={{ width: 20, textAlign: "center", fontSize: 14 }}>{e.icon}</span>
                  {e.label}
                </span>
                {e.tip && <span style={{ fontSize: 11, color: "#5a5a6a", marginLeft: 28 }}>{e.tip}</span>}
              </div>
              <Toggle checked={optional[e.key]} onChange={(v) => { setOptional(p => ({ ...p, [e.key]: v })); setPreset(null); }} />
            </div>
          ))}
        </div>

        {/* Gender-Specific Evolutions */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <SectionHeader subtitle="Species where gender matters for evolution — keep until deep dive">
              ♀♂ Gender Evolution Species
            </SectionHeader>
            <div style={{ display: "flex", gap: 6, flexShrink: 0, paddingTop: 2 }}>
              <button
                onClick={() => toggleAllInGroup(gender, setGender, GENDER_EVO_POKEMON, true)}
                disabled={groupAllOn(gender, GENDER_EVO_POKEMON)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: groupAllOn(gender, GENDER_EVO_POKEMON) ? "#444" : "#8888a0",
                  cursor: groupAllOn(gender, GENDER_EVO_POKEMON) ? "default" : "pointer",
                }}>All on</button>
              <button
                onClick={() => toggleAllInGroup(gender, setGender, GENDER_EVO_POKEMON, false)}
                disabled={groupAllOff(gender, GENDER_EVO_POKEMON)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: groupAllOff(gender, GENDER_EVO_POKEMON) ? "#444" : "#8888a0",
                  cursor: groupAllOff(gender, GENDER_EVO_POKEMON) ? "default" : "pointer",
                }}>All off</button>
            </div>
          </div>
          {GENDER_EVO_POKEMON.map(e => (
            <div key={e.key} style={rowStyle}>
              <div>
                <span style={labelStyle}>{e.label}</span>
                <span style={{ fontSize: 11, color: "#6a7a8a", marginLeft: 0, display: "block" }}>{e.note}</span>
              </div>
              <Toggle checked={gender[e.key]} onChange={(v) => { setGender(p => ({ ...p, [e.key]: v })); setPreset(null); }} />
            </div>
          ))}
        </div>

        {/* Rare / Special Pokemon */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <SectionHeader subtitle="Hard-to-get species and forms — keep unless doing a careful review">
              💎 Rare & Special Forms
            </SectionHeader>
            <div style={{ display: "flex", gap: 6, flexShrink: 0, paddingTop: 2 }}>
              <button
                onClick={() => toggleAllInGroup(rare, setRare, RARE_POKEMON, true)}
                disabled={groupAllOn(rare, RARE_POKEMON)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: groupAllOn(rare, RARE_POKEMON) ? "#444" : "#8888a0",
                  cursor: groupAllOn(rare, RARE_POKEMON) ? "default" : "pointer",
                }}>All on</button>
              <button
                onClick={() => toggleAllInGroup(rare, setRare, RARE_POKEMON, false)}
                disabled={groupAllOff(rare, RARE_POKEMON)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: groupAllOff(rare, RARE_POKEMON) ? "#444" : "#8888a0",
                  cursor: groupAllOff(rare, RARE_POKEMON) ? "default" : "pointer",
                }}>All off</button>
            </div>
          </div>
          {RARE_POKEMON.map(e => (
            <div key={e.key} style={rowStyle}>
              <span style={labelStyle}>{e.label}</span>
              <Toggle checked={rare[e.key]} onChange={(v) => { setRare(p => ({ ...p, [e.key]: v })); setPreset(null); }} />
            </div>
          ))}
        </div>

        {/* Age Filter */}
        <div style={cardStyle}>
          <SectionHeader subtitle="Newer catches first — older Pokémon are more likely to trigger lucky trades">
            📅 Age Filter
          </SectionHeader>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {AGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setAge(opt.value); setPreset(null); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", borderRadius: 8, border: "none",
                  background: age === opt.value ? "rgba(61,216,165,0.1)" : "transparent",
                  cursor: "pointer", transition: "background 0.15s",
                  outline: age === opt.value ? "1px solid rgba(61,216,165,0.3)" : "1px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 8,
                    border: `2px solid ${age === opt.value ? "#3dd8a5" : "#4a4a5a"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {age === opt.value && <div style={{ width: 8, height: 8, borderRadius: 4, background: "#3dd8a5" }} />}
                  </div>
                  <span style={{ fontSize: 14, color: age === opt.value ? "#e8e8ec" : "#9898a8", fontWeight: age === opt.value ? 600 : 400 }}>
                    {opt.label}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "#5a5a6a" }}>{opt.desc}</span>
              </button>
            ))}
          </div>
          {age !== "none" && (
            <div style={{
              marginTop: 10, padding: "8px 12px", borderRadius: 8,
              background: "rgba(61,216,165,0.05)", border: "1px solid rgba(61,216,165,0.1)",
              fontSize: 12, color: "#7aaa98",
            }}>
              Showing only Pokémon caught within the last {age} day{age !== "1" ? "s" : ""}. 
              Older Pokémon (better for lucky trades) are hidden.
            </div>
          )}
        </div>

        {/* Notes */}
        <div style={cardStyle}>
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: 0,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "#8888a0" }}>📝 Usage Notes & Tips</span>
            <span style={{ color: "#5a5a6a", fontSize: 18, transform: showNotes ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </button>
          {showNotes && (
            <div style={{ marginTop: 12, fontSize: 12, color: "#8888a0", lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 8px 0" }}><strong style={{ color: "#a8a8b8" }}>How to use:</strong> Copy the generated string and paste it into Pokémon GO's search bar in the Pokémon storage screen. Everything shown is a transfer candidate.</p>
              <p style={{ margin: "0 0 8px 0" }}><strong style={{ color: "#a8a8b8" }}>Workflow:</strong> Start with <em>Quick Clean</em> for daily maintenance. Use <em>Normal Session</em> for weekly cleanup. Switch to <em>Deep Dive</em> when storage is critically full and review carefully.</p>
              <p style={{ margin: "0 0 8px 0" }}><strong style={{ color: "#a8a8b8" }}>Lucky trade tip:</strong> Pokémon older than ~1 year have increased lucky trade odds. The age filter helps you transfer newer catches first to preserve these.</p>
              <p style={{ margin: "0 0 8px 0" }}><strong style={{ color: "#a8a8b8" }}>Character limit:</strong> Pokémon GO's search bar has a character limit (~500 chars). If the string is too long, disable some optional filters — the rare/special and gender-evo sections add up quickly.</p>
              <p style={{ margin: "0 0 0 0" }}><strong style={{ color: "#a8a8b8" }}>Note:</strong> Some search terms (like <code style={{ background: "rgba(255,255,255,0.05)", padding: "1px 4px", borderRadius: 3 }}>hisuian</code>, <code style={{ background: "rgba(255,255,255,0.05)", padding: "1px 4px", borderRadius: 3 }}>galarian</code>) depend on your game's language setting and may need adjustment. Verify in-game that each filter works as expected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PokemonGOFilterBuilder />);
