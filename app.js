const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let posts = [];

const app = express();

//Connecting to monfgoDB
const URI = "mongodb+srv://subashkarki68:lpGPJ9WHOzBsULZ2@cluster0.c3sr77b.mongodb.net/";
const dbName = "blog-DB";

mongoose.connect(URI + dbName);

//Mongoose Schemas
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

//Mongoose model
const Post = new mongoose.model('Post', postSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get('/', function (req, res) {

  Post.find({}, function (err, docs) {
    res.render('home', {
      homeContent: homeStartingContent,
      posts: docs
    });
  });

});

app.get('/about', function (req, res) {
  res.render('about', {
    aboutContent: aboutContent
  });
});

app.get('/contact', function (req, res) {
  res.render('contact', {
    contactContent: contactContent
  });
});

app.get('/compose', function (req, res) {
  res.render('compose', {});
});

app.get('/posts/:postID', function (req, res) {
  Post.findOne({_id: req.params.postID}, function(err, postFound){
    res.render('post', {
      postTitle: postFound.title,
      postBody: postFound.body
    });
  });
});

app.post('/compose', function (req, res) {
  const capitalizedTitle = _.capitalize(req.body.postTitle);
  const capitalizedBody = _.capitalize(req.body.postBody);
  const newPost = new Post({
    title: capitalizedTitle,
    body: capitalizedBody
  });
  newPost.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
});

app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});