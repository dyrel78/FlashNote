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

  