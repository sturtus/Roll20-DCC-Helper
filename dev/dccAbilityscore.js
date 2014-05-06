function getAbilityMod(attributeValue) {
	return state.dcc.dccAttributes.abilityTable[parseInt(attributeValue)].modifier;
};

function getCharAbilityMod(characterObj,attributeName) {
	var attribute = getAttributeObjects(characterObj, attributeName);
	return getAbilityMod(attribute[0].get("current"));
	
};


on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!getmod ") !== -1) {
    	//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
        var attributeName = msg.content.split("!getmod ")[1];
				
		if(!selected) {
			sendChat("", "/desc Select token and try again.");
			return; //quit if nothing selected
		}; 
	
		//loop through selected tokens
		_.each(selected, function(obj) {
			var characterObj = getCharacterObj(obj);
			if (characterObj === false) return;
			var attribute = getAttributeObjects(characterObj, attributeName);
			if (attribute === false) return;
            var modifier = getAbilityMod(attribute[0].get("current"));
			sendChat("API","Modifier for " + attributeName + " is " + modifier + ".");
		});
		
    };
});

on("ready", function() {
	state.dcc.dccAttributes = 				state.dcc.dccAttributes 				|| {};
	state.dcc.dccAttributes.strength = 		state.dcc.dccAttributes.strength 		|| "STR";
	state.dcc.dccAttributes.agility = 		state.dcc.dccAttributes.agility 		|| "AGI";
	state.dcc.dccAttributes.stamina = 		state.dcc.dccAttributes.stamina 		|| "STA";
	state.dcc.dccAttributes.intelligence = 	state.dcc.dccAttributes.intelligence 	|| "INT";
	state.dcc.dccAttributes.personality = 	state.dcc.dccAttributes.personality 	|| "PER";
	state.dcc.dccAttributes.luck = 			state.dcc.dccAttributes.luck 			|| "LCK";
	state.dcc.dccAttributes.actionDie = 	state.dcc.dccAttributes.actiondie 		|| "ActionDie";
	state.dcc.dccAttributes.deedDie = 		state.dcc.dccAttributes.deedDie 		|| "DeedDie";
	state.dcc.dccAttributes.level = 		state.dcc.dccAttributes.level 			|| "Level";
	state.dcc.dccAttributes.momentum = 		state.dcc.dccAttributes.momentum 		|| "Momentum";
	state.dcc.dccAttributes.critDie = 		state.dcc.dccAttributes.critDie 		|| "CRIT";
	state.dcc.dccAttributes.hitPoints = 	state.dcc.dccAttributes.hitPoints 		|| "HP";
	state.dcc.dccAttributes.armorClass = 	state.dcc.dccAttributes.armorClass 		|| "AC";
	state.dcc.dccAttributes.attackMod = 	state.dcc.dccAttributes.attackMod 		|| "ATK";
	state.dcc.dccAttributes.reflexSave = 	state.dcc.dccAttributes.reflexSave 		|| "REF";
	state.dcc.dccAttributes.fortSave = 		state.dcc.dccAttributes.fortSave 		|| "FORT";
	state.dcc.dccAttributes.willSave = 		state.dcc.dccAttributes.willSave 		|| "WILL";
	state.dcc.dccAttributes.abilityTable = 	state.dcc.dccAttributes.abilityTable 	|| [
		{score:  "0", modifier: "NA", spellsknown: "NA", maxspell: "NA" },
		{score:  "1", modifier: -5, spellsknown: "NA", maxspell: "NA" },
		{score:  "2", modifier: -4, spellsknown: "NA", maxspell: "NA" },
		{score:  "3", modifier: -3, spellsknown: "NA", maxspell: "NA" },
		{score:  "4", modifier: -2, spellsknown: -2, maxspell: 1 },
		{score:  "5", modifier: -2, spellsknown: -2, maxspell: 1 },
		{score:  "6", modifier: -1, spellsknown: -1, maxspell: 1 },
		{score:  "7", modifier: -1, spellsknown: -1, maxspell: 1 },
		{score:  "8", modifier: -1, spellsknown: -1, maxspell: 2 },
		{score:  "9", modifier:  0, spellsknown:  0, maxspell: 2 },
		{score: "10", modifier:  0, spellsknown:  0, maxspell: 3 }, 
		{score: "11", modifier:  0, spellsknown:  0, maxspell: 3 },
		{score: "12", modifier:  0, spellsknown:  0, maxspell: 4 },
		{score: "13", modifier: +1, spellsknown:  0, maxspell: 4 },
		{score: "14", modifier: +1, spellsknown: +1, maxspell: 4 },
		{score: "15", modifier: +1, spellsknown: +1, maxspell: 5 },
		{score: "16", modifier: +2, spellsknown: +1, maxspell: 5 },
		{score: "17", modifier: +2, spellsknown: +2, maxspell: 5 },
		{score: "18", modifier: +3, spellsknown: +2, maxspell: 5 },
		{score: "19", modifier: +3, spellsknown: +3, maxspell: 5 },
		{score: "20", modifier: +4, spellsknown: +4, maxspell: 5 },
		{score: "21", modifier: +4, spellsknown: +5, maxspell: 5 },
		{score: "22", modifier: +5, spellsknown: +6, maxspell: 5 },
		{score: "23", modifier: +5, spellsknown: +7, maxspell: 5 },
		{score: "24", modifier: +6, spellsknown: +8, maxspell: 5 },
		{score: "25", modifier: +6, spellsknown: +9, maxspell: 5 },
		{score: "26", modifier: +7, spellsknown: +10, maxspell: 5 },
		{score: "27", modifier: +7, spellsknown: +11, maxspell: 5 },
		{score: "28", modifier: +8, spellsknown: +12, maxspell: 5 },
		{score: "29", modifier: +8, spellsknown: +13, maxspell: 5 },
		{score: "30", modifier: +9, spellsknown: +14, maxspell: 5 }
	];

});

