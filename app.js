const express = require("express");
const app = express();
const port = 3000;
var Todos = [];

app.set("view engine", "ejs");

// * below line is must have when u wanna get values from the user
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  var today = new Date();
  var currentDay = today.getDay();
  var day = " ";
  var dayName = today.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  // * in the below method current day is the marker in ejs file in the views folder
  res.render("list", { thisDayName: dayName, newItem: Todos });
});

app.post("/", (req, res) => {
  newToDo = req.body.listAdd;
  Todos.push(newToDo);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});
