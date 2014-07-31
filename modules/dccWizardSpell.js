/*
	========================
	DCC Wizard Spell Command
	========================
	!wizardspell spellName|spellLevel|spellModifiers

	Command to cast a wizard spell. If the spell fails, lists spell failure, possible
	WORSE language, and spell loss if appropriate. Command is required for wizards
	participating in a spell duel (attackers and defenders).
	
	spellName: a string used in chat output as the name of the spell
	spellLevel: the level of the spell being cast (1, 2, etc.)
	spellModifiers: commas-separated lists of modifiers to apply to the spell check 
		roll. Can be mix of character attributes (@{INT},@{Level}) as well as 
		numeric modifiers (+1). 
	
	Example:
	~~~~~~~~
	Jerp is a 2nd level wizard casting Animal Summoning, but has a mercurial magic
	that gives him a +1 to cast the spell

	!wizardspell Animal Summoning|1|@{INT}, @{Level}, +1

*/

function wizardSpell(characterObj, attributeObjArray, spellName, spellLevel, spellModArray) {

	//finally assign the variables for output.	
	var characterName = characterObj.get("name");	
	var actionDieValue = attributeObjArray[0].get("current");
	var spellTarget = 10+(2*Number(spellLevel));

	//build results and send to chat
	var rollChatString = "/r " + actionDieValue; 
    for (var i = 0; i < spellModArray.length; i++) {
		if (spellModArray[i].indexOf("+") >= -1) {
			spellModArray[i] = removePlus(spellModArray[i]);
		};
        rollChatString = rollChatString.concat(" + ", spellModArray[i] , " ");
    };   
	
	sendChat(characterName,rollChatString, function(ops) {
		var rollresult = JSON.parse(ops[0].content);
		var rollResultOutput = buildRollOutput(rollresult);
		var spellRoll = rollresult.total;
		var spellChatString = spellName + ": ";
	
	 	// spell fails if spellRoll is < (10 + (2*spellLevel))
	 	// 1 = Lost, failure, and worse!
	 	// 2-11 = Lost. Failure.
	 	// 12+ = If spellRoll < spellTarget && spellRoll is >= 12, 
	 	//   	Failure, but spell is not lost.

		
	 	if (spellRoll >= spellTarget) {
	 		spellChatString = spellChatString.concat("Success. ");
	 	};

	 	if (spellRoll < spellTarget) {
	 		if (spellRoll === 1) {
	 			spellChatString = spellChatString.concat("Lost, failure, and worse! ");
	 		};
	 		if ((spellRoll >= 2) && (spellRoll <= 11)) {
	 			spellChatString = spellChatString.concat("Lost. Failure. ");	
	 		};
	 		if (spellRoll > 12) {
	 			spellChatString = spellChatString.concat("Failure, but spell is not lost. ");	
	 		};
	 	};
	
		spellChatString = spellChatString.concat("Results: ", rollResultOutput);
			 
		//send rollresult as formatted chat string
		sendChat(characterName, spellChatString);

		// in case there is a spell duel happening, send the results to that function
		spellDuel(characterObj, spellName, spellRoll); 
	});

};


on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!wizardspell ") !== -1) {
		//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
		var attributeArray = ["ActionDie"]; 
        var param = msg.content.split("!wizardspell ")[1];
		var charName = param.split("|")[0];
		var spellName = param.split("|")[1];
        var spellLevel = param.split("|")[2];
        var spellMod = param.split("|")[3];
        var spellModArray = spellMod.split(",");
		var characterObj = findObjs({
			archived: false,
			_type: "character",
			name: charName
		})[0];
		
		if (!characterObj) return;
		var attributeObjArray = getAttributeObjects(characterObj, attributeArray,msg.who);
		if (attributeObjArray === false) return;
		wizardSpell(characterObj, attributeObjArray, spellName, spellLevel, spellModArray);
		
		
    };
});


