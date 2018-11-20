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
  first: Sequelize.STRING,
  last: Sequelize.STRING,
  full_name: {
    type: Sequelize.STRING,
    // 👇🏾👇🏾 Do some validation before sending data to db
    validate: {
      len: {
        args: [7],
        msg: 'Error: Full Name must be longer than 7 chars'
        // 👆🏾👆🏾 Custom error message to be sent if validation fails
      }
    },
    allowNull: false // 👈🏾👈🏾 full_name cannot be null!
  },
  bio: Sequelize.TEXT
  // 👆🏾👆🏾 the data types for each column/attribute 
  // is specified as Sequelize.[data_type] above
}, {
  // 👇🏾👇🏾 Look, ma. Hooks! ↩️
  hooks: {
    beforeValidate: (user) => {
      user.full_name = `${user.first} ${user.last}`
    }
    // 👆🏾👆🏾 This runs before validation is done on the 
    // provided data.
  }
});

// 👇🏾👇🏾 Trigger a validation error 😠
app.get('/fail', (req, res) => {
  User.create({
    first: 'Ki',
    last: 'Zi',
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
    first: 'Kay',
    last: 'Erons',
    bio: 'Learning Sequelize very well 😀'
  }).then(user => {
    res.json(user);
  }).catch(error => {
    console.error(error);
    res.status(404).json(error);
  });
});

app.get('/users', (req, res) => {
  User.findAll().then(users => {
    res.json(users);
  }).catch(err => console.error(err));
})

connection
  .sync({
    logging: console.log,
    force: true // 👈🏾👈🏾 purges db each time connection is initiated
  })
  .then(() => {
    // 👇🏾👇🏾 Inserting new data into db
    // User.create({
    //   first: 'Kay',
    //   last: 'Erons',
    //   bio: 'Learning Sequelize'
    // });
  })
  .then(() => console.log('Connection to db successful'))
  .catch(err => console.error('Unable to establish connection: ', err));

app.listen(port, () => console.log('app started!'));


/* 📓📓📓 Notes: 
  => Sequelize Hooks: do somethings before/after certain events,
    some examples ...
    -> beforeValidate: () => { }
    -> afterValidate: () => { }
    -> beforeCreate: () => { }
    -> afterCreate: () => { }
    -> want more 🤔? see the docs! 😜
*/