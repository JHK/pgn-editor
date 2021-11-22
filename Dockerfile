FROM node:17 as builder

WORKDIR /build

# Load dependencies
ADD package*.json /build
RUN npm install

# Build frontend
ADD . /build
RUN npm run build -- --mode production

FROM nginx:stable
COPY --from=builder /build/dist/* /usr/share/nginx/html

ARG NGINX_ENTRYPOINT_QUIET_LOGS=1
