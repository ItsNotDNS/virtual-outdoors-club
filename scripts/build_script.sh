#!/bin/bash
ssh -i /tmp/key_outdoors.pem ubuntu@199.116.235.142 <<EOF
    ssh-agent bash
    ssh-add ~/.ssh/deploy_rsa
    source outdoorsclubenv/bin/activate
    cd virtual-outdoors-club
    pkill -f runserver
    pkill -f process_tasks
    git checkout master
    git pull
    pip3 install -r requirements.txt
    python3 ./src/django/manage.py createworkers --wipe
    python3 ./src/django/manage.py process_tasks &
    python3 ./src/django/manage.py runserver 0.0.0.0:8000 &
    sudo systemctl restart nginx
    exit
EOF

# nohup  &
# 
#     
    # pkill -f npm
    # pkill -f node