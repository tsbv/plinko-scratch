NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.filter = Array.prototype.filter;
NodeList.prototype.map = Array.prototype.map;
Array.prototype.random = function() { return this[Math.floor(Math.random() * this.length)]; }
Object.defineProperty(Array.prototype, 'random', { enumerable: false });
window.addEventListener('load', checkParams);

function random(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1)
}

function ajax(url, data, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.open(data ? 'POST' : 'GET', url, true);
	xhr.onload = function() {
		if (xhr.status == 200) {
			try {
				data = JSON.parse(xhr.responseText);
			} catch($e) {
				data = xhr.responseText;
			}
			if (typeof success == 'function') success(data);
		} else {
			if (typeof error == 'function') error(xhr.status);
		}
	};
	xhr.onerror = function(err) {
		if (typeof error == 'function') error(err);
	};
	if (data) {
		if (typeof data == 'string') xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		if (typeof data == 'object') data = JSON.stringify(data);
		xhr.send(data);
	} else {
		xhr.send();
	}
}

function short(link, callback) {
	ajax('https://short.ajaxfeed.com/?short=' + encodeURIComponent(link), null, function(data) {
		callback(data.url.shortLink);
	});
}

function qrcode(link) {
	var sms = document.querySelector('input[name="link"]');
	var fields = { text: 'qrText', width: 'qrWidth', height: 'qrHeight', colorDark: 'qrColorDark', colorLight: 'qrColorLight', correctLevel: 'qrCorrectLevel' };
	document.querySelectorAll('[data-content="QR"]').forEach(function(elem) {
		var config = {};
		if (sms) config.text = sms.value;
		if (link) config.text = link;
		for (var i in fields) if (elem.dataset[fields[i]]) config[i] = elem.dataset[fields[i]];
		if (config.correctLevel) config.correctLevel = parseInt(config.correctLevel);
		if (config.text) {
			elem.innerHTML = '';
			new QRCode(elem, config);
		}
	});
}

window.addEventListener('hashchange', function() {
	if (window.location.hash == '#qrcode' || window.location.hash == '#qr_code' || window.location.hash == '#qrform') {
		var sms = document.querySelector('input[name="link"]');
		if (sms) short(sms.value, qrcode);
	}
});

function rules(callback) {
	if (!window.fonapi) window.fonapi = {};
	if (callback) window.fonapi.callback = callback;

	if (!window.fonapi.urls) {
		ajax(
			'/urls.json',
			null,
			function(data) {
				window.fonapi.urls = data.common;
				rules();
			});
		window.fonapi.urls = 'loading';
	}

	if (window.fonapi.urls == 'loading') return;

	if (!window.fonapi.rules) {
		window.fonapi.rules = {};
		if (window.fonapi.callback) {
			document.querySelectorAll('[name="gtm_name"]').forEach(function(el) {
				window.fonapi.rules['data_' + el.content + '/' + lang] = '';
			});
		}
	}

	for (var rule in window.fonapi.rules) {
		if (!window.fonapi.rules[rule]) {
			ajax(
				window.fonapi.urls.random() + '/content/getActualContentByAlias',
				{
					alias: rule.split('/')[0],
					className: 'Content.UserPage',
					lang: rule.split('/')[1],
					lastVersion: '0',
					sysId: 1
				},
				function(data) {
					if (data.content && data.content.object && data.content.object.body) {
						if (rule.indexOf('data_') === 0) {
							window.fonapi.rules[rule] = data.content.object.body.split("\n").map(function(str) {
								return str.split('=');
							}).reduce(function(data, arr) {
								if (arr.length > 1) {
									data.key = arr.shift();
									data[data.key] = '';
								}
								if (data.key) data[data.key] += arr.join('=') + "\n";
								return data;
							}, {});
							for (var key in window.fonapi.rules[rule]) {
								window.fonapi.rules[rule][key] = window.fonapi.rules[rule][key].trim();
								if (window.fonapi.rules[rule][key].indexOf('#') > -1) window.fonapi.rules[rule][key] = marked(window.fonapi.rules[rule][key]);
							}
						} else {
							window.fonapi.rules[rule] = marked(data.content.object.body);
						}
					} else {
						if (rule.indexOf('data_') === 0) {
							window.fonapi.rules[rule] = {};
						} else {
							window.fonapi.rules[rule] = ' ';
						}
					}
					rules();
				});
			window.fonapi.rules[rule] = 'loading';
		}

		if (window.fonapi.rules[rule] == 'loading') return;

		if (rule.indexOf('data_') === 0) {
			for (var key in window.fonapi.rules[rule]) {
				document.querySelectorAll('[data-alias="' + rule.split('/')[0] + '"][data-lang="' + rule.split('/')[1] + '"][data-key="' + key + '"], [data-alias="' + rule.split('/')[0] + '"][data-locale="' + rule.split('/')[1] + '"][data-key="' + key + '"]').forEach(function(el) {
					if (!el.innerHTML) el.innerHTML = window.fonapi.rules[rule][key];
				});
			}
			if (typeof window.fonapi.callback == 'function') window.fonapi.callback(window.fonapi.rules[rule]);
		} else {
			document.querySelectorAll('[data-alias="' + rule.split('/')[0] + '"][data-lang="' + rule.split('/')[1] + '"], [data-alias="' + rule.split('/')[0] + '"][data-locale="' + rule.split('/')[1] + '"]').forEach(function(el) {
				if (!el.innerHTML) el.innerHTML = window.fonapi.rules[rule];
			});
		}
	}
}

