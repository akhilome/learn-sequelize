const express = require('express');
const Sequelize = require('sequelize');
const _USERS = require('./users.json');


const app = express();
const port = 3000;

const connection = new Sequelize('db', 'user', 'pass', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'db.sqlite',
  operatorsAliases: false
});

const User = connection.define('User', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      isAlphanumeric: true
    }
  }
});

// For personal use only 👀
app.get('/users', (req, res) => {
  User.findAll().then(users => {
    res.json(users);
  }).catch(err => console.error(err));
})

connection
  .sync({
    // logging: console.log
  })
  .then(() => {
    User.bulkCreate(_USERS)
      .then(users => console.log('success adding users'))
      .catch(err => console.error(err))
  })
  .then(() => console.log('Connection to db successful'))
  .catch(err => console.error('Unable to establish connection: ', err));

app.listen(port, () => console.log('app started!'));
