function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.whatToDo}</span>
  <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`;
}

// Client side rendering of todos
document
  .querySelector("#item-list")
  .insertAdjacentHTML(
    "beforeend",
    items.map((item) => itemTemplate(item)).join("")
  );

// Create Feature
let createField = document.querySelector("#create-field");

document.querySelector("#create-form").addEventListener("submit", function (e) {
  e.preventDefault();
  axios
    .post("/create-item", {
      text: createField.value,
    })
    .then(function (response) {
      // Create the HTML for a new item
      document
        .querySelector("#item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data));
      createField.value = "";
      createField.focus();
    })
    .catch(function () {
      console.log("please try again later");
    });
});

// Add an event listener to the document we are hearing for a click event
// we are targeting the elements that only contain the 'edit-me' class
// then we are using the prompt method to get user data and stored in a var
document.addEventListener("click", function (e) {
  // Delete Feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you really want to delete this item permanently?")) {
      axios
        .post("/delete-item", {
          id: e.target.getAttribute("data-id"),
        })
        .then(function () {
          e.target.parentElement.parentElement.remove();
        })
        .catch(function () {
          console.log("please try again later");
        });
    }
  }

  // Update Feature
  if (e.target.classList.contains("edit-me")) {
    // Using the prompt method to get user input, the second argument is the populated text we want it to show
    let userInput = prompt(
      "Enter your desire new text",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    );

    // We use an if statement to check if userinput is cancel or not, if it is then it return null
    if (userInput) {
      // Here we are going to use axios a promised-based HTTP client that makes requests to fetch or save data
      // we are using the post method the needs 2 parameters ('post request to what url', 'data that is send to the server as an object')
      // we are sending the updated todo text and also the id of each task with the data-id attribute
      // It will return a promise, it is useful when we dont know how long it is going to take to get data
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id"),
        })
        .then(function () {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
        })
        .catch(function () {
          console.log("please try again later");
        });
    }
  }
});
