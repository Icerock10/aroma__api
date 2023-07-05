FROM node:16.15 as base

WORKDIR /aroma/app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY ./dist ./dist

EXPOSE 3000

CMD ["npm", "run", "prod"]