function wizardSpell(characterObj, attributeObjArray, spellName, spellLevel, spellModArray) {

	//finally assign the variables for output.	
	var characterName = characterObj.get("name");	
	var actionDieValue = attributeObjArray[0].get("current");
	var spellTarget = 10+(2*Number(spellLevel));
	
    // get the action die max value and die roll, as expressed as 1d20 or d5 or whatever in the current value of the attribute.
	var d = actionDieValue.indexOf("d")+1;
	var actionDieMax = parseInt(actionDieValue.slice(d));
	var actionDieResult = randomInteger(actionDieMax);
	var spellRoll = Number(actionDieResult); 

	//get the values in spellModArray, return current numbers if attributes and numbers if numbers
	var spellMods = spellModArray;
	for (var i = 1; i < attributeObjArray.length; i++) {
		for (var j = 0; j < spellMods.length; j++) {
			if (attributeObjArray[i].get("name") ===  spellModArray[j]) {
				// check if this is caster level, in which case no need to get the value off the ability score table
				if (spellModArray[j] ===  attributeObjArray[1].get("name"))  {
					spellMods[j] = Number(attributeObjArray[1].get("current"));
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
			spellMods[i] = parseInt(removePlus(spellMods[i]));
            spellChatString = spellChatString.concat(" + ", spellMods[i] , " ");
			spellRoll = spellRoll + spellMods[i];
        };
    };    
    spellChatString = spellChatString.concat(" ]]");
	sendChat(characterName,spellChatString);

	// spell fails if spellRoll is < (10 + (2*spellLevel))
	// 1 = Lost, failure, and worse!
	// 2-11 = Lost. Failure.
	// 12+ = If spellRoll < spellTarget && spellRoll is >= 12, 
	//   	Failure, but spell is not lost.
	var spellSuccess;
	if (spellRoll >= spellTarget) {
		sendChat(characterName, "" + spellName + ": Success.");
		spellSuccess = true;
	};
	
	if (spellRoll < spellTarget) {
		if (spellRoll ===  1) {
			sendChat("", "/desc Lost, failure, and worse!");
			spellSuccess = false;
		};
		if ((spellRoll >= 2) && (spellRoll <= 11)) {
			sendChat("", "/desc Lost. Failure.");	
			spellSuccess = false;
		};
		if (spellRoll > 12) {
			sendChat("", "/desc Failure, but spell is not lost.");	
			spellSuccess = false;
		};
	};
	
	// in case there is a spell duel happening, send the results to that function
	spellDuel(characterObj, spellName, spellRoll, spellSuccess);
	
	
};


on("chat:message", function(msg) {
    if (msg.type ===  "api" && msg.content.indexOf("!wizardspell ") !== -1) {
		//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
		var attributeArray = ["ActionDie", "CasterLevel", "INT"];
        var param = msg.content.split("!wizardspell ")[1];
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
			var attributeObjArray = getAttributeObjects(characterObj, attributeArray);
			if (attributeObjArray ===  false) return;
			wizardSpell(characterObj, attributeObjArray, spellName, spellLevel, spellModArray);
		});
		
    };
});