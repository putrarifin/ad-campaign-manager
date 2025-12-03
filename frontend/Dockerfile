FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# mode dev, supaya hot reload (cukup buat belajar)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
