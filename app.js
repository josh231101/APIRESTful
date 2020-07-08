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

////////////////////////////////////////////////////////////////////////////////// REQUEST TARGETING ALL ARTICLES //////////////////////////
app.route("/articles")
    .get(function(req, res){
      Article.find(function(e,foundArticles){
        if(!e){
          res.send(foundArticles)
        }
        else{res.send(e)}
      })
    })
    .post(function(req,res){
      const article = new Article({
        title : req.body.title,
        content : req.body.content
      })
      //Once it is stored in the database we call the function and send and OK or not OK saved in the db
      article.save(function(e){
        if(!e){
          res.send("Successfully added!")
        }else{
          res.send("UPS! Something went wrong")
        }
      });
      console.log(req.body.title);
      console.log(req.body.content);
    })
    .delete(function(req,res){
      Article.deleteMany(function(e){
        if(!e){
          res.send("Successfully articles deleted")
        }else{res.send(e)}
      })
    })

/*BUILDING OUR RESTful API
HTTP ACTION: GET
app.get("/articles",)

HTTP ACTION: POST
app.post("/articles",)

//HTTP REQUEST: DELETE
app.delete("/articles",)*/

////////////////////////////////////////////////////////////////////////////////// REQUEST TARGETING A SPECIFIC ARTICLE//////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle},function(e,foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }else{
      res.send("No artciles matching that title was found.")

    }
  })
})
.put(function(req,res){
  //Replace a particular document inside our articles collection
  Article.update(
    //CONDITION
    {title : req.params.articleTitle},
    //UPDATE WE WANT TO MAKE
    {title : req.body.title, content: req.body.content},
    //CHANGE ALL THE DOCUMENT, if user doesn't send title or content they will be deleted
    {overwrite : true},
    function(err){
    if(!err){
      res.send("Succesfully updated article")
    }else{res.send("Something went wrong");}
  })

})
.patch(function(req,res){
  //If we dont want to overwrite everything.UPDATE and specif thing

  //req.body = { title : "TEST",content : "TEST"}
  //if no title looks like req.body = {content : "TEST"}

  Article.update(
    {title : req.params.articleTitle},
    //ONLY UPDATE THE VALUES COMING FROM THE req.body
    {$set : req.body},
    function(e){
      if(!e){res.send("UPDATED")}else{res.send("Something went wrong")}
    }
  )
})
.delete(function(req,res){
  Article.deleteOne({title : req.params.articleTitle},function(e){
    if(!e){
      res.send("DOCUMENT DELETED")
    }else{
      res.send("UPS! Soemthing went wrong")
    }
  })

});

app.listen(8080,function(){
  console.log("Page running of port 8080");
})
