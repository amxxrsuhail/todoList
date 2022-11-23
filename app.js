const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  var today = new Date();
  var currentDay = today.getDay();
  var day = " ";
  if (currentDay === 6 || currentDay === 0) {
    day = "weekend";
  } else {
    day = "weekday";
  }
  // * in the below method current day is the marker in ejs file in the views folder
  res.render("list", { thisDay: day });
});

app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});
