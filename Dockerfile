FROM node:20
WORKDIR /app
COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_SKIP_FIREFOX_DOWNLOAD false

RUN npm install -g tsx

RUN npm install --workspace=packages/stream-logger
RUN npm run compile --workspace=packages/stream-logger

RUN npm install --workspace=packages/stream-types
RUN npm run compile --workspace=packages/stream-types

RUN npm install --workspace=packages/kick
RUN npm run compile --workspace=packages/kick

RUN npm install --workspace=discord/kicksubbot

CMD ["npm", "run","compile"]
