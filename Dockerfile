FROM node:15-buster

# Create app directory
WORKDIR /usr/src/app


# installffmeg
RUN apt-get update
RUN apt-get install ffmpeg -y

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "node", "bot.js" ]