const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const Tweakpane = require('tweakpane');

const settings = {
	dimensions: [ 1080, 1080 ],
	animate: true,
};

let manager;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

//creamos un canvas el cual solo nos va a comparar pixeles
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const parametros = {
	ubicacionx: 0.5,
	ubicaciony: 0.5,
	tamaño: 2,
	colorl: 'rgb(255, 255, 255)',
	colorf: 'rgb(0, 0, 0)',

}

const sketch = ({ context, width, height }) => {
	//asignamos un tamaño a nuestro pixel
	const cell = 20;
	//nombramos columnas y filas
	const cols = Math.floor(width  / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;

	//establecemos el alto y el ancho de nuestro canvas
	typeCanvas.width  = cols;
	typeCanvas.height = rows;

	return ({ context, width, height }) => {
		typeContext.fillStyle = parametros.colorf;
		typeContext.fillRect(0, 0, cols, rows);

    //hacemos que nuestra letra sea visible
    fontSize = cols * 1.2;

		//nueva fucnion para dibujar una letra adaptada a nuestro boceto
		typeContext.fillStyle = 'white';
		typeContext.font = `${fontSize}px ${fontFamily}`;
		//la fucnion textebaseline nos pide cual va a ser la base para nuestra letra
		typeContext.textBaseline = 'top';
		//la centramos horizontalmente |
    	//context.textAlign = 'center';

		//usamos una funcion llamada measuretext para traer variables mucho mas precisas y ser mas preciso al momento de medir letras
		const metrics = typeContext.measureText(text);
		const mx = metrics.actualBoundingBoxLeft * -1;//eje x
		const my = metrics.actualBoundingBoxAscent * -1;//eje y
		const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
		const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		//creamos las variables de x y y para encontrar la mitad de nuestro tablero
		const tx = (cols - mw) * parametros.ubicacionx - mx;
		const ty = (rows - mh) * parametros.ubicaciony - my;

		typeContext.save();
		//la centramos verticalmente ------
		typeContext.translate(tx, ty);

		//dibujamos un cuadrado con las cordenadas de metrics
		typeContext.beginPath();
		typeContext.rect(mx, my, mw, mh);
		typeContext.stroke();

		//la funcion filltexto toma los parametros del string y las cordenadas
		typeContext.fillText(text, 0, 0);
		typeContext.restore();

    //hacemos que lea los datos de los pixeles
    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

		//dibujamos nuestro canvas
		//context.drawImage(typeCanvas, 0, 0);

    //ponemos el fondo negro
    context.fillStyle = parametros.colorf;
    context.fillRect(0, 0, width, height);

    //alineamos los guiones osea el tercer valor en la funcio al centro del pixel
    context.textBaseline = 'middle';
		context.textAlign = 'center'; 

    //leemos la matriz que creamos ImageData
    for (let i = 0; i < numCells; i++) {
      //recorre todo el indice
      const col = i % cols;
      const row = Math.floor(i / cols);

      //definimos altura y ancho
      const x = col * cell;
      const y = row * cell;

      //leemos el rgba de cada pixel
      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      //queremos que los glifos sean distintos segun la intensidad del color entonces hacemos
      const glyph = getGlyph(r);

      //agrandamos nuestro texto de glifos
      context.font = `${cell * parametros.tamaño}px ${fontFamily}`;

      //asignamos los estilos usando el r g b a declarado anteriormente
      context.fillStyle = parametros.colorl;
      //if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

      //dibujamos un cuadro para cada una de las celdas
      context.save();
      context.translate(x, y);
      context.translate(cell *0.5, cell * 0.5);
      /*esto era para dibujar cuadrados o cirulos ahora vamos a dibujar letras
      //context.fillRect(0, 0, cell, cell);
      context.beginPath();
      context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      context.fill();*/

      //para dibujar letras hacemos lo siguiente
      context.fillText(glyph, 0, 0);

      context.restore();

      
    }
	};
};

const createPane = () => {
	const pane = new Tweakpane.Pane();
	let folder;
	//hacemos un objeto del panel a nuestro gusto
	folder = pane.addFolder({ title: 'Editar'})
	folder.addInput(parametros, 'ubicacionx', {min:-3, max:3});
	folder.addInput(parametros, 'ubicaciony', {min:-3, max:3});
	folder.addInput(parametros, 'colorl');
	folder.addInput(parametros, 'tamaño', {min:1, max:5});
	//folder.addInput(parametros, 'relleno', {option: {Palito_ñ: 'a', Llaves: 'p', Uno:'o'}});

}


//esta es la funcion que m va a asignar el color de los glifos
const getGlyph = (v) => {
	if (v < 50) return '';
	if (v < 100) return '.';
	if (v < 150) return '|';
	if (v < 200) return '+';

  //la funcion split convierte los strings en arrays
  const glyphs = `~  ~`.split('');

  //la funcion pick agarra un valor aleatorio de un array
  return random.pick(glyphs);
};

//funcion para que me lea las teclas que presione
const onKeyUp = (e) => {
	text = e.key.toUpperCase();
	manager.render();
};
//documentacion para que nos sirva la funcion
document.addEventListener('keyup', onKeyUp);

//esto es una promesa
const start = async () => {
	manager = await canvasSketch(sketch, settings);
};


createPane();
//iniciar la promesa
start();





/*
const url = 'https://picsum.photos/200';

const loadMeSomeImage = (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject();
		img.src = url;
	});
};

const start = async () => {
	const img = await loadMeSomeImage(url);
	console.log('image width', img.width);
	console.log('this line');
};

// const start = () => {
// 	loadMeSomeImage(url).then(img => {
// 		console.log('image width', img.width);
// 	});
// 	console.log('this line');
// };


start();
*/
