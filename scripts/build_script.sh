#!/bin/bash
ssh -i /tmp/key_outdoors.pem ubuntu@199.116.235.142 <<EOF
    source outdoorsclubenv/bin/activate
    cd virtual-outdoors-club
    pkill -f manage.py
    ssh-agent bash
    ssh-add ~/.ssh/deploy_rsa
    git checkout master
    git pull

    echo "before"
    python ./src/django/manage.py process_tasks &
    echo "after"
    python ./src/django/manage.py runserver 0.0.0.0:8000 &
EOF

# nohup python ./src/django/manage.py createworkers --wipe &
# sudo systemctl restart nginx
#     pip install -r requirements.txt
    # pkill -f npm
    # pkill -f node