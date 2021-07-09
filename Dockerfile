FROM node:12.18-alpine
ENV NODE_ENV=production
ENV MONGO_URI="mongodb+srv://udit:test123@cluster0.lud1u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
ENV SECRET="secret"
ENV JWT_REFRESH_SECRET="refreshsecret"
ENV JWT_ACCESS_SECRET="accesssecret"
ENV REDIS_PORT="6379" 
ENV REDIS_HOST=127.0.0.1
ENV JWT_ACCESS_TIME=30m
ENV JWT_REFRESH_TIME=7d
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
