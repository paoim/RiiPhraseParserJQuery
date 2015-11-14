/** Extend Array and String Class for Specific Purpose**/




/*====================Extend Array Class=========================*/




Array.prototype.convertCommaStringToArray = function (){
	var newArray = [];
	var currentArray = this;
	var stringArray = currentArray.toString();
	
	if(!stringArray.isValidString()){
		return newArray;
	}
	
	newArray = currentArray;
	if(stringArray.isString()){
		newArray = currentArray.split(",");
	}
	
	return newArray;
};


Array.prototype.removeOneItemFromArray = function(item){
	var currentArray = this;
	var newArray = [];
	
	if(!this.isValidArray()){
		return newArray;
	}
	
	
	newArray = currentArray;
	var index = this.getIndexOfItem(item);
	
	if(index >= 0){
		newArray.splice(index,1);
	}
	
	return newArray;
};


Array.prototype.removeDuplicateArray = function(){
	var currentArray = this;
	var newArray = [];
	
	if(!this.isValidArray()){
		return newArray;
	}
	
	//Remove duplicate
	label:for(var i = 0; i < currentArray.length; i++){
		for(var j = 0; j < newArray.length; j++){
			if(newArray[j].isEqualString(currentArray[i]))
				continue label;
		}
		newArray[newArray.length] = currentArray[i];
	}
	
	return newArray;
};


Array.prototype.squashArray = function(){
	var currentArray = this;
	var newArray = [];
	
	if(!this.isValidArray()){
		return newArray;
	}
	
	//Remove duplicate
	for(var i = 0; i< currentArray.length; i++){
		if(newArray.indexOf(currentArray[i]) == -1){
			newArray.push(currentArray[i]);
		}
	}
	
	return newArray;
};


Array.prototype.removeDuplicateArrayByName = function(){
	var currentArray = this;
	var newArray = [];
	
	if(!this.isValidArray()){
		return newArray;
	}
	
	//Remove duplicate
	label:for(var i = 0; i < currentArray.length; i++){
		for(var j = 0; j < newArray.length; j++){
			if(newArray[j].name.isEqualString(currentArray[i].name))
				continue label;
		}
		newArray[newArray.length] = currentArray[i];
	}
	
	return newArray;
};


Array.prototype.isContainAnItemInArray = function(item){
	var currentArray = this;
	
	return (currentArray.getIndexOfItem(item) >= 0);
};


Array.prototype.getIndexOfItem = function(item){
	var currentArray = this;
	
	if(currentArray.isValidArray()){
		return currentArray.indexOf(item);
	}
	
	return 0;
};


Array.prototype.isValidArray = function(){
	var currentArray = this;
	
	return (currentArray.length > 0);
};





/*====================Extend String Class=========================*/




String.prototype.convertArrayToString = function(arrayList, separator){
	var separatorTmp = "";
	if(separator.isValidString()){
		separatorTmp = separator;
	}
	
	if(arrayList.isValidArray()){
		return array.join(separatorTmp);
	}
	
	return "";
};


String.prototype.comparableTwoStrings = function(str2){
	var str1 = this;
	
	if (str1 < str2)
		return -1;
	if (str1 > str2)
		return 1;
	
	return 0;
};


String.prototype.toFirstCharacterUpperCase = function(){
	var str = this;
	var firstCharacter = str;
	var remainCharacters = "";
	
	if(str.isValidString()){
		str = str.toLowerCase();
		firstCharacter = str.subStringZeroStart(1);
		remainCharacters = str.substring(1, str.length);
	}
	
	return (firstCharacter.toUpperCase() + remainCharacters);
};


String.prototype.getValidString = function(){
	var str = this;
	
	if(str.isValidString()){
		str = str.toLowerCase();
	}
	
	return str.trimString();
};


String.prototype.getIndexOfString = function(searchString){
	var str = this;
	
	if(str.isValidString() && searchString.isValidString()){
		return str.indexOf(searchString);
	}
	
	return -1;
};


String.prototype.trimString = function(){
	var str = this;
	
	if(str.isValidString()){
		return $.trim(str);
	}
	
	return str;
};


String.prototype.subStringZeroStart = function(end){
	var str = this;
	
	if(str.isValidString()){
		return str.substring(0, end);
	}
	
	return str;
};


String.prototype.isEqualString = function(str2){
	var str1 = this;
	
	if(str1.isValidString()){
		return (str1.toLowerCase().isEqualCasensitiveString(str2.toLowerCase()));
	}
	
	return false;
};


String.prototype.isEqualCasensitiveString = function(str2){
	var str1 = this;
	
	if(str1.isValidString() && str2.isValidString()){
		return (str1 == str2);
	}
	
	return false;
};


String.prototype.isValidIndexOffString = function(searchString){
	var str = this;
	
	return (str.getIndexOfString(searchString) >= 0);
};


String.prototype.isValidString = function(){
	var str = this;
	
	return (str != undefined && str != null && str.length > 0);
};


String.prototype.isString = function(){
	var str = this;
	
	return ($.type(str) === "string");
};