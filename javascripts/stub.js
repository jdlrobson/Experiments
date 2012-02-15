var app = {
	navigateToPage: function(url) {
		window.location = url;
	}
};
var chrome = {
	hideOverlays: function() {
		$('#nearby-overlay').hide();
	},
	hideContent: function() {
		$("#content").hide();
	},
	showContent: function() {
		this.hideOverlays();
		$("#content").show();
	},
	doFocusHack: function() {
		
	},
	init: function() {
		preferencesDB.set('language', $("html").attr("lang"));
	}
};

$("#nearby").click(function(ev) {
	if(!$(ev.target).hasClass("hide")) {
		geo.showNearbyArticles();
		$(ev.target).addClass("hide");
	} else {
		chrome.showContent();
		$(ev.target).removeClass("hide");
	}
});

chrome.init();
