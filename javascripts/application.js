/*global document, window, $*/
/*jslint sloppy: true, white:true, maxerr: 50, indent: 4, plusplus: true*/

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
	enhance: function () {
		var mobile = this;
		// hen clear button clicked hide results and self
		$('#clearsearch').attr("title", "clear").
			mousedown(function(ev) {
				$("#search").val("");
				$(ev.target, "#results").hide();
				// TODO: are these 2 following lines needed?
				ev.preventDefault();
				ev.stopPropagation();
			});

			// when there is text in the search box reveal the clearsearch button
		$("#search").keyup(function(ev) {
			var clearSearch = $("#clearsearch")[0];
				if($(ev.target).val().length > 0) {
					$(clearSearch).show();
				} else {
					$(clearSearch, "#results").hide();
				}
		});

		// when a language option is selected jump to that page
		$("#languageselection").change(function(ev) {
			var url = $(ev.target).val();
			if(url) {
				window.location = url;
			}
		});

		// on clicking on logo reveal the navigation - home and random button and language toggling
		$("#logo").click(function(ev) {
			$("#nav").toggle();
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

		// update links to fragments to reveal them if they are hidden
		$("a").click(function(ev) {
			if (this.hash.indexOf('#') === 0) {
				mobile.reveal_for_hash(this.hash);
			}
		});

		// clicking on a header should toggle the section it relates to
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
	toggle_section: function( section_id ) {
		$("#section_" + section_id + " button").toggle();
		$( "#content_" + section_id + ",#anchor_" + section_id ).toggle();
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
				zeroRatedBannerVisibility.set("off", 1);
			})[0];

		if(dismissNotification && zeroRatedBannerVisibility.get() === "off") {
			$("#zero-rated-banner").hide();
		}
	}
};
window.wikipediamobile = new WMobile();
