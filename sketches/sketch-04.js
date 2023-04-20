const canvasSketch = require('canvas-sketch');
//importamos bibliotecas random
const random = require('canvas-sketch-util/random');
//importamos las funciones math
const math = require('canvas-sketch-util/math');
//vamos a usar tweakpane para crear un tablero y poder modificar datos en tiempo real
const Tweakpane = require('tweakpane')

const settings = {
	dimensions: [ 1080, 1080 ],
  animate: true
};

//creamos variables aqui encima de todo para que nuestro sketch tambien las pueda leer
const params = {
  cols: 30,
  rows: 30,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 1,
  frame: 0,
  animate: true,
  lineCap: 'butt',
}

const sketch = () => {
	return ({ context, width, height, frame }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

    //colocamos la cantidad de columnas que necesitemos
		const cols = params.cols ;
    //colocamos la cantidad de filas que necesitemos
		const rows = params.rows ;
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

      //voy a crean una condicion
      const f = params.animate ? frame : params.frame;
      //esto cuando el valor de de animate sea true la animacion va a ser automatica pero cuando sea false la animacion va a ser el valor de frame

      //creamos un numero random con las funciones de la biblioteca que importamos
      //en la documentacion nos aclaran que le podemos agrgar una frecuencia y la amplitud
      //const n = random.noise2D(x + frame * 10, y, params.freq);
      //vamos a tratar de hacer una 3d solo volvemos el frame * 10 en la dimension que nos falta
      const n = random.noise3D(x, y, f * 10, params.freq);

      //creamos un angulo para mover las lineas a nuestro gusto tambien podemos poner la amplitud en en el angulo
      const angle = n * Math.PI * params.amp;
      //random noise2d devuelve entre -1 y 1 y cuando se multiplice por Math.PI nos va a dar un valor entre -180 y 180
      //podemos crear una variable para hacer escalas en nuestras lineas
      /*const scale = (n + 1) / 2 * 30;
      pero estaba en -1 y 1 y necesitamos un mapeo de 0 y 1 entonces ponemos el + 1 / 2 al sumar va de 0 y 2 pero al dividirlo ya nos queda de 0 y 1*/
      /*otra forma podria ser
      const scale = (n * 0.5 + 0.5) * 30;*/
      //otra forma seria con range que es una funcion de math
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

			context.save();
			context.translate(x, y);
			context.translate(margx, margy);
			context.translate(cellw * 0.5, cellh * 0.5);
      //rotamos nuestras lineas
      context.rotate(angle);

			context.lineWidth = scale;
      context.lineCap = params.lineCap;

			context.beginPath();
			context.moveTo(w * -0.5, 0);//queremos restar la mitad del ancho de linea
			context.lineTo(w *  0.5, 0);//solo queremos la mitad del ancho de linea
			context.stroke();

			context.restore();
		}

	};
};
//cramos el panel para editar en vivo
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;
  //hacemos un objeto del panel a nuestro gusto
  folder = pane.addFolder({ title: 'Editalo :DD'})//el titulo de nuestro panel
  //añadimos para cambiar el estilo de las lineas
  folder.addInput(params, 'lineCap', { options: {normal: 'butt', redondeadas: 'round', largas: 'square'}})
  //añadimos al table una barrita para poder cambiar valores
  folder.addInput(params, 'cols', {min:2 , max:100, step: 1});
  folder.addInput(params, 'rows', {min:2 , max:100, step: 1});
  //min es el minimo valor q vamos a poder tener, el max es el maximo valor q vamos a poder tener y step es los pasos q tiene q dar para llegar al siguiente numero en este caso esta de 1 en 1 
  //ahora estos los las barritas de escala
  folder.addInput(params, 'scaleMin', {min:1 , max:100});//aqui no necesitamos step ya q este si maneja decimales
  folder.addInput(params, 'scaleMax', {min:1 , max:100});
  //se pueden agregar mas titulos a nuestro panel
  folder = pane.addFolder({ title: 'Funcuion ruido perlin'})
  //Ahora lo hacemos para frecuencia y para amplitud enter lineas
  folder.addInput(params, 'freq', {min:-0.01 , max:0.01});
  folder.addInput(params, 'amp', {min:0 , max:1});
  //ahora pongamos los valores de animacion
  folder.addInput(params, 'animate');//se deja asi solo ya que es falso o verdadero
  folder.addInput(params, 'frame', {min:0 , max:999, step:1});
}

createPane();
canvasSketch(sketch, settings);
