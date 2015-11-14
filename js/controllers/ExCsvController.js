function ExCsvController(){}

ExCsvController.prototype.init = function(){
	this.generatePhrases();
	$("#backBtn").click(this.clickOnBack);
	$("#exportPhraseBtn").click(this.clickOnExportPhrase);
	$("#uploadMakeFile").change(this.uploadMakeModelCsvFile);
	$("#uploadScFile").change(this.uploadStatesCitiesCsvFile);
	//var testJs = new TestJs();
	//testJs.init();
}

ExCsvController.prototype.generatePhrases = function(){
	//var urlController = new UrlController();
	//var phrases = urlController.getParamShortForm("phs");
	var phrases = getLocalStorages("phs") || [];
	if(phrases.length > 0){
		var isLocation = phrases[0].isLocation, isMake = phrases[0].isMake, isYear = phrases[0].isYear;
		//console.log(isLocation + " " + isMake + " " + isYear);
		
		//Show DOM
		if(isYear)
			switchClass($("#rangeYears"), "hidden", "show");
		if(isMake)
			switchClass($("#uploadMakeModel"), "hidden", "show");
		if(isLocation)
			switchClass($("#uploadStatesCities"), "hidden", "show");
		switchClass($("#exportPhrase"), "hidden", "show");
		
		//var jsonPhrases = JSON.parse(phrases);
		//$.map(phrases, function(phrase){
			//console.log(phrase.label);
			//console.log(phrase.identify);
			//console.log(phrase.type);
			
		//});
	}
}

ExCsvController.prototype.clickOnBack = function(){
	clearLocalStorage();
	window.location = "home.html";
}

ExCsvController.prototype.clickOnExportPhrase = function() {
	var csvExports = [], csvExportOthers = [],
	phrases = getLocalStorages("phs") || [],
	makeModels = $("#uploadMakeModel").data("makeModels") || [],
	statesCities = $("#uploadStatesCities").data("statesCities") || [];
	
	if(phrases.length > 0){
		var isLocation = phrases[0].isLocation,
		isMake = phrases[0].isMake,
		isYear = phrases[0].isYear,
		startYear = 0, endYear = 0;
		
		if(isYear){
			if(!$("#defaultRangeYears").is(':checked')){
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
		}
		
		if(isMake && makeModels.length == 0){
			alert("Please upload Make/Model in CSV file!");
			$("#uploadMakeFile").focus();
			return false;
		}
		
		if(isLocation && statesCities.length == 0){
			alert("Please upload States and Cities in CSV file!");
			$("#uploadScFile").focus();
			return false;
		}
		
		var years = generateRangeYears(startYear, endYear);
		$.map(phrases, function(phrase){
			var type = phrase.type, phraseMakes = [],
			phraseLocations = [], phraseYears = [];
			if(type.length > 0){
				var types = type.split(",");
				$.map(types, function(type){
					if(type == "year"){
						$.map(years, function(year){
							var phraseYear = {
									year : year,
									label : phrase.label,
									identify : phrase.identify
							};
							phraseYears.push(phraseYear);
						});
					}
					else if(type == "make"){
						$.map(makeModels, function(make){
							var phraseMake = {
									make : make,
									label : phrase.label,
									identify : phrase.identify
							};
							phraseMakes.push(phraseMake);
						});
					}
					else if(type == "location"){
						$.map(statesCities, function(location){
							var phraseLocation = {
									location : location,
									label : phrase.label,
									identify : phrase.identify
							};
							phraseLocations.push(phraseLocation);
						});
					}
				});//end of types (map)
				
				if(phraseYears.length > 0 && phraseMakes.length == 0 && phraseLocations.length == 0){
					$.map(phraseYears, function(year){
						var phraseTmp = year.year + " " + year.label + "," + year.identify;
						csvExportOthers.push(phraseTmp);
					});
				}
				else if(phraseYears.length == 0 && phraseMakes.length > 0 && phraseLocations.length == 0){
					$.map(phraseMakes, function(make){
						var phraseTmp = make.make + " " + make.label + "," + make.identify;
						csvExportOthers.push(phraseTmp);
					});
				}
				else if(phraseYears.length == 0 && phraseMakes.length == 0 && phraseLocations.length > 0){
					$.map(phraseLocations, function(location){
						var phraseTmp = location.label + " in " + location.location + "," + location.identify;
						csvExportOthers.push(phraseTmp);
					});
				}
				else if(phraseYears.length > 0 && phraseMakes.length > 0 && phraseLocations.length == 0){
					$.map(phraseYears, function(year){
						$.map(phraseMakes, function(make){
							var phraseTmp = year.year + " " + make.make + " " + make.label + "," + make.identify;
							csvExportOthers.push(phraseTmp);
						});
					});
				}
				else if(phraseYears.length > 0 && phraseMakes.length == 0 && phraseLocations.length > 0){
					$.map(phraseYears, function(year){
						$.map(phraseLocations, function(location){
							var phraseTmp = year.year + " " + location.label + " in " + location.location + "," + location.identify;
							csvExportOthers.push(phraseTmp);
						});
					});
				}
				else if(phraseYears.length == 0 && phraseMakes.length > 0 && phraseLocations.length > 0){
					$.map(phraseMakes, function(make){
						$.map(phraseLocations, function(location){
							var phraseTmp = make.make + " " + location.label + " in " + location.location + "," + location.identify;
							csvExportOthers.push(phraseTmp);
						});
					});
				}
				else if(phraseYears.length > 0 && phraseMakes.length > 0 && phraseLocations.length > 0){
					$.map(phraseYears, function(year){
						$.map(phraseMakes, function(make){
							$.map(phraseLocations, function(location){
								var phraseTmp = year.year + " " + make.make + " " + location.label + " in " + location.location + "," + location.identify;
								csvExportOthers.push(phraseTmp);
							});
						});
					});
				}
				
			}
			else{
				var phraseTmp = phrase.label + "," + phrase.identify;
				csvExports.push(phraseTmp);
			}
		});//end of phrases (map)
		
	}
	
	csvExports = csvExports.concat(csvExportOthers);
	if(csvExports.length > 0){
		var strFileName = $("#exportCsvFile").val();
		if(strFileName.length == 0){
			alert("Please input export Csv file!");
			$("#exportCsvFile").focus();
			return false;
		}
		
		generateExportCsv(csvExports, strFileName);
	}
}

ExCsvController.prototype.uploadMakeModelCsvFile = function(event) {
	executeReadSingleUploadCsvFile(event, readMakeModelCsv);
}

ExCsvController.prototype.uploadStatesCitiesCsvFile = function(event) {
	executeReadSingleUploadCsvFile(event, readStatesCitiesCsv);
}

function executeReadSingleUploadCsvFile(event, callback) {
	var csv = new CsvController(event);
	csv.readSingleUploadCsvFile(callback);
}

function readMakeModelCsv(makeModels) {
	if (makeModels.length > 0) {
		// Store Data in Dom
		$("#uploadMakeModel").data("makeModels", makeModels);
	}
}

function readStatesCitiesCsv(statesCities) {
	if (statesCities.length > 0) {
		// Store Data in Dom
		$("#uploadStatesCities").data("statesCities", statesCities);
	}
}