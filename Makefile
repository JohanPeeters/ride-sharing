all: build

build: src/* public/*
	sed -i "s|REPORT_URI_PLACEHOLDER|$(REPORT_URI)|" netlify.toml
	sed -i "s|REPORTING_API_PLACEHOLDER|$(REPORTING_API)|" netlify.toml
	npm run build
	for var in `env`; do echo $var >> build/static/js/.env; done
