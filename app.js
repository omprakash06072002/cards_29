const state = {
  screen: "home",
  playerName: "Om",
  roomCode: "7K29Q",
  winningScore: 6,
  players: [],
  scoreA: 3,
  scoreB: 2,
  currentBid: 21,
  trump: "♠",
  hand: [
    ["J","♠"],["9","♠"],["A","♥"],["10","♥"],
    ["K","♦"],["Q","♦"],["8","♣"],["7","♣"]
  ],
  trick: [],
  history: ["Om bid 21","Rahul passed","Amit passed","Raj passed"],
  turn: true
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function showScreen(id){
  $$(".screen").forEach(x => x.classList.remove("active"));
  const target = $("#"+id);
  if(target) target.classList.add("active");
  state.screen=id;
  window.scrollTo(0,0);
}

function toast(message){
  const el=$("#toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove("show"),1800);
}

function randomCode(){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({length:5},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}

function renderLobby(){
  $("#lobbyCode").textContent=state.roomCode;
  $("#shareCode").textContent=state.roomCode;
  const players = state.players;
  $("#playerCount").textContent=`${players.length} / 4 players`;
  $("#playersGrid").innerHTML=players.map((p,i)=>`
    <div class="player-card">
      <div class="avatar">${p.name.charAt(0).toUpperCase()}</div>
      <div><strong>${escapeHtml(p.name)} ${i===0?"👑":""}</strong><small>Team ${i%2===0?"A":"B"}</small></div>
      <span class="status">● Connected</span>
    </div>`).join("");
  $("#startGame").disabled=players.length<4;
  $("#startGame").style.opacity=players.length<4?".45":"1";
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function renderHand(){
  const el=$("#hand");
  el.innerHTML=state.hand.map((card,i)=>{
    const [rank,suit]=card;
    const red=["♥","♦"].includes(suit);
    return `<button class="playing-card playable ${red?"red":""}" data-index="${i}">
      <span class="rank">${rank}</span><span class="suit">${suit}</span><span class="mini-rank">${rank}${suit}</span>
    </button>`;
  }).join("");
  $$(".playing-card").forEach(btn=>btn.addEventListener("click",()=>playCard(Number(btn.dataset.index))));
}

function playCard(index){
  if(!state.turn) return toast("Wait for your turn.");
  const card=state.hand.splice(index,1)[0];
  state.trick.push(card);
  state.turn=false;
  state.history.unshift(`${state.playerName} played ${card[0]}${card[1]}`);
  renderHand(); renderTrick(); renderHistory();
  $("#turnPill").textContent="WAITING FOR PLAYERS";
  $("#handHint").textContent="Waiting for the next trick…";
  setTimeout(simulateOpponents,700);
}

function simulateOpponents(){
  const suits=["♠","♥","♦","♣"], ranks=["7","8","Q","K","10","A","9","J"];
  while(state.trick.length<4){
    const suit=suits[Math.floor(Math.random()*4)], rank=ranks[Math.floor(Math.random()*ranks.length)];
    state.trick.push([rank,suit]);
  }
  renderTrick();
  state.history.unshift("Trick completed — Team A won");
  renderHistory();
  setTimeout(()=>{
    state.trick=[];
    state.turn=true;
    renderTrick();
    $("#turnPill").textContent="YOUR TURN";
    $("#handHint").textContent="Choose a card to play";
    $("#roundText").textContent=`Round 1 · Trick ${Math.min(8, Number($("#roundText").textContent.match(/Trick (\\d+)/)?.[1]||1)+1)} / 8`;
  },1100);
}

function renderTrick(){
  $("#trickCards").innerHTML=state.trick.length?state.trick.map(([r,s])=>{
    const red=["♥","♦"].includes(s);
    return `<div class="trick-card ${red?"red":""}">${r}${s}</div>`;
  }).join(""):`<div class="empty-trick">Waiting for cards</div>`;
}

function renderHistory(){
  $("#history").innerHTML=state.history.slice(0,12).map(x=>`<p>${escapeHtml(x)}</p>`).join("");
}

function openBidModal(){
  const current=state.currentBid;
  $("#modalCurrentBid").textContent=current;
  $("#bidGrid").innerHTML=Array.from({length:28-current},(_,i)=>current+i+1)
    .map(n=>`<button data-bid="${n}">${n}</button>`).join("");
  $$("#bidGrid button").forEach(b=>b.onclick=()=>{
    state.currentBid=Number(b.dataset.bid);
    state.history.unshift(`${state.playerName} bid ${state.currentBid}`);
    $("#currentBid").textContent=state.currentBid;
    $("#bidModal").classList.add("hidden");
    $("#trumpModal").classList.remove("hidden");
  });
  $("#bidModal").classList.remove("hidden");
}

$$("[data-screen]").forEach(btn=>btn.addEventListener("click",()=>showScreen(btn.dataset.screen)));
$("#createBtn").onclick=()=>showScreen("create");
$("#joinBtn").onclick=()=>showScreen("join");

$("#confirmCreate").onclick=()=>{
  const name=$("#createName").value.trim()||"Player";
  state.playerName=name; state.roomCode=randomCode(); state.winningScore=Number($("#winningScore").value);
  state.players=[{name,host:true},{name:"Waiting…",waiting:true},{name:"Waiting…",waiting:true},{name:"Waiting…",waiting:true}];
  renderLobby(); showScreen("lobby");
  toast("Room created. Share the code!");
};

$("#confirmJoin").onclick=()=>{
  const name=$("#joinName").value.trim()||"Player";
  const code=$("#roomCode").value.trim().toUpperCase();
  if(code.length<5) return toast("Enter a valid room code.");
  state.playerName=name; state.roomCode=code;
  state.players=[{name:"Host",host:true},{name},{name:"Player 3"},{name:"Player 4"}];
  renderLobby(); showScreen("lobby"); toast("Joined room (prototype mode).");
};

$("#copyCode").onclick=async()=>{
  try{await navigator.clipboard.writeText(state.roomCode);toast("Room code copied!");}
  catch{toast(`Room code: ${state.roomCode}`);}
};
$("#shareBtn").onclick=async()=>{
  const text=`Join my Twenty-Nine room: ${state.roomCode}`;
  if(navigator.share){try{await navigator.share({title:"Twenty-Nine",text})}catch{}}
  else {try{await navigator.clipboard.writeText(text);toast("Invite copied!")}catch{toast(text)}}
};

$("#startGame").onclick=()=>{
  if(state.players.length<4) return toast("Need 4 players to start.");
  // Replace waiting placeholders with sample names for the visual prototype.
  state.players=state.players.map((p,i)=>p.waiting?{name:["Rahul","Amit","Raj"][i-1]||"Player"}:p);
  $("#p1Name").textContent=state.players[2]?.name||"Amit";
  $("#p2Name").textContent=state.players[1]?.name||"Rahul";
  $("#p3Name").textContent=state.players[3]?.name||"Raj";
  renderHand(); renderTrick(); renderHistory(); showScreen("game");
  setTimeout(openBidModal,500);
};

$("#infoBtn").onclick=()=>$("#gameDrawer").classList.add("open");
$("#closeInfo").onclick=()=>$("#gameDrawer").classList.remove("open");
$("#leaveGame").onclick=()=>showScreen("home");
$$("[data-close]").forEach(x=>x.onclick=()=>$("#"+x.dataset.close).classList.add("hidden"));
$("#passBid").onclick=()=>{
  state.history.unshift(`${state.playerName} passed`);
  $("#bidModal").classList.add("hidden");
  $("#trumpModal").classList.remove("hidden");
};
$$(".suit-btn").forEach(x=>x.onclick=()=>{
  state.trump=x.dataset.suit;
  $("#trumpText").textContent=`TRUMP — ${state.trump}`;
  state.history.unshift(`Trump selected: ${state.trump}`);
  $("#trumpModal").classList.add("hidden");
  toast(`Trump selected: ${state.trump}`);
  renderHistory();
});

renderHand();
renderTrick();
renderHistory();
