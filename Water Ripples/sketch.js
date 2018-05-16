let damping = 0.98
let spacing = 9
let previous = []
let current = []
let sw;
let sh;

function setup() {
	createCanvas(windowWidth, windowHeight)
	pixelDensity(1)

	sw = Math.floor(width / spacing)
	sh = Math.floor(height / spacing)

	for (var i = 0; i < sw; i++) {
		for (var j = 0; j < sh; j++) {
			previous.push(0);
		}
	}

	current = previous.slice()
	noStroke()
	background(0);

}

function draw() {

	let index = 0
	let newValue = 0

	if (mouseIsPressed) {
		index = (Math.floor(mouseX / spacing) + sw * Math.floor(mouseY / spacing))
		previous[index] = 1000
	}

	for (let i = 1; i < sw - 1; i++) {
		for (let j = 1; j < sh - 1; j++) {
			index = (i + sw * j)
			current[index] = ((
				previous[index - 1 + sw] +
				previous[index - 1 - sw] +
				previous[index + 1 + sw] +
				previous[index + 1 - sw] +
				previous[index - 1] +
				previous[index + 1] +
				previous[index - sw] +
				previous[index + sw]
			) >> 2) - current[index]

			current[index] -= current[index] >> 5

			fill(current[index])
			rect(i * spacing, j * spacing, spacing, spacing)
		}
	}

	let temp = previous.slice()
	previous = current.slice()
	current = temp.slice()
}