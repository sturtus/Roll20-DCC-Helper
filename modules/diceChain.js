/*
function to change an attribute with a d20 value and move it up or down the 
DCC dice chain by x number of dice.

!diceChain attributeName|newValue

!diceChain ActionDie|+1
!diceChain ActionDie|-2
!diceChain DeedDie|-1
!diceChain WeaponDamage|-1
*/

function diceChain(characterObj,attributeObjArray,newValue) {
	
	//need to modify to prevent going below d3 or above d30
	
	
	var diceChainArray = ["d3", "d4", "d5", "d6", "d7", "d8", "d10", "d12", "d14", "d16", "d20", "d24", "d30"];
	var characterName = characterObj.get("name");
	var attributeName = attributeObjArray[0].get("name");
	var attributeValue = attributeObjArray[0].get("current");
	
	var diePositionChange =	removePlus(newValue);
	diePositionChange = parseInt(diePositionChange.toString());
	
	var newDiePosition = (diceChainArray.indexOf(attributeValue)) + diePositionChange;
	var newDie = diceChainArray[newDiePosition];

	attributeObjArray[0].set("current", newDie);
	
	//output
	sendChat("API", "/w gm " + characterName + " changed " + attributeName + " from " + attributeValue + " to " + newDie + ".");
	sendChat("API", "/w " + characterName + " changed " + attributeName + " from " + attributeValue + " to " + newDie + ".");

};


on("chat:message", function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!dicechain ") !== -1) {
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
			var characterObj = getCharacterObj(obj);
			if (characterObj == false) return;
			var attributeObjArray = getAttributeObjects(characterObj, attributeName);
			if (attributeObjArray == false) return;
			diceChain(characterObj,attributeObjArray,newValue);
		});
		
    };
});