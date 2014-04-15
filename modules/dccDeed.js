/*
	=======================
	DCC Mighty Deed Command
	=======================
	!deed dmgDie|atk1,atk2,...|dmg1,dmg2,...|(Normal|Mighty|Smite)|(crit)
	
	dmgDie: the die to roll for weapon damage
	atk and dmg: commas-separated lists of modifiers to apply to attack and damage 
		rolls, respectively. Can be mix of character attributes (STR,LCK) as well as 
		numeric modifiers (+1). Use "None" if none present.
	Normal|Mighty|Smite (optional): the type of deed to perform. 
	crit: lower end of crit range, for Warriors and other fighting types. 

	Command to perform a Mighty Deed of Arms, Smite, or Normal Deed Die attack 
	(with no attached Mighty Deed)
	
	
	Examples:
	~~~~~~~~~
	Blarmy is a 2nd level warrior with a longsword +1, his lucky weapon. He performs a Mighty Deed:
	
	!deed 1d8|STR,LCK,+1|STR,+1|Mighty|18
	
	This would perform a Mighty Deed of Arms using the character's attributes: ActionDie,
	DeedDie, STR, LCK. The +1 is in attack and damage for the +1 weapon. It will roll the 
	attack, the deed die, determine deed success, and determine damage and crit success. 
	It pulls the STR and LCK modifiers and applies them appropriately.
	
	!deed 1d6|AGI|None
	
	This would perform an attack and damage modified by the character's DeedDie attribute
	using the character's ActionDie as the attack roll. No check for Mighty Deed success 
	is made. 
	
	!deed 1d10|STR|STR|Smite
	
	Performs a Smite for the paladin class in the Crawl! fanzine.
	
*/

function deed(characterObj, attributeObjArray, deedDamageDie, deedAttackArray, deedDamageArray, deedTypeArray, deedType, threat) {

	// assign the variables for output.
	var characterName = characterObj.get("name");	
	var actionDieValue = attributeObjArray[0].get("current"); //attributeValue[0];
	var deedDeedValue = attributeObjArray[1].get("current"); //attributeValue[1];
	
	//get the values in deedAttackArray, return current numbers if attributes and numbers if numbers
	var attackMods = deedAttackArray;
	for (var i = 2; i < attributeObjArray.length; i++) {
		for (var j = 0; j < deedAttackArray.length; j++) {
			if (attributeObjArray[i].get("name") === deedAttackArray[j]) {
				attackMods[j] = attributeObjArray[i].get("current");
			};			
		};
	};
	
	//get the values in deedDamageArray, return current numbers if attributes and numbers if numbers
	var damageMods = deedDamageArray;
	for (var i = 2; i < attributeObjArray.length; i++) {
		for (var j = 0; j < deedDamageArray.length; j++) {
			if (attributeObjArray[i].get("name") === deedDamageArray[j]) {
				damageMods[j] = attributeObjArray[i].get("current");
			};		
		};
	};
	

    // get the deed die value, as expressed as 1d7 or d5 or whatever in the current value of the attribute.
	var d = deedDeedValue.indexOf("d")+1;
    var deedDeedDie = parseInt(deedDeedValue.slice(d));	
	d = actionDieValue.indexOf("d")+1;
	var actionDieMax = parseInt(actionDieValue.slice(d));
	var actionDieResult = randomInteger(actionDieMax);
	var deedResult = randomInteger(deedDeedDie);


	// check to see what kind of deed it is, and spit out the right text   
	if ((deedType === deedTypeArray[0]) || (deedType === undefined)) {
		sendChat("Deed Die", deedResult + " ");
	};	
	if (deedType === deedTypeArray[1]) {
    	if (deedResult >= 3) {
        	sendChat("Mighty Deed", deedResult + ": Succeeds if hits!");
    	} else {
        	sendChat("Mighty Deed", deedResult + ": Fails!");
		};
    };	
	if (deedType === deedTypeArray[2]) {
		sendChat("Smite", deedResult + " ");
	};

	
	//build results and send to chat
   var attackChatString = "[[" + actionDieResult; 
    if (deedAttackArray[0] != "None") {
        for (var i = 0; i < attackMods.length; i++) {
			attackMods[i] = parseInt(removePlus(attackMods[i]));
            attackChatString = attackChatString.concat(" +", attackMods[i]);
        };
    };
     attackChatString = attackChatString.concat(" +", deedResult, "]] vs. AC, for [[", deedDamageDie);
    if (deedDamageArray[0] != "None") {
        for (var i = 0; i < damageMods.length; i++) {
			damageMods[i] = parseInt(removePlus(damageMods[i]));
            attackChatString = attackChatString.concat(" +", damageMods[i]);
        };
    };
    attackChatString = attackChatString.concat(" +", deedResult, "]] points of damage!");
    sendChat(characterName,attackChatString);
	
	if (threat === undefined) {
		threat = "20";
	}
	if (actionDieResult >= threat) {
		sendChat(characterName, actionDieResult + "! Critical Hit!");
	};

};



on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!deed ") !== -1) {
		var selected = msg.selected;
		var deedTypeArray = ["Normal", "Mighty", "Smite"];
		var attributeArray = ["ActionDie", "DeedDie", "STR", "AGI", "LCK"];
        var param = msg.content.split("!deed ")[1];
        var deedDamageDie = param.split("|")[0];
        var deedAttack = param.split("|")[1];
        var deedAttackArray = deedAttack.split(",");
        var deedDamage = param.split("|")[2];
        var deedDamageArray = deedDamage.split(",");
        var deedType = param.split("|")[3];
		var threat = param.split("|")[4];
			
		if(!selected) {
			sendChat("API", "/w " + msg.who + " Select token and try again.");
			return; //quit if nothing selected
		}; 
	
		//loop through selected tokens
		_.each(selected, function(obj) {
			var characterObj = getCharacterObj(obj,msg.who);
			if (characterObj === false) return;
			var attributeObjArray = getAttributeObjects(characterObj,attributeArray,msg.who);
			if (attributeObjArray === false) return;
			deed(characterObj, attributeObjArray, deedDamageDie, deedAttackArray, deedDamageArray, deedTypeArray, deedType, threat);
		});
		
    };
});

