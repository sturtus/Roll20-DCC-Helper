/* Roll20 Character Sheet Attribute Validator Utility
// Select a token and enter "!stats"; if you are the GM or a controlling player,
// you will get chat output listing all the attributes currently on the selected token's
// character sheet, as well as any missing attributes (based on class). 
// The max value of the first attribute in state.dcc.sheetAttributeArray is used for the 
// name of the class, for determining whether class-specific attributes are missing. 
*/

function validateAttributes(character,currentCharacterAttributes) {
    tmp = "|-- validateAttributes"; log(tmp);
    var attributeSortArray = [];
    var attributeNamesArray = [];
    var attributeTable = "<br/><table><thead><tr><strong>" + character + "</strong></tr></thead><tbody>";
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
        attributeTable += "<tr><td><strong>" + attributeSortArray[i][1] + "</strong> </td><td>" + attributeSortArray[i][2] + "</td><td>" + attributeSortArray[i][3] + "</td></tr>";
        attributeNamesArray[i] = attributeSortArray[i][1]; 
    };
    attributeTable += "</tbody></table>";
    var missingTable = "<br/><table><thead><tr><strong>Missing Attributes:</strong></tr></thead><tbody>";
    var missing = false;
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
        _.each(selected, function(obj) {
            var characterObj = getCharacterObj(obj);
            if (characterObj === false) return;    
            var character = characterObj.get("name");
            //character = character.replace(/\s.+/,""); 
            var characterId = characterObj.get("_id");
            var currentCharacterAttributes = findObjs({ _type: "attribute", _characterid: characterId });
            if (currentCharacterAttributes === false) return;
            chatString = validateAttributes(character,currentCharacterAttributes);
            sendChat("!stats", "/w " + player + " " + chatString[0]);
            if (chatString[1] == true) {
                sendChat("!stats", "/w " + player + " " + chatString[2]);
            };
        });
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
    // un-comment this when list is final, or whenever changes need to be made to state.dcc.sheetAttributeArray
    if (!state.dcc.sheetAttributeArray) {
        state.dcc.sheetAttributeArray = [
            // basics
            "Level","XP","AC","HP","INIT","Speed",
            // ability scores
            "Strength","STR",
            "Agility","AGI",
            "Stamina","STA",
            "Personality","PER",
            "Intelligence","INT",
            "Luck","LCK",
            // saves 
            "FORT","REF","WILL",
            // dice
            "ActionDie","DeedDie","ATK","Disapproval","Momentum","CritDie","FumbleDie",
            // coins
            "PP","EP","GP","SP","CP"]; 
        tmp = "Created state.dcc.sheetAttributeArray: " + state.dcc.sheetAttributeArray; log(tmp);
	};
});