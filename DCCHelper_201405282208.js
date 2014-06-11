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
		roll. Can be mix of character attributes (@{INT},@{Level}) as well as 
		numeric modifiers (+1). 

	
	Example:
	~~~~~~~~
	Suppy is a 1st level cleric with the blessing spell, he casts it:
	
	!clericspell Blessing|1|@{PER},@{Level}
	
	This will roll the spell at the character's current ActionDie attribute, add the 
	modifiers listed, check for spell success, increment disapproval if necessary, 
	and roll the disapproval number if a natural roll is in the disapproval range.
	
	
*/
/*
	=======================
	DCC Mighty Deed Command
	=======================
	!deed dmgDie|atk1,atk2,...|dmg1,dmg2,...|(Normal|Mighty|Smite)|(crit)
	
	dmgDie: the die to roll for weapon damage
	atk and dmg: commas-separated lists of modifiers to apply to attack and damage 
		rolls, respectively. Can be mix of character attributes (@{STR}, @{LCK}) as well as 
		numeric modifiers (+1). 
	Normal|Mighty|Smite (optional): the type of deed to perform. 
	crit: lower end of crit range, for Warriors and other fighting types. 

	Command to perform a Mighty Deed of Arms, Smite, or Normal Deed Die attack 
	(with no attached Mighty Deed)
	
	
	Examples:
	~~~~~~~~~
	Blarmy is a 2nd level warrior with a longsword +1, his lucky weapon. He performs a Mighty Deed:
	
	!deed 1d8|@{STR},@{LCK},+1|@{STR},+1|Mighty|18
	
	This would perform a Mighty Deed of Arms using the character's attributes: ActionDie,
	DeedDie, STR, LCK. The +1 is in attack and damage for the +1 weapon. It will roll the 
	attack, the deed die, determine deed success, and determine damage and crit success. 
	It pulls the STR and LCK modifiers and applies them appropriately using built in macro
	processing.
	
	!deed 1d6|@{AGI}
	
	This would perform an attack and damage modified by the character's DeedDie attribute
	using the character's ActionDie as the attack roll. No check for Mighty Deed success 
	is made. 
	
	!deed 1d10|STR|STR|Smite
	
	Performs a Smite for the paladin class in the Crawl! fanzine.
	
*/
/*
	======================
	DCC Dice Chain Command
	======================
	!diceChain attribute|positionChange
	
	Command to change an attribute for selected tokens' attribute with a die roll 
	value and move it up or down the DCC dice chain by positionChange. 

	!diceChain ActionDie|+1
	!diceChain ActionDie|-2
	!diceChain DeedDie|-1
	!diceChain WeaponDamage|-1
	
*/
/*
	=======================
	DCC Spell Duel Commands
	=======================
	!counterspell @{selected|token_id}|@{target|token_id}
	!resolveSpellDuel
	!resetSpellDuel
	
	Command to spell duel a spellcaster. Will handle a single attacking spellcaster
	against any number of counterspelling defending spellcasters. The attacker 
	does not need to do anything, but each counterspelling spellcaster must use 
	this command to counter the attacking spell caster. Once the first !counterspell
	is submitted, the targeted character will be the attacker and the counterspelling
	token/character will be a defender. Any other characters submitting !counterspell 
	will participate in the duel on the defender's side. Any characters that cast a spell
	during the duel who has NOT submitted !counterspell will cast their spell normally
	and will not have their spell participate in the duel.
	
	The macro must contain the @target command to function. Set up your macro as:
		!counterspell @{selected|token_id}|@{target|token_id}
	The selected token will counter against the targeted token. They must then 
	counter using the above mentioned !wizardspell or !clericspell commands after
	they have used !counterspell.
	
	When all the spells have been cast, resolve the duel with the following command:
		!resolvespellduel
	This will compare all the spell results, increment momentum for the winning
	duelists, and spit out the results. It will clear out the attacker and defenders
	but keep the new momentum attributes with their new values.
	
	"!resetspellduel" will end the duel completely. All momentum is reset to 10.
*/
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
    return abilityScoreModifier;
};

function updateAbilityScoreModifier(characterObj,characterName,abilityName,abilityValue) {
	var modifierName; 
	for(i = 0; i < state.dcc.abilityScoreArray.length; i++) {
        if (abilityName === state.dcc.abilityScoreArray[i][0]) {
            modifierName = state.dcc.abilityScoreArray[i][1];
            break;
        };
    };
    if (modifierName != undefined) {
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
        var player = msg.who.replace(/\s.+/,""); 
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
    } else {
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
	};
    if (!state.dcc.abilityScoreArray) {
        state.dcc.abilityScoreArray = [["Strength","STR"],["Agility","AGI"],["Stamina","STA"],["Personality","PER"],["Intelligence","INT"],["Luck","LCK"]]; 
    };
});


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



