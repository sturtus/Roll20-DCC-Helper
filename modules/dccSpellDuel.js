/*
	=======================
	DCC Spell Duel Commands
	=======================
	!counterspell @{selected|token_id}|@{target|token_id}
	!resolveSpellDuel
	!resetSpellDuel
	
	Command to spell duel a spellcaster. Will handle a single attacking spellcaster
	against any number of counterspelling defending spellcasters. The attacker 
	does not need to do anything, but each counterspelling spellcaster must use 
	this command to counter the attacking spell caster. Once the first !counterspell
	is submitted, the targeted character will be the attacker and the counterspelling
	token/character will be a defender. Any other characters submitting !counterspell 
	will participate in the duel on the defender's side. Any characters that cast a spell
	during the duel who has NOT submitted !counterspell will cast their spell normally
	and will not have their spell participate in the duel.
	
	The macro must contain the @target command to function. Set up your macro as:
		!counterspell @{selected|token_id}|@{target|token_id}
	The selected token will counter against the targeted token. They must then 
	counter using the above mentioned !wizardspell or !clericspell commands after
	they have used !counterspell.
	
	When all the spells have been cast, resolve the duel with the following command:
		!resolvespellduel
	This will compare all the spell results, increment momentum for the winning
	duelists, and spit out the results. It will clear out the attacker and defenders
	but keep the new momentum attributes with their new values.
	
	"!resetspellduel" will end the duel completely. All momentum is reset to 10.
*/

function debugLog(msg) {
    //debug variables
	var v = [];
	v.push(["state.dcc.spellDuel.active", state.dcc.spellDuel.active]);
	v.push(["state.dcc.spellDuel.attackerObj",state.dcc.spellDuel.attackerObj]); 
	v.push(["state.dcc.spellDuel.attackerSpell", state.dcc.spellDuel.attackerSpell]); 
	v.push(["state.dcc.spellDuel.attackerRoll", state.dcc.spellDuel.attackerRoll]);
	v.push(["state.dcc.spellDuel.defenderObjArray", state.dcc.spellDuel.defenderObjArray]); 
	v.push(["state.dcc.spellDuel.defenderSpellArray", state.dcc.spellDuel.defenderSpellArray]); 
	v.push(["state.dcc.spellDuel.defenderRollArray", state.dcc.spellDuel.defenderRollArray]); 
	//end debug variables
	debug(msg,v);
};

function spellDuel(characterObj, spellName, spellRoll) {

    debugLog("spellDuel");
    var characterName = characterObj.get("name");
	// check if the attacker spell has already been cast or not.
	if (state.dcc.spellDuel.active === false) {
		state.dcc.spellDuel.attackerObj = characterObj;
		state.dcc.spellDuel.attackerSpell = spellName;
		state.dcc.spellDuel.attackerRoll = spellRoll;
		debugLog("duel inactive. passing ball to the last spellcaster");
		return;
	};
	
	// check if characterObj is already the attacker, a defender, or neither.
	var characterRole = "neither";
	if (_.isEqual(characterObj, state.dcc.spellDuel.attackerObj)) {
		characterRole = "attacker";
	};
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {
		if (_.isEqual(characterObj, state.dcc.spellDuel.defenderObjArray[i])) {
			characterRole = "defender";
		};
	};

	if (state.dcc.spellDuel.active === true) {
		
		if (characterRole === "attacker") {
			state.dcc.spellDuel.attackerSpell = spellName;
			state.dcc.spellDuel.attackerRoll = spellRoll;
			sendChat(characterName, "The attacker " + characterName + " casts a spell in a spell duel!");
			debugLog("spell success. caster is attacker. this spell will be the attacker's spell.");
			return;
		};	
		if (characterRole === "defender") {
			var j = state.dcc.spellDuel.defenderObjArray.indexOf(characterObj);
			state.dcc.spellDuel.defenderSpellArray[j] = spellName;
			state.dcc.spellDuel.defenderRollArray[j] = spellRoll;
			debugLog("duel active. spell success. caster is in defender array. variables set with results.");
			log(characterObj);
			log("should be the same as");
			log(state.dcc.spellDuel.defenderObjArray[j]);
			return;
		};
		
		if (characterRole = "neither") {
			debugLog("duel active. spell success. caster is not a defender. spell is just cast. do nothing.");
			return;
		};
	};
	
	debugLog("end spellDuel function, nothing happened.");
	return;
};


