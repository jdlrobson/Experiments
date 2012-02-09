betadev:
	cd javascripts && ln -sf application.js beta_application.js
	cd javascripts && ln -sf opensearch.js beta_opensearch.js
	cd stylesheets && ln -sf common.css beta_common.css

setup:
	ln -s ../MobileFrontend/library

clean:
	rm -f javascripts/beta_application.js
	rm -f javascripts/beta_opensearch.js
	rm -f stylesheets/beta_common.css
