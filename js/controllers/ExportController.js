function ExportController() {
}

function generateNext(){
	var startCol = 1, colLocation = 0, totalIdentifyCheckBoxItems = 0, phrases = [], isLocation = false, isMake = false, isYear = false;
	var totalIdentifyPhrases = $("#specifyKeyWord").data("totalIdentifyPhrases"), totalColumns = $("#specifyKeyWord").data("totalColumns"), isMixedPhrase = $("#generatePhrase").data("isMixedPhrase");
	
	if (!isMixedPhrase) {
		startCol = 3;
		colLocation = 2;
	}
	
	// Get all check box except Location
	for (var c = startCol; c < totalColumns; c++) {
		for (var r = 0; r < totalIdentifyPhrases; r++) {
			totalIdentifyCheckBoxItems += $("#ip_row_" + r + "_" + c + " input:checked").length;
		}
	}
	
	// Validate
	if (totalIdentifyCheckBoxItems == 0) {
		alert("Please check on CheckBox for 'Broad', 'Phrase', 'Exact', 'Modified Broad'!");
	}
	else{
		
		for (var r = 0; r < totalIdentifyPhrases; r++){
			
			var rowPhrases = [], rowTypes = [];
			
			//Get all values from Broad, Phrase, Exact, and Modified Broad
			for (var c = startCol; c < totalColumns; c++){
				var phrase = $("#ip_row_" + r + "_" + c + " input:checked").val();
				if (phrase) {
					var phraseJson = JSON.parse(phrase);
					rowPhrases.push(phraseJson);
				}
			}
			
			//Get all values from Years, Make/Model, Location
			for(var c = 0; c < startCol; c++){
				$("#ip_row_" + r + "_" + c + " input:checked").each(function(){
					var data = $(this).val(), type = "";
					if(data){
						if(data == ("year_" + r)){
							type = "year";
							isYear = true;
						}
						else if(data == ("make_" + r)){
							 type = "make";
							 isMake = true;
						}
						else if(data == ("location_" + r)){
							 type = "location";
							 isLocation = true;
						}
						rowTypes.push(type);
					}
				});
			}
			
			//Combine type & phrase & identify
			if(rowPhrases.length > 0){
				$.map(rowPhrases, function(item){
					var type = (rowTypes.length > 0 ? rowTypes.join(",") : "");
					var phrase = { type : type, label : item.label, identify : item.identify, isLocation : isLocation, isMake : isMake, isYear : isYear};
					phrases.push(phrase);
				});
			}
			
		}
		
	}
	
	if(phrases.length > 0){
		phrases.sort(sortPhrasesByIdentify);
		setLocalStorages("phs", phrases);
		window.location = "csv.html"
		//window.location = "csv.html?phs=" + encodeURIComponent(JSON.stringify(phrases));
	}
}

