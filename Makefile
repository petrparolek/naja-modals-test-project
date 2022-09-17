.PHONY: install qa cs csf phpstan tests

install:
	composer install --no-interaction --no-progress --optimize-autoloader

qa: phpstan cs

cs:
	mkdir -p temp/phpcs
	vendor/bin/codesniffer app

csf:
	mkdir -p temp/phpcs
	vendor/bin/codefixer app

phpstan:
	vendor/bin/phpstan analyse -l 8 -c phpstan.neon app
