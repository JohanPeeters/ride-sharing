all: build

build: src/* public/*
	sed -i "s|REPORT_URI_SUBDOMAIN_PLACEHOLDER|$(REPORT_URI_SUBDOMAIN)|" netlify.toml
	sed -i "s|REACT_APP_API_HOST_PLACEHOLDER|$(REACT_APP_API_HOST)|" netlify.toml
	sed -i "s|REACT_APP_HOTJAR_INLINE_SETUP_SRI_PLACEHOLDER|$(REACT_APP_HOTJAR_INLINE_SETUP_SRI)|" netlify.toml
	sed -i "s|AS_PLACEHOLDER|$(AS)|" netlify.toml
	npm run build
	for var in `env`; do echo $var >> build/static/js/.env; done
