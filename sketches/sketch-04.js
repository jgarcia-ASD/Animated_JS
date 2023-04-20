const canvasSketch = require('canvas-sketch');
//importamos bibliotecas random
const random = require('canvas-sketch-util/random');
//importamos las funciones math
const math = require('canvas-sketch-util/math');

const settings = {
	dimensions: [ 1080, 1080 ],
  animate: true
};

const sketch = () => {
	return ({ context, width, height, frame }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

    //colocamos la cantidad de columnas que necesitemos
		const cols = 10 ;
    //colocamos la cantidad de filas que necesitemos
		const rows = 10 ;
    //descrubrimos el numero total de celdas
		const numCells = cols * rows;

    //almacenamos el ancho de la cuadricula
		const gridw = width  * 0.8;
    //almacenamos la altura de la cuadricula
		const gridh = height * 0.8;
    //ancho y alto de cada celda de la cuadricula
		const cellw = gridw / cols;//ancho
		const cellh = gridh / rows;//alto
    //encontramos las margenes de nuestra cuadricula como son dos se multiplan por 0.5
		const margx = (width  - gridw) * 0.5;
		const margy = (height - gridh) * 0.5;

    //necesitamos recorrer celda por celda esto lo vamos hacer con un for (con dos no para probar que tambien se pueden hacer de otra forma)
		for (let i = 0; i < numCells; i++) {
      //para calcular la columna necesitas el restante de la division
			const col = i % cols;
      //para calcula el eje y ya que cada cuatro aumentara
			const row = Math.floor(i / cols);

      //ahora encontraremos cada celda
			const x = col * cellw;//celdas en el eje x
			const y = row * cellh;//celdas en el eje y
      //queremos que las lineas de que dibuje dentro de las celdas sean mas pequeñas
			const w = cellw * 0.8;//ancho
			const h = cellh * 0.8;//alto

      //creamos un numero random con las funciones de la biblioteca que importamos
      //en la documentacion nos aclaran que le podemos agrgar una frecuencia y la amplitud
      const n = random.noise2D(x + frame * 10, y, 0.001);
      //creamos un angulo para mover las lineas a nuestro gusto tambien podemos poner la amplitud en en el angulo
      const angle = n * Math.PI * 0.2;
      //random noise2d devuelve entre -1 y 1 y cuando se multiplice por Math.PI nos va a dar un valor entre -180 y 180
      //podemos crear una variable para hacer escalas en nuestras lineas
      /*const scale = (n + 1) / 2 * 30;
      pero estaba en -1 y 1 y necesitamos un mapeo de 0 y 1 entonces ponemos el + 1 / 2 al sumar va de 0 y 2 pero al dividirlo ya nos queda de 0 y 1*/
      /*otra forma podria ser
      const scale = (n * 0.5 + 0.5) * 30;*/
      //otra forma seria con range que es una funcion de math
      const scale = math.mapRange(n, -1, 1, 1, 30);

			context.save();
			context.translate(x, y);
			context.translate(margx, margy);
			context.translate(cellw * 0.5, cellh * 0.5);
      //rotamos nuestras lineas
      context.rotate(angle);

			context.lineWidth = scale;

			context.beginPath();
			context.moveTo(w * -0.5, 0);//queremos restar la mitad del ancho de linea
			context.lineTo(w *  0.5, 0);//solo queremos la mitad del ancho de linea
			context.stroke();

			context.restore();
		}

	};
};

canvasSketch(sketch, settings);
