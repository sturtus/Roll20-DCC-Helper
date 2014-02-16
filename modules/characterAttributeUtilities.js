/* 
    ==========================================
	Roll20 Character Sheet Attribute Utilities
	==========================================
	!stats
	!stats Atribute1, Attribute2, ...
	!attrib attribute|newValue
	
	!attrib
	~~~~~~~
	Chat command to change an attribute's current value for selected token. 
	Usage: "!attrib Strength|12" will change the Strength attribute of the 
	selected token to 12. 
	
	If newValue starts with a + or -, it will increase or decrease the 
	current value by that amount. 
	
	Mainly for use in token macros. 
	
	!stats
	~~~~~~
	If provided with a comma-separated list of attribute names ("!stats Luck,LCK" or 
	"!stats INIT"), will return any matching attributes and their values from all 
	selected token's character sheets. 
	
	If no list is provided, will return a list of all attributes on the character sheet(s)
	of the selected token(s), as well as comparing that list to the canonical attribute
	list (defined in state.dcc.sheetAttributeArray) and returning a list of any missting
	attributes. 
	
	The "max" value of the first attribute in state.dcc.sheetAttributeArray ("Level" is the default)
	is used to identify	the class of the character, i.e. Level 1 / Cleric. This is used by
	the validator to tell whether a character is missing a class-specific attribute, or if
	they don't require it (i.e., so a cleric won't get an error when they don't have a DeedDie). 

	[Implementation is DCC-specific, but pretty easily modifiable by editing 
	state.dcc.sheetAttributeArray and modifying the switch() statement.]
	
	Update Ability Score Mods on Ability Score Change
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	This function is run when the current value of an attribute that is present 
	in the array state.dcc.abilityScoreArray and update the corresponding 
	modifier value attribute, if necessary, based on the new value. 
*/

function attrib(characterObj,attributeObjArray,newValue) {
    	var attributeName = attributeObjArray[0].get("name");
		var attributeValue = attributeObjArray[0].get("current");
		var characterName = characterObj.get("name");
		
        if (newValue.indexOf("+") === 0 || newValue.indexOf("-") === 0 ) {
            newValue = parseInt(attributeValue) + parseInt(newValue); 
			attributeObjArray[0].set("current", newValue);
		} else attributeObjArray[0].set("current", newValue);
		
		//output
		sendChat("API", "/w gm " + characterName + " changed " + attributeName + " from " + attributeValue + " to " + newValue + ".");
		sendChat("API", "/w " + characterName + " changed " + attributeName + " from " + attributeValue + " to " + newValue + ".");
		updateAbilityScoreModifier(characterObj,characterName,attributeName,newValue);
};

