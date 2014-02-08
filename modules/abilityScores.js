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
    switch(changedAttribute) {
        case "Strength":
            modifierName = "STR"
        break;
        case "Agility":
            modifierName = "AGI"
        break;
        case "Stamina":
            modifierName = "STA"
        break;
        case "Personality":
            modifierName = "PER"
        break;
        case "Intelligence":
            modifierName = "INT"
        break;
        case "Luck":
            modifierName = "LCK"
        break;
    };
    var attributeObjArray = getAttributeObjects(characterObj,modifierName,character);
    log(attributeObjArray);
    newModifier = returnAbilityModifier(newAbilityScoreValue);
    attributeObjArray[0].set("current",newModifier);
});