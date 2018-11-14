source outdoorsclubenv/bin/activate
cd virtual-outdoors-club
eval "$(ssh-agent -s)"
echo "$SSH_AUTH_SOCK"
ssh-add ../.ssh/deploy_rsa
git pull origin master
git checkout master
git pull origin master
kill $(lsof -t -i :4444)
kill $(lsof -t -i :8000)
kill $(lsof -t -i :8081)
python ./src/django/manage.py runserver 0.0.0.0:8000 &
python ./src/django/manage.py process_tasks &