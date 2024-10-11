docker-compose down

rm -rf node_modules


rm package-lock.json

docker-compose build --no-cache

docker-compose up

docker system prune -a


docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up


### Amazon S3 deployment of our front end
https://cli.vuejs.org/guide/deployment.html#amazon-s3



    "baseUrl": "./",
    "baseUrl": "",


# errors

Error: ENOENT: no such file or directory, stat '/usr/src/frontend/dist/index.html'


"scripts": {
    // "serve": "vue-cli-service serve",
    "serve": "serve -s dist",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "build:serve": "vue-cli-service build && vue-cli-service serve"
  },


# What i did

Set a health check in docker compose so backend waits for frontend to be healthy and built

Changed filed path in backend to work with docker ( the dist files lol in res.sendFile)

819123aa6f45
   docker image tag rhel-httpd:latest registry-host:5000/myadmin/rhel-httpd:latest


100273c56eef
 docker container commit 100273c56eef dyrellumiwes/flashnote-info301:backend
 
docker image tag dyrellumiwes/flashnote-info301:backend dyrellumiwes/flashnote-info301/dyrellumiwes/flashnote-info301:backend

 docker image push dyrellumiwes/flashnote-info301/dyrellumiwes/flashnote-info301:backend
 


819123aa6f45
docker image tag flashnote-frontend:latest dyrellumiwes/flashnote-frontend:latest

 docker image push dyrellumiwes/flashnote-frontend:latest



docker container commit 100273c56eef dyrellumiwes/flashnote-info301:frontend
 
docker image tag dyrellumiwes/flashnote-info301:frontend dyrellumiwes/flashnote-info301/dyrellumiwes/flashnote-info301:frontend

 docker image push dyrellumiwes/flashnote-info301/dyrellumiwes/flashnote-info301:frontend
 