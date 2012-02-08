var apiUrl = '/api.php';

if ( scriptPath ) {
	apiUrl = scriptPath + apiUrl;	
}

var TYPING_DELAY = 500;

var results = document.getElementById( 'results' );
var search = document.getElementById( 'search' );

// hide search suggestions and results when trigger event outside search area
// assumes standard event handler
function hideResults(ev) {
	ev.stopPropagation();
	var selector = ".suggestion-result,.search-result-item,.suggestions-result,.sq-val-update";
	if(!$(ev.target).is(selector)) {
		$("#results").hide();
	}
}
$("#results,body").mousedown(hideResults);
document.body.ontouchstart = hideResults;
results.ontouchstart = hideResults;

function searchApi(term) {
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
				}
			});
			writeResults(results);
		}
	});
}

$(document).ready(function () {
	var timer = -1;
	// on a key up in the search box trigger a call to the api
	$("#search").keyup(
		function() {
			clearTimeout( timer );
			var term = this.value;
			if(term.length === 0) {
				$(results).empty();
			} else {
				timer = setTimeout(function () {
					searchApi( term );
					}, TYPING_DELAY);
			}
		});
});

function sqValUpdate( sqValue ) {
	if ( search ) {
		search.value = sqValue + ' ';
		search.focus();
		searchApi( search.value );
	}
}

function htmlEntities( str ) {
    return String( str ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&#39;' );
}

function escapeJsString( str ) {
	return String( str ).replace( /\\/g, '\\\\' ).replace( /'/g, "\\'" ).replace( /\n/g, '\\n' );
}

function writeResults( sections ) {
	$(results).show().width($("#searchbox").width() - 2); // substract border left and right
	if ( !sections || sections.length < 1 ) {
		results.innerHTML = "No results";
	} else {		
		var html = '<div class="suggestions-results">';
		for ( i = 0; i < sections.length; i++ ) {
			var section = sections[i];
			var rel = i + 1;
			section.value = section.value.replace( /^(?:\/\/|[^\/]+)*\//, '/' );
			html = html + "<div class=\"suggestions-result\" rel=\"" + htmlEntities( rel ) + "\" title=\"" + htmlEntities( section.label ) + "\"><a class=\"sq-val-update\" href=\"javascript:sqValUpdate('" + htmlEntities( escapeJsString( section.label ) ) + "');\">+</a><a class=\"search-result-item\" href='" + htmlEntities( section.value ) + "'>" + htmlEntities( section.label ) + "</a></div>";
		}
		html = html + '</div>';
		results.innerHTML = html;
	}
}