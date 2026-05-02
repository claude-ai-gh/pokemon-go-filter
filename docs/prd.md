# Pokémon GO Transfer Filter Builder — Product Requirements Document

**Version:** 1.0  
**Last Updated:** May 2026  
**Status:** Prototype complete, refinements in progress

---

## 1. Overview

### 1.1 Purpose

The Transfer Filter Builder is a web-based tool that helps Pokémon GO players generate search strings for identifying safe-to-transfer Pokémon. The tool provides a visual interface of toggles, presets, and collapsible sections so users never need to manually compose or edit the raw search syntax.

### 1.2 Background

Pokémon GO's storage system holds up to 7,500 Pokémon. Active players frequently reach capacity and must transfer (permanently delete) catches to make room. The game's built-in search bar supports a rich query language — Pokédex numbers, ranges, Boolean operators (`&`, `,`, `!`), keywords (like `shiny`, `legendary`, `lucky`), move filters, age filters, and more — but the syntax is undocumented in-game and easy to get wrong. A single missing `!` exclusion can lead to the irreversible loss of a rare Pokémon.

Players currently manage this by memorizing strings, copying community-shared snippets, or building queries by hand. These approaches don't adapt well across different transfer scenarios (quick daily cleanup vs. careful deep dive), are hard to maintain as new Pokémon and features are added to the game, and provide no guardrails against mistakes.

### 1.3 Goals

- Eliminate accidental transfers by providing safe, well-tested default exclusions
- Support multiple transfer workflows (quick, normal, deep) with one-tap presets
- Provide granular control down to individual Pokémon evolution lines
- Stay under the game's ~500 character search limit using compact Pokédex number syntax
- Be usable on a mobile phone immediately next to the Pokémon GO app
- Require zero setup — no installs, no accounts, no build tools

### 1.4 Non-Goals

- This tool does not interact with Pokémon GO's servers or API in any way
- It does not store any user data or require authentication
- It does not attempt to automate transfers — it only generates a search string that the user manually pastes
- It is not a general-purpose Pokémon GO search string builder; it is specifically designed for the transfer use case

---

## 2. Target Users

### 2.1 Primary User

Active Pokémon GO players (typically level 30+) who catch enough Pokémon to fill their storage regularly. They understand basic concepts like IVs, shinies, lucky Pokémon, and evolution lines but may not know the full search syntax.

### 2.2 User Scenarios

**Daily Quick Clean** — Player catches 30–50 Pokémon per day and wants to clear obvious junk (low IV, common species, recent catches) in 2 minutes while keeping everything of value. Uses the Quick Clean preset as-is.

**Weekly Normal Session** — Player has accumulated 200+ catches and wants to clear space systematically. Uses the Normal preset, may toggle a few optional exclusions based on what they're working on (e.g., turning off shadow exclusion if they're not collecting shadows right now).

**Deep Dive** — Player's storage is critically full (near cap) and needs to make hard choices. Switches to Deep Dive preset (minimal exclusions, all ages), then selectively re-enables specific protection for Pokémon they care about. Reviews results carefully before transferring.

**Biome Hunter** — Player lives near a specific biome (beach, desert) and wants to protect biome-locked Pokémon that are hard to re-obtain. Ensures the biome section is enabled.

**Regional Collector** — Player has traveled or traded for regional exclusives and wants to protect them. Enables the regional exclusives section, possibly only for specific generations.

---

## 3. Feature Requirements

### 3.1 Presets

The tool must provide three one-tap presets that configure all sections simultaneously:

| Preset | Age Filter | Core | Optional | Gender | Rare Forms | Rare Species | Biome | Regionals |
|--------|-----------|------|----------|--------|------------|--------------|-------|-----------|
| Quick Clean | 7 days | All on | All on | All on | All on | All on | All on | All on |
| Normal Session | 30 days | All on | All on | All on | All on | All on | All on | All off |
| Deep Dive | No filter | All on | All off | All off | All off | All off | All off | All off |

Presets serve as starting points. Any manual toggle change after selecting a preset should deselect the preset indicator (the tool is now in "custom" mode). The preset buttons should visually indicate which (if any) is currently active.

### 3.2 Filter Sections

All sections must be collapsible, showing a summary status (e.g., "All 11", "8/13", "None") when collapsed. Each section must have bulk "All on" / "All off" controls. Each individual item must have its own toggle.

#### 3.2.1 Core Keepers

