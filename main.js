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

function updateFrame(record) {
	for (let i = 0; i < cellsN; i++) {
		cells[i].style.left = record[i].offset * 60 + 40 + "px";
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

function randomInt(start, end) {
	// start <= n < end

	return Math.floor(Math.random() * (end - start)) - start;
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

function merge(arr, l, m, r) {
	for (let i = l; i <= r; i++) {
		currentRecord[order[i]].y = 200;
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
			currentRecord[currentOrder[l + i]].y = 100;
			currentRecord[currentOrder[l + i]].color = rColor;
			order[k] = currentOrder[l + i];
			i++;
		} else {
			arr[k] = R[j];
			currentRecord[currentOrder[m + 1 + j]].offset = k;
			currentRecord[currentOrder[m + 1 + j]].y = 100;
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
		currentRecord[currentOrder[l + i]].y = 100;
		currentRecord[currentOrder[l + i]].color = rColor;
		order[k] = currentOrder[l + i];
		i++;
		k++;
		storeRecord(currentRecord);
	}

	while (j < n2) {
		arr[k] = R[j];
		currentRecord[currentOrder[m + 1 + j]].offset = k;
		currentRecord[currentOrder[m + 1 + j]].y = 100;
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

doQuickSort();
