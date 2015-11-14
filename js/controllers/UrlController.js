function UrlController() {}

UrlController.prototype.getParamShortForm = function(paramName) {
	return decodeURIComponent((new RegExp('[?|&]' + paramName + '='
			+ '([^&;]+?)(&|#|;|$)').exec(location.search) || [ , "" ])[1]
			.replace(/\+/g, '%20'))
			|| null;
}

UrlController.prototype.getParamDecodeUriComponent = function(paramName) {
	var results = this.getParameter(paramName);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

UrlController.prototype.getParameter = function(paramName){
	paramName = paramName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)"),
	results = regex.exec(location.search);
	
	return results;
}