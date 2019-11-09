const Post = require('../models/post');


exports.createPost = (req, res, next) => {
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
  }).catch(error => {
    res.status(500).json({
      message: 'Post creation failed!'
    });
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result =>{
    if (result.n > 0) {
      res.status(200).json({
        message: 'Post updated succesfully.'
      }); // Everything is OK : 201
    } else {
      res.status(401).json({
        message: 'Sorry! your post can not be updated due to non-authorization.'
      }); // Everything is OK : 201
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Coudn't update post due to technical error occured!."
    });
  });
};

exports.getPosts = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({
        message: "Coudn't fetched posts due to technical error occured!."
      });
    });

};

exports.getPost = (req, res, next) =>{
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Posts not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Coudn't fetched post due to technical error occured!."
    });
  });
};

exports.deletePost = (req, res, next) =>{
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
  }).catch(error => {
    res.status(500).json({
      message: "Coudn't delete the post due to technical error occured!."
    });
  });
}
