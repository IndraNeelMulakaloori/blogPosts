//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

//Adding mongoDB
mongoose.connect("mongodb+srv://IndraNeel:Indraneel%40965@freecluster.x4ha2.mongodb.net/blogDb");

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
const homeStartingContent = "This is a home page";
const aboutContent = "This Blog Website is used to publish articles based on daily updates. Any User can publish posted on this website.";
const contactContent = "For more info Contact : xyz@gmail.com";


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

app.route("/compose")
.get(function(request,myServerResponse){
  myServerResponse.render('compose',{
  })})
.post(function(request,myServerResponse){
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

// app.post("/compose",

//Express Route Parameters - Dynamic Routing 
// :path - can be accesed in browser
app.get("/posts/:postId",function(request,myServerResponse)
{
      const reqpostId = request.params.postId;
  //Using Database
  Post.findOne({_id : reqpostId},function(err,result){
              if(err)
              {
                console.log(err);
                myServerResponse.render('error');
              }
               else {
               myServerResponse.render('post',{
                 postID : reqpostId,
                 postTitle : result.title,
                 postBody : result.content,
               });
              }
  });
});

// app.get("/search",function(request,myServerResponse)
// {
//              myServerResponse.render('search',{
                   
//              });
// });
//This route is used to search all the articles matching the word
app.post("/search",function(request,myServerResponse)
{
          const searchTerm = request.body.searchTerm;
          const reg = new RegExp(searchTerm,"i");
          Post.find({title : reg},function(err,result)
          {
                      if(err)
                      {
                        console.log(err);
                        myServerResponse.render('error');
                      }
                      else if(result != 0){
                          myServerResponse.render('search',{
                              postContent : result
                          });
                      }
                      else{
                        myServerResponse.render('error');
                      }
          });
});
//This route is to find the PostID in the DB and delete the Article 
app.post("/delete",function(request,myServerResponse)
{
           const postID = request.body.postId;

           Post.findByIdAndDelete(postID,function(err,result)
           {
                        if(err)
                        {
                          console.log(err);
                          myServerResponse.render('error');
                        }
           });
myServerResponse.redirect("/");

});
