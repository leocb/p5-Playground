// Reference:
// https://www.webcitation.org/60uCFHqC2?url=http://freespace.virgin.net/hugo.elias/models/m_ik2.htm

let jointCount
let jointLength = 120
let totalLength = 1
let joints = []
let tipJoint
let target

function setup() {
	createCanvas(windowWidth - 40, windowHeight);
	pixelDensity(1)

	target = new Point2d(0, 0)

	// Create the joints
	joints.push(new Segment(40, width / 2, height / 2))
	joints.push(new Segment(80, width / 2, height / 2))
	joints.push(new Segment(120, width / 2, height / 2))

	for (let i = 0; i < joints.length; i++) {
		totalLength += joints[i].length
	}

	jointCount = joints.length
	tipJoint = joints[jointCount - 1]

}

function draw() {

	// Update target
	target.updatePos(mouseX, mouseY)

	// Gradient by Calculation (Thanks Newton!)
	let axis = { z: 1 }
	let tipJointTip = tipJoint.getTip()
	let toTarget = { x: (target.x - tipJointTip.x), y: (target.y - tipJointTip.y) } // vector from tip to target

	for (let i = 0; i < jointCount; i++) {

		joint = joints[i]

		// get the new position for the current joint based on the tip of the previous
		if (i > 0) {
			joint.x = joints[i - 1].getTip().x
			joint.y = joints[i - 1].getTip().y
		}


		// get the closest gradient slope for this joint
		let toTip = { x: (tipJointTip.x - joint.x), y: (tipJointTip.y - joint.y) } // vector from current joint to tip
		movement_vector = { x: toTip.y * axis.z, y: -toTip.x * axis.z } // cross
		gradient = (movement_vector.x * toTarget.x + movement_vector.y * toTarget.y) // dot

		joint.angle -= radians(gradient / 20) // resulting gradient

	}

	// Draw everybody
	background(255)
	target.draw()
	for (let i = 0; i < jointCount; i++) {
		joints[i].draw()
	}
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

	draw() {
		strokeWeight(10)
		stroke(0, 0, 0, 200)
		line(this.x, this.y, Math.cos(radians(this.angle)) * this.length + this.x, Math.sin(radians(this.angle)) * this.length + this.y)
	}

	getTip() {
		return { x: Math.cos(radians(this.angle)) * this.length + this.x, y: Math.sin(radians(this.angle)) * this.length + this.y }
	}
}