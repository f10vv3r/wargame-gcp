FROM ubuntu:22.04

RUN apt update && \
    apt install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs

WORKDIR /wargame

COPY package.json package-lock.json ./
RUN npm install

COPY nginx.conf ./nginx.conf
COPY . .

EXPOSE 8000

CMD ["node", "src/app.js"]
