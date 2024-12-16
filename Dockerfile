FROM ubuntu:22.04

RUN apt update && apt install -y \
    curl \
    apt-transport-https \
    ca-certificates \
    software-properties-common && \
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - && \
    add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" && \
    apt update && \
    apt install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-compose-plugin \
    nodejs \
    npm && \
    apt clean && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/libexec/docker/cli-plugins/docker-compose /usr/bin/docker-compose

WORKDIR /wargame

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "src/app.js"]
