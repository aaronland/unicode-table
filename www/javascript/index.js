var the_top_left = 0;

function search(q){

	var results = {};
	
	q = q.toUpperCase();

	for (var i in ucd){

		var label = ucd[i].split(" ");
		
		for (var j in label){

			if (label[j] == q){
				results[i] = ucd[i];
				break;
			}
		}
	}

	return results;
}

function pad_four(x) {

	x = x + '';

	while (x.length < 4) {
		x = '0' + x;
	}
	
	return x;
}

function make_results(results){

	var count = 0;

	for (k in results){
		count++;
	}
	
	var root = document.createElement("div");
	root.setAttribute("id", "results");

	if (count == 0){

		var p = document.createElement("p");
		p.setAttribute("class", "warning");
		p.appendChild(document.createTextNode("No matches."));

		root.appendChild(p);
	}

	else {
		
		var table = document.createElement("table");
		var row = document.createElement("tr");
		
		var char_header = document.createElement("th");
		char_header.appendChild(document.createTextNode("Character"));

		var name_header = document.createElement("th");
		name_header.appendChild(document.createTextNode("Name"));
		
		row.appendChild(char_header);
		row.appendChild(name_header);

		table.appendChild(row);

		var mouseover = function(e){
			var el = e.target;
			var dec = el.getAttribute("data-decimal");
			drawBig(dec);		
		};

		var onclick = function(e){
			var el = e.target;
			var dec = el.getAttribute("data-decimal");
			location.href = "#" + dec;
		};
	
		for (var hx in results){

			var dec = parseInt(hx, 16);		
			var row = document.createElement("tr");
		
			var char = document.createElement("td");
			char.setAttribute("class", "char");
			char.setAttribute("data-decimal", dec);
			char.innerHTML = "&#" + dec + ";";
			
			char.onclick = onclick;		
			char.onmouseover = mouseover;
		
			var name = document.createElement("td");
			name.setAttribute("class", "name");
			name.setAttribute("data-decimal", dec);		
			name.appendChild(document.createTextNode(results[hx]));
			
			name.onclick = onclick;		
			name.onmouseover = mouseover;
		
			row.append(char);
			row.append(name);
			
			table.appendChild(row);
		}

		root.appendChild(table);
	}
	
	var big = document.getElementById("big");
	big.innerHTML = "";

	var u = document.getElementById("unicode");
	u.innerHTML = "";
	
	u.appendChild(root);	
}

function make_table(top_left, lookup) {
	
	the_top_left = parseInt(top_left);
	drawBig(the_top_left);
	
	var table = document.createElement("table");
	var i = 0;
	
	var height = 10;
	var width = 10;

	var onclick = function(e){
				
		var el = e.target;
		var dec = el.getAttribute("id");

		location.href = "#" + dec;
		drawBig(dec);
	};
	
	while (i < height){

		var tr = document.createElement("tr");
		var j = 0;
		
		while (j < width){
			
			var dec = top_left + (i * height) + j ;

			var td = document.createElement("td");
			td.setAttribute("id", "preview-" + dec);
			
			var wrapper = document.createElement("div");
			wrapper.setAttribute("class", "wrapper");
			
			var preview = document.createElement("div");
			preview.setAttribute("id", dec);			
			preview.setAttribute("class", "preview");
			preview.innerHTML = "&#" + dec + ";";

			preview.onclick = onclick;
			
			var exp = document.createElement("div");
			exp.setAttribute("id", dec);			
			exp.setAttribute("class", "exp");
			exp.innerHTML = "&amp;#" + dec + ";";

			wrapper.appendChild(preview);			
			wrapper.appendChild(exp);

			wrapper.onclick = onclick;
			
			td.appendChild(wrapper);
			tr.appendChild(td);
			
			j++;
		}

		table.appendChild(tr);
		i++;
	}
	
	var u = document.getElementById("unicode");
	u.innerHTML = "";
	
	u.appendChild(table);
}

