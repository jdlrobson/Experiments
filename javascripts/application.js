var search = document.getElementById( 'search' );
var clearSearch = document.getElementById( 'clearsearch' );
var results = document.getElementById( 'results' );
var languageSelection = document.getElementById( 'languageselection' );

initClearSearchLink();

function initClearSearchLink() {
	clearSearch.setAttribute( 'title','Clear' );
	clearSearch.addEventListener( 'mousedown', clearSearchBox, true );
	search.addEventListener( 'keyup', handleClearSearchLink, false );
}

function navigateToLanguageSelection() {
	var url;
	if ( languageSelection ) {
		url = languageSelection.options[languageSelection.selectedIndex].value;
		if ( url ) {
			location.href = url;
		}
	}
}

function handleClearSearchLink() {
	if ( clearSearch ) {
		if ( search.value.length > 0 ) {
			clearSearch.style.display = 'block';
		} else {
			clearSearch.style.display = 'none';
			if ( results ) {
				results.style.display = 'none';
			}
		}
	}
}

function clearSearchBox( event ) {
	search.value = '';
	clearSearch.style.display = 'none';
	if ( results ) {
		results.style.display = 'none';
	}
	if ( event ) {
		event.preventDefault();
	}
}

function logoClick() {
	var n = document.getElementById( 'nav' ).style;
	n.display = n.display == 'block' ? 'none' : 'block';
	if (n.display == 'block') {
		if ( languageSelection ) {
			if ( languageSelection.offsetWidth > 175 ) {
				var newWidth = languageSelection.offsetWidth + 30;
				n.width = newWidth + 'px';
			}
		}
	}
};

// And this...
for ( var a = document.getElementsByTagName( 'a' ), i = 0; i < a.length; i++ ) {
	a[i].onclick = function() {
		if ( this.hash.indexOf( '#' ) == 0 ) {
			wm_reveal_for_hash( this.hash );
		}
	}
}

if ( document.location.hash.indexOf( '#' ) == 0 ) {
	wm_reveal_for_hash( document.location.hash );
}

function wm_reveal_for_hash( hash ) {
	var targetel = document.getElementById( hash.substr(1) );
	if ( targetel ) {
		for (var p = targetel.parentNode; p && p.className != 'content_block' && p.className != 'section_heading'; ) {
			p = p.parentNode;
		}
		if ( p && p.style.display != 'block' ) {
			var section_idx = parseInt( p.id.split( '_' )[1] );
			wm_toggle_section( section_idx );
		}
	}
}

function wm_toggle_section( section_id ) {
	var b = document.getElementById( 'section_' + section_id ),
		bb = b.getElementsByTagName( 'button' );
	for ( var i = 0; i <= 1; i++ ) {
		var s = bb[i].style;
		s.display = s.display == 'none' || ( i && !s.display ) ? 'inline-block' : 'none';
	}
	for ( var i = 0, d = ['content_','anchor_']; i<=1; i++ ) {
		var e = document.getElementById( d[i] + section_id );
		
		if ( e ) {
			e.style.display = e.style.display == 'block' ? 'none' : 'block';
		}
	}
}

var Cookie = function (name) {
	this.name = name;
};
Cookie.prototype = {
	set: function (value, days) {
		var name = this.name, date = new Date(), expires;
		// to remove setCookie( name, '', -1 );
		if (days) {
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = '; expires=' + date.toGMTString();
		} else {	
			expires = '';
		}
		document.cookie = name + '=' + value + expires + '; path=/';
	},
	get: function () {
		var i, c,
			nameVA = this.name + '=',
			ca = document.cookie.split(';');

		for (i = 0; i < ca.length; i++) {
			c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length);
			}
			if(c.indexOf(nameVA) === 0) {
				return c.substring(nameVA.length, c.length);
			}
		}
		return null;
	}
};

var WMobile = function () {
	this.init();
};
WMobile.prototype = {
	init: function() {
		var zeroRatedBannerVisibility, dismissNotification;

		// Try to scroll and hide URL bar
		window.scrollTo(0, 1);

		// set up notifications and visibility
		zeroRatedBannerVisibility = new Cookie("zeroRatedBannerVisibility");
		dismissNotification = $("#dismiss-notification").
			click(function(ev) {
				$("#zero-rated-banner").hide();
				zeroRatedBannerVisibility.set("off", 1);
			})[0];

		if(dismissNotification && zeroRatedBannerVisibility.get() === "off") {
			$("#zero-rated-banner").hide();
		}
	}
};
window.wikipediamobile = new WMobile();
