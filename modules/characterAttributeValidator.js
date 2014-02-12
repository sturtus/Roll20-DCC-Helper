/* Roll20 Character Sheet Attribute Validator Utility

// Select a token and enter "!stats"; if you are the GM or a controlling player,
// you will get chat output listing all the attributes currently on the selected token's
// character sheet. 

// To do: any actual validation (i.e., "You're missing a STR attribute.")
// Right now it just outputs what's there. 

*/

on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!stats") !== -1 ) { 
        
        tmp = "| !stats"; log(tmp);
        var player = msg.who.replace(/\s.+/,""); 
        tmp = "player: " + player; log(tmp);
        var selected = msg.selected;
        if (!selected) {
            sendChat("!stats","/w " + player + " You must first select a token."); 
        };
        _.each(selected, function(obj) {
            var characterObj = getCharacterObj(obj);
            if (characterObj === false) return;    
            var controlledBy = characterObj.get("controlledby");
            if (msg.who.indexOf("(GM)") !== -1 && controlledBy.indexOf(msg.who) !== -1) { 
                // exit if not GM or controlling player
                // probably not necessary since you can't select tokens you don't control
                sendChat("!stats","/w " + player + " You do not control that character.");
                return;
            };
            
            var character = characterObj.get("name");
            character = character.replace(/\s.+/,""); 
            var characterId = characterObj.get("_id");
            var currentCharacterAttributes = findObjs({ _type: "attribute", _characterid: characterId });
            tmp = currentCharacterAttributes; log(tmp);
            if (currentCharacterAttributes === false) return;
            
            var attributeNamesArray = [];
            
            chatString = "<br/><table><thead><tr><strong>" + character + "</strong></tr><tr><td><em>Attribute</em></td><td><em>Current</em></td><td><em>Max</em></td></tr></thead><tbody>";
            
            for(i = 0; i < currentCharacterAttributes.length; i++) {
                attName = currentCharacterAttributes[i].get("name");
                attributeNamesArray.push(attName);
                attCurrent = currentCharacterAttributes[i].get("current");
                attMax = currentCharacterAttributes[i].get("current");
                chatString += "<tr><td><strong>" + attName + "</strong> </td><td>" + attCurrent + "</td><td>" + attMax + "</td></tr>";
            };
            
            chatString += "</tbody></table>";

            sendChat("!stats", "/w " + player + " " + chatString);

            chatString = "<br/><table><thead><tr><strong>Missing Attributes:</strong></tr></thead><tbody>";

            var missing = false;
    
            for(i = 0; i < state.dcc.sheetAttributeArray.length; i++) {
                if (attributeNamesArray.indexOf(state.dcc.sheetAttributeArray[i]) == -1) {
                    missing = true;
                    chatString += "<tr><td>" + state.dcc.sheetAttributeArray[i] + "</td></tr>";
                };
            };

            if (missing === true) {
                chatString += "</tbody></table>";
                sendChat("!stats","/w " + player + " " + chatString);
            };

            tmp = msg.who; log(tmp);
            
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
	//if (!state.dcc.sheetAttributeArray) {
        state.dcc.sheetAttributeArray = ["HP","AC","Strength","STR","Agility","AGI","Stamina","STA","Personality","PER","Intelligence","INT","Luck","LCK","INIT","XP","CasterLevel","Disapproval","ActionDie","CrtiDie","FumbleDie","PP","EP","GP","SP","CP","Speed"]; 

        tmp = "Created state.dcc.sheetAttributeArray: " + state.dcc.sheetAttributeArray; log(tmp);
	//};
});