function counterSpell(defenderToken, attackerToken) {
	
	debugLog("counterSpell");
	log(defenderToken);
	log(attackerToken);
	
	var defenderTokenObj = findObjs({                              
		_pageid: Campaign().get("playerpageid"),                              
		_type: "graphic",
		_subtype: "token",
		_id: defenderToken
	}, {caseInsensitive: true})[0];
	
	log(defenderTokenObj);
		
	if(!defenderTokenObj.get("represents")) {
        var errormsg = "selected token has no character";
        sendChat('ERROR', errormsg);
        return;
	};
	var defenderObj = getObj("character", defenderTokenObj.get("represents"));	
	
	log(defenderObj);
	
	var attackerTokenObj = findObjs({                              
		_pageid: Campaign().get("playerpageid"),                              
		_type: "graphic",
		_subtype: "token",
		_id: attackerToken
	}, {caseInsensitive: true})[0];
	
	log(attackerTokenObj);
		
	if(!attackerTokenObj.get("represents")) {
        var errormsg = "target token has no character";
        sendChat('ERROR', errormsg);
        return;
	};
	var attackerObj = getObj("character", attackerTokenObj.get("represents"));	
	
	log(attackerObj);
	
	var attackerName = attackerObj.get("name");
	log(attackerName);
	var defenderName = defenderObj.get("name");
	log(defenderName);
	
	// check if defenderObj is already the attacker, a defender, or neither.
	var defenderRole = "neither";
	if (_.isEqual(defenderObj, state.dcc.spellDuel.attackerObj)) {
		defenderRole = "attacker";
	};
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {
		if (_.isEqual(defenderObj, state.dcc.spellDuel.defenderObjArray[i])) {
			defenderRole = "defender";
		};
	};
	
	log(defenderRole);
	
	// check if attackerObj is already the attacker, a defender, or neither.
	var attackerRole = "neither";
	if (_.isEqual(attackerObj, state.dcc.spellDuel.attackerObj)) {
		attackerRole = "attacker";
	};
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {
		if (_.isEqual(attackerObj, state.dcc.spellDuel.defenderObjArray[i])) {
			attackerRole = "defender";
		};
	};
	
	log(attackerRole);
		
	if (state.dcc.spellDuel.active === false) {
		
		// case where counterspell has not been clicked, and nobody has been defined as attacker or defender
		if ((defenderRole === "neither") && ((attackerRole === "neither") ||  (attackerRole === "attacker"))) { 
			state.dcc.spellDuel.active = true;	
			state.dcc.spellDuel.defenderObjArray.push(defenderObj);
			state.dcc.spellDuel.attackerObj = attackerObj;
	
			sendChat("Spell Duel", "/desc " + defenderName + " is going to counterspell against " + attackerName + "!");
	
			debugLog("duel inactive. character is not attacker. turn on duel. push character to defender array.");
	
			return;
		};
		
	};
	
	if (state.dcc.spellDuel.active === true) {
		
		//case where a defender and an attacker have been defined, and new counterspeller is coming in.
		if ((defenderRole === "neither") && (attackerRole === "attacker")) {
			state.dcc.spellDuel.defenderObjArray.push(defenderObj);
			sendChat("Spell Duel", "/desc " + defenderName + " has joined the duel and may now cast a counterspell!");
			debugLog("if the character is not already a defender. character added as a defender. add spellcaster to defender array");
			return;
		};
		
		//case where a defender and an attacker have been defined, but defender has clicked counterspell more than once, as if to join again.
		if ((defenderRole === "defender") && (attackerRole === "attacker")) {
			sendChat("Spell Duel", "/desc " + defenderName + "had already joined the duel and may now cast a counterspell!");		
			debugLog("character is already defender. if the character is already in the defender list, possibly by already hitting the counterspell macro. tell them they are already in the duel.");
			return;
		};
		
		//case where somebody already designated as the attacker tries to join the ongoing spell duel.
		if (defenderRole === "attacker") {
			sendChat("Spell Duel Error", "/desc " + defenderName + " is already being counterspelled!");		
			debugLog("character counterspelling already defined as attacker. send error. do nothing.");
            return;
		}; 
		
	};
	
	debugLog("end counterspell function. nothing happened.");

	return;	
};


