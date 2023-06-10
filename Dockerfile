FROM node:16-slim as dev
RUN apt update
RUN apt install -y python3 build-essential git
RUN mkdir "app"
WORKDIR app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm i
CMD ["npm", "dev"]

FROM dev as build
COPY ./ .
RUN npm run build

FROM nginx:latest as prod
COPY --from=build /app/dist /www/
COPY ./etc/nginx.conf /etc/nginx/conf.d/default.conf
