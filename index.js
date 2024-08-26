const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const multer  = require('multer')
const fs =  require('fs')
const upload = multer({ dest: './public/image/' })

const { v4: uuidv4 } = require('uuid');

var methodOverride = require('method-override')
 
app.use(methodOverride('_method'));

app.listen(port, () => {
    console.log(`listening on port ${port}`); 
})


app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
    {
        id: uuidv4() ,
        username: "Ankit Singh",
        content: "I love Coding",
    },
    {
        id:uuidv4() ,
        username: "Aman Sharma ",
        content: "Love to Travel",
    },
    {
        id:uuidv4() ,
        username: "Sarthak patel",
        content: "Gamer, Coder[GOD], Trekker",
    },
]

app.get("/posts", (req,res) => {
    res.render("index.ejs", {posts} );
})

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
})

app.post("/posts", upload.single('photo'),(req, res)=> {
    let {username, content} = req.body;
    console.log(req.file)

    fileExt = path.extname(req.file.originalname)
    console.log(fileExt)
    const oldpath = path.join(__dirname,req.file.path)
     fs.renameSync(oldpath,oldpath+fileExt)

    const imagepath = `./image/${req.file.filename}${fileExt}`
    
   let id = uuidv4();
   posts.push({id, username, content, imagepath});
   console.log(posts)
   res.redirect("/posts");
})

app.get("/posts/:id", (req, res) => {
    let {id} = req.params;
    console.log(id);
    let post = posts.find((p) => id === p.id );
    res.render("show.ejs", {post});
})

app.patch("/posts/:id", (req, res) => {
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p) => id.trim() === p.id );
    console.log(post);
    post.content = newContent;
    res.redirect("/posts");
})

app.get("/posts/:id/edit", (req, res) => {       
   let {id} = req.params;
   let post = posts.find((p) => p.id);
   res.render("edit.ejs", {post})
})

app.delete("/posts/:id", (req,res) => {
    let {id} = req.params;
    console.log(id)
    posts = posts.filter((p) => id !== p.id);
    console.log(posts);
    res.redirect("/posts");
})