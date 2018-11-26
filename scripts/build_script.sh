#!/bin/bash
ssh -i /tmp/key_outdoors.pem ubuntu@199.116.235.142 <<EOF
    source outdoorsclubenv/bin/activate
    cd virtual-outdoors-club
    eval "$(ssh-agent -s)"
    ssh-add ../.ssh/deploy_rsa
    git checkout ssh-encryption
    git pull
    ssh-agent -k
    pkill -f npm
    pkill -f node
    pkill -f manage.py
    rm -rf ./dist
    mkdir dist
    mv tmp/* dist
    rm -rf tmp
    pip install -r requirements.txt
    nohup python ./src/django/manage.py process_tasks &
    nohup node server.js &
    nohup python ./src/django/manage.py runserver 0.0.0.0:8000 &
    exit 0
EOF