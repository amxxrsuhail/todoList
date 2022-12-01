// !-------------database boilerplate---------------

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/toDoListDB");

const itemSchema = { item: { type: String, required: true } };

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ item: "type something" });

const sampleItems = [item1];

// ! -------------express boilerplate----------------

const express = require("express");
const app = express();
const port = 3000;
const date = require(`${__dirname}/date.js`);

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
});

app.post("/delete", (req, res) => {
  const checkedItem = req.body.checked;
  Item.findByIdAndRemove({ _id: checkedItem }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("deleted");
    }
  });
  res.redirect("/");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server started listening on port ${port}`);
});
