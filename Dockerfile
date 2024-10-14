FROM node:20
WORKDIR /app
COPY . .
RUN npm install -g tsx

RUN npm install --workspace=packages/stream-logger
RUN npm run compile --workspace=packages/stream-logger

RUN npm install --workspace=packages/stream-types
RUN npm run compile --workspace=packages/stream-types

RUN npm install --workspace=packages/kick
RUN npm run compile --workspace=packages/kick

CMD ["npm", "run","compile"]
