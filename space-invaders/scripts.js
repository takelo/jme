console.log("yelllow");

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;

    const image = new Image();
    image.src = "./images/swordfish.png";
    image.onload = () => {
      const scale = 0.35;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    c.save();

    // if (player.position.x != null)
        //   c.translate(
        //     player.position.x + player.width/2,
        //     player.position.y + player.height/2
        // )

    // console.log(player.position);
    // c.rotate(this.rotation)

    if (this.image) {
    c.drawImage(
        this.image, 
        this.position.x, 
        this.position.y, 
        this.width, 
        this.height
        );
    }
    c.restore();
  }
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}


class InvaderProjectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.width = 4
        this.height = 20
    }
    draw(){
      c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Projectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 4
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Particle{
    constructor({position, velocity, radius, color}){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Invader {
  constructor({position, velocity}) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    const image = new Image();
    image.src = "./images/invader.png";
    image.onload = () => {
      const scale = 0.25;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y
      };
    };
  }
  draw() {
    c.drawImage(
        this.image, 
        this.position.x, 
        this.position.y, 
        this.width, 
        this.height
        );
  }
  update({velocity}) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
  shoot(invaderProjectiles){
    invaderProjectiles.push(new InvaderProjectile({
      position: {
        x: this.position.x + this.width/2,
        y: this.position.y + this.height
      },
      velocity: {
        x: 0,
        y: 6
      }
    }))
  }
  
}
class Grid{
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    }
    this.velocity = {
      x: 3,
      y: 0,
    }
    this.invaders = []
    const rows = Math.floor(Math.random() * 2 + 1)
    const columns = Math.floor(Math.random() * 2 + 5)

    this.width = columns * 120

    for(let x = 0 ; x < columns ; x++){
      for(let y = 0 ; y < rows ; y++){
        this.invaders.push(
          new Invader({
            position:{
              x: x * 120,
              y: y * 120
            },
            velocity:{
              x: 0,
              y: 0
            }
        }))
      }
    }
    // console.log(this.invaders)
  }
  update(){
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0.5

    if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
      this.velocity.x = -this.velocity.x
      // this.velocity.y = 120
    }
  }
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []


const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

player.draw();



let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  // invader.update();
  player.update();

  particles.forEach((particle , index ) => {
    particle.update();
  })
  invaderProjectiles.forEach((invaderProjectile , index ) => {
    if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
      setTimeout(() => {
        invaderProjectiles.splice(index,1)
      }, 0)
    }else{
      invaderProjectile.update()
    }
    if(invaderProjectile.position.y - invaderProjectile.height <= player.position.y + player.height &&
      invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
      invaderProjectile.position.x - invaderProjectile.width <= player.position.x +player.width &&
      invaderProjectile.position.y + invaderProjectile.height >= player.position.y){
      console.log('you lose')
    }
  })
  projectiles.forEach((projectile , index ) => {
      if(projectile.position.y + projectile.radius <=0){
          setTimeout(() => {
              projectiles.splice(index ,1)

          }, 0)
      }else{
          projectile.update()
      }
  })
    // console.log(invaderProjectiles);

    grids.forEach((grid, gridIndex ) => {
      grid.update()
      if(frames % 100 === 0 && grid.invaders.length > 0){
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        // grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        // grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        // grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        // grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
      }
      grid.invaders.forEach((invader , i) => {
        invader.update({velocity: grid.velocity})

        // projectilce hit enemy
        projectiles.forEach((projectile, j) => {
          if(projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <= invader.position.x +invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y){

            setTimeout(()  => {
              const invaderFound = grid.invaders.find(invader2 => {
                return invader2 === invader
              })
              const projectilefound = projectiles.find(projectile2 => {
                return projectile2 === projectile
              })
              if(invaderFound && projectilefound){
                
            for(let i = 0 ; i < 15 ; i++){

              particles.push(new Particle({
                position: {
                  x: invader.position.x + invader.width / 2,
                  y: invader.position.y + invader.height / 2
                },
                velocity: {
                  x: (Math.random() - 0.5 ) * 2,
                  y: (Math.random() - 0.5 ) * 2
                },
                radius: Math.random() * 3,
                color: 'yellow'
              }))
            }
                grid.invaders.splice(i, 1)
                projectiles.splice(j, 1)
                if(grid.invaders.length > 0){
                  const firstInvader = grid.invaders[0]
                  const lasInvader = grid.invaders[grid.invaders.length - 1]
                  grid.width = lasInvader.position.x - firstInvader.position.x + lasInvader.width
                  grid.position.x = firstInvader.position.x
                }else{
                  grids.splice(gridIndex, 1)
                }
              }
            },0)
          }
        })
      })
    })

  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    // player.rotation = -0.15
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 7;
  } else if (keys.w.pressed) {
    player.velocity.y = -7;
  } else if (keys.s.pressed) {
    player.velocity.y = 7;
  } else {
    player.velocity.x = 0;
    player.velocity.y = 0;
  }


//spawning enemies
  if(frames %  randomInterval === 0){
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500 + 500)
    frames = 0
    // console.log(randomInterval);
  }
  // console.log(frames);
  frames++

}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
    //   console.log("left");
      keys.a.pressed = true;
      break;
    case "d":
    //   console.log("right");
      // console.log(player.velocity.x);
      keys.d.pressed = true;
      break;
    case "w":
    //   console.log("up");
      console.log('velocity y',player.velocity.y);
      keys.w.pressed = true;
      break;
    case "s":
    //   console.log("down");
      // console.log(player.velocity.y);
      keys.s.pressed = true;
      break;
    case " ":
    //   console.log("space");
      projectiles.push(
        new Projectile({
            position:{
                x:player.position.x + player.width/2,
                y:player.position.y
            },
            velocity:{
                x:0,
                y:-15
            }
        })
      )
      break;
  }
});
addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case " ":
    //   console.log("space");
      break;
  }
});