function deed(characterObj, attributeObjArray, deedDamageDie, deedAttackArray, deedDamageArray, deedTypeArray, deedType, threat) {

	// assign the variables for output.
	var characterName = characterObj.get("name");	
	var actionDieValue = attributeObjArray[0].get("current"); //attributeValue[0];
	var deedDeedValue = attributeObjArray[1].get("current"); //attributeValue[1];
	
    // get the deed die value, as expressed as 1d7 or d5 or whatever in the current value of the attribute.
	var d = deedDeedValue.indexOf("d")+1;
    var deedDeedDie = parseInt(deedDeedValue.slice(d));	
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
	
	//build attack results to send to chat function
   	var attackChatString = "/r " + actionDieValue; 
    for (var i = 0; i < deedAttackArray.length; i++) {
		deedAttackArray[i] = removePlus(deedAttackArray[i]);
        if (deedAttackArray[i] !== "None") {
            if (deedAttackArray[i].indexOf("-") !== -1) {
                attackChatString = attackChatString.concat(deedAttackArray[i]);
            } else {
                attackChatString = attackChatString.concat(" +", deedAttackArray[i]);
            };
        };
    };
	
	attackChatString = attackChatString.concat(" +", deedResult);

	sendChat(characterName,attackChatString, function(ops) {
		var rollresult = JSON.parse(ops[0].content);
		var rollResultOutput = buildRollOutput(rollresult);
		var attackRoll = rollresult.total;
		var actionDieResult = rollresult.rolls[0].results[0].v;
		sendChat(characterName, rollResultOutput + " to attack!");
		if (threat === undefined) {
			threat = "20";
		}
		if (actionDieResult >= threat) {
			sendChat(characterName, "Critical Hit!");
		};
	});

    //build damage results to send to chat function
	var dmgChatString = "/r " + deedDamageDie;
    for (var i = 0; i < deedDamageArray.length; i++) {
		deedDamageArray[i] = removePlus(deedDamageArray[i]);
        if (deedDamageArray[i] !== "None") {
            if (deedDamageArray[i].indexOf("-") !== -1) {
                dmgChatString = dmgChatString.concat(deedDamageArray[i]);
            } else {
                dmgChatString = dmgChatString.concat(" +", deedDamageArray[i]);
            };
        };
    };

    dmgChatString = dmgChatString.concat(" +", deedResult);
	
	sendChat(characterName,dmgChatString, function(ops) {
		var rollresult = JSON.parse(ops[0].content);
		var rollResultOutput = buildRollOutput(rollresult);
		var damageRoll = rollresult.total;
		sendChat(characterName, rollResultOutput + " damage!");
	});
};


on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!deed ") !== -1) {
		var selected = msg.selected;
		var deedTypeArray = ["Normal", "Mighty", "Smite"];
		var attributeArray = ["ActionDie", "DeedDie"];
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



function diceChain(characterObj,attributeObjArray,newValue) {
	
	//need to modify to prevent going below d3 or above d30
	
	
	var diceChainArray = ["d3", "d4", "d5", "d6", "d7", "d8", "d10", "d12", "d14", "d16", "d20", "d24", "d30"];
	var characterName = characterObj.get("name");
	var attributeName = attributeObjArray[0].get("name");
	var attributeValue = attributeObjArray[0].get("current");
	
	var diePositionChange =	parseInt(removePlus(newValue));
	diePositionChange = parseInt(diePositionChange.toString());
	
	var newDiePosition = (diceChainArray.indexOf(attributeValue)) + diePositionChange;
	var newDie = diceChainArray[newDiePosition];

	attributeObjArray[0].set("current", newDie);
	
	//output
	sendChat("API", "/w gm " + characterName + " changed " + attributeName + " from " + attributeValue + " to " + newDie + ".");
	sendChat("API", "/w " + characterName + " changed " + attributeName + " from " + attributeValue + " to " + newDie + ".");

};


on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!dicechain ") !== -1) {
		//parse the input into two variables, attribute and newValue
		
        var selected = msg.selected;
		var Parameters = msg.content.split("!dicechain ")[1];
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
			diceChain(characterObj,attributeObjArray,newValue);
		});
		
    };
});


function debugLog(msg) {
    //debug variables
	var v = [];
	v.push(["state.dcc.spellDuel.active", state.dcc.spellDuel.active]);
	v.push(["state.dcc.spellDuel.attackerObj",state.dcc.spellDuel.attackerObj]); 
	v.push(["state.dcc.spellDuel.attackerSpell", state.dcc.spellDuel.attackerSpell]); 
	v.push(["state.dcc.spellDuel.attackerRoll", state.dcc.spellDuel.attackerRoll]);
	v.push(["state.dcc.spellDuel.defenderObjArray", state.dcc.spellDuel.defenderObjArray]); 
	v.push(["state.dcc.spellDuel.defenderSpellArray", state.dcc.spellDuel.defenderSpellArray]); 
	v.push(["state.dcc.spellDuel.defenderRollArray", state.dcc.spellDuel.defenderRollArray]); 
	//end debug variables
	debug(msg,v);
};

