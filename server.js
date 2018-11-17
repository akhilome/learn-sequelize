const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 3000;

app.listen(port, () => console.log('app started!'));
