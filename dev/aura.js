on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!aura ") !== -1) {
		//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
        var param = msg.content.split("!aura ")[1];
		var size = param.split("|")[0];
        var color = param.split("|")[1];
				
		if(!selected) {
			sendChat("API", "/w " + msg.who + " Select token and try again.");
			return; //quit if nothing selected
		}; 
	
		//loop through selected tokens
		_.each(selected, function(obj) {
			var tokenObj = getObj('graphic', obj._id);
			if (tokenObj !== undefined) { tokenObj.set({'aura1_radius': size, 'aura1_color': color, 'showplayers_aura1': true}); };
		});
		
    };
});


on("chat:message", function(msg) {
    if (msg.type === "api" && msg.content.indexOf("!aurashow") !== -1) {
		//parse the input into two variables, oAttrib and newValue
        var selected = msg.selected;
				
		if(!selected) {
			sendChat("API", "/w " + msg.who + " Select token and try again.");
			return; //quit if nothing selected
		}; 
	
		//loop through selected tokens
		_.each(selected, function(obj) {
			var tokenObj = getObj('graphic', obj._id);
			if (tokenObj !== undefined) { tokenObj.set({'showplayers_aura1': true}); };
		});
		
    };
});