function validateAttributes(character,currentCharacterAttributes,reportMissing) {
    tmp = "|-- validateAttributes"; log(tmp);
    var attributeSortArray = [];
    var attributeNamesArray = [];
    var attributeTable = "<br/><table style='width:100%;'><thead><tr><strong>" + character + "</strong></tr></thead><tbody>";
    for(i = 0; i < currentCharacterAttributes.length; i++) {
        attName = currentCharacterAttributes[i].get("name");
        attPosition = state.dcc.sheetAttributeArray.indexOf(attName);
        if (attPosition !== -1) {
            attCurrent = currentCharacterAttributes[i].get("current");
            attMax = currentCharacterAttributes[i].get("max");
            attributeSortArray.push([attPosition,attName,attCurrent,attMax]); 
            var characterClass; 
            if (attName == state.dcc.sheetAttributeArray[0]) characterClass = attMax;
        };
    };
    tmp = "characterClass: " + characterClass; log(tmp);
    attributeSortArray.sort(function(a,b){return a[0] - b[0]});
    log(attributeSortArray);
    for (i = 0; i < attributeSortArray.length; i++) {
        if (attributeSortArray[i][3] !== "") {
            attributeTable += "<tr><td><strong>" + attributeSortArray[i][1] + "</strong></td><td style='text-align:center;'>" + attributeSortArray[i][2] + "</td><td style='text-align:center;'>" + attributeSortArray[i][3] + "</td></tr>";
            attributeNamesArray[i] = attributeSortArray[i][1]; 
        } else {
            attributeTable += "<tr><td><strong>" + attributeSortArray[i][1] + "</strong></td><td colspan='2' style='text-align:center;'>" + attributeSortArray[i][2] + "</td></tr>";
            attributeNamesArray[i] = attributeSortArray[i][1]; 
        }
    };
    attributeTable += "</tbody></table>";
    var missing = false;
    var missingTable = "";
    if (reportMissing === true) {
        missingTable = "<br/><table><thead><tr><strong>Missing Attributes:</strong></tr></thead><tbody>";
        for(i = 0; i < state.dcc.sheetAttributeArray.length; i++) {
            if (attributeNamesArray.indexOf(state.dcc.sheetAttributeArray[i]) === -1) {
                switch(state.dcc.sheetAttributeArray[i]) {
                    case "DeedDie":
                        if (characterClass === "Warrior") {
                            missing = true;
                            missingTable += "<tr><td>" + state.dcc.sheetAttributeArray[i] + "</td></tr>";
                        };
                    break;
                    case "LuckDie":
                        if (characterClass === "Thief") {
                            missing = true;
                            missingTable += "<tr><td>" + state.dcc.sheetAttributeArray[i] + "</td></tr>";
                        };
                    break;
                    case "Disapproval":
                        if (characterClass === "Cleric") {
                            missing = true;
                            missingTable += "<tr><td>" + state.dcc.sheetAttributeArray[i] + "</td></tr>";
                        };
                    break;
                    case "Momentum":
                        if (characterClass === "Wizard") {
                            missing = true;
                            missingTable += "<tr><td>" + state.dcc.sheetAttributeArray[i] + "</td></tr>";
                        };
                    break;
                    default:
                    missing = true;
                    missingTable += "<tr><td>" + state.dcc.sheetAttributeArray[i] + "</td></tr>";
                };
            };
        };
        missingTable += "</tbody></table>";
    };
    tmp = "|-- /validateAttributes"; log(tmp);
    return [attributeTable, missing, missingTable]; 
};

function returnAbilityModifier (abilityScore) {
    abilityScoreModifier = 0;
    if (abilityScore < 9) {
        if (abilityScore > 5) {
            abilityScoreModifier = -1;
        } else if (abilityScore > 3) {
            abilityScoreModifier = -2;
        } else abilityScoreModifier = -3;
    } else if (abilityScore > 12) {
        if (abilityScore > 17) {
            abilityScoreModifier = 3;
        } else if (abilityScore > 15) {
            abilityScoreModifier = 2;
        } else abilityScoreModifier = 1;
    }; 
    tmp = abilityScoreModifier; log(tmp);
    return abilityScoreModifier;
}

function updateAbilityScoreModifier(characterObj,characterName,abilityName,abilityValue) {
	var modifierName; 
	for(i = 0; i < state.dcc.abilityScoreArray.length; i++) {
        if (abilityName === state.dcc.abilityScoreArray[i][0]) {
            modifierName = state.dcc.abilityScoreArray[i][1];
            break;
        };
    };
    if (modifierName !== undefined) {
        attributeObjArray = getAttributeObjects(characterObj,modifierName,characterName);
        newModifier = returnAbilityModifier(abilityValue);
        attributeObjArray[0].set("current",newModifier);
		if (newModifier >= 0) newModifier = "+" + newModifier;
		sendChat("API", "/w gm " + characterName + "'s " + modifierName + " mod is now <strong>" + newModifier + "</strong>");
		sendChat("API", "/w " + characterName + " " + characterName + "'s " + modifierName + " mod is now <strong>" + newModifier + "</strong>");
    };
};

