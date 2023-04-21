const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [ 1080, 1080 ]
};

let manager;

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';

//creamos un canvas el cual solo nos va a comparar pixeles
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

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
		typeContext.fillStyle = 'black';
		typeContext.fillRect(0, 0, cols, rows);

    //hacemos que nuestra letra sea visible
    fontSize = cols;

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
		const tx = (cols - mw) * 0.5 - mx;
		const ty = (rows - mh) * 0.5 - my;

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

      //asignamos los estilos usando el r g b a declarado anteriormente
      context.fillStyle = `rgb(${r}, ${g}, ${b})`;

      //dibujamos un cuadro para cada una de las celdas
      context.save();
      context.translate(x, y);
      context.translate(cell *0.5, cell * 0.5);
      //context.fillRect(0, 0, cell, cell);
      context.beginPath();
      context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
	};
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
