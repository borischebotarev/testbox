let bar_width = 0;

function loadContent(position) {
  // Fetch the text file using the Fetch API
  loadUrl = clientName + "/content/aria_content_" + position + ".txt";
  //console.log(loadUrl);
  fetch(loadUrl)
    .then(response => response.text())
    .then(data => {
      // Split the contents into an array of lines
      const lines = data.split("\n");

      // Now, you have the lines in a JavaScript array
      const cleanedText = lines.map((item) => item.replace(/\r|\t/g, ''));
      //console.log(cleanedText);
      OPENING_STATEMENT = cleanedText[0];
      const trimmedText = cleanedText.slice(1, cleanedText.length - 1);
      CLOSING_STATEMENT = cleanedText[cleanedText.length - 1];

      // Shuffle the array of lines using the Fisher-Yates shuffle algorithm
      /*for (let i = trimmedText.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trimmedText[i], trimmedText[j]] = [trimmedText[j], trimmedText[i]];
      }*/
      questions_list_sc_hm = trimmedText;
      //console.log(questions_list_sc_hm);
      startFunction();
    })
    .catch(error => {
      stopLoadingAnimation();
      showMessage("Error fetching the text file: " + error, 60000)
      console.error("Error fetching the text file:", error);
    });
}

function showQuestionProgress(currentQuestion) {
  // var elem = document.getElementById("progressBar");
  //
  // if (currentQuestion > questions_list_sc_hm.length) {
  //   bar_width = 0;
  //   elem.style.width = bar_width + '%';
  //   elem.style.display = "none";
  //   return;
  // }
  // var id = setInterval(frame, 20);
  //
  // function frame() {
  //   if (currentQuestion === undefined)
  //     return;
  //   else {
  //     if (currentQuestion === questions_list_sc_hm.length) {
  //       clearInterval(id);
  //     }
  //   }
    // Update the text content with the current question number
    if (currentQuestion > 0)
      document.getElementById("questionCountText").innerText = "Question " + currentQuestion  + " of " + questions_list_sc_hm.length;
    if (currentQuestion > questions_list_sc_hm.length) {
      document.getElementById("questionCountText").innerText = "";
      document.querySelector('.spacebar').classList.add('hide');
      preparingButton.style.display = 'block';
    }
  // }
}