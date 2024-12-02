FROM node:16-alpine

WORKDIR /app/frontend/

COPY ./frontend/package*.json /app/frontend/
RUN npm install

COPY ./frontend /app/frontend/

CMD ["npm", "start"]
