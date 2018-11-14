echo $(ssh-add -l)
echo "$(ssh-add -l)"
scp README.md ubuntu@199.116.235.142:/home/ubuntu
echo "$(cat README.md)"
echo $(cat /tmp/key_outdoors)
echo "$(cat /tmp/key_outdoors)"
ssh -i /tmp/key_outdoors ubuntu@199.116.235.142
kill $(lsof -ti :4444)
kill $(lsof -ti :8000)
kill $(lsof -ti :8081)
nohup python src/django/manage.py runserver 0.0.0.0:8000 &
python src/django/manage.py process_tasks &