function drawBig(id, name){

	var selected = document.getElementsByClassName("selected");
	var count = selected.length;
	
	for (var i=0; i < count; i++){
		var el = selected[i];
		
		if (el){
			el.removeAttribute("class");
		}
	}
	
	var preview_id = "preview-" + id;
	var preview = document.getElementById(preview_id);
	
	if (preview){
		preview.setAttribute("class", "selected");
	}
	
	var hex = parseInt(id);
	hex = hex.toString(16);
	hex = hex.toUpperCase();
	hex = pad_four(hex);
	
	var name = "&#160;";
	
	if (ucd[hex]) {
		name = ucd[hex];
	}
			
	var wrapper = document.createElement("div");
	wrapper.setAttribute("id", "bigletter-wrapper");

	var letter = document.createElement("div");
	letter.setAttribute("id", "bigletter");

	letter.innerHTML = '&#' + id + ';';
	
	var details = document.createElement("ul");
	details.setAttribute("id", "bigletter-details");
	details.setAttribute("class", "medium");

	var n = document.createElement("li");
	n.innerHTML = name;
	
	var i = document.createElement("li");
	i.innerHTML = '&amp;#' + id + ';';

	var h = document.createElement("li");
	h.innerHTML = 'U+' + hex + ';';
	
	details.appendChild(n);
	details.appendChild(i);
	details.appendChild(h);		
	
	wrapper.appendChild(letter);
	wrapper.appendChild(details);	

	var big = document.getElementById("big");
	big.innerHTML = "";
	
	big.appendChild(wrapper);
}

function toSpot(hashString) {
	
	var num_str = hashString.substring(1);
	var pos = parseInt(num_str);
	
	a = Math.floor(pos/10000);
	b = Math.floor((pos - a * 10000)/1000);
	c = Math.floor(((pos - a * 10000) - (b * 1000))/100);
	
	tl = Math.round(pos/100) * 100;
	return tl;
}

window.addEventListener("load", function load(event){

	if (window.location.hash) {
		the_top_left = toSpot(window.location.hash);
	}

	var jump = document.getElementById("jumpto");
	var anchors = jump.getElementsByTagName("a");
	var count = anchors.length;

	for (var i=0; i < count; i++){
		
		var a = anchors[i];
		
		a.onclick = function(e){
			var el = e.target;
			var href = el.getAttribute("href");
			var wanted = href.substring(href.indexOf('#'));
			make_table(toSpot(wanted));			
		};
	}

	window.onkeydown = function(e){

		// console.log(e);

		var incr = 100;

		if (e.shiftKey){
			incr = 1000;

			if (e.altKey){
				incr = 10000;
			}
		}
		
		var key = e.keyCode || e.which;
		var keychar = String.fromCharCode(key);

		var pos = 0;
		var wanted = 0;

		var href = location.href;
		var idx = href.indexOf('#');
	
		if (idx != -1){		
			var hash = href.substring(idx);
			var num_str = hash.substring(1);
			pos = parseInt(num_str);
		}

		// left-arrow
		
		if (key == 37){
			wanted = pos - 1;
		}

		// up-arrow
		
		else if (key == 38){

			var top = Math.floor(pos / incr) * incr;
			wanted = top;

			if (pos == top){
				wanted = wanted - incr;
			}
		}
		
		// right-arrow

		else if (key == 39){
			wanted = pos + 1;
		}

		// down-arrow
		
		else if (key == 40){
			wanted = (Math.floor(pos / incr) * incr) + incr;			
		}

		else {
			return;
		}

		if (wanted <= 0){
			wanted = 0;
		}
		
		location.href = "#" + wanted;
		make_table(wanted);
	};

	/*
	var jump = document.getElementById("jump");
	
	jump.onchange = function(e){
		var el = e.target;
		var i = parseInt(el.value);

		if (! i){
			return false;
		}

		if (i <= 0){
			i = 1;
		}

		location.href = "#" + i;		
		make_table(i);
	};
	*/
	
	var search_input = document.getElementById("search");
	
	search_input.onchange = function(e){

		var el = e.target;
		var q = el.value;

		var results = search(q);
		make_results(results)

		var cl = document.getElementById("clear-results");
		cl.style.display = "inline";
	};

	var clear_button = document.getElementById("clear-results");

	clear_button.onclick = function(e){

		var el = e.target;
		el.style.display = "none";

		var search_input = document.getElementById("search");
		search_input.value = "";
		
		make_table(the_top_left);		
	};
	
	make_table(the_top_left);
});
