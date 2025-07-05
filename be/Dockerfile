FROM node:18-slim

WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 8000
CMD ["npm", "run", "start"]
