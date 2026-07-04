FROM node:18

RUN apt-get update && apt-get install -y ffmpeg yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
