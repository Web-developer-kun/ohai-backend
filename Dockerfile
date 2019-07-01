FROM node:10.15.3-jessie

WORKDIR /usr/src/ohai-backend

COPY package.json /usr/src/ohai-backend

RUN npm install

CMD ["/bin/bash"]
