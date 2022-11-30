// !----------database boilerplate---------------
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/toDoListDB");

const itemSchema = { name: { type: String, required: true } };

const Item = mongoose.model("Item", itemSchema);

const kitty = new Cat({ name: "Zildjian" });
kitty.save().then(() => console.log("meow"));

// ! ----------express boilerplate---------------
const express = require("express");
const app = express();
const port = 3000;
const date = require(`${__dirname}/date.js`);

// * it is preferred to use let instead of var
// let toDos = [];
// let workList = [];

app.set("view engine", "ejs");

// * below line is must have when u wanna get values from the user
app.use(express.urlencoded({ extended: true }));

// * files like css icons etc should kept in a folder public and href should typed as if we are in public folder
app.use(express.static("public"));

app.get("/", (req, res) => {
  let dayName = date();
  // * in the below method current day is the marker in ejs file in the views folder
  res.render("list", { listHeading: dayName, newItem: toDos });
});

app.post("/", (req, res) => {
  let newToDo = req.body.listAdd;
  // console.log(req.body);
  if (req.body.list === "Work") {
    if (req.body.listAdd !== "") {
      workList.push(newToDo);
      res.redirect("/work");
    }
  } else {
    if (req.body.listAdd !== "") {
      toDos.push(newToDo);
      res.redirect("/");
    }
  }
});

// ! ------for work tab-----------
app.get("/work", (req, res) => {
  res.render("list", { listHeading: "Work List", newItem: workList });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server started listening on port ${port}`);
});
