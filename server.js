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

const Post = connection.define('Post', {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  title: Sequelize.STRING,
  content: Sequelize.TEXT
});

// Fetches all users from the db
app.get('/findall', (req, res) => {
  User.findAll().then(users => {
    res.json(users);
  }).catch(err => console.error(err));
});

// Fetches all posts from the db
app.get('/allposts', (req, res) => {
  Post.findAll({
    include: [User]
  }).then(posts => {
    res.json(posts);
  }).catch(err => console.error(err));
});

// Make an SQL Association
Post.belongsTo(User, { foreignKey: 'UserId' }); // 👈🏾👈🏾 puts foreignKey UserId in the Posts table
 
connection
  .sync({
    // logging: console.log
  })
  // .then(() => {
  //   Post.create({
  //     UserId: 88, 
  //     title: 'First post',
  //     content: 'Post content 1'
  //   })
  // })
  // .then(() => {
  //   User.bulkCreate(_USERS)
  //     .then(users => console.log('success adding users'))
  //     .catch(err => console.error(err))
  // })
  .then(() => console.log('Connection to db successful'))
  .catch(err => console.error('Unable to establish connection: ', err));

app.listen(port, () => console.log('app started!'));
