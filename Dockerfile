FROM nginx:1.27-alpine

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY src/ /usr/share/nginx/html/
ENV BACKEND_URL=https://q1-order-api.greenpebble-52758d90.uaenorth.azurecontainerapps.io
ENV BACKEND_HOST=q1-order-api.greenpebble-52758d90.uaenorth.azurecontainerapps.io
EXPOSE 80
