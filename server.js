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

//=> This is a Model. 👇🏾👇🏾
const User = connection.define('User', {
  // Models are created using the 'define' method 
  // on the connection 👆🏾👆🏾
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    // 👇🏾👇🏾 Do some validation before sending data to db
    validate: {
      len: {
        args: [3],
        msg: 'Error: Name must be longer than 3 chars'
        // 👆🏾👆🏾 Custom error message to be sent if validation fails
      }
    }
  },
  bio: Sequelize.TEXT
  // 👆🏾👆🏾 the data types for each column/attribute 
  // is specified as Sequelize.[data_type] above
});

// 👇🏾👇🏾 Trigger a validation error 😠
app.get('/fail', (req, res) => {
  User.create({
    name: 'Ky',
    bio: 'Learning Sequelize kinda well 🤔'
  }).then(user => {
    res.json(user);
  }).catch(error => {
    console.error(error);
    res.status(404).json(error);
  });
});

// 👇🏾👇🏾 Trigger a successful insertion 🎊🕺🏾
app.get('/pass', (req, res) => {
  User.create({
    name: 'Kay',
    bio: 'Learning Sequelize very well 😀'
  }).then(user => {
    res.json(user);
  }).catch(error => {
    console.error(error);
    res.status(404).json(error);
  });
});

connection
  .sync({
    logging: console.log,
    force: true
  })
  // .then(() => {
  //   // 👇🏾👇🏾 Inserting new data into db
  //   User.create({
  //     name: 'Kay',
  //     bio: 'Learning Sequelize'
  //   });
  // })
  .then(() => console.log('Connection to db successful'))
  .catch(err => console.error('Unable to establish connection: ', err));

app.listen(port, () => console.log('app started!'));
