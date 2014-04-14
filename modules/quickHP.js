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


