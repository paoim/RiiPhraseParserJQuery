function convertStringToEventListener(selector, callback) {

	eval(callback(selector));
}

function selectOnCheckBoxItem(selector, callback) {

	convertStringToEventListener(selector, callback);
}

function selectOnCheckBoxHeader(selector, headerCallback) {
	convertStringToEventListener(selector, headerCallback);
}

function selectOnCheckEachYear(selector, yearCallback) {

	convertStringToEventListener(selector, yearCallback);
}

function selectOnCheckEachMake(selector, makeCallback) {

	convertStringToEventListener(selector, makeCallback);
}

function selectOnCheckEachLocation(selector, locationCallback) {

	convertStringToEventListener(selector, locationCallback);
}

function selectOnCheckEachBroad(selector, broadCallback) {

	convertStringToEventListener(selector, broadCallback);
}

function selectOnCheckEachPhrase(selector, phraseCallback) {

	convertStringToEventListener(selector, phraseCallback);
}

function selectOnCheckEachExact(selector, exactCallback) {

	convertStringToEventListener(selector, exactCallback);
}

function selectOnCheckEachModifiedBroad(selector, modifiedBroadCallback) {

	convertStringToEventListener(selector, modifiedBroadCallback);
}