function spellDuel(characterObj, spellName, spellRoll) {

    debugLog("spellDuel");
    var characterName = characterObj.get("name");
	// check if the attacker spell has already been cast or not.
	if (state.dcc.spellDuel.active === false) {
		state.dcc.spellDuel.attackerObj = characterObj;
		state.dcc.spellDuel.attackerSpell = spellName;
		state.dcc.spellDuel.attackerRoll = spellRoll;
		debugLog("duel inactive. passing ball to the last spellcaster");
		return;
	};
	
	// check if characterObj is already the attacker, a defender, or neither.
	var characterRole = "neither";
	if (_.isEqual(characterObj, state.dcc.spellDuel.attackerObj)) {
		characterRole = "attacker";
	};
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {
		if (_.isEqual(characterObj, state.dcc.spellDuel.defenderObjArray[i])) {
			characterRole = "defender";
		};
	};

	if (state.dcc.spellDuel.active === true) {
		
		if (characterRole === "attacker") {
			state.dcc.spellDuel.attackerSpell = spellName;
			state.dcc.spellDuel.attackerRoll = spellRoll;
			sendChat(characterName, "The attacker " + characterName + " casts a spell in a spell duel!");
			debugLog("spell success. caster is attacker. this spell will be the attacker's spell.");
			return;
		};	
		if (characterRole === "defender") {
			var j = state.dcc.spellDuel.defenderObjArray.indexOf(characterObj);
			state.dcc.spellDuel.defenderSpellArray[j] = spellName;
			state.dcc.spellDuel.defenderRollArray[j] = spellRoll;
			debugLog("duel active. spell success. caster is in defender array. variables set with results.");
			log(characterObj);
			log("should be the same as");
			log(state.dcc.spellDuel.defenderObjArray[j]);
			return;
		};
		
		if (characterRole = "neither") {
			debugLog("duel active. spell success. caster is not a defender. spell is just cast. do nothing.");
			return;
		};
	};
	
	debugLog("end spellDuel function, nothing happened.");
	return;
};


function counterSpell(defenderToken, attackerToken) {
	
	debugLog("counterSpell");
	log(defenderToken);
	log(attackerToken);
	
	var defenderTokenObj = findObjs({                              
		_pageid: Campaign().get("playerpageid"),                              
		_type: "graphic",
		_subtype: "token",
		_id: defenderToken
	}, {caseInsensitive: true})[0];
	
	log(defenderTokenObj);
		
	if(!defenderTokenObj.get("represents")) {
        var errormsg = "selected token has no character";
        sendChat('ERROR', errormsg);
        return;
	};
	var defenderObj = getObj("character", defenderTokenObj.get("represents"));	
	
	log(defenderObj);
	
	var attackerTokenObj = findObjs({                              
		_pageid: Campaign().get("playerpageid"),                              
		_type: "graphic",
		_subtype: "token",
		_id: attackerToken
	}, {caseInsensitive: true})[0];
	
	log(attackerTokenObj);
		
	if(!attackerTokenObj.get("represents")) {
        var errormsg = "target token has no character";
        sendChat('ERROR', errormsg);
        return;
	};
	var attackerObj = getObj("character", attackerTokenObj.get("represents"));	
	
	log(attackerObj);
	
	var attackerName = attackerObj.get("name");
	log(attackerName);
	var defenderName = defenderObj.get("name");
	log(defenderName);
	
	// check if defenderObj is already the attacker, a defender, or neither.
	var defenderRole = "neither";
	if (_.isEqual(defenderObj, state.dcc.spellDuel.attackerObj)) {
		defenderRole = "attacker";
	};
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {
		if (_.isEqual(defenderObj, state.dcc.spellDuel.defenderObjArray[i])) {
			defenderRole = "defender";
		};
	};
	
	log(defenderRole);
	
	// check if attackerObj is already the attacker, a defender, or neither.
	var attackerRole = "neither";
	if (_.isEqual(attackerObj, state.dcc.spellDuel.attackerObj)) {
		attackerRole = "attacker";
	};
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {
		if (_.isEqual(attackerObj, state.dcc.spellDuel.defenderObjArray[i])) {
			attackerRole = "defender";
		};
	};
	
	log(attackerRole);
		
	if (state.dcc.spellDuel.active === false) {
		
		// case where counterspell has not been clicked, and nobody has been defined as attacker or defender
		if ((defenderRole === "neither") && ((attackerRole === "neither") ||  (attackerRole === "attacker"))) { 
			state.dcc.spellDuel.active = true;	
			state.dcc.spellDuel.defenderObjArray.push(defenderObj);
			state.dcc.spellDuel.attackerObj = attackerObj;
	
			sendChat("Spell Duel", "/desc " + defenderName + " is going to counterspell against " + attackerName + "!");
	
			debugLog("duel inactive. character is not attacker. turn on duel. push character to defender array.");
	
			return;
		};
		
	};
	
	if (state.dcc.spellDuel.active === true) {
		
		//case where a defender and an attacker have been defined, and new counterspeller is coming in.
		if ((defenderRole === "neither") && (attackerRole === "attacker")) {
			state.dcc.spellDuel.defenderObjArray.push(defenderObj);
			sendChat("Spell Duel", "/desc " + defenderName + " has joined the duel and may now cast a counterspell!");
			debugLog("if the character is not already a defender. character added as a defender. add spellcaster to defender array");
			return;
		};
		
		//case where a defender and an attacker have been defined, but defender has clicked counterspell more than once, as if to join again.
		if ((defenderRole === "defender") && (attackerRole === "attacker")) {
			sendChat("Spell Duel", "/desc " + defenderName + "had already joined the duel and may now cast a counterspell!");		
			debugLog("character is already defender. if the character is already in the defender list, possibly by already hitting the counterspell macro. tell them they are already in the duel.");
			return;
		};
		
		//case where somebody already designated as the attacker tries to join the ongoing spell duel.
		if (defenderRole === "attacker") {
			sendChat("Spell Duel Error", "/desc " + defenderName + " is already being counterspelled!");		
			debugLog("character counterspelling already defined as attacker. send error. do nothing.");
            return;
		}; 
		
	};
	
	debugLog("end counterspell function. nothing happened.");

	return;	
};


