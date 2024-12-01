const inputContainer = document.querySelector('.input-container');

document.addEventListener('DOMContentLoaded', function () {
  const inputText = document.getElementById('editableDiv');
  const submitButton = document.getElementById('submitButton');

  submitButton.addEventListener('click', function () {
    const completion = inputText.textContent;
    if (completion.length > 0) {
      // Call your function here with the userInput
      console.log('Prompt: ', user_response);
      console.log('Completion:', completion);
      update_ai_response(user_response, completion, "practica_std");
      rapportScene.modules.tts.sendText(completion);
      inputContainer.style.display = 'none';
    }
  });
});
