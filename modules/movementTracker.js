on("chat:message", function(msg) {
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



