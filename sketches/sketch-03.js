const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

//si no tenemos acceso a canvas-sketch
const animate = () => {
  console.log('domestika')
  requestAnimationFrame(animate);
}
//y ahora la llamamos
//animate ()
const sketch = ({ width, height }) => {
  const agentes = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height)

    agentes.push(new Angente(x,y))
    
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    agentes.forEach(Angente => {
      Angente.update();
      Angente.draw(context);
      Angente.limites(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

class Angente {
  constructor(x, y){
    this.pos = new Vector(x,y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radio = random.range(4, 12);
  }


  limites(width, height){
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radio, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}