function resolveSpellDuel() {

	debugLog("begin resolveSpellDuel.");

	if (state.dcc.spellDuel.active === false) {
		sendChat("Spell Duel", "/w gm no duel active.");
		return;
	}
	
	//make sure all of the defenders have actually cast a spell.
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {
		if (state.dcc.spellDuel.defenderRollArray[i] === undefined) {
			sendChat("Spell Duel Error", "A counterspeller did not cast a spell. Cast spell and resolve spell duel." );
			return;
		};
	};

	//declare variables
	var spellDuelChain = [0, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 10, 10, 12, 12, 14, 16];
	var spellDuelScore = [];
	var spellDuelDie = [];
	var spellDuelResult = [];
	var spellDuelMomentumName = "Momentum";
	var spellDuelRoll =[];
	var phDRoll = [];
	
	var attackerName = state.dcc.spellDuel.attackerObj.get("name");
	log("attackerName");
	log(attackerName);
	
	var defenderName = [];
	
	var defenderMomentumObj = [];
	var defenderMomentum = [];
	var momentumDiff = [];
	var newMomentum = [];
	var spellDuelMomentumName = "Momentum";
		
	//check if attacker has a momentum attribute, if not, create it	
	var attackerMomentumObj = findObjs({                                                          
		_type: "attribute",
		name: spellDuelMomentumName,
		_characterid: state.dcc.spellDuel.attackerObj.id
	}, {caseInsensitive: true})[0];

	log(attackerMomentumObj);
	
	if (attackerMomentumObj === undefined) {
        var errormsg = "selected target required momentum, creating.";
        sendChat('ERROR', errormsg);
		createObj("attribute", {
	        name: spellDuelMomentumName,
	        current: "10",
	        max: "10",
	        _characterid: state.dcc.spellDuel.attackerObj.id
	    });	
		attackerMomentumObj = findObjs({                                                          
			_type: "attribute",
			name: spellDuelMomentumName,
			_characterid: state.dcc.spellDuel.attackerObj.id
		}, {caseInsensitive: true})[0];
		log(attackerMomentumObj);
	};

	var attackerMomentum = parseInt(attackerMomentumObj.get("current"));
	
	log(attackerMomentum);

	// main loop to go through list of counterspellers vs attacker
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {

		defenderName[i] = state.dcc.spellDuel.defenderObjArray[i].get("name");
		log("defenderName");
		log(defenderName[i]);
				
		//check if defender has momentum, create if not.
		defenderMomentumObj[i] = findObjs({                                                      
			_type: "attribute",
			name: spellDuelMomentumName,
			_characterid: state.dcc.spellDuel.defenderObjArray[i].id
		}, {caseInsensitive: true})[0];
		
		log(defenderMomentumObj[i]);
	
		if (defenderMomentumObj[i] === undefined) {
	        var errormsg = "selected token required momentum, creating.";
	        sendChat('ERROR', errormsg);
			createObj("attribute", {
		        name: spellDuelMomentumName,
		        current: "10",
		        max: "10",
		        _characterid: state.dcc.spellDuel.defenderObjArray[i].id
		    });	
			defenderMomentumObj[i] = findObjs({                                                      
				_type: "attribute",
				name: spellDuelMomentumName,
				_characterid: state.dcc.spellDuel.defenderObjArray[i].id
			}, {caseInsensitive: true})[0];
			log(defenderMomentumObj[i]);
		};

		defenderMomentum[i] = parseInt(defenderMomentumObj[i].get("current"));
		
		log(defenderMomentum[i]);
		
		momentumDiff[i] = attackerMomentum - defenderMomentum[i];		

		// spellDuelScore will be the difference between the attacker and the defender. negative result defender wins, positive, attacker wins, equal is a Phlogiston Disturbance
		spellDuelScore[i] = state.dcc.spellDuel.attackerRoll - state.dcc.spellDuel.defenderRollArray[i];
		log(spellDuelScore[i]);
		// the die to roll is determined by the absolute value of the duel score
		spellDuelDie[i] = spellDuelChain[Math.min(Math.abs(spellDuelScore[i]),16)];
		log(spellDuelDie[i]);
		

		//Defender High
		if (spellDuelScore[i] < 0) {
		
			spellDuelRoll[i] = randomInteger(spellDuelDie[i]);
			
			// add +1 momentum to the defender
			newMomentum[i] = defenderMomentum[i]+1;
			defenderMomentumObj[i].set("current", newMomentum[i].toString());

			momentumDiff[i] = attackerMomentum - defenderMomentum[i];
	
			if ((spellDuelRoll[i]-momentumDiff[i]) <= 1) {
				var x = randomInteger(4);
				spellDuelResult[i] = "1: Mitigate d4: roll d4, \<b\> " + x + "\<\/b\>, and subtract this from the " + attackerName + "\'s spell check. " + attackerName + "\'s spell still carries through at this lower spell check; " + defenderName[i] + "\'s spell is lost.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  attackerName,  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.attackerSpell, "\<\/b\> is now \<b\>", state.dcc.spellDuel.attackerRoll - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 2) {
				var x = randomInteger(6);
				spellDuelResult[i] = "2: Mitigate d6: roll d6, \<b\> " + x + "\<\/b\>, and subtract this from the " + attackerName + "\'s spell check. " + attackerName + "\'s spell still carries through at this lower spell check; " + defenderName[i] + "\'s spell is lost.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  attackerName,  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.attackerSpell, "\<\/b\> is now \<b\>", state.dcc.spellDuel.attackerRoll - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 3) {
				var x = randomInteger(8);
				spellDuelResult[i] = "3: Mitigate d8: roll d8, \<b\> " + x + "\<\/b\>, and subtract this from the " + attackerName + "\'s spell check. " + attackerName + "\'s spell still carries through at this lower spell check; " + defenderName[i] + "\'s spell is lost.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  attackerName,  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.attackerSpell, "\<\/b\> is now \<b\>", state.dcc.spellDuel.attackerRoll - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 4) {
				var x = randomInteger(10);
				spellDuelResult[i] = "4: Mutual mitigation d10: roll d10, \<b\> " + x + "\<\/b\>, and subtract this from the " + attackerName + "\'s spell check and the " + defenderName[i] + "\'s spell check. Both spells take effect simultaneously at this lower spell check result.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  attackerName,  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.attackerSpell, "\<\/b\> is now \<b\>", state.dcc.spellDuel.attackerRoll - x, "\<\/b\>");
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 5) {
				spellDuelResult[i] = "5: Mutual cancellation: both " + attackerName + "\'s and " + defenderName[i] + "\'s spells are cancelled.";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 6) {
				var x = randomInteger(6);
				spellDuelResult[i] = "6: Push-through d6: roll d6, \<b\> " + x + "\<\/b\>, and subtract from " + defenderName[i] + "\'s spell check. " + defenderName[i] + "\'s spell takes effect at this result and " + attackerName + "\'s spell is cancelled.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 7) {
				var x = randomInteger(4);
				spellDuelResult[i] = "7: Push-through d4: roll d4, \<b\> " + x + "\<\/b\>, and subtract from " + defenderName[i] + "\'s spell check. " + defenderName[i] + "\'s spell takes effect at this result and " + attackerName + "\'s spell is cancelled.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 8) {
				spellDuelResult[i] = "8: Overwhelm: " + attackerName + "\'s spell is cancelled}; and " + defenderName[i] + "\'s spell takes effect at normal result.";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 9) {
				spellDuelResult[i] = "9: Reflect: " + defenderName[i] + "\'s spell is cancelled}; and " + attackerName + "\'s spell reflects back on him at the spell check result rolled.";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) >= 10) {
				spellDuelResult[i] = "10+: Reflect and overwhelm: " + defenderName[i] + "\'s spell takes effect at normal result and " + attackerName + "\'s spell reflects back on him at the spell check result rolled.";
			};	
		};

		// Attacker High
		if (spellDuelScore[i] > 0) {
		
			spellDuelRoll[i] = randomInteger(spellDuelDie[i]);
			
			// add +1 momentum to the attacker
			newMomentum[i] = attackerMomentum+1;
			attackerMomentumObj.set("current", newMomentum[i].toString());

			momentumDiff[i] = attackerMomentum - defenderMomentum[i];
			
			if ((spellDuelRoll[i]-momentumDiff[i]) <= 1) {
				var x = randomInteger(4);
				spellDuelResult[i] = "1: Push-through d4: roll d4, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + defenderName[i] + "\'s spell takes effect at this lower result and " + attackerName + "\'s spell takes effect simultaneously at normal spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 2) {
				var x = randomInteger(8);
				spellDuelResult[i] = "2: Push-through d8: roll d8, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + defenderName[i] + "\'s spell takes effect at this lower result and " + attackerName + "\'s spell takes effect first at normal spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 3) {
				spellDuelResult[i] = "3: Overwhelm: " + attackerName + "\'s spell takes effect and " + defenderName[i] + "\'s spell is cancelled. \<br\>";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 4) {
				spellDuelResult[i] = "4: Overwhelm: " + attackerName + "\'s spell takes effect and " + defenderName[i] + "\'s spell is cancelled. \<br\>";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 5) {
				spellDuelResult[i] = "5: Overwhelm: " + attackerName + "\'s spell takes effect and " + defenderName[i] + "\'s spell is cancelled. \<br\>";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 6) {
				var x = randomInteger(8);
				spellDuelResult[i] = "6: Overwhelm and reflect d8: roll d8, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + attackerName + "\'s spell takes effect simultaneously at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at this lower spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 7) {
				var x = randomInteger(8);
				spellDuelResult[i] = "7: Overwhelm and reflect d8: roll d8, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + attackerName + "\'s spell takes effect first at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at this lower spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 8) {
				var x = randomInteger(6);
				spellDuelResult[i] = "8: Overwhelm and reflect d6: roll d6, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + attackerName + "\'s spell takes effect first at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at this lower spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 9) {
				var x = randomInteger(4);
				spellDuelResult[i] = "9: Overwhelm and reflect d4: roll d4, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + attackerName + "\'s spell takes effect first at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at this lower spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) >= 10) {
				spellDuelResult[i] = "10+: Reflect and overwhelm: " + attackerName + "\'s spell takes effect at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at normal spell check. \<br\>";
			};
		};

		//Phlogiston Disturbance Table
		if (spellDuelScore[i] === 0) {
			
			phDRoll[i] = randomInteger(10);
			
			if (phDRoll[i] === 1) {
				var x = randomInteger(6);
				spellDuelResult[i] = "1 Pocket dimension. Both casters are instantaneously transferred to a pocket dimension that is spontaneously created by the interaction between their spells. They remain within the pocket dimension until one is killed at which point the interaction of their spells ceases and the survivor is transferred back to the material plane one millisecond after his departure. Observers see only a brief flicker and the disappearance of the loser whose body is lost forever. ";
				spellDuelResult[i] = spellDuelResult[i].concat("The pocket dimension appears as (roll 1d6) ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) a mountaintop surrounded by red clouds ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) a bubble adrift in space ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) a sweltering island in a sea of lava ");
				if (x === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) an upside-down forest where the trees grow down from the sky above ");
				if (x === 5) spellDuelResult[i] = spellDuelResult[i].concat("(5) a dust mote atop the point of a needle ");
				if (x === 6) spellDuelResult[i] = spellDuelResult[i].concat("(6) the left nostril of an intergalactic whale.");
			};
			if (phDRoll[i] === 2) {
				var x = randomInteger(4);
				spellDuelResult[i] = "2 Alignment rift. Both casters are transferred to an alignment plane. If both are the same alignment they go to that plane; if they are opposed or if either is neutral they transfer to the plane of neutrality. ";
				spellDuelResult[i] = spellDuelResult[i].concat("They return to the material plane after (roll 1d4) ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) one caster is killed (both bodies return) ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) 1d8 days ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) 3d6 rounds for each caster rolled separately ");
				if (x === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) The End of Days.");
			};
			if (phDRoll[i] === 3) {
				var x = randomInteger(4);
				var y = randomInteger(4);
				var z = x + y;
				spellDuelResult[i] = "3 Time accelerates. Both casters see everything around them slow down; in reality they are accelerating and surrounding characters see them move at incredible speeds. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Resolve an additional 2d4 rounds of combat,  \<b\> ", z , "\<\/b\>, between the casters only; no other characters may act in this time. ",
				"At the end of this time they slow back into the mainstream flow of time. \<br\>");
			};
			if (phDRoll[i] === 4) {
				var x = randomInteger(3);
				spellDuelResult[i] = "4 Time slows. The casters perceive the world around them as normal but observers see their reactions slow to a crawl. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Roll 1d3,  \<b\> ", x , "\<\/b\>, and resolve that many rounds of combat among other participants before the casters can react again. \<br\>");
			};
			if (phDRoll[i] === 5) {
				var x = randomInteger(4);
				spellDuelResult[i] = "5 Backward loop in time. The casters are tossed backward in time to relive the last few moments repeatedly. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Roll 1d4,  \<b\> ", x , "\<\/b\>, and repeat the last spell interaction that many times re-rolling spell checks and incrementing momentum trackers but ignoring any subsequent Phlogiston Disturbance results (treat same-check results as \"both spells cancelled\". For example if the attacker cast magic missile and the defender cast magic shield the two would repeat 1d4 repetitions of that same spell check result. No spell can be lost during this time and a below-minimum result indicates only a failure and the spell cast repeats on the next loop. When this time loop is concluded the two casters re-enter the normal initiative count. \<br\>");
			};
			if (phDRoll[i] === 6) {
				spellDuelResult[i] = "6 Spells merge. In a freak of eldritch energy the two spells merge to create something greater than both. This result requires judge mediation. Generally speaking the resulting effect is centered directly between the two casters and is either: (a) twice as powerful as the normal spell (if two opposing spells had cancelled each other) or (b) some weird agglomeration of spell effects (if two different spells were used). For example if two fireballs were cast there may be a super-fireball that impacts between the two casters. Or if fire resis- tance countered fireball a flameless fireball could be set off generating concussive noise and astounding force but no flames. \<br\>";
			};
			if (phDRoll[i] === 7) {
				var x = randomInteger(4);
				spellDuelResult[i] = "7 Supernatural influence. The casters create a rift in space and some supernatural influence filters through. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Both spells fail and roll 1d4 ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) a randomly determined elemental energy suffuses the surrounding around causing minor effects (for example flames and heat fill the air to cause 1 damage to everyone within 50' or a massive rainstorm erupts centered on the casters). ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) negative energy drains through granting +1d8 hit points to all un-dead and demons nearby. ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) shadow energy fills the air limiting eyesight to half normal range. ");
				if (x === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) ethereal mists swirl about and 1d4 randomly determined ghosts enter the world.");
			};
			if (phDRoll[i] === 8) {
				var x = randomInteger(3);
				var y = randomInteger(4)+1;
				var z = randomInteger(5);
				spellDuelResult[i] = "8 Supernatural summoning. The combined spell results inadvertently pull a supernatural creature through the fabric of space and time. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Randomly determine the nature of the supernatural creature: (roll 1d3) ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) elemental. ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) demon. ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) celestial. ");
				spellDuelResult[i] = spellDuelResult[i].concat("The creature has 1d4+1 HD,  \<b\> ", y , "\<\/b\> ");
				spellDuelResult[i] = spellDuelResult[i].concat("Determine the creature's reaction by rolling 1d5 ");
				if (z === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) hostile to all ");
				if (z === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) hostile to one caster (randomly determined) and neutral to other ");
				if (z === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) friendly to one caster (randomly determined) and hostile to other ");
				if (z === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) neutral to all parties ");
				if (z === 5) spellDuelResult[i] = spellDuelResult[i].concat("(5) friendly to all parties." );
			};
			if (phDRoll[i] === 9) {
				var x = randomInteger(4);
				var z = randomInteger(5);
				spellDuelResult[i] = "9 Demonic invasion. ";
				spellDuelResult[i] = spellDuelResult[i].concat("1d4 randomly determined demons are summoned at the exact midpoint between the two casters. ",
				"The demons are of a type as determined here: (roll 1d4) ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) type I. ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) type II. ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) type III. ");
				if (x === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) type IV. ");
				spellDuelResult[i] = spellDuelResult[i].concat("Determine the creature's reaction by rolling 1d5 ");
				if (z === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) hostile to all ");
				if (z === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) hostile to one caster (randomly determined) and neutral to other ");
				if (z === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) friendly to one caster (randomly determined) and hostile to other ");
				if (z === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) neutral to all parties ");
				if (z === 5) spellDuelResult[i] = spellDuelResult[i].concat("(5) friendly to all parties." );
			};
			if (phDRoll[i] === 10) {
				spellDuelResult[i] = "10 Mutual corruption. Both spells fail and both casters suffer 1d4+1 corruption results. Roll corruption as normal for the spells involved. \<br\>";
			};
		};
		

		sendChat("Spell Duel", " " + spellDuelResult[i] + "");
		
		debugLog("spell Duel resolution.");
	
	};
		
	//reset all spell duel variables for this round
	//state.dcc.spellDuel = {};
	state.dcc.spellDuel.active = false;
	state.dcc.spellDuel.attackerObj = {};
	state.dcc.spellDuel.attackerSpell =  "";
	state.dcc.spellDuel.attackerRoll = 0;
	state.dcc.spellDuel.defenderObjArray = [];
	state.dcc.spellDuel.defenderSpellArray = [];
	state.dcc.spellDuel.defenderRollArray = [];

	debugLog("reset spell duel.");

	return;

};


