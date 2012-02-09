setup: beta
	ln -s ../MobileFrontend/library

clean:
	rm -f javascripts/beta_application.js
	rm -f javascripts/beta_opensearch.js
	rm -f stylesheets/beta_common.css

beta: clean
	curl -o javascripts/beta_opensearch.js \
		https://raw.github.com/jdlrobson/Experiments/betaversion/javascripts/opensearch.js
	curl -o javascripts/beta_application.js \
		https://raw.github.com/jdlrobson/Experiments/betaversion/javascripts/application.js
	curl -o stylesheets/beta_common.css \
		https://raw.github.com/jdlrobson/Experiments/betaversion/stylesheets/common.css

