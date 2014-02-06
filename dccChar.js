var dcc = dcc || {};

//In line style guide for the sheet
dcc.tableStyle = "style='border-collapse: collapse; border-spacing: 0;'"
dcc.tdStyleTop = "style='background-color: #26ADE4; color: #FFF; font-weight: bold;'"
dcc.tdStyleLeft = "style='background-color: #D2E4FC; font-weight: bold;'"

//In table so it won't wrap around portrait general information
dcc.abilityGeneral = "<table style='width:300px;'><tr><td><br>\
    <b>Player Name:</b>   <br>\
    <b>Character Name:</b>   <br>\
    <b>AKA:</b>   <br>\
    <br>\
    <b>Class:</b>   <br>\
    <b>Race:</b>   <br>\
    <b>Alignment:</b>   <br>\
    <b>Level:</b>   <br>\
	<br>\
    <b>HP: 1@1st, #@2nd</b>   <br>\
    <b>AC:</b>   <br>\
    <b>AC Surprised:</b>   <br>\
    <b>AC Shield-less:</b>   <br>\
	<br>\
    <b>Height:</b>   <br>\
    <b>Weight:</b>   <br>\
    <b>Age:</b>   <br>\
    <b>Max age:</b>   <br>\
<b>Handedness:</b>   <br></td></tr></table><hr>"

//Stats
dcc.abilityTable = "<h4>Abilities</h4><table " + dcc.tableStyle + ">\
    <tr>\
            <td " + dcc.tdStyleTop + "></td>\
            <td " + dcc.tdStyleTop + ">Value</td>\
            <td " + dcc.tdStyleTop + ">Hit</td>\
            <td " + dcc.tdStyleTop + ">Dam</td>\
            <td " + dcc.tdStyleTop + ">Wgt</td>\
            <td " + dcc.tdStyleTop + ">Press</td>\
            <td " + dcc.tdStyleTop + ">Open</td>\
            <td " + dcc.tdStyleTop + ">Bend</td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Strength</td>\
            <td name='Strength'>3 (nil)</td>\
            <td>-3</td>\
            <td>-1</td>\
            <td>5</td>\
            <td>10</td>\
            <td>2(0)</td>\
            <td>0%</td>\
            <td>Notes...</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleTop + "></td>\
            <td " + dcc.tdStyleTop + ">Value</td>\
            <td " + dcc.tdStyleTop + ">React</td>\
            <td " + dcc.tdStyleTop + ">Missile</td>\
            <td " + dcc.tdStyleTop + ">Defense</td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Dexterity</td>\
            <td>3</td>\
            <td>-3</td>\
            <td>-3</td>\
            <td>+4</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td>Notes...</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleTop + "></td>\
            <td " + dcc.tdStyleTop + ">Value</td>\
            <td " + dcc.tdStyleTop + ">HP Adj.</td>\
            <td " + dcc.tdStyleTop + ">Shock</td>\
            <td " + dcc.tdStyleTop + ">Resurrection</td>\
            <td " + dcc.tdStyleTop + ">Poison*</td>\
            <td " + dcc.tdStyleTop + ">Magic*</td>\
            <td " + dcc.tdStyleTop + ">Regenerate</td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Constitution</td>\
            <td>3</td>\
            <td>-2</td>\
            <td>35%</td>\
            <td>40%</td>\
            <td>+0</td>\
            <td>+0</td>\
            <td>nil</td>\
            <td>Notes...</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleTop + "></td>\
            <td " + dcc.tdStyleTop + ">Value</td>\
            <td " + dcc.tdStyleTop + ">Lang</td>\
            <td " + dcc.tdStyleTop + ">Level</td>\
            <td " + dcc.tdStyleTop + ">Chance</td>\
            <td " + dcc.tdStyleTop + ">Max</td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + ">Immunity</td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Intelligence</td>\
            <td>3</td>\
            <td>1</td>\
            <td>nil</td>\
            <td>0%</td>\
            <td>nil</td>\
            <td> </td>\
            <td>nil</td>\
            <td>Notes...</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleTop + "></td>\
            <td " + dcc.tdStyleTop + ">Value</td>\
            <td " + dcc.tdStyleTop + ">Defense</td>\
            <td " + dcc.tdStyleTop + ">Bonus</td>\
            <td " + dcc.tdStyleTop + ">Failure</td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + ">Immunity</td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Wisdom</td>\
            <td>3</td>\
            <td>-6</td>\
            <td>nil</td>\
            <td>50%</td>\
            <td> </td>\
            <td> </td>\
            <td>nil</td>\
            <td>Notes...</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleTop + "></td>\
            <td " + dcc.tdStyleTop + ">Value</td>\
            <td " + dcc.tdStyleTop + ">Maximum</td>\
            <td " + dcc.tdStyleTop + ">Loyalty</td>\
            <td " + dcc.tdStyleTop + ">Reaction</td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Charisma</td>\
            <td>3</td>\
            <td>1</td>\
            <td>-6</td>\
            <td>-5</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td>Notes...</td>\
    </tr>\
