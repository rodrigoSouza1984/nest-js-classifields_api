FROM node:latest As production

CMD ["mkdir", "/usr/app"]

WORKDIR /usr/app

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "start"]