FROM node:18

RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip

# install yt-dlp properly
RUN pip3 install -U yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
