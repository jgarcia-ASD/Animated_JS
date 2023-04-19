const canvasSketch = require('canvas-sketch');
const math = require ('canvas-sketch-util/math');
const random = require ('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

//hacemos una funcion para convertir los radianes a grados y facilitarnos la codificacion
const agrados = (grados) => {
  return grados / 180 * Math.PI;
}

//hacemos una funcino para hacer lieneas de grosor aleatorio
const lrandom = (min, max) => {
  return Math.random() * (max - min) + min;
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.fillStyle = 'black';

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 12;
    const radio = width * 0.3;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angulo = slice * i;

      x = cx + radio * Math.sin(angulo);
      y = cy + radio * Math.cos(angulo);

      //guardamos como tenemos ubicado nuestra ojo por que las transformaciones sin acomulativas
      context.save();
      context.translate(x, y);
      context.rotate(-angulo);
      context.scale(random.range(1, 3), 1);

      context.beginPath();
      context.rect(-w * 0.5, -h * 0.5, w, h);
      context.fill();
      //asi evitamos que se nos acumulen las tranformaciones
      context.restore();
      
    }
  };
};

canvasSketch(sketch, settings);
