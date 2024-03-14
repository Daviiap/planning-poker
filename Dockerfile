FROM node:20.9.0-alpine

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "start" ]
