const express = require('express');
const Sequelize = require('sequelize');

const app = express();
const port = 3000;

const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false
});

connection
  .authenticate()
  .then(() => console.log('Connection to db successful'))
  .catch(err => console.error('Unable to establish connection: ', err));

app.listen(port, () => console.log('app started!'));
