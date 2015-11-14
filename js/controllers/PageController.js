
function clearAll() {
	$("#uploadFile").val("");
	$("#startYear").val("");
	$("#endYear").val("");
	$("#uploadMakeFile").val("");
	$("#uploadScFile").val("");
	$("#exportCsvFile").val("");

	$("#resultsList").html("");
	$("#checkBoxItems").html("");
	$("#identifyPhraseItems").html("");

	switchClass($("#result"), "show", "hidden");
	switchClass($("#combination"), "show", "hidden");
	switchClass($("#generatePhrase"), "show", "hidden");
	switchClass($("#specifyKeyWord"), "show", "hidden");
	switchClass($("#rangeYears"), "show", "hidden");
	switchClass($("#uploadMakeModel"), "show", "hidden");
	switchClass($("#uploadStatesCities"), "show", "hidden");
	switchClass($("#exportPhrase"), "show", "hidden");

	//Remove Data from DOM
	removeDataFromDom();
}

function removeDataFromDom() {
	$("#generatePhrase").removeData("totalRows");
	$("#generatePhrase").removeData("isMixedPhrase");
	$("#generatePhrase").removeData("isLimitUpload");
	$("#uploadStatesCities").removeData("statesCities");
	$("#uploadMakeModel").removeData("makeModels");
	$("#specifyKeyWord").removeData("totalColumns");
	$("#specifyKeyWord").removeData("totalIdentifyPhrases");
}

function switchClass(selector, oldClass, newClass) {
	selector.removeClass(oldClass);
	selector.addClass(newClass);
}

function sortPhrasesByIdentify(item1, item2){
	if(item1.identify == undefined || item2.identify == undefined)
		return 0;
	
	var firstIdentify = item1.identify.toLowerCase();
	var secondIdentify = item2.identify.toLowerCase();
	
	return firstIdentify.comparableTwoStrings(secondIdentify);
}

/** ===================================================== **
 *                  Local Storage                         
 ** ===================================================== **/

function setLocalStorage(key, value){
	localStorage.setItem(key, value);
}

function getLocalStorage(key){
	
	return localStorage.getItem(key);
}

/**
 * Store list of items in localStorage object
 * @param key
 * @param itemsJson
 */
function setLocalStorages(key, itemsJson){
	var itemsJSONText = JSON.stringify(itemsJson);
	setLocalStorage(key,itemsJSONText);
}

/**
 * Get list of items from localStorage object
 * @param key
 * @returns itemsJson
 */
function getLocalStorages(key){
	var items = getLocalStorage(key);
	var itemsJson = JSON.parse(items);
	
	return itemsJson;
}

/**
 * Remove one key from Local Storage Object
 * @param key
 */
function removeLocalStorage(key){
	localStorage.removeItem(key);
}

/**
 * Clear all keys from Local Storage Object
 */
function clearLocalStorage(){
	localStorage.clear();
}

/** ===================================================== **
 *                  Session Storage                      
 ** ===================================================== **/

/**
 * Store value in sessionStorage object
 */
function setSessionStorage(key, value){
	sessionStorage.setItem(key, value);
}

function getSessionStorage(key){
	
	return sessionStorage.getItem(key);
}

/**
 * Store list of items in sessionStorage object
 * @param key
 * @param items
 */
function setSessionStorages(key, items){
	var itemJSONText = JSON.stringify(items);
	setSessionStorage(key, itemJSONText);
}

/**
 * Get list of items from sessionStorage object
 * @param key
 * @returns
 */
function getSessionStorages(key){
	var items = getSessionStorage(key);
	var itemJson = JSON.parse(items);
	
	return itemJson;
}

/**
 * Remove one key from Session Storage Object
 * @param key
 */
function removeSessionStorage(key){
	sessionStorage.removeItem(key);
}

/**
 * Clear all keys from Session Storage Object
 */
function clearSessionStorage(){
	sessionStorage.clear();
}

/** ================= DOM Storage ================= **/

/**
 * Set data in Dom Object
 * @param selector
 * @param key
 * @param value
 */
function setDomStorage(selector, key, value){
	selector.data(key, value);
}

/**
 * Get data from Dom Object
 * @param selector
 * @param key
 * @returns data
 */
function getDomStorage(selector, key){
	var data = selector.data(key);
	
	return data;
}

/**
 * Remove data from Dom Object
 * @param selector
 * @param key
 */
function removeDomStorage(selector, key){
	selector.removeData(key);
}