function spellDuelReset() {
	//find all characters with momentum attribute and set to 10.
	var spellDuelMomentumName = "Momentum";
	
	var momentumCharacters = findObjs({                              
	  name: spellDuelMomentumName,                              
	  _type: "attribute",                          
	});
	
	_.each(momentumCharacters, function(obj) {    
		obj.set("current", "10");
	});

	//reset all spell duel variables for this round of the spell duel
	state.dcc.spellDuel = {};
	state.dcc.spellDuel.active = false;
	state.dcc.spellDuel.attackerObj = {};
	state.dcc.spellDuel.attackerSpell =  "";
	state.dcc.spellDuel.attackerRoll = 0;
	state.dcc.spellDuel.defenderObjArray = [];
	state.dcc.spellDuel.defenderSpellArray = [];
	state.dcc.spellDuel.defenderRollArray = [];
	
	sendChat("Spell Duel", "/w gm spellduel reset");
	
	debugLog("reset spell duel.");
	
};


on("chat:message", function(msg) {	 
	if (msg.type === "api" && msg.content.indexOf("!counterspell") !== -1) {
        var param = msg.content.split("!counterspell ")[1];
        var defenderToken = param.split("|")[0];
        var attackerToken = param.split("|")[1];
		counterSpell(defenderToken, attackerToken);
	};
	
    if (msg.type === "api" && msg.content.indexOf("!resolvespellduel") !== -1) resolveSpellDuel();
	
	if (msg.type === "api" && msg.content.indexOf("!debugspellduel") !== -1) debugSpellDuel(msg);

	if (msg.type === "api" && msg.content.indexOf("!resetspellduel") !== -1) spellDuelReset();

});

