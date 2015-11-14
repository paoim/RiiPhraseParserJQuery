var MAX_CHECK_BOX = 5;
var CSV_ITEMS = "CSV_ITEMS";

function HomeController() {
}

HomeController.prototype.init = function() {
	$("#nextBtn").click(this.clickOnNext);
	$("#uploadFile").change(this.uploadCsvFile);
	//$("#exportPhraseBtn").click(this.clickOnExportPhrase);
	//$("#uploadMakeFile").change(this.uploadMakeModelCsvFile);
	//$("#uploadScFile").change(this.uploadStatesCitiesCsvFile);
	$("#generateMixedPhrasesBtn").click(this.clickOnGenerateMixedPhrases);
	$("#generateCheckedPhrasesBtn").click(this.clickOnGenerateCheckedPhrases);
}

HomeController.prototype.clickOnNext = function(selector) {
	generateNext();
}

HomeController.prototype.clickOnClear = function(selector) {
	clearAll();
}

HomeController.prototype.uploadCsvFile = function(event) {
	executeReadSingleUploadCsvFile(event, readPhrasesCsv);
}

HomeController.prototype.uploadMakeModelCsvFile = function(event) {
	executeReadSingleUploadCsvFile(event, readMakeModelCsv);
}

HomeController.prototype.uploadStatesCitiesCsvFile = function(event) {
	executeReadSingleUploadCsvFile(event, readStatesCitiesCsv);
}

HomeController.prototype.clickOnGenerateMixedPhrases = function(selector) {
	executePhraseController(true, displayIdentifiedPhrases);
}

HomeController.prototype.clickOnGenerateCheckedPhrases = function(selector) {
	executePhraseController(false, displayIdentifiedPhrases);
}

HomeController.prototype.clickOnExportPhrase = function(selector) {
	// var export = new ExportController();
	exportPhrases();
}

function setPhrasesInDom(rowDom, rowLineId, phrase) {
	// get value from DOM
	var csvItems = rowDom.data(CSV_ITEMS) || [];

	// Remove data from DOM
	rowDom.removeData(CSV_ITEMS);

	if (phrase.length > 0) {
		if (csvItems.length > 0) {
			var csvItemsTmp = [];
			$.map(csvItems, function(item) {
				if (item.rowLineId == rowLineId) {
					// console.log("If========= " + rowLineId);
					var itemTmp = {
						rowLineId : rowLineId,
						phrase : phrase
					};
					csvItemsTmp.push(itemTmp);
				} else {
					// console.log("Else======== " + rowLineId);
					csvItemsTmp.push(item);
				}
			});

			if (!isExistRowLineIdInArray(csvItems, rowLineId)) {
				// console.log("If not========= " + rowLineId);
				var itemTmp = {
					rowLineId : rowLineId,
					phrase : phrase
				};
				csvItemsTmp.push(itemTmp);
			}
			csvItems = csvItemsTmp;
		} else {
			var item = {
				rowLineId : rowLineId,
				phrase : phrase
			};
			csvItems.push(item);
		}
		// console.log(csvItems);

		// remove duplicate item
		var validCsvItems = csvItems.squashArray();

		// Save Data to DOM
		rowDom.data(CSV_ITEMS, validCsvItems);
	}
}

function setCheckAllIdentifyPhrase(selector) {
	var colId = $(selector).val(), totalIdentifyPhrases = $("#specifyKeyWord").data("totalIdentifyPhrases");

	if (selector.is(':checked')) {
		// $("#ip_all_ch_items input:checkbox").prop("checked", false);
		selector.prop("checked", true);
		setCheckOnEachPhraseCategory(totalIdentifyPhrases, colId, true);
	} else {
		selector.prop("checked", false);
		setCheckOnEachPhraseCategory(totalIdentifyPhrases, colId, false);
	}
}

function setCheckOnEachPhraseCategory(totalIdentifyPhrases, colId, isChecked) {
	for (var r = 0; r < totalIdentifyPhrases; r++) {
		$("#ip_row_" + r + "_" + colId + " input:checkbox").prop("checked", isChecked);
		
		var limitUpload = $("#generatePhrase").data("isLimitUpload");
		if(getCountYearMakeLocation(r) >= 2 && !limitUpload){
			$("#generatePhrase").data("isLimitUpload", 1);
		}
	}
	
	$("#generatePhrase").data("isLimitUpload", limitUpload);
}

