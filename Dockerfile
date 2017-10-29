FROM alpine

WORKDIR /usr/src/bot
COPY package.json ./

RUN apk update && apk upgrade
RUN apk add --no-cache --virtual .build-deps git build-base g++ \
	&& apk add --no-cache --virtual .npm-deps .npm-deps pango pangomm-dev pangomm \
	cairo-dev libjpeg-turbo-dev pango opus ffmpeg pixman

RUN npm i
RUN apk del .build-deps

COPY . .

CMD ["node", "inidex.js"]
