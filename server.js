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
  name: Sequelize.STRING,
  bio: Sequelize.TEXT
  // 👆🏾👆🏾 the data types for each column/attribute 
  // is specified as Sequelize.[data_type] above
});

connection
  .sync({
    logging: console.log,
    force: true
  })
  .then(() => {
    // 👇🏾👇🏾 Inserting new data into db
    User.create({
      name: 'Kay',
      bio: 'Learning Sequelize'
    });
  })
  .then(() => console.log('Connection to db successful'))
  .catch(err => console.error('Unable to establish connection: ', err));

app.listen(port, () => console.log('app started!'));
