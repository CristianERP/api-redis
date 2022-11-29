FROM node:18
WORKDIR /home/app
COPY ./ .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]