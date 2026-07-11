# Pokémon GO Transfer Filter Builder — Product Requirements Document

**Version:** 1.1  
**Last Updated:** July 2026  
**Status:** Prototype v5 — beta feedback incorporated

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
- Provide granular control down to individual Pokémon
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

**Biome Hunter** — Player lives near a specific biome (beach, desert) and wants to protect biome-locked Pokémon that are hard to re-obtain. Ensures the Biome Exclusive subsection is enabled.

**Regional Collector** — Player has traveled or traded for regional exclusives and wants to protect them. Enables the Regional Exclusive subsection, or just the specific species they own.

**Old-Catch Curator** — Player wants to protect their oldest catches (best lucky trade odds) while clearing newer ones. Uses catch-year exclusions (e.g., exclude 2016–2018) alongside or instead of the age presets.

---

## 3. Feature Requirements

### 3.1 Presets

The tool must provide three one-tap presets that configure all sections simultaneously:

| Preset | Age Filter | Core | Optional | Branching & Variants | Hard to Get |
|--------|-----------|------|----------|----------------------|-------------|
| Quick Clean | 7 days | All on | All on | All on | All on |
| Normal Session | 30 days | All on | All on | All on | Biome + Rare Encounters on, Regional Exclusive off |
| Deep Dive | No filter | All on | All off | All off | All off |

Regional Exclusives are off in Normal mode because they add significant character count and most players only care about a few of them.

Applying a preset also clears any custom age value and any catch-year exclusions.

Presets serve as starting points. Any manual toggle change after selecting a preset should deselect the preset indicator (the tool is now in "custom" mode). The preset buttons should visually indicate which (if any) is currently active.

### 3.2 Filter Sections

The tool has four toggle sections plus the Age Filter:

1. **Core Keepers** — flat list of keyword exclusions
2. **Optional Exclusions** — flat list of keyword exclusions
3. **Branching & Variants** — grouped section with 5 subsections of individual Pokémon
4. **Hard to Get** — grouped section with 3 subsections of individual Pokémon
5. **Age Filter** — age presets, custom age, and catch-year exclusions

All sections must be collapsible, showing a summary status (e.g., "All 11", "8/13", "None") when collapsed. Each section must have bulk "All on" / "All off" controls. Each individual item must have its own toggle. Grouped sections additionally give each subsection its own collapse control, status count, and On/Off bulk controls.

#### 3.2.1 Core Keepers

Always-on exclusions that protect the most universally valuable Pokémon. Users almost always want these excluded from the filter query (the results are transfer candidates, so excluding means protecting). These should rarely be turned off, but the user has the option.

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

Excluded by default in Quick Clean and Normal modes, all disabled in Deep Dive. These are categories players generally want to keep but may need to review (and delete from) during deep-dive space crunches.

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

#### 3.2.3 Branching & Variants

Grouped section covering species whose evolutions branch, or whose forms/appearances vary. Each subsection lists individual Pokémon (one toggle per species). Everything in this section is on in Quick Clean and Normal, off in Deep Dive.

**Branched Evolutions** — species with multiple or random evolution outcomes; keep several to obtain all branches.

| Pokémon | Dex # | Detail |
|---------|-------|--------|
| Dunsparce | #206 | Three-Segment Dudunsparce is a 1% evolution |
| Wurmple | #265 | Randomly evolves into Silcoon or Cascoon |
| Silcoon | #266 | Wurmple branch → Beautifly |
| Beautifly | #267 | Silcoon branch outcome |
| Cascoon | #268 | Wurmple branch → Dustox |
| Dustox | #269 | Cascoon branch outcome |
| Clamperl | #366 | Evolves into Huntail or Gorebyss |
| Rockruff | #744 | Midday / Midnight / rare Dusk Lycanroc |
| Toxel | #848 | Amped or Low Key Toxtricity |
| Tandemaus | #924 | Family of Three Maushold is rare |
| Charcadet | #935 | Evolves into Armarouge or Ceruledge |

**Gender-based Evolutions** — species whose gender determines the evolution path.

