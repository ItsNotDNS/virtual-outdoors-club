source outdoorsclubenv/bin/activate
cd virtual-outdoors-club
kill $(lsof -ti :4444)
kill $(lsof -ti :8000)
kill $(lsof -ti :8081)
python ./src/django/manage.py runserver 0.0.0.0:8000 &
python ./src/django/manage.py process_tasks &