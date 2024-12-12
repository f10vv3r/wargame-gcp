FROM node:20

ENV USER baby
ENV PORT 8080

RUN adduser --disabled-password $USER

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

USER $USER
EXPOSE $PORT

CMD ["node", "app.js"]