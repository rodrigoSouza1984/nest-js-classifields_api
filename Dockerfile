FROM node:latest As production

CMD ["mkdir", "/usr/app"]

WORKDIR /usr/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start"]