Always-on exclusions that protect the most universally valuable Pokémon. These should rarely be turned off, but the user has the option.

| Item | Search Term | Rationale |
|------|-------------|-----------|
| Shiny | `!shiny` | Rare alternate coloring, irreplaceable |
| Legendary | `!legendary` | Limited availability, raid-only |
| Mythical | `!mythical` | Extremely limited availability |
| Ultra Beast | `!ultrabeast` | Limited availability |
| Lucky | `!lucky` | Trade-obtained bonus, cannot be re-acquired |
| Traded | `!traded` | May become lucky, trade history |
| Buddy (all levels) | `!buddy1-5` | Buddy progress would be lost |
| Perfect IV (4★) | `!4*` | Perfect stats, extremely rare |
| Gym Defenders | `!defender` | Cannot transfer while defending |
| Favorited | `!favorite` | User has explicitly marked as important |
| Hyper Training | `!hypertraining` | Investment in progress |

#### 3.2.2 Optional Exclusions

Excluded by default in Quick Clean and Normal modes, all disabled in Deep Dive. These are categories players generally want to keep but may need to review during space crunches.

| Item | Search Term | Notes |
|------|-------------|-------|
| New Evolutions | `!evolvenew` | Pokémon with unregistered evolutions |
| Costume | `!costume` | Event costume variants |
| Shadow | `!shadow` | Shadow Pokémon from Team Rocket |
| Purified | `!purified` | Purified former shadows |
| Eggs Only | `!eggsonly` | Species only obtainable from eggs |
| Dynamax | `!dynamax` | Dynamax-capable Pokémon |
| Gigantamax | `!gigantamax` | Gigantamax-capable Pokémon |
| XL Size | `!xl` | Showcase-eligible |
| XXL Size | `!xxl` | Showcase-eligible |
| XXS Size | `!xxs` | Showcase-eligible |
| Trade Evolve | `!tradeevolve` | Free evolution after trading |
| Special Moves | `!@special` | Legacy / CD / event-exclusive moves |
| Fusion | `!fusion` | Fusion-eligible Pokémon |

#### 3.2.3 Gender-Dependent Pokémon

Species where gender determines evolution path or where male/female forms have meaningfully different stats, movesets, or appearances. Players should keep both genders to have access to all forms.

| Item | Dex # | Search Term | Gender Significance |
|------|-------|-------------|---------------------|
| Combee | #415 | `!415` | ♀ → Vespiquen (♂ cannot evolve) |
| Snorunt | #361 | `!361` | ♀ → Froslass (♂ → Glalie only) |
| Ralts / Kirlia | #280–281 | `!280-281` | ♂ → Gallade (#475) |
| Salandit | #757 | `!757` | ♀ only → Salazzle |
| Burmy | #412 | `!412` | ♂ → Mothim, ♀ → Wormadam (3 cloak forms) |
| Espurr / Meowstic | #677–678 | `!677-678` | ♂/♀ have different movesets and stats |
| Litleo / Pyroar | #667–668 | `!667-668` | ♂/♀ have very different appearances |
| Frillish / Jellicent | #592–593 | `!592-593` | ♂/♀ are visually distinct forms |
| Lechonk / Oinkologne | #915–916 | `!915-916` | ♂/♀ Oinkologne have different stats and appearance |

