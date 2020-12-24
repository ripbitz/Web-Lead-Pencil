// Canvas
let c = document.getElementById("canvas");
let ctx = c.getContext('2d');

// Lead component
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

 // Init total
 let totalAmountOfLead = 0;

 // Flag for auto mode
 let AUTO_MODE = false;

 // FLag for endless mode
 let ENDLESS_MODE = false;
 
 // Mechanics
const mechanics = {
  // Draw pen
  drawLeadPencil: () => {
    // Body
    ctx.beginPath();
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
    ctx.rect(0, c.height/2-12, 30, 6);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.rect(0, c.height/2-12, 5, 12);
    ctx.fill();
    ctx.closePath();
  },

  // Lead attributes
  START_POINT: 270,
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

  // Add lead piece
  addLead: () => {
    let RANDOM_SIZE = Math.random() * (mechanics.MAX_SIZE - mechanics.MIN_SIZE) + mechanics.MIN_SIZE;
    let l = new lead(mechanics.START_POINT, c.height/2+10, RANDOM_SIZE, 0);
    mechanics.START_POINT += RANDOM_SIZE;
    leadPieces.push(l);
    totalAmountOfLead += RANDOM_SIZE;
  },

  // Remove lead
  removeLead: (numOfPieces) => {
    for(let i = 0; i<numOfPieces; i++){
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

  // Checking if there is no more lead
  NO_MORE_LEAD: () => {
    return mechanics.MIN_SIZE === 0 && mechanics.MAX_SIZE === 0
  },

  // Audio sound effect files
  CLICK_SOUND_EFFECT: new Audio('click.mp3'),
  BREAK_SOUND_EFFECT: new Audio('break.mp3'),

  // Method to push lead
  pushLead: () => {
    if(mechanics.START_POINT >= c.width){ 
      mechanics.END_REACHED = true;
      if(mechanics.END_REACHED){
        mechanics.BREAK_SOUND_EFFECT.play();
        let randomBreakPoint = Math.random() * (leadPieces.length - 1) + 1;
        mechanics.removeLead(randomBreakPoint);
        mechanics.END_REACHED = false;
        if(!ENDLESS_MODE){
          if(mechanics.MAX_SIZE  > 1){ mechanics.MAX_SIZE -= 1; }
          if(mechanics.MIN_SIZE > 1 ){ mechanics.MIN_SIZE -= 1; }
        }
        if(mechanics.NO_MORE_LEAD()){
          let endMessage = document.getElementById('endMessage');
          clickCounter.textContent = '';
          endMessage.textContent = 'you are out of lead :( total size of all lead clicked: ' + totalAmountOfLead + " pixels";
        }
      }
    } 
    else {
      if(!mechanics.END_REACHED && !mechanics.NO_MORE_LEAD()){
        mechanics.CLICK_SOUND_EFFECT.play();
        mechanics.addLead();
        clickCounter.textContent = '';
        clickCounter.textContent = 'lead clicked: ' + cc + ' pieces';
        cc++;
      }  
    }
  },

  reset: () => {
    leadPieces = [];
    mechanics.START_POINT = 273;
    mechanics.MIN_SIZE = 10;
    mechanics.MAX_SIZE = 30;
    clickCounter.textContent = 'lead clicked: ';
    cc = 0;
    endMessage.textContent = '';
    AUTO_MODE = false;
    ENDLESS_MODE = false;
  },

  resize: () => {
    c.width = window.innerWidth * 1.25;
    c.height = window.innerHeight * 1.25;
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
  }
}

 // Keyboard event listeners to push lead and reset the game
document.addEventListener('keydown', keyDownHandler);

function keyDownHandler(event) {
  switch (event.code) {
    case 'Space':
      mechanics.pushLead();
      break;
    case 'KeyR':
      mechanics.reset();
      break;
    case 'KeyA':
      AUTO_MODE = true;
      break;
    case 'KeyE':
      ENDLESS_MODE = true;
      break;
  }
}

c.req = requestAnimationFrame(loop);

function loop(){
  ctx.clearRect(0,0, c.width, c.height);
  mechanics.resize();
  mechanics.drawLeadPencil();
  mechanics.drawLead();
  body.onclick = () => {
    mechanics.pushLead();
  }
  if(AUTO_MODE){
    mechanics.pushLead();
  }
  c.req = requestAnimationFrame(loop);
}