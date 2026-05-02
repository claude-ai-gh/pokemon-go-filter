# PokÃ©mon GO Transfer Filter Builder â€” One-Pager

## The Problem

PokÃ©mon GO players routinely hit their storage cap (up to 7,500 PokÃ©mon) and must clear space by transferring catches. The in-game search bar is powerful â€” supporting dex numbers, ranges, Boolean operators, keywords, and age filters â€” but constructing the right "safe transfer" query from scratch is error-prone and tedious. One wrong exclusion can result in accidentally transferring a shiny, a lucky, or a rare form that took months to obtain. Players currently rely on memorized strings, community-shared text snippets, or trial and error, none of which adapt well to different cleanup scenarios.

## The Solution

A mobile-friendly, single-page web tool that lets players visually compose PokÃ©mon GO search strings through toggles, presets, and collapsible sections â€” without ever typing or editing the raw string. The tool generates a ready-to-paste query that **shows transfer candidates** (everything not excluded), using compact PokÃ©dex numbers and ranges to stay under the game's ~500 character search limit. Users copy the string, paste it into PokÃ©mon GO's search bar, and review the filtered results before transferring.

## Core Value Proposition

- **Safety**: sensible defaults protect shinies, legendaries, luckies, perfects, favorites, and other high-value PokÃ©mon from accidental transfer
- **Speed**: three one-tap presets (Quick Clean, Normal Session, Deep Dive) configure dozens of toggles instantly for common workflows
- **Comprehensiveness**: covers 8 distinct filter categories including gender-dependent species, rare forms, biome-locked spawns, and real-world regional exclusives
- **Compact output**: PokÃ©dex numbers and ranges (e.g., `!664-666` instead of `!vivillon&!scatterbug&!spewpa`) maximize the filters that fit within the character limit
- **Mobile-first**: designed for use on a phone right next to the PokÃ©mon GO app

## Users

PokÃ©mon GO players who actively manage their storage â€” typically level 30+ trainers who catch frequently enough to fill storage between sessions. Ranges from casual players who do a quick daily cleanup to hardcore collectors who do periodic deep dives through thousands of PokÃ©mon.

## Key Features

**Presets** â€” Quick Clean (7-day, max exclusions), Normal Session (30-day, safe defaults), Deep Dive (all ages, minimal exclusions). One tap configures the entire tool.

**8 Filter Sections** â€” Core Keepers, Optional Exclusions, Gender-Dependent PokÃ©mon, Rare Form Variants, Rare & Regional-Form Species, Biome-Locked Species, Regional Exclusives, and Age Filter. All sections are collapsible with at-a-glance status pills.

**Hierarchical Controls** â€” section-level all on/off, sub-group toggles (e.g., regionals grouped by generation), and individual PokÃ©mon toggles. Each item shows its PokÃ©dex number and a brief note explaining why it's worth keeping.

**Live Character Counter** â€” real-time count with yellow/red warnings as the string approaches the ~500 character in-game limit.

**Copy-to-Clipboard** â€” tap the output area to copy the full string, paste directly into PokÃ©mon GO.

## Technical Approach

Single-page React application loaded via CDN (React + Babel) with no build step required. Hosted as static files on GitHub Pages. Fully client-side â€” no backend, no accounts, no data collection. Designed as mobile-web-first with touch-friendly toggle sizes and sticky output bar.

## Status & Next Steps

A working prototype exists with most filter categories implemented. Outstanding work includes adding the biome-locked species section, updating the gender-dependent list for newly released PokÃ©mon (Lechonk/Oinkologne), mobile layout optimization, and community testing to validate search string correctness in-game.
