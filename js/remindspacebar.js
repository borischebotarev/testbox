let timerId;
let messageVisible = false;

// Function to display a message on screen for a specified duration
function showMessage(message, duration) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add('message-tooltip');
  document.body.appendChild(messageElement);

  setTimeout(() => {
    if (messageVisible) {
      removeMessage()
    }
  }, duration);
}

// Function to start a timer and display message when it expires
function startTimerAndDisplayMessage(custom_msg) {
  removeMessage();
  let timerDuration = 3000; // 3 seconds before you display message

  timerId = setTimeout(() => {
    showMessage(custom_msg, 20000); // Display message for 20 seconds
    messageVisible = true;
  }, timerDuration);
}

// Function to cancel the timer
function cancelTimer() {
  clearTimeout(timerId);
  //console.log("Timer canceled");

  if (messageVisible) {
    removeMessage()
  }
}

function removeMessage() {
  const messageElement = document.querySelector('.message-tooltip');
  if (messageElement) {
    document.body.removeChild(messageElement);
  }
  messageVisible = false;
}
