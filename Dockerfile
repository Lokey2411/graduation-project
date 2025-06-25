FROM node:21

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules && npm install --build-from-source
COPY files/sample.txt /app/storage/uploaded_documents/sample.txt
COPY . .

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]