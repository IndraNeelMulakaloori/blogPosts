//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

//Adding mongoDB
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');


const port = 3000;

//Pushing the post objects into the posts
// let posts = [];

//Creating postSchema And Creating a Model from it
const postSchema = {
title : String,
content : String,
};

const Post = mongoose.model('Post',postSchema);

//Generic URL's
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.listen(process.env.PORT || port , function () {

  console.log("Server started on port 3000");

});

app.get("/", function (request, myServerResponse) {
  //Changed from Array storage to DBStorage
  Post.find({},function(err,result)
  {
             if(err)
             console.log(err);
             else 
             myServerResponse.render('home',{
               homeContent : homeStartingContent,
               postContent : result,
             });
  });


});

app.get("/about",function(request,myServerResponse){
       myServerResponse.render('about',{
                  aboutContent : aboutContent,
       });
});

app.get("/contact",function(request,myServerResponse){
  myServerResponse.render('contact',{
             contactContent : contactContent,
  });
});

app.get("/compose",function(request,myServerResponse){
    myServerResponse.render('compose',{

    });
});

app.post("/compose",function(request,myServerResponse){
 //Find A post which matches the title
 //If it doesn't match,Create a new Post
 //i.e to avoid duplicate posts
Post.find({title : request.body.postTitle},function(err,result)
{
           if(err)
           console.log(err);
           else if(result.length == 0)
           {
            const newPost = new Post({
              title : request.body.postTitle,
              content : request.body.postBody,
            });
            newPost.save();
           }
});
  //Requesting the title and content and saving in the document of MongoDb
  
  myServerResponse.redirect("/");
});

//Express Route Parameters - Dynamic Routing 
// :path - can be accesed in browser
app.get("/posts/:postName",function(request,myServerResponse)
{
      let postName = _.lowerCase(request.params.postName);
  console.log(postName);
  //Using array.protoype.some method to filter out the postTitle
  posts.forEach(function(post) {
  
           if(_.lowerCase(post.title) == postName)
           {
          console.log("match found");
          myServerResponse.render('post',{
                 postTitle : post.title,
                 postBody : post.body,
          });
        }

  });

      // if(flag)
      // console.log("match found");

      // else
      // console.log("Match not found");

});