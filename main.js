let cellHolder = document.getElementById("cells");
let cells = Array.from(cellHolder.children);
let cellsN = cells.length;
let values = cells.map((e) => +e.textContent);

let order = [...new Array(cellsN)].map((_, i) => i);
let baseRecord = order.map((_, i) => ({
	offset: i,
	color: "",
	y: 100,
}));
let currentRecord = JSON.parse(JSON.stringify(baseRecord));
let records = [JSON.parse(JSON.stringify(currentRecord))];

console.log("first record " + currentRecord.toString());

function updateFrame(record) {
	for (let i = 0; i < cellsN; i++) {
		cells[i].style.left = record[i].offset * 100 + 40 + "px";
		cells[i].style.top = record[i].y + "px";
		cells[i].style.backgroundColor = record[i].color;
	}
}

updateFrame(baseRecord);

function storeRecord(record) {
	records.push(JSON.parse(JSON.stringify(record)));
}

function animate() {
	let i = 0;
	let id = setInterval(() => {
		updateFrame(records[i]);
		i++;
		if (i == records.length) {
			clearInterval(id);
		}
	}, 1000);
}

function clearY() {
	for (el of currentRecord) {
		el.y = 100;
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
		currentRecord[order[i]].y = 200;
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
		currentRecord[order[i]].y = 200;
		storeRecord(currentRecord);
		for (let j = i + 1; j < cellsN; j++) {
			currentRecord[order[j]].color = "orange";
			storeRecord(currentRecord);
			if (values[minIndex] > values[j]) {
				currentRecord[order[minIndex]].color = "";
				currentRecord[order[minIndex]].y = 100;
				currentRecord[order[j]].color = "red";
				currentRecord[order[j]].y = 200;
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
		currentRecord[order[i]].y = 100;
		storeRecord(currentRecord);
	}

	setColors(order, "green");
	storeRecord(currentRecord);
	animate();
}

selectionSort();
