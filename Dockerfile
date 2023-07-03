FROM node:18

#create app dir
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install


# Bundle app source
COPY . .

EXPOSE 3000

ENV SALT_WORK_FACTOR=10
ENV JWT_SECRET=samplesecret
ENV MONGO_URL=mongodb:27017
ENV MONGO_DATABASE_NAME=busTicketing
ENV SERVER_PORT=3000
ENV JWT_EXPIRY_MINUTES=3600


CMD [ "node", "index.js" ]