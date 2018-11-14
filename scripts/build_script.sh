source outdoorsclubenv/bin/activate
cd virtual-outdoors-club
git pull
git checkout master
git pull
kill $(lsof -t -i :4444)
kill $(lsof -t -i :8000)
kill $(lsof -t -i :8081)
python ./src/django/manage.py runserver 0.0.0.0:8000 &
python ./src/django/manage.py process_tasks &