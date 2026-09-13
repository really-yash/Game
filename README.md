# ISLAND ZERO — 4-player browser game starter

A deployable starter for a polished 3D browser co-op prototype. Up to four human players can share a room; empty slots become AI teammates.

## Run locally
1. Install Node.js 20+.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Multiplayer
Create a room and share its 5-character code. Up to 4 humans can join. Remaining slots are filled by bots.

## Controls
PC: WASD move, mouse look, Shift sprint, F flashlight, E interact.
Mobile/tablet: left joystick, right-side swipe camera, RUN/flashlight/interact buttons.

## Deploy
This project includes a standard Node/Express server and Socket.IO. It can be deployed to a Node-compatible service such as Render. Set the service to run `npm start`; the app listens on `process.env.PORT`.

## Scope
This is a playable vertical-slice foundation, not a finished AAA game. It uses procedural placeholder geometry so it has no asset-license problems. Production upgrades should add optimized licensed 3D assets, authoritative gameplay/combat, persistence, matchmaking, anti-cheat, asset hosting/CDN, audio, and more advanced AI.
