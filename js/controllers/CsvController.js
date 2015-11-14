function CsvController(event) {
	this.event = event;
}

CsvController.prototype.readSingleUploadCsvFile = function(callback) {
	// Check for the various File API support.
	if (window.FileReader) {
		var f = this.event.target.files[0];
		if (f) {
			var r = new FileReader();
			r.onload = function(e) {
				var csv = e.target.result;
				if (csv.length > 0) {
					var csvLines = csv.split(/\r\n|\n/), csvItems = [];
					$.map(csvLines, function(content) {
						if (content.length > 0) {
							var item = content.trimString();
							//var encodeContent = encodeURI(item);
							//csvItems.push(encodeContent);
							var decodeContent = decodeURI(item);
							csvItems.push(decodeContent);
						}
					});
					callback(csvItems);
				}
			}

			// Read file into memory as UTF-8
			r.readAsText(f);
		} else {
			alert("Failed to load file");
		}
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

CsvController.prototype.readCsvFileByAjax = function(url, callback) {
	// $.get( "input/cities_states.txt", function(csv) {
	// console.log(csv);
	// });
	$.ajax({
		type : "GET",
		url : url,
		dataType : "text/csv"
	}).done(function(csv) {
		if (csv.length > 0) {
			var csvLines = csv.split(/\r\n|\n/), csvItems = [];
			$.map(csvLines, function(content) {
				if (content.length > 0) {
					var item = content.trimString();
					csvItems.push(item);
				}
			});
			callback(csvItems);
		}
	}).fail(function(jqXHR, textStatus) {
		console.log("Request failed: " + textStatus);
	});
}