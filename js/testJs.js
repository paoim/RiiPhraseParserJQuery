function TestJs(){}

TestJs.prototype.init = function() {
	console.log(jsTest());

	var arr = [];
	for (var i = 0; i < 20000; i++) {
		arr.push(i);
	}
	// console.log(arr);
	console.log(binarySearch(arr, 345));

	var setTests = {
		Spot : true
	};
	addToSet(setTests, arr);
	console.log(setTests);
	
	var a = [123, 124, 125], b = [1, 2, 3, 4, 5];
	console.log(intersect(a, b));
	
	jsonTable();
}

function jsTest() {
	var index = 0;
	var counter = 0;
	var obj = {};

	obj.index = index;

	var func = function() {
		for (index = 0; index < 10; index++) {
			counter += 2;
		}
		obj.index++;
	};

	obj.func = func;
	this.index++;

	return index;
}

function binarySearch(array, searchValue){
	var low = 0, high = array.length -1, mid = (low + high) / 2;
	
	while(low <= high && array[mid] != searchValue){
		if(array[mid] < searchValue){
			low = mid + 1;
		}
		else{
			high = mid - 1;
		}
		
		mid = (low + high) / 2;
	}
	
	if(low > high){
		mid = -1;
	}
	
	return mid;
}

function addToSet(set, values){
	for(var i = 0; i < values.length; i++){
		set[values[i]] = true;
	}
}

function intersect(a, b) {
	var ai = 0, bi = 0, result = [];

	while (ai < a.length && bi < b.length) {
		if (a[ai] < b[bi]) {
			ai++;
		} else if (a[ai] > b[bi]) {
			bi++;
		} else {
			result.push(a[ai]);
			ai++;
			bi++;
		}
	}

	return result;
}

function jsonTable() {
	var data = {
		headers : [ "First Name", "Last Name", "Age" ],
		rows : [ [ "John", "Doe", 30 ], [ "Jane", "Doe", 27 ],
				[ "Mac", "Smith", 52 ] ]
	};
	var container = document.getElementById("tableContainer");
	
	//add code here to build a table in the container
	
	bindTableData(data.headers, container);//Header of table
	
	//Content of table
	$.map(data.rows, function(row){
		bindTableData(row, container);
	});
}

function bindTableData(values, container){
	var rowContainer = document.createElement("tr"); //create row
	container.appendChild(rowContainer); //add or append to table
	
	$.map(values, function(value){
		var colContainer = document.createElement("td"); //create column
		var textContainer = document.createTextNode(value); // add or append to row
		rowContainer.appendChild(colContainer);
		colContainer.appendChild(textContainer);
	});
}