KonOpas.Item = function() {
	_el('prog_ls').onclick = KonOpas.Item.list_click;
	if (_el('scroll_link')) {
		_el('scroll_link').onclick = function() { _el('top').scrollIntoView(); return false; };
		if (window.navigator && navigator.userAgent.match(/Android [12]/)) {
			_el('time').style.display = 'none';
			_el('scroll').style.display = 'none';
		} else {
			this.scroll = {
				'i': 0, 'top': 0,
				'day': '', 'day_txt': '',
				't_el': _el('time'), 's_el': _el('scroll'),
				'times': document.getElementsByClassName('new_time')
			};
			window.onscroll = this.scroll_time.bind(this);
		}
	}
}

KonOpas.Item.show_extra = function(item, id) {
	function _tags(it) {
		if (!it.tags || !it.tags.length) return '';
		var o = {};
		it.tags.forEach(function(t) {
			var cat = 'tags';
			var tgt = KonOpas.Prog.hash({'tag': t});
			var a = t.split(':');
			if (a.length > 1) { cat = a.shift(); t = a.join(':'); }
			var link = '<a href="' + tgt + '">' + t + '</a>'
			if (o[cat]) o[cat].push(link);
			else o[cat] = [link];
		});
		var a = []; for (var k in o) a.push(i18n.txt('item_tags', {'T':k}) + ': ' + o[k].join(', '));
		return '<div class="discreet">' + a.join('<br>') + '</div>\n';
	}
	function _people(it) {
		if (!it.people || !it.people.length) return '';
		var a = it.people.map(!konopas.people || !konopas.people.list.length
			? function(p) { return p.name; }
			: function(p) { return "<a href=\"#part/" + KonOpas.hash_encode(p.id) + "\">" + p.name + "</a>"; }
		);
		return '<div class="item-people">' + a.join(', ') + '</div>\n';
	}

	if (_el("e" + id)) return;
	var html = "";
	var a = konopas.program.list.filter(function(el) { return el.id == id; });
	if (a.length < 1) html = i18n.txt('item_not_found', {'ID':id});
	else {
		html = _tags(a[0]) + _people(a[0]);
		if (a[0].desc) html += "<p>" + a[0].desc;
		html += '<a href="#prog/id:' + a[0].id + '" class="permalink" title="' + i18n.txt('Permalink') + '"></a>';
	}
	var extra = _new_elem('div', 'extra');
	extra.id = 'e' + id;
	extra.innerHTML = html;
	item.appendChild(extra);
	if (konopas.server) konopas.server.show_extras(id, item);
}

KonOpas.Item.new = function(it) {
	function _loc_str(it) {
		var s = '';
		if (it.loc && it.loc.length) {
			s = it.loc[0];
			if (it.loc.length > 1) s += ' (' + it.loc.slice(1).join(', ') + ')';
		}
		if (it.mins && (it.mins != konopas.default_duration)) {
			if (s) s += ', ';
			s += KonOpas.pretty_time(it.time, konopas) + ' - ' + KonOpas.pretty_time(KonOpas.time_sum(it.time, it.mins), konopas);
		}
		return s;
	}
	var frame = _new_elem('div', 'item_frame'),
	    star  = frame.appendChild(_new_elem('div', 'item_star')),
	    item  = frame.appendChild(_new_elem('div', 'item')),
	    title = item.appendChild(_new_elem('div', 'title')),
	    loc   = item.appendChild(_new_elem('div', 'loc')),
	    votes = konopas.use_server ? item.appendChild(_new_elem('div', 'votes')) : {'id':''};
	if (konopas.use_server) {
		votes.textContent = i18n.txt('Votes') + ': ';
		votes.appendChild(_new_elem('a', 'v_pos', '+0')).title = 'good';
		votes.appendChild(document.createTextNode(' / '));
		votes.appendChild(_new_elem('a', 'v_neg', '-0')).title = 'not so good';
	}

	KonOpas.Item.new = function(it) {
		star.id = 's' + it.id;
		item.id = 'p' + it.id;
		title.textContent = it.title;
		loc.textContent = _loc_str(it);
		votes.id = 'v' + it.id;
		return frame.cloneNode(true);
	};
	return KonOpas.Item.new(it);
}

