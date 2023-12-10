let cellHolder = document.getElementById("cells");
let cells = Array.from(cellHolder.children);
let cellsN = cells.length;
let values = cells.map((e) => +e.textContent);

let order = [...new Array(cellsN)].map((_, i) => i);
let baseRecord = order.map((_, i) => ({
	offset: i,
	color: "",
}));
let currentRecord = JSON.parse(JSON.stringify(baseRecord));
let records = [JSON.parse(JSON.stringify(currentRecord))];

console.log("first record " + currentRecord.toString());

function updateFrame(record) {
	for (let i = 0; i < cellsN; i++) {
		cells[i].style.left = record[i].offset * 100 + 40 + "px";
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
	complitedCells = [];
	for (let i = cellsN - 1; i > 0; i--) {
		for (let j = 0; j < i; j++) {
			clearColors();
			setColors(complitedCells, "green");
			currentRecord[order[j]].color = "orange";
			currentRecord[order[j + 1]].color = "blue";
			if (values[j] > values[j + 1]) {
				swap(j, j + 1);
			}
			storeRecord(currentRecord);
		}
		complitedCells.push(i);
	}
	setColors(order, "green");
	storeRecord(currentRecord);
	animate();
}

console.log(records);
