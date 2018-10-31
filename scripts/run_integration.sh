j8
export DJANGO_HOST=http://127.0.0.1:8000/api
kill $(lsof -ti :4444)
kill $(lsof -ti :8000)
kill $(lsof -ti :8081)
npm run build
node server.js &
psql -c "DROP DATABASE outdoors_club_db" 
psql -c "CREATE DATABASE outdoors_club_db"
python ./src/django/manage.py migrate
python ./src/django/manage.py runserver &
./node_modules/.bin/selenium-standalone start &
sleep 5
./node_modules/.bin/wdio wdio.conf.js