</table><br><ul><li>Notes</li></ul><br>\
<br>* Dwarves, gnomes and halflings gain saving throws against attacks from magical wands, staves, rods, and spells, this bonus is +1 for every 3 - 1/2 points of Constitution score. \
Halflings have a similar resistance to poisons of all sorts, so they gain a Constitution bonus identical to that for saving throws vs. magical attacks when they make saving throws vs. poison.\
<hr>";

//Weapons
dcc.weaponsTable = "<h4>Weapons</h4><table " + dcc.tableStyle + ">\
    <tr>\
            <td " + dcc.tdStyleTop + ">Weapon</td>\
            <td " + dcc.tdStyleTop + ">#Attack</td>\
            <td " + dcc.tdStyleTop + ">Attack Adj.</td>\
            <td " + dcc.tdStyleTop + ">Dam Adj.</td>\
            <td " + dcc.tdStyleTop + ">THAC0</td>\
            <td " + dcc.tdStyleTop + ">Dam SM</td>\
            <td " + dcc.tdStyleTop + ">Dam L</td>\
            <td " + dcc.tdStyleTop + ">Range</td>\
            <td " + dcc.tdStyleTop + ">Weight</td>\
            <td " + dcc.tdStyleTop + ">Size</td>\
            <td " + dcc.tdStyleTop + ">Type</td>\
            <td " + dcc.tdStyleTop + ">Speed</td>\
    </tr>\
    <tr>\
            <td>Description</td>\
            <td>#/#</td>\
            <td>+##</td>\
            <td>+##</td>\
            <td>#d#</td>\
            <td>#d#</td>\
            <td>##/##/##</td>\
            <td>##</td>\
            <td>#</td>\
            <td>X</td>\
            <td>XX</td>\
            <td>#</td>\
    </tr>\
</table><br><ul><li>Notes</li></ul><hr>";

//Saving Throws
dcc.Saving = "<h4>Saving Throws</h4><br>\
<table " + dcc.tableStyle + ">\
    <tr>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + ">Target</td>\
            <td " + dcc.tdStyleTop + ">Modifier</td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Paralyzation, Poison, or Death Magic</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Rod, Staff, or Wand</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Petrification or Polymorph</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Breath Weapon</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Spell</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
</table><br><ul><li>Notes</li></ul><hr>";

//Movement
dcc.MovementTable = "<h4>Movement</h4><table " + dcc.tableStyle + ">\
    <tr>\
            <td " + dcc.tdStyleTop + "> </td>\
            <td " + dcc.tdStyleTop + ">Speed</td>\
            <td " + dcc.tdStyleTop + ">Weight</td>\
            <td " + dcc.tdStyleTop + ">Penalties</td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Base (race+dex)</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Light Enc. (-1/3)</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Moderate Enc. (-1/2)</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
     <tr>\
            <td " + dcc.tdStyleLeft + ">Heavy Enc. (-2/3)</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Severe Enc. (1)</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
</table><br><ul><li>Notes</li></ul><hr>";

//Special Abilities
dcc.SpecialTable = "<h4>Special Abilities and Attacks</h4><br><ul><li>Notes</li></ul><br>\
<table " + dcc.tableStyle + ">\
    <tr>\
            <td " + dcc.tdStyleTop + ">Skill</td>\
            <td " + dcc.tdStyleTop + ">Base</td>\
            <td " + dcc.tdStyleTop + ">Race</td>\
            <td " + dcc.tdStyleTop + ">Dex</td>\
            <td " + dcc.tdStyleTop + ">Armor</td>\
            <td " + dcc.tdStyleTop + ">Level</td>\
            <td " + dcc.tdStyleTop + ">Total</td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Pick Pockets</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Open Locks</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Find/Remove Traps</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
     <tr>\
            <td " + dcc.tdStyleLeft + ">Move Silently</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Hide in Shadows</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Detect Noise</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Climb Walls</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
    <tr>\
            <td " + dcc.tdStyleLeft + ">Read Languages</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
