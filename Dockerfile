FROM node:20
WORKDIR /app
COPY . .
RUN npm install
COPY . .
RUN  npm run compile --workspace=packages/stream-logger
RUN  npm run compile --workspace=packages/kick-chat
CMD ["npm", "run","compile"]