| Pokémon | Dex # | Detail |
|---------|-------|--------|
| Ralts | #280 | ♂ line → Gallade |
| Kirlia | #281 | ♂ → Gallade, ♀ → Gardevoir |
| Snorunt | #361 | ♀ → Froslass |
| Burmy | #412 | ♂ → Mothim, ♀ → Wormadam forms |

> Note: beta feedback listed Ralts/Kirlia as #260–261; their correct National Dex numbers are #280–281 and the tool uses the correct values.

**Gender Appearance Differences** — species where ♂/♀ differ meaningfully in appearance (and sometimes stats/moves); keep both genders.

| Pokémon | Dex # | Detail |
|---------|-------|--------|
| Combee | #415 | ♀ only evolves (Vespiquen), ♂ looks different |
| Pidove | #519 | Line has gendered appearances |
| Tranquill | #520 | Line has gendered appearances |
| Unfezant | #521 | ♂ and ♀ look very different |
| Frillish | #592 | ♂ and ♀ are distinct forms |
| Jellicent | #593 | ♂ and ♀ are distinct forms |
| Litleo | #667 | ♂ and ♀ look different |
| Pyroar | #668 | ♂ and ♀ look very different |
| Espurr | #677 | Evolves by gender into distinct Meowstic |
| Meowstic | #678 | ♂ and ♀ differ in looks, stats, moves |
| Indeedee | #876 | ♂ and ♀ differ in stats and moves |
| Basculegion | #902 | ♂ and ♀ differ in appearance and stats |

**Regional Variants** — species with in-game regional forms (Alolan, Galarian, etc.) worth keeping in multiple variants.

| Pokémon | Dex # | Detail |
|---------|-------|--------|
| Raichu | #26 | Alolan form |
| Exeggutor | #103 | Alolan form |
| Marowak | #105 | Alolan form |
| Weezing | #110 | Galarian form |

**Form Variation** — species with multiple cosmetic/situational forms.

| Pokémon | Dex # | Detail |
|---------|-------|--------|
| Castform | #351 | Weather forms (Sunny / Rainy / Snowy) |
| Cherrim | #421 | Overcast / Sunshine forms |
| Basculin | #550 | Red / Blue / White-Striped forms |
| Deerling | #585 | Four seasonal forms — some very rare |
| Sawsbuck | #586 | Four seasonal forms — some very rare |

#### 3.2.4 Hard to Get

Grouped section covering species that are difficult to (re-)obtain. Subsections: Biome Exclusive and Rare Encounters are on in Quick Clean and Normal; Regional Exclusive is on only in Quick Clean (off in Normal because of character cost); everything is off in Deep Dive.

**Biome Exclusive** — species that spawn exclusively or almost exclusively in specific real-world biomes. Functionally like soft regionals — if you don't live near the right biome, these are very hard to replace. This is a growing category; the tool should easily accommodate new entries.

| Pokémon | Dex # | Biome |
|---------|-------|-------|
| Silicobra | #843 | Desert / arid |
| Wiglett | #960 | Beach / coastline |
| Wugtrio | #961 | Beach / coastline |

**Regional Exclusive** — real-world region-locked species that can only be caught in specific countries or areas.

