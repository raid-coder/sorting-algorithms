let cellHolder = document.getElementById("cells");

let baseRecord;
let currentRecord;
let records;

// generate cells

let cells;
let cellsN = 20;
let values;
let order;

let cellWidth;
let gapSize = 5;

function adjustSizes() {
	let spacesWidth = (cellsN - 1) * gapSize;

	let width = cellHolder.offsetWidth - spacesWidth;

	cellWidth = width / cellsN;

	for (const cell of cells) {
		cell.style.fontSize = cellWidth * (3 / 8) + "px";
	}
}

function initializeCellsInfo() {
	cells = Array.from(cellHolder.children);
	baseRecord = [...new Array(cellsN)].map((_, i) => ({
		offset: i,
		color: "",
		y: 0,
	}));
	resetRecords();
}

function generateCells(n) {
	cellsN = n;
	let resString = "";
	for (let i = 0; i < n; i++) {
		resString += `<div class="cell">${randomInt(0, 100)}</div>`;
	}

	cellHolder.innerHTML = resString;
	initializeCellsInfo();
	adjustSizes();
	setTransitions(speed);
	pause();
	currentFrame = 0;
	updateFrame(baseRecord);
}

// animation frames

function updateFrame(record) {
	for (let i = 0; i < cellsN; i++) {
		cells[i].style.left = record[i].offset * (cellWidth + gapSize) + "px";
		cells[i].style.top = record[i].y + "px";
		cells[i].style.backgroundColor = record[i].color;
	}
}

function storeRecord(record) {
	records.push(JSON.parse(JSON.stringify(record)));
}

function resetRecords() {
	values = cells.map((e) => +e.textContent);
	order = [...new Array(cellsN)].map((_, i) => i);
	currentRecord = JSON.parse(JSON.stringify(baseRecord));
	records = [JSON.parse(JSON.stringify(baseRecord))];
}

let currentFrame = 0;
let intervalId;

function animate() {
	currentFrame = 0;
	run();
}

function clearY() {
	for (el of currentRecord) {
		el.y = 0;
	}
}

function clearColors() {
	for (el of currentRecord) {
		el.color = "";
	}
}

function setColors(indices, color) {
	for (let index of indices) {
		currentRecord[order[index]].color = color;
	}
}

function randomInt(start, end) {
	// start <= n < end

	return Math.floor(Math.random() * (end - start)) + start;
}

function randomColor() {
	const hex = "0123456789abcdef";

	let res = "#";
	for (let i = 0; i < 3; i++) {
		res += hex[randomInt(0, 16)];
	}

	return res;
}

function swap(i, j) {
	let tmp = order[i];
	order[i] = order[j];
	order[j] = tmp;

	tmp = values[i];
	values[i] = values[j];
	values[j] = tmp;

	tmp = currentRecord[order[i]].offset;
	currentRecord[order[i]].offset = currentRecord[order[j]].offset;
	currentRecord[order[j]].offset = tmp;
}

// sorting functions

function bubbleSort() {
	completedCells = [];
	for (let i = cellsN - 1; i > 0; i--) {
		for (let j = 0; j < i; j++) {
			clearColors();
			setColors(completedCells, "green");
			currentRecord[order[j]].color = "orange";
			currentRecord[order[j + 1]].color = "blue";
			if (values[j] > values[j + 1]) {
				swap(j, j + 1);
			}
			storeRecord(currentRecord);
		}
		completedCells.push(i);
	}
	setColors(order, "green");
	storeRecord(currentRecord);
	animate();
}

function insertionSort() {
	sortedSubSet = [];

	for (let i = 0; i < cellsN; i++) {
		let j = i - 1;
		key = values[i];

		sortedSubSet.push(i);
		currentRecord[order[i]].y = 100;
		currentRecord[order[i]].color = "orange";
		storeRecord(currentRecord);

		while (j >= 0 && values[j] > key) {
			currentRecord[order[j + 1]].color = "orange";
			swap(j, j + 1);
			j--;
			storeRecord(currentRecord);
		}
		clearY();
		storeRecord(currentRecord);
		setColors(sortedSubSet, "#7cfd00");
	}
	setColors(order, "green");
	storeRecord(currentRecord);
	animate();
}

