let angle = 0

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
	background(255)

	rotateX(angle * 0.39)
	rotateY(angle * 0.42)
	rotateZ(angle * 0.17)
	fill(255, 0, 0)
	torus(140, 10)

	rotateY(angle * 0.68)
	fill(0, 255, 0)
	torus(120, 10)

	rotateX(angle * 0.59)
	fill(0, 0, 255)
	torus(100, 10)

	fill(100)
	translate(0, 50, 0)
	box(16, 100, 16)

	angle += 0.05
}