var myImage
var originalImage

var theCanvas

function setup() {
	angleMode(DEGREES)
	fileInput = createFileInput(loadImageFile).parent("loader")
	theCanvas = createCanvas(200, 200).parent("center")
	background(255, 255, 200, 0)
	textSize(16)

}

function draw() {

}

//Pega os dados dos pixels abaixo do mouse quando clicar ou arrastar com o mouse (se estiver dentro do canvas)
function mouseClicked() {
	if (mouseX >= 0 && mouseX <= theCanvas.width && mouseY >= 0 && mouseY <= theCanvas.height)
		getPixelColor(mouseX, mouseY)
}

function mouseDragged() {
	if (mouseX >= 0 && mouseX <= theCanvas.width && mouseY >= 0 && mouseY <= theCanvas.height)
		getPixelColor(mouseX, mouseY)
}

function getPixelColor(x, y) {
	//captura o pixel do canvas e calcula o objeto "Color" do p5 com os dados
	var pixelValueFromCanvas = this.canvas.getContext('2d').getImageData(x, y, 1, 1).data
	var cor = color(pixelValueFromCanvas[0], pixelValueFromCanvas[1], pixelValueFromCanvas[2], pixelValueFromCanvas[3])

	//limpa a area onde eu escrevo as coisas
	noStroke()
	fill(255, 255, 200, 255)
	rect(280, myImage.height + 50, 200, 80)
	fill(0)

	//Mostra os valores
	text
	text("R: " + cor.levels[0], 300, myImage.height + 70)
	text("G: " + cor.levels[1], 300, myImage.height + 86)
	text("B: " + cor.levels[2], 300, myImage.height + 102)
	text("A: " + cor.levels[3], 300, myImage.height + 118)

	text("H: " + Math.round(hue(cor)), 400, myImage.height + 70)
	text("S: " + Math.round(saturation(cor)), 400, myImage.height + 86)
	text("V: " + Math.round(brightness(cor)), 400, myImage.height + 102)
}

function generateHistogram(image, imageRect) {
	//Gerar os vetores do histograma

	//variaveis auxiliares
	image.loadPixels()
	var dataR = Array.apply(null, Array(256)).map(Number.prototype.valueOf, 0)
	var dataB = Array.apply(null, Array(256)).map(Number.prototype.valueOf, 0)
	var dataG = Array.apply(null, Array(256)).map(Number.prototype.valueOf, 0)

	//Conta a quantidade de cada tom de cinza
	for (var y = 0; y < image.height; y++) {
		for (var x = 0; x < image.width; x++) {
			var location = (x + image.width * y) * 4
			dataR[image.pixels[location + 0]] += 1
			dataG[image.pixels[location + 1]] += 1
			dataB[image.pixels[location + 2]] += 1
		}
	}

	//Desenhar o histograma

	//Acha o valor maximo (para remapear os valores)
	//ignoro os primeiro e ultimos 10 valores, isso gera histogramas melhores
	var max = 0
	for (var i = 10; i < 245; i++) {
		if (dataR[i] > max)
			max = dataR[i]
		if (dataG[i] > max)
			max = dataG[i]
		if (dataB[i] > max)
			max = dataB[i]
	}


	//calcula a posição X do segundo histograma
	if (imageRect.x > 0)
		imageRect.x = Math.max(imageRect.x, 610)
	imageRect.x += 1

	//fundo preto
	noStroke()
	fill(255)
	rect(imageRect.x, imageRect.height + 3, 256, 197)

	//linha fina
	strokeWeight(1)

	//loop de desenho das linhas
	for (var i = 0; i < 256; i++) {

		//Altura de cada linha
		var heightR = Math.min(map(dataR[i], 0, max, 0, 180), 180)
		var heightG = Math.min(map(dataG[i], 0, max, 0, 180), 180)
		var heightB = Math.min(map(dataB[i], 0, max, 0, 180), 180)

		//Posição da linha
		var xPos = i + imageRect.x
		var yPos = imageRect.height + 200

		//barra de legenda
		blendMode(NORMAL)
		stroke(i)
		line(xPos, yPos, xPos, yPos - 10)

		//grafico
		yPos -= 13
		blendMode(MULTIPLY)
		stroke(255, 100, 100)
		line(xPos, yPos, xPos, yPos - heightR)
		stroke(100, 255, 100)
		line(xPos, yPos, xPos, yPos - heightG)
		stroke(100, 100, 255)
		line(xPos, yPos, xPos, yPos - heightB)

	}
	blendMode(NORMAL)
}