**Future additions when released:** Indeedee (#876) — ♂/♀ have different stats and movesets. Basculegion (#902) — ♂/♀ differ in stats.

#### 3.2.4 Rare Form Variants

Species with rare evolution outcomes, limited-availability forms, or uncommon variants worth protecting.

| Item | Dex # | Search Term | Rarity Detail |
|------|-------|-------------|---------------|
| Sinistea / Polteageist | #854–855 | `!854-855` | Antique form ~5% chance; costs 400 candy to evolve |
| Rockruff / Lycanroc | #744–745 | `!744-745` | Dusk Form requires special Rockruff; evolve during dusk window |
| Dunsparce / Dudunsparce | #206, #982 | `!206&!982` | Three-Segment form is 1% evolution chance |
| Tandemaus / Maushold | #924–925 | `!924-925` | Family of Three is rare evolution variant |
| Pumpkaboo / Gourgeist | #710–711 | `!710-711` | Super Size is rare and event-limited |
| Shellos / Gastrodon | #422–423 | `!422-423` | East/West Sea forms depend on hemisphere |
| Deerling / Sawsbuck | #585–586 | `!585-586` | Four seasonal forms; some extremely rare |
| Spinda | #327 | `!327` | 20+ pattern variants; field research only |

#### 3.2.5 Rare & Regional-Form Species

Species with alternate forms tied to real-world regions or that are otherwise hard to obtain. Uses keyword-based region filters where available; dex numbers for specific species.

| Item | Search Term | Notes |
|------|-------------|-------|
| Hisui region forms | `!hisui` | Hisuian Voltorb, Growlithe, Zorua, etc. |
| Galar region forms | `!galar` | Galarian Ponyta, Zigzagoon, Stunfisk, etc. |
| Paldea region forms | `!paldea` | Paldean Tauros breeds, Wooper, etc. |
| Unown | `!201` | 28 letter/symbol forms; most event-only |
| Furfrou | `!676` | Trims locked by real-world region |
| Scatterbug / Spewpa / Vivillon | `!664-666` | 18 patterns by real-world region |
| Oricorio | `!741` | 4 styles locked by real-world region |
| Flabébé / Floette / Florges | `!669-671` | 5 colors by real-world region |

#### 3.2.6 Biome-Locked Species

Species that spawn exclusively or almost exclusively in specific real-world biomes. These are functionally like soft regionals — if you don't live near the right biome, these Pokémon are very hard to replace.

| Item | Dex # | Search Term | Biome |
|------|-------|-------------|-------|
| Wiglett / Wugtrio | #960–961 | `!960-961` | Beach / coastline |
| Silicobra / Sandaconda | #843–844 | `!843-844` | Desert / arid (USGS non-vegetated) |
| Toedscool / Toedscruel | #948–949 | `!948-949` | Forest / specific vegetation biomes |

**Note:** Biome-locked Pokémon are a growing category. The tool should be designed to easily accommodate new entries as Niantic introduces more biome-restricted spawns.

#### 3.2.7 Regional Exclusives

Real-world region-locked species that can only be caught in specific countries or areas. Grouped by generation for easier navigation. Off by default in Normal mode because they add significant character count, and most players will only have a few regionals that are relevant to them.

Each generation sub-group must have its own all on/off controls and collapse toggle. Individual Pokémon within each sub-group must have their own toggles.

**Gen 1 — Kanto**

| Item | Dex # | Search Term | Region |
|------|-------|-------------|--------|
| Farfetch'd | #83 | `!83` | Japan / S. Korea / Taiwan / Hong Kong |
| Kangaskhan | #115 | `!115` | Australia |
| Mr. Mime / Mime Jr. | #122, #439 | `!122&!439` | Europe |
| Tauros | #128 | `!128` | US / Southern Canada |

**Gen 2 — Johto**

| Item | Dex # | Search Term | Region |
|------|-------|-------------|--------|
| Heracross | #214 | `!214` | Latin America / S. Florida / S. Texas |
| Corsola | #222 | `!222` | Tropics (near equator) |

**Gen 3 — Hoenn**

| Item | Dex # | Search Term | Region |
|------|-------|-------------|--------|
| Volbeat / Illumise | #313–314 | `!313-314` | Rotate hemispheres |
| Torkoal | #324 | `!324` | South / Southeast Asia |
| Zangoose / Seviper | #335–336 | `!335-336` | Rotate hemispheres |
| Lunatone / Solrock | #337–338 | `!337-338` | Rotate hemispheres |
| Tropius | #357 | `!357` | Africa / Mediterranean |
| Relicanth | #369 | `!369` | New Zealand / Fiji |

**Gen 4 — Sinnoh**

| Item | Dex # | Search Term | Region |
|------|-------|-------------|--------|
| Pachirisu | #417 | `!417` | Far North (Canada / Alaska / Russia) |
| Chatot | #441 | `!441` | Southern Hemisphere |
| Carnivine | #455 | `!455` | Southeast United States |

**Gen 5 — Unova**

| Item | Dex # | Search Term | Region |
|------|-------|-------------|--------|
| Pansage / Pansear / Panpour | #511, #513, #515 | `!511&!513&!515` | Split by continent |
| Throh / Sawk | #538–539 | `!538-539` | Split by hemisphere |
| Maractus | #556 | `!556` | Mexico / Central & South America |
| Sigilyph | #561 | `!561` | Egypt / Greece |
| Bouffalant | #626 | `!626` | New York City area |
| Heatmor / Durant | #631–632 | `!631-632` | Split by hemisphere |

**Gen 6+ — Kalos / Alola**

| Item | Dex # | Search Term | Region |
|------|-------|-------------|--------|
| Hawlucha | #701 | `!701` | Mexico |
| Klefki | #707 | `!707` | France area |
| Comfey | #764 | `!764` | Hawaii |

#### 3.2.8 Age Filter

Controls the `age0-N` parameter that limits results to Pokémon caught within the last N days. Newer Pokémon are generally safer to transfer because older Pokémon have higher lucky trade odds (especially those over 1 year old).

Available options: No filter, 1 day, 3 days, 7 days, 14 days, 30 days, 90 days, 180 days, 1 year.

The age filter is presented as a set of mutually exclusive buttons (radio-button behavior), not toggles.

---

## 4. Search String Generation

### 4.1 Syntax Rules

The tool generates a single search string using Pokémon GO's documented syntax:

- `&` joins AND conditions (all must match)
- `!` excludes matching Pokémon
- Pokédex numbers are used for specific species (e.g., `!83` for Farfetch'd)
- Consecutive dex numbers use ranges (e.g., `!664-666` for the Vivillon line)
- Non-consecutive dex numbers in the same evolution line use `&` (e.g., `!206&!982`)
- Game keywords are used for category filters (e.g., `!shiny`, `!legendary`, `!hisui`)
- `age0-N` restricts to Pokémon caught within the last N days

### 4.2 Output Format

All enabled exclusions are joined with `&`. Example output for Normal preset with 30-day age filter:

```
!shiny&!legendary&!mythical&!ultrabeast&!lucky&!traded&!buddy1-5&!4*&!defender&!favorite&!hypertraining&!evolvenew&!costume&!shadow&!purified&!eggsonly&!dynamax&!gigantamax&!xl&!xxl&!xxs&!tradeevolve&!@special&!fusion&!415&!361&!280-281&!757&!412&!677-678&!667-668&!592-593&!915-916&!854-855&!744-745&!206&!982&!924-925&!710-711&!422-423&!585-586&!327&!hisui&!galar&!paldea&!201&!676&!664-666&!741&!669-671&!960-961&!843-844&!948-949&age0-30
```

### 4.3 Character Limit

Pokémon GO's search bar has an approximate 500-character limit. The tool must display a real-time character count and provide visual warnings:

- Green/neutral: under 350 characters
- Yellow: 350–450 characters
- Red: over 450 characters, with a warning that the string may be truncated in-game

The character limit is the primary reason for using Pokédex numbers instead of species names — names are 5–15 characters each while numbers are 1–3 characters.

---

## 5. User Interface Requirements

### 5.1 Layout

The interface uses a single-column layout optimized for mobile screens (~380px viewport). The sticky output bar at the top ensures the search string and copy button are always accessible while scrolling through filter sections.

**Visual hierarchy (top to bottom):**

1. Header with tool name and brief description
2. Sticky search string output with copy button and character counter
3. Preset buttons (Quick Clean / Normal / Deep Dive)
4. Collapsible filter sections (Core → Optional → Gender → Rare Forms → Rare Species → Biome → Regionals → Age)
5. Collapsible notes and tips section

### 5.2 Collapsible Sections

Each filter section must:

- Be collapsed by default (except possibly Core Keepers on first load)
- Show a summary when collapsed: emoji icon, section title, brief subtitle, and status pill
- The status pill must show the toggle count state: "All N" (green), "X/N" (yellow), or "None" (red)
- Expand on tap to reveal individual toggles
- Provide "All on" / "All off" bulk buttons when expanded

### 5.3 Hierarchical Controls

The Regional Exclusives section requires an additional level of hierarchy:

- Top level: section header with overall status pill and all on/off
- Mid level: generation sub-groups (Gen 1, Gen 2, etc.) each with their own collapse, status, and on/off controls
- Bottom level: individual Pokémon toggles

Other sections use a flat two-level hierarchy (section → individual toggles).

### 5.4 Individual Item Display

Each toggle row must show:

- Pokémon name (or keyword for category filters)
- Pokédex number(s) in monospace, where applicable
- Brief explanatory note (e.g., "♀ → Vespiquen" or "Rotate hemispheres")
- Toggle switch on the right

### 5.5 Toggle Behavior

- Toggles must be large enough for comfortable mobile tapping (minimum 38×20px touch target)
- Toggle state changes must immediately update the search string output
- Any manual toggle change must deselect the active preset indicator

### 5.6 Copy Functionality

- Tapping the search string output area copies the full string to the clipboard
- A brief confirmation is shown ("✓ Copied!" for ~2 seconds)
- Fallback to `document.execCommand('copy')` for older browsers

### 5.7 Mobile Web Requirements

- The tool must render correctly on mobile Safari (iOS) and Chrome (Android) at viewport widths from 320px to 428px
- Touch targets must meet minimum 44×44px accessibility guidelines where possible
- The sticky output bar must not obscure content and must remain functional during scroll
- Text sizes must be readable without pinch-to-zoom
- No horizontal scrolling should be required
- The page should load quickly on mobile networks (target: under 3 seconds on 3G)

---

## 6. Hosting & Deployment

### 6.1 Architecture

The tool is a fully client-side application with no backend. It consists of:

- `index.html` — loads React, ReactDOM, and Babel from CDN; references the JSX file
- `pokemon-go-transfer-filter.jsx` — the complete React application

### 6.2 Dependencies (CDN-loaded)

- React 18 (UMD build)
- ReactDOM 18 (UMD build)
- Babel Standalone (for in-browser JSX transpilation)

### 6.3 Hosting

Served as static files on GitHub Pages. No build step required — push changes to the repository and they're live. Babel transpiles JSX to JavaScript in the browser on page load.

### 6.4 Compatibility Notes

- The JSX file must not use `import`/`export` syntax (no module system in browser-loaded Babel)
- React hooks must be destructured from the global `React` object: `const { useState, useCallback, useMemo } = React;`
- The JSX file must include a `ReactDOM.createRoot(document.getElementById('root')).render(<App />)` call at the bottom

---

## 7. Data Maintenance

### 7.1 Update Triggers

The Pokémon data in the tool needs to be updated when:

- New Pokémon with gender-dependent evolutions are released in GO (e.g., Indeedee, Basculegion)
- New rare form variants are added (new species with rare evolution RNG)
- New biome-locked Pokémon are introduced
- New regional exclusives are announced
- Pokémon GO adds new search keywords or changes existing syntax
- Regional exclusive Pokémon have their regions changed

### 7.2 Data Sources

- **Niantic official**: [Search & Filter help page](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/1486-searching-filtering-your-pokemon-inventory/) for search syntax
- **Pokémon GO Wiki (Fandom)**: Release dates, form details, regional lists, biome data
- **Serebii.net**: Regional exclusive tracking
- **The Silph Road (Reddit)**: Community research on biome mechanics and spawn data
- **Bulbapedia**: Gender differences, form data

### 7.3 Version History Tracking

Each update to the Pokémon data should be documented with the date and what changed (e.g., "May 2026: Added Lechonk/Oinkologne to gender-dependent section; added Silicobra/Sandaconda to biome-locked section").

---

## 8. Known Limitations

- **Character limit**: With all sections enabled, the string can exceed 500 characters. The tool mitigates this with dex numbers and warns the user but cannot enforce the exact limit since Niantic hasn't publicly documented it precisely.
- **Language dependency**: Keyword filters (`!shiny`, `!legendary`, etc.) work across languages, but some terms may behave differently in non-English game clients. Pokédex numbers are language-independent.
- **No persistence**: The tool does not save user preferences between sessions. Each visit starts with the default preset. This is intentional to avoid complexity, but could be added later using localStorage.
- **Biome data is approximate**: Niantic has not fully documented biome classifications. The biome-locked species list is based on community research and official event announcements.
- **No validation against live game**: The tool cannot verify that a generated string actually works correctly in the current version of Pokémon GO. Users should test strings in-game.

---

## 9. Future Considerations

- **Saved configurations**: Allow users to save custom filter presets (localStorage or URL hash encoding)
- **URL sharing**: Encode the current filter state in the URL hash so users can share configurations
- **Pokémon GO update tracker**: Flag when the tool's data may be stale based on known game updates
- **IV filter integration**: Add optional IV star rating filters (e.g., `!3*&!4*` to exclude 3-star and above)
- **Type-based exclusions**: Allow excluding specific Pokémon types (e.g., keep all Dragon-types)
- **Custom species list**: Let users add their own dex numbers to protect specific Pokémon they care about
- **Community string library**: Curated collection of purpose-built strings (PvP candidate finder, trade fodder finder, etc.)
