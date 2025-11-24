# BlinkIt for Friends

A static React + TypeScript + Vite demo that blends a Blinkit-style quick-commerce catalog with Splitwise-style group ordering, bill splitting, and running tabs. Everything is frontend-only with in-memory state plus optional localStorage persistence for groups and tabs.

## Features
- Product catalog with search, category chips, and Blinkit-inspired cards.
- Solo cart mock plus primary CTA to start a "BlinkIt for Friends" group order.
- Groups management (create groups, start an order, jump to the ledger).
- Group order flow with per-member attribution, delivery fee, even vs proportional splits, countdown timer, and share link.
- Split review + simulated payment that generates tab entries.
- Group tab / ledger view with settle toggles and net balance calculation across unsettled tabs.

## Getting started
```bash
npm install
npm run dev
```
The app runs as a Vite SPA. Navigate to http://localhost:5173.

## Build
```bash
npm run build
```
Vercel setup: build command `npm run build`, output directory `dist`.

## Tech stack
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6

## State & persistence
- Hard-coded product catalog in `src/data/products.ts`.
- Groups and tabs persisted to `localStorage` under `blinkit_groups` and `blinkit_tabs`.
- Group orders kept in memory for the demo session.

## Project structure
- `src/pages`: Home, Groups, Group Order, Split Review, Tab views.
- `src/components`: Shared UI pieces like product list, cards, solo cart, and modals.
- `src/state`: Types, localStorage hook, state container, and split calculators.
