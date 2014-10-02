list:
	@echo "update"
	@echo "upgrade"
	@echo "rollback"
	@echo "clear-all"
	@echo "flush-memcache"
	@echo "sendmail"
	@echo "test"
	@echo "git-pull"
	@echo "git-push"
	@echo "install-dev"
	@echo "install"
	@echo "publish"

test:
	phpunit --bootstrap ./tests/Bootstrap.php ./tests

git-pull:
	git pull

git-push:
	git push -u

rollback:
	git reset --hard HEAD~1

clear-all:
	rm config/_*
	rm cache/api/*
	rm cache/global/*
	rm cache/html/*
	rm cache/model/*
	rm cache/schema/*
	rm cache/view/*

flush-memcache:
	./console.php  wscn _current cache:flushMemcache

sendmail:
	php workers/sendmail.php

upgrade:
	git pull
	composer update --optimize-autoloader --prefer-dist
	git submodule update --init --recursive
	grunt less:wscn
	bower update  --allow-root
	cnpm update

update:
	git pull
	git submodule update --init --recursive
	grunt less:wscn
	rm config/_*
	chmod +x ./utilities/*

install-dev:
	composer install --dev
	git submodule update --init --recursive
	sudo chown -R www-data.www-data ./config
	sudo chown -R www-data.www-data ./logs
	sudo chown -R www-data.www-data ./cache
	sudo chown -R www-data.www-data ./public/uploads
	sudo chown -R www-data.www-data ./public/cache
	sudo chown -R www-data.www-data ./public/tmp
	sudo chown -R www-data.www-data ./public/thumbnails/thumb
	cnpm install
	grunt less:wscn
	bower install  --allow-root

install:
	composer install --prefer-dist
	git submodule update --init --recursive
	sudo chown -R www-data.www-data ./config
	sudo chown -R www-data.www-data ./logs
	sudo chown -R www-data.www-data ./cache
	sudo chown -R www-data.www-data ./public/uploads
	sudo chown -R www-data.www-data ./public/cache
	sudo chown -R www-data.www-data ./public/tmp
	sudo chown -R www-data.www-data ./public/thumbnails/thumb
	cnpm install
	grunt less:wscn
	bower install  --allow-root
	chmod +x ./utilities/*

publish:
	ssh root@Rebirth_Web1 "rsync -av  --delete --exclude 'logs' --exclude 'public/uploads'  --exclude 'public/thumbnails/thumb'  -e  'ssh -l root -i /root/.ssh/id_rsa' Rebirth_File:/opt/htdocs/wallstreetcn /opt/htdocs && chown -R www-data.www-data /opt/htdocs/wallstreetcn"
	ssh root@Rebirth_Web2 "rsync -av  --delete --exclude 'logs' --exclude 'public/uploads'  --exclude 'public/thumbnails/thumb'  -e  'ssh -l root -i /root/.ssh/id_rsa' Rebirth_File:/opt/htdocs/wallstreetcn /opt/htdocs && chown -R www-data.www-data /opt/htdocs/wallstreetcn"