function generateShowHiddenBlock(selector, displaySelector) {
	if (selector.is(':checked')) {
		switchClass(displaySelector, "hidden", "show");
	} else {
		switchClass(displaySelector, "show", "hidden");
	}
}

function setCheckOnEachIdentifyPhrase(selector) {
	var totalCheckEachCategory = 0, totalIdentifyPhrases = $("#specifyKeyWord").data("totalIdentifyPhrases");
	var parentDom = $(selector).parent(), rowColList = parentDom.attr("id").substring("ip_row_".length).split("_");
	var rowId = rowColList[0], colId = rowColList[1], value = $(selector).val();
	// console.log("rowId["+rowId+"] with colId["+colId+"]");

	$("#ip_all_ch_hd_input_" + colId + " input:checkbox").prop("checked", false);

	if (selector.is(':checked')) {
		selector.prop("checked", true);
	} else {
		selector.prop("checked", false);
	}

	for (var r = 0; r < totalIdentifyPhrases; r++) {
		totalCheckEachCategory += $("#ip_row_" + r + "_" + colId + " input:checked").length;
	}

	if (totalIdentifyPhrases == totalCheckEachCategory) {
		$("#ip_all_ch_hd_input_" + colId + " input:checkbox").prop("checked", true);
	}

	// Year's range
//	if (value == ("year_" + rowId)) {
//		switchClass($("#rangeYears"), "show", "hidden");
//		if (totalCheckEachCategory > 0) {
//			switchClass($("#rangeYears"), "hidden", "show");
//		}
//	}
	// Make/Model
//	else if (value == ("make_" + rowId)) {
//		switchClass($("#uploadMakeModel"), "show", "hidden");
//		if (totalCheckEachCategory > 0) {
//			switchClass($("#uploadMakeModel"), "hidden", "show");
//		}
//	}
	// Location
//	else if (value == ("location_" + rowId)) {
//		switchClass($("#uploadStatesCities"), "show", "hidden");
//		if (totalCheckEachCategory > 0) {
//			switchClass($("#uploadStatesCities"), "hidden", "show");
//		}
//	}
	
	var limitUpload = $("#generatePhrase").data("isLimitUpload");
	if(getCountYearMakeLocation(rowId) >= 2 && !limitUpload){
		$("#generatePhrase").data("isLimitUpload", 1);
	}
}

function getCountYearMakeLocation(rowId){
	var isMixedPhrase = $("#generatePhrase").data("isMixedPhrase"), startCol = 1, count = 0;
	if(!isMixedPhrase){
		startCol = 3;
	}
	
	for(var c = 0; c < startCol; c++){
		count += $("#ip_row_" + rowId + "_" + c + " input:checked").length;
	}
	
	return count;
}

function executeReadSingleUploadCsvFile(event, callback) {
	var csv = new CsvController(event);
	csv.readSingleUploadCsvFile(callback);
}