function resolveSpellDuel() {

	debugLog("begin resolveSpellDuel.");

	if (state.dcc.spellDuel.active === false) {
		sendChat("Spell Duel", "/w gm no duel active.");
		return;
	}
	
	//make sure all of the defenders have actually cast a spell.
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {
		if (state.dcc.spellDuel.defenderRollArray[i] === undefined) {
			sendChat("Spell Duel Error", "A counterspeller did not cast a spell. Cast spell and resolve spell duel." );
			return;
		};
	};

	//declare variables
	var spellDuelChain = [0, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 10, 10, 12, 12, 14, 16];
	var spellDuelScore = [];
	var spellDuelDie = [];
	var spellDuelResult = [];
	var spellDuelMomentumName = "Momentum";
	var spellDuelRoll =[];
	var phDRoll = [];
	
	var attackerName = state.dcc.spellDuel.attackerObj.get("name");
	log("attackerName");
	log(attackerName);
	
	var defenderName = [];
	
	var defenderMomentumObj = [];
	var defenderMomentum = [];
	var momentumDiff = [];
	var newMomentum = [];
	var spellDuelMomentumName = "Momentum";
		
	//check if attacker has a momentum attribute, if not, create it	
	var attackerMomentumObj = findObjs({                                                          
		_type: "attribute",
		name: spellDuelMomentumName,
		_characterid: state.dcc.spellDuel.attackerObj.id
	}, {caseInsensitive: true})[0];

	log(attackerMomentumObj);
	
	if (attackerMomentumObj === undefined) {
        var errormsg = "selected target required momentum, creating.";
        sendChat('ERROR', errormsg);
		createObj("attribute", {
	        name: spellDuelMomentumName,
	        current: "10",
	        max: "10",
	        _characterid: state.dcc.spellDuel.attackerObj.id
	    });	
		attackerMomentumObj = findObjs({                                                          
			_type: "attribute",
			name: spellDuelMomentumName,
			_characterid: state.dcc.spellDuel.attackerObj.id
		}, {caseInsensitive: true})[0];
		log(attackerMomentumObj);
	};

	var attackerMomentum = parseInt(attackerMomentumObj.get("current"));
	
	log(attackerMomentum);

	// main loop to go through list of counterspellers vs attacker
	for (var i = 0; i < state.dcc.spellDuel.defenderObjArray.length; i++) {

		defenderName[i] = state.dcc.spellDuel.defenderObjArray[i].get("name");
		log("defenderName");
		log(defenderName[i]);
				
		//check if defender has momentum, create if not.
		defenderMomentumObj[i] = findObjs({                                                      
			_type: "attribute",
			name: spellDuelMomentumName,
			_characterid: state.dcc.spellDuel.defenderObjArray[i].id
		}, {caseInsensitive: true})[0];
		
		log(defenderMomentumObj[i]);
	
		if (defenderMomentumObj[i] === undefined) {
	        var errormsg = "selected token required momentum, creating.";
	        sendChat('ERROR', errormsg);
			createObj("attribute", {
		        name: spellDuelMomentumName,
		        current: "10",
		        max: "10",
		        _characterid: state.dcc.spellDuel.defenderObjArray[i].id
		    });	
			defenderMomentumObj[i] = findObjs({                                                      
				_type: "attribute",
				name: spellDuelMomentumName,
				_characterid: state.dcc.spellDuel.defenderObjArray[i].id
			}, {caseInsensitive: true})[0];
			log(defenderMomentumObj[i]);
		};

		defenderMomentum[i] = parseInt(defenderMomentumObj[i].get("current"));
		
		log(defenderMomentum[i]);
		
		momentumDiff[i] = attackerMomentum - defenderMomentum[i];		

		// spellDuelScore will be the difference between the attacker and the defender. negative result defender wins, positive, attacker wins, equal is a Phlogiston Disturbance
		spellDuelScore[i] = state.dcc.spellDuel.attackerRoll - state.dcc.spellDuel.defenderRollArray[i];
		log(spellDuelScore[i]);
		// the die to roll is determined by the absolute value of the duel score
		spellDuelDie[i] = spellDuelChain[Math.min(Math.abs(spellDuelScore[i]),16)];
		log(spellDuelDie[i]);
		

		//Defender High
		if (spellDuelScore[i] < 0) {
		
			spellDuelRoll[i] = randomInteger(spellDuelDie[i]);
			
			// add +1 momentum to the defender
			newMomentum[i] = defenderMomentum[i]+1;
			defenderMomentumObj[i].set("current", newMomentum[i].toString());

			momentumDiff[i] = attackerMomentum - defenderMomentum[i];
	
			if ((spellDuelRoll[i]-momentumDiff[i]) <= 1) {
				var x = randomInteger(4);
				spellDuelResult[i] = "1: Mitigate d4: roll d4, \<b\> " + x + "\<\/b\>, and subtract this from the " + attackerName + "\'s spell check. " + attackerName + "\'s spell still carries through at this lower spell check; " + defenderName[i] + "\'s spell is lost.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  attackerName,  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.attackerSpell, "\<\/b\> is now \<b\>", state.dcc.spellDuel.attackerRoll - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 2) {
				var x = randomInteger(6);
				spellDuelResult[i] = "2: Mitigate d6: roll d6, \<b\> " + x + "\<\/b\>, and subtract this from the " + attackerName + "\'s spell check. " + attackerName + "\'s spell still carries through at this lower spell check; " + defenderName[i] + "\'s spell is lost.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  attackerName,  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.attackerSpell, "\<\/b\> is now \<b\>", state.dcc.spellDuel.attackerRoll - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 3) {
				var x = randomInteger(8);
				spellDuelResult[i] = "3: Mitigate d8: roll d8, \<b\> " + x + "\<\/b\>, and subtract this from the " + attackerName + "\'s spell check. " + attackerName + "\'s spell still carries through at this lower spell check; " + defenderName[i] + "\'s spell is lost.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  attackerName,  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.attackerSpell, "\<\/b\> is now \<b\>", state.dcc.spellDuel.attackerRoll - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 4) {
				var x = randomInteger(10);
				spellDuelResult[i] = "4: Mutual mitigation d10: roll d10, \<b\> " + x + "\<\/b\>, and subtract this from the " + attackerName + "\'s spell check and the " + defenderName[i] + "\'s spell check. Both spells take effect simultaneously at this lower spell check result.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  attackerName,  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.attackerSpell, "\<\/b\> is now \<b\>", state.dcc.spellDuel.attackerRoll - x, "\<\/b\>");
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 5) {
				spellDuelResult[i] = "5: Mutual cancellation: both " + attackerName + "\'s and " + defenderName[i] + "\'s spells are cancelled.";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 6) {
				var x = randomInteger(6);
				spellDuelResult[i] = "6: Push-through d6: roll d6, \<b\> " + x + "\<\/b\>, and subtract from " + defenderName[i] + "\'s spell check. " + defenderName[i] + "\'s spell takes effect at this result and " + attackerName + "\'s spell is cancelled.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 7) {
				var x = randomInteger(4);
				spellDuelResult[i] = "7: Push-through d4: roll d4, \<b\> " + x + "\<\/b\>, and subtract from " + defenderName[i] + "\'s spell check. " + defenderName[i] + "\'s spell takes effect at this result and " + attackerName + "\'s spell is cancelled.";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 8) {
				spellDuelResult[i] = "8: Overwhelm: " + attackerName + "\'s spell is cancelled}; and " + defenderName[i] + "\'s spell takes effect at normal result.";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 9) {
				spellDuelResult[i] = "9: Reflect: " + defenderName[i] + "\'s spell is cancelled}; and " + attackerName + "\'s spell reflects back on him at the spell check result rolled.";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) >= 10) {
				spellDuelResult[i] = "10+: Reflect and overwhelm: " + defenderName[i] + "\'s spell takes effect at normal result and " + attackerName + "\'s spell reflects back on him at the spell check result rolled.";
			};	
		};

		// Attacker High
		if (spellDuelScore[i] > 0) {
		
			spellDuelRoll[i] = randomInteger(spellDuelDie[i]);
			
			// add +1 momentum to the attacker
			newMomentum[i] = attackerMomentum+1;
			attackerMomentumObj.set("current", newMomentum[i].toString());

			momentumDiff[i] = attackerMomentum - defenderMomentum[i];
			
			if ((spellDuelRoll[i]-momentumDiff[i]) <= 1) {
				var x = randomInteger(4);
				spellDuelResult[i] = "1: Push-through d4: roll d4, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + defenderName[i] + "\'s spell takes effect at this lower result and " + attackerName + "\'s spell takes effect simultaneously at normal spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 2) {
				var x = randomInteger(8);
				spellDuelResult[i] = "2: Push-through d8: roll d8, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + defenderName[i] + "\'s spell takes effect at this lower result and " + attackerName + "\'s spell takes effect first at normal spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 3) {
				spellDuelResult[i] = "3: Overwhelm: " + attackerName + "\'s spell takes effect and " + defenderName[i] + "\'s spell is cancelled. \<br\>";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 4) {
				spellDuelResult[i] = "4: Overwhelm: " + attackerName + "\'s spell takes effect and " + defenderName[i] + "\'s spell is cancelled. \<br\>";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 5) {
				spellDuelResult[i] = "5: Overwhelm: " + attackerName + "\'s spell takes effect and " + defenderName[i] + "\'s spell is cancelled. \<br\>";
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 6) {
				var x = randomInteger(8);
				spellDuelResult[i] = "6: Overwhelm and reflect d8: roll d8, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + attackerName + "\'s spell takes effect simultaneously at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at this lower spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 7) {
				var x = randomInteger(8);
				spellDuelResult[i] = "7: Overwhelm and reflect d8: roll d8, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + attackerName + "\'s spell takes effect first at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at this lower spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 8) {
				var x = randomInteger(6);
				spellDuelResult[i] = "8: Overwhelm and reflect d6: roll d6, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + attackerName + "\'s spell takes effect first at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at this lower spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) === 9) {
				var x = randomInteger(4);
				spellDuelResult[i] = "9: Overwhelm and reflect d4: roll d4, \<b\> " + x + "\<\/b\>, and subtract this from " + defenderName[i] + "\'s spell check. " + attackerName + "\'s spell takes effect first at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at this lower spell check result. \<br\>";
				spellDuelResult[i] = spellDuelResult[i].concat(" \<b\>",  defenderName[i],  "\<\/b\>\'s spell check for \<b\>", state.dcc.spellDuel.defenderSpellArray[i], "\<\/b\> is now \<b\>", state.dcc.spellDuel.defenderRollArray[i] - x, "\<\/b\>");
			};
			if ((spellDuelRoll[i]-momentumDiff[i]) >= 10) {
				spellDuelResult[i] = "10+: Reflect and overwhelm: " + attackerName + "\'s spell takes effect at normal spell check result and " + defenderName[i] + "\'s spell check is reflected back on him at normal spell check. \<br\>";
			};
		};

		//Phlogiston Disturbance Table
		if (spellDuelScore[i] === 0) {
			
			phDRoll[i] = randomInteger(10);
			
			if (phDRoll[i] === 1) {
				var x = randomInteger(6);
				spellDuelResult[i] = "1 Pocket dimension. Both casters are instantaneously transferred to a pocket dimension that is spontaneously created by the interaction between their spells. They remain within the pocket dimension until one is killed at which point the interaction of their spells ceases and the survivor is transferred back to the material plane one millisecond after his departure. Observers see only a brief flicker and the disappearance of the loser whose body is lost forever. ";
				spellDuelResult[i] = spellDuelResult[i].concat("The pocket dimension appears as (roll 1d6) ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) a mountaintop surrounded by red clouds ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) a bubble adrift in space ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) a sweltering island in a sea of lava ");
				if (x === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) an upside-down forest where the trees grow down from the sky above ");
				if (x === 5) spellDuelResult[i] = spellDuelResult[i].concat("(5) a dust mote atop the point of a needle ");
				if (x === 6) spellDuelResult[i] = spellDuelResult[i].concat("(6) the left nostril of an intergalactic whale.");
			};
			if (phDRoll[i] === 2) {
				var x = randomInteger(4);
				spellDuelResult[i] = "2 Alignment rift. Both casters are transferred to an alignment plane. If both are the same alignment they go to that plane; if they are opposed or if either is neutral they transfer to the plane of neutrality. ";
				spellDuelResult[i] = spellDuelResult[i].concat("They return to the material plane after (roll 1d4) ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) one caster is killed (both bodies return) ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) 1d8 days ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) 3d6 rounds for each caster rolled separately ");
				if (x === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) The End of Days.");
			};
			if (phDRoll[i] === 3) {
				var x = randomInteger(4);
				var y = randomInteger(4);
				var z = x + y;
				spellDuelResult[i] = "3 Time accelerates. Both casters see everything around them slow down; in reality they are accelerating and surrounding characters see them move at incredible speeds. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Resolve an additional 2d4 rounds of combat,  \<b\> ", z , "\<\/b\>, between the casters only; no other characters may act in this time. ",
				"At the end of this time they slow back into the mainstream flow of time. \<br\>");
			};
			if (phDRoll[i] === 4) {
				var x = randomInteger(3);
				spellDuelResult[i] = "4 Time slows. The casters perceive the world around them as normal but observers see their reactions slow to a crawl. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Roll 1d3,  \<b\> ", x , "\<\/b\>, and resolve that many rounds of combat among other participants before the casters can react again. \<br\>");
			};
			if (phDRoll[i] === 5) {
				var x = randomInteger(4);
				spellDuelResult[i] = "5 Backward loop in time. The casters are tossed backward in time to relive the last few moments repeatedly. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Roll 1d4,  \<b\> ", x , "\<\/b\>, and repeat the last spell interaction that many times re-rolling spell checks and incrementing momentum trackers but ignoring any subsequent Phlogiston Disturbance results (treat same-check results as \"both spells cancelled\". For example if the attacker cast magic missile and the defender cast magic shield the two would repeat 1d4 repetitions of that same spell check result. No spell can be lost during this time and a below-minimum result indicates only a failure and the spell cast repeats on the next loop. When this time loop is concluded the two casters re-enter the normal initiative count. \<br\>");
			};
			if (phDRoll[i] === 6) {
				spellDuelResult[i] = "6 Spells merge. In a freak of eldritch energy the two spells merge to create something greater than both. This result requires judge mediation. Generally speaking the resulting effect is centered directly between the two casters and is either: (a) twice as powerful as the normal spell (if two opposing spells had cancelled each other) or (b) some weird agglomeration of spell effects (if two different spells were used). For example if two fireballs were cast there may be a super-fireball that impacts between the two casters. Or if fire resis- tance countered fireball a flameless fireball could be set off generating concussive noise and astounding force but no flames. \<br\>";
			};
			if (phDRoll[i] === 7) {
				var x = randomInteger(4);
				spellDuelResult[i] = "7 Supernatural influence. The casters create a rift in space and some supernatural influence filters through. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Both spells fail and roll 1d4 ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) a randomly determined elemental energy suffuses the surrounding around causing minor effects (for example flames and heat fill the air to cause 1 damage to everyone within 50' or a massive rainstorm erupts centered on the casters). ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) negative energy drains through granting +1d8 hit points to all un-dead and demons nearby. ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) shadow energy fills the air limiting eyesight to half normal range. ");
				if (x === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) ethereal mists swirl about and 1d4 randomly determined ghosts enter the world.");
			};
			if (phDRoll[i] === 8) {
				var x = randomInteger(3);
				var y = randomInteger(4)+1;
				var z = randomInteger(5);
				spellDuelResult[i] = "8 Supernatural summoning. The combined spell results inadvertently pull a supernatural creature through the fabric of space and time. ";
				spellDuelResult[i] = spellDuelResult[i].concat("Randomly determine the nature of the supernatural creature: (roll 1d3) ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) elemental. ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) demon. ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) celestial. ");
				spellDuelResult[i] = spellDuelResult[i].concat("The creature has 1d4+1 HD,  \<b\> ", y , "\<\/b\> ");
				spellDuelResult[i] = spellDuelResult[i].concat("Determine the creature's reaction by rolling 1d5 ");
				if (z === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) hostile to all ");
				if (z === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) hostile to one caster (randomly determined) and neutral to other ");
				if (z === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) friendly to one caster (randomly determined) and hostile to other ");
				if (z === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) neutral to all parties ");
				if (z === 5) spellDuelResult[i] = spellDuelResult[i].concat("(5) friendly to all parties." );
			};
			if (phDRoll[i] === 9) {
				var x = randomInteger(4);
				var z = randomInteger(5);
				spellDuelResult[i] = "9 Demonic invasion. ";
				spellDuelResult[i] = spellDuelResult[i].concat("1d4 randomly determined demons are summoned at the exact midpoint between the two casters. ",
				"The demons are of a type as determined here: (roll 1d4) ");
				if (x === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) type I. ");
				if (x === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) type II. ");
				if (x === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) type III. ");
				if (x === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) type IV. ");
				spellDuelResult[i] = spellDuelResult[i].concat("Determine the creature's reaction by rolling 1d5 ");
				if (z === 1) spellDuelResult[i] = spellDuelResult[i].concat("(1) hostile to all ");
				if (z === 2) spellDuelResult[i] = spellDuelResult[i].concat("(2) hostile to one caster (randomly determined) and neutral to other ");
				if (z === 3) spellDuelResult[i] = spellDuelResult[i].concat("(3) friendly to one caster (randomly determined) and hostile to other ");
				if (z === 4) spellDuelResult[i] = spellDuelResult[i].concat("(4) neutral to all parties ");
				if (z === 5) spellDuelResult[i] = spellDuelResult[i].concat("(5) friendly to all parties." );
			};
			if (phDRoll[i] === 10) {
				spellDuelResult[i] = "10 Mutual corruption. Both spells fail and both casters suffer 1d4+1 corruption results. Roll corruption as normal for the spells involved. \<br\>";
			};
		};
		

		sendChat("Spell Duel", " " + spellDuelResult[i] + "");
		
		debugLog("spell Duel resolution.");
	
	};
		
	//reset all spell duel variables for this round
	//state.dcc.spellDuel = {};
	state.dcc.spellDuel.active = false;
	state.dcc.spellDuel.attackerObj = {};
	state.dcc.spellDuel.attackerSpell =  "";
	state.dcc.spellDuel.attackerRoll = 0;
	state.dcc.spellDuel.defenderObjArray = [];
	state.dcc.spellDuel.defenderSpellArray = [];
	state.dcc.spellDuel.defenderRollArray = [];

	debugLog("reset spell duel.");

	return;

};


