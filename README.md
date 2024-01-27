# opinionrateit-site
Created in May 2023 - by Rick Jones


## Description
This is a project that I am currently working that shows off some of my development skills that use 
frontend technologies such as `Vue 3, Pinia, HTML CSS / Tailwind CSS`. I am also using Amplify CLI to 
create the backend using Express which then communicates to a MongoDB through a VPC that was created in AWS.

## Technologies used
**Frontend:**
* Vue 3 
* Typescript 
* Pinia 
* HTML
* CSS


**Backend:** 
* Node
* Express
* MongoDB

## How to start your local development environment

To start the MongoDB you will need Docker to be installed on your machine:
* [Install Docker for Windows](https://docs.docker.com/desktop/install/windows-install/)
* [Install Docker for MacOS](https://docs.docker.com/desktop/install/mac-install/)

There is a `docker-compose.yml` file created within the project. This is where you can change the ports and set the database username and passwords.

Once that is installed then run the following command to start the local MongoDB:
```
docker-compose up -d
```

Run the following command to view the containers that are running:
```
docker-compose ps
```

Start the local backend Express app:
```
npm run backend:dev
```

Launch the frontend UI:
```
npm run dev
```

## Website
Website is in development and is located at: https://dev.opinionrateit.com/


