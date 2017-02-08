const express = require('express'),
  path = require('path'),
  search = require('./search'),
  PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/search', search);

app.listen(PORT, () => console.info(`Server running on port ${PORT}`));

// In node-land, best practice would be to restart the server on exception.
process.addListener('uncaughtException', err => console.error('uncaughtException', err));
