FROM node:14

COPY . /opt/apiproxy
WORKDIR /opt/apiproxy
RUN npm install --only=production


FROM node:14
COPY . /opt/apiproxy
COPY --from=0 /opt/apiproxy/node_modules /opt/apiproxy/node_modules
WORKDIR /opt/apiproxy
ENTRYPOINT node .
