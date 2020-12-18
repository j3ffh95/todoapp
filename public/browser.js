document.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Enter your desire new text");
    console.log(userInput);
  }
});
