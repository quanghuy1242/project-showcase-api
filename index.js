const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRoute = require('./routes/index.route');
const projectRoute = require('./routes/project.route');

const app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

mongoose.connect(process.env.MONGODB_URL, { useCreateIndex: true, useNewUrlParser: true });
app.set('port', process.env.PORT || 3001);

app.use('/', indexRoute);
app.use('/projects', projectRoute);

app.listen(app.get('port'), () => {
  console.log(`The server is running under port ${app.get('port')}`);
});