/*     
	============================================================
	Roll20 Update Ability Score Modifier On Ability Score Change
	============================================================

	This function is run when the current value of an attribute that is present 
	in the array state.dcc.abilityScoreArray and update the corresponding 
	modifier value attribute, if necessary, based on the new value. 
	
*/

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
    tmp = abilityScoreModifier; log(tmp);
    return abilityScoreModifier;
}

on("change:attribute:current", function(attribute) {
    tmp = attribute; log(tmp);
    changedAttribute = attribute.get("name");
    tmp = changedAttribute; log(tmp);
    newAbilityScoreValue = attribute.get("current");
    tmp = newAbilityScoreValue; log(tmp);
    character_id = attribute.get("_characterid");
    tmp = character_id; log(tmp);
    characterObj = getObj("character",character_id);
    tmp = characterObj; log(tmp);
    character = characterObj.get("name");
    tmp = character; log(tmp);
    var modifierName;
    for(i = 0; i < state.dcc.abilityScoreArray.length; i++) {
        if (changedAttribute === state.dcc.abilityScoreArray[i][0]) {
            modifierName = state.dcc.abilityScoreArray[i][1];
            break;
        };
    };
    if (modifierName !== undefined) {
        var attributeObjArray = getAttributeObjects(characterObj,modifierName,character);
        log(attributeObjArray);
        newModifier = returnAbilityModifier(newAbilityScoreValue);
        tmp = newModifier; log(tmp);
        attributeObjArray[0].set("current",newModifier);
    };
});

on("ready", function() {
    if (!state.dcc) {
        state.dcc = {}; 
        tmp = "Created state.dcc: " + state.dcc; log(tmp);
    };
    if (!state.dcc.abilityScoreArray) {
        state.dcc.abilityScoreArray = [["Strength","STR"],["Agility","AGI"],["Stamina","STA"],["Personality","PER"],["Intelligence","INT"],["Luck","LCK"]]; 
        tmp = "Created state.dcc.abilityScoreArray: " + state.dcc.abilityScoreArray; log(tmp);
    };
});