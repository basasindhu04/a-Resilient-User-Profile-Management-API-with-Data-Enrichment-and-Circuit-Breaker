FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY app.js ./
EXPOSE 8081
CMD ["npm", "start"]
