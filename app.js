const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')

const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser : true})

const articleSchema = mongoose.Schema({
  title : String,
  content : String
})
const Article = mongoose.model("Article",articleSchema)

//BUILDING OUR RESTful API
//HTTP ACTION: GET
app.get("/articles",function(req, res){
  Article.find(function(e,foundArticles){
    if(!e){
      console.log(foundArticles);
      res.send(foundArticles)
    }
    else{res.send(e)}
  })
})

//HTTP ACTION: POST
app.post("/articles",function(req,res){
  const article = new Article({
    title : req.body.title,
    content : req.body.content
  })
  //Once it is stored in the database we call the function and send and OK or not OK saved in the db
  article.save(function(e){
    if(!e){
      res.send("Successfully added!")
    }else{
      res.send("UPS! Somethin went wrong")
    }
  });
  console.log(req.body.title);
  console.log(req.body.content);
})

//HTTP REQUEST: DELETE
app.delete("/articles",function(req,res){
  Article.deleteMany(function(e){
    if(!e){
      res.send("Successfully articles deleted")
    }else{res.send(e)}
  })
})

app.listen(8080,function(){
  console.log("Page running of port 8080");
})
