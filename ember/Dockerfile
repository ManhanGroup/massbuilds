FROM node:16

# ember server on port 4200
# livereload server on port 7020 (changed in v2.17.0 from 49153)
# test server on port 7357
EXPOSE 4200 7020 7357
WORKDIR /ember

# run ember server on container start
CMD ["ember", "server"]

# install bower
RUN \
	npm install -g bower@1.8.8

# install ember-cli
RUN \
	npm install -g ember-cli@4.12.1

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY package.json .
COPY yarn.lock .
RUN yarn

# Copy all our app's directories
COPY . .