| Pokémon | Dex # | Region |
|---------|-------|--------|
| Farfetch'd | #83 | Japan / Korea / Taiwan / HK |
| Kangaskhan | #115 | Australia |
| Mr. Mime | #122 | Europe |
| Tauros | #128 | US / Southern Canada |
| Heracross | #214 | Latin America / S. Florida / S. Texas |
| Corsola | #222 | Tropics (near equator) |
| Volbeat | #313 | Rotates hemispheres |
| Illumise | #314 | Rotates hemispheres |
| Torkoal | #324 | South / Southeast Asia |
| Seviper | #336 | Rotates hemispheres |
| Lunatone | #337 | Rotates hemispheres |
| Solrock | #338 | Rotates hemispheres |
| Tropius | #357 | Africa / Mediterranean |
| Relicanth | #369 | New Zealand / Fiji |
| Pachirisu | #417 | Far North (Canada / Alaska / Russia) |
| Shellos | #422 | East / West Sea by hemisphere |
| Gastrodon | #423 | East / West Sea by hemisphere |
| Mime Jr. | #439 | Europe |
| Chatot | #441 | Southern Hemisphere |
| Carnivine | #455 | Southeast United States |
| Pansage / Simisage | #511–512 | Asia-Pacific |
| Pansear / Simisear | #513–514 | Europe / Middle East / Africa / India |
| Panpour / Simipour | #515–516 | The Americas / Greenland |
| Throh | #538 | Split by hemisphere |
| Sawk | #539 | Split by hemisphere |
| Basculin | #550 | Stripe forms split by region |
| Maractus | #556 | Mexico / Central & South America |
| Sigilyph | #561 | Egypt / Greece |
| Bouffalant | #626 | New York City area |
| Heatmor | #631 | Split by hemisphere |
| Durant | #632 | Split by hemisphere |
| Scatterbug / Spewpa / Vivillon | #664–666 | 18 Vivillon patterns by real-world region |
| Flabébé / Floette / Florges | #669–671 | Flower colors by real-world region |
| Hawlucha | #701 | Mexico |
| Klefki | #707 | France area |
| Oricorio | #741 | 4 styles locked by real-world region |
| Comfey | #764 | Hawaii |
| Stonjourner | #874 | Region-limited availability |
| Squawkabilly | #931 | Plumage forms split by region |
| Tatsugiri | #978 | Forms split by region |

