# build stage
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the entire NestJS application to the container
COPY . .

# Install pnpm globally
RUN npm install -g pnpm

# install nest-cli globally
RUN npm install -g @nestjs/cli

# install production dependencies
RUN pnpm install --production

# Install application dependencies using pnpm
RUN pnpm build

CMD [ "pnpm", "run", "start:prod" ]



