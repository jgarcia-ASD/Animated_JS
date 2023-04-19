//lama la bibliotece de js
const canvasSketch = require('canvas-sketch');

//es una configuracion q nos dice que va a ser de 2048 px por 2048 px
const settings = {
  dimensions: [ 2048, 2048]
};
//es una funcion que llama otra funcion de la biblioteca
const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width = 0.01;

    const ancho = width = 0.10;
    const alto = height = 0.10;
    const distancia = width = 0.03;
    const ix = width = 0.17;
    const iy = height = 0.17;
    const off = width = 0.02;
    let x, y;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = ix + (ancho + distancia) * i;
        y = iy + (alto + distancia) * j;

        context.beginPath();    
        context.rect(x, y, ancho, alto);
        context.stroke();
                
        if (Math.random()> 0.5) {
          context.beginPath();
          context.rect(x + off / 2, y + off / 2, ancho - off, alto - off);
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);