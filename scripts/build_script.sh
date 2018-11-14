ssh -i /tmp/key_outdoors.pem ubuntu@199.116.235.142 'bash -s && exit' << ENDHERE
    source outdoorsclubenv/bin/activate
    cd virtual-outdoors-club
    eval "$(ssh-agent -s)"
    ssh-add ../.ssh/deploy_rsa
    git checkout master
    git pull
    pkill -f npm
    pkill -f node
    pkill -f manage.py
    rm -rf ./dist
    mkdir dist
    mv tmp dist
    rm -rf tmp
    pip install -r requirements.txt
    python ./src/django/manage.py runserver 0.0.0.0:8000 &
    python ./src/django/manage.py process_tasks &
    node server.js &
ENDHERE