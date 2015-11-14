function PhraseController(isMixedPhrase){
	this.isMixedPhrase = isMixedPhrase;
}

PhraseController.prototype.generatePhrases = function(callback) {
	// Validate phrase processing
	if (!this.isValidGeneration()) {
		alert("Please click on CheckBox to combine your phrase!");
		return false;
	}

	// Generate Phrases
	var allItems = [], totalRows = $("#generatePhrase").data("totalRows");

	for (var r = 0; r < totalRows; r++) {
		var rowDom = $("#chRow_item_" + r), csvItems = rowDom.data(CSV_ITEMS) || [];
		$.map(csvItems, function(item) {
			allItems.push(item);
		});
	}

	// Remove duplicate phrases
	var allPhrases = [], allPosibleItems = [];
	$.map(allItems, function(item, index) {
		allPhrases.push(item.phrase);
	});
	allPhrases = allPhrases.squashArray();
	allPosibleItems = allPosibleItems.concat(allPhrases);
	// console.log(allPosibleItems);

	// Check All Phrases Label && input checkbox
	var checkedAllPhraseHeaders = [ {
		colId : 0,
		label1 : " &nbsp; ",
		label2 : " Year ",
		title : "Year",
		css : "text-center",
		headerCallback : "clickOnCheckAllYears"
	}, {
		colId : 1,
		label1 : " &nbsp; ",
		label2 : " Make/Model ",
		title : "Make/Model",
		css : "text-center",
		headerCallback : "clickOnCheckAllMakes"
	}, {
		colId : 2,
		label1 : " &nbsp; ",
		label2 : " Location ",
		title : "Location",
		css : "text-center",
		headerCallback : "clickOnCheckAllLocations"
	}, {
		colId : 3,
		label1 : "Check All",
		label2 : " Broad ",
		title : "Broad",
		css : "text-center",
		headerCallback : "clickOnCheckAllBroads"
	}, {
		colId : 4,
		label1 : " &nbsp; ",
		label2 : " Phrase ",
		title : "Phrase",
		css : "text-center",
		headerCallback : "clickOnCheckAllPhrases"
	}, {
		colId : 5,
		label1 : " &nbsp; ",
		label2 : " Exact ",
		title : "Exact",
		css : "text-center",
		headerCallback : "clickOnCheckAllExacts"
	}, {
		colId : 6,
		label1 : " &nbsp; ",
		label2 : " Modified Broad ",
		title : "Modified Broad",
		css : "text-center",
		headerCallback : "clickOnCheckAllModifiedBroads"
	}, {
		colId : 7,
		label1 : " &nbsp; ",
		label2 : "&nbsp;",
		title : "",
		css : "col-w-7",
		headerCallback : ""
	} ];

	var yearCallback = "clickOnCheckEachYear", makeCallback = "clickOnCheckEachMake";

	// Check if it is mixed Phrases
	if (this.isMixedPhrase) {
		yearCallback = "";
		makeCallback = "";

		checkedAllPhraseHeaders = [ {
			colId : 0,
			label1 : " &nbsp; ",
			label2 : " Location ",
			title : "Location",
			css : "text-center",
			headerCallback : "clickOnCheckAllLocations"
		}, {
			colId : 1,
			label1 : " &nbsp; ",
			label2 : " Broad ",
			title : "Broad",
			css : "text-center",
			headerCallback : "clickOnCheckAllBroads"
		}, {
			colId : 2,
			label1 : "Check All",
			label2 : " Phrase ",
			title : "Phrase",
			css : "text-center",
			headerCallback : "clickOnCheckAllPhrases"
		}, {
			colId : 3,
			label1 : " &nbsp; ",
			label2 : " Exact ",
			title : "Exact",
			css : "text-center",
			headerCallback : "clickOnCheckAllExacts"
		}, {
			colId : 4,
			label1 : " &nbsp; ",
			label2 : " Modified Broad ",
			title : "Modified Broad",
			css : "text-center",
			headerCallback : "clickOnCheckAllModifiedBroads"
		}, {
			colId : 5,
			label1 : " &nbsp; ",
			label2 : "&nbsp;",
			title : "",
			css : "col-w-5",
			headerCallback : ""
		} ];

		allPosibleItems = [];
		$.map(allPhrases, function(phrase, index) {
			var arr = phrase.split(" ");

			// combine all posible words into phrases
			var allPosiblePhrases = permutation(arr);

			// put all arrays into one big array
			allPosibleItems = allPosibleItems.concat(allPosiblePhrases);
		});
		// console.log(allPosibleItems);
	}

	var csvItems = [];
	$.map(allPosibleItems, function(phrase, index) {
		//Modified Broad
		var words = phrase.split(" "), modifiedBroad = "'";
		for (var i = 0; i < words.length; i++) {
			modifiedBroad = modifiedBroad + "+" + words[i] + " ";
		}
		modifiedBroad = modifiedBroad.trimString();
		// console.log(modifiedBroad);

		var itemTmp = {
			rowId : index,
			label : phrase,
			phraseBroad : {
				label : phrase,
				identify : "Broad"
			},
			phrasePhrase : {
				label : phrase,
				identify : "Phrase"
			},
			phraseExact : {
				label : phrase,
				identify : "Exact"
			},
			phraseModifiedBroad : {
				label : modifiedBroad,
				identify : "Broad"
			},
			yearCallback : yearCallback,
			makeCallback : makeCallback,
			locationCallback : "clickOnCheckEachLocation",
			broadCallback : "clickOnCheckEachBroad",
			phraseCallback : "clickOnCheckEachPhrase",
			exactCallback : "clickOnCheckEachExact",
			modifiedBroadCallback : "clickOnCheckEachModifiedBroad"
		};
		csvItems.push(itemTmp);
	});
	// console.log(csvItems);

	callback(csvItems, checkedAllPhraseHeaders);
}

PhraseController.prototype.isValidGeneration = function(){
	var totalCheckBoxItems = $("#checkBoxItems input:checked").length;
	
	return (totalCheckBoxItems > 0);
}

PhraseController.prototype.saveMixedPhraseFlagInDom = function(){
	$("#generatePhrase").data("isMixedPhrase", this.isMixedPhrase);
}

function permutation(arr){
	var arrLen = arr.length, result = [];
	
	if(arrLen > 0){
		if(arrLen == 1){
			result.push(arr[0]);
		}
		else{
			for(var i = 0; i < arrLen; i++){
				var inner = [];
				for(var j = 0; j < arrLen; j++){
					if(j != i){
						inner.push(arr[j]);
					}
				}
				
				$.map(permutation(inner), function(innerPermut){
					var phrase = arr[i] + " " + innerPermut;
					result.push(phrase);
				});
			}
		}
	}
	
	return result;
}