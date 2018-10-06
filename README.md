# virtual-outdoors-club
Description of project

# Requirments

[Python 3.5](https://www.python.org/downloads/release/python-352/)

[PostgreSQL 9.5](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

psycopg2 - [Windows binary](https://www.lfd.uci.edu/~gohlke/pythonlibs/#psycopg)

Django 2.1.1

# Installation

### Windows
- Install Python 3.5
- Add \python and \python\scripts to your system variables
- Ensure python and pip are properly installed:
  ```
  > Python -V
  > pip -V
  ```
- Run `pip install Django==2.1.1` to install Django
- Download the pre-built psycopg2 binary for python3.5
- Run `pip install psycopg2-2.7.5-cp35-cp35m-win_amd64.whl` for x64 systems
- Download PostgreSQL 9.5 for windows with the link above
- Follow [this guide](https://www.youtube.com/watch?v=_qUpvRTqK0Y) up to 4:20 to install PostgreSQL
  
  NOTE: Make sure to create a db called `outdoors_club_db`

- Clone this repository and run `manage.py runserver` to verify
