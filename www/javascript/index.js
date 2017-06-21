function get_current(){

	var hash = window.location.hash;
	var cp = hash_to_codepoint(hash);
	return cp;
}

function set_current(cp){

	location.href = "#" + cp;	
}

function to_codepoint(cp){

	var m = cp.match(/(?:U\+|\&\#)?([0-9a-f]+)\;?/i);

	if (m){
		cp = m[1];

		if (! cp.match(/^\d+$/)){
			cp = parseInt(cp, 16);
		}
	}

	var codepoint = parseInt(cp);
	
	if (! codepoint){

		// please make me work...
		// codepoint = cp.codePointAt();
		
		codepoint = 0;
	}
	
	return codepoint;
}

function hash_to_codepoint(hash) {

	if (! hash){
		return 0;
	}

	hash = hash.substring(1);
	hash = decodeURIComponent(hash);
	
	var cp = to_codepoint(hash);
	return cp;
}

function snap_to(cp){
	
	var snap = parseInt(cp / 100) * 100;
	return snap;
}

function codepoint_to_hex(cp){

	var hex = parseInt(cp);
	hex = hex.toString(16);
	hex = hex.toUpperCase();
	hex = pad_four(hex);
	
	return hex;
}

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
			var cp = el.getAttribute("data-codepoint");
			draw_codepoint(cp);		
		};

		var onclick = function(e){
			var el = e.target;
			var cp = el.getAttribute("data-codepoint");
			set_current(cp);
		};
	
		for (var hex in results){

			var cp = parseInt(hex, 16);		
			var row = document.createElement("tr");
		
			var char = document.createElement("td");
			char.setAttribute("class", "char");
			char.setAttribute("data-codepoint", cp);
			char.innerHTML = "&#" + cp + ";";
			
			char.onclick = onclick;		
			char.onmouseover = mouseover;
		
			var name = document.createElement("td");
			name.setAttribute("class", "name");
			name.setAttribute("data-codepoint", cp);		
			name.appendChild(document.createTextNode(results[hex]));
			
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

function draw_table(start) {

	var table = document.createElement("table");
	var i = 0;
	
	var height = 10;
	var width = 10;

	var onclick = function(e){
				
		var el = e.target;
		var cp = el.getAttribute("id");

		set_current(cp);
		draw_codepoint(cp);
	};
	
	while (i < height){

		var tr = document.createElement("tr");
		var j = 0;
		
		while (j < width){
			
			var cp = start + (i * height) + j ;

			var td = document.createElement("td");
			td.setAttribute("id", "preview-" + cp);
			
			var wrapper = document.createElement("div");
			wrapper.setAttribute("class", "wrapper");
			
			var preview = document.createElement("div");
			preview.setAttribute("id", cp);			
			preview.setAttribute("class", "preview");
			preview.innerHTML = "&#" + cp + ";";

			preview.onclick = onclick;
			
			var exp = document.createElement("div");
			exp.setAttribute("id", cp);			
			exp.setAttribute("class", "exp");
			exp.innerHTML = "&amp;#" + cp + ";";

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

function redraw(cp){

	var snap = snap_to(cp);
	draw_table(snap);

	draw_codepoint(cp);
	set_current(cp);
}

function draw_codepoint(cp, name){

	var selected = document.getElementsByClassName("selected");
	var count = selected.length;
	
	for (var i=0; i < count; i++){
		var el = selected[i];
		
		if (el){
			el.removeAttribute("class");
		}
	}
	
	var preview_id = "preview-" + cp;
	var preview = document.getElementById(preview_id);
	
	if (preview){
		preview.setAttribute("class", "selected");
	}

	var hex = codepoint_to_hex(cp);
	var name = "";
	
	if (ucd[hex]) {
		name = ucd[hex];
	}
			
	var wrapper = document.createElement("div");
	wrapper.setAttribute("id", "bigletter-wrapper");

	var letter = document.createElement("div");
	letter.setAttribute("id", "bigletter");

	letter.innerHTML = '&#' + cp + ';';
	
	var details = document.createElement("ul");
	details.setAttribute("id", "bigletter-details");
	details.setAttribute("class", "medium");

	var n = document.createElement("li");
	n.setAttribute("data-codepoint", cp);
	n.setAttribute("class", "permalink");
	n.setAttribute("title", "this codepoint has a permalink");
	n.innerHTML = name;

	n.onclick = function(e){

		var el = e.target;
		var cp = el.getAttribute("data-codepoint");

		var url = "https://thisisaaronland.github.io/unicode-table/#" + encodeURIComponent(cp);
		
		const {shell} = require('electron');
                shell.openExternal(url);
	};
	
	var i = document.createElement("li");
	i.innerHTML = '&amp;#' + cp + ';';

	var h = document.createElement("li");
	h.innerHTML = 'U+' + hex + ';';

	details.appendChild(n);
	details.appendChild(i);
	details.appendChild(h);

	if ((name) && ('SpeechSynthesisUtterance' in window)){

		var s = document.createElement("li");
		s.setAttribute("title", "read this codepoint aloud");		
		s.innerHTML = '';
		
		s.setAttribute("class", "tts");
		s.setAttribute("data-codepoint", cp);
		
		s.onclick = function(e){

			var el = e.target;
			
			var cp = el.getAttribute("data-codepoint");
			var hex = codepoint_to_hex(cp);
			var name = ucd[hex];
			
			var msg = new SpeechSynthesisUtterance();
			msg.text = String.fromCodePoint(cp) + ", or: " + name;
	
			speechSynthesis.speak(msg);
		};

		details.appendChild(s);
	}
	
	wrapper.appendChild(letter);
	wrapper.appendChild(details);	

	var big = document.getElementById("big");
	big.innerHTML = "";
	
	big.appendChild(wrapper);
}

function on_keydown(e){
	
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
	
	var current = get_current();
	var cp = 0;
		
	var snap = snap_to(current);
	var next = snap + 100;
	
	var offset = 0
	
	// left-arrow
	
	if (key == 37){
		
		cp = current - 1;
		offset = -100;
	}
	
	// up-arrow
	
	else if (key == 38){
		
		cp = current - incr;
		offset = -100;
	}
	
	// right-arrow
	
	else if (key == 39){
		
		cp = current + 1;
	}
	
	// down-arrow
	
	else if (key == 40){
		
		cp = current + incr;
	}
	
	else {
		return;
	}
	
	if (cp <= 0){
		cp = 0;
	}

	e.preventDefault();

	redraw(cp);
}

window.addEventListener("load", function load(event){
	
	var jump = document.getElementById("jumpto");
	var anchors = jump.getElementsByTagName("a");
	var count = anchors.length;

	for (var i=0; i < count; i++){
		
		var a = anchors[i];
		
		a.onclick = function(e){
			
			var el = e.target;
			var href = el.getAttribute("href");

			var cp = hash_to_codepoint(href);
			redraw(cp);
		};
	}

	window.onkeydown = on_keydown;
	
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

		var cp = get_current();
		redraw(cp);
	};

	var prev_button = document.getElementById("prev");

	prev_button.onclick = function(e){

		var current = get_current();
		var snap = snap_to(current);
		
		var cp = snap - 100;

		if (cp < 0){
			return;
		}
		
		redraw(cp);
	};
	
	var next_button = document.getElementById("next");

	next_button.onclick = function(e){

		var current = get_current();
		var snap = snap_to(current);
		
		var cp = snap + 100;
		redraw(cp);		
	};

	var codepoint = document.getElementById("codepoint");
	
	codepoint.onchange = function(e){

		var el = e.target;

		var cp = to_codepoint(el.value);
		redraw(cp);
	};

	var cp = get_current();
	redraw(cp);
});