function spellDuelReset() {
	//find all characters with momentum attribute and set to 10.
	var spellDuelMomentumName = "Momentum";
	
	var momentumCharacters = findObjs({                              
	  name: spellDuelMomentumName,                              
	  _type: "attribute",                          
	});
	
	_.each(momentumCharacters, function(obj) {    
		obj.set("current", "10");
	});

	//reset all spell duel variables for this round of the spell duel
	state.dcc.spellDuel = {};
	state.dcc.spellDuel.active = false;
	state.dcc.spellDuel.attackerObj = {};
	state.dcc.spellDuel.attackerSpell =  "";
	state.dcc.spellDuel.attackerRoll = 0;
	state.dcc.spellDuel.defenderObjArray = [];
	state.dcc.spellDuel.defenderSpellArray = [];
	state.dcc.spellDuel.defenderRollArray = [];
	
	sendChat("Spell Duel", "/w gm spellduel reset");
	
	debugLog("reset spell duel.");
	
};


on("chat:message", function(msg) {	 
	if (msg.type === "api" && msg.content.indexOf("!counterspell") !== -1) {
        var param = msg.content.split("!counterspell ")[1];
        var defenderToken = param.split("|")[0];
        var attackerToken = param.split("|")[1];
		counterSpell(defenderToken, attackerToken);
	};
	
    if (msg.type === "api" && msg.content.indexOf("!resolvespellduel") !== -1) resolveSpellDuel();
	
	if (msg.type === "api" && msg.content.indexOf("!debugspellduel") !== -1) debugSpellDuel(msg);

	if (msg.type === "api" && msg.content.indexOf("!resetspellduel") !== -1) spellDuelReset();

});

