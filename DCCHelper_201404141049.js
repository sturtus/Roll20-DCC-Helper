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
/*  Chronos Timekeeper: Calendar and Timekeeper Script for roll20.net
	
	!chronos                        returns elapsed time so far (needs updating)
	!chronos #y,#m,#d,#h,#n         adds a number of years, months, days, hours, minutes (n) to clock. 
	!chronos #y,#m,#d,#h,#n -xyz    parameters (not implemented yet)
	
*/
/*
healingData objects: 
healingData[0][0]: minimum hours of rest for healing
healingData[0][1]: hp for minimum rest
healingData[0][2]: attributes points for minimum rest
healingData[1][0]: hours required for full rest
healingData[1][1]: hp healed for full rest
healingData[1][2]: attribute points for full tended rest
*/
/* 
on('ready', function() { 
 
	state.chronosid = findObjs({_type: "character", name: "Chronos"})[0].get("_id");
});
*/
});/*
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
});/*
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
});/* 
    ====================================
	Roll20 Character Sheet Money Counter
	====================================
	!earn coin1, coin2, ...
	!spend coin1, coin2, ...
	!purse
	
	Set of commands to add and remove coins from characters. 
	
	
*/
/*
	=============================================
	Roll20 Quick HP Assignment for Monster Tokens
	=============================================
	!HP hitDiceExpression
	
	Command to generate a hit point total for selected tokens, based on a hitDiceExpression
	in the form of 1d8+0, 2d12+5, etc., and assign it to the current/max values of 
	each token's bar 1. 
	I've set up all monster tokens to have the hitDiceExpression in an attribute named 
	"Hit Dice" and a macro: "!HP @{selected|Hit Dice}".
	
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
		roll. Can be mix of character attributes (INT,Level) as well as 
		numeric modifiers (+1). 
	
	Example:
	~~~~~~~~
	Jerp is a 2nd level wizard casting Animal Summoning, but has a mercurial magic
	that gives him a +1 to cast the spell
	!wizardspell Animal Summoning|1|INT, Level, +1
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
on("ready", function() {
    if (!state.chronos) {
        state.chronos = {}; 
    } else {
    };
    // remove "if" to redefine state.dcc.sheetAttributeArray, if necessary
    if (!state.chronos.years) {state.chronos.years = 0;};
    if (!state.chronos.months) {state.chronos.months = 1;};
    if (!state.chronos.days) {state.chronos.days = 1;};
    if (!state.chronos.hours) {state.chronos.hours = 0;};
    if (!state.chronos.minutes) {state.chronos.minutes = 0;};
    if (!state.chronos.weekday) {state.chronos.weekday = 0;};
	};
});
var month = [['January',31],['February',28],["March",31],['April',30],['May',31],['June',30],['July',31],['August',31],['September',30],['October',31],['November',30],['December',31]];
var lengthOfYear = lengthOfYear();
var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var weekday = 0;
 
var attributesToHeal = ['HP','Strength','Agility','Stamina','Personality','Intelligence'];
var healingData = [[8,1,1],[1,2,2]];
function lengthOfYear() {
    n = 0;
    for (i = 0; i < month.length; i++) {
        if (month[i][2] == undefined) {
            n = parseInt(n) + parseInt(month[i][1]);
        };
    };
    return n;
};
function updateChronos(years,months,days,hours,minutes) {
    if (minutes != 0) {
        var chronosMinuteMax = 60; // hard-coding this for now
        if (state.chronos.minutes + parseInt(minutes) >= parseInt(chronosMinuteMax)) {
            hours = parseInt(hours) + Math.floor((state.chronos.minutes + parseInt(minutes)) / chronosMinuteMax);
            state.chronos.minutes = Math.floor((state.chronos.minutes + parseInt(minutes)) % chronosMinuteMax);
        } else {
            state.chronos.minutes = parseInt(state.chronos.minutes) + parseInt(minutes)
        };
    };
    if (hours != 0) {
        var chronosHourMax = 24; // hard-coding this for now, under new state setup
        if (state.chronos.hours + parseInt(hours) >= parseInt(chronosHourMax)) {
            days = parseInt(days) + Math.floor((state.chronos.hours + parseInt(hours)) / chronosHourMax);
            state.chronos.hours = Math.floor((state.chronos.hours + parseInt(hours)) % chronosHourMax);
        } else {
            state.chronos.hours = parseInt(state.chronos.hours) + parseInt(hours)
        };
    };
	if (days != 0) {
        // this currently won't work if you add enough days to move the timer forward more than one month
        var chronosDayMax = month[state.chronos.months -1][1];
        if (state.chronos.days + parseInt(days) > parseInt(chronosDayMax) && month[state.chronos.months-1][1] != 1) {
            log("here");
            months = parseInt(months) + Math.floor((state.chronos.days + parseInt(days)) / chronosDayMax);
            state.chronos.days = Math.floor((state.chronos.days + parseInt(days)) % chronosDayMax);
        } else if (state.chronos.days + parseInt(days) > parseInt(chronosDayMax) && month[state.chronos.months-1][1] == 1) {
            log("there");
            months = parseInt(months) + 1;
            state.chronos.days = Math.floor((state.chronos.days + parseInt(days)) - 1);
        } else {
            state.chronos.days = parseInt(state.chronos.days) + parseInt(days);
        };
    };
    if (months != 0) {
        var chronosMonthMax = month.length -1;
        if (state.chronos.months + parseInt(months) > parseInt(chronosMonthMax)) {
            years = parseInt(years) + Math.floor((state.chronos.months + parseInt(months)) / chronosMonthMax);
            state.chronos.months = Math.floor((state.chronos.months + parseInt(months)) % chronosMonthMax);
        } else {
            state.chronos.months = parseInt(state.chronos.months) + parseInt(months)
        };
    };
    if (years != 0) {
        state.chronos.years = parseInt(state.chronos.years) + parseInt(years);
    }; 
    n = 0;
    for (i = 0; i < state.chronos.months -1; i++) {
        // get all the days in preceding months
        if (month[i][2] == undefined) {
            n = parseInt(n) + parseInt(month[i][1]);
        };
    };
    state.chronos.weekday = (((lengthOfYear * state.chronos.years) + n + state.chronos.days) % week.length);
    var daySuffix = "th";
    if (state.chronos.days < 4) {
        switch(state.chronos.days) {
            case 1:
                daySuffix = "st";
            break;
            case 2:
                daySuffix = "nd";
            break;
            default:
                daySuffix = "rd";
        };
    };
    var amPm = "am";
    var displayHours = state.chronos.hours;
    
    if (displayHours > 11) {
        amPm = "pm";
        displayHours = displayHours - 11;
    } else if (displayHours = 0) {
        displayHours = 12;
    };
    
    var paddingZero = "";
    
    if (state.chronos.minutes < 10) {
        paddingZero = "0";
    };
    
	sendChat("Chronos","/w gm " + state.chronos.hours + ":" + paddingZero + state.chronos.minutes + amPm);
 
};
function healCharacters(hd,lengthOfRest,typeOfHealing) {
// healCharacters function, called when parameter includes "r" for rest, "b" for bedrest
// lengthOfRest = number of hours or days to rest
// hoursOrDays = h or d
// typeOfHealing = normal, bedrest
    // put all the tokens on the page that represent characters into charactersToHeal[] array
    var charactersToHeal = filterObjs(function(obj) {
        
        if(obj.get("_pageid") == Campaign().get("playerpageid") && obj.get("_subtype") == "token" && obj.get("_represents") != "") return true;
        
        else return false;
        
    });
    // get attributes to heal, any healingData related attributes
    for (i = 0; i < charactersToHeal.length; i++) {
        
        var character = getObj("character", charactersToHeal[i].get("represents"));
        
        var attributes = filterObjs(function(obj){
            
            if (obj.get("_type") == "attribute" && obj.get("_characterid") == character.get("_id") && attributesToHeal.indexOf(obj.get("name")) != -1) return true;
            
            else return false;
            
        });
        
        for (i = 0; i < attributes.length; i++) {
            // now go through all the attributes for this character
            // and update based on the right parameters
            
            // if DCC, then [[8,1,1],[24,2,2]]
            // if BFRPG, then [[6,1,1],[24,2,1]]
            // if 3.5E, then [[8,1,'LVL'],[24,2,'LVL']]
            
            if (typeOfHealing == "normal") {
                
                if (lengthOfRest > 0 && hd == "d") {
                    
                    var amountToHeal = healingData[0][1] * lengthOfRest;
                    
                } else if (lengthOfRest >= healingData[0][0] && hd == "h") {
                    
                    var amountToHeal = healingData[0][1];    
                    
                } else {
                    
                    sendChat("Chronos","/w gm Not enough time for normal rest, aborting.");
                    
                    return; 
                    
                };
                
            } else if (typeOfHealing == "bedrest") {
                
                if (lengthOfRest > 0 && hd == "d") {
                    
                    var amountToHeal = healingData[1][1] * lengthOfRest;
                    
                } else {
                    
                    sendChat("Chronos","/w gm Not enough time for bedrest, aborting.");
                    
                    return; 
                    
                };
            };
            if (parseInt(attributes[i].get("current")) < parseInt(attributes[i].get("max"))) {
                attributes[i].set("current", parseInt(attributes[i].get("current")) + parseInt(amountToHeal));
                if (attributes[i].get("current") > attributes[i].get("max")) {
                    attributes[i].set("current", attributes[i].get("max"));
                };
            };
        };
    };
};
 
 
function updateLights(lightSource,elapsedTime) {
    var lightSourceName = lightSource.get("name");
    var brightRadius = lightSource.get("bar3_max");
    var dimRadius = lightSource.get("bar3_value");
    var burningTimeTotal = lightSource.get("bar1_max");
    var burningTimeRemaining = lightSource.get("bar1_value");
    var trigger_dim = Math.floor(burningTimeTotal * 0.3);
    var trigger_flicker = Math.floor(burningTimeTotal * 0.15);
    var trigger_almostOut = Math.floor(burningTimeTotal * 0.05);
    var newBurningTimeRemaining = burningTimeRemaining - (1.0 * elapsedTime);
    if (burningTimeRemaining == 0 || lightSource.get("bar2_value") == 0) return; // make sure light source is lit & has fuel remaining
    if (newBurningTimeRemaining >= trigger_dim && lightSource.get("light_radius") !== brightRadius) {
        lightSource.set({ light_radius: brightRadius, light_dimradius: dimRadius});
    } else if (newBurningTimeRemaining <= trigger_dim && newBurningTimeRemaining > trigger_flicker && (burningTimeRemaining > trigger_dim || burningTimeRemaining == newBurningTimeRemaining)) {
        sendChat("","/emas " + lightSourceName + " grows dim. ");
        lightSource.set({ light_dimradius: Math.floor(dimRadius * 0.66)});
    } else if (newBurningTimeRemaining <= trigger_flicker && newBurningTimeRemaining > trigger_almostOut && (burningTimeRemaining > trigger_flicker || burningTimeRemaining == newBurningTimeRemaining)) {
    
		sendChat("","/emas " + lightSourceName + " begins to flicker. ");
		
        lightSource.set({ light_radius: Math.floor(brightRadius * 0.75), light_dimradius: Math.floor(dimRadius * 0.5)});
        
	} else if (newBurningTimeRemaining <= trigger_almostOut && newBurningTimeRemaining > 0&& (burningTimeRemaining > trigger_almostOut || burningTimeRemaining == newBurningTimeRemaining)) {
	
		sendChat("","/emas " + lightSourceName + " is about to go out. ");
		
        lightSource.set({ light_radius: Math.floor(brightRadius * 0.5), light_dimradius: 0 });
        
	} else if (newBurningTimeRemaining <= 0) {
	
        newBurningTimeRemaining = 0;
        
		sendChat("","/emas " + lightSourceName + " goes out!");
		
		lightSource.set({
		
			bar2_value: 0,
			
			light_radius: "",
			
			light_dimradius: ""
			
		});
		
	};
	
	lightSource.set({
	
		bar1_value: newBurningTimeRemaining
		
	});
 
};
 
 
function findLights(numRounds) {
 
    var playerVisibleLights = filterObjs(function(obj) {
    
        if(obj.get("_pageid") == Campaign().get("playerpageid") && obj.get("_subtype") == "token" && obj.get("bar2_value") == "1" && obj.get("bar2_max") == "1" && obj.get("light_otherplayers") == true) return true;
        
        else return false;
        
    });
 
	_.each(playerVisibleLights, function(obj) {
	
    	updateLights(obj,numRounds);
    	
	});
	
};
 
 
on("chat:message", function(msg) {
 
	if (msg.type == "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!chronos") !== -1) {
        
        var years = 0, months = 0, days = 0, hours = 0, minutes = 0;
        
        var n = msg.content.split(" ");
        
        if (n[1] == undefined) { // i.e., just "!chronos"
            
            updateChronos(years,months,days,hours,minutes);
            
            return;
            
        } else if (n[2] == undefined) { // i.e., "!chronos 1d" or "!chronos 1d,4h"
            
            var time = n[1].split(",");
            
            for (i = 0; i < time.length; i++) {
                
                if (time[i].indexOf("y") != -1) { years = time[i].slice(0, time[i].indexOf("y")); };
                
                if (time[i].indexOf("m") != -1) { months = time[i].slice(0, time[i].indexOf("m")); };
                
                if (time[i].indexOf("d") != -1) { days = time[i].slice(0, time[i].indexOf("d")); };
                
                if (time[i].indexOf("h") != -1) { hours = time[i].slice(0, time[i].indexOf("h")); };
                
                if (time[i].indexOf("n") != -1) { minutes = time[i].slice(0, time[i].indexOf("n")); };
                
            };
            
        } else { // i.e., params (only makes sense with values for time, should add some error catching)
            
            var time = n[1].split(",");
            
            var params = n[2].slice(1);
            
            for (i = 0; i < time.length; i++) {
                
                if (time[i].indexOf("y") != -1) { years = time[i].slice(0, time[i].indexOf("y")); };
                
                if (time[i].indexOf("m") != -1) { months = time[i].slice(0, time[i].indexOf("m")); };
                
                if (time[i].indexOf("d") != -1) { days = time[i].slice(0, time[i].indexOf("d")); };
                
                if (time[i].indexOf("h") != -1) { hours = time[i].slice(0, time[i].indexOf("h")); };
                
                if (time[i].indexOf("n") != -1) { minutes = time[i].slice(0, time[i].indexOf("n")); };
                
            };
            
            // kick off torches burning, healing, etc. here
            for (i = 0; i < params.length; i++) {
                
                switch (params[i]) {
                    
                    case "h": // heal, i.e. bedrest for 24+ hours
                        
                        healCharacters("d",days,"bedrest");
                        
                    break;
                    
                    case "r": // rest, i.e. sleep for 8+ hours
                        if (_.contains(params, "h")) {
                            
                            sendChat("Chronos","/w gm Cannot use 'h' and 'r' in the same command, using 'h'.");
                            
                        } else {
                            
                            if (days > 0) {
                                
                                healCharacters("d",days,"normal");
                                
                            } else {
                                
                                healCharacters("h",hours,"normal");
                                
                            };
                            
                        };
                        
                    break;
                    
                    case "t": // torches, i.e. track light source's fuel
                        
                        findLights(minutes);
                        
                    break;
                    
                };
                
            };
            
        };
        
        updateChronos(years,months,days,hours,minutes);
        
    };
 
});
 
 
on("change:graphic:bar1_value", function(obj) {
 
	if (obj.get("_pageid") == Campaign().get("playerpageid") && obj.get("_subtype") == "token" && obj.get("bar2_max") == "1" && obj.get("light_otherplayers") == true) {
	
		var maxValue = obj.get("bar1_max");
    
	    if (obj.get("bar1_value") > maxValue ) {
            
				obj.set({bar1_value: maxValue});
                
    		};
	
		updateLights(obj,0); 
 
	};
 
});
on("change:graphic:bar2_value", function(obj) {
    
    if (obj.get("_pageid") == Campaign().get("playerpageid") && obj.get("_subtype") == "token" && obj.get("bar2_max") == "1" && obj.get("light_otherplayers") == true) {
        
        if (obj.get("bar2_value") > 0 ) {
            
            if (obj.get("bar1_value") > 0) {
				
				obj.set({bar2_value: 1});
				
			} else {
			
                obj.set({bar2_value: 0})
                
    		};
            
            updateLights(obj,0);
            
        } else if (obj.get("bar2_value") <= 0 ) {
            
            obj.set({bar2_value: 0});
            
    	    obj.set({light_radius: "",light_dimradius: ""});
    	    
        };
        
    };
    
function clericSpell(characterObj, attributeObjArray, spellName, spellLevel, spellModArray) {
	//finally assign the variables for output.	
	var characterName = characterObj.get("name");	
	var actionDieValue = attributeObjArray[0].get("current");
	var disapprovalObj = attributeObjArray[1];
	var disapprovalAtt = attributeObjArray[1].get("name")//attributeArray[1];
	var disapprovalValue = Number(attributeObjArray[1].get("current"));
	var luckValue = Number(attributeObjArray[4].get("current"));
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
			if (attributeObjArray[i].get("name") === spellModArray[j]) {
				spellMods[j] = attributeObjArray[i].get("current");
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
    if (msg.type === "api" && msg.content.indexOf("!clericspell ") !== -1) {
		//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
		var attributeArray = ["ActionDie", "Disapproval", "Level", "PER", "LCK"];
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
function availableCoinCounter(attributeObjArray) {
    var availableCoinArray = [0,0,0,0,0];
	availableCoinArray[0] += parseInt(attributeObjArray[0].get("current"));
    availableCoinArray[1] += parseInt(attributeObjArray[1].get("current"));
    availableCoinArray[2] += parseInt(attributeObjArray[2].get("current"));
    availableCoinArray[3] += parseInt(attributeObjArray[3].get("current"));
    availableCoinArray[4] += parseInt(attributeObjArray[4].get("current"));	
	return availableCoinArray;
};
function moneyCounter(msg,selected,action) {
    if(!selected) {
		sendChat("API", "/w " + msg.who + " Select token and try again.");
		return; 
	}; 
    var coinString = msg.content.split(action)[1];
    coinString = coinString.toLowerCase();
    coinString = coinString.replace(/pp/g,"xp"); 						// temp change 'pp' to 'xp' to facilitate splitting
    var coinStringArray = [];
    var coinArray = [0,0,0,0,0];
    tmp = coinString.split("p");
    coins = tmp.filter(function(n){return n}); 							// clean up empty elements
    for (i = 0; i < coins.length; i++) {
        tmp = coins[i].split(" "); 										// remove spaces
        coins[i] = tmp.join("");
        tmp = coins[i].split(","); 										// remove commas
        coins[i] = tmp.join("");
        if (coins[i].match(/^[0-9]+x/)) { coinArray[0] += parseInt(coins[i].split("x")[0]) } 
        else if (coins[i].match(/^[0-9]+e/)) { coinArray[1] += parseInt(coins[i].split("e")[0]) } 
        else if (coins[i].match(/^[0-9]+g/)) { coinArray[2] += parseInt(coins[i].split("g")[0]) } 
        else if (coins[i].match(/^[0-9]+s/)) { coinArray[3] += parseInt(coins[i].split("s")[0]) } 
        else if (coins[i].match(/^[0-9]+c/)) { coinArray[4] += parseInt(coins[i].split("c")[0]) } 
        else {
            coins[i].replace("x","p"); 									// switch back to 'pp' for error output
            sendChat("Treasurer", "/w " + msg.who + " Could not identify type of coin: " + coins[i] + "p; ignored.");
        };
    };
    return coinArray;
};
function formatTreasurerChatString(character,coinArray,earn) {
    var comma = "off";
    var abbrev = ["pp","ep","gp","sp","cp"];
    var chatString = " <br/>" + character + " has ";
    if (earn === 1) {
        chatString += "earned ";
    } else chatString += "spent ";
    chatString += "<strong>";
    for (i = 0; i < 5; i++) {
        if (coinArray[i] !== 0) {
            if (comma == "on") {
                chatString += ", ";
            };
            chatString += coinArray[i] + abbrev[i];
            comma = "on";
        };
    };
    chatString +=  "</strong>"; 
    return chatString; 
};
function addCoins(characterObj,availableCoinArray,coinArray,attributeObjArray) {
    var character = characterObj.get("name"); 							// grab this for chat /w target 
    character = character.replace(/\s.+/,""); 
	if (coinArray[0] > 0) {attributeObjArray[0].set("current", parseInt(availableCoinArray[0] + coinArray[0]))};
	if (coinArray[1] > 0) {attributeObjArray[1].set("current", parseInt(availableCoinArray[1] + coinArray[1]))};
	if (coinArray[2] > 0) {attributeObjArray[2].set("current", parseInt(availableCoinArray[2] + coinArray[2]))};
	if (coinArray[3] > 0) {attributeObjArray[3].set("current", parseInt(availableCoinArray[3] + coinArray[3]))};
	if (coinArray[4] > 0) {attributeObjArray[4].set("current", parseInt(availableCoinArray[4] + coinArray[4]))};
	for (i = 0; i < coinArray.length; i++) {
        availableCoinArray[i] += coinArray[i]
    };
    chatString = formatTreasurerChatString(character,coinArray,1);
    sendChat("Treasurer","/w " + character + chatString);
	sendChat("Treasurer","/w gm " + chatString);
};
function spendCoins(characterObj,availableCoinArray,coinArray,attributeObjArray) {
    var character = characterObj.get("name"); 							// grab this for chat /w target 
    character = character.replace(/\s.+/,""); 
    var totalAvailable = (availableCoinArray[0]*100) + (availableCoinArray[1]*10) + availableCoinArray[2] + (availableCoinArray[3]*.1) + (availableCoinArray[4]*.01);
    var totalToSpend= (coinArray[0]*100) + (coinArray[1]*10) + coinArray[2] + (coinArray[3]*.1) + (coinArray[4]*.01);
    if (totalToSpend > totalAvailable) {
        sendChat("Treasurer","/w " + character + " You don't have enough: tried to spend " + totalToSpend + "gp but you only have " + totalAvailable + "gp in coins.");
        return; 														// exit if they don't have the cash
    };
    for (i = 0; i < coinArray.length; i++) {
        if (coinArray[i] <= availableCoinArray[i]) { 					// if there are enough coins of current denomination [i], subtract them & move on
            availableCoinArray[i] -= coinArray[i];
        } else { 														// if there aren't enough coins of current denomination [i], start making change
            j = 4; 														// j === current position of change-making loop in availableCoinArray; start at top (lowest denom) and work down
            while (coinArray[i] > availableCoinArray[i]) { 
                var k = j - 1; 											// k === next higher denomination in availableCoinArray (i.e., next lower in array)
                if (j > i) { 											// go through lower denominations and change them up
                    newCoins = parseInt(availableCoinArray[j]/10);
                    remainder = parseInt(availableCoinArray[j]%10);
                    availableCoinArray[j] = remainder;  
                    availableCoinArray[k] += newCoins;
                } else if (j < i) { 									// break higher denominations if needed
                    var higherDenomCoinsNeeded = Math.ceil((coinArray[i] - availableCoinArray[i])/10); // i.e., short 8 = 1 needed, short 18 = 2 needed
                    while (higherDenomCoinsNeeded > 0) {
	                    if (higherDenomCoinsNeeded <= availableCoinArray[j]) { 
	                        availableCoinArray[j] -= higherDenomCoinsNeeded;
	                        availableCoinArray[i] += higherDenomCoinsNeeded*10;
	                        higherDenomCoinsNeeded = 0;
	                    } else { 
	                    	if (parseInt(availableCoinArray[j]) > 0) {
		                        availableCoinArray[i] += parseInt(availableCoinArray[j]*10);
		                        higherDenomCoinsNeeded -= parseInt(availableCoinArray[j]);
		                        availableCoinArray[j] = 0;
	                    	};
							var n = k; 									// array position of higher denoms; decrement with each while loop
							var conversionFactor = 10; 
							while (higherDenomCoinsNeeded > 0) {		// loop until all necessary coins are converted to next higher denom of current coin type
								if (Math.ceil(higherDenomCoinsNeeded/conversionFactor) <= availableCoinArray[n]) {
									evenHigher = Math.ceil(higherDenomCoinsNeeded/conversionFactor);
									availableCoinArray[n] -= evenHigher; 
			                        availableCoinArray[j] += (evenHigher*conversionFactor) - higherDenomCoinsNeeded;
			                        availableCoinArray[i] += higherDenomCoinsNeeded*conversionFactor;
			                        higherDenomCoinsNeeded = 0;
								} else {
			                        availableCoinArray[j] += parseInt(availableCoinArray[n]*conversionFactor);
			                        higherDenomCoinsNeeded -= parseInt(availableCoinArray[n]*conversionFactor);
			                        availableCoinArray[n] = 0;
								};
								conversionFactor *= 10;
								n--; 
							};
	                    	if (coinArray[i] > availableCoinArray[i] && higherDenomCoinsNeeded <= 0) {
		                        availableCoinArray[i] = coinArray[i];
		                    };
	                    };
                    };
                };
                j--;
            };
            availableCoinArray[i] -= coinArray[i];
        };
    };
	if (availableCoinArray[0] > 0) {attributeObjArray[0].set("current", availableCoinArray[0])} else attributeObjArray[0].set("current","0");
	if (availableCoinArray[1] > 0) {attributeObjArray[1].set("current", availableCoinArray[1])} else attributeObjArray[1].set("current","0");
	if (availableCoinArray[2] > 0) {attributeObjArray[2].set("current", availableCoinArray[2])} else attributeObjArray[2].set("current","0");
	if (availableCoinArray[3] > 0) {attributeObjArray[3].set("current", availableCoinArray[3])} else attributeObjArray[3].set("current","0");
	if (availableCoinArray[4] > 0) {attributeObjArray[4].set("current", availableCoinArray[4])} else attributeObjArray[4].set("current","0");
    chatString = formatTreasurerChatString(character,coinArray);
    sendChat("Treasurer","/w " + character + chatString);
    sendChat("Treasurer","/w gm " + chatString);
};
on("chat:message", function(msg) {
    if (msg.type === "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!earn ") !== -1 ) { // only the GM can give out money
        var selected = msg.selected;
        var coinArray = moneyCounter(msg,selected,"!earn ");
        _.each(selected, function(obj) {
            var characterObj = getCharacterObj(obj);
            if (characterObj === false) return;	
		    var character = characterObj.get("name");
		    character = character.replace(/\s.+/,""); 
			var attributeObjArray = getAttributeObjects(characterObj, ['PP','EP','GP','SP','CP'],character);
            if (attributeObjArray === false) return;
            var availableCoinArray = availableCoinCounter(attributeObjArray);
			addCoins(characterObj,availableCoinArray,coinArray,attributeObjArray)
		});
    };
    if (msg.type === "api" && msg.content.indexOf("!spend ") !== -1 ) { // anyone can spend money, if they have it
        var selected = msg.selected;
        var coinArray = moneyCounter(msg,selected,"!spend ");
        _.each(selected, function(obj) {
            var characterObj = getCharacterObj(obj);
            if (characterObj === false) return;	
		    var character = characterObj.get("name");
		    character = character.replace(/\s.+/,""); 
			var attributeObjArray = getAttributeObjects(characterObj, ['PP','EP','GP','SP','CP'],character);
			if (attributeObjArray === false) return;
            var availableCoinArray = availableCoinCounter(attributeObjArray);
            spendCoins(characterObj,availableCoinArray,coinArray,attributeObjArray)
		});
    };
    if (msg.type === "api" && msg.content.indexOf("!purse") !== -1 ) { // anyone can check how much money they have
        var selected = msg.selected;
        _.each(selected, function(obj) {
            var characterObj = getCharacterObj(obj);
            if (characterObj === false) return;	
		    var character = characterObj.get("name");
		    character = character.replace(/\s.+/,""); 
			var attributeObjArray = getAttributeObjects(characterObj, ['PP','EP','GP','SP','CP'],character);
			if (attributeObjArray === false) return;
            var availableCoinArray = availableCoinCounter(attributeObjArray);
            tmp = "/w " + character + " You have " + availableCoinArray[0] + "pp, " + availableCoinArray[1] + "ep, " + availableCoinArray[2] + "gp, " + availableCoinArray[3] + "sp, " + availableCoinArray[4] + "cp.";
			sendChat("Treasurer",tmp);
		});
    };
});on("chat:message", function(msg) {
    if (msg.type === "api" && msg.who.indexOf("(GM)") !== -1 && msg.content.indexOf("!tracker") !== -1) {
        var n = msg.content.split(" ", 2);
        var tracker = findObjs({
    	    _pageid: Campaign().get("playerpageid"),
		    _type: "graphic",
		    name: "Tracker"
        });
        _.each (tracker, function(obj) {
            if (n[1] === "off") { 
    		    obj.set({bar2_value: 0});
                sendChat("Util","/w gm Tracker token turned " + n[1]);
            } else {
                obj.set({bar2_value: 1});
                sendChat("Util","/w gm Tracker token turned " + n[1]);
            };
        });
    };
});


on("change:graphic", function(obj, prev) { 
    if (obj.get("name") === "Tracker" && obj.get("bar2_value") === 1) {
        var xDif = 0;
        var yDif = 0;
        var unitsMoved = 0;
        if (obj.get("left") != prev["left"] || obj.get("top") != prev["top"]) {
            xDif = Math.abs(obj.get("left")/14 - prev["left"]/14);
            yDif = Math.abs(obj.get("top")/14 - prev["top"]/14);
            xDif = Math.floor(xDif);
            yDif = Math.floor(yDif);
        };
        if (xDif > yDif) {
            unitsMoved = xDif;
        } else {
            unitsMoved = yDif
        };
        var roundsTranspired = Math.floor(unitsMoved/20);
        if (unitsMoved%20 >=10) { roundsTranspired++ };
        if (roundsTranspired > 0) {
    		state.timeElapsed = state.timeElapsed + roundsTranspired;
            getLights(roundsTranspired);
            timeElapsed();
        }
    };
});

function hitPoints(tokenObj,number,faces,bonus) {
    var characterName = tokenObj.get("name");
    
    var hitPoints = parseInt(bonus);
    
    for (var i = 0; i < number; i++) {
        var result = randomInteger(faces);
        hitPoints += result;
	};
	
    tokenObj.set({bar1_value: hitPoints, bar1_max: hitPoints})
		
	//output
	sendChat(characterName, "/w gm " + " has " + hitPoints + " HP.");
};
on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!HP ") !== -1) {
		//parse the input
        var selected = msg.selected;
		var Parameters = msg.content.split("!HP ")[1];
        var d = Parameters.indexOf("d");
        var plus = Parameters.indexOf("+");
        var number = Parameters.slice(0,d)[0];
        var faces = Parameters.slice(d+1,plus);
        var bonus = Parameters.slice(plus+1);
		
		if(!selected) {
			sendChat("", "/w gm Select token and try again.");
			return; //quit if nothing selected
		}; 
        //loop through selected tokens
        
		_.each(selected, function(obj) {
            var tokenObj = getObj("graphic", obj._id);
            hitPoints(tokenObj,number,faces,bonus);
		});
        
    };
});
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
			// rs: find which member of the array is the character
			var j = state.dcc.spellDuel.defenderObjArray.indexOf(characterObj);
			// rs: fill in data
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
	
    // get the action die max value and die roll, as expressed as 1d20 or d5 or whatever in the current value of the attribute.
	var d = actionDieValue.indexOf("d")+1;
	var actionDieMax = parseInt(actionDieValue.slice(d));
	var actionDieResult = randomInteger(actionDieMax);
	var spellRoll = Number(actionDieResult); 
	//get the values in spellModArray, return current numbers if attributes and numbers if numbers
	var spellMods = spellModArray;
	for (var i = 1; i < attributeObjArray.length; i++) {
		for (var j = 0; j < spellMods.length; j++) {
			if (attributeObjArray[i].get("name") === spellModArray[j]) {
				// check if this is caster level, in which case no need to get the value off the ability score table
				if (spellModArray[j] === attributeObjArray[1].get("name"))  {
					spellMods[j] = Number(attributeObjArray[1].get("current"));
				} else {
				spellMods[j] = attributeObjArray[i].get("current");
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
		if (spellRoll === 1) {
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
	spellDuel(characterObj, spellName, spellRoll);
	
	
};
on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!wizardspell ") !== -1) {
		//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
		var attributeArray = ["ActionDie", "Level", "INT"]; 
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
