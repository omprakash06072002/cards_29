# Twenty-Nine — Online Card Game Prototype

A mobile-first black, gold and dark-green UI prototype for a 4-player Twenty-Nine card game.

## Current version

This version is a **frontend prototype**. It includes:

- Home screen
- Create room
- Join room
- Room code generation
- 4-player lobby
- Game table
- 8-card hand
- Bidding UI
- Trump selection UI
- Trick display
- Team scores
- Game information/history
- Responsive mobile design

### Important

The room system is currently **prototype/local only**. It does not yet synchronize four different devices.

The next development stage should add a real-time backend using WebSockets/Socket.IO (or another realtime service), with the server acting as the authoritative game engine.

## Run locally

You can simply open `index.html` in a browser.

For GitHub Pages:

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md`.
3. Go to **Settings → Pages**.
4. Select the `main` branch and `/ (root)`.
5. Save.
6. Open the generated GitHub Pages URL.

## Rules used

The first agreed variation is used:

- 4 players, 2 teams of 2
- 32 cards
- J > 9 > A > 10 > K > Q > 8 > 7
- J = 3 points
- 9 = 2 points
- A = 1 point
- 10 = 1 point
- Bidding starts at 16 and ends at 28
- Follow suit whenever possible
- 8 tricks per hand
- First team to 6 game points wins

## Roadmap

1. Real multiplayer rooms
2. Server-authoritative game engine
3. Real deck/shuffle/deal
4. Complete bidding rules
5. Trump and 7th-card rule
6. Legal move validation
7. Trick winner calculation
8. Round scoring
9. Reconnection handling
10. Game history/statistics
11. Sound and animations
12. Production deployment