// check for existence of state.dcc.spellDuel.* properties -- create  if they don't exist
on("ready", function() {
	// bh: incomplete list so far	
	state.dcc.spellDuel = state.dcc.spellDuel || {};
	log(typeof state.dcc.spellDuel);
	state.dcc.spellDuel.active = state.dcc.spellDuel.active || false;
	log(typeof state.dcc.spellDuel.active);
	state.dcc.spellDuel.attackerObj = state.dcc.spellDuel.attackerObj || {};
	log(typeof state.dcc.spellDuel.attackerObj);
	state.dcc.spellDuel.attackerSpell = state.dcc.spellDuel.attackerSpell || "";
	log(typeof state.dcc.spellDuel.attackerSpell);
	state.dcc.spellDuel.attackerRoll = state.dcc.spellDuel.attackerRoll || 0;
	log(typeof state.dcc.spellDuel.attackerRoll);
	state.dcc.spellDuel.attackerInitiative = state.dcc.spellDuel.attackerInitiative || 0;
	log(typeof state.dcc.spellDuel.attackerInitiative);
	state.dcc.spellDuel.defenderObjArray = state.dcc.spellDuel.defenderObjArray || [];
	log(typeof state.dcc.spellDuel.defenderObjArray);
	state.dcc.spellDuel.defenderSpellArray = state.dcc.spellDuel.defenderSpellArray || [];
	log(typeof state.dcc.spellDuel.defenderSpellArray);
	state.dcc.spellDuel.defenderRollArray = state.dcc.spellDuel.defenderRollArray || [];
	log(typeof state.dcc.spellDuel.defenderRollArray);
	
	debugLog("state.dcc.spellDuel variables defined.");
	
});
	
	
	