function exportPhrasesOld(){
	var start = 1, colLocation = 0, totalIdentifyCheckBoxItems = 0, strFileName = $("#exportCsvFile").val();
	var totalIdentifyPhrases = $("#specifyKeyWord").data("totalIdentifyPhrases"), totalColumns = $("#specifyKeyWord").data("totalColumns"), isMixedPhrase = $("#generatePhrase").data("isMixedPhrase");

	if (!isMixedPhrase) {
		start = 3;
		colLocation = 2;
	}

	// Get all check box except Locations
	for (var c = start; c < totalColumns; c++) {
		for (var r = 0; r < totalIdentifyPhrases; r++) {
			totalIdentifyCheckBoxItems += $("#ip_row_" + r + "_" + c + " input:checked").length;
		}
	}

	// Validate
	if (totalIdentifyCheckBoxItems == 0) {
		alert("Please check on CheckBox for 'Broad', 'Phrase', 'Exact', 'Modified Broad'!");
	} else if (strFileName.length == 0) {
		alert("Please input export Csv file!");
		$("#exportCsvFile").focus();
	} else {
		var csvExports = [], rangeYearNo = 0, makeModelNo = 0, locationNo = 0, startYear = 0, endYear = 0;
		var makeModels = $("#uploadMakeModel").data("makeModels") || [], statesCities = $("#uploadStatesCities").data("statesCities") || [];

		// Check for Year's range or Make/Model
		if (!isMixedPhrase) {
			// Get all Year's range
			for (var r = 0; r < totalIdentifyPhrases; r++) {
				rangeYearNo += $("#ip_row_" + r + "_0 input:checked").length;
			}

			if (rangeYearNo > 0 && !$("#defaultRangeYears").is(':checked')) {
				startYear = $("#startYear").val();
				endYear = $("#endYear").val();

				if (startYear.length == 0) {
					alert("Please input year's start!");
					$("#startYear").focus();
					return false;
				} else if (endYear.length == 0) {
					alert("Please input year's end!");
					$("#endYear").focus();
					return false;
				} else if (startYear > endYear) {
					alert("Year's end must be bigger than year's start, please input it again!");
					$("#endYear").val("");
					$("#endYear").focus();
					return false;
				}
			}

			// Get all make/model from checkbox
			for (var r = 0; r < totalIdentifyPhrases; r++) {
				makeModelNo += $("#ip_row_" + r + "_1 input:checked").length;
			}

			if (makeModelNo > 0 && makeModels.length == 0) {
				alert("Please upload Make/Model in CSV file!");
				return false;
			}
		}

		// Get all locations from check box
		for (var r = 0; r < totalIdentifyPhrases; r++) {
			locationNo += $("#ip_row_" + r + "_" + colLocation + " input:checked").length;
		}

		if (locationNo > 0 && statesCities.length == 0) {
			alert("Please upload States and Cities in CSV file!");
			return false;
		}
		
		//Get All Data from DOM
		var years = generateRangeYears(startYear, endYear);
		for (var r = 0; r < totalIdentifyPhrases; r++) {
			var phrases = $("#ip_row_" + r + "_0").data("phraseRow_" + r);
			if(phrases){
				$.map(phrases, function(phrase){
					var type = phrase.type;
					var types = (type.length > 0 ? phrase.type.split(",") : []);
					if(types.length > 0){
						var yearPhrases = [], makePhrases = [], locationPhrases = [];
						$.map(types, function(type){
							if(type == "year"){
								$.map(years, function(year){
									var yearPhrase = {prefix : year, label : phrase.label, identify : phrase.identify};
									yearPhrases.push(yearPhrase);
								});
							}
							else if(type == "make"){
								$.map(makeModels, function(make){
									var makePhrase = {prefix : make, label : phrase.label, identify : phrase.identify};
									makePhrases.push(makePhrase);
								}); 
							}
							else if(type == "location"){
								$.map(statesCities, function(location){
									var locationPhrase = {suffix : location, label : phrase.label, identify : phrase.identify};
									locationPhrases.push(locationPhrase);
								});
							}
						});
						
						if(yearPhrases.length > 0 && makePhrases.length > 0 && locationPhrases.length > 0){
							$.map(yearPhrases, function(year){
							 	$.map(makePhrases, function(make){
									$.map(locationPhrases, function(location){
										if(year.identify == make.identify && make.identify == location.identify){
											 var item = year.prefix + " " + make.prefix + " " + location.label + " in " + location.sunFix + "," + location.identify;
											 csvExports.push(item);
										}
									});
								});
							 });
						}
						else if(yearPhrases.length > 0 && makePhrases.length > 0 && locationPhrases.length == 0){
							 $.map(yearPhrases, function(year){
							 	$.map(makePhrases, function(make){
									if(year.identify == make.identify){
										var item = year.prefix + " " + make.suffix + " " + make.label + "," + make.identify;
										csvExports.push(item);
									}
								});
							 });
						}
						else if(yearPhrases.length > 0 && makePhrases.length == 0 && locationPhrases.length > 0){
							 $.map(yearPhrases, function(year){
							 	$.map(locationPhrases, function(location){
									if(year.identify == location.identify){
										var item = year.prefix + " " + location.label + " in " + location.sunFix + "," + location.identify;
										csvExports.push(item);
									}
								});
							 });
						}
						else if(yearPhrases.length == 0 && makePhrases.length > 0 && locationPhrases.length > 0){
							 $.map(makePhrases, function(make){
							 	$.map(locationPhrases, function(location){
									if(make.identify == location.identify){
										var item = make.prefix + " " + location.label + " in " + location.sunFix + "," + location.identify;
										csvExports.push(item);
									}
								});
							 });
						}
						else if(yearPhrases.length > 0 && makePhrases.length == 0 && locationPhrases.length == 0){
							 $.map(yearPhrases, function(year){
							 	var item = year.prefix + " " + year.label + "," + year.identify;
								csvExports.push(item);
							 });
						}
						else if(yearPhrases.length == 0 && makePhrases.length > 0 && locationPhrases.length == 0){
							 $.map(makePhrases, function(make){
							 	var item = make.prefix + " " + make.label + "," + make.identify;
								csvExports.push(item);
							 });
						}
						else if(yearPhrases.length == 0 && makePhrases.length == 0 && locationPhrases.length > 0){
							 $.map(locationPhrases, function(location){
							 	var item = location.label + " in " + location.suffix + "," + location.identify;
								csvExports.push(item);
							 });
						}
						
					}
					else{
						var item = phrase.label + "," + phrase.identify;
						csvExports.push(item); 
					}
				});
			}
		}

		//console.log(csvExports);
		generateExportCsv(csvExports, strFileName);
	}
}

