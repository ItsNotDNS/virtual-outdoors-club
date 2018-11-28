#!/bin/bash
ssh -i /tmp/key_outdoors.pem ubuntu@199.116.235.142 <<EOF
    source outdoorsclubenv/bin/activate
    cd virtual-outdoors-club
    git checkout master
    git pull
    pkill -f npm
    pkill -f node
    pkill -f manage.py
    pip install -r requirements.txt
    nohup python ./src/django/manage.py process_tasks &
    nohup python ./src/django/manage.py runserver 0.0.0.0:8000 &
    systemctl restart nginx
    exit 0
EOF

    # rm -rf ./dist
    # mkdir dist
    # mv tmp/* dist
    # rm -rf tmp