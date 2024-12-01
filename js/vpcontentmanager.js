function toggle_editor(showeditor) {

  if (!editorOpen && showeditor === false) {
    //console.log("skipping...toggle");
    return;
  }

  const rapportScene = document.getElementById("rapportScene");
  const container = document.querySelector(".content-wrapper");
  let contentElement = container.querySelector(".content-element");

  if (showeditor === false) {
    editorOpen = false;
    // Shrink to 100% and restore original position
    rapportScene.style.width = "100%";
    rapportScene.style.height = "100%";
    rapportScene.style.left = "auto";
    rapportScene.style.top = "auto";

    contentElement.style.opacity = "0";
    contentElement.style.transform = "scale(0)";

    setTimeout(() => {
      container.removeChild(contentElement);
    }, 500);
  } else {
    editorOpen = true;
    // Shrink to 25% and move to top left corner
    rapportScene.style.width = "25%";
    rapportScene.style.height = "25%";
    rapportScene.style.left = "35%";
    rapportScene.style.top = "0";

    if (!contentElement) {
      contentElement = document.createElement("div");
      contentElement.classList.add("content-element");
      container.appendChild(contentElement);
    }

    setTimeout(() => {
      contentElement.style.opacity = "1";
      contentElement.style.transform = "scale(1)";
    }, 0);

    // Set the code stub inside the content element
    contentElement.innerHTML = `
      <code>
      <span class="interface">interface Person</span> {
          <span class="variable">name</span>: <span class="string">string</span>;
          <span class="variable">age</span>: <span class="keyword">number</span>;
      }

      <span class="function">function greet</span>(<span class="variable">person</span>: <span class="interface">Person</span>) {
          <span class="function">console.log</span>(<span class="string">'Hello, \${person.name}! You are \${person.age} years old.'</span>);
      }

      const <span class="variable">personData</span>: <span class="interface">Person</span> = {
          <span class="variable">name</span>: <span class="string">"Alice"</span>,
      };

      <span class="function">greet</span>(<span class="variable">personData</span>);
      </code>
      `;
  }

  // Enable smooth transition for size and position changes
  rapportScene.style.transition = "width 0.5s, height 0.5s, left 0.5s, top 0.5s";
}

function toggle_circles(showCircles) {

  if (!editorOpen && showCircles === false) {
    return;
  }

  const rapportScene = document.getElementById("rapportScene");
  const container = document.querySelector(".content-wrapper");
  let contentElement = container.querySelector(".content-element");

  if (showCircles === false) {
    editorOpen = false;
    // Shrink to 100% and restore original position
    rapportScene.style.width = "100%";
    rapportScene.style.height = "100%";
    rapportScene.style.left = "auto";
    rapportScene.style.top = "auto";

    if (!contentElement) {
      contentElement = document.createElement("div");
      contentElement.classList.add("content-element");
      container.appendChild(contentElement);
    }

    contentElement.style.opacity = "0";
    contentElement.style.transform = "scale(0)";
    contentElement.style.display = "none!important";

    setTimeout(() => {
      container.removeChild(contentElement);
    }, 500);
  } else {
    editorOpen = true;
    // Shrink to 25% and move to top left corner
    rapportScene.style.width = "25%";
    rapportScene.style.height = "25%";
    rapportScene.style.left = "35%";
    rapportScene.style.top = "0";

    if (!contentElement) {
      contentElement = document.createElement("div");
      contentElement.classList.add("content-element");
      container.appendChild(contentElement);
    }

    contentElement.style.display = "block!important";
    setTimeout(() => {
      contentElement.style.opacity = "1";
      contentElement.style.transform = "scale(1)";
    }, 0);
  }

  // Enable smooth transition for size and position changes
  rapportScene.style.transition = "width 0.5s, height 0.5s, left 0.5s, top 0.5s";
}

// -------------------------------- //

let timerInterval; // Variable to store the timer interval

function start_interview() {
  // Get the countdown timer element
  const countdownTimer = document.getElementById("countdownTimer");

  // Update the countdown timer every second
  timerInterval = setInterval(() => {
    // Calculate minutes and seconds
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;

    // Format minutes and seconds with leading zeros if needed
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    // Update the countdown timer element with the formatted time
    countdownTimer.textContent = `${formattedMinutes}:${formattedSeconds}`;

    // Decrement the countdown time
    countdownTime--;

    // Stop the countdown when reaching 0
    if (countdownTime < 0) {
      clearInterval(timerInterval);
      countdownTimer.textContent = "00:00";

      default_end_message = ("Unfortunately, we're out of time. Please click OK to see your performance report.");
      timeIsUp = true;
      endButton.click();
    }
  }, 1000);
}

function stop_interview() {
  clearInterval(timerInterval);
  q_count = 0;
  countdownTimer.textContent = "";
}

function wipe_content() {
  toggle_editor(true);
  inCodeTest = true; // code test is being done.
  const container = document.querySelector(".content-wrapper");
  let contentElement = container.querySelector(".content-element");
  contentElement.innerHTML = `
        <code contenteditable="true" id="editable-code"></code>
        <button id="submit-button" onclick="process_code()">Submit</button>`;

  var codingElement = document.getElementById('editable-code');

  codingElement.addEventListener('keydown', function (event) {
    event.stopPropagation();
  });

  codingElement.addEventListener('keypress', function (event) {
    event.stopPropagation();
  });

  codingElement.addEventListener('keyup', function (event) {
    event.stopPropagation();
  });

  codingElement.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent the default tab behavior

      // Insert a tab character
      document.execCommand('insertText', false, '\t');
    }
  });

  codingElement.addEventListener('input', function (event) {
    // Update the cursor position
    updateCursorPosition();
  });

  codingElement.focus();

  // Initial cursor position setup
  var cursorElement = document.createElement('div');
  cursorElement.id = 'cursor';
  cursorElement.className = 'cursor';
  document.querySelector('.content-element').appendChild(cursorElement);
  updateCursorPosition();
}

