// loop persistent variables
let vField = []
let particles = []
let hue = 0
let offZ = 0
let deltaTime = 0
let yCount = 0
let xCount = 0

// parameters
let particlesCount = window.innerWidth < 800 ? 200 : 1500 // how many "lines" on screen
let vectorFieldGridSize = 25 // distance between vectors, higher = more resolution = thighter path
let deltaP = 0.03 // difference between vector neighboors, higher = more caos!
let diffZ = 0.001 // speed to change the vectors, higher = faster


function setup() {

	createCanvas(window.innerWidth - 20, window.innerHeight - 20)

	// precache the vector field loop 'until' value
	yCount = Math.floor(height / vectorFieldGridSize)
	xCount = Math.floor(width / vectorFieldGridSize)

	// Create the vector field grid
	for (let y = 0; y <= yCount; y++) {
		for (let x = 0; x <= xCount; x++) {
			vField.push(new p5.Vector(0, 0, 0))
		}
	}

	// Create the particles
	for (let i = 0; i < particlesCount; i++) {
		particles.push(new Particle(new p5.Vector(random(width), random(height)), p5.Vector.random2D()))
	}

	// Sketch settings
	frameRate(60)
	strokeWeight(1)
	colorMode(HSB)
}

function draw() {

	// Slowly fade the bg to white, this create a nice effect on screen
	background(0, 0, 255, 0.1)

	//Recalculate Vector Field angles using a simple 3D perlin noise
	offZ += diffZ
	for (let y = 0; y <= yCount; y++) {
		let offY = y * deltaP

		for (let x = 0; x <= xCount; x++) {
			let offX = x * deltaP
			let index = x + y * xCount

			vField[index] = new p5.Vector.fromAngle(noise(offX, offY, offZ) * TWO_PI * 6)
		}
	}

	// calculate the delta time based on framerate, target is 60fps
	deltaTime = 60 / frameRate()
	if (deltaTime === Infinity)
		deltaTime = 0

	// particles color
	stroke(offZ * 500 % 360, 255, 127, 1)

	//Update particles
	for (let i = 0; i < particlesCount; i++) {
		let particle = particles[i]

		//find the vector field closest to the particle based on its position
		let vFieldIndex = Math.floor(particle.pos.x / vectorFieldGridSize) + Math.floor(particle.pos.y / vectorFieldGridSize) * Math.floor(width / vectorFieldGridSize)

		particle.applyForce(vField[vFieldIndex].setMag(2.2))
		particle.update(deltaTime)
		particle.draw()
	}
}




class Particle {
	constructor(pos, vel) {
		this.pos = pos
		this.vel = vel
		this.acc = new p5.Vector(0, 0)
		this.prevPos = this.pos.copy()
		this.maxSpeed = 10
	}

	//Light Phys engine
	applyForce(vector) {
		this.acc.add(vector)
	}

	update(deltaTime) {
		this.prevPos = this.pos.copy()

		this.vel.add(this.acc)
		this.vel.limit(this.maxSpeed)
		this.pos.add(this.vel.mult(deltaTime))
		this.stayInBounds()

		this.acc = new p5.Vector(0, 0)
	}

	// Draw
	draw() {
		line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
	}

	//Bounds check
	stayInBounds() {
		if (this.pos.x > width) {
			this.pos.x -= width
			this.prevPos = this.pos.copy()
		}
		if (this.pos.x < 0) {
			this.pos.x += width
			this.prevPos = this.pos.copy()
		}
		if (this.pos.y > height) {
			this.pos.y -= height
			this.prevPos = this.pos.copy()
		}
		if (this.pos.y < 0) {
			this.pos.y += height
			this.prevPos = this.pos.copy()
		}
	}

}