function selectionSort() {
	let minIndex;

	for (let i = 0; i < cellsN; i++) {
		minIndex = i;
		currentRecord[order[i]].color = "red";
		currentRecord[order[i]].y = 100;
		storeRecord(currentRecord);
		for (let j = i + 1; j < cellsN; j++) {
			currentRecord[order[j]].color = "orange";
			storeRecord(currentRecord);
			if (values[minIndex] > values[j]) {
				currentRecord[order[minIndex]].color = "";
				currentRecord[order[minIndex]].y = 0;
				currentRecord[order[j]].color = "red";
				currentRecord[order[j]].y = 100;
				minIndex = j;
				storeRecord(currentRecord);
			} else {
				currentRecord[order[j]].color = "";
			}
		}

		if (minIndex != i) {
			swap(i, minIndex);
			storeRecord(currentRecord);
		}
		currentRecord[order[i]].color = "#7cfd00";
		currentRecord[order[i]].y = 0;
		storeRecord(currentRecord);
	}

	setColors(order, "green");
	storeRecord(currentRecord);
	animate();
}

function merge(arr, l, m, r) {
	for (let i = l; i <= r; i++) {
		currentRecord[order[i]].y = 100;
	}
	storeRecord(currentRecord);

	let n1 = m - l + 1;
	let n2 = r - m;

	let L = new Array(n1);
	let R = new Array(n2);

	for (let i = 0; i < n1; i++) {
		L[i] = arr[l + i];
	}

	for (let i = 0; i < n1; i++) {
		R[i] = arr[m + 1 + i];
	}

	let [i, j, k] = [0, 0, l];

	currentOrder = [...order];

	let rColor = currentRecord[currentOrder[l]].color;
	while (i < n1 && j < n2) {
		if (L[i] <= R[j]) {
			arr[k] = L[i];
			currentRecord[currentOrder[l + i]].offset = k;
			currentRecord[currentOrder[l + i]].y = 0;
			currentRecord[currentOrder[l + i]].color = rColor;
			order[k] = currentOrder[l + i];
			i++;
		} else {
			arr[k] = R[j];
			currentRecord[currentOrder[m + 1 + j]].offset = k;
			currentRecord[currentOrder[m + 1 + j]].y = 0;
			currentRecord[currentOrder[m + 1 + j]].color = rColor;
			order[k] = currentOrder[m + 1 + j];
			j++;
		}
		k++;
		storeRecord(currentRecord);
	}

	while (i < n1) {
		arr[k] = L[i];
		currentRecord[currentOrder[l + i]].offset = k;
		currentRecord[currentOrder[l + i]].y = 0;
		currentRecord[currentOrder[l + i]].color = rColor;
		order[k] = currentOrder[l + i];
		i++;
		k++;
		storeRecord(currentRecord);
	}

	while (j < n2) {
		arr[k] = R[j];
		currentRecord[currentOrder[m + 1 + j]].offset = k;
		currentRecord[currentOrder[m + 1 + j]].y = 0;
		currentRecord[currentOrder[m + 1 + j]].color = rColor;
		order[k] = currentOrder[m + 1 + j];
		j++;
		k++;
		storeRecord(currentRecord);
	}
}

function mergeSort(arr, l, r) {
	let rColor = randomColor();
	for (let i = l; i <= r; i++) {
		currentRecord[order[i]].color = rColor;
	}
	storeRecord(currentRecord);

	if (l >= r) return;

	let m = l + parseInt((r - l) / 2);
	mergeSort(arr, l, m);
	mergeSort(arr, m + 1, r);
	merge(arr, l, m, r);
}

function doMergeSort() {
	mergeSort(values, 0, cellsN - 1);

	setColors(order, "green");
	storeRecord(currentRecord);
	animate();
}

function partition(arr, low, high) {
	let pivot = arr[high];
	currentRecord[order[high]].color = "orange";
	storeRecord(currentRecord);
	let i = low - 1;
	for (let j = low; j < high; j++) {
		currentRecord[order[j]].color = "blue";
		storeRecord(currentRecord);
		if (arr[j] < pivot) {
			i++;
			swap(i, j);
			storeRecord(currentRecord);
			currentRecord[order[i]].color = "";
		} else {
			currentRecord[order[j]].color = "";
		}
		storeRecord(currentRecord);
	}

	currentRecord[order[high]].color = "green";
	swap(i + 1, high);
	storeRecord(currentRecord);

	return i + 1;
}

