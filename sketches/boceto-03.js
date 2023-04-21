const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane')


const settings = {
  dimensions: [ 2080, 2080 ], //dimenciones cel 720 x 1520
  animate: true
};

const params = {
  colorLinea : 'rgb(239, 184, 16)',
  colorFondo : 'rgb(0, 0, 0)',
  distanciaPuntos: 200,
  minAnchoLinea: 5,
  maxAnchoLinea: 10,
}

const sketch = ({ width, height }) => {
  const agentes = [];

  for (let i = 0; i < 80; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height)

    agentes.push(new Agente(x,y))
    
  }
  return ({ context, width, height }) => {
    context.fillStyle = params.colorFondo;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agentes.length; i++) {
      const Agente = agentes[i];

      for (let j = i + 1; j < agentes.length; j++) {
        const otros = agentes[j];

        const dist = Agente.pos.Distancias(otros.pos);

        let d = params.distanciaPuntos
        if (dist > d) continue; //esto significa que si cumple realice las siguientes lineas de codigo si no c cumple que c detenga

        context.lineWidth = math.mapRange(dist, 0, 200, params.minAnchoLinea, params.maxAnchoLinea);

        //pintamos lineas de un punto a otro
        context.beginPath();
        context.moveTo(Agente.pos.x, Agente.pos.y);
        context.lineTo(otros.pos.x, otros.pos.y);
        context.strokeStyle = params.colorLinea;
        context.stroke();
        
      }
      
    }

    agentes.forEach(Agente => {
      Agente.update();
      Agente.draw(context);
      Agente.limites(width, height);
    });
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  folder = pane.addFolder({ title: 'Editar'});
  folder.addInput(params, 'colorLinea');
  folder.addInput(params, 'colorFondo');
  folder.addInput(params, 'distanciaPuntos', {min:50, max:800, step:2});
  folder.addInput(params, 'minAnchoLinea', {min:5, max:100, step:2});
  folder.addInput(params, 'minAnchoLinea', {min:5, max:100, step:2});

}


createPane();
canvasSketch(sketch, settings);

class Vector {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  Distancias(v){
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agente {
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