function generateEqualizedImage() {
	//carrego os pixels na memoria
	myImage.loadPixels()

	//vars auxiliares
	var minValue = {
		r: 255,
		g: 255,
		b: 255
	}
	var maxValue = {
		r: 0,
		g: 0,
		b: 0
	}

	//achar o maior e menor valor que existe na imagem
	for (var y = 0; y < myImage.height; y++) {
		for (var x = 0; x < myImage.width; x++) {
			var location = (x + myImage.width * y) * 4

			minValue.r = Math.min(minValue.r, myImage.pixels[location + 0]) //R
			maxValue.r = Math.max(maxValue.r, myImage.pixels[location + 0])
			minValue.g = Math.min(minValue.g, myImage.pixels[location + 1]) //G
			maxValue.g = Math.max(maxValue.g, myImage.pixels[location + 1])
			minValue.b = Math.min(minValue.b, myImage.pixels[location + 2]) //B
			maxValue.b = Math.max(maxValue.b, myImage.pixels[location + 2])
		}
	}

	//Recalcula os valores de acordo com o maximo e o minimo que achei
	for (var y = 0; y < myImage.height; y++) {
		for (var x = 0; x < myImage.width; x++) {
			var location = (x + myImage.width * y) * 4

			//Calcula o luma de acordo com o padrao CCIR 601
			var L = calculateLuma(myImage.pixels[location], myImage.pixels[location + 1], myImage.pixels[location + 2])

			//Grava os novos valores em uma nova imagem
			myImage.pixels[location + 0] = map(myImage.pixels[location + 0], minValue.r, maxValue.r, 0, 255) //r
			myImage.pixels[location + 1] = map(myImage.pixels[location + 1], minValue.g, maxValue.g, 0, 255) //g
			myImage.pixels[location + 2] = map(myImage.pixels[location + 2], minValue.b, maxValue.b, 0, 255) //b
		}

	}

	//Atualiza a imagem na tela
	myImage.updatePixels()
	updateScreen()
}

function generateQuantizedImage() {

	//Variaveis auxiliares
	var tons = document.getElementById("tons").value
	var tonsMenosUm = tons - 1
	var faixa = 255 / tonsMenosUm

	//Carrega os pixels na memória
	myImage.loadPixels()

	//Quantatiza
	for (var y = 0; y < myImage.height; y++) {
		for (var x = 0; x < myImage.width; x++) {
			var location = (x + myImage.width * y) * 4


			//Seleciona o tom de acordo com a quantidade de tons do parametro
			var selectedToneR = Math.round(myImage.pixels[location + 0] / faixa)
			var selectedToneG = Math.round(myImage.pixels[location + 1] / faixa)
			var selectedToneB = Math.round(myImage.pixels[location + 2] / faixa)

			//Grava os novos valores em uma nova imagem
			myImage.pixels[location + 0] = faixa * selectedToneR //r
			myImage.pixels[location + 1] = faixa * selectedToneG //g
			myImage.pixels[location + 2] = faixa * selectedToneB //b
		}

	}

	//Atualiza a imagem na tela
	myImage.updatePixels()
	updateScreen()
}

function generateBinaryImage() {

	//Variaveis auxiliares
	var limiar = document.getElementById("limiar").value

	//Carrega os pixels na memória
	myImage.loadPixels()

	//binariza
	for (var y = 0; y < myImage.height; y++) {
		for (var x = 0; x < myImage.width; x++) {
			var location = (x + myImage.width * y) * 4

			//Calcula o luma de acordo com o padrao CCIR 601
			//var L = calculateLuma(myImage.pixels[location], myImage.pixels[location + 1], myImage.pixels[location + 2])

			//Grava os novos valores em uma nova imagem
			myImage.pixels[location + 0] = myImage.pixels[location + 0] >= limiar ? 255 : 0 //r
			myImage.pixels[location + 1] = myImage.pixels[location + 1] >= limiar ? 255 : 0 //g
			myImage.pixels[location + 2] = myImage.pixels[location + 2] >= limiar ? 255 : 0 //b
		}
	}

	//Atualiza a imagem na tela
	myImage.updatePixels()
	updateScreen()

}

function generateBWImage() {

	//Carrega os pixels na memória
	myImage.loadPixels()

	//binariza
	for (var y = 0; y < myImage.height; y++) {
		for (var x = 0; x < myImage.width; x++) {
			var location = (x + myImage.width * y) * 4

			//Calcula o luma de acordo com o padrao CCIR 601
			var L = calculateLuma(myImage.pixels[location], myImage.pixels[location + 1], myImage.pixels[location + 2])

			//Grava os novos valores em uma nova imagem
			myImage.pixels[location + 0] = L //r
			myImage.pixels[location + 1] = L //g
			myImage.pixels[location + 2] = L //b
		}
	}

	//Atualiza a imagem na tela
	myImage.updatePixels()
	updateScreen()
}

