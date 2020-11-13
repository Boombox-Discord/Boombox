FROM node:15-buster

# Create app directory
WORKDIR /usr/src/app

#set ENV variables
ENV prefix="!"
ENV token="Bot token"
ENV youtubeAPI="youtubeAPIKey"
ENV inviteLink="https://discord.com/api/oauth2/authorize?client_id=678819994250772480&permissions=36785152&scope=bot"
ENV statsdURL="graphite"
ENV statsdPort="8125"
ENV geniusAPIKey="geniusAPIKey"
ENV errorChannel="Your error channel ID"

# installffmeg
RUN apt-get update && apt-get install ffmpeg --no-install-recommends -y \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

RUN echo ""

# Bundle app source
COPY . .

CMD [ "node", "bot.js" ]