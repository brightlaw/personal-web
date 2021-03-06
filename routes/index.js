var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

// use as a parameter to a function that needs authorization
var auth = jwt({
  secret: 'shhhhh',
  userProperty: 'payload'
});

var ctrlUser = require('./users');
var ctrlPost = require('./posts');

// for users
router.get('/signin', ctrlUser.signIn);
router.get('/user/:userId', ctrlUser.getUser);
router.get('/secretpage', auth, ctrlUser.profileRead);
router.post('/signup', ctrlUser.signUp);

// for posts
router.get('/posts', ctrlPost.getNumOfPosts);
router.get('/posts/paged/:page', ctrlPost.getPostsPaged);
router.get('/posts/:postId', ctrlPost.getPost);
router.put('/posts/:postId', ctrlPost.updatePost);
router.delete('/posts/:postId', ctrlPost.deletePost);
router.post('/posts', ctrlPost.createPost);

module.exports = router;