function circle_content() {
  toggle_circles(true);
  inCodeTest = true; // code test is being done.
  const container = document.querySelector(".content-wrapper");
  let contentElement = container.querySelector(".content-element");
  document.querySelector('.spacebar').classList.add('hide');
  contentElement.innerHTML = `
    <div id="circleContainer">
        <div class="circle" id="circle1"><span id="text1">Actual</span></div>
        <div class="circle" id="circle2"><span id="text2">Ideal</span></div>
    </div>

    <input type="range" min="0" max="100" value="0" id="overlapSlider">
    <button type="button" class="interview__button spacebar" id="submit-button" onclick="process_circles()">
      <span class="spacebar__content">Submit</span>
    </button>`;

  const circle1 = document.getElementById('circle1');
  const circle2 = document.getElementById('circle2');
  const slider = document.getElementById('overlapSlider');
  slider.addEventListener('input', updateOverlap);
  function updateOverlap() {
    const overlapValue = slider.value;
    const circle1Radius = 75;
    const circle2Radius = 75;
    const maxOverlap = circle1Radius + circle2Radius;
    // Calculate the overlap based on the slider value
    const overlap = (overlapValue / 100) * maxOverlap;
    // Update circle positions with smooth transition
    circle1.style.marginRight = `${-overlap / 2 }px`;
    circle2.style.marginLeft = `${-overlap / 2}px`;
  }
  // Initial setup
  updateOverlap();
}

function updateCursorPosition() {
  var cursorElement = document.getElementById('cursor');
  var codingElement = document.getElementById('editable-code');
  var range = window.getSelection().getRangeAt(0);
  var rect = range.getBoundingClientRect();
  var codingRect = codingElement.getBoundingClientRect();

  // Adjust the cursor position by subtracting the top and left offsets of the editable element
  var topOffset = rect.top - codingRect.top;
  var leftOffset = rect.left - codingRect.left;
  cursorElement.style.top = (topOffset + 15) + 'px';
  cursorElement.style.left = (leftOffset + 15) + 'px';
}

// Function to get the current cursor position within the coding element
function getCaretPosition(element) {
  var selection = window.getSelection();
  if (selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);
    if (range.startContainer.parentNode === element) {
      return range.startOffset;
    }
  }
  return -1;
}

// Function to adjust the cursor position within the coding element
function adjustCursorPosition(element, position) {
  var selection = window.getSelection();
  var range = document.createRange();
  range.setStart(element.firstChild, position);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  selection.extend(element.firstChild, position);
}

function process_code() {
  inCodeTest = false; // Code Test is Done.
  var codeElement = document.getElementById("editable-code");
  var code = codeElement.textContent; // Get the text content of the code element

  toggle_editor(false); // calls this on "submit" in the code window.
  toggleIndicator();

  pttDown = false;
  pttReleased = Date.now();	// for ASR Delay
  rapportScene.muteMic(true);
  utterance_duration = Date.now() - utterance_start - session_start;

  isAriaSpeaking = false;
  isAriaListening = false;
  isAriaProcessing = true;

  if (utterance_duration > 2000)
    rapportScene.modules.ac.setMood('processing');

  setTimeout(async function () {
    log_to_transcript("USER: " + code + ",Question: " + q_count + ",Start: " + utterance_start + ",Duration: " + utterance_duration);
    var userData = {
      speaker: "USER",
      text: {verbal: user_response, editor: code},
      start: utterance_start,
      duration: utterance_duration,
      question_count: q_count
    };

    append_to_json(userData);

    //console.log(tts_response);
    if (code === '')
      code = "did not submit code";

    q_count = await analyze_response(code, q_count);
  }, 2000);
}

function process_circles() {
  inCodeTest = false; // Code Test is Done.
  var rangeElement = document.getElementById("overlapSlider");
  var circleoverlap = rangeElement.value; // Get the value of the range element
  toggle_circles(false); // calls this on "submit" in the code window.
  toggleIndicator();

  document.querySelector('.spacebar').classList.remove('hide');
  pttDown = false;
  pttReleased = Date.now();	// for ASR Delay
  rapportScene.muteMic(true);
  utterance_duration = Date.now() - utterance_start - session_start;

  isAriaSpeaking = false;
  isAriaListening = false;
  isAriaProcessing = true;

  if (utterance_duration > 2000)
    rapportScene.modules.ac.setMood('processing');

  setTimeout(async function () {
    log_to_transcript("USER: " + circleoverlap + ",Question: " + q_count + ",Start: " + utterance_start + ",Duration: " + utterance_duration);
    var userData = {
      speaker: "USER",
      text: circleoverlap,
      start: utterance_start,
      duration: utterance_duration,
      question_count: q_count
    };

    append_to_json(userData);
    q_count = await analyze_response(circleoverlap, q_count);
  }, 2000);
}