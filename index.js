const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const indexRoute = require('./routes/index.route');
const projectRoute = require('./routes/project.route');
const technologyRoute = require('./routes/technology.route');
const administratorRoute = require('./routes/administrator.route');
const authRoute = require('./routes/auth.route');

const error = require('./middlewares/error.middleware');

const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useCreateIndex: true, 
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());
app.use(cookieParser(process.env.SECRET_COOKIE));

app.use(cors((req, callback) => {
  const whitelist = process.env.ALLOW_ORIGIN.split(';');
  const clientAPIKey = req.header('CLIENT-KEY');
  callback(null, {
    origin: (origin, callback) => {
      if (whitelist.includes(origin) || clientAPIKey === process.env.CLIENT_KEY) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true
  });
}));

app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/projects', projectRoute);
app.use('/technologies', technologyRoute);
app.use('/administrator', administratorRoute);
app.use(error.errorHandling);

app.listen(app.get('port'), () => {
  console.log(`The server is running under port ${app.get('port')}`);
});