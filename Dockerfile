FROM ubuntu
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y git
RUN apt-get install -y npm
RUN apt-get install -y mongodb

RUN git clone https://github.com/Karamhaj1995/e-comm.git
RUN cd ./e-comm

RUN npm init
RUN npm install express
RUN npm install mongoose
RUN npm install jsonwebtoken
RUN npm install bcryptjs
RUN npm install mongoose-unique-validator
RUN npm install ejs

RUN service mongodb restart

ENTRYPOINT node server.js