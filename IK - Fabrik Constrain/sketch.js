// Reference:
// http://www.andreasaristidou.com/publications/papers/CUEDF-INFENG,%20TR-632.pdf
// http://www.andreasaristidou.com/FABRIK.html

let jointCount
let totalLength = 1
let joints = []
let tipJoint
let rootJoint
let target
let rootPoint
let halfScreenWidth
let halfScreenHeight

function setup() {
	createCanvas(windowWidth - 40, windowHeight);
	halfScreenWidth = (windowWidth - 40) / 2
	halfScreenHeight = windowHeight / 2
	pixelDensity(1)
	textAlign(CENTER, CENTER)

	target = new Point2d(0, 0)

	// Create the joints
	joints.push(new Segment(40, 0, 0, HALF_PI / 2))
	joints.push(new Segment(50, 0, 0, HALF_PI / 2))
	joints.push(new Segment(60, 0, 0, HALF_PI / 2))
	joints.push(new Segment(80, 0, 0, HALF_PI / 2))

	for (let i = 0; i < joints.length; i++) {
		totalLength += joints[i].length
	}

	jointCount = joints.length
	tipJoint = joints[jointCount - 1]
	rootJoint = joints[0]
	rootPoint = new Point2d(width / 2, height / 2)

}

function draw() {
	// Clear
	background(255)
	noStroke();
	text('Move your mouse or', halfScreenWidth, halfScreenHeight - 10)
	text('Touch and drag on the screen', halfScreenWidth, halfScreenHeight + 10)

	// Update target
	target.updatePos(mouseX, mouseY)

	// The distance between root and target
	let distRootTarget = distanceBetween(joints[0], target)

	// Backward reaching
	tipJoint.moveTipToAtAngle(target, pointsAtan2(tipJoint, target))
	for (let i = jointCount - 2; i >= 0; i--) {
		joints[i].moveTipToAtAngle(joints[i + 1], pointsAtan2(joints[i], joints[i + 1]), joints[i + 1].angle)
	}
	// Forward reaching
	//rootJoint.moveRootToAtAngle(rootPoint, pointsAtan2(rootPoint, joints[1]))
	for (let i = 1; i < jointCount - 1; i++) {
		joints[i].moveRootToAtAngle(joints[i - 1].getTip(), pointsAtan2(joints[i], joints[i + 1]))
	}
	tipJoint.moveRootToAtAngle(joints[jointCount - 2].getTip(), pointsAtan2(tipJoint, target))


	// Draw everybody
	target.draw()
	joints[0].draw(true)
	for (let i = 1; i < jointCount; i++) {
		joints[i].draw()
	}
}

function distanceBetween(pointA, pointB) {
	return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2))
}

function pointsAtan2(pointA, pointB) {
	let newAngle = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x)
	let diff = (newAngle - pointA.angle)
	if (diff >= 0) {
		diff = (diff + PI) % TWO_PI - PI
	} else {
		diff = (diff - PI) % TWO_PI + PI
	}
	// return pointA.angle + diff
	return pointA.angle + diff
}

class Point2d {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	draw() {
		stroke(13, 71, 161)
		strokeWeight(30)
		point(this.x, this.y)
	}

	updatePos(x, y) {
		this.x = x
		this.y = y
	}
}

class Segment {
	constructor(length, posX, posY, maxAngle) {
		this.length = length
		this.angle = 0
		this.maxAngle = maxAngle
		this.x = posX
		this.y = posY
	}

	moveRootToAtAngle(point, angle) {
		this.x = point.x
		this.y = point.y
		this.angle = angle
	}

	moveTipToAtAngle(point, angle, previousJointAngle = null) {
		if (previousJointAngle) {
			if (angle > previousJointAngle + this.maxAngle) {
				angle = previousJointAngle + this.maxAngle
			}
			if (angle < previousJointAngle - this.maxAngle) {
				angle = previousJointAngle - this.maxAngle
			}
		}
		this.x = point.x + (Math.cos(angle + PI) * this.length)
		this.y = point.y + (Math.sin(angle + PI) * this.length)
		this.angle = angle
	}

	draw(primary) {
		strokeWeight(10)
		if (primary)
			stroke(0, 40, 80, 200)
		else
			stroke(0, 0, 0, 200)
		line(this.x, this.y, Math.cos(this.angle) * this.length + this.x, Math.sin(this.angle) * this.length + this.y)
	}

	getTip() {
		return { x: Math.cos(this.angle) * this.length + this.x, y: Math.sin(this.angle) * this.length + this.y }
	}
}