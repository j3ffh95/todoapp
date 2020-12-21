// Add an event listener to the document we are hearing for a click event
// we are targeting the elements that only contain the 'edit-me' class
// then we are using the prompt method to get user data and stored in a var
document.addEventListener("click", function (e) {
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
