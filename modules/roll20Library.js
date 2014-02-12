
function debug(msg,v) {
	log("--------------------------------------------------------------------------");
	log(msg);
	log("--------------------------------------------------------------------------");
	for (var i = 0; i < v.length; i++) {
		log(v[i]);
	};
	log("--------------------------------------------------------------------------");
	return true;
};


//---------------------------------------------------------------------------------------------------------------------------------------------


function removePlus(string) {
	// takes a string and removes the + to return the integer after it
	// useful when attribute values +2 and you only need the integer associated.
	var p = string.indexOf("+");
	var n = string.substr(p+1);
	return n;
};

//---------------------------------------------------------------------------------------------------------------------------------------------

function getAttributeObject(characterObj, attributeObjArray, who) {
	// can pass array of attribute strings or a single attribute string	along with an associated character
	// returns those attributes as an object array or returns false if they do not exist on the passed character.
	
	
	// get the passed attribute name array from the character object and test if they are defined
	
	if (characterObj != undefined ) {
		var attributeObjArray = new Array();
		if (!(attributeArray instanceof Array)) {
			attributeArray = attributeArray.split();
		};
		for (var i = 0; i < attributeArray.length; i++) {
			attributeObjArray[i] = findObjs({_type: "attribute", name: attributeArray[i], _characterid: characterObj.id})[0];
			if (attributeObjArray[i] ===  undefined) {
				sendChat("API","/w " + who + " Selected character requires attribute: " + attributeArray[i] + " ");
			};
		};		
	};
	if (attributeObjArray.indexOf(undefined) !== -1) return false;

	//loop through attributeArray and names of attributes to make sure they all match and get their values if they are valid. 
	//make sure none of the values are empty
	var attributeValue = new Array();	
	var j = 0;
	for (var i = 0; i < attributeArray.length; i++) {
			attributeValue[i] = attributeObjArray[i].get("current");
			if (attributeValue[i] ===  "") {
			sendChat("", "/desc " + attributeArray[i] + " is empty.");
			j++;
			};
	};
	if (j !== 0) return false;

	return attributeObjArray;
};



//---------------------------------------------------------------------------------------------------------------------------------------------

function getCharacterObj(obj,who) {
	
	//send any object and returns the associated character object
	//returns character object for attribute, token/graphic, and ability, and... character
	
	var objType = obj._type;
	
	if ((objType != "attribute") && (objType != "graphic") && (objType != "character")) {
			sendChat("API","/w " + who + " cannot be associated with a character.");
		return false;
	} 

	if ((objType ===  "attribute") || (objType ===  "ability")) {
		var att = getObj(objType, obj._id);
		if (att.get("_characterid") != "") {
			var characterObj = getObj("character", att.get("_characterid"));
		};
	};
	
	if (objType ===  "graphic") { 
		var tok = getObj("graphic", obj._id);
    	if (tok.get("represents") != "") {
       		var characterObj = getObj("character", tok.get("represents"));
    	} else {
			sendChat("API","/w " + who + " Selected token does not represent a character.");
			return false;
    	};
	};
		
	if (objType ===  "character") {
		var characterObj = getObj("character", obj._id);
	}

	return characterObj;
};

//---------------------------------------------------------------------------------------------------------------------------------------------


