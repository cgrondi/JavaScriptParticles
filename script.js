const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

//get mouse position
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height/80) * (canvas.width/80)
};

window.addEventListener("mousemove",
  function(event){
    mouse.x = event.x;
    mouse.y = event.y;
  }
);

//class to create particle
class Particle{
  constructor(x, y, dirx, diry, size, color){
    this.x = x;
    this.y = y;
    this.dirx = dirx;
    this.diry = diry;
    this.size = size;
    this.color = color;
  }
  //method to draw each particle
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
    ctx.fillStyle = "#8C5523";
    ctx.fill();
  }

  //method to check particle position, move, and then redraw the particle
  update(){
    //check if particle is still in canvas
    if(this.x > canvas.width || this.x < 0){
      this.dirx = -this.dirx;
    }
    if(this.y > canvas.height || this.y < 0){
      this.diry = -this.diry;
    }

    //update particles' positions and call draw()
    this.x += this.dirx;
    this.y += this.diry;
    this.draw();
  }
}

//create particles using random values and populate particlesArray
function init(){
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 9000; //TEST THIS
  for(let i=0; i<numberOfParticles; i++){
    let size = (Math.random()*2)+3;  //TEST THIS
    let x = (Math.random() * ((innerWidth - size*2) - (size*2)) + size*2);
    let y = (Math.random() * ((innerHeight - size*2) - (size*2)) + size*2);
    let dirx = (Math.random()*2)-1; //TEST THIS
    let diry = (Math.random()*2)-1; //TEST THIS
    let color = "#8C5523";

    particlesArray.push(new Particle(x, y, dirx, diry, size, color));
  }
}

//draw a line between particles that are close enough together
function connect(){
  let opacityValue = 1;
  for(let a=0; a < particlesArray.length; a++){
    for(let b=a; b< particlesArray.length; b++){
      let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
      ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
      if(distance < (canvas.width/7)*(canvas.height/7)) {  // TEST 7
        opacityValue = 1 - (distance/20000);
        ctx.strokeStyle = 'rgba(140,85,31,' + opacityValue+ ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
    let mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x)) +
    ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
    if(mouseDistance < (canvas.width/5)*(canvas.height/5)){
      ctx.strokeStyle = 'rgba(140,85,31,1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  }
}

//animation loop
function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for(let i=0; i < particlesArray.length; i++){
    particlesArray[i].update();
  }
  connect();
}

//window resize event
window.addEventListener("resize",
  function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
  }
);

//mouse leaves canvas event
window.addEventListener("mouseout",
  function(){
    mouse.x = undefined;
    mouse.y = undefined;
  }
)



init();
animate();