KonOpas.Item.show_list = function(ls, show_id, day, in_prog_view) {
	if (!day || !konopas.program.days[day]) {
		day = '';
		for (day in konopas.program.days) break;
	}
	var prev_date = "", prev_time = "",
		show_all = (ls.length <= konopas.max_items_per_page),
	    ls_by_day = {}, ls_day_lengths = {},
	    day_links = {},
	    frag = document.createDocumentFragment();
	if (day) {
		for (var d in konopas.program.days) {
			ls_by_day[d] = ls.filter(function(p) { return p.date == d; });
			ls_day_lengths[d] = ls_by_day[d].length;
		}
	} else ls_by_day = { '': ls };
	if (ls.length > (show_id ? 1 : 0)) {
		frag.appendChild(_new_elem('div', 'item_expander', '» '))
			.appendChild(_new_elem('a', 'js-link', i18n.txt('Expand all')))
			.id = 'item_expander_link';
	}
	for (var d in ls_by_day) {
		if (!show_all && d && (d != day)) {
			if (d < day) {
				if (ls_day_lengths[d]) day_links['prev'] = d;
			} else {
				if (!day_links['next'] && ls_day_lengths[d]) day_links['next'] = d;
			}
			continue;
		}
		for (var i = 0, l = ls_by_day[d].length; i < l; ++i) {
			var p = ls_by_day[d][i];
			if (p.date != prev_date) {
				prev_date = p.date;
				prev_time = "";
				frag.appendChild(_new_elem('div', 'new_day', KonOpas.pretty_date(p.date, konopas))).id = 'dt_' + p.date;
			}
			if (p.time != prev_time) {
				prev_time = p.time;
				frag.appendChild(document.createElement('hr'));
				frag.appendChild(_new_elem('div', 'new_time', KonOpas.pretty_time(p.time, konopas)))
					.setAttribute('data-day', p.date);
			}
			frag.appendChild(KonOpas.Item.new(p));
		}
	}
	function _day_link(t) {
		var d = day_links[t],
		    txt = i18n.txt('day_link', {
				'D': KonOpas.parse_date(d).getDay(),
				'N': ls_day_lengths[d]
			}),
		    link = _new_elem('a', 'day-link js-link', txt);
		link.id = t + '_day_link';
		link.onclick = function() {
			if (t == 'next') window.scrollTo(0, 0);
			KonOpas.Item.show_list(ls, show_id, d, in_prog_view);
		};
		return link;
	}
	if (day_links['prev']) frag.insertBefore(_day_link('prev'), frag.firstChild);
	if (day_links['next']) frag.appendChild(_day_link('next'));

	var LS = _el('prog_ls');
	while (LS.firstChild) LS.removeChild(LS.firstChild);
	LS.appendChild(frag);

	if (konopas.server) konopas.server.decorate_list(LS);

	var expand_all = _el("item_expander_link");
	if (expand_all) expand_all.onclick = function() {
		var items = LS.getElementsByClassName("item");
		var exp_txt = i18n.txt('Expand all');
		if (expand_all.textContent == exp_txt) {
			for (var i = 0, l = items.length; i < l; ++i) {
				items[i].parentNode.classList.add("expanded");
				KonOpas.Item.show_extra(items[i], items[i].id.substr(1));
			}
			expand_all.textContent = i18n.txt('Collapse all');
		} else {
			for (var i = 0, l = items.length; i < l; ++i) {
				items[i].parentNode.classList.remove("expanded");
			}
			expand_all.textContent = exp_txt;
		}
	};

	var star_els = LS.getElementsByClassName("item_star");
	for (var i = 0, l = star_els.length; i < l; ++i) {
		star_els[i].onclick = function() { konopas.stars.toggle(this, this.id.substr(1)); return false; };
	}

	var star_list = konopas.stars.list();
	for (var i = 0, l = star_list.length; i < l; ++i) {
		var el = _el('s' + star_list[i]);
		if (el) el.classList.add("has_star");
	}

	if (show_id) {
		var it = document.getElementById('p' + show_id);
		if (it) {
			it.parentNode.classList.add("expanded");
			KonOpas.Item.show_extra(it, show_id);
			if (ls.length > 1) it.scrollIntoView();
		}
	}

	if (in_prog_view) {
		var d_s = _el('day-sidebar'), d_n = _el('day-narrow'),
		    d_click = function(ev) {
				var li = (ev || window.event).target,
				    d = li.getAttribute('data-day');
				if (!d) return;
				if (show_all) {
					_el('dt_' + d).scrollIntoView();
					KonOpas.Prog.focus_day(d);
				} else {
					KonOpas.Item.show_list(ls, show_id, d, true);
				}
			},
		    d_set = function(div, len) {
				var ul = document.createElement('ul');
				ul.className = 'day-list';
				ul.onclick = d_click;
				for (var d in konopas.program.days) {
					var li = document.createElement('li');
					li.textContent = konopas.program.days[d][len] + ' (' + (ls_day_lengths[d] || 0) + ')';
					li.setAttribute('data-day', d);
					if (d == day) li.className = 'selected';
					ul.appendChild(li);
				}
				div.innerHTML = '';
				div.appendChild(ul);
			};
		if (d_s) d_set(d_s, 'long');
		if (d_n) d_set(d_n, 'short');
	}

	konopas.item.scroll.i = 0;
	window.onscroll && window.onscroll();
}

