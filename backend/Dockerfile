# Use an official Node.js runtime as the base image
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 8080
CMD [ "npm", "run","start" ]