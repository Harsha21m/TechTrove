import express from "express";
import bodyParser from "body-parser";
import methodOverride from 'method-override';
import articlerouter from "./routes/article.js";

const app = express();
const port = 3000;

app.use(methodOverride('_method'));

import session from "express-session";

app.use(session({
  secret: "My-secret-key", // Replace with a strong secret
  resave: false,
  saveUninitialized: false
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use('/articles', articlerouter);

let posts = [];
let idCounter = 1;

// Home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/every",(req,res)=>{
  res.render("everypost.ejs");
});

app.get("/blogs/ai-2025",(req,res)=>{
  res.render("ai.ejs")
});

app.get("/blogs/cybersecurity-trends",(req,res)=>{
  res.render("cyber.ejs")
});

app.get("/blogs/web-development",(req,res)=>{
  res.render("web.ejs")
});

app.get("/blogs/cloud-computing",(req,res)=>{
  res.render("cloud.ejs")
});

app.get("/blogs/blockchain",(req,res)=>{
  res.render("block.ejs")
});

app.get("/blogs/data-science",(req,res)=>{
  res.render("ds.ejs")
});

//Create post form
app.get("/posts", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("create.ejs");
});


// Create post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  posts.push({ id: idCounter++, title, content });
  res.redirect("/all");
});

// Show all posts
app.get("/all", (req, res) => {
  res.render("all.ejs", { posts });
});

// Edit post form
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  res.render("edit.ejs", { post });
});



// Update post
app.put("/posts/:id", (req, res) => {
  const { title, content } = req.body;
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  post.title = title;
  post.content = content;

  res.redirect("/all");
});


// Delete post
app.delete("/posts/:id", (req, res) => {
  posts = posts.filter(p => p.id !== parseInt(req.params.id));
  res.redirect("/all");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// login
app.get("/login",(req,res)=>{
 res.render("login.ejs");
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simple check — use DB in real apps
  if (username === "admin" && password === "1234") {
    req.session.user = username;
    res.redirect("/posts");
  } else {
    res.render("login.ejs", { error: "Invalid credentials" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect("/");
    res.redirect("/login");
  });
});

