// timer script

var timerGlobal = {
    sT : 0,
	sI : 0,
	clockOn : false,
	clockDirection: "up",
	clockRotate : false,
	clockStatusMarker : false,
	clockLogChat : false,
	clockAura : false,
	clockTint : false,
	restarted : false,
	restartedTimer : 0
};

function getClock(s) {
    var time ={
        hours:0,
        minutes:0,
        seconds:0
    };
    time.hours = (s-(s%3600))/3600;
    s = s - time.hours*3600;
    time.minutes = (s-(s%60))/60;
    time.seconds = s-time.minutes*60;
    return time;
}

function writeClock(obj, cTime) {
    obj.set("bar3_value", cTime.hours);
    obj.set("bar1_value", cTime.minutes);
    obj.set("bar2_value", cTime.seconds);
}

function resetStatusMarkers(obj) {
    obj.set("status_redmarker", false);
    obj.set("status_bluemarker", false);
    obj.set("status_greenmarker", false);
    obj.set("status_brownmarker", false);
    obj.set("status_purplemarker", false);
}

function resetAura1(obj) {
	obj.set("aura1_radius", "");
	obj.set("aura1_color", "#ffff00");	
}

function writeAura1(obj, tAuraRadius, tAuraColor) {
	obj.set("aura1_radius", tAuraRadius);
	obj.set("aura1_color", tAuraColor);	
}

function resetClockVisuals(obj) {
    obj.set("status_dead",true);
    obj.set("rotation", 0); 
    resetStatusMarkers(obj);
	resetAura1(obj);
}

function trueRotation(rotation) {
// fixes Roll20 rotatin property so rotation can only be between 0 and 360 deg
  if (rotation < 0){
      rotation=360-Math.abs(rotation%360);
  }
  rotation=Math.abs(rotation%360);
  return rotation;
}

var countTime = function(obj, argv, who) {
    var timerTimeout = 0;
    var elapsedTime = 0;
    var totalSecondsRemaining = 0;
	var tCOLORS = ["#ff0000", "#ffff00", "#00ff00", "#0000ff", "#ff00ff"];
    var tAuraRadius = 1;
	var tAuraColorIndex = 0;

    if (timerGlobal.clockOn === false) {
        var max = 3600;
        var cTime = {
			hours: 0,
			minutes: 0,
			seconds: 0
		};

        if (timerGlobal.restarted !== true) {
            cTime.hours = parseInt(argv.shift(), 10);
            cTime.minutes = parseInt(argv.shift(), 10);
            cTime.seconds = parseInt(argv.shift(), 10);
        }
        else {
            cTime = getClock(timerGlobal.restartedTimer);
        }

        timerTimeout = cTime.hours*3600 + cTime.minutes*60 + cTime.seconds;
        if (timerTimeout >=max) {
            timerTimeout=max;
        }        

        timerGlobal.restartedTimer = timerTimeout;
        totalSecondsRemaining = timerTimeout;
        cTime = getClock(totalSecondsRemaining); //reformat user entered time value properly
		if (timerGlobal.direction === "up") {
			var clockTime = getClock(elapsedTime);
		    if (timerGlobal.clockLogChat === true) {
				sendChat(who, "Counting up to "+cTime.hours+":"+cTime.minutes+":"+cTime.seconds);
			}
		}
		else {
			if (timerGlobal.direction ==="down") {
				var clockTime = cTime;
				elapsedTime = timerTimeout;
		        if (timerGlobal.clockLogChat === true) {
					sendChat(who, "Counting down from "+cTime.hours+":"+cTime.minutes+":"+cTime.seconds);
				}
			}
		}

		resetClockVisuals(obj);
		obj.set("status_dead",false);		
		writeClock(obj, clockTime);

        timerGlobal.sI = setInterval(function() {
			if (timerGlobal.direction === "up") {
				elapsedTime = elapsedTime + 1;
            if (timerGlobal.clockRotate === true) {
                obj.set("rotation", trueRotation(obj.get("rotation"))+360/60);
            }
			}
			else {
				if (timerGlobal.direction ==="down") {
				elapsedTime = elapsedTime - 1;
            if (timerGlobal.clockRotate === true) {
                obj.set("rotation", trueRotation(obj.get("rotation"))-360/60);
            }
				}
			} 
             clockTime = getClock(elapsedTime);

            if (timerGlobal.clockStatusMarker === true) {
                if (obj.get("status_redmarker") === false)
                {
                    obj.set("status_redmarker", true);
                }
                else if (obj.get("status_redmarker") === true && obj.get("status_bluemarker") === false)
                {
                    obj.set("status_bluemarker", true);
                }
                else if (obj.get("status_bluemarker") === true && obj.get("status_greenmarker") === false)
                {
                    obj.set("status_greenmarker", true);
                }
                else if (obj.get("status_greenmarker") === true && obj.get("status_brownmarker") === false)
                {
                    obj.set("status_brownmarker", true);
                }
                else if (obj.get("status_brownmarker") === true && obj.get("status_purplemarker") === false)
                {
                    obj.set("status_purplemarker", true);
                }
                else
                {
                    obj.set("status_redmarker", true);
                    obj.set("status_bluemarker", false);
                    obj.set("status_greenmarker", false);
                    obj.set("status_brownmarker", false);
                    obj.set("status_purplemarker", false);
                }
            }
    		if (timerGlobal.clockAura === true) {
				if (tAuraColorIndex === 5) {
					tAuraColorIndex = 0;
					tAuraRadius = 1;
				}
				writeAura1(obj, tAuraRadius, tCOLORS[tAuraColorIndex]);
				tAuraRadius = tAuraRadius + 1;
				tAuraColorIndex = tAuraColorIndex + 1;				
			}
            writeClock(obj, clockTime);
        }, 1000);
        
        timerGlobal.sT = setTimeout(function() {
            timerGlobal.clockOn = false;
			if (timerGlobal.direction === "up") {
				elapsedTime = elapsedTime + 1;
			}
			else {
				if (timerGlobal.direction ==="down") {
				elapsedTime = elapsedTime - 1;
				}
			}
            clockTime = getClock(elapsedTime);
            clearInterval(timerGlobal.sI);
            writeClock(obj, clockTime);
			resetClockVisuals(obj);
            if (timerGlobal.clockLogChat === true) {
                sendChat(who, "Times Up!");
            }
        },timerTimeout*1000);
        timerGlobal.clockOn = true;
    }
};

