// Importamos la biblioteca 'canvas-sketch'
const canvasSketch = require('canvas-sketch');

// Definimos las dimensiones del canvas
const settings = {
  dimensions: [1080, 1080]

};

// Definimos la función sketch
const sketch = async ({ context, width, height }) => {
  // Define la URL de la imagen a utilizar
  const imageUrl = 'https://picsum.photos/1080/1080';
  // Crea un objeto imagen y establece la propiedad crossOrigin para permitir el uso de la imagen de origen cruzado
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  // Establece la propiedad src del objeto imagen con la URL de la imagen
  img.src = imageUrl;

  // Espera hasta que la imagen se haya cargado
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  // Dibuja la imagen en el contexto del lienzo
  context.drawImage(img, 0, 0, width, height);

  // Obtiene los datos de la imagen dibujada en el lienzo
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Establece el color de fondo del lienzo en negro
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  // Define el tamaño de la cuadrícula de glifos, la mitad de la cuadrícula y el tamaño de los glifos
  const gridSize = 16;
  const halfGrid = gridSize / 2;
  const glyphSize = 14;

  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      // pixelIndex se refiere al índice del píxel actual dentro del array de datos de imagen. 
      // Se multiplica y por el ancho de la imagen, se suma x y se multiplica por 4, ya que cada píxel ocupa 4 bytes en el array.
      const pixelIndex = (y * width + x) * 4;

      // Obtiene los valores de rojo, verde, azul y alfa del píxel actual.
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      const a = data[pixelIndex + 3];

      // Obtiene los valores de rojo, verde, azul y alfa del píxel actual.
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

      // Dibuja un rectángulo de gridSize x gridSize en la posición (x, y) actual.
      context.fillRect(x, y, gridSize, gridSize);

      // Establece el color de relleno actual en blanco y el tamaño de fuente en glyphSize.
      context.fillStyle = 'white';
      context.font = `${glyphSize}px monospace`;

      // Calcula el valor promedio de la intensidad del color (gris) del píxel actual.
      const glyph = Math.round((r + g + b) / 3 / 255 * 64);
      
      // Dibuja el glifo correspondiente al valor de intensidad de color en la posición central del rectángulo.
      context.fillText(String.fromCharCode(9600 + glyph), x + halfGrid, y + halfGrid + 4);

    }

  }

};




canvasSketch(sketch, settings);

     
