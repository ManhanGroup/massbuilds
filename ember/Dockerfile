FROM node:14

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

# set container bash prompt color to blue in order to 
# differentiate container terminal sessions from host 
# terminal sessions
RUN \
	echo 'PS1="\[\\e[0;94m\]${debian_chroot:+($debian_chroot)}\\u@\\h:\\w\\\\$\[\\e[m\] "' >> ~/.bashrc

# install ember-cli
RUN \
	npm install -g ember-cli@4.12.1

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH

WORKDIR $INSTALL_PATH

COPY package.json .
COPY yarn.lock .

RUN apt-get install python2

RUN yarn

# Copy all our app's directories
COPY . .