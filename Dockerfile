FROM node:16.15 as base

RUN mkdir -p /aroma/app

COPY . /aroma/app

WORKDIR /aroma/app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "prod"]


