const express = require("express");
const app = express();
const port = 3000;
// * it is preferred to use let instead of var
let toDos = [];
let workList = [];

app.set("view engine", "ejs");

// * below line is must have when u wanna get values from the user
app.use(express.urlencoded({ extended: true }));

// * files like css icons etc should kept in a folder public and href should typed as if we are in public folder
app.use(express.static("public"));

app.get("/", (req, res) => {
  let today = new Date();
  let dayName = today.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  // * in the below method current day is the marker in ejs file in the views folder
  res.render("list", { listHeading: dayName, newItem: toDos });
});

app.post("/", (req, res) => {
  newToDo = req.body.listAdd;
  toDos.push(newToDo);
  res.redirect("/");
});

// ! ------for work tab----------- 
app.get("/work", (req, res) => {
  res.render("list", { listHeading: "Work List", newItem: workList });
});
app.post("/work", (req, res) => {
  newToDo = req.body.listAdd;
  workList.push(newToDo);
  res.redirect("/work");
});

app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});
