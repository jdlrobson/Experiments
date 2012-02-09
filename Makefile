betadev:
	cd javascripts && ln -sf application.js beta_application.js
	cd javascripts && ln -sf opensearch.js beta_opensearch.js
	cd stylesheets && ln -sf common.css beta_common.css

setup:
	ln -s ../MobileFrontend/library
