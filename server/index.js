const express = require('express');
const bodyParser = require('body-parser');
const { build, port } = require('./config');
const { template } = require('./helpers');
const api = require('./api');

const app = express();

app.use(express.static(build));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const home = (req, res) => res.send(template());

app.use('/api', api);
app.get('*', home);

app.listen(port, () => console.log(`Listening on port ${port}`));
