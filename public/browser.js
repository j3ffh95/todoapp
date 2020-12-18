// Add an event listener to the document we are hearing for a click event
// we are targeting the elements that only contain the 'edit-me' class
// then we are using the prompt method to get user data and stored in a var
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Enter your desire new text");

    // Here we are going to use axios a promised-based HTTP client that makes requests to fetch or save data
    // we are using the post method the needs 2 parameters ('post request to what url', 'an object with the new updated input')
    // It will return a promise, it is useful when we dont know how long it is going to take to get data
    axios
      .post("/update-item", { text: userInput })
      .then(function () {
        // do something interesting here in the next video
      })
      .catch(function () {
        console.log("please try again later");
      });
  }
});
