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

### Requirements

[Python 3.5](https://www.python.org/downloads/release/python-352/)

[PostgreSQL 9.5](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

psycopg2 - [Windows binary](https://www.lfd.uci.edu/~gohlke/pythonlibs/#psycopg)

[Django 2.1.1](https://docs.djangoproject.com/en/2.1/topics/install/)

### Installation

#### Windows
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

#### Mac

