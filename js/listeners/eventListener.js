function clickOnCsvCheckBox(checkboxItem) {
	var parentDom = checkboxItem.parent();
	var grandParentDom = $(parentDom).parent();
	var parentDomSubFixId = parentDom.attr("id").substring("chRow_col_line_".length);
	var grandParentDomSubFixId = grandParentDom.attr("id").substring("chRow_line_".length);

	var rowId = parentDomSubFixId.split("_")[0];
	var rowLineId = grandParentDomSubFixId.split("_")[1];
	var rowDom = $("#chRow_item_" + rowId);

	var phrase = "";
	// console.log("rowId: " + rowId + " with rowLineId: " + rowLineId);
	$("#chRow_line_" + rowId + "_" + rowLineId + " input:checked").each(function() {
		//var encodeWord = encodeURI($(this).val());
		var decodeWord = decodeURI($(this).val());
		phrase = phrase + decodeWord + " ";
	});
	phrase = phrase.trimString();

	// Save Phrase into Dom
	setPhrasesInDom(rowDom, rowLineId, phrase);
}

function clickOnCheckAllYears(selector) {
	setCheckAllIdentifyPhrase(selector);
	generateShowHiddenBlock(selector, $("#rangeYears"));
}

function clickOnCheckAllMakes(selector) {
	setCheckAllIdentifyPhrase(selector);
	generateShowHiddenBlock(selector, $("#uploadMakeModel"));
}

function clickOnCheckAllLocations(selector) {
	setCheckAllIdentifyPhrase(selector);
	generateShowHiddenBlock(selector, $("#uploadStatesCities"));
}

function clickOnCheckAllBroads(selector) {
	setCheckAllIdentifyPhrase(selector);
}

function clickOnCheckAllPhrases(selector) {
	setCheckAllIdentifyPhrase(selector);
}

function clickOnCheckAllExacts(selector) {
	setCheckAllIdentifyPhrase(selector);
}

function clickOnCheckAllModifiedBroads(selector) {
	setCheckAllIdentifyPhrase(selector);
}

function clickOnCheckEachYear(selector) {
	setCheckOnEachIdentifyPhrase(selector);
}

function clickOnCheckEachMake(selector) {
	setCheckOnEachIdentifyPhrase(selector);
}

function clickOnCheckEachLocation(selector) {
	setCheckOnEachIdentifyPhrase(selector);
}

function clickOnCheckEachBroad(selector) {
	setCheckOnEachIdentifyPhrase(selector);
}

function clickOnCheckEachPhrase(selector) {
	setCheckOnEachIdentifyPhrase(selector);
}

function clickOnCheckEachExact(selector) {
	setCheckOnEachIdentifyPhrase(selector);
}

function clickOnCheckEachModifiedBroad(selector) {
	setCheckOnEachIdentifyPhrase(selector);
}