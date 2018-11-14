#!/bin/bash
source outdoorsclubenv/bin/activate
cd virtual-outdoors-club
pkill -f agent
eval "$(ssh-agent -s)"
ssh-add ../.ssh/deploy_rsa
git checkout ssh-encryption
git pull
pkill -f npm
pkill -f node
pkill -f manage.py
rm -rf ./dist
mkdir dist
mv tmp/* dist
rm -rf tmp
pip install -r requirements.txt
nohup node server.js &
python ./src/django/manage.py process_tasks &
python ./src/django/manage.py runserver 0.0.0.0:8000 &
exit
