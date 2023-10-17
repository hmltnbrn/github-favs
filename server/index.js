const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();

const routes = require('./routes');

app.use('/api', routes);

app.listen(3001, () => {
    console.log('Server is up on port', 3001);
});

module.exports = app;
