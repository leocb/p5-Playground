let paddle
let ball


function setup() {
	// sidebar is 45px wide
	createCanvas(windowWidth - 45, windowHeight);

	frameRate(60)

	paddle = new Paddle(width / 2, height / 2, width, 20)
	ball = new Ball(100 / 2, 100 / 2, 7, createVector(10, 10))
}

function draw() {
	//background(255)
	let dt = 100 / frameRate()

	paddle.moveTo(Math.min(Math.max(paddle.halfWidth, mouseX), width - paddle.halfWidth))
	ball.update(dt)
	ball.checkBounds(0, 0, width, height)
	ball.checkPaddle(paddle)
	ball.draw()
	paddle.draw()
	// text(ball.pos.x, 100, 100)
	// text(ball.pos.y, 100, 120)
}

class Ball {
	constructor(posX, posY, radius, velocityVector) {
		this.pos = createVector(posX, posY)
		this.velVector = velocityVector
		this.accVector = createVector(0, 0)
		this.radius = radius
		this.diameter = this.radius * 2
		this.prev = this.pos
		this.vMax = 10

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
		let intersectPoint = intersect(this.prev.x, this.prev.y + this.radius, this.pos.x, this.pos.y + this.radius, paddle.left, paddle.y, paddle.right, paddle.y)
		if (intersectPoint) {

			// calculate how much remains of the path
			let remaingVector = this.pos.copy()
			remaingVector.y += this.radius
			remaingVector.sub(intersectPoint).add(intersectPoint)
			console.log(remaingVector.mag())
			console.log(remaingVector.heading());

			//remaingVector.rotate(-remaingVector.copy().normalize().heading())
			console.log(remaingVector.mag())
			console.log(this.velVector.mag())

			fill(0, 255, 0, 120)
			ellipse(intersectPoint.x, intersectPoint.y, 40)
			stroke(255, 0, 0)
			line(intersectPoint.x, intersectPoint.y, this.prev.x, this.prev.y + this.radius)
			stroke(0, 255, 0)
			line(intersectPoint.x, intersectPoint.y, remaingVector.x, remaingVector.y)

			this.velVector = p5.Vector.fromAngle(radians(map(intersectPoint.x, paddle.left, paddle.right, 210, 330))).mult(Math.min(this.velVector.mag() * 1.02, this.vMax))
			// this.pos.add(p5.Vector.mult(this.velVector, deltaTime))
			//this.pos = this.velVector.add()
			console.log(remaingVector);
			//this.pos.add(remaingVector)
			this.velVector.mult(0)
			//this.pos.y = (intersectPoint.y - (this.pos.y + this.diameter)) + intersectPoint.y


			stroke(0, 0, 255)

			line(intersectPoint.x, intersectPoint.y, this.pos.x, this.pos.y + this.radius)
		}
		intersectPoint = intersect(this.prev.x, this.prev.y, this.pos.x, this.pos.y, paddle.right, paddle.y, paddle.right, paddle.bottom)
		if (intersectPoint) {
			this.pos.y = intersectPoint.y - this.pos.y + intersectPoint.y
			this.pos.x = intersectPoint.x - this.pos.x + intersectPoint.x
			this.velVector.mult(-1)
		}
		intersectPoint = intersect(this.prev.x, this.prev.y, this.pos.x, this.pos.y, paddle.left, paddle.y, paddle.left, paddle.bottom)
		if (intersectPoint) {
			this.pos.y = intersectPoint.y - this.pos.y + intersectPoint.y
			this.pos.x = intersectPoint.x - this.pos.x + intersectPoint.x
			this.velVector.mult(-1)
		}
	}

	checkBounds(left, top, right, bottom) {
		if (this.pos.x < left) {
			this.pos.x = left - this.pos.x + left
			this.velVector.x *= -1
		}
		if (this.pos.x > right) {
			this.pos.x = right - this.pos.x + right
			this.velVector.x *= -1
		}
		if (this.pos.y < top) {
			this.pos.y = top - this.pos.y + top
			this.velVector.y *= -1
		}
		if (this.pos.y > bottom) {
			//this.velVector.mult(0)
		}
	}

	draw() {
		ellipseMode(CENTER)
		stroke(0)
		line(this.pos.x, this.pos.y, this.prev.x, this.prev.y)

		noStroke()
		fill(0)

		ellipse(this.pos.x, this.pos.y, this.diameter)
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

	denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

	if (denominator === 0) {
		return false
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false
	}

	let x = x1 + ua * (x2 - x1)
	let y = y1 + ua * (y2 - y1)

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