function error(xhr) {
	document.querySelector('#message').innerText = xhr.responseText || status;
	window.location.hash = '#error';
}

function userAgent() {
	var attribute = '';
	var devices = {
		android: /android/i,
		iphone: /iphone/i,
		ipad: /ipad/i,
		ipod: /ipod/i,
		ios: /iphone|ipod|ipad/i
	};

	for (var device in devices)
		if (devices[device].test(window.navigator.userAgent))
			attribute += ' ' + device;

	document.querySelector('html').setAttribute('device', attribute);
}


var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};


function action(action, data, el) {
	if (typeof window[action] == 'function') window[action](data);
	if (/^#.+/i.test(action)) {
		document.documentElement.beforeScrollTop = document.documentElement.scrollTop;
		window.location.hash = action;
		document.documentElement.scrollTop = document.documentElement.beforeScrollTop;
	}
}

function show(el,event) {
	if (!el) return;
	hide();
	if (el.parentNode.clientWidth + el.parentNode.clientHeight == 0) show(el.parentNode);
	if (el.dataset.group) document.querySelectorAll('[data-group="' + el.dataset.group + '"]').filter(function(e) { return e != el; }).forEach(hide);
	if (el.clientWidth + el.clientHeight == 0 && !el.dataset.group) window.popups.push(el);
	if (el.clientWidth + el.clientHeight == 0) el.style.display = '';
	el.disabled = false;
	el.focus();
	el.classList.add('is-active');
	document.body.classList.add('is-modal-show');
	// scrollTo(el);
}

function scrollTo(el) {
	if (!el) return;
	jQuery(document.documentElement).animate({
		scrollTop: jQuery(el).offset().top
	}, {
		duration: 500,
		complete: function() {
			// window.addEventListener('scroll', scroll);
		}
	});
}

function hide(el) {
	if (!el) return window.popups.forEach(hide);
	el.classList.remove('is-active');
	el.style.display = 'none';
	document.body.classList.remove('is-modal-show');
}

function hash(event) {
	if (event && event.preventDefault) event.preventDefault();
	if (!window.popups) window.popups = [];
	if (window.location.hash && window.location.hash != '#' && window.location.hash != '#!') {
		show(document.querySelector(window.location.hash));
	} else {
		hide();
	}
}

