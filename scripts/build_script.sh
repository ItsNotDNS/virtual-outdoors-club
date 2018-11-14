source outdoorsclubenv/bin/activate
cd virtual-outdoors-club
eval "$(ssh-agent -s)"
ssh-add ../.ssh/deploy_rsa
git pull origin master
git checkout master
git pull origin master
pkill -f npm
pkill -f manage.py
pip install -r requirements.txt
python ./src/django/manage.py runserver 0.0.0.0:8000 &
python ./src/django/manage.py process_tasks &
node server.js &