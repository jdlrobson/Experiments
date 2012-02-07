/*global document, window, $*/
/*jslint sloppy: true, white:true, maxerr: 50, indent: 4, plusplus: true*/

// used: attr, selectors, toggle, hide, show
// TODO: change event handlers to bind function

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

var WMobile = function (mode) {
	this.mode = mode;
	this.init();
};
WMobile.prototype = {
	enhance: function () {
		var mobile = this;
		// search - hide results when no input, clear when clicked
		$('#clearsearch').attr("title", "clear").
			mousedown(function (ev) {
				$("#search").val("");
				$(ev.target, "#results").hide();
				// TODO: are these 2 following lines needed?
				ev.preventDefault();
				ev.stopPropagation();
			}, true).
			keyup(function(ev) {
				if ( $(ev.target).val().length > 0 ) {
					$(ev.target).show();
				} else {
					$(ev.target, "#results").hide();
				}
			});

		// when a language option is selected jump to that page
		$("#languageselection").change(function(ev) {
			var url = $(ev.target).val();
			if(url) {
				window.location = url;
			}
		});

		// on clicking on logo reveal the navigation - random page and language toggling
		$("#logo").click(function(ev) {
			$("#nav").toggle();
			//TODO: what is the purpose of this? see http://svn.wikimedia.org/viewvc/mediawiki/trunk/extensions/MobileFrontend/javascripts/application.js?r1=100663&r2=100662&pathrev=100663
			// when the select menu is over 175px increase the width of the parent by 30px so there is some whitespace to the right of it
			// surely css styling could be used here somehow?
			if ( $("#languageselection").width() > 175 ) {
				// ignores existing padding
				$("#nav").css("padding-right", 30);
			}
		});

		//  clicking on this changes the language of the current page when other languages are available
		$("#languageselection").click(function(ev) {
			var url;
			if($('#languageselection')[0]) {
				url = $(ev.target).val();
				if (url) {
					window.location.href = url;
				}
			}
		});

		$("a").click(function(ev) {
			if (this.hash.indexOf('#') === 0) {
				mobile.reveal_for_hash( this.hash );
			}
		});
		$("h2.section_heading").click(function(ev) {
			var number = this.id.split("_")[1];
			mobile.toggle_section(number);
		});
	},
	// if there is a hash link and this is currently hidden
	// make sure we reveal it to the user
	// note currently it toggles it but should probably only show it 
	reveal_for_hash: function(hash) {
		var container = $(hash).parent(".section_heading,.content_block")[0],
			section_idx;
		// TODO: why not when block?
		if(container && container.style.display !== 'block') {
			section_idx = parseInt(container.id.split("_")[1], 10);
			this.toggle_section(section_idx);
		}
	},
	// TODO
	toggle_section: function( section_id ) {
		var i, b = $("#section_" + section_id)[0],
			bb = $('button'), s, e, d;

		for(i = 0; i <= 1; i++) {
			s = bb[i].style;
			s.display = s.display === 'none' || ( i && !s.display ) ? 'inline-block' : 'none';
		}
		for(i = 0, d = ['content_','anchor_']; i<=1; i++) {
			e = $( "#" + d[i] + section_id )[0];
			if(e) {
				e.style.display = e.style.display === 'block' ? 'none' : 'block';
			}
		}
	},
	init: function() {
		var zeroRatedBannerVisibility, dismissNotification;

		// enhance the page
		this.enhance();

		if(document.location.hash.indexOf('#') === 0) {
			this.reveal_for_hash(document.location.hash);
		}

		// Try to scroll and hide URL bar
		window.scrollTo(0, 1);

		// set up notifications and visibility
		zeroRatedBannerVisibility = new Cookie("zeroRatedBannerVisibility");
		dismissNotification = $("#dismiss-notification").
			click(function(ev) {
				$("#zero-rated-banner").hide();
				zeroRatedBannerVisibility.write("off", 1);
			})[0];

		if(dismissNotification && zeroRatedBannerVisibility === "off") {
			$("#zero-rated-banner").hide();
		}
	}
};
var modecookie = new Cookie("javascriptMode");
window.wikipediamobile = new WMobile(mode.cookie.get());
