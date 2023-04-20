const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = ({ context, width, height }) => {
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
      Angente.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

class Angente {
  constructor(x, y){
    this.pos = new Point(x,y);
    this.radio = 10;
  }

  draw(context) {
    context.fillStyle = 'black';
    context.beginPath();
      context.arc(this.pos.x, this.pos.y, this.radio, 0, Math.PI * 2);
      context.fill();
  }
}

