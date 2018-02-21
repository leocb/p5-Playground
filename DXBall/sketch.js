let paddle
let ball


function setup() {
	// sidebar is 45px wide
	createCanvas(windowWidth - 45, windowHeight);

	frameRate(60)
	angleMode(DEGREES)

	paddle = new Paddle(width / 2, height - 50, 150, 20)
	ball = new Ball(width / 2, height / 2, 15, createVector(2, 2))
}

function draw() {
	background(255)
	let dt = 100 / frameRate()

	paddle.moveTo(Math.min(Math.max(paddle.halfWidth, mouseX), width - paddle.halfWidth))
	ball.checkBounds(0, 0, width, height)
	ball.checkPaddle(paddle)
	ball.update(dt)
	ball.draw()
	paddle.draw()
	text(ball.velVector.x, 100, 100)
	text(ball.velVector.y, 100, 120)
}

class Ball {
	constructor(posX, posY, radius, velocityVector) {
		this.pos = createVector(posX, posY)
		this.velVector = velocityVector
		this.accVector = createVector(0, 0)
		this.radius = radius
		this.prev = this.pos
	}

	applyForce(force = createVector(0, 0)) {
		this.accVector.add(force)
	}

	update(deltaTime) {
		this.prev = createVector(this.pos.x, this.pos.y)
		if (deltaTime < 1000) {
			this.velVector.add(this.accVector)
			this.pos.add(p5.Vector.mult(this.velVector, deltaTime))
			this.accVector = createVector(0, 0)
		}
	}

	checkPaddle(paddle = new Paddle) {
		let intersectPoint = intersect(this.prev.x, this.prev.y, this.pos.x, this.pos.y, paddle.left, paddle.y, paddle.right, paddle.y)
		console.log(this.prev.x, this.prev.y, this.pos.x, this.pos.y, paddle.left, paddle.y, paddle.right, paddle.y, intersectPoint);
		if (intersectPoint) {
			this.pos.y = intersectPoint.y - this.pos.y + intersectPoint.y
			let mag = this.velVector.mag()
			this.velVector = p5.Vector.fromAngle(radians(map(this.pos.x, paddle.left, paddle.right, 210, 330))).mult(Math.min(mag * 1.2, 7))
		}
	}

	checkBounds(boundCornerX, boundCornerY, boundWidth, boundHeight) {
		if (this.pos.x < boundCornerX) {
			this.pos.x += boundCornerX - (this.pos.x)
			this.velVector.x *= -1
		}
		if (this.pos.x > boundCornerX + boundWidth) {
			this.pos.x += (boundCornerX + boundWidth) - (this.pos.x)
			this.velVector.x *= -1
		}
		if (this.pos.y < boundCornerY) {
			this.pos.y += boundCornerY - (this.pos.y)
			this.velVector.y *= -1
		}
		if (this.pos.y > boundCornerY + boundHeight) {
			// this.pos.y += (boundCornerY + boundHeight) - (this.pos.y)
			// this.velVector.y *= -1
			this.velVector.mult(0)
		}
	}

	draw() {
		ellipseMode(CENTER)
		noStroke()
		fill(0)
		ellipse(this.pos.x, this.pos.y, this.radius)
		fill(200, 100, 100)
		ellipse(this.prev.x, this.prev.y, this.radius)

	}
}

class Brick {
	constructor(posX, posY, size, color, powerUp) {
		this.x = posX
		this.y = posY
		this.size = size
		this.color = color
		this.powerUp = powerUp
	}

	setDrawMode() {
		rectMode(CENTER)
		noStroke()
	}

	draw() {
		fill(color)
		rect(x, y, size * 2, size)
	}

	checkBounds(ball) {

	}
}

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) { // one of the lines is length 0
		return false
	}
	let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)
	if (x === -Infinity || x === Infinity || y === -Infinity || y === Infinity) {
		return false
	}
	return createVector(x, y)
}


class PowerUp {
	constructor(type = powerTypes) {
		this.type = type
	}
}

const powerTypes = {
	paddle: {
		GROW: 'GROW',
		SHRINK: 'SHRINK',
		TINY: 'TINY',
		LASER: 'LASER',
		CATCHER: 'CATCHER',
		TILT: 'TILT',
	},
	ball: {
		SLOWER: 'SLOWER',
		FASTER: 'FASTER',
		BIG: 'BIG',
		TINY: 'TINY',
		FIRE: 'FIRE',
		UNSTOPPABLE: 'UNSTOPPABLE',
		SPLIT: 'SPLIT',
		EIGHT: 'EIGHT',
		ROAMING: 'ROAMING',
	},
	brick: {
		GROWEXPLOSION: 'GROWEXPLOSION',
		EXPLODE: 'EXPLODE',
		PUSHER: 'PUSHER',
		WEAKEN: 'WEAKEN',
	},
	player: {
		ONEUP: 'ONEUP',
		DIE: 'DIE',
	}
}

class Paddle {
	constructor(posX, posY, sizeX, sizeY) {
		this.x = posX
		this.y = posY
		this.width = sizeX
		this.height = sizeY
		this.halfWidth = this.width / 2
		this.halfHeight = this.height / 2
		this.left = this.x - this.halfWidth
		this.right = this.x + this.halfWidth
		this.bottom = this.y + this.height
	}

	moveTo(newX) {
		this.x = newX
		this.left = this.x - this.halfWidth
		this.right = this.x + this.halfWidth
	}

	draw() {
		rectMode(CENTER)
		fill(0, 100, 255, 200)
		noStroke()
		rect(this.x, this.y + this.halfHeight, this.width, this.height)
	}
}