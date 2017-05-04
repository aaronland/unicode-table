var the_top_left = 0;

function search(q){

	q = q.toUpperCase();
	
	var results = {};

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

function draw_results(results){

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

function draw_table(top_left, lookup) {
	
	the_top_left = parseInt(top_left);
	
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

	drawBig(the_top_left);	
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

function hash2dec(hash) {

	if (! hash){
		return 0;
	}

	var num = hash.substring(1);
	var pos = parseInt(num);

	return pos;
}

function to_spot(hash) {

	var pos = hash2dec(hash);
	
	// var num_str = hashString.substring(1);
	// var pos = parseInt(num_str);

	return snap_to(pos);
}

function snap_to(pos){

	var snap = parseInt(pos / 100) * 100;
	return snap;

	/*
	a = Math.floor(pos/10000);
	b = Math.floor((pos - a * 10000)/1000);
	c = Math.floor(((pos - a * 10000) - (b * 1000))/100);
	
	tl = Math.round(pos/100) * 100;
	return tl;
	*/
}

window.addEventListener("load", function load(event){

	the_top_left = 0;
	var pos = the_top_left;
	
	var hash = window.location.hash;
	
	if (hash) {
		pos = hash2dec(hash);
		the_top_left = to_spot(hash);
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
			draw_table(to_spot(wanted));			
		};
	}

	window.onkeydown = function(e){

		// console.log(e);

		var incr = 10;

		if (e.shiftKey){
			incr = 100;

			if (e.altKey){
				incr = 1000;
			}
		}
		
		var key = e.keyCode || e.which;
		var keychar = String.fromCharCode(key);

		var redraw = true;
		
		var pos = 0;
		var wanted = 0;

		var href = location.href;
		var idx = href.indexOf('#');
	
		if (idx != -1){		
			var hash = href.substring(idx);
			var num_str = hash.substring(1);
			pos = parseInt(num_str);
		}

		var snap = snap_to(pos);
		var next = snap + 100;
		
		var offset = 0
		
		// left-arrow
		
		if (key == 37){
			
			wanted = pos - 1;
			offset = -100;	// this is the problem?
			
			if (wanted >= snap){
				redraw = false;
			}
		}

		// up-arrow
		
		else if (key == 38){

			wanted = pos - incr;
			offset = -100;
			
			if (wanted >= snap){
				redraw = false;
			}
		}
		
		// right-arrow

		else if (key == 39){
			
			wanted = pos + 1;

			if (wanted < snap){
				redraw = false;
			}
		}

		// down-arrow
		
		else if (key == 40){

			wanted = pos + incr;
			
			if (wanted < next){
				redraw = false;
			}
		}

		else {
			return;
		}
		
		if (wanted <= 0){
			wanted = 0;
		}
		
		location.href = "#" + wanted;

		if (redraw){
			draw_table(snap_to(wanted + offset));
		}

		drawBig(wanted);
	};
	
	var search_input = document.getElementById("search");
	
	search_input.onchange = function(e){

		var el = e.target;
		var q = el.value;

		var results = search(q);
		draw_results(results)

		var cl = document.getElementById("clear-results");
		cl.style.display = "inline";
	};

	var clear_button = document.getElementById("clear-results");

	clear_button.onclick = function(e){

		var el = e.target;
		el.style.display = "none";

		var search_input = document.getElementById("search");
		search_input.value = "";
		
		draw_table(the_top_left);		
	};

	var prev_button = document.getElementById("prev");

	prev_button.onclick = function(e){

		var pos = snap_to(the_top_left);
		var prev = pos - 100;

		if (prev < 0){
			return;
		}
		
		location.href = "#" + prev;		
		draw_table(prev);
	};
	
	var next_button = document.getElementById("next");

	next_button.onclick = function(e){

		var pos = snap_to(the_top_left);
		var next = pos + 100;

		location.href = "#" + next;		
		draw_table(next);		
	};

	var codepoint = document.getElementById("codepoint");
	
	codepoint.onchange = function(e){

		var el = e.target;
		var cp = el.value;

		// &#9600;
		// U+2580;
		// U+1F42E;
		
		var m = cp.match(/(?:U\+|\&\#)?([0-9a-f]+)\;?/i);

		if (m){
			cp = m[1];

			if (! cp.match(/^\d+$/)){
				cp = parseInt(cp, 16);
			}
		}

		cp = parseInt(cp);
		
		var snap = snap_to(cp);
		draw_table(name);
		drawBig(cp);
		
	};
	
	draw_table(the_top_left);
	drawBig(pos);
});
