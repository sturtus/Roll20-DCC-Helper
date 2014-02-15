/* 
    ==================================================
	Roll20 Character Sheet Attribute Validator Utility
	==================================================
	!stats
	!stats Atribute1, Attribute2, ...
	
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
	
*/

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

on("chat:message", function(msg) {
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
            "FORT","REF","WILL",
            // dice, miscellaneous
            "ActionDie","DeedDie","ATK","Disapproval","Momentum","CritDie","FumbleDie",
            // coins
            "PP","EP","GP","SP","CP"]; 
        tmp = "Created state.dcc.sheetAttributeArray: " + state.dcc.sheetAttributeArray; log(tmp);
	};
});