// check for existence of state.dcc.spellDuel.* properties -- create  if they don't exist
on("ready", function() {
	// bh: incomplete list so far	
	state.dcc.spellDuel = state.dcc.spellDuel || {};
	log(typeof state.dcc.spellDuel);
	state.dcc.spellDuel.active = state.dcc.spellDuel.active || false;
	log(typeof state.dcc.spellDuel.active);
	state.dcc.spellDuel.attackerObj = state.dcc.spellDuel.attackerObj || {};
	log(typeof state.dcc.spellDuel.attackerObj);
	state.dcc.spellDuel.attackerSpell = state.dcc.spellDuel.attackerSpell || "";
	log(typeof state.dcc.spellDuel.attackerSpell);
	state.dcc.spellDuel.attackerRoll = state.dcc.spellDuel.attackerRoll || 0;
	log(typeof state.dcc.spellDuel.attackerRoll);
	state.dcc.spellDuel.attackerInitiative = state.dcc.spellDuel.attackerInitiative || 0;
	log(typeof state.dcc.spellDuel.attackerInitiative);
	state.dcc.spellDuel.defenderObjArray = state.dcc.spellDuel.defenderObjArray || [];
	log(typeof state.dcc.spellDuel.defenderObjArray);
	state.dcc.spellDuel.defenderSpellArray = state.dcc.spellDuel.defenderSpellArray || [];
	log(typeof state.dcc.spellDuel.defenderSpellArray);
	state.dcc.spellDuel.defenderRollArray = state.dcc.spellDuel.defenderRollArray || [];
	log(typeof state.dcc.spellDuel.defenderRollArray);
	
	debugLog("state.dcc.spellDuel variables defined.");
	
});
	
	
	

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
			wizardSpell(characterObj, attributeObjArray, spellName, spellLevel, spellModArray);
		});
		
    };
});