function exportPhrases() {
	var start = 1, colLocation = 0, totalIdentifyCheckBoxItems = 0, strFileName = $("#exportCsvFile").val();
	var totalIdentifyPhrases = $("#specifyKeyWord").data("totalIdentifyPhrases"), totalColumns = $("#specifyKeyWord").data("totalColumns"), isMixedPhrase = $("#generatePhrase").data("isMixedPhrase");

	if (!isMixedPhrase) {
		start = 3;
		colLocation = 2;
	}

	// Get all check box except Locations
	for (var c = start; c < totalColumns; c++) {
		for (var r = 0; r < totalIdentifyPhrases; r++) {
			totalIdentifyCheckBoxItems += $("#ip_row_" + r + "_" + c + " input:checked").length;
		}
	}

	// Validate
	if (totalIdentifyCheckBoxItems == 0) {
		alert("Please check on CheckBox for 'Broad', 'Phrase', 'Exact', 'Modified Broad'!");
	} else if (strFileName.length == 0) {
		alert("Please input export Csv file!");
		$("#exportCsvFile").focus();
	} else {
		var csvExports = [], csvExportOthers = [], rangeYearNo = 0, makeModelNo = 0, locationNo = 0, startYear = 0, endYear = 0;
		var makeModels = $("#uploadMakeModel").data("makeModels") || [], statesCities = $("#uploadStatesCities").data("statesCities") || [], limitUpload = $("#generatePhrase").data("isLimitUpload");

		// Check for Year's range or Make/Model
		if (!isMixedPhrase) {
			// Get all Year's range
			for (var r = 0; r < totalIdentifyPhrases; r++) {
				rangeYearNo += $("#ip_row_" + r + "_0 input:checked").length;
			}
			
			if (rangeYearNo > 0 && !$("#defaultRangeYears").is(':checked')) {
				startYear = $("#startYear").val();
				endYear = $("#endYear").val();

				if (startYear.length == 0) {
					alert("Please input year's start!");
					$("#startYear").focus();
					return false;
				} else if (endYear.length == 0) {
					alert("Please input year's end!");
					$("#endYear").focus();
					return false;
				} else if (startYear > endYear) {
					alert("Year's end must be bigger than year's start, please input it again!");
					$("#endYear").val("");
					$("#endYear").focus();
					return false;
				}
			}

			// Get all make/model from checkbox
			for (var r = 0; r < totalIdentifyPhrases; r++) {
				makeModelNo += $("#ip_row_" + r + "_1 input:checked").length;
			}

			if (makeModelNo > 0 && makeModels.length == 0) {
				var message = "Please upload Make/Model in CSV file!";
				if(limitUpload)
					message = "Please upload only 10 Makes/Models in CSV file!";
				alert(message);
				return false;
			}
		}

		// Get all locations from check box
		for (var r = 0; r < totalIdentifyPhrases; r++) {
			locationNo += $("#ip_row_" + r + "_" + colLocation + " input:checked").length;
		}

		if (locationNo > 0 && statesCities.length == 0) {
			var message = "Please upload States and Cities in CSV file!";
			if(limitUpload)
				message = "Please upload only 10 States and Cities in CSV file!";
			alert(message);
			return false;
		}
		
		//Limit to upload for year, make/model, and location
		var years = generateRangeYears(startYear, endYear);
		if(limitUpload){
			if(years.length > 11){
				alert("Please input only 10 years!");
				$("#endYear").val("");
				$("#endYear").focus();
				$("#defaultRangeYears").prop("checked", false);
				return false;
			}
				
			if(makeModels.length > 10){
				alert("Please upload only 10 Makes/Models in CSV file!");
				return false;
			}
				
			if(statesCities.length > 10){
				alert("Please upload only 10 States and Cities in CSV file!");
				return false;
			}
			
			//Remove
			//$("#generatePhrase").removeData("isLimitUpload");
		}
		
		//Limit check on Location Checkbox for Mixed Phrases
		var totalActualPhrases = totalIdentifyPhrases * 4;
		if(isMixedPhrase && totalIdentifyCheckBoxItems == totalActualPhrases && totalActualPhrases > 25 && statesCities.length > 100){
			 //var locRow_80_percent = Math.round((totalIdentifyPhrases * 80)/100);
			 //console.log("locationNo: " + locationNo + " with locRow_80_percent: " + locRow_80_percent + " and all rows: " + totalIdentifyPhrases);
			 var locExactNo = (totalIdentifyPhrases > 150 ? 16 : 26);
			 if(locationNo >= locExactNo){
			 	var message = "Now your CSV file will have more than 30400 lines already, please check only 25 items on Location Checkbox again!";
				if(totalIdentifyPhrases > 150){
					message = "Now your CSV file will have more than 30400 lines already, please check only 15 items on Location Checkbox again!";
				}
				alert(message);
				for (var r = 0; r < totalIdentifyPhrases; r++) {
					$("#ip_row_" + r + "_0 input:checkbox").prop("checked", false);
				}
				$("#ip_all_ch_hd_input_0 input:checkbox").prop("checked", false);
				return false;
			 }
		}

		for (var c = start; c < totalColumns; c++) {
			for (var r = 0; r < totalIdentifyPhrases; r++) {
				var phrase = $("#ip_row_" + r + "_" + c + " input:checked").val();
				if (phrase) {
					var phraseJson = JSON.parse(phrase);

					// Year or Make/Model
					if (!isMixedPhrase) {
						var phraseYears = [], phraseMakes = [];

						// Year
						if ($("#ip_row_" + r + "_0 input").is(':checked')) {
							$.map(years, function(year) {
								var phraseYear = {
									year : year,
									label : phraseJson.label,
									identify : phraseJson.identify
								};
								phraseYears.push(phraseYear);
							});
						}

						// Make/Model
						if ($("#ip_row_" + r + "_1 input").is(':checked')) {
							$.map(makeModels, function(make) {
								var phraseMake = {
									make : make,
									label : phraseJson.label,
									identify : phraseJson.identify
								};
								phraseMakes.push(phraseMake);
							});
						}

						// Location
						if ($("#ip_row_" + r + "_" + colLocation + " input").is(':checked')) {
							if (phraseYears.length > 0 && phraseMakes.length == 0) {
								$.map(phraseYears, function(phraseYear) {
									$.map(statesCities, function(location) {
										var phraseLocation = phraseYear.year + " " + phraseYear.label + " in " + location + "," + phraseYear.identify;
										csvExports.push(phraseLocation);
									});
								});
							} else if (phraseYears.length == 0 && phraseMakes.length > 0) {
								$.map(phraseMakes, function(phraseMake) {
									$.map(statesCities, function(location) {
										var phraseLocation = phraseMake.make + " " + phraseMake.label + " in " + location + "," + phraseMake.identify;
										csvExports.push(phraseLocation);
									});
								});
							} else if (phraseYears.length > 0 && phraseMakes.length > 0) {
								$.map(phraseYears, function(phraseYear) {
									$.map(phraseMakes, function(phraseMake) {
										$.map(statesCities, function(location){
											var phraseLocation = phraseYear.year + " " + phraseMake.make + " " + phraseJson.label + " in " + location + "," + phraseJson.identify;
											csvExports.push(phraseLocation);
										});
									});
								});
							}else {
								$.map(statesCities, function(location) {
									var phraseLocation = phraseJson.label + " in " + location + "," + phraseJson.identify;
									csvExports.push(phraseLocation);
								});
							}
						}

						// Others (Broad, Phrase, Exact, and Modified Broad)
						else {
							if (phraseYears.length > 0 && phraseMakes.length == 0) {
								$.map(phraseYears, function(phraseYear) {
									var phraseTmp = phraseYear.year + " " + phraseYear.label + "," + phraseYear.identify;
									csvExportOthers.push(phraseTmp);
								});
							} else if (phraseYears.length == 0 && phraseMakes.length > 0) {
								$.map(phraseMakes, function(phraseMake) {
									var phraseTmp = phraseMake.make + " " + phraseMake.label + "," + phraseMake.identify;
									csvExportOthers.push(phraseTmp);
								});
							}else if (phraseYears.length > 0 && phraseMakes.length > 0) {
								$.map(phraseYears, function(phraseYear) {
									$.map(phraseMakes, function(phraseMake){
										var phraseTmp = phraseYear.year + " " + phraseMake.make + " " + phraseMake.label + "," + phraseMake.identify;
										csvExportOthers.push(phraseTmp);
									});
								});
							} else {
								var phraseTmp = phraseJson.label + "," + phraseJson.identify;
								csvExportOthers.push(phraseTmp);
							}
						}
					} else {
						// Location
						if ($("#ip_row_" + r + "_" + colLocation + " input").is(':checked')) {
							// console.log("Row["+r+"] with col["+c+"]: " + phraseJson);
							$.map(statesCities, function(location) {
								var phraseTmp = phraseJson.label + " in " + location + "," + phraseJson.identify;
								csvExports.push(phraseTmp);
							});
						}
						// Others (Broad, Phrase, Exact, and Modified Broad)
						else {
							var phraseTmp = phraseJson.label + "," + phraseJson.identify;
							csvExports.push(phraseTmp);
						}
					}
				}
			}
		}

		//Remove data from DOM
		//removeDataFromDom();
		
		csvExports = csvExports.concat(csvExportOthers);
		//console.log(csvExports.length);
		generateExportCsv(csvExports, strFileName);
	}
}