</table><br><hr>";

//Proficiencies
dcc.Proficiencies = "<h4>Proficiencies and Languages</h4><br>\
    <b>Weapon Proficiencies</b><br><ul><li>List</li></ul><br><br>\
    <b>Non-Weapon Proficiencies</b><br><ul><li>List</li></ul><br><br>\
    <b>Languages</b><br><ul><li>List</li></ul><br><hr>"

//Memorized
dcc.Memorized = "<h4>Spells Memorized and Spell Book</h4><br>\
    <b>Spells Memorized</b><br><ul><li>List</li></ul><br><br>\
    <b>Spell Book</b><br><ul><li>List</li></ul><br><br>\
    <b>Scrolls</b><br><ul><li>List</li></ul><br><hr>"

//Gear
dcc.GearTable = "<h4>Gear</h4><table " + dcc.tableStyle + ">\
    <tr>\
            <td " + dcc.tdStyleTop + ">Description</td>\
            <td " + dcc.tdStyleTop + ">Weight</td>\
            <td " + dcc.tdStyleTop + ">Location</td>\
    <tr>\
    </tr>\
            <td>Desciption</td>\
            <td> </td>\
            <td> </td>\
    </tr>\
</table><br><ul><li>Notes</li></ul><hr>";

//Henchmen <-Is that sexist or what? Henchpersons
dcc.HenchTable = "<h4>Henchmen/ Animal Companions</h4><table " + dcc.tableStyle + ">\
    <tr>\
            <td " + dcc.tdStyleTop + ">Name</td>\
            <td " + dcc.tdStyleTop + ">AC</td>\
            <td " + dcc.tdStyleTop + ">Race/Class</td>\
            <td " + dcc.tdStyleTop + ">HD/Lvl</td>\
            <td " + dcc.tdStyleTop + ">#AT</td>\
            <td " + dcc.tdStyleTop + ">THAC0</td>\
            <td " + dcc.tdStyleTop + ">Dmg/Effects</td>\
            <td " + dcc.tdStyleTop + ">HP</td>\
            <td " + dcc.tdStyleTop + ">Abilities</td>\
            <td " + dcc.tdStyleTop + ">Notes</td>\
    <tr>\
    </tr>\
            <td>Name</td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
            <td> </td>\
    </tr>\
</table><br><ul><li>Notes</li></ul><hr>";

//Money money money....money
dcc.Wealth = "<h4>Wealth</h4><br>\
    <b>Platinum</b><br><ul><li>##-PP</li></ul>\
    <b>Gold</b><br><ul><li>##-GP</li></ul>\
    <b>Electrum</b><br><ul><li>##-EP</li></ul>\
    <b>Silver</b><br><ul><li>##-SP</li></ul>\
    <b>Copper</b><br><ul><li>##-CP</li></ul>\
    <b>Gems</b><br><ul><li>List</li></ul>\
    <b>Other Items Of Value</b><br><ul><li>List</li></ul><br>\
    (100 Copper = 10 Silver = 2 Electrum = 1 Gold = 1/5 Platinum)"

