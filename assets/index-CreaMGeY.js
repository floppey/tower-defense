var N=Object.defineProperty;var q=h=>{throw TypeError(h)};var G=(h,a,t)=>a in h?N(h,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[a]=t;var o=(h,a,t)=>G(h,typeof a!="symbol"?a+"":a,t),D=(h,a,t)=>a.has(h)||q("Cannot "+t);var g=(h,a,t)=>(D(h,a,"read from private field"),t?t.call(h):a.get(h)),m=(h,a,t)=>a.has(h)?q("Cannot add the same private member more than once"):a instanceof WeakSet?a.add(h):a.set(h,t),u=(h,a,t,s)=>(D(h,a,"write to private field"),s?s.call(h,t):a.set(h,t),t);(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();const e="?",A="start",y="end",I="tower",W=(h,a)=>Math.sqrt(Math.pow(h.x-a.x,2)+Math.pow(h.y-a.y,2));var E;class z{constructor(){m(this,E);u(this,E,Math.floor(Math.random()*1e7))}get id(){return g(this,E)}}E=new WeakMap;var b;class T extends z{constructor({game:t,health:s,speed:i,damage:n,reward:r}){super();o(this,"game");o(this,"health");o(this,"maxHealth");o(this,"speed");m(this,b);o(this,"gridPosition");o(this,"nextPosition");o(this,"distance");o(this,"damage");o(this,"lastUpdateTime",Date.now());o(this,"direction");o(this,"reward");o(this,"debuffs",[]);o(this,"monsterSize");this.game=t,this.health=s,this.maxHealth=s,this.speed=i,u(this,b,i),this.distance=0,this.gridPosition=this.game.level.mapMatrix.getPathPosition(0),this.nextPosition=this.game.level.mapMatrix.getPathPosition(.5),this.direction=this.getDirection(this.nextPosition),this.damage=n,this.reward=r,this.monsterSize=this.game.squareSize/4}getDirection(t){return this.gridPosition?t.col>this.gridPosition.col?"right":t.col<this.gridPosition.col?"left":t.row>this.gridPosition.row?"down":t.row<this.gridPosition.row?"up":"none":"none"}addDebuff(t){this.debuffs.push({...t,duration:Date.now()+t.duration})}applyDebuffs(){const t=Date.now();let s=g(this,b);this.debuffs=this.debuffs.filter(n=>!(t>n.duration));let i=!1;this.debuffs.forEach(n=>{if(n.type==="freeze")s/=2;else if(n.type==="poison"&&!i){i=!0;const r=t-this.lastUpdateTime,l=Math.min(this.maxHealth*.05,1e3),c=r/this.game.gameSpeed*l;this.takeDamage(c)}}),this.speed=Math.max(s,g(this,b)/5)}update(){this.applyDebuffs();const t=Date.now(),i=(t-this.lastUpdateTime)/this.game.gameSpeed*this.speed,n=this.distance+i;Math.floor(n)>Math.floor(this.distance)&&(this.gridPosition=this.nextPosition,this.nextPosition=this.game.level.mapMatrix.getPathPosition(n)),this.nextPosition&&n%1>.5&&this.distance%1<=.5&&(this.direction=this.getDirection(this.nextPosition)),this.distance=n,this.lastUpdateTime=t}getCanvasPosition(){if(!this.gridPosition)return null;const{row:t,col:s}=this.gridPosition,i=this.distance%1,{squareSize:n}=this.game;let r=s*n,l=t*n;return this.direction==="up"?(r+=n/2-this.monsterSize/2,l+=n-i*n):this.direction==="down"?(r+=n/2-this.monsterSize/2,l+=i*n):this.direction==="left"?(r+=n-i*n,l+=n/2-this.monsterSize/2):this.direction==="right"?(r+=i*n,l+=n/2-this.monsterSize/2):this.direction==="none"&&(r+=n/2-this.monsterSize/2,l+=n/2-this.monsterSize/2),{x:r,y:l}}render(){const t=this.getCanvasPosition();if(!t)return;const{ctx:s}=this.game,{x:i,y:n}=t;s.fillStyle="black",s.fillRect(i,n,this.monsterSize,this.monsterSize),s.fillRect(i,n-10,this.monsterSize,5),this.debuffs.some(r=>r.type==="freeze")&&(s.fillStyle="rgba(0, 0, 255, 0.5)",s.fillRect(i,n,this.monsterSize,this.monsterSize)),this.debuffs.some(r=>r.type==="poison")&&(s.fillStyle="rgba(0, 255, 0, 0.5)",s.fillRect(i,n,this.monsterSize,this.monsterSize)),s.fillStyle="red",s.fillStyle="green",s.fillRect(i,n-10,this.monsterSize*this.health/this.maxHealth,5)}takeDamage(t){this.health-=t,this.health<0&&(this.health=0)}isAlive(){return this.health>0}}b=new WeakMap;class S extends z{constructor({game:t,speed:s,damage:i,target:n,position:r}){super();o(this,"game");o(this,"speed");o(this,"damage");o(this,"target");o(this,"position");o(this,"lastMoveTime");o(this,"angle");o(this,"height",10);o(this,"width",10);o(this,"images",["arrow"]);o(this,"splash",null);o(this,"debuffs",null);this.game=t,this.speed=s,this.damage=i,this.target=n,this.position=r,this.angle=0,this.lastMoveTime=Date.now()}impact(){var s;const t=this.target;t instanceof T&&(t.takeDamage(this.damage),(s=this.debuffs)==null||s.forEach(i=>{t.addDebuff(i)})),this.splash&&this.game.level.monsters.forEach(i=>{var l;if(t instanceof T&&i.id===t.id)return;const n=i.getCanvasPosition();if(!n)return;W(this.position,n)<=this.splash*this.game.squareSize&&(i.takeDamage(this.damage),(l=this.debuffs)==null||l.forEach(c=>{i.addDebuff(c)}))}),this.game.projectiles=this.game.projectiles.filter(i=>i.id!==this.id)}getImage(){const t=this.images.length,s=Math.floor(Date.now()/this.game.gameSpeed%t),i=this.images[s];return this.game.images[i]}update(){const t=Date.now(),s=t-this.lastMoveTime,i=s/this.game.gameSpeed;this.speed=this.speed*(1+1*i);const n=s/this.game.gameSpeed*this.speed;let r;this.target instanceof T?r=this.target.getCanvasPosition():r=this.game.convertGridPositionToCoordinates(this.target);const l=Math.sqrt(Math.pow(r.x-this.position.x,2)+Math.pow(r.y-this.position.y,2));if(n>l){this.position=r,this.lastMoveTime=t,this.impact();return}const c=Math.atan2(r.y-this.position.y,r.x-this.position.x),d=Math.cos(c)*n,x=Math.sin(c)*n;this.angle=c+Math.PI,this.position={x:this.position.x+d,y:this.position.y+x},this.lastMoveTime=t}render(){const{ctx:t}=this.game;t.save(),t.translate(this.position.x,this.position.y),t.rotate(this.angle);try{t.drawImage(this.getImage(),-this.width/2,-this.height/2,this.width,this.height)}catch(s){console.log(s),this.game.debug&&alert(`Error rendering projectile ${this.getImage().src}: ${s}`)}t.restore()}}class O extends S{constructor({game:t,target:s,position:i,damage:n,speed:r}){super({game:t,speed:r,damage:n,target:s,position:i});o(this,"height",10);o(this,"width",25)}}class v extends z{constructor(t,s){super();o(this,"game");o(this,"gridPosition");o(this,"range",4);o(this,"damage",25);o(this,"attackSpeed",1);o(this,"lastAttackTime",Date.now());o(this,"placed",!1);o(this,"type","basic");o(this,"multiTarget",!1);this.game=t,this.gridPosition=s}getImage(){let t=[this.game.images[`tower-${this.type}`]];this.type==="lightning"&&(t=[this.game.images[`tower-${this.type}`],this.game.images[`tower-${this.type}-2`]]);const s=t.length,i=Math.floor(Date.now()/this.game.gameSpeed%s);return t[i]}render(){const{squareSize:t}=this.game,{col:s,row:i}=this.gridPosition,n=s*t,r=i*t,l=this.getImage();try{this.game.ctx.drawImage(l,n,r,t,t)}catch(c){console.error(c),this.game.debug&&alert(`Error rendering tower ${l}: ${c}`)}}update(){this.attack()}monsterIsValidTarget(t){if(!t.gridPosition||!t.isAlive())return!1;const{col:s,row:i}=this.gridPosition,n=t.gridPosition.col,r=t.gridPosition.row,l=Math.sqrt(Math.pow(n-s,2)+Math.pow(r-i,2));return Math.abs(l)<=this.range}getTargetInRange(){return this.getTargetsInRange()[0]}getTargetsInRange(){const{monsters:t}=this.game.level;return t.filter(s=>this.monsterIsValidTarget(s))??[]}canAttack(){return Date.now()-this.lastAttackTime>this.game.gameSpeed/this.attackSpeed}attack(){const t=Date.now();if(this.canAttack()){const s=this.getTargetInRange();s&&(this.game.projectiles.push(new O({game:this.game,target:s,position:this.game.convertGridPositionToCoordinates(this.gridPosition),damage:this.damage,speed:this.game.gameSpeed/4})),this.lastAttackTime=t+(this.attackSpeed*(Math.random()*.025)-.0125)*this.game.gameSpeed)}}}class F extends v{constructor(){super(...arguments);o(this,"range",5);o(this,"damage",25);o(this,"attackSpeed",2);o(this,"type","arrow")}attack(){const t=Date.now();if(this.canAttack()){const s=this.getTargetInRange();s&&(this.game.projectiles.push(new O({game:this.game,target:s,position:this.game.convertGridPositionToCoordinates(this.gridPosition),damage:this.damage,speed:this.game.gameSpeed/2})),this.lastAttackTime=t)}}}class _ extends S{constructor({game:t,target:s,position:i,damage:n}){super({game:t,speed:t.gameSpeed/10,damage:n,target:s,position:i});o(this,"height",10);o(this,"width",25);o(this,"splash",1.5);o(this,"images",["bullet-1","bullet-2","bullet-3","bullet-4"])}}class K extends v{constructor(){super(...arguments);o(this,"range",5);o(this,"damage",125);o(this,"attackSpeed",.75);o(this,"type","cannon")}attack(){const t=Date.now();if(this.canAttack()){const s=this.getTargetInRange();s!=null&&s.gridPosition&&(this.game.projectiles.push(new _({game:this.game,target:s.gridPosition,position:this.game.convertGridPositionToCoordinates(this.gridPosition),damage:this.damage})),this.lastAttackTime=t)}}}class V extends S{constructor({game:t,target:s,position:i,damage:n}){super({game:t,speed:t.gameSpeed/2,damage:n,target:s,position:i});o(this,"height",10);o(this,"width",25);o(this,"splash",.75);o(this,"images",["fire-1","fire-2"])}}class X extends v{constructor(){super(...arguments);o(this,"range",5);o(this,"damage",500);o(this,"attackSpeed",2.5);o(this,"type","fire")}attack(){const t=Date.now();if(this.canAttack()){const s=this.getTargetInRange();s!=null&&s.gridPosition&&(this.game.projectiles.push(new V({game:this.game,target:s,position:this.game.convertGridPositionToCoordinates(this.gridPosition),damage:this.damage})),this.lastAttackTime=t)}}}const $={freeze:"freeze",poison:"poison"};class Y extends S{constructor({game:t,target:s,position:i,damage:n}){super({game:t,speed:t.gameSpeed/3,damage:n,target:s,position:i});o(this,"height",25);o(this,"width",25);o(this,"splash",1);o(this,"images",["frost-1","frost-2","frost-3","frost-4","frost-5","frost-6","frost-7","frost-8","frost-9","frost-10","frost-11","frost-12","frost-13"]);o(this,"debuffs",[{type:$.freeze,duration:this.game.gameSpeed*2}])}}class J extends v{constructor(){super(...arguments);o(this,"range",5);o(this,"damage",50);o(this,"attackSpeed",1.5);o(this,"type","ice")}attack(){const t=Date.now();if(this.canAttack()){const s=this.getTargetInRange();s!=null&&s.gridPosition&&(this.game.projectiles.push(new Y({game:this.game,target:s,position:this.game.convertGridPositionToCoordinates(this.gridPosition),damage:this.damage})),this.lastAttackTime=t)}}}class Q extends S{constructor({game:t,target:s,position:i,damage:n}){super({game:t,speed:t.gameSpeed*1.5,damage:n,target:s,position:i});o(this,"height",15);o(this,"width",30);o(this,"previousTargets",[]);o(this,"images",["lightning-1","lightning-2"]);this.previousTargets.push(s.id)}impact(){super.impact(),this.game.level.monsters.find(t=>!(this.target instanceof T)||this.previousTargets.includes(t.id)?!1:W(t.getCanvasPosition(),this.target.getCanvasPosition())<100?(this.previousTargets.push(t.id),this.target=t,this.game.projectiles.push(this),!0):!1)}}class Z extends v{constructor(){super(...arguments);o(this,"range",5);o(this,"damage",125);o(this,"attackSpeed",2);o(this,"type","lightning")}attack(){const t=Date.now();if(this.canAttack()){const s=this.getTargetInRange();s!=null&&s.gridPosition&&(this.game.projectiles.push(new Q({game:this.game,target:s,position:this.game.convertGridPositionToCoordinates(this.gridPosition),damage:this.damage})),this.lastAttackTime=t)}}}class ee extends S{constructor({game:t,target:s,position:i,damage:n}){super({game:t,speed:t.gameSpeed/10*8,damage:n,target:s,position:i});o(this,"height",12);o(this,"width",20);o(this,"images",["crystal"])}}class te extends v{constructor(){super(...arguments);o(this,"range",10);o(this,"damage",2500);o(this,"attackSpeed",7.5);o(this,"type","mage")}attack(){const t=Date.now();if(this.canAttack()){const s=this.getTargetInRange();s!=null&&s.gridPosition&&(this.game.projectiles.push(new ee({game:this.game,target:s,position:this.game.convertGridPositionToCoordinates(this.gridPosition),damage:this.damage})),this.lastAttackTime=t)}}}class se extends S{constructor({game:t,target:s,position:i,damage:n}){super({game:t,speed:t.gameSpeed/5,damage:n,target:s,position:i});o(this,"height",25);o(this,"width",25);o(this,"images",["poison-1","poison-2","poison-3","poison-4","poison-5","poison-6","poison-7","poison-8"]);o(this,"debuffs",[{type:$.poison,duration:this.game.gameSpeed*10}])}}class ie extends v{constructor(){super(...arguments);o(this,"range",2);o(this,"damage",0);o(this,"attackSpeed",1);o(this,"type","poison");o(this,"multiTarget",!0)}attack(){const t=Date.now();this.canAttack()&&this.getTargetsInRange().forEach(i=>{i!=null&&i.gridPosition&&(this.game.projectiles.push(new se({game:this.game,target:i,position:this.game.convertGridPositionToCoordinates(this.gridPosition),damage:this.damage})),this.lastAttackTime=t)})}}const w={basic:50,arrow:100,cannon:200,fire:1e3,ice:450,mage:7500,lightning:2e3,poison:750},ae={basic:"basic",arrow:"arrow",cannon:"cannon",fire:"fire",ice:"ice",mage:"mage",lightning:"lightning",poison:"poison"},j={basic:v,arrow:F,cannon:K,mage:te,ice:J,fire:X,lightning:Z,poison:ie};class oe{constructor(a){o(this,"game");o(this,"mousePosition");this.game=a,this.mousePosition={x:0,y:0},this.init()}getCellAtMousePosition(){const{x:a,y:t}=this.mousePosition,{squareSize:s}=this.game,i=Math.floor(a/s);return{row:Math.floor(t/s),col:i}}init(){this.game.canvas.addEventListener("mousemove",a=>{const t=this.game.canvas.getBoundingClientRect();this.mousePosition={x:a.clientX-t.left,y:a.clientY-t.top},this.game.hoveredCell=this.getCellAtMousePosition()}),this.game.canvas.addEventListener("click",()=>{this.handleClick()}),this.game.canvas.addEventListener("contextmenu",a=>{this.handleContextMenu(a)})}handleClick(){const a=this.getCellAtMousePosition();this.game.newTower&&this.game.level.mapMatrix.matrix[a.col][a.row]===e&&this.game.money>=w[this.game.newTower]&&(this.game.level.mapMatrix.matrix[a.col][a.row]=I,this.game.level.towers.push(new j[this.game.newTower](this.game,a)),this.game.money-=w[this.game.newTower],this.game.money<w[this.game.newTower]&&(this.game.newTower=null))}handleContextMenu(a){a.preventDefault();const t=this.getCellAtMousePosition();if(this.game.newTower)this.game.newTower=null;else if(this.game.level.mapMatrix.matrix[t.col][t.row]===I){const s=this.game.level.towers.find(i=>i.gridPosition.col===t.col&&i.gridPosition.row===t.row);s&&(this.game.paused=!0,confirm(`Sell for ${w[s.type]/2} coins?`)&&(this.game.money+=w[s.type]/2,this.game.level.towers=this.game.level.towers.filter(i=>i.id!==s.id),this.game.level.mapMatrix.matrix[t.col][t.row]=e),this.game.paused=!1)}}}const ne=[[e,A,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e],[e,[1],e,[68],[67],[66],[65],[64],[63],[62],[61],[60],[59],[58],[57],[56],[55],[53],[52],e],[e,[2],e,[69],e,e,e,e,e,e,e,e,e,e,e,e,e,e,[51],e],[e,[3],e,[70],e,[120],[119],[118],[117],[116],[115],[114],[113],[112],[111],[110],[109],e,[50],e],[e,[4],e,[71],e,[121],e,e,e,e,e,e,e,e,e,e,[108],e,[49],e],[e,[5],e,[72],e,[122],e,[156],[155],[154],[153],[152],[151],[150],[149],e,[107],e,[48],e],[e,[6],e,[73],e,[123],e,[157],e,e,e,e,e,e,[148],e,[106],e,[47],e],[e,[7],e,[74],e,[124],e,[158],e,[176],[175],[174],[173],e,[147],e,[105],e,[46],e],[e,[8],e,[75],e,[125],e,[159],e,[177],y,[183],[172],e,[146],e,[104],e,[45],e],[e,[9],e,[76],e,[126],e,[160],e,[178],[181],[182],[171],e,[145],e,[103],e,[44],e],[e,[10],e,[77],e,[127],e,[161],e,[179],[180],e,[170],e,[144],e,[102],e,[43],e],[e,[11],e,[78],e,[128],e,[162],e,e,e,e,[169],e,[143],e,[101],e,[42],e],[e,[12],e,[79],e,[129],e,[163],[164],[165],[166],[167],[168],e,[142],e,[100],e,[41],e],[e,[13],e,[80],e,[130],e,e,e,e,e,e,e,e,[141],e,[99],e,[40],e],[e,[14],e,[81],e,[131],[132],[133],[134],[135],[136],[137],[138],[139],[140],e,[98],e,[39],e],[e,[15],e,[82],e,e,e,e,e,e,e,e,e,e,e,e,[97],e,[38],e],[e,[16],e,[83],[84],[85],[86],[87],[88],[89],[90],[91],[92],[93],[94],[95],[96],e,[37],e],[e,[17],e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,[36],e],[e,[18],[19],[20],[21],[22],[23],[24],[25],[26],[27],[28],[29],[30],[31],[32],[33],[34],[35],e],[e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e,e]],re=h=>{const a=document.createElement("div");a.id="toolbar-top";const t=document.createElement("button");t.id="start-wave",t.innerHTML="Start Wave",t.addEventListener("click",()=>{h.startWave()}),a.innerHTML=`
    <div class="toolbar-item">
      <span>🪙: </span>
      <span id="money" class="money">${h.money.toLocaleString("en-US")}</span>
    </div>
    <div class="toolbar-item">
      <span>❤️: </span>
      <span id="health">10</span>
    </div>
    <div class="toolbar-item">
      <span>🌊: </span>
      <span id="wave">0</span>
    </div>
    <div class="toolbar-item">
      <span>👿: </span>
      <span id="monsters">0</span>
    </div>
     <div class="toolbar-item">
      <span>💀: </span>
      <span id="kills">0</span>
    </div>
  `,a.appendChild(t);const s=document.createElement("label");s.innerHTML=`
    <input type="checkbox" id="automode" />
    <span>Auto mode</span>
  `,a.appendChild(s);const i=document.createElement("span");i.innerHTML="Speed: ",a.appendChild(i),[.25,.5,1,2,5].forEach(c=>{const d=document.createElement("button");d.innerHTML=`x${c}`,d.addEventListener("click",()=>{h.gameSpeed=1e3/c}),a.appendChild(d)}),document.body.insertBefore(a,document.body.firstChild);const n=document.createElement("div");n.id="toolbar-bottom",Object.values(ae).sort((c,d)=>w[c]-w[d]).forEach(c=>{const d=document.createElement("button");d.innerHTML=`
    <img src="assets/tower-${c}.png" alt="${c} tower" />
    <span>${c} tower - <span class="price">${w[c].toLocaleString("en-US")}🪙</span></span>
    `,d.addEventListener("click",()=>{h.newTower=c}),n.appendChild(d)}),document.body.appendChild(n);const r=document.createElement("div");r.id="info-panel",r.innerHTML=`
  <details>
  <summary>How to play</summary>
  <h2>Goal</h2>
  <p>Defend your base from waves of monsters by building towers. The monsters move from the blue square(s) to the red square(s)</p>
  <h2>Adding towers</h2>
  <p>
    Use the toolbar at the bottom to select a tower type. Click on an empty square on the map to add a tower.
  </p>
  <h2>Selling towers</h2>
  <p>
    Right-click on a tower to sell it for half the price.
  </p>
  <h2>Starting a wave</h2>
  <p>
    Click the "Start Wave" button to start a new wave of monsters.
  </p>
  <h2>Auto mode</h2>
  <p>
    When auto mode is enabled, the game will automatically start new waves when the previous wave is defeated.
  </p>
  
  </details>
  
  `,document.body.appendChild(r);const l=document.createElement("div");l.id="upgrade-tower",l.innerHTML=`
  <h2>Upgrade Tower</h2>
`,l.style.display="none",["damage","range","speed"].forEach(c=>{const d=document.createElement("button");d.innerHTML=`${c}`,d.addEventListener("click",()=>{h.upgradeTower(c)}),l.appendChild(d)}),document.body.appendChild(l)},he=h=>{const a=document.getElementById("health");a&&(a.innerText=h.toLocaleString("en-US"))},le=h=>{const a=document.getElementById("kills");a&&(a.innerText=h.toLocaleString("en-US"))},ce=h=>{const a=document.getElementById("money");a&&(a.innerText=h.toLocaleString("en-US"))},R=h=>{const a=document.getElementById("monsters");a&&(a.innerText=h.toLocaleString("en-US"))};class de extends T{constructor({game:a,health:t,speed:s,damage:i,reward:n}){super({game:a,health:t,speed:s,damage:i,reward:n}),this.monsterSize=this.game.squareSize/2}render(){const a=this.getCanvasPosition();if(!a)return;const{ctx:t}=this.game,{x:s,y:i}=a;t.save(),t.fillStyle="red",t.fillRect(s,i,this.monsterSize,this.monsterSize),t.fillRect(s,i-10,this.monsterSize,5),this.debuffs.some(n=>n.type==="freeze")&&(t.fillStyle="rgba(0, 0, 255, 0.5)",t.fillRect(s,i,this.monsterSize,this.monsterSize)),this.debuffs.some(n=>n.type==="poison")&&(t.fillStyle="rgba(0, 255, 0, 0.5)",t.fillRect(s,i,this.monsterSize,this.monsterSize)),t.fillStyle="red",t.fillStyle="green",t.fillRect(s,i-10,this.monsterSize*this.health/this.maxHealth,5)}}const ge=h=>{const a=document.getElementById("wave");a&&(a.innerText=h.toLocaleString("en-US"))};class me extends z{constructor(t,s){super();o(this,"matrix");o(this,"level");o(this,"totalDistance",0);this.level=t,this.matrix={},s?(this.matrix=s,Object.values(s).forEach(i=>{Object.values(i).forEach(n=>{Array.isArray(n)&&(this.totalDistance=Math.max(...n,this.totalDistance))})})):this.generateMapMatrix()}initMatrix(){var i,n;const{gridWidth:t,gridHeight:s}=this.level.game;this.matrix=Array.from({length:t},()=>Array(s).fill(e)),(i=this.level.startPositions)==null||i.forEach(r=>{this.matrix[r.col][r.row]=[0]}),(n=this.level.endPositions)==null||n.forEach(r=>{this.matrix[r.col][r.row]=y})}generateMapMatrix(){var t;(t=this.level.startPositions)==null||t.forEach(s=>{let i=0;do this.initMatrix(),this.totalDistance=this.buildPath(s.col,s.row,1),i++;while((this.totalDistance<this.level.minLength||this.totalDistance>this.level.maxLength)&&i<100);i>=100&&console.log("Failed to generate path")})}buildPath(t,s,i){const n=this.getNeighbors(t,s);if(n.some(({row:d,col:x})=>this.getCell(x,d)===y))return i;const r=n.filter(({col:d,row:x})=>this.canBePath(d,x,i));if(r.length===0)return-1;const l=r[Math.floor(Math.random()*r.length)],c=this.matrix[l.col][l.row];return Array.isArray(c)?c.push(i):this.matrix[l.col][l.row]=[i],this.buildPath(l.col,l.row,i+1)}getNeighbors(t,s){const i=[];return t>0&&i.push({col:t-1,row:s}),t<this.level.game.gridWidth-1&&i.push({col:t+1,row:s}),s>0&&i.push({col:t,row:s-1}),s<this.level.game.gridHeight-1&&i.push({col:t,row:s+1}),i}getCell(t,s){return this.matrix[t][s]}canBePath(t,s,i){const n=this.getCell(t,s);return!(n!==e&&Array.isArray(n)===!1||Array.isArray(n)&&n.some(l=>l>i-10)||this.getNeighbors(t,s).filter(({col:l,row:c})=>{const d=this.getCell(l,c);return Array.isArray(d)?!!d.some(x=>x>i-10):!1}).length>1||Array.isArray(n)&&n.length>=this.level.maxRepeatSquares)}getPathPosition(t){const s=Math.ceil(t);let i=s<=0?this.level.startPositions[Math.floor(Math.random()*this.level.startPositions.length)]:this.level.endPositions[0];return Object.keys(this.matrix).forEach(n=>{const r=Number(n);Object.keys(this.matrix[r]).forEach(l=>{const c=Number(l),d=this.matrix[r][c];if(Array.isArray(d)&&d.includes(s)){i={row:c,col:r};return}})}),i}}var P;class H extends z{constructor({game:t,startPositions:s,endPositions:i,minLength:n,maxLength:r,maxRepeatSquares:l,map:c}){super();o(this,"game");o(this,"startPositions");o(this,"endPositions");o(this,"mapMatrix");o(this,"minLength");o(this,"maxLength");o(this,"maxRepeatSquares");o(this,"towers",[]);o(this,"monsters",[]);m(this,P,0);this.game=t,this.startPositions=s,this.endPositions=i,this.minLength=n,this.maxLength=r,this.maxRepeatSquares=l,this.mapMatrix=new me(this,c)}get wave(){return g(this,P)}set wave(t){u(this,P,t),ge(g(this,P))}}P=new WeakMap;var p,M,C,f,k;class ue{constructor(){m(this,p,10);m(this,M,100);m(this,C,0);o(this,"debug",!1);o(this,"canvas");o(this,"ctx");o(this,"squareSize",50);o(this,"gridWidth",25);o(this,"gridHeight",25);o(this,"level");o(this,"mouseHandler");o(this,"hoveredCell",null);o(this,"images",{});o(this,"tempCounter",-1);o(this,"projectiles",[]);m(this,f,null);m(this,k,!1);o(this,"gameSpeed",1e3);this.canvas=document.createElement("canvas");const a=this.canvas.getContext("2d");if(!a)throw new Error("2d context not supported");this.ctx=a,Math.random()>.5?(this.gridHeight=20,this.gridWidth=20,this.level=new H({game:this,endPositions:[{col:8,row:10}],startPositions:[{col:0,row:1}],maxLength:200,maxRepeatSquares:1,minLength:100,map:ne})):this.level=new H({game:this,endPositions:[{col:Math.floor(Math.random()*this.gridHeight/2),row:Math.floor(Math.random()*this.gridWidth/2)}],startPositions:[{col:Math.floor((Math.random()+.5)*this.gridHeight/2),row:Math.floor((Math.random()+.5)*this.gridWidth/2)}],maxLength:250,maxRepeatSquares:3,minLength:100}),this.canvas.width=this.squareSize*this.gridWidth,this.canvas.height=this.squareSize*this.gridHeight,document.body.appendChild(this.canvas),this.mouseHandler=new oe(this),this.loadImages(),new URLSearchParams(window.location.search).has("debug")&&(this.debug=!0,this.money=1e4),re(this)}getNumberOfMonstersPerWave(){return this.isBossWave()?1:20+(this.level.wave-1)*2}isBossWave(){return this.level.wave%10===0}startWave(){g(this,p)<=0||this.tempCounter<this.getNumberOfMonstersPerWave()&&this.tempCounter!==-1||(this.level.wave++,this.tempCounter=0,console.log(`Starting ${this.isBossWave()?"boss wave":"wave"} ${this.level.wave}. ${this.getNumberOfMonstersPerWave()} monsters with ${this.getHealth()} health and ${this.getSpeed()} speed`),this.spawnMonsters())}spawnMonsters(){setTimeout(()=>{this.tempCounter<this.getNumberOfMonstersPerWave()&&(this.spawnMonster(),this.tempCounter++,this.spawnMonsters())},this.gameSpeed/2/this.getSpeed())}getSpeed(){let a=1;return this.level.wave>2&&(a+=(this.level.wave-2)*.4),Math.min(a,15)}getHealth(){let a=100;const t=15;let s=0;for(let i=0;i<this.level.wave;i+=2)s+=t*(i/1.75),s+=Math.pow(i,2);return this.isBossWave()&&(s*=15),Math.floor(a+s)}getReward(){return this.isBossWave()?Math.floor(1e3*(this.level.wave/10)):10+Math.floor(this.level.wave/2)}spawnMonster(){const a=this.isBossWave()?de:T;this.level.monsters.push(new a({game:this,health:this.getHealth(),speed:this.getSpeed(),damage:this.isBossWave()?5:1,reward:this.getReward()})),R(this.level.monsters.length)}loadImages(){["tower-basic","tower-arrow","tower-cannon","tower-mage","tower-ice","tower-fire","tower-lightning","tower-lightning-2","tower-poison","arrow","bullet-1","bullet-2","bullet-3","bullet-4","fire-1","fire-2","frost-1","frost-2","frost-3","frost-4","frost-5","frost-6","frost-7","frost-8","frost-9","frost-10","frost-11","frost-12","frost-13","crystal","poison-1","poison-2","poison-3","poison-4","poison-5","poison-6","poison-7","poison-8","lightning-1","lightning-2"].forEach(t=>{const s=new Image;s.src=`./assets/${t}.png`,this.images[t]=s})}update(){var s;if(g(this,k))return;const a=this.level.monsters.filter(i=>i.distance>=this.level.mapMatrix.totalDistance),t=this.level.monsters.filter(i=>!i.isAlive());t.forEach(i=>{this.money+=i.reward,this.killCount++}),this.level.monsters=this.level.monsters.filter(i=>i.isAlive()&&i.distance<this.level.mapMatrix.totalDistance).sort((i,n)=>n.distance-i.distance),a.forEach(i=>{console.log(`Monster reached the end, -${i.damage} health`),this.health-=i.damage}),this.level.monsters.forEach(i=>{i.update()}),this.level.towers.forEach(i=>{i.update()}),this.projectiles.forEach(i=>{i.update()}),g(this,p)<0&&confirm("Game Over! Play again?")&&window.location.reload(),(t.length>0||a.length>0)&&R(this.level.monsters.length),this.level.monsters.length===0&&(console.log(`Wave ${this.level.wave} completed!`),(s=document.getElementById("automode"))!=null&&s.checked&&this.startWave())}render(){try{this.drawGrid(),this.level.monsters.forEach(a=>{a.render()}),this.level.towers.forEach(a=>{a.render()}),this.projectiles.forEach(a=>{a.render()}),g(this,p)<=0&&(this.ctx.save(),this.ctx.fillStyle="red",this.ctx.font="30px Arial",this.ctx.textAlign="center",this.ctx.fillText("Game Over!",this.canvas.width/2,this.canvas.height/1.5),this.ctx.restore()),g(this,f)&&this.hoveredCell&&(this.ctx.save(),this.ctx.globalAlpha=.25,this.ctx.beginPath(),this.ctx.arc(this.hoveredCell.col*this.squareSize+this.squareSize/2,this.hoveredCell.row*this.squareSize+this.squareSize/2,g(this,f).range*this.squareSize,0,2*Math.PI),this.ctx.fillStyle="purple",this.ctx.globalAlpha=.5,g(this,f).gridPosition=this.hoveredCell,g(this,f).render(),this.ctx.fill(),this.ctx.restore())}catch(a){console.error(a),this.debug&&alert(`Error rendering game: ${a}`)}}drawGrid(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);const{matrix:a}=this.level.mapMatrix;Object.keys(a).forEach(t=>{const s=Number(t);Object.keys(a[s]).forEach(i=>{const n=Number(i),r=a[s][n];this.ctx.save(),typeof r=="string"?r===A?this.ctx.fillStyle="blue":r===y?this.ctx.fillStyle="rgba(255, 0, 0, 0.5)":r===e?this.ctx.fillStyle="green":this.ctx.fillStyle="green":Array.isArray(r)&&r.includes(0)?this.ctx.fillStyle="blue":Array.isArray(r)&&r.length>0&&(this.ctx.fillStyle="rgb(200, 200, 200)"),this.ctx.fillRect(s*this.squareSize,n*this.squareSize,this.squareSize,this.squareSize),this.debug&&(this.ctx.save(),this.ctx.fillStyle="black",this.ctx.font="12px Arial",Array.isArray(r)&&r.length>0?this.ctx.fillText(r.toString(),s*this.squareSize+5,n*this.squareSize+15):r===A?this.ctx.fillText(A,s*this.squareSize+5,n*this.squareSize+15):r===y&&this.ctx.fillText(y,s*this.squareSize+5,n*this.squareSize+15),this.ctx.font="10px Arial",this.ctx.fillText(`${s},${n}`,s*this.squareSize+20,n*this.squareSize+40),this.ctx.restore()),this.ctx.strokeStyle="lightgray",this.ctx.strokeRect(s*this.squareSize,n*this.squareSize,this.squareSize,this.squareSize),this.ctx.restore()})}),this.hoveredCell&&(this.ctx.save(),this.ctx.strokeStyle="gold",this.ctx.lineWidth=3,this.ctx.strokeRect(this.hoveredCell.col*this.squareSize,this.hoveredCell.row*this.squareSize,this.squareSize,this.squareSize),this.ctx.restore())}convertGridPositionToCoordinates(a){return{x:a.col*this.squareSize+this.squareSize/2,y:a.row*this.squareSize+this.squareSize/2}}upgradeTower(a){switch(a){case"damage":console.log("TODO: Implement damage upgrade");break;case"range":console.log("TODO: Implement range upgrade");break;case"speed":console.log("TODO: Implement speed upgrade");break}}get health(){return g(this,p)}set health(a){u(this,p,a),he(g(this,p))}get money(){return g(this,M)}set money(a){u(this,M,a),ce(g(this,M))}get killCount(){return g(this,C)}set killCount(a){u(this,C,a),le(g(this,C))}get newTower(){var a;return((a=g(this,f))==null?void 0:a.type)||null}set newTower(a){u(this,f,a?new j[a](this,this.hoveredCell):null)}get paused(){return g(this,k)}set paused(a){const t=Date.now();this.level.towers.forEach(s=>{s.lastAttackTime=t}),this.level.monsters.forEach(s=>{s.lastUpdateTime=t}),this.projectiles.forEach(s=>{s.lastMoveTime=t}),u(this,k,a)}}p=new WeakMap,M=new WeakMap,C=new WeakMap,f=new WeakMap,k=new WeakMap;const L=new ue,B=async()=>{L.render(),requestAnimationFrame(B)},U=async()=>{L.update(),L.health>=0&&requestAnimationFrame(U)};B();U();