function quickSort(arr, low, high) {
	if (low == high) {
		currentRecord[order[high]].color = "orange";
		storeRecord(currentRecord);
		currentRecord[order[high]].color = "green";
		storeRecord(currentRecord);
	}
	if (low < high) {
		let pi = partition(arr, low, high);

		quickSort(arr, low, pi - 1);
		quickSort(arr, pi + 1, high);
	}
}

function doQuickSort() {
	quickSort(values, 0, cellsN - 1);

	setColors(order, "green");
	storeRecord(currentRecord);
	animate();
}

// Sorting Logic

let sorted = false;
let currentSortType = "bubble";

let choices = document.getElementById("choices");

choices.addEventListener("change", function (e) {
	let target = e.target;
	currentSortType = target.getAttribute("data-algo");
});

// Time Controle

let sortBtn = document.querySelector(".sort-btn");

let toggleBtn = document.querySelector(".toggle");
let restartBtn = document.querySelector(".restart");

let running = false;

function run() {
	running = true;
	toggleBtn.classList.remove("paused");
	clearInterval(intervalId);
	intervalId = setInterval(() => {
		updateFrame(records[currentFrame]);
		currentFrame++;
		if (currentFrame >= records.length) {
			clearInterval(intervalId);
		}
	}, 1000 / speed);
}

function pause() {
	running = false;
	toggleBtn.classList.add("paused");
	clearInterval(intervalId);
}

sortBtn.addEventListener("click", function () {
	updateFrame(baseRecord);
	resetRecords();
	switch (currentSortType) {
		case "bubble":
			bubbleSort();
			break;
		case "insertion":
			insertionSort();
			break;
		case "selection":
			selectionSort();
			break;
		case "merge":
			doMergeSort();
			break;
		case "quick":
			doQuickSort();
			break;
	}
});

toggleBtn.addEventListener("click", function () {
	if (running) {
		pause();
	} else {
		run();
	}
});

restartBtn.addEventListener("click", function () {
	animate();
});

// speed

let speedBtn = document.querySelector(".speed");
let speedValueHolder = document.getElementById("speed-value");

let speedSlider = document.getElementById("speed-range-value");

let speed = 1;

function setSpeed() {
	setTransitions(speed);
	speedValueHolder.textContent = speed;
	speedSlider.value = speed;
	if (running) {
		clearInterval(intervalId);
		intervalId = setInterval(() => {
			updateFrame(records[currentFrame]);
			currentFrame++;
			if (currentFrame >= records.length) {
				clearInterval(intervalId);
			}
		}, 1000 / speed);
	}
}

speedBtn.addEventListener("click", function () {
	speed++;
	if (speed > 20) speed = 1;
	setSpeed();
});

function setTransitions(speed) {
	for (const cell of cells) {
		cell.style.setProperty(
			"transition",
			`left ${0.5 - (speed - 1) * 0.025}s ${
				speed > 2 ? 0 : 0.3 / speed
			}s ease-in-out, top ${0.5 - (speed - 1) * 0.025}s ${
				speed > 2 ? 0 : 0.3 / speed
			}s, background-color ${0.4 - (speed - 1) * 0.02}s`
		);
	}
}

speedSlider.addEventListener("click", function () {
	speed = +speedSlider.value;
	setSpeed();
});

// randomize

let randomBtn = document.getElementById("randomize-btn");
let numInput = document.getElementById("cells-N");

randomBtn.addEventListener("click", function () {
	pause();
	let numberOfCells = numInput.value;

	if (numberOfCells == "") {
		console.log("feild is empty !!");
		return;
	}

	numberOfCells = +numberOfCells;

	if (numberOfCells < 2 || numberOfCells > 100) {
		console.log("write a number between 3 and 100 !!");
		return;
	}

	generateCells(numberOfCells);
});

generateCells(10);

alert("Happy Birth Day !!! 🎈🎈🎉🥳🎁🎉🎈🎈");
