#
# Ark explorer docker image
#
# http://github.com/ArkEcosystem/ark-explorer
#
FROM zenika/alpine-node:latest

COPY . /src/ark-explorer

RUN npm install -g yarn

RUN cd /src/ark-explorer \
 && yarn install 

WORKDIR /src/ark-explorer

ENV NETWORK mainnet

# Define the entrypoint script.
#ENTRYPOINT ["yarn","dev","--host","0.0.0.0","--env.network","$NETWORK"]
ENTRYPOINT ["./entrypoint.sh"]

# Expose ports.
EXPOSE 8080
