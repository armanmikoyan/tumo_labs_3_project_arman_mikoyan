const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Post = require("./models/post");
const Contact = require("./models/contacts");

app.use(express.static("styles"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

const createPath = (page) => {
  return path.resolve(__dirname, "ejs-pages", `${page}.ejs`);
};

mongoose
  .connect(
    "mongodb+srv://arman:	@cluster0.a7eewrn.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("conected to db");
  })
  .catch((err) => {
    console.log("error");
  });

app.listen(3000, (err) => {
  err ? console.log(err) : console.log("listening 3000 port");
});

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  const title = "Home";
  res.render(createPath("index"), { title });
});

app.get("/edit/:id", (req, res) => {
  const title = "Edit-post";
  Post.findById(req.params.id)
    .then((post) => res.render(createPath("edit-post"), { post, title }))
    .catch((err) => console.log(err));
});

app.put("/edit/:id", (req, res) => {
  const { title, author, text } = req.body;
  const { id } = req.params;
  Post.findByIdAndUpdate(id, { title, author, text })
    .then((result) => res.redirect(`/posts/${id}`))
    .catch((err) => res.render(createPath("error"), { title }));
});

app.get("/posts/:id", (req, res) => {
  const title = "Post";
  Post.findById(req.params.id)
    .then((post) => res.render(createPath("post"), { post, title }))
    .catch((err) => console.log(err));
});

app.delete("/posts/:id", (req, res) => {
  const title = "Post";
  Post.findByIdAndDelete(req.params.id)
    .then((result) => res.sendStatus(200))
    .catch((err) => console.log(err));
});

app.get("/posts", (req, res) => {
  const title = "Posts";
  Post.find()
    .sort({ createdAt: -1 })
    .then((posts) => res.render(createPath("posts"), { posts, title }))
    .catch((err) => console.log(err));
});

app.get("/add-post", (req, res) => {
  const title = "New Post";
  res.render(createPath("add-post"), { title });
});

app.post("/add-post", (req, res) => {
  const { title, author, text } = req.body;
  const post = new Post({ title, author, text })
    .save()
    .then((result) => {
      res.redirect("/posts");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/contacts", (req, res) => {
  const title = "Contacts";
  Contact.find()
    .then((contacts) => res.render(createPath("contacts"), { contacts, title }))
    .catch((err) => console.log(err));
});

app.use((req, res) => {
  const title = "Error 404";
  res.status(404).render(createPath("error"), { title });
});
