#!/bin/bash
ssh -i /tmp/key_outdoors.pem ubuntu@199.116.235.142 <<EOF
    source outdoorsclubenv/bin/activate
    cd virtual-outdoors-club
    pkill -f manage.py
    ssh-agent bash
    ssh-add ~/.ssh/deploy_rsa
    git checkout master
    git pull
    exit 0
    pip install -r requirements.txt
    python ./src/django/manage.py createworkers --wipe
    python ./src/django/manage.py process_tasks &
    python ./src/django/manage.py runserver 0.0.0.0:8000 &
    sudo systemctl restart nginx
EOF

# nohup  &
# 
#     
    # pkill -f npm
    # pkill -f node