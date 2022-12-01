// !------------database boilerplate---------------
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/toDoListDB");

const itemSchema = { item: { type: String, required: true } };

const Item = mongoose.model("Item", itemSchema);
const workItem = mongoose.model("workItem", itemSchema);

const item1 = new Item({ item: "type something" });
const item2 = new Item({ item: "press plus sign to submit" });
const item3 = new Item({ item: "eg: buy milk" });

const sampleItems = [item1, item2, item3];

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

  Item.find((err, items) => {
    if (items.length === 0) {
      Item.insertMany(sampleItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("sample items successfully saved in DB");
        }
      });
      res.redirect("/");
    } else {
      // * in the below method current day is the marker in ejs file in the views folder
      res.render("list", { listHeading: dayName, newItem: items });
    }
  });
});

app.post("/", (req, res) => {
  let newToDo = req.body.listAdd;
  // console.log(req.body);
  if (req.body.list === "Work") {
    // !----------------collection for work tab--------------------
    const addedWorkItem = workItem({ item: newToDo });
    addedWorkItem.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("work items added successfully");
      }
    });
    res.redirect("/work");
  } else {
    // !------------collection for general list item----------------
    const addedItem = Item({ item: newToDo });
    addedItem.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("new item successfully saved");
      }
    });
    res.redirect("/");
  }
});

// ! ------for work tab-----------
app.get("/work", (req, res) => {
  workItem.find((err, workItems) => {
    if (workItems.length === -0) {
      workItem.insertMany(sampleItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("sample items saved successfully");
        }
      });
      res.redirect("/work");
    } else {
      res.render("list", { listHeading: "Work List", newItem: workItems });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server started listening on port ${port}`);
});