function readPhrasesCsv(phraseItems) {
	var csvRowsList = [];
	if (phraseItems.length > 0) {
		// display or hidden DOM
		switchClass($("#result"), "hidden", "show");
		switchClass($("#combination"), "hidden", "show");
		switchClass($("#generatePhrase"), "hidden", "show");

		$.map(phraseItems, function(content, rowIndex) {
			$("#resultsList").append("<li>" + content + "</li>");
			
			var colItems = [], items = content.split(" "), totalColumns = items.length, width = 100 / totalColumns;
			// var colCss = totalColumns > 11? "style=width:" + width + "%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" : "";
			var colCss = totalColumns > 11 ? "style=width:" + width + "%;" : "";
			var labelCss = totalColumns > 11 ? "label-padding" : "";
			
			$.map(items, function(item, colIndex) {
				//var encodeWord = encodeURI(item);
				var decodeWord = decodeURI(item);
				var colItem = {
					colId : colIndex,
					item : decodeWord,
					rowId : rowIndex,
					colCss : colCss,
					labelCss : labelCss,
					callback : "clickOnCsvCheckBox"
				};
				colItems.push(colItem);
			});

			var rowLines = [], rowColLines = [];
			for (var i = 0; i < MAX_CHECK_BOX; i++) {
				var rowLine = {
					rowId : rowIndex,
					rowLineId : i,
					columns : colItems
				};
				rowLines.push(rowLine);
			}

			var rowItem = {
				rowId : rowIndex,
				content : content,
				columns : colItems,
				rowLines : rowLines
			};
			csvRowsList.push(rowItem);
		});
	}

	// Store Data in Dom
	$("#generatePhrase").data("totalRows", csvRowsList.length);

	// Generate CheckBox
	generateCheckBoxs(csvRowsList);
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

function generateCheckBoxs(csvRowsList) {
	$("#checkBoxItems").html("");

	$.map(csvRowsList, function(csvRow, rowIndex) {
		// var csvRowTmpl = $("#chParentTemplate").tmpl(csvRow);
		// setDomStorage(listItemTmpl, key, item);

		$("#chParentTemplate").tmpl(csvRow).appendTo("#checkBoxItems");
		$("#chLabelTemplate").tmpl(csvRow).appendTo("#chRow_item_" + rowIndex);
		$("#chLineTemplate").tmpl(csvRow).appendTo("#chRow_item_" + rowIndex);

		$.map(csvRow.columns, function(csvCol, colIndex) {
			$("#chLabelColTemplate").tmpl(csvCol).appendTo("#chRow_label_" + rowIndex);
		});

		$.map(csvRow.rowLines, function(csvRowLine, rowLineIndex) {
			$("#chLinesTemplate").tmpl(csvRowLine).appendTo("#chRow_line_" + rowIndex);

			$.map(csvRowLine.columns, function(colLine, colLineIndex) {
				$("#chLineColTemplate").tmpl(colLine).appendTo("#chRow_line_" + rowIndex + "_" + rowLineIndex);
			});
		});
	});
}

function executePhraseController(isMixedPhrase, callback) {
	var phrase = new PhraseController(isMixedPhrase);
	phrase.saveMixedPhraseFlagInDom();
	phrase.generatePhrases(callback);
}

function displayIdentifiedPhrases(csvItems, checkedAllPhraseHeaders) {
	if (csvItems.length > 0) {
		// display DOM
		switchClass($("#specifyKeyWord"), "hidden", "show");
		switchClass($("#exportPhrase"), "hidden", "show");
		switchClass($("#nextPhrase"), "hidden", "show");

		// Clear
		$("#exportCsvFile").val("");
		$("#generatePhrase").removeData("isLimitUpload");

		// Set all items to Dom
		$("#specifyKeyWord").data("totalIdentifyPhrases", csvItems.length);
		$("#specifyKeyWord").data("totalColumns", checkedAllPhraseHeaders.length - 1);

		// Display Check All Headers
		$("#ip_all_ch_header").html("");
		$("#ip_all_ch_input").html("");
		$("#ip_each_ch_label").html("");

		$.map(checkedAllPhraseHeaders, function(item) {
			$("#ipAllChHeaderLabelTemplate").tmpl(item).appendTo("#ip_all_ch_header");
			$("#ipAllChHeaderInputTemplate").tmpl(item).appendTo("#ip_all_ch_input");
			$("#ipEachChLabelTemplate").tmpl(item).appendTo("#ip_each_ch_label");
		});

		// Un-check for all headers
		// $("#ip_all_ch_items input:checkbox").prop("checked", false);

		// Display Identified Phrases
		$("#identifyPhraseItems").html("");

		$.map(csvItems, function(item) {
			$("#identifyPhraseTemplate").tmpl(item).appendTo("#identifyPhraseItems");
		});
	}
}

function isExistRowLineIdInArray(csvItems, rowLineId) {
	var isExistRowLineId = false;
	$.map(csvItems, function(item) {
		if (item.rowLineId == rowLineId) {
			isExistRowLineId = true;
		}
	});

	return isExistRowLineId;
}