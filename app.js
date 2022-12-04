// !-------------database boilerplate---------------
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ameersuhail:AMINAdavood41099@cluster0.czyujet.mongodb.net/toDoListDB");

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

const _ = require("lodash");

app.set("view engine", "ejs");

// * below line is must have when u wanna get values from the user
app.use(express.urlencoded({ extended: true }));

// * files like css icons etc should kept in a folder public and href should typed as if we are in public folder
app.use(express.static("public"));

// !-------------------------home---------------------------
app.get("/", (req, res) => {
  Item.find((err, items) => {
    // * in the below method current day is the marker in ejs file in the views folder
    res.render("list", { listHeading: dayName, newItem: items });
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
    Custom.findOne({ name: _.lowerCase(titleName) }, (err, foundItems) => {
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

// !-----------------------deletion code--------------------------- 
app.post("/delete", (req, res) => {
  const checkedItem = req.body.checked;
  const listName = req.body.listName;
  const todayList = dayName;

  if (listName === todayList) {
    Item.findByIdAndRemove({ _id: checkedItem }, (err) => {
      if (err) {
        console.log(err);
      } else {
        // console.log("deleted");
        res.redirect("/");
      }
    });
  } else {
    // * combined mongodb pull and mongoose findOneAndUpdate to remove documents in an array
    Custom.findOneAndUpdate(
      { name: _.lowerCase(listName) },
      { $pull: { items: { _id: checkedItem } } },
      (err, results) => {
        if (!err) {
          res.redirect(`/${listName}`);
        }
      }
    );
  }
});

// !-------------------------dynamic pages------------------------------
app.get("/:newList", (req, res) => {
  const newListName = _.lowerCase(req.params.newList);

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
          listHeading: _.capitalize(newListName),
          newItem: newList.items,
        });
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
});