function generateExportCsv(csvExports, strFileName) {
	var strData = csvExports.join('\r\n');

	var strFileName = strFileName + ".csv";
	var strMimeType = "text/csv";
	downloadCsv(strData, strFileName, strMimeType);

	// Clear All
	// clearAll();
}

function downloadCsv(strData, strFileName, strMimeType) {
	var D = document, a = D.createElement("a");
	strMimeType = strMimeType || "application/octet-stream";

	if (navigator.msSaveBlob) { // IE10
		return navigator.msSaveBlob(new Blob([ strData ], {
			type : strMimeType
		}), strFileName);
	}

	if ('download' in a) { // html5 A[download]
		a.href = "data:" + strMimeType + "," + encodeURIComponent(strData);
		a.setAttribute("download", strFileName);
		a.innerHTML = "downloading...";
		D.body.appendChild(a);
		setTimeout(function() {
			a.click();
			D.body.removeChild(a);
		}, 66);
		return true;
	}

	// do iframe dataURL download (old ch+FF):
	var f = D.createElement("iframe");
	D.body.appendChild(f);
	f.src = "data:" + strMimeType + "," + encodeURIComponent(strData);

	setTimeout(function() {
		D.body.removeChild(f);
	}, 333);

	return true;
}

function generateRangeYears(startYear, endYear) {
	var yearsList = [];
	if (startYear.length == 0 || startYear == 0) {
		startYear = 1920;
	}
	if (endYear.length == 0 || endYear == 0) {
		endYear = 2020;
	}

	for (var i = startYear; i <= endYear; i++) {
		yearsList.push(i);
	}

	return yearsList;
}