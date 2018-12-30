all: build

.env:
	for

build: src/* public/*
	sed -i s/REPORT_URI_PLACEHOLDER/$REPORT_URI/g netlify.toml
	sed -i s/REPORTING_API_PLACEHOLDER/$REPORTING_API/g netlify.toml
	npm run build
	for var in `env`; do echo $var >> build/static/js/.env; done
