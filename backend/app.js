const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://Saif001:by5Ky6p0PypzxFyE@cluster0-bzdu4.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connection to Database Established!')
  })
  .catch(() => {
    console.log('Connection to Database Failed!')
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false} ));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/posts',(req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: 'Post added succesfully'
  }); // Everything is OK : 201

});

app.get('/api/posts',(req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    });

});

module.exports = app;
