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
	}

	applyForce(force = createVector(0, 0)) {
		this.accVector.add(force)
	}

	update(deltaTime) {
		if (deltaTime < 1000) {
			this.velVector.add(this.accVector)
			this.pos.add(p5.Vector.mult(this.velVector, deltaTime))
			this.accVector = createVector(0, 0)
		}
	}

	checkPaddle(paddle = new Paddle) {
		if (this.pos.y > paddle.y && this.pos.y < paddle.bottom &&
			this.pos.x >= paddle.left && this.pos.x <= paddle.right) {
			this.pos.y = paddle.y
			let mag = this.velVector.mag()
			console.log(mag);
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
		fill(0)
		noStroke()
		ellipse(this.pos.x, this.pos.y, this.radius)
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