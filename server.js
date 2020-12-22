const express = require("express");
const mongodb = require("mongodb");

const app = express();
let db;

// Telling our express app server to allow incoming request to have access to the public folder and its content
// This will make the contents of that folder available from the root of our server
app.use(express.static("public"));

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

// This tells express to automatically take submitted form data and add it to a body object that
// lives on the request object
// also we are going to do the same thing but to make it with asynchronous requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
  <link rel="shortcut icon" href="#">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>

    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action='/create-item' method='POST'>
        <div class="d-flex align-items-center">
          <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>

    <ul id="item-list" class="list-group pb-5">
      ${items
        .map((item) => {
          return `
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">${item.whatToDo}</span>
          <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>`;
        })
        .join("")}
    </ul>

  </div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js" integrity="sha512-DZqqY3PiOvTP9HkjIWgjO6ouCbq+dxqWoJZ/Q+zPYNHmlnI2dQnbJ5bxAHpAMw+LXRm4D72EIRXzvcHQtE8/VQ==" crossorigin="anonymous"></script>
<script src="/browser.js"></script>
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

// This listens to a POST request to our server, to the url of 'update-item'
app.post("/update-item", function (req, res) {
  // We reach for the database using the db var and then search for out collectin which is items
  // then we use the method to update it and it takes 3 arguments
  // the first argument is where we tell Mongo DB which document we want to update, the id key
  // the second argument is what we want to update on that document
  // the third argument is where we include a function that will get called once this database action has completed
  db.collection("items").findOneAndUpdate(
    { _id: new mongodb.ObjectID(req.body.id) },
    { $set: { whatToDo: req.body.text } },
    function () {
      res.send("success");
    }
  );
});

// a post request to the server with the url of delete-item
app.post("/delete-item", function (req, res) {
  // Use the method from mongodb of deleteOne that takes 2 arguments
  // the first arg is what document you want to delete
  // the second arg is a function that responds when everything runs ok
  db.collection("items").deleteOne(
    { _id: new mongodb.ObjectID(req.body.id) },
    function () {
      res.send("Success");
    }
  );
});
