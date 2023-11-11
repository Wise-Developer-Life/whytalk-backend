# build stage
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the entire NestJS application to the container
COPY . .

# install nest-cli globally
RUN npm install -g @nestjs/cli

# install production dependencies
RUN npm install --production

# Install application dependencies using pnpm
RUN npm build

CMD [ "npm", "run", "start:prod" ]



