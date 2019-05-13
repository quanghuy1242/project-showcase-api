const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRoute = require('./routes/index.route')

const app = express();

mongoose.connect(process.env.MONGODB_URL, { useCreateIndex: true, useNewUrlParser: true });
app.set('port', process.env.PORT || 3001);

app.use('/', indexRoute);

app.listen(app.get('port'), () => {
  console.log(`The server is running under port ${app.get('port')}`)
});