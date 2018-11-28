#!/bin/bash
ssh -i /tmp/key_outdoors.pem ubuntu@199.116.235.142 <<EOF
    source outdoorsclubenv/bin/activate
    cd virtual-outdoors-club
    pkill -f manage.py
    ssh-agent bash
    ssh-add ~/.ssh/deploy_rsa
    git checkout master
    git pull
    pip install -r requirements.txt
    echo "before"
    nohup python ./src/django/manage.py process_tasks &
    echo "after"
    nohup python ./src/django/manage.py runserver 0.0.0.0:8000 &
EOF

# nohup python ./src/django/manage.py createworkers --wipe &
# sudo systemctl restart nginx
    # pkill -f npm
    # pkill -f node