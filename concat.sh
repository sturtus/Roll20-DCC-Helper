#!/bin/bash
# roll20 Script Concatenator

# concat all files
# cat modules/*.js > tmp.js

# concat list of files

cat modules/roll20library.js modules/attrib.js modules/diceChain.js modules/deed.js modules/spellDuel.js modules/clericSpell.js modules/wizardSpell.js > tmp.js

# clean up debug comments
# i.e. lines in the concatenated file that are of the format 'tmp = ...; log(tmp);'
# which can also easily be commented on/off via regex
awk '{gsub(/[[:space:]]+tmp = [^\n]+ log\(tmp\);/,"");print}' tmp.js > DCCHelper.js
rm tmp.js

