//lama la bibliotece de js
const canvasSketch = require('canvas-sketch');

//es una configuracion q nos dice que va a ser de 2048 px por 2048 px
const settings = {
  dimensions: [ 1080, 1080]
};
//es una funcion que llama otra funcion de la biblioteca
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.011;
    context.strokeStyle = 'white';

    const a = width * 0.10;
    const al = width * 0.10;
    const dis = width * 0.03;
    const ix = width * 0.17;
    const iy = height * 0.17;
    const off = width * 0.02;
    let x, y;
    console.log(width)
    //ahora dibujemos varias lineas de cuadrados 
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (a + dis) * i;
        y = iy + (al + dis) * j;

        context.beginPath();    
        context.rect(x, y, a, al);
        context.stroke();
                
        if (Math.random()> 0.5) {
          context.beginPath();
          context.rect(x + off / 2, y + off / 2, a - off, al - off);
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
