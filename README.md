# Twenty-Nine V3

V3 keeps the working GitHub Pages + Render architecture but replaces the prototype card logic with an authoritative multiplayer game engine.

## Frontend
Upload `index.html`, `style.css`, and `app.js` to your GitHub Pages repository.

## Backend
Deploy the `server/` folder to the same Render Web Service you used for V2, or create a new service from a GitHub repository containing:
- `server.js`
- `package.json`

Render:
- Build: `npm install`
- Start: `npm start`

## V3 rules implemented
- 32-card deck: 7, 8, 9, 10, J, Q, K, A in four suits
- Ranking: J > 9 > A > 10 > K > Q > 8 > 7
- Card points: J=3, 9=2, A=1, 10=1
- 4-card first deal
- Bidding from 16 through 28
- Highest bidder chooses trump
- Optional 7th-card peek variant from the supplied rules
- Second deal to 8 cards
- Follow-suit validation enforced on the server
- Trump beats a non-trump suit
- Trick winner calculated by the server
- 8 tricks
- Last trick +1
- Declaring team must meet bid
- Successful bid +1 game point
- Failed bid -1; failed 7th-card-peek hand -2
- First team to selected target (6/8/10) wins
- Dealer rotates each hand
- Live room chat
- Reconnect foundation

## Important rule note
Twenty-Nine has regional/house-rule variations. This build follows the rules you supplied. In particular, the 7th-card peek is treated as an optional reserved-card variant: if the bidder peeks, they must choose that card's suit as trump and a failed bid carries the double-loss penalty.

## Deployment
After Render gives you the server URL, set the first line of `app.js`:
`const SERVER_URL="https://YOUR-RENDER-SERVICE.onrender.com";`
Then commit/push the frontend to GitHub Pages.

## Testing
Use four separate browser sessions. Test:
1. create room
2. join with the code
3. start
4. bidding
5. trump
6. play legal/illegal cards
7. complete all 8 tricks
8. verify score and next hand
9. test chat
10. disconnect/reconnect one player
