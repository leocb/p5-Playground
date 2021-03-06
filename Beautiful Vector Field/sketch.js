// loop persistent variables
let vField = []
let particles = []
let hue = 0
let offZ = 0
let deltaTime = 0
let yCount = 0
let xCount = 0
let fpsArray = []

// parameters
let particlesCount = 500 // how many "lines" on screen, we start with 500 and increase/decrease them dynamicly
let vectorFieldGridSize = 20 // distance between vectors, higher = more resolution = thighter path
let deltaP = 0.04 // difference between vector neighboors, higher = more caos!
let diffZ = 0.0005 // speed to change the vectors, higher = faster


function setup() {

	createCanvas(window.innerWidth - 40, window.innerHeight)

	// precache the vector field loop 'until' value
	yCount = Math.floor(height / vectorFieldGridSize)
	xCount = Math.floor(width / vectorFieldGridSize)

	// Create the vector field grid
	for (let y = 0; y <= yCount; y++) {
		for (let x = 0; x <= xCount; x++) {
			vField.push(new p5.Vector(0, 0))
		}
	}

	// Create the particles
	for (let i = 0; i < particlesCount; i++) {
		particles.push(new Particle(new p5.Vector(random(width), random(height)), p5.Vector.random2D().setMag(10)))
	}

	// Sketch settings
	strokeWeight(1)
	colorMode(HSB)
	textSize(16);
	textAlign(LEFT, TOP)
	rectMode(CORNER)

	// Extremly important for mobile, without this, the resolution may be to high to draw at 60fps:
	pixelDensity(1)
}

function draw() {
	//Recalculate Vector Field angles using a simple 3D perlin noise
	offZ += diffZ
	let y, x, offY, offX
	for (y = 0; y <= yCount; y++) {
		offY = y * deltaP

		for (x = 0; x <= xCount; x++) {
			offX = x * deltaP
			vField[x + y * xCount] = p5.Vector.fromAngle(noise(offX, offY, offZ) * TWO_PI * 6).setMag(2.2)
		}
	}

	// calculate the delta time based on framerate, target is 50fps
	deltaTime = 50 / frameRate()
	if (deltaTime === Infinity)
		deltaTime = 0

	// Slowly fade the bg to white, this create a nice effect on screen
	background(0, 0, 255, 0.1)

	// Show fps on screen and dynamic particle system
	fpsArray.unshift(frameRate())
	if (fpsArray.length > 120)
		fpsArray.pop()

	let averageFPS = fpsArray.reduce((i, t) => i += t) / fpsArray.length

	noStroke()
	fill(255)
	rect(0, 0, width, 40)
	fill(0)

	noStroke();
	text('Click your mouse or Touch and drag on the screen', 0, 20)

	text('FPS: ' + averageFPS.toFixed(1), 0, 4)
	text('DT: ' + deltaTime.toFixed(2), 90, 4)
	text('Particles: ' + particlesCount, 165, 4)

	// particles color
	stroke(offZ * 500 % 360, 200, 127, 1)
	//Update particles
	for (let i = 0; i < particlesCount; i++) {

		//find the vector field closest to the particle based on its position
		particles[i].applyForce(vField[Math.floor(particles[i].pos.x / vectorFieldGridSize) + Math.floor(particles[i].pos.y / vectorFieldGridSize) * xCount])

		if (mouseIsPressed) {

			particles[i].applyForce(p5.Vector.fromAngle(Math.atan2(mouseY - particles[i].pos.y, mouseX - particles[i].pos.x) + PI).mult(20000 / (Math.pow(mouseX - particles[i].pos.x, 2) + Math.pow(mouseY - particles[i].pos.y, 2))))
		}


		particles[i].update(deltaTime)
		particles[i].draw()
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

	copy() {
		return new Particle(new p5.Vector(this.pos.x, this.pos.y), p5.Vector.random2D())
	}

	//Light Phys engine
	applyForce(vector) {
		this.acc.add(vector)
	}

	update(deltaTime) {
		this.prevPos = this.pos.copy()
		this.stayInBounds()

		// The line bellow is the time-corrected implementation of particle movement
		// but it's commented out as android phones don't like it very much (don't know why)
		// instead, we use predictive movement, this makes the particles insentive to the "real" time
		// but at least lower-end android phones can see the demo too.
		// this.pos.add(this.vel.add(this.acc).limit(this.maxSpeed).mult(deltaTime))

		this.pos.add(this.vel.add(this.acc).limit(this.maxSpeed))
		this.acc = this.acc.mult(0)
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
			return
		}
		if (this.pos.x < 0) {
			this.pos.x += width
			this.prevPos = this.pos.copy()
			return
		}
		if (this.pos.y > height) {
			this.pos.y -= height - 40
			this.prevPos = this.pos.copy()
			return
		}
		if (this.pos.y < 40) {
			this.pos.y += height - 40
			this.prevPos = this.pos.copy()
			return
		}
	}

}