/* 
    ====================================
	Roll20 Character Sheet Money Counter
	====================================
	!earn coin1, coin2, ...
	!spend coin1, coin2, ...
	!purse
	
	Set of commands to add and remove coins from characters. 
	
	
*/

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
	tmp = "|- moneyCounter"; log(tmp);
    if(!selected) {
		sendChat("API", "/w " + msg.who + " Select token and try again.");
		return; 
	}; 
    var coinString = msg.content.split(action)[1];
    coinString = coinString.toLowerCase();
    coinString = coinString.replace(/pp/g,"xp"); 						// temp change 'pp' to 'xp' to facilitate splitting
    tmp = "|-- coinString = " + coinString; log(tmp);
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
    tmp = "|-- coinArray = " + coinArray; log(tmp);
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
        tmp = comma; log(tmp);
        if (coinArray[i] !== 0) {
            if (comma == "on") {
                chatString += ", ";
            };
            chatString += coinArray[i] + abbrev[i];
            comma = "on";
        };
        tmp = chatString; log(tmp);
    };
    chatString +=  "</strong>"; 
    return chatString; 
};

function addCoins(characterObj,availableCoinArray,coinArray,attributeObjArray) {
	tmp = "|- addCoins"; log(tmp);
    tmp = "|-- availableCoinArray = " + availableCoinArray; log(tmp);
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
    tmp = "|-- availableCoinArray = " + availableCoinArray; log(tmp);
    chatString = formatTreasurerChatString(character,coinArray,1);
    sendChat("Treasurer","/w " + character + chatString);
	sendChat("Treasurer","/w gm " + chatString);
};

