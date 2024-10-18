FROM node:22


WORKDIR /usr/src/Frontend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
EXPOSE 3000
RUN chmod +x start.sh
CMD ["sh","start.sh"]
# CMD [start.sh]
# CMD [ "npm", "run", "build", "&&", "npm","run","serve" ]