function processTimerScript(argv, who) { 
    var obj = findObjs({_type: "graphic", name: "clock.timer"}, {caseInsensitive: true})[0];
    var clockType = argv.shift();
    var option = "";

    switch(clockType) {
        // Stop Watch
        case 'cu':
            if (timerGlobal.clockOn === false) {
                timerGlobal.direction = "up";
				countTime(obj, argv, who);
            } 
            break;
        case 'cd':
            if (timerGlobal.clockOn === false) {
                timerGlobal.direction = "down";
				countTime(obj, argv, who);
            }            
            break;
        case 'stop':
            if (timerGlobal.clockOn === true) {
                timerGlobal.clockOn = false;
                clearTimeout(timerGlobal.sT);
                clearInterval(timerGlobal.sI);
				resetClockVisuals(obj);
                if (timerGlobal.clockLogChat === true) {
                    sendChat(who, "Timer Stopped!");
                }
            }
            break;
        case 'restart':
            if (timerGlobal.clockOn === true) {
                timerGlobal.clockOn = false;
                clearTimeout(timerGlobal.sT);
                clearInterval(timerGlobal.sI);
				resetClockVisuals(obj);
                if (timerGlobal.clockLogChat === true) {
                    sendChat(who, "Timer Restarted!");
                }
                timerGlobal.restarted = true;
                countTime(obj,argv, who);
            }
            break;
        case 'logchat':
            option = argv.shift();
            log(option);
            if (option === "on") {
                timerGlobal.clockLogChat = true;
            } else if (option === "off") {
                timerGlobal.clockLogChat = false;
            }
            break;
        case 'rotate':
            option = argv.shift();
            log(option);
            if (option === "on") {
                timerGlobal.clockRotate = true;
            } else if (option === "off") {
                timerGlobal.clockRotate = false;
            }
            break;
        case 'statusmarkers':
            option = argv.shift();
            log(option);
            if (option === "on") {
                timerGlobal.clockStatusMarker = true;
            } else if (option === "off") {
                timerGlobal.clockStatusMarker = false;
            }
            break;
		case 'aura':
            option = argv.shift();
            log(option);
            if (option === "on") {
                timerGlobal.clockAura = true;
            } else if (option === "off") {
                timerGlobal.clockAura = false;
            }
            break;
    }
}
// on() events
// process scripts

var processScriptTabs = function(argv, who) {
    // this will run the various other scripts depending upon the chat
    // window command.  Just add another Case statement to add a new command.

    var script = argv.shift();
    switch(script) {
        case "!t":
			processTimerScript(argv, who);
        break;
		default:
    }
};

on("chat:message", function(msg) {
    // returns the chat window command entered, all in lowercase.
	var chatCommand = msg.content;
	chatCommand = chatCommand.toLowerCase(); //make all characters lowercase
	log(chatCommand);
	var argv = chatCommand.split(' ');
	if (msg.type !== 'api') {
		return;
	}
	return processScriptTabs(argv, msg.who);
});