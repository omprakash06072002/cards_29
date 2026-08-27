# Twenty-Nine V2 — Multiplayer Foundation

V2 adds Socket.IO room synchronization, private hands, server-side initial deal, bidding/trump/card events, and live room chat.

## Frontend
Upload the root files to GitHub Pages. The frontend defaults to `http://localhost:3000` for the realtime server.

## Backend
GitHub Pages cannot run Node.js. Deploy the `server/` folder to a Node-compatible host.

```bash
cd server
npm install
npm start
```

Then change `SERVER_URL` in `app.js` to your deployed server URL.

## Chat
The 💬 button opens room chat. Messages are broadcast to all players in the same room and limited to 160 characters.

## Important
This is the multiplayer foundation. The final authoritative 29 engine still needs complete follow-suit validation, trump/7th-card rules, trick winner calculation, 29-point hand scoring, six-point match scoring, reconnection safety, and anti-cheat validation.
