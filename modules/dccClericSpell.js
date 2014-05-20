/*
	========================
	DCC Cleric Spell Command
	========================
	!clericspell spellName|spellLevel|spellModifiers

	Command to cast a cleric spell. If the spell fails, it will increment disapproval up by 1. 
	If a natural roll is in the disapproval range, it will roll for the disapproval. Command 
	is required for clerics participating in a spell duel (attackers and defenders).

	spellName: a string used in chat output as the name of the spell
	spellLevel: the level of the spell being case (1, 2, etc.)
	spellModifiers: commas-separated lists of modifiers to apply to the spell check 
		roll. Can be mix of character attributes (INT,Level) as well as 
		numeric modifiers (+1). 

	
	Example:
	~~~~~~~~
	Suppy is a 1st level cleric with the blessing spell, he casts it:
	
	!clericspell Blessing|1|PER,Level
	
	This will roll the spell at the character's current ActionDie attribute, add the 
	modifiers listed, check for spell success, increment disapproval if necessary, 
	and roll the disapproval number if a natural roll is in the disapproval range.
	
	
*/
function clericSpell(characterObj, attributeObjArray, spellName, spellLevel, spellModArray) {

	//finally assign the variables for output.	
	var characterName = characterObj.get("name");	
	var actionDieValue = attributeObjArray[0].get("current");
	var disapprovalObj = attributeObjArray[1];
	var disapprovalAtt = attributeObjArray[1].get("name")//attributeArray[1];
	var disapprovalValue = Number(attributeObjArray[1].get("current"));
	var luckValue = Number(attributeObjArray[2].get("current"));
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
		var actionDieResult = rollresult.rolls[0].results[0].v;
		var spellChatString = spellName + ": ";
		
		// spell fails if spellRoll is < (10 + (2*spellLevel))
		// disapproval chance goes up by 1 if the spell fails no matter the spell level
		// disapproval happens if the result is <= dissapproval value, even if above spellTarget
		
		if ((spellRoll >= spellTarget) && (actionDieResult > disapprovalValue)) {
			spellChatString = spellChatString.concat("Success. ");
	
		};
		if ((spellRoll < spellTarget) && (actionDieResult > disapprovalValue)) {
			spellChatString = spellChatString.concat("Failed. Chance of disapproval has increased by 1. ");
			newDisapproval = disapprovalValue+1;
			newDisapprovalString = newDisapproval.toString();
			disapprovalObj.set("current", newDisapprovalString);
	
		};
		if (actionDieResult <= disapprovalValue) {
			spellChatString = spellChatString.concat("Failed with a natural roll of ", actionDieResult, ". Disapproval Roll is [[", actionDieResult, "d4+", (Number(luckValue)*-1), "]]! ");
	
		};
		
		spellChatString = spellChatString.concat("Results: ", rollResultOutput);
		
		//send rollresult as formatted chat string
		sendChat(characterName, spellChatString);
		
		// in case there is a spell duel happening, send the results to that function
		spellDuel(characterObj, spellName, spellRoll);
		
	});

};


on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!clericspell ") !== -1) {
		//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
		var attributeArray = ["ActionDie", "Disapproval", "LCK"];
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
			var characterObj = getCharacterObj(obj,msg.who);
			if (characterObj === false) return;
			var attributeObjArray = getAttributeObjects(characterObj, attributeArray,msg.who);
			if (attributeObjArray === false) return;
			clericSpell(characterObj, attributeObjArray, spellName, spellLevel, spellModArray);
		});
		
    };
});


