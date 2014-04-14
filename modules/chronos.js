/*  Chronos Timekeeper: Calendar and Timekeeper Script for roll20.net
	
	!chronos                        returns elapsed time so far (needs updating)
	!chronos #y,#m,#d,#h,#n         adds a number of years, months, days, hours, minutes (n) to clock. 
	!chronos #y,#m,#d,#h,#n -xyz    parameters (not implemented yet)
	
*/


on("ready", function() {
    if (!state.chronos) {
        state.chronos = {}; 
        tmp = "Created state.chronos: " + state.dcc; log(tmp);
    } else {
        tmp = "state.chronos: " + state.dcc; log(tmp);
    };
    // remove "if" to redefine state.dcc.sheetAttributeArray, if necessary
    if (!state.chronos.years) {state.chronos.years = 0;};
    if (!state.chronos.months) {state.chronos.months = 1;};
    if (!state.chronos.days) {state.chronos.days = 1;};
    if (!state.chronos.hours) {state.chronos.hours = 0;};
    if (!state.chronos.minutes) {state.chronos.minutes = 0;};
    if (!state.chronos.weekday) {state.chronos.weekday = 0;};
});

var month = [['January',31],['February',28],["March",31],['April',30],['May',31],['June',30],['July',31],['August',31],['September',30],['October',31],['November',30],['December',31]];
var lengthOfYear = lengthOfYear();
var week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var weekday = 0;
 
var attributesToHeal = ['HP','Strength','Agility','Stamina','Personality','Intelligence'];

/*
healingData objects: 
healingData[0][0]: minimum hours of rest for healing
healingData[0][1]: hp for minimum rest
healingData[0][2]: attributes points for minimum rest
healingData[1][0]: hours required for full rest
healingData[1][1]: hp healed for full rest
healingData[1][2]: attribute points for full tended rest
*/

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
 
/* 
on('ready', function() { 
 
	state.chronosid = findObjs({_type: "character", name: "Chronos"})[0].get("_id");

});
*/
 
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
    
});