function buildRollOutput(obj) {

	var rollFormat = rollFormat || {};

	rollFormat.CSSBGColor = "white"; //Color of background
	rollFormat.CSSbrdrColor = "black"; //color of border 
	rollFormat.CSSfontColor = "black"; // color of text
	rollFormat.CSSfumbleColor = "red"; //color of lowest rolls (1 on 1dX)
	rollFormat.CSScriticalColor = "green"; //color of highest rolls (X on 1dX)

	rollFormat.modCSS =  "font-size: 1em;"; //Modifer size
	rollFormat.totCSS =  "font-size: 1.5em;"; //Totals size

	rollFormat.CSS = "background:" + rollFormat.CSSBGColor + "; color:" + rollFormat.CSSfontColor + "; border-radius: 8px; padding:4px; font-size: 1.1em; border-style:solid; border-color:" + rollFormat.CSSbrdrColor + "; border-width:1px;";
	var notes = "";

	var output = "<TABLE border='0' cellpadding = '4' style='text-align:center;'><TR>";
    //loop through cleanedMsg to display each die rolled
    _.each(obj.rolls, function(nMsg){
        switch(nMsg.type) {
            case "R":
                output += "<TD border='1'><div style='" + rollFormat.CSS + "'>";
                output += nMsg.dice + "d" + nMsg.sides + " = <br />(";
                var count = 0;
                _.each(nMsg.results, function(resOut){
                    count += 1;
                    if(resOut.d == true){
                        output += "<i style='text-decoration: line-through'>"
                    }
                    if (resOut.v == nMsg.sides) {
                        output += "<strong style='font-size: 1.5em; color:" + rollFormat.CSScriticalColor + "';>" + resOut.v + "</strong>";
                    } else if (resOut.v == 1){
                         output += "<strong style='font-size: 1.5em; color:" + rollFormat.CSSfumbleColor + "';>" + resOut.v + "</strong>";
                    } else {
                        output += resOut.v;
                    }
                    if(resOut.d == true) {
                        output += "</i>"
                    }
                    if (count !== nMsg.results.length) {
                        output += ",";
                    }
                });
                output += ") </div></TD>";
                break;
            case "M":
                output += "<TD><div style='" + rollFormat.modCSS + "'>";
                output += nMsg.expr + "</div></TD>";
                break;
            case "C":
               notes += nMsg.text;
                break;
        }
    });
        
    output += "<TD><div style='" + rollFormat.totCSS+ "'> = " + obj.total + notes + "</div> </TD> </TR> </TABLE>"

	return output;
	
};

