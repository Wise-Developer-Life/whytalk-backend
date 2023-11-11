# build stage
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

RUN npm install -g @nestjs/cli

CMD ["sh", "-c", "npm install && npm run start:dev"]




