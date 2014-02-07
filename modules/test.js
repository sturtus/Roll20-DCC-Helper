function test(obj, attributeArray) {
	var characterObj = getCharacterObj(obj);
	if (characterObj == false) return;
	log("PASSED characterObj test");
	log("--------------------------------------------------------");
	log("test function characterObj")
	log(characterObj);
	var attributeObjArray = getAttributeObjects(characterObj, attributeArray);
	log("--------------------------------------------------------");
	log("test function attributeObjArray");
	log(attributeObjArray);
	if (attributeObjArray == false) return;
	log("PASSED attributeObjArray test");
};


on("chat:message", function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!test") !== -1) {
		var selected = msg.selected;
		var attributeArray = ["ActionDie", "DeedDie", "STR", "AGI", "LCK"];
			
		if(!selected) {
			sendChat("", "/desc Select token and try again.");
			return; //quit if nothing selected
		}; 

		//loop through selected tokens
		_.each(selected, function(obj) {
			test(obj, attributeArray);
		});
		
    };
});