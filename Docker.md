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



