document.addEventListener("DOMContentLoaded", function() {
	f_getPosition = function (e, t) {
	
		t = t.toLowerCase();
		
		return $(e).offset()[t];
	}
	
	function walkTheDOM (node, func) {
		func(node);
		node = node.firstChild;
		while (node) {
			walkTheDOM(node, func);
			node = node.nextSibling;
		}
	}
	
	document.addEventListener('click', function(e) {
		var $tCal = $('#tcal');
		if ($tCal.length && $tCal.is(':visible') && !$(e.target).closest('.popover-body', '#tcal').length) {
			f_tcalHideAll();
		}
	})

	function getElementsByClassName (className) {
		var results = [];
		walkTheDOM(document.body, function (node) {
			var a, c = node.className, i;
			if (c && typeof c == 'string') {
				a = c.split(' ');
				for (i=0; i<a.length; i++) {
					if (a[i] === className) {
						results.push(node);
						break;
					}
				}
			}
		});
		return results;
	}

	function getLang() {
		if (window.$ite !== undefined && window.$ite.hasParam('lang')) {
			return window.$ite.getParam('lang');
		}
		return window._s3Lang.code !== undefined ? window._s3Lang.code : 'ru';
	}

	var i, j, id, e, inputs;

	/* Simple calendars */
	for (i=0, inputs=getElementsByClassName('init-calendar-lp-content'); i<inputs.length; ++i)
	new tcal({
		'controlname':inputs[i].id,
		'place': inputs[i].parentNode,
		'lang': getLang()
	});

	/* Calendar intervals */
	for(i=0, inputs=getElementsByClassName('init-calendar-interval-lp-content'); i<inputs.length; ++i){
		id = inputs[i].id;
		for(j=0; j<2; ++j){
			e = f_getElement(id + '['+j+']');
			new tcal({
				'controlname':e.id,
				'place':e.parentNode,
				'lang': getLang(),
				'intervalpair':[
					id + '[0]',
					id + '[1]'
				],
				'intervalupdatecont' : id
			});
		}
	}
});