FROM node:lts-alpine
WORKDIR /app
COPY ./client .
RUN npm install
EXPOSE 80
CMD ["npm", "run", "serve", "--", "--port", "80"]
