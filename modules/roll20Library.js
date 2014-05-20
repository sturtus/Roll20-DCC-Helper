function buildRollOutput(obj) {

	var rollFormat = rollFormat || {};

	rollFormat.CSSBGColor = "white"; //Color of background
	rollFormat.CSSbrdrColor = "black"; //color of border 
	rollFormat.CSSfontColor = "black"; // color of text
	rollFormat.CSSfumbleColor = "red"; //color of lowest rolls (1 on 1dX)
	rollFormat.CSScriticalColor = "green"; //color of highest rolls (X on 1dX)

	rollFormat.modCSS =  "font-size: 1em;"; //Modifer size
	rollFormat.totCSS =  "font-size: 1.5em;"; //Totals size

	rollFormat.CSS = "background:" + rollFormat.CSSBGColor + "; color:" + rollFormat.CSSfontColor + "; border-radius: 8px; padding:4px; font-size: 1.1em; border-style:solid; border-color:" + rollFormat.CSSbrdrColor + "; border-width:1px;";
	var notes = "";

	var output = "<TABLE border='0' cellpadding = '4' style='text-align:center;'><TR>";
    //loop through cleanedMsg to display each die rolled
    _.each(obj.rolls, function(nMsg){
        switch(nMsg.type) {
            case "R":
                output += "<TD border='1'><div style='" + rollFormat.CSS + "'>";
                output += nMsg.dice + "d" + nMsg.sides + " = <br />(";
                var count = 0;
                _.each(nMsg.results, function(resOut){
                    count += 1;
                    if(resOut.d == true){
                        output += "<i style='text-decoration: line-through'>"
                    }
                    if (resOut.v == nMsg.sides) {
                        output += "<strong style='font-size: 1.5em; color:" + rollFormat.CSScriticalColor + "';>" + resOut.v + "</strong>";
                    } else if (resOut.v == 1){
                         output += "<strong style='font-size: 1.5em; color:" + rollFormat.CSSfumbleColor + "';>" + resOut.v + "</strong>";
                    } else {
                        output += resOut.v;
                    }
                    if(resOut.d == true) {
                        output += "</i>"
                    }
                    if (count !== nMsg.results.length) {
                        output += ",";
                    }
                });
                output += ") </div></TD>";
                break;
            case "M":
                output += "<TD><div style='" + rollFormat.modCSS + "'>";
                output += nMsg.expr + "</div></TD>";
                break;
            case "C":
               notes += nMsg.text;
                break;
        }
    });
        
    output += "<TD><div style='" + rollFormat.totCSS+ "'> = " + obj.total + notes + "</div> </TD> </TR> </TABLE>"

	return output;
	
};

//---------------------------------------------------------------------------------------------------------------------------------------------


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

function getAttributeObjects(characterObj,attributeArray,who) {
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
			if (attributeObjArray[i] === undefined) {
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
			if (attributeValue[i] === "") {
				sendChat("API","/w " + who + " " + attributeArray[i] + " is empty.");
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

	if ((objType === "attribute") || (objType === "ability")) {
		var att = getObj(objType, obj._id);
		if (att.get("_characterid") != "") {
			var characterObj = getObj("character", att.get("_characterid"));
		};
	};
	
	if (objType === "graphic") { 
		var tok = getObj("graphic", obj._id);
    	if (tok.get("represents") != "") {
       		var characterObj = getObj("character", tok.get("represents"));
    	} else {
			sendChat("API","/w " + who + " Selected token does not represent a character.");
			return false;
    	};
	};
		
	if (objType === "character") {
		var characterObj = getObj("character", obj._id);
	}

	return characterObj;
};

//---------------------------------------------------------------------------------------------------------------------------------------------



