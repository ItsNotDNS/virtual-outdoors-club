# virtual-outdoors-club
[![Build Status](https://travis-ci.com/cmput401-fall2018/virtual-outdoors-club.svg?token=D7BVdytPqFpYCfpFy5pz&branch=master)](https://travis-ci.com/cmput401-fall2018/virtual-outdoors-club)
# Setup

## React

#### Development
1. Ensure you have [Node (LTS)](https://nodejs.org/en/) installed.

2. Run `npm install`

3. Run `npm start` to start running a local server hosting the react changes

#### Testing

You can run `npm test` to start the test runner. It will report all passing/failing tests. You do not need to close Karma, as when you save the files it will automatically run again. This also runs a code-coverage check at the end of it, which requires every line of code to be tested at least once to not fail. 

`npm run-script lint` will scan for styling errors and keep the codebase consistent. The build will fail if this fails.

#### Deployment

Running `npm run-script build` will generate `dist/index.html` you can open the path to this file in your browser to see the results of what was built.

## Django

Django 2.1.1

### Installation

#### Windows
- Install [Python 3.5+](https://www.python.org/downloads/)
- [Add \python and \python\scripts to your system variables](https://www.java.com/en/download/help/path.xml)
- Ensure python and pip are properly installed:
  ```
  > Python -V
  > pip -V
  ```
- Run `pip install -r requirements.txt` to install all dependencies
- Download [PostgreSQL 9.5 for Windows](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- Follow [this guide](https://www.youtube.com/watch?v=_qUpvRTqK0Y) up to 4:20 to install PostgreSQL
  
  NOTE: Make sure to create a db called `outdoors_club_db`

- run `python manage.py runserver` to start the server locally and run `python manage.py process_tasks` to start the email worker.

#### Mac
 - Get [Homebrew](https://brew.sh/), if you haven't.
 - Instal Python3 `brew install python3` (This will most likely install Python 3.7, which should still be compatible with the project).
 - Install Django `pip3 install Django==2.1.2`
 - Install psycopyg2 `pip3 install psycopg2`  
 - Install PostgreSQL `brew install postgres`
   - You can run start it by running `postgres -D /usr/local/var/postgres`
   - Run ```createdb `outdoors_club_db` ```
   - Run `psql outdoors_club_db`
   - `CREATE USER postgres SUPERUSER;`
   - This will allow you to use pgAdmin4, and `manage.py`.
 - Install [pgAdmin4](https://www.pgadmin.org/download/pgadmin-4-macos/)
   - You should be able to add a new server, choose a name and the host is `127.0.0.1`
 - You should now be able to run `python3 src/django/manage.py runserver` and `python src/django/manage.py process_tasks`
 
### Testing

You can run `python3 manage.py test` to run the django unit tests and `coverage run --source='.' manage.py test api` to collect coverage data. Afterwords `coverage report` to see this data.

For testing the email worker locally run `python -m smtpd -n -c DebuggingServer localhost:1025`. This will intercept emails sent by the worker and display them in the console.

### Production Server in Cybera

Settings have been adjusted to handle incoming traffic to Cybera's server. You can now connect to Cybera's database (given persistence of the models in the master or production branch)

Configuration under the branch production_setup allows to connect to the PostgreSQL database. It does NOT connect to your local database. Use meaningful data if you want to add items.

## Steps

- Create the worker task
    
  ```python3 manage.py createworker```

- Ensure that the Django server is running in Cybera (this will be automated in the future)

  ```python3 manage.py runserver 0.0.0.0:8000```

  Note: If you would want to host on your own Cybera server and not the group server. You must add your IP from your own Cybera into the ```ALLOWED_HOSTS``` list that is found in ```django/outdoors_project/settings.py```

- Start the React server is running in Cybera (this will be automated in the future)

  ```npm start``` or ```npm run-script build```

  You may also run the React server locally. You can use the same commands above

- If you are running the React server in Cybera, you must access the UI through

  ```199.116.235.142:8081``` for the gear page
  
  ```199.116.235.142:8081/rent``` for the reservation page
  
  ```199.116.235.142:8000/api/process``` for Paypal functionality
  
  Note: You must open the port 8081 and 8000 or whatever port you choose that you want the server to be in. To do that, add the port into your security group in Cybera, IPv4 and IPv6.

- If you are running the React server locally, you can access it through either

  ```0.0.0.0:8081``` or ```127.0.0.1:8081``` or ```localhost:8081```

  Data shown is initially off of Cybera's server (noted above). To test with your local database,
navigate to ```config.js``` under ```src/config``` and change only the IP address to ```127.0.0.1```

# Self-installation for React in Cybera

Your Ubuntu will intially have no node or npm installed, you must install them if you wish to host your server from your local virtual server. Follow other guides to install all the requirements you need for Django as well.

- Ensure everything is up to date 

  ```sudo apt-get update```

- The following installation commands will install deprecated versions of npm and node(LTS) respectively. Do not use.

  ```sudo apt-get node```

  ```sudo apt-get install npm```

- Instead, we need to get them via package manager

  ```sudo apt-get install python-software-properties```

  ```wget -qO- https://deb.nodesource.com/setup_8.x | sudo -E bash -```

- Ensure that your versions are correct

  ```npm -v``` npm should be 6.4.1

  ```node -v``` node (LTS) should be 8.12.0

- Install all of the node dependencies

  ```npm install```

  If you do not install the required npm version, you will not be able to download the necessary dependencies

  Ensure everything else is setup such as PostgreSQL, Django, and the security groups for your ports (see above guide and notes)

- To run the Email worker in the background to allow automated emails to be sent out for reservations

  ```python3 manage.py createworker```
  
  ```python3 manage.py runserver 0.0.0.0:8000 &``` or ```nohup python3 manage.py runserver 0.0.0.0:8000 &```
  
  ```python3 manage.py process_tasks &```
  
# Project Structure

Besides all of the dependencies required and stored in the project, there are three main folders that navigates to the code base and designs that were created:

```/doc```

  This directory contains all of the images and diagrams that plans the structure of the project. This includes, component diagrams, sequence diagrams, class diagrams, logical models, UI navigation diagrams, wireframes, and story maps
  
```/src```

  This folder contains the backend and frontend codebases. Django is used as a backend framework and React is used as a frontend framework.
  
   ##### Django
   
   Django has their own file structure that must be followed. Inside ```/django``` there lies two folders. The folder ```/outdoors_project``` contains all of the settings that includes communication between different features such as CORS as well as network settings. ```/api``` contains all of the models, views, and urls used for the backend API for the server. It is also where all tests are stored for the backend.
   
   ##### React
   
   ```/js/react``` contains all of the UI components and forms that are seperated in groups (gear, reservation, etc.) These components interact with the Django backend to retrieve and input data by calling the service stored in ```/js/services```, where it contains the methods used to communicate to the backend. Connection to databases can be swapped with the configuartion file stored in ```/js/config```
    

```/test```

Everything related to testing for the frontend specfically are started within this folder. To reinforce the concepts and importance of testing, test coverage is required before pull requests are available to be merged.
