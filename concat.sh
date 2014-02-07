#!/bin/bash
# roll20 Script Concatenator

cat modules/*.js > DCCHelper.js

# clean up debug comments
# i.e. lines in the concatenated file that are of the format 'tmp = ...; log(tmp);'
# which can also easily be commented on/off via regex
awk '{gsub(/[[:space:]]+tmp = [^\n]+ log\(tmp\);/,"");print}' dccHelper_test.js > dccHelper_test_out.js


