 // Canvas
 let c = document.getElementById("canvas");
 let ctx = c.getContext('2d');
 c.width = window.innerWidth * 1.25;
 c.height = window.innerHeight * 1.25;

 c.style.width = window.innerWidth + "px";
 c.style.height = window.innerHeight + "px";

 // Components
 function lead(x, y, size, velocity){
   this.x = x;
   this.y = y;
   this.size = size;
   this.velocity = velocity;
 }

 // Init array of lead pieces
 let leadPieces = [];

 // Init click counter
 let clickCounter = document.getElementById('clickCounter')
 let cc = 0;
 
 // Mechanics
 const mechanics = {
  // Draw pen
  drawLeadPencil: () => {
    // Body
    ctx.beginPath();
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowColor = '#404040';
    ctx.rect(0, c.height/2, 200, 20);
    ctx.fillStyle = '#8B0000';
    ctx.fill();
    ctx.closePath();

    // Tip
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.moveTo(200, c.height/2);
    ctx.lineTo(200, c.height/2 + 20);
    ctx.lineTo(275, c.height/2 + 10);
    ctx.fillStyle = '#C0C0C0';
    ctx.fill();
    ctx.closePath();

    // Clip
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.rect(0, c.height/2-15, 30, 6);
    ctx.fill();
    ctx.closePath();

  },

  // Lead attributes
  START_POINT: 273,
  MIN_SIZE: 15,
  MAX_SIZE: 30,

  // Draw lead pieces
  drawLead: () => {
    for(let i = 0; i<leadPieces.length; i++){
      ctx.beginPath();
      ctx.rect(leadPieces[i].x, leadPieces[i].y, leadPieces[i].size, leadPieces[i].velocity);
      ctx.strokeStyle = "#404040";
      ctx.stroke();
      ctx.closePath();
    }
  },
  
  // Add lead
  addLead: () => {
    // Generate random size for lead
    let RANDOM_SIZE = Math.random() * (mechanics.MAX_SIZE - mechanics.MIN_SIZE) + mechanics.MIN_SIZE;
    let l = new lead(mechanics.START_POINT, c.height/2+10, RANDOM_SIZE, 0);
    mechanics.START_POINT += RANDOM_SIZE;
    leadPieces.push(l);
  },

  // Remove lead
  removeLead: (a) => {
    for(let i = 0; i<a; i++){
      mechanics.START_POINT -= leadPieces[leadPieces.length-1].size;     
      leadPieces.pop();
    }
  },

  /*
  IGNORE
  // Break off Animation
  breakOffAnimation: (leadPiece) => {
    let firstHalf = new lead(leadPiece.x, leadPiece.y, leadPiece.size/2, mechanics.randomVelocity());
    let secondHalf = new lead((leadPiece.x + leadPiece.size/2), leadPiece.y, leadPiece.size/2, mechanics.randomVelocity());
    firstHalf.y -= firstHalf.velocity;
    secondHalf.y -= secondHalf.velocity;
  }, 
  */

  // Flag for reaching the end of the window
  END_REACHED: false,

  // Condition for game to be over
  GAME_OVER: () => {
    return mechanics.MIN_SIZE === 0 && mechanics.MAX_SIZE === 0
  },

  // Audio sound effects
  CLICK_SOUND_EFFECT: new Audio('click.mp3'),
  BREAK_SOUND_EFFECT: new Audio('break.mp3'),

  // method to push lead
  pushLead: () => {
    if(mechanics.START_POINT >= c.width){ 
      mechanics.END_REACHED = true;
      if(mechanics.END_REACHED){
        mechanics.BREAK_SOUND_EFFECT.play();
        let randomBreakPoint = Math.random() * (leadPieces.length - 1) + 1;
        mechanics.removeLead(randomBreakPoint);
        mechanics.END_REACHED = false;
        if(mechanics.MAX_SIZE  > 1){ mechanics.MAX_SIZE -= 5; }
        if(mechanics.MIN_SIZE > 1 ){ mechanics.MIN_SIZE -= 5; }
        if(mechanics.GAME_OVER()){
          let gameOverMessage = document.getElementById('gameOverMessage');
          gameOverMessage.textContent = "YOU ARE OUT OF LEAD :( Press 'R' to restart";
        }
      }
    } 
    else {
      if(!mechanics.END_REACHED && !mechanics.GAME_OVER()){
        mechanics.CLICK_SOUND_EFFECT.play();
        mechanics.addLead();
        clickCounter.textContent = '';
        clickCounter.textContent = "Lead Clicked: " + cc;
        cc++;
      }  
    }
  },
}

 c.req = requestAnimationFrame(loop);
 function loop(){
   ctx.clearRect(0,0, c.width, c.height);
   mechanics.drawLeadPencil();
   mechanics.drawLead();
   body.onclick = () => {
     mechanics.pushLead();
  }
   c.req = requestAnimationFrame(loop);
 }