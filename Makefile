betadev: clean enhanced
	cd javascripts && ln -sf application.js beta_application.js
	cd javascripts && ln -sf opensearch.js beta_opensearch.js
	cd stylesheets && ln -sf common.css beta_common.css

setup: beta
	ln -s ../MobileFrontend/library

clean:
	rm -f javascripts/beta_application.js
	rm -f javascripts/beta_opensearch.js
	rm -f stylesheets/beta_common.css
	rm -f javascripts/jquery.localize.js
	rm -f javascripts/geo.js
	rm -f javascripts/preferences.js
	rm -rf leaflet

enhanced:
	curl -o javascripts/geo.js \
		https://raw.github.com/wikimedia/WikipediaMobile/master/assets/www/js/geo.js
	curl -o javascripts/jquery.localize.js \
		https://raw.github.com/wikimedia/WikipediaMobile/master/assets/www/js/jquery.localize.js
	curl -o javascripts/preferences.js \
		https://raw.github.com/wikimedia/WikipediaMobile/master/assets/www/js/preferences.js
	mkdir leaflet && \
		curl -o leaflet/leaflet.js \
			https://raw.github.com/wikimedia/WikipediaMobile/master/assets/www/leaflet/leaflet.js  && \
		curl -o leaflet/leaflet.css \
			https://raw.github.com/wikimedia/WikipediaMobile/master/assets/www/leaflet/leaflet.css

beta: clean enhanced
	curl -o javascripts/beta_opensearch.js \
		https://raw.github.com/jdlrobson/Experiments/betaversion/javascripts/opensearch.js
	curl -o javascripts/beta_application.js \
		https://raw.github.com/jdlrobson/Experiments/betaversion/javascripts/application.js
	curl -o stylesheets/beta_common.css \
		https://raw.github.com/jdlrobson/Experiments/betaversion/stylesheets/common.css
