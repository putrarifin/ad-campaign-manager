FROM node:20-alpine

# buat folder kerja
WORKDIR /usr/src/app

# copy package dulu biar layer cache
COPY package*.json ./

RUN npm install

# copy source code
COPY . .

# env default
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "run", "start"]