//---------------------------------------------------------------------------------------------------------------------------------------------


function debug(msg,v) {
	log("--------------------------------------------------------------------------");
	log(msg);
	log("--------------------------------------------------------------------------");
	for (var i = 0; i < v.length; i++) {
		log(v[i]);
	};
	log("--------------------------------------------------------------------------");
	return true;
};


//---------------------------------------------------------------------------------------------------------------------------------------------


function removePlus(string) {
	// takes a string and removes the + to return the integer after it
	// useful when attribute values +2 and you only need the integer associated.
	var p = string.indexOf("+");
	var n = string.substr(p+1);
	return n;
};

//---------------------------------------------------------------------------------------------------------------------------------------------

function getAttributeObjects(characterObj,attributeArray,who) {
	// can pass array of attribute strings or a single attribute string	along with an associated character
	// returns those attributes as an object array or returns false if they do not exist on the passed character.
	
	
	// get the passed attribute name array from the character object and test if they are defined
	
	if (characterObj != undefined ) {
		var attributeObjArray = new Array();
		if (!(attributeArray instanceof Array)) {
			attributeArray = attributeArray.split();
		};
		for (var i = 0; i < attributeArray.length; i++) {
			attributeObjArray[i] = findObjs({_type: "attribute", name: attributeArray[i], _characterid: characterObj.id})[0];
			if (attributeObjArray[i] === undefined) {
				sendChat("API","/w " + who + " Selected character requires attribute: " + attributeArray[i] + " ");
			};
		};		
	};
	if (attributeObjArray.indexOf(undefined) !== -1) return false;

	//loop through attributeArray and names of attributes to make sure they all match and get their values if they are valid. 
	//make sure none of the values are empty
	var attributeValue = new Array();	
	var j = 0;
	for (var i = 0; i < attributeArray.length; i++) {
			attributeValue[i] = attributeObjArray[i].get("current");
			if (attributeValue[i] === "") {
				sendChat("API","/w " + who + " " + attributeArray[i] + " is empty.");
				j++;
			};
	};
	if (j !== 0) return false;

	return attributeObjArray;
};



//---------------------------------------------------------------------------------------------------------------------------------------------

function getCharacterObj(obj,who) {
	
	//send any object and returns the associated character object
	//returns character object for attribute, token/graphic, and ability, and... character
	
	var objType = obj._type;
	
	if ((objType != "attribute") && (objType != "graphic") && (objType != "character")) {
		sendChat("API","/w " + who + " cannot be associated with a character.");
		return false;
	} 

	if ((objType === "attribute") || (objType === "ability")) {
		var att = getObj(objType, obj._id);
		if (att.get("_characterid") != "") {
			var characterObj = getObj("character", att.get("_characterid"));
		};
	};
	
	if (objType === "graphic") { 
		var tok = getObj("graphic", obj._id);
    	if (tok.get("represents") != "") {
       		var characterObj = getObj("character", tok.get("represents"));
    	} else {
			sendChat("API","/w " + who + " Selected token does not represent a character.");
			return false;
    	};
	};
		
	if (objType === "character") {
		var characterObj = getObj("character", obj._id);
	}

	return characterObj;
};

//---------------------------------------------------------------------------------------------------------------------------------------------