//Attributes list
dcc.attribs = [];
dcc.attribs["Race"] = { name: "Race", current: "Human", max: ""};
dcc.attribs["ClassG"] = { name: "Class_Group", current: "Warrior", max: null};
dcc.attribs["ClassS"] = { name: "Sub_Class", current: "Fighter", max: null};
dcc.attribs["HP"] = { name: "Hit_Points", current: 1, max: 1 };
dcc.attribs["AC"] = { name: "Armor_Class", current: 10, max: null };
dcc.attribs["THA"] = { name: "THAC0", current: 20, max: null };
dcc.attribs["STR"] = { name: "Strength", current: 3, max: null };
dcc.attribs["DEX"] = { name: "Dexterity", current: 3, max: null };
dcc.attribs["CON"] = { name: "Constitution", current: 3, max: null };
dcc.attribs["INT"] = { name: "Intelligence", current: 3, max: null };
dcc.attribs["WIS"] = { name: "Wisdom", current: 3, max: null };
dcc.attribs["CHR"] = { name: "Charisma", current: 3, max: null };
dcc.attribs["ST1"] = { name: "Sav_vs_PPD", current: 14, max: null };
dcc.attribs["ST2"] = { name: "Sav_vs_RSW", current: 15, max: null };
dcc.attribs["ST3"] = { name: "Sav_vs_PP", current: 16, max: null };
dcc.attribs["ST4"] = { name: "Sav_vs_BW", current: 17, max: null };
dcc.attribs["ST5"] = { name: "Sav_vs_Spells", current: 17, max: null };
dcc.attribs["STR_EX"] = { name: "str_Exceptional", current: 0, max: null };
dcc.attribs["STR_HA"] = { name: "str_Hit_Adjust", current: -3, max: null };
dcc.attribs["STR_DA"] = { name: "str_Dam_Adjust", current: -1, max: null };
dcc.attribs["STR_ON"] = { name: "str_Open_Norm", current: 2, max: null };
dcc.attribs["STR_OB"] = { name: "str_Open_Barred", current: 0, max: null };
dcc.attribs["STR_BL"] = { name: "str_Bend_Lift", current: 0, max: null };
dcc.attribs["DEX_RE"] = { name: "dex_Reaction", current: -3, max: null };
dcc.attribs["DEX_MI"] = { name: "dex_Missile", current: -3, max: null };
dcc.attribs["DEX_DE"] = { name: "dex_Defensive", current: +4, max: null };
dcc.attribs["CON_PO"] = { name: "con_Poison", current: 0, max: null };
dcc.attribs["CON_PO"] = { name: "con_Magic", current: 0, max: null };
dcc.attribs["WIS_MA"] = { name: "wis_Magical", current: -3, max: null };
dcc.attribs["TA1"] = { name: "Pick_Pockets", current: 0, max: null };
dcc.attribs["TA2"] = { name: "Open_Locks", current: 0, max: null };
dcc.attribs["TA3"] = { name: "Find_Remove", current: 0, max: null };
dcc.attribs["TA4"] = { name: "Move_Silently", current: 0, max: null };
dcc.attribs["TA5"] = { name: "Hide_Shadows", current: 0, max: null };
dcc.attribs["TA6"] = { name: "Detect_Noise", current: 0, max: null };
dcc.attribs["TA7"] = { name: "Climb_Walls", current: 0, max: null };
dcc.attribs["TA8"] = { name: "Read_Language", current: 0, max: null };
dcc.attribs["WSH"] = { name: "Specialize_Hit", current: 0, max: null };
dcc.attribs["WSD"] = { name: "Specialize_Dam", current: 0, max: null };
dcc.attribs["W1H"] = { name: "Weapon1Hit", current: 0, max: null };
dcc.attribs["W1D"] = { name: "Weapon1Dam", current: 0, max: null };
dcc.attribs["W2H"] = { name: "Weapon2Hit", current: 0, max: null };
dcc.attribs["W2D"] = { name: "Weapon2Dam", current: 0, max: null };
dcc.attribs["W3H"] = { name: "Weapon3Hit", current: 0, max: null };
dcc.attribs["W3D"] = { name: "Weapon3Dam", current: 0, max: null };
dcc.attribs["W4H"] = { name: "Weapon4Hit", current: 0, max: null };
dcc.attribs["W4D"] = { name: "Weapon4Dam", current: 0, max: null };

