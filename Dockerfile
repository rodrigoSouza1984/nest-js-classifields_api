FROM node:latest As production

CMD ["mkdir", "/usr/app"]

WORKDIR /usr/app

COPY package*.json ./

RUN npm i --force

COPY . .

CMD ["npm", "run", "start"]