const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./model/post');

const app = express();

const postRoutes = require('./routes/posts');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/node-angular')
  .then(() => {
    console.log("Connection Established");
  })
  .catch(() =>{
    console.log("Connection Failed");
  })
/*app.use((req,res,next) =>{
  console.log('First middleware');
  next();
});*/
app.use(bodyParser.json())
app.use((req,res,next) =>{
  res.setHeader("Access-Control-Allow-Origin",
  "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin,X-Requested-With,Content-Type,Access");
  res.setHeader("Access-Control-Allow-Methods",
  "POST,GET,PATCH,PUT,DELETE");
  next();
})

app.post('/api/post',(req,res,next) =>{
  const post = new Post({
    title : req.body.title,
    content: req.body.content
  });
  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post Added Successfully",
      postId: createdPost._id
    })
  })

})

app.get('/api/post/:id', (req,res,next) => {
    Post.findById(req.params.id).then(post => {
      if(post){
        res.status(200).json(post);
      } else{
        res.status(404).json({message: 'Post Not Found!'});
      }
    })
});

app.put('/api/post/:id', (req,res,next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(post);
    res.status(200).json({message: 'Updated Successfully'});
  })

})

app.delete('/api/post/:id', (req,res,next) =>{

  Post.deleteOne({
    _id: req.params.id
  })
  .then(result => {
    console.log(req.params.id);
    res.status(201).json({
      message: "Post Deleted Successfully"
    })
  })
})


app.use('/api/post', (req,res,next) =>{
  /*postList = [
    {
      id: 'hiuj1234',
      title: "First Post",
      content: "Hi I\'m Joy Sharma"
    },
    {
      id: 'jkgh1235',
      title: "Second Post",
      content: "I am a data science enthusiastic"
    }
  ];*/

  Post.find()
    .then(documents => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: documents
      })
    });

    /*res.status(200).json({
      message: "Posts fetched successfully",
      posts: postList
    })*/
});

app.use("/api/post", postRoutes);

module.exports = app;
