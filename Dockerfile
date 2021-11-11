# base image
FROM node:14-alpine

# create folder
RUN mkdir /app

# working directory
WORKDIR /app

# add binaries to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy app files and build
COPY . /app

# install dependencies
#--only=production
RUN npm install --force

# set port
ARG SERVER_PORT=5000
ENV SERVER_PORT=$SERVER_PORT
EXPOSE $SERVER_PORT

# define env
ENV NODE_ENV=production

# create build
#&& rm -rf .next/cache
RUN npm run build

# start app
CMD [ "npm", "start" ]