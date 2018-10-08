# virtual-outdoors-club

# Setup

## React

#### Development
1. Ensure you have [Node (LTS)](https://nodejs.org/en/) installed.

2. Run `npm install`

3. Run `npm start` to start running a local server hosting the react changes

#### Testing

You can run `npm test` to start the test runner. It will report all passing/failing tests. You do not need to close Karma, as when you save the files it will automatically run again.

#### Deployment

Running `npm run-script build` will generate `dist/index.html` you can open the path to this file in your browser to see the results of what was built.

## Django

Django 2.1.1

### Installation

#### Windows
- Install [Python 3.5](https://www.python.org/downloads/release/python-352/)
- [Add \python and \python\scripts to your system variables](https://www.java.com/en/download/help/path.xml)
- Ensure python and pip are properly installed:
  ```
  > Python -V
  > pip -V
  ```
- Run `pip install Django==2.1.2` to install Django
- Download the pre-built psycopg2 [Windows binary](https://www.lfd.uci.edu/~gohlke/pythonlibs/#psycopg) for python3.5
- Run `pip install psycopg2-2.7.5-cp35-cp35m-win_amd64.whl` for x64 systems
- Download [PostgreSQL 9.5 for Windows](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- Follow [this guide](https://www.youtube.com/watch?v=_qUpvRTqK0Y) up to 4:20 to install PostgreSQL
  
  NOTE: Make sure to create a db called `outdoors_club_db`

- run `manage.py runserver` to ...

#### Mac
 - Get [Homebrew](https://brew.sh/), if you haven't.
 - Instal Python3 `brew install python3` (This will most likely install Python 3.7, which should still be compatible with the project).
 - Install Django `pip3 install Django==2.1.2`
 - Install psycopyg2 `pip3 install psycopyg`
 - Install PostgreSQL `brew install postgres`
   - You can run start it by running `postgres -D /usr/local/var/postgres`
   - Run ```createdb `outdoors_club_db` ```
   - Run `psql outdoors_club_db`
   - `CREATE USER postgres SUPERUSER;`
   - This will allow you to use pgAdmin4, and `manage.py`.
 - Install [pgAdmin4](https://www.pgadmin.org/download/pgadmin-4-macos/)
   - You should be able to add a new server, choose a name and the host is `127.0.0.1`
 - You should now be able to run `python3 src/django/manage.py runserver`

