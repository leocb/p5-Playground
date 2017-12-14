let angle = 0

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
	background(175)
	rotateX(angle)
	rotateY(angle * 0.3)
	rotateZ(angle * 1.2)

	fill(0, 0, 255)
	torus(100, 10)

	angle += 0.03
}