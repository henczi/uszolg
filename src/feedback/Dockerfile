FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install && npm install -g nodemon
EXPOSE 80
CMD ["nodemon", "index.js"]