// !-------------database boilerplate---------------

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/toDoListDB");

const itemSchema = { item: { type: String, required: true } };

const customSchema = {
  name: { type: String, required: true },
  items: [itemSchema],
};

const Custom = mongoose.model("Custom", customSchema);

const Item = mongoose.model("Item", itemSchema);

// ! -------------express boilerplate----------------

const express = require("express");
const app = express();
const port = 3000;
const date = require(`${__dirname}/date.js`);
let dayName = date();

app.set("view engine", "ejs");

// * below line is must have when u wanna get values from the user
app.use(express.urlencoded({ extended: true }));

// * files like css icons etc should kept in a folder public and href should typed as if we are in public folder
app.use(express.static("public"));

app.get("/", (req, res) => {
  Item.find((err, items) => {
    // * in the below method current day is the marker in ejs file in the views folder
    res.render("list", { listHeading: `${dayName} List`, newItem: items });
  });
});

app.post("/", (req, res) => {
  let newToDo = req.body.listAdd;
  let titleName = req.body.list;
  // console.log(req.body);
  const addedItem = Item({ item: newToDo });
  // console.log(titleName);
  // console.log(dayName);
  if (titleName == dayName) {
    addedItem.save();
    res.redirect("/");
  } else {
    Custom.findOne({ name: titleName }, (err, foundItems) => {
      if (err) {
        console.log(err);
      } else {
        foundItems.items.push(addedItem);
        foundItems.save();
      }
    });
    res.redirect(`/${titleName}`);
  }
});

app.post("/delete", (req, res) => {
  const checkedItem = req.body.checked;
  const listName = req.body.listName;

  if (listName === `${dayName} List`) {
    Item.findByIdAndRemove({ _id: checkedItem }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("deleted");
      }
    });
    res.redirect("/");
  }
});

app.get("/:newList", (req, res) => {
  const newListName = req.params.newList;

  Custom.findOne({ name: newListName }, (err, newList) => {
    if (!err) {
      if (!newList) {
        // console.log("no such name found");
        const newListItem = Custom({
          name: newListName,
          items: [],
        });
        newListItem.save((err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("new list successfully saved");
          }
        });
        res.redirect(`/${newListName}`);
      } else {
        // console.log("sorry the list name already exists........");
        res.render("list", {
          listHeading: `${capitalizeFirstLetter(newListName)} List`,
          newItem: newList.items,
        });
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server started listening on port ${port}`);
});

// * function to make first letter capital
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function unCapitalizeFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
