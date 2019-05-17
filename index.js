const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRoute = require('./routes/index.route');
const projectRoute = require('./routes/project.route');
const technologyRoute = require('./routes/technology.route');
const administratorRoute = require('./routes/administrator.route');

const header = require('./middlewares/header.middleware');
const error = require('./middlewares/error.middleware');

const app = express();

mongoose.connect(process.env.MONGODB_URL, { useCreateIndex: true, useNewUrlParser: true });
app.set('port', process.env.PORT || 3001);

app.all('/*', header.fixHttpCORS);
app.use('/', indexRoute);
app.use('/projects', projectRoute);
app.use('/technologies', technologyRoute);
app.use('/administrator', administratorRoute);
app.use(error.errorHandling);

app.listen(app.get('port'), () => {
  console.log(`The server is running under port ${app.get('port')}`);
});