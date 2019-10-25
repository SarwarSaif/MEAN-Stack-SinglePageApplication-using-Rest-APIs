const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect(
  'mongodb+srv://Saif001:by5Ky6p0PypzxFyE@cluster0-bzdu4.mongodb.net/node-angular?retryWrites=true&w=majority',{useUnifiedTopology: true,  useNewUrlParser: true })
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
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post('/api/posts',(req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added succesfully',
      postId: createdPost._id
    }); // Everything is OK : 201
  });
});

app.put('/api/posts/:id',(req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result =>{
    res.status(200).json({
      message: 'Post updated succesfully'
    }); // Everything is OK : 201
  });
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

app.get('/api/posts/:id', (req, res, next) =>{
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Posts not found!'});
    }
  });
});

app.delete('/api/posts/:id', (req, res, next) =>{
  // Post.findByIdAndDelete({_id:req.params.id}).then(result =>{
  //   console.log(result);
  //   res.status(200).json({ message: 'Post deleted'});
  // });
  Post.deleteOne({_id:req.params.id}).then(result =>{
    console.log(result);
    res.status(200).json({ message: 'Post deleted'});
  });
});

module.exports = app;
