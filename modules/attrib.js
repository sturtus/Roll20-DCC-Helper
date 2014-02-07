function attrib(characterObj,attributeObjArray,newValue) {
		var attributeName = attributeObjArray[0].get("name");
		var attributeValue = attributeObjArray[0].get("current");
		var characterName = characterObj.get("name");
		
		// change character attribute
		attributeObjArray[0].set("current", newValue);
		
		//output
		sendChat("", "/desc " + characterName + " has changed " + attributeName + " from " + attributeValue + " to " + newValue + ".");
};

on("chat:message", function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!attrib ") !== -1) {
		//parse the input into two variables, attribute and newValue
        var selected = msg.selected;
		var Parameters = msg.content.split("!attrib ")[1];
		var attributeName = Parameters.split("|")[0];
		var newValue = Parameters.split("|")[1];
		
		if(!selected) {
			sendChat("", "/desc Select token and try again.");
			return; //quit if nothing selected
		}; 
	
		//loop through selected tokens
		_.each(selected, function(obj) {
		    var characterObj = getCharacterObj(obj);
			if (characterObj == false) return;	
			var attributeObjArray = getAttributeObjects(characterObj, attributeName);
			if (attributeObjArray == false) return;
			attrib(characterObj,attributeObjArray,newValue);
		});
	
    };
});