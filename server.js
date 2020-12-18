const express = require("express");
const mongodb = require("mongodb");

const app = express();
let db;

// Connection String from MOngo DB
const connectionStr =
  "mongodb+srv://j3ffh95:soccer1995@cluster0-ezsop.mongodb.net/TodoApp1?retryWrites=true&w=majority";

// connecting the mongo db using the connect method with 3 arguments (connection String, stuff for mongodb, function that runs once we stablished connection)
mongodb.connect(
  connectionStr,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    // assigning the client.db() return databse to the db var
    db = client.db();
    // make our app listen once we established connection, listening to port 3000
    app.listen(3000);
  }
);

// This makes our app use the body object
app.use(express.urlencoded({ extended: false }));

// When we get a get request to the '/' url (base/index) we are going to return it with html using res.send() method
app.get("/", function (req, res) {
  // the find() method is Read from CRUD, and you can also build a query,
  // find() with no args means its going to get all the data from the collection,
  // Using the toArray() method to turn the data into an array;,
  // the toArray method accepts a function that will be called when everything has run
  // the callback function accepts two args one is for error the other one is the data turn into an array
  db.collection("items")
    .find()
    .toArray(function (err, items) {
      res.send(`
  <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>

    <div class="jumbotron p-3 shadow-sm">
      <form action='/create-item' method='POST'>
        <div class="d-flex align-items-center">
          <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>

    <ul class="list-group pb-5">
      ${items
        .map((item) => {
          return `
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">${item.whatToDo}</span>
          <div>
            <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>`;
        })
        .join("")}
    </ul>

  </div>
<script src="./browser.js"></script>
</body>
</html>
  `);
    });
});

// This listens to a POST request to our server using the action to '/create-item' page
app.post("/create-item", function (req, res) {
  // console.log(req.body.item);

  // Here we add the item that was input by the user to the collection in our database.
  // we use the collection method to enter what collection we want to store our data in,
  // using the inserOne method to assign the object key the value of user input.
  db.collection("items").insertOne({ whatToDo: req.body.item }, function () {
    // once we are done with creating a todo item then we respond using the res.redirect() which just refreshes to the base url
    res.redirect("/");
  });
});
