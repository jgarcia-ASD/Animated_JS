const canvasSketch = require('canvas-sketch');
const math = require ('canvas-sketch-util/math');
const random = require ('canvas-sketch-util/random');

const q = true
const w = false
const settings = {
  dimensions: [ 1080, 1080 ],
  animate: q
};


const sketch = () => {
  
  return ({ context, width, height}) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    
    context.fillStyle = 'black';

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 600;
    const radio = width * 0.3;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angulo = (slice * i);
      console.log('este es el angulo'+ angulo)

      x = cx + radio * Math.sin(angulo);
      y = cy + radio * Math.cos(angulo);

      //guardamos como tenemos ubicado nuestra ojo por que las transformaciones sin acomulativas
      context.save();
      context.translate(x, y);
      context.rotate(-angulo);
      context.scale(random.range(0.3, 2), random.range(0.2, 0.5));

      context.beginPath();
      context.fillStyle = '#B00C0C';
      context.rect(-w * 0.20, random.range(0, -h * 0.20), w, h);
      context.fill();
      //asi evitamos que se nos acumulen las tranformaciones
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angulo)

      context.lineWidth = random.range(5, 20);

      context.beginPath();
      context.strokeStyle = '#550606';
      context.arc(w * 0.50, h * 0.50, radio * random.range(0.001, 1.5),slice * random.range(1, -8), slice * random.range(1, 5));
      context.stroke();
      context.restore();
      
    }
  };
};

canvasSketch(sketch, settings);
