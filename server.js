const express = require('express');
const Sequelize = require('sequelize');
const _USERS = require('./users.json');
const Op = Sequelize.Op;


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

// Fetches all users from the db
app.get('/findall', (req, res) => {
  User.findAll().then(users => {
    res.json(users);
  }).catch(err => console.error(err));
});

// Finds users by name
app.get('/findbyname/:name', (req, res) => {
  const { name } = req.params;
  User.findAll({
    where: { name }
  }).then(users => {
    res.json(users);
  }).catch(err => console.error(err));
});

// Finds users with provided initial
app.get('/findbyinitial/:initial', (req, res) => {
  const { initial } = req.params;
  User.findAll({
    where: { 
      name: {
        [Op.like]: `${initial}%` // 👈🏾👈🏾 using Operators & wildcards (see docs 👀)
      }
    }
  }).then(users => {
    res.json(users);
  }).catch(err => console.error(err));
});

// Finds user by id
app.get('/findbyid/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id).then(user => {
    res.json(user);
  }).catch(err => console.error(err));
});

// Updates a user's data
app.get('/update/:id', (req, res) => {
  // 👆🏾👆🏾 not ideal! ❌ 
  // should be PUT ❗❗❗
  // I'm just too lazy to open up Postman for proper testing 🤷🏾‍♂️
  const { name, password } = req.query;
  const { id } = req.params;
  User.update({
    name,
    password
  }, { where: { id } })
    .then(rows => {
      console.log(rows)
      res.redirect(`/findbyid/${id}`)
    })
    .catch(err => console.error(err));
});

// Deletes a user
app.get('/remove/:id', (req, res) => {
  // 👆🏾👆🏾 not ideal! ❌ 
  // should be DELETE ❗❗❗
  // I'm just too lazy to open up Postman for proper testing 🤷🏾‍♂️
  const { id } = req.params;
  User.destroy({
    where: { id }
  })
  .then(() => {
      res.redirect('/findall/')
    })
  .catch(err => console.error(err));
});

connection
  .sync({
    // logging: console.log
  })
  // .then(() => {
  //   User.bulkCreate(_USERS)
  //     .then(users => console.log('success adding users'))
  //     .catch(err => console.error(err))
  // })
  .then(() => console.log('Connection to db successful'))
  .catch(err => console.error('Unable to establish connection: ', err));

app.listen(port, () => console.log('app started!'));