KonOpas.Item.list_click = function(ev) {
	var el = (ev || window.event).target,
	    is_link = false;
	while (el && !/\bitem(_|$)/.test(el.className)) {
		if (el.id == 'prog_ls') return;
		if ((el.tagName.toLowerCase() == 'a') && el.href) is_link = true;
		el = el.parentNode;
		if (!el) return;
	}
	if (el && el.id && (el.id[0] == 'p') && !is_link) {
		if (el.parentNode.classList.toggle("expanded")) {
			KonOpas.Item.show_extra(el, el.id.substr(1));
		}
	}
}

KonOpas.Item.prototype.scroll_time = function() {
	var S = this.scroll,
		st_len = S.times.length,
	    scroll_top = window.pageYOffset + 20; // to have more time for change behind new_time
	if (!S.t_el || !st_len) return;
	if (scroll_top < S.times[0].offsetTop) {
		S.i = 0;
		S.top = S.times[0].offsetTop;
		S.t_el.style.display = 'none';
		var day0 = S.times[0].getAttribute('data-day');
		if (day0 != S.day) {
			KonOpas.Prog.focus_day(day0);
			S.day = day0;
		}
	} else {
		var i = S.top ? S.i : 1;
		if (i >= st_len) i = st_len - 1;
		if (scroll_top > S.times[i].offsetTop) {
			while ((i < st_len) && (scroll_top > S.times[i].offsetTop)) ++i;
			--i;
		} else {
			while ((i >= 0) && (scroll_top < S.times[i].offsetTop)) --i;
		}
		if (i < 0) i = 0;
		if ((i == 0) || (i != S.i)) {
			S.i = i;
			S.top = S.times[i].offsetTop;
			var day0 = S.times[i].getAttribute('data-day'),
			    day1 = ((i + 1 < st_len) && S.times[i+1].getAttribute('data-day')) || day0;
			S.t_el.textContent = konopas.program.days[day0]['short'] + '\n' + S.times[i].textContent;
			S.t_el.style.display = 'block';
			if (day1 != S.day) {
				KonOpas.Prog.focus_day(day1);
				S.day = day1;
			}
		}
	}
	if (S.s_el) S.s_el.style.display = S.t_el.style.display;
}
