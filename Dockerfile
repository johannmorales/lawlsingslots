FROM node:20
WORKDIR /app
COPY . .
RUN npm run compile --workspace=packages/stream-logger
RUN npm run compile --workspace=packages/stream-types
RUN npm run compile --workspace=packages/kick
RUN npm install
CMD ["npm", "run","compile"]