function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function getParameterByName(name){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec(window.location.href);
	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function checkParams() {
	const clientId = getParameterByName('clientId');
	const headerApiCid = getCookie('headerApi.cid');
	const fsid = getParameterByName('fsid');

	if (clientId || headerApiCid || fsid) {
		window.location.replace('https://batery.win/account/');
	}
}

function setPromo(code){
	if (code.code) code = code.code;
	registrationApi.setPromocode(code);
}

function ajaxForm(event) {
	if (event && event.preventDefault) event.preventDefault();
	if (event && event.tagName == 'FORM') var form = event;
	if (this && this.tagName == 'FORM') var form = this;
	form.input = form.querySelector(':focus');

	if (window.grecaptcha) {
		grecaptcha.execute('6LehDGAUAAAAAJoqkx-oc6W-KeapSBCr2veF3Mwd', { action: 'submit' }).then(function(token) {
			form.querySelector('[name=captcha]').value = token;
			ajaxSubmit(form);
		});
	} else {
		ajaxSubmit(form);
	}
}

function ajaxSubmit(form) {
	var opts = {};

	if (form.dataset.submit) opts.beforeSubmit = function() { action(form.dataset.submit); }
	if (form.dataset.success) opts.success = function(res) { action(form.dataset.success, res); }
	if (form.dataset.error) opts.error = function(xhr) { action(form.dataset.error, xhr); }
	if (form.button && form.button.dataset.submit) opts.beforeSubmit = function() { action(form.button.dataset.submit); }
	if (form.button && form.button.dataset.success) opts.success = function(res) { action(form.button.dataset.success, res); }
	if (form.button && form.button.dataset.error) opts.error = function(xhr) { action(form.button.dataset.error, xhr); }
	if (form.button && form.button.attributes.formAction) opts.url = form.button.formAction;
	if (form.input && form.input.dataset.submit) opts.beforeSubmit = function() { action(form.input.dataset.submit); }
	if (form.input && form.input.dataset.success) opts.success = function(res) { action(form.input.dataset.success, res); }
	if (form.input && form.input.dataset.error) opts.error = function(xhr) { action(form.input.dataset.error, xhr); }
	if (form.input && form.input.attributes.formAction) opts.url = form.input.formAction;

	jQuery(form).ajaxSubmit(opts);
}

function checkInitData(){
	if ( isMobile.any() ){
		document.querySelectorAll('[data-alias-mob]').forEach(function(el){
			var aliasMob = el.getAttribute('data-alias-mob');
			el.setAttribute('data-alias',aliasMob);
			rules();
		});
		document.querySelectorAll('[data-promo-id-mob]').forEach(function(el){
			var promoMob = el.getAttribute('data-promo-id-mob');
			el.setAttribute('data-promo-id',promoMob);
			// initReg();
		});
	} else {
		rules();
		initReg();
	}
}

var regDataFlag = false;

function checkEmptyData(s,value){
	var _el = document.querySelector('['+s+']')
	if (value && (_el)!=null){_el.setAttribute(s,value);}
}

function updateData(conf){
	console.log('updateData()');
	regDataFlag = true;
	checkEmptyData('data-alias-mob',conf.rules_alias_mob);
	checkEmptyData('data-alias',conf.rules_alias);
	checkEmptyData('data-promo-id',conf.promocode_text);
	checkEmptyData('data-promo-id-mob',conf.promocode_text_mob);

	// checkInitData();
	document.body.classList.add('line-is-loaded');
}

function init() {
	if (!data) return;
	for (var key in data)
		render(key, data[key]);
	for (var key in conf)
		render(key, conf[key]);
	// updateData(conf)
	utm();
}

function render(key, value) {
	document.querySelectorAll('[data-content="' + key + '"]').forEach(function(el) {
		if (value) {
			switch (el.tagName) {
				case 'LABEL':
				case 'DIV':
					el.style.display = 'block';
					break;
				case 'SPAN':
				case 'P':
					el.innerHTML = value;
					break;
				case 'TEXTAREA':
				case 'INPUT':
					el.value = value;
					break;
				case 'A':
					el.href = value;
					break;
				case 'IFRAME':
				case 'VIDEO':
				case 'IMG':
					el.src = value;
					break;
			}
		} else {
			el.style.display = 'none';
		}
	});
}

function initLine() {
	var match = null;
	var element = null;
	if (element = document.querySelector('meta[name="gtm_name"]')) window.alias = element.content;
	if (match = window.location.pathname.match(/\/(\d+)\/?$/)) window.eventId = match[1];
	else if (match = window.location.pathname.match(/\/([^\/]+)\/?$/)) window.alias = match[1];
	if (match = window.location.search.match(/\bid=(\d+)/)) window.eventId = match[1];
	if (match = window.location.search.match(/_rtx(\d+)/)) window.eventId = match[1];
}

jQuery(function() {

	jQuery(document).on('click', '.s-hero__content-body .toolbar__btn:not(._state_disabled),.s-hero__content-form .toolbar__btn:not(._state_disabled)', function(){
		jQuery('.s-hero__content-form-btn').addClass('hide');
	});

	if (jQuery('[data-slider]').length) jQuery('[data-slider]').owlCarousel({
		items: 1,
		nav: true,
		navText: [
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.507 13.014"><path data-name="Р   Р РЋРІвЂћСћР   Р РЋРІР‚СћР   Р  РІР‚В¦Р  Р Р‹Р Р†Р вЂљРЎв„ўР  Р Р‹Р РЋРІР‚СљР  Р Р‹Р  РІР‚С™ 25392" d="M6.093 1.414L1 6.507 6.093 11.6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>',
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.507 13.014"><path data-name="Р   Р РЋРІвЂћСћР   Р РЋРІР‚СћР   Р  РІР‚В¦Р  Р Р‹Р Р†Р вЂљРЎв„ўР  Р Р‹Р РЋРІР‚СљР  Р Р‹Р  РІР‚С™ 25391" d="M1.414 11.6l5.093-5.093-5.093-5.093" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>'
		],
		dots: false,
		loop: true,
		autoplay: true,
		autoplaySpeed: 500,
		autoplayTimeout: 4000,
		autoplayHoverPause: false
	});

	// cloneForm();
	jQuery('.b-modal--form .b-modal__close').on('click', function(e){
		var modal = jQuery(this).closest('.b-modal--form');
		var body = jQuery('body').removeClass('no-scroll');
		modal.removeClass('is-active');
	});

	jQuery('.s-hero__step-popup-close').on('click', function(e){
		var scrollTop = window.scrollY;
		history.replaceState(null,null,'#');
		e.preventDefault();
		window.scrollTo(0, scrollTop);
		jQuery('#stepRules').removeClass('is-active').hide();
		// $('#stepRules').hide();
		document.body.classList.remove('is-modal-show');
	});

	jQuery('.b-modal--rules .btn-close').on('click', function(e){
		var scrollTop = window.scrollY;
		history.replaceState(null,null,'#');
		e.preventDefault();
		window.scrollTo(0, scrollTop);
		jQuery('#rules').removeClass('is-active').hide();
		// $('#stepRules').hide();
		document.body.classList.remove('is-modal-show');
	});

	jQuery('.b-modal--popup .b-modal__close').on('click', function(e){
		var scrollTop = window.scrollY;
		var modal = jQuery(this).closest('.b-modal--popup');
		history.replaceState(null,null,'#');
		e.preventDefault();
		window.scrollTo(0, scrollTop);
		modal.removeClass('is-active').hide();
	});

	jQuery('.js-reg-form-show').on('click', function(e){
		var modal = jQuery(this).closest('.b-modal--form');
		var body = jQuery('body').addClass('no-scroll');
		modal.addClass('is-active');
	});

	document.querySelectorAll('[data-mask]').forEach(function(el) {
		jQuery(el).mask(el.dataset.mask);
	});

	document.querySelectorAll('[data-submit]').forEach(function(el) {
		el.addEventListener('submit', ajaxForm);
	});

	document.querySelectorAll('[data-submit] [type="submit"]').forEach(function(el) {
		el.addEventListener('click', function(event) {
			this.form.button = this;
		});
	});

	document.querySelectorAll('[data-valid="submit"]').forEach(function(el) {
		el.addEventListener('input', function(event) {
			if (this.checkValidity()) ajaxForm(this.form);
		});
	});

	document.querySelectorAll('[data-invalid]').forEach(function(el) {
		el.addEventListener('invalid', function(event) {
			this.setCustomValidity(this.dataset.invalid);
		});
		el.addEventListener('change', function(event) {
			this.setCustomValidity('');
			document.querySelectorAll('[name=' + this.name + ']').forEach(function(el) {
				el.setCustomValidity('');
			});
		});
		el.addEventListener('input', function(event) {
			this.setCustomValidity('');
			document.querySelectorAll('[name=' + this.name + ']').forEach(function(el) {
				el.setCustomValidity('');
			});
		});
	});

	document.querySelectorAll('[data-click]').forEach(function(el) {
		el.addEventListener('click', function(event) {
			action(this.dataset.click, this.dataset, this);
		});
	});


	var indexes = {current: 0};
	var slide = document.getElementsByClassName('text-slide');
	var slides = document.querySelector('.text-slide');
	if (typeof(slides) != 'undefined' && slides != null){
		window.onload = slideText();
	}
	function slideText() {
		if (indexes.last) {
			slide[indexes.last].classList.remove('is-active');
		}
		slides.classList.remove('is-active');
		slide[indexes.current].classList.add('is-active');
		indexes.last = indexes.current;
		indexes.current++;
		if (indexes.current >= slide.length) {
			indexes.current = 0;
		}

		setTimeout(slideText, 2000);
	}

	jQuery(".scrollto").on('click', function (e) {
		e.preventDefault();
		var hash = e.currentTarget.hash,
			scrollTo = 0,
			offset = 0;
		if (!$(hash).length) return;
		scrollTo = Math.round($(hash).offset().top) - offset;
		// animate
		jQuery('html, body').stop().animate({scrollTop: scrollTo}, 600);
	});

	//dropdown

	// Get all the dropdown from document
	document.querySelectorAll('.dropdown-toggle').forEach(dropDownFunc);

	// Dropdown Open and Close function
	function dropDownFunc(dropDown) {
		// console.log(dropDown.classList.contains('click-dropdown'));

		if(dropDown.classList.contains('click-dropdown') === true){
			dropDown.addEventListener('click', function (e) {
				e.preventDefault();

				if (this.nextElementSibling.classList.contains('dropdown-active') === true) {
					// Close the clicked dropdown
					this.parentElement.classList.remove('dropdown-open');
					this.nextElementSibling.classList.remove('dropdown-active');

				} else {
					// Close the opend dropdown
					closeDropdown();

					// add the open and active class(Opening the DropDown)
					this.parentElement.classList.add('dropdown-open');
					this.nextElementSibling.classList.add('dropdown-active');
				}
			});
		}

		if(dropDown.classList.contains('hover-dropdown') === true){

			dropDown.onmouseover  =  dropDown.onmouseout = dropdownHover;

			function dropdownHover(e){
				if(e.type == 'mouseover'){
					// Close the opend dropdown
					closeDropdown();

					// add the open and active class(Opening the DropDown)
					this.parentElement.classList.add('dropdown-open');
					this.nextElementSibling.classList.add('dropdown-active');

				}
			}
		}

	};


	// Listen to the doc click
	window.addEventListener('click', function (e) {

		// Close the menu if click happen outside menu
		if (e.target.closest('.dropdown-container') === null) {
			// Close the opend dropdown
			closeDropdown();
		}

	});

	// Close the openend Dropdowns
	function closeDropdown() {
		// console.log('closeDropdown');

		// remove the open and active class from other opened Dropdown (Closing the opend DropDown)
		document.querySelectorAll('.dropdown-container').forEach(function (container) {
			container.classList.remove('dropdown-open')
		});

		document.querySelectorAll('.dropdown-menu').forEach(function (menu) {
			menu.classList.remove('dropdown-active');
		});
	}

	// close the dropdown on mouse out from the dropdown list
	document.querySelectorAll('.dropdown-menu').forEach(function (dropDownList) {
		// close the dropdown after user leave the list
		dropDownList.onmouseleave = closeDropdown;
	});

});


(function() {
	var timer = 0;
	window.addEventListener('resize', function () {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		else
			document.body.classList.add('stop-transitions');

		timer = setTimeout(function () {
			document.body.classList.remove('stop-transitions');
			// cloneForm();
			timer = null;
		}, 100);
	});
})();
