var apiUrl = '/api.php';

if ( scriptPath ) {
	apiUrl = scriptPath + apiUrl;	
}

RegExp.escape = function(str) {
	return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

var TYPING_DELAY = 500;

var opensearch = {
	writeResults: function(sections) {
		var results = $("#results")[0], list,
			term = $("#search").val(),
			top = $("#sq").offset().top + $("#sq").outerHeight(true);
		$(results).empty().css("top", top).
			show().width($("#searchbox").width() - 2); // substract border left and right
		list = $('<div class="suggestions-results">').appendTo(results)[0];

		// construct results list
		if(sections.length === 0) {
			$("<div>").text("No results").appendTo(list);
		} else {
			$(sections).each(function(i, section) {
				var label = section.label, 
					item = $('<div class="suggestions-result">').appendTo(list)[0];
				$('<a class="sq-val-update">+</a>').data("label", label).appendTo(item);
				var item = $('<a class="search-result-item">').attr("href", section.value).
					text(label).appendTo(item)[0];
				var escapedTerm = RegExp.escape($("<div />").text(term).html());
				label = label.replace(new RegExp("("+ escapedTerm + ")", "ig"), "<strong>$1</strong>");
				$(item).html(label);
			});

			// allow autocomplete via + button 
			$(".sq-val-update", results).click(function(ev) {
				var val = $(ev.target).data("label") + " ";
				$("#search").val(val).focus();
				opensearch.searchApi(val);
			});
		}
	},
	searchApi: function(term) {
		var limit = 5;
		term = encodeURIComponent(term);
		$.ajax({
			url: apiUrl,
			data: "action=opensearch&limit=' + limit + '&namespace=0&format=xml&search=" + term,
			dataType: "xml",
			success: function(doc) {
				var results = $("Item", doc).map(function(i, el) {
					return {
						label: $("Text", el).text(),
						value: $("Url", el).text()
					};
				});
				opensearch.writeResults(results);
			}
		});
	},
	init: function() {
		var timer = -1;
		// on a key up in the search box trigger a call to the api
		$("#search").keyup(function() {
			clearTimeout( timer );
			var term = this.value;
			if(term.length === 0) {
				$("#results").empty();
			} else {
				timer = setTimeout(function () {
					opensearch.searchApi( term );
					}, TYPING_DELAY);
			}
		});
		// hide search suggestions and results when trigger event outside search area
		// assumes standard event handler
		function hideResults(ev) {
			ev.stopPropagation();
			var selector = ".suggestion-result,.search-result-item,.suggestions-result,.sq-val-update";
			// note touchstart events can trigger on text nodes
			if(!$(ev.target).is(selector) && ev.target.nodeType !== 3) {
				$("#results").hide();
			}
		}
		$("#results,body").mousedown(hideResults).each(function(i, el) {
			el.ontouchstart = hideResults;
		});

		// when user starts a gesture revert to initial viewport
		var initial_viewport = $("meta[name='viewport']").attr("content");
		document.body.addEventListener("gesturestart", function() {
				$("meta[name='viewport']").attr("content", initial_viewport);
			}, false);

		function disableZoom() {
			$("meta[name='viewport']").
				attr("content", "width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0");
		}
		disableZoom();

		// on focusing turn into full-screen-search mode
		$("#search").focus(function() {
			// turn off full-screen-search mode
			function removeResults() {
				$("body").removeClass("full-screen-search");
			}

			$("body").addClass("full-screen-search");
			disableZoom();
			if(!$("#remove-results")[0]) {
				$('<a id="remove-results" />').attr("href", "#").
					mousedown(removeResults).text("remove").prependTo("#sq");
			}
		});
	}
};
opensearch.init();
