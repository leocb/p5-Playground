let grid = []
let gridXSize
let gridYSize

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

	// Precache grid size
	gridXSize = grid.length
	gridYSize = grid[0].length

	// no borders
	noStroke()
}


function draw() {

	let newGrid = []

	// Run each cell in the grid
	for (let i = 0; i < gridXSize; i++) {
		newGrid.push([])
		for (let j = 0; j < gridYSize; j++) {

			// reset the neighbors counter
			let neighborsTotalState = 0

			// sum all neighbors states
			for (let y = -1; y <= 1; y++) {
				for (let x = -1; x <= 1; x++) {

					//Infinite edges wrap around
					nX = (gridXSize + i + x) % gridXSize
					nY = (gridYSize + j + y) % gridYSize
					neighborsTotalState += grid[nX][nY]
				}
			}
			// minus the current cell state
			neighborsTotalState -= grid[i][j]

			// apply the game of life rules:
			// DEAD if lonely (neighbors <= 1) or if over populated (neighbors >= 4)
			if ((grid[i][j] == 1 && neighborsTotalState >= 4) ||
				(grid[i][j] == 1 && neighborsTotalState <= 1)) {
				newGrid[i].push(0)
				fill(255)
				rect(i * spacing, j * spacing, spacing, spacing)
				continue
			}
			// COME ALIVE if it is DEAD and has 3 neighbors
			if (grid[i][j] == 0 && neighborsTotalState == 3) {
				newGrid[i].push(1)
				fill(0)
				rect(i * spacing, j * spacing, spacing, spacing)
				continue
			}
			//everyone else, just stay as-is
			let a = newGrid[i].push(grid[i][j])


		}
	}

	// copy the new grid to the main grid
	// slice() is necessary to copy the array as values, not as references
	grid = newGrid.slice()

}