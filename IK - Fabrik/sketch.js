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

function setup() {
	createCanvas(windowWidth - 40, windowHeight);
	pixelDensity(1)

	target = new Point2d(0, 0)

	// Create the joints
	joints.push(new Segment(40, 0, 0))
	joints.push(new Segment(50, 0, 0))
	joints.push(new Segment(60, 0, 0))
	joints.push(new Segment(80, 0, 0))

	for (let i = 0; i < joints.length; i++) {
		totalLength += joints[i].length
	}

	jointCount = joints.length
	tipJoint = joints[jointCount - 1]
	rootJoint = joints[0]
	rootPoint = new Point2d(width / 2, height / 2)

}

function draw() {

	// Update target
	target.updatePos(mouseX, mouseY)

	let endEffector = tipJoint.getTip()
	let toTarget = { x: (target.x - endEffector.x), y: (target.y - endEffector.y) } // vector from tip to target

	// The distance between root and target
	let distRootTarget = distanceBetween(joints[0], target)

	// Check whether the target is within reach
	if (distRootTarget > totalLength) {

		// The target is unreachable
		// Calculate the angle between root and target
		let angle = pointsAtan2(rootJoint, target)

		// Move all the joints to point at target
		rootJoint.moveRootToAtAngle(rootPoint, angle)
		for (let i = 1; i < jointCount; i++) {
			joints[i].moveRootToAtAngle(joints[i - 1].getTip(), angle)
		}

	} else {
		// The target is reachable
		// Backward reaching
		tipJoint.moveTipToAtAngle(target, pointsAtan2(tipJoint, target))
		for (let i = jointCount - 2; i >= 0; i--) {
			joints[i].moveTipToAtAngle(joints[i + 1], pointsAtan2(joints[i], joints[i + 1]))
		}
		// Forward reaching
		rootJoint.moveRootToAtAngle(rootPoint, pointsAtan2(rootPoint, joints[1]))
		for (let i = 1; i < jointCount - 1; i++) {
			joints[i].moveRootToAtAngle(joints[i - 1].getTip(), pointsAtan2(joints[i], joints[i + 1]))
		}
		tipJoint.moveRootToAtAngle(joints[jointCount - 2].getTip(), pointsAtan2(tipJoint, target))

	}


	// Draw everybody
	background(255)
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
	return Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x)
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
	constructor(length, posX, posY) {
		this.length = length
		this.angle = 45
		this.x = posX
		this.y = posY
	}

	moveRootToAtAngle(point, angle) {
		this.x = point.x
		this.y = point.y
		this.angle = angle
	}

	moveTipToAtAngle(point, angle) {
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