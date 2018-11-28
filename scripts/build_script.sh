#!/bin/bash
ssh -i /tmp/key_outdoors.pem ubuntu@199.116.235.142 <<EOF
    source outdoorsclubenv/bin/activate
    cd virtual-outdoors-club
    eval "$(ssh-agent)"
    ssh-add ~/.ssh/deploy_rsa
    git checkout master
    git pull
    pkill -f manage.py
    pip install -r requirements.txt
    python ./src/django/manage.py process_tasks &
    python ./src/django/manage.py runserver 0.0.0.0:8000 &
    sudo systemctl restart nginx
    exit 0
EOF

# python ./src/django/manage.py createworkers --wipe &
    # pkill -f npm
    # pkill -f node