Note: Basculin (#550) appears in both Form Variation and Regional Exclusive. The query generator deduplicates it — it contributes `!550` at most once.

**Rare Encounters** — species that are rare spawns or only available through limited mechanics (research, raids, events).

| Pokémon | Dex # | Detail |
|---------|-------|--------|
| Ditto | #132 | Hides as other species — rare find |
| Unown | #201 | 28 letter/symbol forms, mostly event-only |
| Nincada | #290 | Rare spawn |
| Ninjask | #291 | Rare — from Nincada |
| Shedinja | #292 | Research-only special evolution |
| Spinda | #327 | Field research only, many patterns |
| Feebas | #349 | Rare spawn |
| Kecleon | #352 | Rare PokéStop encounter |
| Spiritomb | #442 | Event research only |
| Rotom | #479 | Event-only appliance forms |
| Druddigon | #621 | Raids / events only |
| Komala | #775 | Rare spawn |
| Turtonator | #776 | Rare spawn / raids |
| Togedemaru | #777 | Rare spawn |
| Mimikyu | #778 | Very limited availability |
| Bruxish | #779 | Rare spawn |
| Drampa | #780 | Raids only |
| Applin | #840 | Rare spawn / events |
| Sinistea | #854 | Rare — Antique form ~5% |
| Varoom | #965 | Rare spawn / events |
| Revavroom | #966 | Rare — from Varoom |
| Orthworm | #968 | Rare spawn |
| Gimmighoul | #999 | Golden PokéStop / coin mechanic |
| Gholdengo | #1000 | Requires 999 Gimmighoul Coins |
| Poltchageist | #1012 | Very limited availability |

#### 3.2.5 Age Filter

The age filter section has three parts:

**1. Preset age ranges** — controls the `age0-N` parameter that limits results to Pokémon caught within the last N days. Newer Pokémon are generally safer to transfer because older Pokémon have higher lucky trade odds (especially those over 1 year old). Presented as mutually exclusive buttons (radio-button behavior).

Available options: No filter, 1 day, 3 days, 7 days, 2 weeks, 30 days, 3 months, 6 months, 1 year.

**2. Custom age** — a numeric input alongside the presets where the user can enter any arbitrary number of days N, producing `age0-N`. Focusing/typing in the custom box deselects the preset age buttons (and vice versa — tapping a preset clears the custom box). An empty or invalid custom value emits no age term.

**3. Catch-year exclusions** — a row of toggle chips, one per calendar year from 2016 (Pokémon GO launch) through the current year. Each enabled year adds `!yearYYYY` to the query, hiding Pokémon caught in that year. Unlike the age range, year exclusions are multi-select and combine freely with the age range (e.g., exclude 2016 and 2017 while also filtering to `age0-45`). Typical use: protecting very old catches, which have the best lucky trade odds.

The year list must be generated from the current date so new years appear automatically.

---

## 4. Search String Generation

### 4.1 Syntax Rules

The tool generates a single search string using Pokémon GO's documented syntax:

- `&` joins AND conditions (all must match)
- `!` excludes matching Pokémon
- Pokédex numbers are used for specific species (e.g., `!83` for Farfetch'd)
- Game keywords are used for category filters (e.g., `!shiny`, `!legendary`)
- `age0-N` restricts to Pokémon caught within the last N days
- `!yearYYYY` excludes Pokémon caught in calendar year YYYY

### 4.2 Automatic Range Merging

Species toggles are stored as individual dex numbers. At query-generation time, all enabled dex numbers (across every subsection) are:

1. **Deduplicated** — a species appearing in multiple subsections (e.g., Basculin #550) contributes one term
2. **Sorted and merged into ranges** — consecutive runs collapse to `!start-end` (e.g., Wurmple line #265–269 → `!265-269`), even across subsection boundaries (e.g., Castform #351 in Form Variation + Kecleon #352 in Rare Encounters → `!351-352`)
3. Singles stay single (`!206`)

This produces the shortest possible dex-number portion of the query for any combination of toggles.

### 4.3 Output Format

All enabled exclusions are joined with `&`, ordered: keywords, dex numbers/ranges, year exclusions, age term. Example output for the Normal preset with the 30-day age filter (488 characters):

```
!shiny&!legendary&!mythical&!ultrabeast&!lucky&!traded&!buddy1-5&!4*&!defender&!favorite&!hypertraining&!evolvenew&!costume&!shadow&!purified&!eggsonly&!dynamax&!gigantamax&!xl&!xxl&!xxs&!tradeevolve&!@special&!fusion&!26&!103&!105&!110&!132&!201&!206&!265-269&!280-281&!290-292&!327&!349&!351-352&!361&!366&!412&!415&!421&!442&!479&!519-521&!550&!585-586&!592-593&!621&!667-668&!677-678&!744&!775-780&!840&!843&!848&!854&!876&!902&!924&!935&!960-961&!965-966&!968&!999-1000&!1012&age0-30
```

### 4.4 Character Limit

Pokémon GO's search bar has an approximate 500-character limit. The tool must display a real-time character count and provide visual warnings:

- Green/neutral: under 350 characters
- Yellow: 350–450 characters
- Red: over 450 characters, with a warning that the string may be truncated in-game

The character limit is the primary reason for using Pokédex numbers instead of species names — names are 5–15 characters each while numbers are 1–3 characters. Note that with the expanded v5 species lists, the Quick Clean preset (everything on) exceeds the ~500 character limit (~650 characters); users must trim toggles — typically Regional Exclusive species they don't own — to get under it. See §8 Known Limitations.

---

## 5. User Interface Requirements

### 5.1 Layout

The interface uses a single-column layout optimized for mobile screens (~380px viewport). The sticky output bar at the top ensures the search string and copy button are always accessible while scrolling through filter sections.

**Visual hierarchy (top to bottom):**

1. Header with tool name and brief description
2. Sticky search string output with copy button and character counter
3. Preset buttons (Quick Clean / Normal / Deep Dive)
4. Collapsible filter sections (Core Keepers → Optional Exclusions → Branching & Variants → Hard to Get → Age Filter)
5. Collapsible notes and tips section

### 5.2 Collapsible Sections

Each filter section must:

- Be collapsed by default (except possibly Core Keepers on first load)
- Show a summary when collapsed: emoji icon, section title, brief subtitle, and status pill
- The status pill must show the toggle count state: "All N" (green), "X/N" (yellow), or "None" (red)
- Expand on tap to reveal individual toggles
- Provide "All on" / "All off" bulk buttons when expanded

### 5.3 Hierarchical Controls

The Branching & Variants and Hard to Get sections use a three-level hierarchy:

- Top level: section header with overall status pill and all on/off
- Mid level: subsections (Branched Evolutions, Regional Exclusive, etc.) each with their own collapse, status count, and On/Off controls
- Bottom level: individual Pokémon toggles

Core Keepers and Optional Exclusions use a flat two-level hierarchy (section → individual toggles).

### 5.4 Individual Item Display

Each toggle row must show:

- Pokémon name (or keyword for category filters)
- Pokédex number in monospace, where applicable
- Brief explanatory note (e.g., "♀ → Froslass" or "Rotates hemispheres")
- Toggle switch on the right

### 5.5 Toggle Behavior

- Toggles must be large enough for comfortable mobile tapping (minimum 38×20px touch target)
- Toggle state changes must immediately update the search string output
- Any manual toggle change must deselect the active preset indicator

### 5.6 Age Filter Controls

- Preset age buttons and the custom age input render in one wrapping row; the active choice is highlighted
- The custom input accepts digits only (numeric keyboard on mobile) and shows the entered value in the query live
- Year-exclusion chips render in a separate labeled row; active chips display as `!YYYY` with a distinct (yellow) highlight to signal exclusion
- The section's collapsed/summary chip reflects both parts, e.g. "≤45d −2 yr", or "Off" when neither is active

### 5.7 Copy Functionality

- Tapping the search string output area copies the full string to the clipboard
- A brief confirmation is shown ("✓ Copied!" for ~2 seconds)
- Fallback to `document.execCommand('copy')` for older browsers

### 5.8 Mobile Web Requirements

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

- `pokemon-go-transfer-filter-v5.html` — loads React, ReactDOM, and Babel from CDN; references the JSX file
- `pokemon-go-transfer-filter-v5.jsx` — the complete React application

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

- New Pokémon with branched or gender-dependent evolutions are released in GO
- New form-variant or gender-difference species are added
- New biome-locked Pokémon are introduced
- New regional exclusives are announced
- Pokémon GO adds new search keywords or changes existing syntax
- Regional exclusive Pokémon have their regions changed
- A new calendar year begins (year-exclusion chips are generated from the current date automatically)

### 7.2 Data Sources

- **Niantic official**: [Search & Filter help page](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/1486-searching-filtering-your-pokemon-inventory/) for search syntax
- **Pokémon GO Wiki (Fandom)**: Release dates, form details, regional lists, biome data
- **Serebii.net**: Regional exclusive tracking
- **The Silph Road (Reddit)**: Community research on biome mechanics and spawn data
- **Bulbapedia**: Gender differences, form data

### 7.3 Version History Tracking

Each update to the Pokémon data should be documented with the date and what changed.

- **July 2026 (v5)**: Restructured species sections per beta feedback into two grouped sections — "Branching & Variants" (Branched Evolutions, Gender-based Evolutions, Gender Appearance Differences, Regional Variants, Form Variation) and "Hard to Get" (Biome Exclusive, Regional Exclusive, Rare Encounters) — with per-species toggles and automatic dex-range merging. Added catch-year exclusions (`!yearYYYY`) and a custom age input to the Age Filter. Replaced keyword-based regional-form filters (`!hisui`, `!galar`, `!paldea`) with an explicit Regional Variants list; expanded Rare Encounters and Regional Exclusive lists.
- **May 2026 (v4)**: Added Lechonk/Oinkologne to gender-dependent section; added Silicobra/Sandaconda to biome-locked section.

---

## 8. Known Limitations

- **Character limit**: With all sections enabled (Quick Clean preset), the string is ~650 characters and exceeds the ~500 limit; the Normal preset sits just under it (~490). The tool mitigates this with dex numbers and automatic range merging and warns the user, but cannot enforce the exact limit since Niantic hasn't publicly documented it precisely. Users enabling everything must trim toggles (typically Regional Exclusives) to fit.
- **Language dependency**: Keyword filters (`!shiny`, `!legendary`, etc.) work across languages, but some terms may behave differently in non-English game clients. Pokédex numbers are language-independent.
- **Year filter availability**: The `year` search term is a relatively recent addition to Pokémon GO; on very old app versions the `!yearYYYY` terms may be ignored.
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
