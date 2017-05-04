merge-ucd:
	curl -s -o www/javascript/ucd.js https://raw.githubusercontent.com/thisisaaronland/unicode-table/master/www/javascript/ucd.js

merge-code:
	curl -s -o www/javascript/index.js https://raw.githubusercontent.com/thisisaaronland/unicode-table/master/www/javascript/index.js
	curl -s -o www/css/index.css https://raw.githubusercontent.com/thisisaaronland/unicode-table/master/www/css/index.css

merge:	merge-ucd merge-code
