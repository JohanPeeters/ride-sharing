all: build

.env:
	for

build: src/* public/*
	npm run build
	for var in `env`; do echo $var >> build/static/js/.env; done