on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!attrib ") !== -1) {
		//parse the input into two variables, attribute and newValue
        var selected = msg.selected;
		var Parameters = msg.content.split("!attrib ")[1];
		var attributeName = Parameters.split("|")[0];
		var newValue = Parameters.split("|")[1];
		
		if(!selected) {
			sendChat("API", "/w " + msg.who + " Select token and try again.");
			return; //quit if nothing selected
		}; 
	
		//loop through selected tokens
		_.each(selected, function(obj) {
		    var characterObj = getCharacterObj(obj,msg.who);
			if (characterObj === false) return;	
			var attributeObjArray = getAttributeObjects(characterObj,attributeName,msg.who);
			if (attributeObjArray === false) return;
			attrib(characterObj,attributeObjArray,newValue);
		});
	
    };
    if (msg.type === "api" && msg.content.indexOf("!stats") !== -1 ) { 
        tmp = "| !stats"; log(tmp);
        var player = msg.who.replace(/\s.+/,""); 
        tmp = "|- player: " + player; log(tmp);
        var selected = msg.selected;
        if (!selected) {
            sendChat("!stats","/w " + player + " You must first select a token."); 
        };
        if (msg.content.indexOf("!stats ") === -1) {
	        _.each(selected, function(obj) {
	            var characterObj = getCharacterObj(obj);
	            if (characterObj === false) return;    
	            var character = characterObj.get("name");
	            //character = character.replace(/\s.+/,""); 
	            var characterId = characterObj.get("_id");
	            var currentCharacterAttributes = findObjs({ _type: "attribute", _characterid: characterId });
	            if (currentCharacterAttributes === false) return;
	            chatString = validateAttributes(character,currentCharacterAttributes,true);
	            sendChat("!stats", "/w " + player + " " + chatString[0]);
	            if (chatString[1] == true) {
	                sendChat("!stats", "/w " + player + " " + chatString[2]);
	            };
	        });
	    } else {
			// select only certain atts, based on CSV list
			var param = msg.content.split("!stats ")[1];
			var suppliedAttributes = param.split(","); 
            tmp = suppliedAttributes; log(tmp);
            _.each(selected, function(obj) {
                var characterObj = getCharacterObj(obj);
                if (characterObj === false) return;    
                var character = characterObj.get("name");
                var characterId = characterObj.get("_id");
                var currentCharacterAttributes = getAttributeObjects(characterObj,suppliedAttributes,player);
                if (currentCharacterAttributes === false) return;
                chatString = validateAttributes(character,currentCharacterAttributes,false);
                sendChat("!stats", "/w " + player + " " + chatString[0]);
                if (chatString[1] == true) {
                    sendChat("!stats", "/w " + player + " " + chatString[2]);
                };
            });
        };
        tmp = "| /!stats"; log(tmp);
    };
});

on("change:attribute:current", function(attribute) {
    abilityName = attribute.get("name");
    abilityValue = attribute.get("current");
    character_id = attribute.get("_characterid");
    characterObj = getObj("character",character_id);
    characterName = characterObj.get("name");
    
	updateAbilityScoreModifier(characterObj,characterName,abilityName,abilityValue);
});

on("ready", function() {
    if (!state.dcc) {
        state.dcc = {}; 
        tmp = "Created state.dcc: " + state.dcc; log(tmp);
    } else {
        tmp = "state.dcc: " + state.dcc; log(tmp);
    };
    // remove "if" to redefine state.dcc.sheetAttributeArray, if necessary
    if (!state.dcc.sheetAttributeArray) {
        state.dcc.sheetAttributeArray = [
            // basics
            "Level","XP","AC","HP","INIT","Speed",
            // ability scores & mods
            "Strength","STR",
            "Agility","AGI",
            "Stamina","STA",
            "Personality","PER",
            "Intelligence","INT",
            "Luck","LCK",
            // saves 
            "REF","FORT","WILL",
            // dice, miscellaneous
            "ActionDie","DeedDie","ATK","CritDie","FumbleDie","LuckDie","Disapproval","Momentum",
            // coins
            "PP","EP","GP","SP","CP"]; 
        tmp = "Created state.dcc.sheetAttributeArray: " + state.dcc.sheetAttributeArray; log(tmp);
	};
    if (!state.dcc.abilityScoreArray) {
        state.dcc.abilityScoreArray = [["Strength","STR"],["Agility","AGI"],["Stamina","STA"],["Personality","PER"],["Intelligence","INT"],["Luck","LCK"]]; 
        tmp = "Created state.dcc.abilityScoreArray: " + state.dcc.abilityScoreArray; log(tmp);
    };
});