function spendCoins(characterObj,availableCoinArray,coinArray,attributeObjArray) {
    tmp = "|- spendCoins"; log(tmp);
    tmp = "|-- availableCoinArray = " + availableCoinArray; log(tmp);
    var character = characterObj.get("name"); 							// grab this for chat /w target 
    character = character.replace(/\s.+/,""); 
    var totalAvailable = (availableCoinArray[0]*100) + (availableCoinArray[1]*10) + availableCoinArray[2] + (availableCoinArray[3]*.1) + (availableCoinArray[4]*.01);
    tmp = "|-- totalAvailable = " + totalAvailable; log(tmp);
    var totalToSpend= (coinArray[0]*100) + (coinArray[1]*10) + coinArray[2] + (coinArray[3]*.1) + (coinArray[4]*.01);
    tmp = "|-- totalToSpend = " + totalToSpend; log(tmp);
    if (totalToSpend > totalAvailable) {
        sendChat("Treasurer","/w " + character + " You don't have enough: tried to spend " + totalToSpend + "gp but you only have " + totalAvailable + "gp in coins.");
        return; 														// exit if they don't have the cash
    };
    tmp = "|-- for (i = 0; i < coinArray.length; i++)"; log(tmp);
    for (i = 0; i < coinArray.length; i++) {
        tmp = "|--- coinArray[" + i + "] = " + coinArray[i] + "; availableCoinArray[" + i + "] = " + availableCoinArray[i]; log(tmp);
        if (coinArray[i] <= availableCoinArray[i]) { 					// if there are enough coins of current denomination [i], subtract them & move on
			tmp = "|--- (coinArray[" + i + "] <= availableCoinArray[" + i + "])"; log(tmp);
            availableCoinArray[i] -= coinArray[i];
        } else { 														// if there aren't enough coins of current denomination [i], start making change
            j = 4; 														// j === current position of change-making loop in availableCoinArray; start at top (lowest denom) and work down
			tmp = "|--- while (coinArray[" + i + "] > availableCoinArray[" + i + "])"; log(tmp);
            while (coinArray[i] > availableCoinArray[i]) { 
                var k = j - 1; 											// k === next higher denomination in availableCoinArray (i.e., next lower in array)
                if (j > i) { 											// go through lower denominations and change them up
                	tmp = "|---- looking at availableCoinArray[" + j + "]"; log(tmp);
                    tmp = "|----- availableCoinArray: " + availableCoinArray; log(tmp);
                    newCoins = parseInt(availableCoinArray[j]/10);
                    remainder = parseInt(availableCoinArray[j]%10);
                    availableCoinArray[j] = remainder;  
                    availableCoinArray[k] += newCoins;
                    tmp = "|----- availableCoinArray: " + availableCoinArray; log(tmp);
                } else if (j < i) { 									// break higher denominations if needed
                	tmp = "|---- looking at availableCoinArray[" + j + "]"; log(tmp);
                    tmp = "|----- availableCoinArray: " + availableCoinArray; log(tmp);
                    var higherDenomCoinsNeeded = Math.ceil((coinArray[i] - availableCoinArray[i])/10); // i.e., short 8 = 1 needed, short 18 = 2 needed
                    tmp = "|----- higherDenomCoinsNeeded: " + higherDenomCoinsNeeded; log(tmp);
                    while (higherDenomCoinsNeeded > 0) {
	                    if (higherDenomCoinsNeeded <= availableCoinArray[j]) { 
	                    	tmp = "|----- availableCoinArray[" + j + "] has enough coins, convert them & move on"; log(tmp);
	                        availableCoinArray[j] -= higherDenomCoinsNeeded;
	                        availableCoinArray[i] += higherDenomCoinsNeeded*10;
	                        higherDenomCoinsNeeded = 0;
	                    } else { 
	                    	tmp = "|----- availableCoinArray[" + j + "] does not have enough coins"; log(tmp);
	                    	if (parseInt(availableCoinArray[j]) > 0) {
								tmp = "|------ convert all availableCoinArray[" + j + "] coins"; log(tmp);
		                        availableCoinArray[i] += parseInt(availableCoinArray[j]*10);
		                        higherDenomCoinsNeeded -= parseInt(availableCoinArray[j]);
		                        availableCoinArray[j] = 0;
			                    tmp = "|------ availableCoinArray: " + availableCoinArray; log(tmp);
	                    	};
							var n = k; 									// array position of higher denoms; decrement with each while loop
							var conversionFactor = 10; 
							tmp = "|------ n = " + n + "; conversionFactor = " + conversionFactor; log(tmp);
							while (higherDenomCoinsNeeded > 0) {		// loop until all necessary coins are converted to next higher denom of current coin type
								tmp = "|------ while higherDenomCoinsNeeded > 0 "; log(tmp);
								tmp = "|------- higherDenomCoinsNeeded: " + higherDenomCoinsNeeded + "; n"; log(tmp);
			                    tmp = "|------- availableCoinArray: " + availableCoinArray; log(tmp);
								if (Math.ceil(higherDenomCoinsNeeded/conversionFactor) <= availableCoinArray[n]) {
									tmp = "|------- Math.floor(higherDenomCoinsNeeded/conversionFactor) <= availableCoinArray[" + n + "]"; log(tmp); 
				                    tmp = "|-------- availableCoinArray: " + availableCoinArray; log(tmp);
									evenHigher = Math.ceil(higherDenomCoinsNeeded/conversionFactor);
			                        tmp = "|-------- evenHigher: " + evenHigher; log(tmp);
									availableCoinArray[n] -= evenHigher; 
			                        availableCoinArray[j] += (evenHigher*conversionFactor) - higherDenomCoinsNeeded;
			                        availableCoinArray[i] += higherDenomCoinsNeeded*conversionFactor;
			                        higherDenomCoinsNeeded = 0;
				                    tmp = "|-------- availableCoinArray: " + availableCoinArray; log(tmp);
								} else {
									tmp = "|------- Math.floor(higherDenomCoinsNeeded/conversionFactor) > availableCoinArray[" + n + "]"; log(tmp); 
		                    		tmp = "|------- availableCoinArray: " + availableCoinArray; log(tmp);
			                        availableCoinArray[j] += parseInt(availableCoinArray[n]*conversionFactor);
			                        higherDenomCoinsNeeded -= parseInt(availableCoinArray[n]*conversionFactor);
			                        availableCoinArray[n] = 0;
		                    		tmp = "|------- availableCoinArray: " + availableCoinArray; log(tmp);
									tmp = "|------- higherDenomCoinsNeeded: " + higherDenomCoinsNeeded + "; n: " + n + "; conversionFactor: " + conversionFactor; log(tmp);
								};
								conversionFactor *= 10;
								n--; 
							};
							tmp = "|------ /while higherDenomCoinsNeeded > 0"; log(tmp);
	                    	if (coinArray[i] > availableCoinArray[i] && higherDenomCoinsNeeded <= 0) {
		                    	tmp = "|----- ESCAPE"; log(tmp);
		                        availableCoinArray[i] = coinArray[i];
		                    };
	                    };
                    };
                };
                j--;
            };
            tmp = "|--- /while (coinArray[" + i + "] > availableCoinArray[" + i + "])"; log(tmp);
            availableCoinArray[i] -= coinArray[i];
        };
    };
    tmp = "|-- /for (i = 0; i < coinArray.length; i++)";  log(tmp);
    tmp = "|-- availableCoinArray = " + availableCoinArray; log(tmp);
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
        tmp = "| !earn"; log(tmp);
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
        tmp = "| /!earn"; log(tmp);
    };

    if (msg.type === "api" && msg.content.indexOf("!spend ") !== -1 ) { // anyone can spend money, if they have it
		tmp = "| !spend"; log(tmp);
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
        tmp = "| /!spend"; log(tmp);
    };

    if (msg.type === "api" && msg.content.indexOf("!purse") !== -1 ) { // anyone can check how much money they have
		tmp = "| !purse"; log(tmp);
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
        tmp = "| /!purse"; log(tmp);
    };
});

