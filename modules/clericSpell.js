// 		var attributeArray = ["ActionDie", "Disapproval", "Level", "PER", "LCK"];
// var attributeObjArray = getAttributeObjects(characterObj, attributeArray);
//			if (attributeObjArray ===  false) return;


function clericSpell(characterObj, spellName, spellLevel, spellModArray) {

	var attributeArray = [];
	var attributeObjArray = [];
	
		attributeObjArray[i] = findObjs({_type: "attribute", name: attributeArray[i], _characterid: characterObj.id})[0];
	//finally assign the variables for output.	
	var characterName = characterObj.get("name");	
	var actionDieValue = attributeObjArray[0].get("current");
	var disapprovalObj = attributeObjArray[1];
	var disapprovalAtt = attributeObjArray[1].get("name")//attributeArray[1];
	var disapprovalValue = Number(attributeObjArray[1].get("current"));

	var luckValue = getAbilityMod(attributeObjArray[4].get("current"));
	var spellTarget = 10+(2*Number(spellLevel));
	
    // get the action die max value and die roll, as expressed as 1d20 or d5 or whatever in the current value of the attribute.
	var d = actionDieValue.indexOf("d")+1;
	var actionDieMax = parseInt(actionDieValue.slice(d));
	var actionDieResult = randomInteger(actionDieMax);
	var spellRoll = Number(actionDieResult); 

	//get the values in spellModArray, return current numbers if attributes and numbers if numbers
	var spellMods = spellModArray;
	for (var i = 2; i < attributeObjArray.length; i++) {
		for (var j = 0; j < spellMods.length; j++) {
			if (attributeObjArray[i].get("name") ===  spellModArray[j]) {
				// check if this is caster level, in which case no need to get the value off the ability score table
				if (spellModArray[j] ===  attributeObjArray[2].get("name"))  {
					spellMods[j] = Number(attributeObjArray[2].get("current"));
				} else {
				spellMods[j] = getAbilityMod(attributeObjArray[i].get("current"));
				};
			};
		};
	};
		
	//build results and send to chat
	var spellChatString = spellName + ": [[" + actionDieResult; 
    if (spellModArray[0] != "None") {
        for (var i = 0; i < spellMods.length; i++) {
			//spellMods[i] = parseInt(removePlus(spellMods[i]));
            spellChatString = spellChatString.concat(" + ", spellMods[i] , " ");
			spellRoll = spellRoll + spellMods[i];
        };
    };    
    spellChatString = spellChatString.concat(" ]]");
    sendChat(characterName,spellChatString);


	// spell fails if spellRoll is < (10 + (2*spellLevel))
	// disapproval chance goes up by 1 if the spell fails no matter the spell level
	// disapproval happens if the result is <= dissapproval value, even if above spellTarget
	var spellSuccess;
	if ((spellRoll >= spellTarget) && (actionDieResult > disapprovalValue)) {
		sendChat(characterName, "" + spellName + ": Success.");
		spellSuccess = true;
	};
	if ((spellRoll < spellTarget) && (actionDieResult > disapprovalValue)) {
		sendChat(characterName, "" + spellName + " has failed. Chance of disapproval has increased by 1.");
		newDisapproval = disapprovalValue+1;
		newDisapprovalString = newDisapproval.toString();
		disapprovalObj.set("current", newDisapprovalString);
		spellSuccess = false;
	};
	if (actionDieResult <= disapprovalValue) {
		sendChat(characterName, "" + spellName + " has failed with a natural roll of " + actionDieResult + ". Disapproval [[" + actionDieResult + "d4+" + (Number(luckValue)*-1) + "]]!");
		spellSuccess = false;
	};
	
	// in case there is a spell duel happening, send the results to that function
	spellDuel(characterObj, spellName, spellRoll);
	
	
};


on("chat:message", function(msg) {
    if (msg.type ===  "api" && msg.content.indexOf("!clericspell ") !== -1) {
		//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
        var param = msg.content.split("!clericspell ")[1];
		var spellName = param.split("|")[0];
        var spellLevel = param.split("|")[1];
        var spellMod = param.split("|")[2];
        var spellModArray = spellMod.split(",");
				
		if(!selected) {
			sendChat("API", "/w " + msg.who + " Select token and try again.");
			return; //quit if nothing selected
		}; 
	
		//loop through selected tokens
		_.each(selected, function(obj) {
			var characterObj = getCharacterObj(obj);
			if (characterObj ===  false) return;
			clericSpell(characterObj, spellName, spellLevel, spellModArray);
		});
		
    };
});