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
  title: Sequelize.STRING,
  content: Sequelize.TEXT
});

const Comment = connection.define('Comment', {
  the_comment: Sequelize.STRING
});

const Project = connection.define('Project', {
  title: Sequelize.STRING
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

// Fetches single post with associated comments from the db
app.get('/singlepost', (req, res) => {
  Post.findById('1', {
    include: [{
      model: Comment, as: 'All_Comments',
      attributes: ['the_comment']
    }, {
      model: User
    }]
  }).then(post => {
    res.json(post);
  }).catch(err => console.error(err));
});

app.put('/addworker', (req, res) => {
  Project.findById(2)
    .then((project) => {
      project.addWorkers(5);
    })
    .then(() => {
      res.json({ message: 'User added!' });
    })
    .catch(err => console.error(err));
});

app.get('/userprojects', (req, res) => {
  User.findAll({
    attributes: ['name'],
    include: [{
      model: Project, as: 'Tasks',
      attributes: ['title']
    }]
  })
  .then(output => {
    res.json(output)
  })
  .catch(err => console.error(err));
});

//👇🏾👇🏾👇🏾 SQL Associations

// 👇🏾 One-to-One
Post.belongsTo(User, { foreignKey: 'UserId' }); // 👈🏾👈🏾 puts foreignKey UserId in the Posts table

// 👇🏾 One-to-Many
Post.hasMany(Comment, { as: 'All_Comments' }); // 👈🏾👈🏾 puts foreignKey PostId in Comment table

// 👇🏾 Many-to-Many
User.belongsToMany(Project, { as: 'Tasks', through: 'UserProjects' });
Project.belongsToMany(User, { as: 'Workers', through: 'UserProjects' });
// 👆🏾👆🏾 creates a UserProjects table with ids for ProjectId & UserId

connection
  .sync({
    // logging: console.log
    // force: true
  })
  // .then(() => {
  //   Project.create({
  //     title: 'project 1'
  //   }).then((project) => {
  //     project.setWorkers([4, 5]);
  //   })
  // })
  // .then(() => {
  //   Project.create({
  //     title: 'project 2'
  //   })
  // })
  // seed database
  // .then(() => {
  //   User.bulkCreate(_USERS)
  //     .then(() => console.log('success adding users'))
  //     .catch(err => console.error(err))
  // })
  // .then(() => {
  //   Post.create({
  //     UserId: 1, 
  //     title: 'First post',
  //     content: 'Post content 1'
  //   })
  // })
  // .then(() => {
  //   Post.create({
  //     UserId: 1, 
  //     title: 'Second post',
  //     content: 'Post content 2'
  //   })
  // })
  // .then(() => {
  //   Post.create({
  //     UserId: 2, 
  //     title: 'Third post',
  //     content: 'Post content 3'
  //   })
  // })
  // .then(() => {
  //   Comment.create({
  //     PostId : 1, 
  //     the_comment: 'First comment'
  //   })
  // })
  // .then(() => {
  //   Comment.create({
  //     PostId : 1, 
  //     the_comment: 'Second Comment'
  //   })
  // })
  .then(() => console.log('Connection to db successful'))
  .catch(err => console.error('Unable to establish connection: ', err));

app.listen(port, () => console.log('app started!'));
