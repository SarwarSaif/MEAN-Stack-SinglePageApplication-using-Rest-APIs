const express = require('express');
const multer = require('multer'); // To Export file

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  // executed when multer tries to save a file if detecte
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images'); // This path is related to the server.js file
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  '',
  checkAuth,
  multer({storage: storage}).single('image'),(req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added succesfully',
      post: {
        // Next Gen JavaScript method instead of the commented lines
        ...createdPost, // Create object with all the properties of createdPost
        id: createdPost._id
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      }
    }); // Everything is OK : 201
  });
});

router.put(
'/:id',
checkAuth,
multer({storage: storage}).single('image'),
(req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result =>{
    if (result.nModified > 0) {
      res.status(200).json({
        message: 'Post updated succesfully.'
      }); // Everything is OK : 201
    } else {
      res.status(401).json({
        message: 'Sorry! your post can not be updated due to non-authorization.'
      }); // Everything is OK : 201
    }
  });
});

router.get('',(req, res, next) => {
  const pageSize = +req.query.pagesize; // Add '+' in front of queries to convert the strings into numeric
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1)) //Skip the number of posts depending on page number
      .limit(pageSize); // and limit the next posts
  }
  postQuery.then(documents => { // chained queries
    fetchedPosts = documents;
      return Post.count();
    }).then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    });

});

router.get('/:id', (req, res, next) =>{
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Posts not found!'});
    }
  });
});

router.delete(
'/:id',
checkAuth, (req, res, next) =>{
  // Post.findByIdAndDelete({_id:req.params.id}).then(result =>{
  //   console.log(result);
  //   res.status(200).json({ message: 'Post deleted'});
  // });
  Post.deleteOne({_id:req.params.id, creator: req.userData.userId}).then(result =>{
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({
        message: 'Post deleted succesfully.'
      }); // Everything is OK : 201
    } else {
      res.status(401).json({
        message: 'Sorry! your post can not be deleted due to non-authorization.'
      }); // Everything is OK : 201
    }
  });
});

module.exports = router;
