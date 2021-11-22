# Base
FROM node:14-alpine

# Update npm
RUN npm install -g npm@7

# Working directory
WORKDIR /app

# Working directory
WORKDIR /app

# Copy app files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force

# Node env
ENV NODE_ENV production

# Define port
ARG NEXT_PUBLIC_PORT
ENV NEXT_PUBLIC_PORT=$NEXT_PUBLIC_PORT
EXPOSE $NEXT_PUBLIC_PORT

# Define domain
ARG NEXT_PUBLIC_DOMAIN
ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN

# Define config
ARG NEXT_PUBLIC_CONFIG
ENV NEXT_PUBLIC_CONFIG=$NEXT_PUBLIC_CONFIG

# Copy app files
COPY . .

# Create build
RUN npm run build

# Run
CMD [ "npm" , "start" ]