function kernelImage(kernel, normalizer = 1, bias = 0) {

	//Se chamar a função e não passar nenhum kernel, pega o kernel do textArea na tela
	if (kernel == undefined) {
		kernel = JSON.parse(document.getElementById("kernel").value).kernel
		normalizer = JSON.parse(document.getElementById("kernel").value).normalizer || 1
		bias = JSON.parse(document.getElementById("kernel").value).bias || 0
	}

	//Carrega os pixels na memória
	myImage.loadPixels()
	var pixelsCopy = myImage.pixels.slice(); //Eu utilizo a copia para pegar os valores dos pixels

	//acha o meio do kernel, isso facilita na hora de navegar pela imagem e resolve o problema de kernels de tamanho par
	kernelMiddleX = Math.floor((kernel[0].length - 1) / 2)
	kernelMiddleY = Math.floor((kernel.length - 1) / 2)

	//Aplica o kernel
	//imagem (x e y)
	for (var y = 0; y < myImage.height; y++) {
		for (var x = 0; x < myImage.width; x++) {
			var location = (x + myImage.width * y) * 4

			//Acumuladores
			var accumulatorR = 0
			var accumulatorG = 0
			var accumulatorB = 0

			//kernel (i e j)
			for (var i = 0; i < kernel.length; i++) {
				for (var j = 0; j < kernel[i].length; j++) {
					var kernelElement = kernel[i][j]

					//adiciona o valor calculado de cada canal nos acumuladores
					accumulatorR += pixelsCopy[location + 0 + ((kernelMiddleX - j) + (myImage.width * (kernelMiddleY - i))) * 4] * kernelElement
					accumulatorG += pixelsCopy[location + 1 + ((kernelMiddleX - j) + (myImage.width * (kernelMiddleY - i))) * 4] * kernelElement
					accumulatorB += pixelsCopy[location + 2 + ((kernelMiddleX - j) + (myImage.width * (kernelMiddleY - i))) * 4] * kernelElement

				}
			}

			//Aplica o normalizador e grava os novos valores
			myImage.pixels[location + 0] = accumulatorR * normalizer + bias //r
			myImage.pixels[location + 1] = accumulatorG * normalizer + bias //g
			myImage.pixels[location + 2] = accumulatorB * normalizer + bias //b
		}
	}
	//Atualiza a imagem na tela
	myImage.updatePixels()
	updateScreen()
}

//FUNÇÕES:
function updateScreen() {
	//limpa a tela
	background(255, 255, 200, 0)

	//desenha as 2 imagens (a original e a processada) uma do lado da outra
	//logo em seguida, calcula o histograma de cada uma
	if (originalImage) {

		image(originalImage, 0, 0)
		generateHistogram(originalImage, {
			x: 0,
			y: 0,
			width: originalImage.width,
			height: originalImage.height
		})
	}

	if (myImage) {
		image(myImage, 600 + 10, 0)
		generateHistogram(myImage, {
			x: myImage.width + 10,
			y: 0,
			width: myImage.width,
			height: myImage.height
		})
	}

	//Exibe os textos
	getPixelColor()
}

function calculateLuma(R, G, B) {
	//Calcula o luma de acordo com o padrao CCIR 601
	return 0.299 * R + 0.587 * G + 0.114 * B
}

function resetImage() {
	originalImage.loadPixels()

	for (var i = 0; i < originalImage.width * originalImage.height * 4; i++) {
		myImage.pixels[i] = originalImage.pixels[i]
	}
	myImage.updatePixels()
	updateScreen()
}

function loadImageFile(file) {
	if (file.type == 'image')
		originalImage = loadImage(file.data, () => {

			//Força a imagem a ter obrigatoriamente 600px de largura (por causa das coisas da interface)
			if (originalImage.height > 600)
				originalImage.resize(0, 600)
			if (originalImage.width > 600)
				originalImage.resize(600, 0)

			//Cria uma copia da imagem carregada, é nela que vamos fazer o processamento
			myImage = createImage(originalImage.width, originalImage.height)
			myImage.loadPixels()

			//Redimensiona o canvas para acompanhar o tamanho da imagem
			theCanvas = createCanvas(Math.max(myImage.width * 2 + 30, 1220), myImage.height + 200).parent("center")
			resetImage()
		})
}