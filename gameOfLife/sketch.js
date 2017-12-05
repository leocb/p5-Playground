let grid = []

// spacing between cells, decreasing the spacing raises the number of cells on-screen
// be careful with low values, they will propably lag. A LOT.
let spacing = 10

function setup() {
	createCanvas(windowWidth, windowHeight);

	// Create the grid array using a perlin noise for the pattern
	for (let i = 0; i < width / spacing; i++) {
		grid.push([])
		for (let j = 0; j < height / spacing; j++) {
			grid[i].push(Math.round(noise(i / 10, j / 10)))
		}
	}

	//no borders
	noStroke()
}


function draw() {

	let newGrid = []

	// Run each cell in the grid
	for (let i = 0; i < grid.length; i++) {
		newGrid.push([])
		for (let j = 0; j < grid[i].length; j++) {

			// reset the neighbors counter
			let neighbors = 0

			// sum all neighbors states
			for (let y = -1; y <= 1; y++) {
				for (let x = -1; x <= 1; x++) {
					if ((i + x) in grid && (j + y) in grid[i + x]) {
						neighbors += grid[i + x][j + y]
					}
				}
			}
			// minus the current cell state
			neighbors -= grid[i][j]

			// apply the game of life rules:
			// DEAD if lonely (neighbors <= 1) or if over populated (neighbors >= 4)
			if ((grid[i][j] == 1 && neighbors >= 4) ||
				(grid[i][j] == 1 && neighbors <= 1)) {
				newGrid[i].push(0)
				continue
			}
			// COME ALIVE if it is DEAD and has 3 neighbors
			if (grid[i][j] == 0 && neighbors == 3) {
				newGrid[i].push(1)
				continue
			}
			//everyone else, just stay as-is
			let a = newGrid[i].push(grid[i][j])


		}
	}

	// copy the new grid to the main grid
	// slice() is necessary to copy the array as values, not as references
	grid = newGrid.slice()


	//Draw everyone
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			fill(newGrid[i][j] == 1 ? 0 : 255)
			rect(i * spacing, j * spacing, spacing, spacing)
		}
	}

}