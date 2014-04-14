#!/bin/bash
# roll20 Script Concatenator
# concat list of files

cat modules/*.js > tmp.js

# get all the documentation
awk '/\/\*/, /\*\//{print}' tmp.js > documentation.txt
# clean up debug comments -- though none of the files currenlty included are using tmp = XXX; log(tmp); style debugging. 
awk '!/[[:space:]]+tmp = [^\n]+ log\(tmp\);/, !/^$/ {print}' tmp.js > tmp2.js
# remove inlne documentation from concatenated script
sed '/\/\*/,/\*\// d' tmp2.js > tmp3.js
# add collected documentation back to beginning of file
cat documentation.txt tmp3.js >  DCCHelper_`date +%Y%m%d%H%M`.js
# remove blank lines
# sed '/^\s*$/d' tmp4.js > DCCHelper_`date +%Y%m%d%H%M`.js
# clean up temp files
rm documentation.txt
rm tmp.js
rm tmp2.js
rm tmp3.js
# rm tmp4.js