//Abilities list
dcc.outOfCharacter = "/ooc "
dcc.abilities = [
    { name: "Initiative", description: "", action: "/me [[ 1d10 + ?{Modifier|0} + @{dex_Defensive} &{tracker} ]] for initiative!" },
    { name: "Surprise", description: "", action: "/me [[ 1d10 + @{dex_Reaction} ]] for surprise!" }, 
    { name: "Weapon1meleeSpc", description: "", action: "/me Specialized [[ 1d20 + @{str_Hit_Adjust} + @{Specialize_Hit} + @{Weapon1Hit}]] to hit and [[ 1d8 + @{str_Dam_Adjust} + @{Specialize_Dam} + @{Weapon1Dam}]] to dam with melee Weapon1" },
    { name: "Weapon2melee", description: "", action: "/me [[ 1d20 + @{str_Hit_Adjust} + @{Weapon2Hit}]] to hit and [[ 1d8 + @{str_Dam_Adjust} + @{Weapon2Dam}]] to dam with melee Weapon2" },
    { name: "Weapon3missile", description: "", action: "/me [[ 1d20 + @{dex_Missile} + @{Weapon3Hit}]] to hit and [[ 1d6 }]] to dam with missile Weapon3" },
    { name: "SavingThrow", description: "", action: "/me [[ 1d20 ]] for save versus\n\
        ~~~|Table|~~~\n\
        • @{Sav_vs_PPD} Para., Poison, or Death\n\
        • @{Sav_vs_RSW} Rod, Staff, or Wand\n\
        • @{Sav_vs_PP} Petri. or Polymorph\n\
        • @{Sav_vs_BW} Breath Weapon\n\
        • @{Sav_vs_Spells} Spell\n" + dcc.outOfCharacter + 
        "Note: Excludes Wisdom adjustments (@{wis_Magical}) for mind attacks and other adjustments." },
    { name: "AbilityCheck", description: "", action: "/me [[ 1d20 ]] for ability check\n\
        ~~~|Table|~~~\n\
        • @{Strength} STR • @{Dexterity} DEX • @{Constitution} CON\n\
        • @{Intelligence} INT • @{Wisdom} WIS • @{Charisma} CHR" },
    { name: "ThiefSkill", description: "", action: "/me [[ 1d100 ]]% for thieving skills\n\
        ~~~|Table|~~~\n\
        • @{Pick_Pockets}% Pick Pockets\n\
        • @{Open_Locks}% Open Locks\n\
        • @{Find_Remove}% Find/Remove Traps\n\
        • @{Move_Silently}% Move Silently\n\
        • @{Hide_Shadows}% Hide in Shadows\n" + dcc.outOfCharacter +
        "~|Continued|~\n\
        • @{Detect_Noise}% Detect Noise\n\
        • @{Climb_Walls}% Climb Walls\n\
        • @{Read_Language}% Read Language" },
        { name: "Secret_Door", description: "", action: "/me [[ 1d6 ]] detect secret door (success on a 1)." },      
        { name: "Open_Door_Norm", description: "", action: "/me [[ 1d20 ]] Open normal door (success on a @{str_Open_Norm}).\n" + dcc.outOfCharacter +
        "Note: Can try more then once." },
        { name: "Open_Door_Barred", description: "", action: "/me [[ 1d20 ]] Open barred/held door (success on a @{str_Open_Barred}).\n" + dcc.outOfCharacter +
        "Note: Can try only once." },
        { name: "Bend_Lift", description: "", action: "/me [[ 1d100 ]]% Bend bars or lift gate (success on a @{str_Bend_Lift}%).\n" + dcc.outOfCharacter +
        "Note: If the attempt fails, the character can never succeed at that task. A character can, however, try to bend the bars on a gate that he couldn’t lift, and vice versa." },

        

];

//Creates Attributes
dcc.processAttribs = function processAttribs(character) {
    for (var index in dcc.attribs) {
        createObj("attribute", {
            name: dcc.attribs[index].name,
            current: dcc.attribs[index].current,
            max: dcc.attribs[index].max,
            characterid: character.id
        });
    };
}

//Creates Abilities
dcc.processAbilities = function processAbilities(character) {
    for (var ability in dcc.abilities) {
        createObj("ability", {
                name: dcc.abilities[ability].name,
                description: "",   
                action: dcc.abilities[ability].action,  
                characterid: character.id
            });    
    };   
}

//Trigger
on("ready", function() {
    on("add:character", function(addedChar) {
        dcc.processAttribs(addedChar);
        dcc.processAbilities(addedChar);
    
        var bioText = dcc.abilityGeneral + dcc.abilityTable + dcc.Saving + dcc.weaponsTable + dcc.MovementTable;

        var bioText = bioText.concat(dcc.SpecialTable, dcc.Proficiencies, dcc.Memorized, dcc.GearTable);
        var bioText = bioText.concat(dcc.HenchTable, dcc.Wealth);
		log(bioText);
        addedChar.set({ "bio": bioText});
    });
});