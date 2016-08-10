var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// return all users
module.exports.getUsers = function(req, res, next) {
  console.log('server getUsers');

  User.find().sort('name').exec(function(error, result) {
    if(error) return next(error);
    res.json(result);
  });
};

// return an user
module.exports.getUser = function(req, res, next) {
  // mongoose.Types.ObjectId()

  // write this part as a TIL : req.params.xx
  // front end(Angular.js) sends as User.get({userId.xx});

  console.log('server getUser : ' + req.params.userId);

  // name doesn't appear on the front
  User.findById(req.params.userId, function(error, user) {
    if(error) return next(error);
    res.status(200).json(user);
  });
};

module.exports.profileRead = function(req, res, next) {
  console.log('server secretpage');

  // If no user ID exists in the JWT return a 401
  if (!req.payload._id) {
    console.log('unauthorized');

    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    // both ways work right

    User
      .findById(req.payload._id) // _id -> ObjectId? -> yes it is
      .exec(function(error, user) {
        if(error) return next(error);
        res.status(200).json(user);
      });
    // User.findOne({
    //   email: req.payload.email
    // }, function(error, user) {
    //   if(error) return next(error);
    //   res.json(user);
    // });
  }
};

module.exports.signIn = function(req, res, next) {
  // User.findOne({
  //   email: req.body.email // find a user by email address(unique as now)
  // }, function(error, user) {
  //   if(error) return next(error);
  //   res.json(user);
  // });

  console.log('server sign in');

  passport.authenticate('local', function(error, user, info){
    var token;

    // If Passport throws/catches an error
    if (error) {
      res.status(404).json(error);
      return;
    }

    // If a user is found
    // this user that is casted by passport.js
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

  // how this passport.authenticate() work? -> see api doc of passport module
};

module.exports.signUp = function(req, res, next) {
  // var user = new User({ // previous way
  //   email: req.body.email,
  //   password: encryptPassword(req.body.password)
  // });

  console.log('server sign up');

  var user = new User(); // new way
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  user.save(function(error, user) {
    if(error) return next(error);
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token" : token
    });
  });
};

// module.exports.userModify = function(req, res, next) {
//   // 다음 행을 제거하면 몽구스가 오류를 던진다
//   // 몽고DB ID를 갱신하려 시도하기 때문이다
//   delete req.body._id;
//
//   User.update({
//     id: req.params.userId
//   }, req.body, function(error, numberAffected, response) {
//     if (error || !results) {
//       return next(error);
//     }
//     res.send(response);
//   });
// };
