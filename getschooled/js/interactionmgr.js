var q_count = 0;
var open_txt = "";
var delay = 1.0;

var utterance_start = 0;
var utterance_duration = 0;

var aria_start = 0;
var aria_duration = 0;
var aria_question = ""

var pttReleased = 0;
var asrDelay = 0;
var pttDown = false;
var user_response = "";
var inCodeTest = false;
var editorOpen = false;

var isAriaSpeaking = false;
var isAriaProcessing = false;
var isAriaListening = false;

var session_start = 0;
var incogruence_question_number = 2;

// Set the countdown time (in seconds)
let countdownTime = 900;
let timeIsUp = false;

let isEndButtonClicked = false;
let isAnalyticsProcessing = false;

default_end_message = "This will end your session and generate your report. Please click OK to continue.";

rapportScene.addEventListener('asrMessage', (e) => {
  switch (e.detail.method) {
    case 'asr-text': {
      // What ASR heard.
      user_response += " " + e.detail.params.text;
      //console.log(user_response);
      // What AI heard.
      asrDelay = Date.now() - pttReleased;
      //console.log("ASR Delay: " + asrDelay);
      break;
    }

    default: {
      break;
    }
  }
});

rapportScene.addEventListener('aiMessage', (e) => {
  //console.log("AI Message: " + e.detail);
  switch (e.detail.method) {
    case 'ai-text': {
      // What AI heard.
      ai_response = e.detail.params.text;
      console.log("AI Returned: " + ai_response);
      if (q_count > (questions_list.length) || q_count == 0)
        rapportScene.modules.tts.sendText(ai_response); // If using external call, re-write logic to handle things here.
      break;
    }

    default: {
      break;
    }
  }
});

rapportScene.addEventListener('ttsStart', (e) => {
  rapportScene.modules.ac.setMood("positive");
  showWave();
  showQuestionProgress(q_count);
  tts_response = e.detail.text
  //debugger;
  if(tts_response != "")
  {
    aria_question = tts_response;
    $('.non-editable').text(aria_question);
  }
  else
  {
    if(q_count == 0)
    {
      aria_question = OPENING_STATEMENT;
      $('.non-editable').text(aria_question);
    }
    else if(q_count > questions_list.length)
    {
      aria_question = CLOSING_STATEMENT;
      $('.non-editable').text(aria_question);
    }
    else if(q_count > 0 && q_count <= (questions_list.length))
    {
      aria_question = questions_list[q_count-1];
      $('.non-editable').text(aria_question);
    }
  }

   $('.non-editable').show();
   $('.spacebar').hide();
   rapportScene.modules.ac.setMood("positive");
   aria_start = Date.now() - session_start;

   isAriaSpeaking = true;
   isAriaProcessing = false;
   isAriaListening = false;
});

rapportScene.addEventListener('ttsEnd', (e) => {


  //$('.non-editable').text(tts_response);

  hideWave();
        // Show the non-editable text box
        //$('.non-editable').show();
        if (q_count < questions_list.length) $('.spacebar').show();
        if (q_count <= questions_list.length || CLOSING_STATEMENT.includes('we can chat about anything else you like now')) $('.spacebar').show();
        if (q_count < (questions_list.length) && q_count != incogruence_question_number && countdownTime >= 0 && q_count != 0)
          startTimerAndDisplayMessage("Click Start to begin recording your response");
        isAriaSpeaking = false;
        isAriaListening = true;
        isAriaProcessing = false;
        //showQuestionProgress(q_count);

        aria_duration = Date.now() - aria_start - session_start;
        log_to_transcript("ARIA: " + aria_question + ", Start: " + aria_start + ", Duration: " + aria_duration + ", ASR Delay: " + asrDelay);
        // json_export_transcript
        var ariaData = {
          speaker: "ARIA",
          text: aria_question,
          start: aria_start,
          duration: aria_duration,
          asr_delay: asrDelay
        };

        append_to_json(ariaData);
        //console.log(ariaData);
});


startFunction = async () => {
  json_log_data = []; // Clears the recorded JSON
  generate_analytics = true;
  cancelTimer();
  questions_list = questions_list_sc_hm; //questions_list_sc_lightup_tl; //questions_list_test; //questions_list_sc_lightup_tl;
  /* User accepted preference cookies. */
  session_start = Date.now();
  const enableCookies = false;
  try {
    await rapportScene.sessionRequest({
      projectId: chosenAI.projectId,
      projectToken: chosenAI.projectToken,
      aiUserId: chosenAI.aiUserId,
      lobbyZoneId: chosenAI.lobbyZoneId,
      language: chosenAI.language,
      openingText: "",
      sessionConnected: async () => {
        document.getElementById("main-container").focus();
        //console.log("Focusing on main window");

        /* Connected handler. The avatar is ready for the conversation. */
        //logo.style.display="none";
        footer.style.display = "none"
        stopLoadingAnimation()
        rapportScene.modules.ac.setMood("positive")
        rapportScene.muteMic(true);

        rapportScene.style.display = chosenAI.display;
        let timers = rapportScene.getTimers();
        startRecording();

        intro_txt = OPENING_STATEMENT;
        cmd = selectedResumeTemplate + '_intro';
			  //console.log(cmd);
			  await rapportScene.modules.commands.trigger(cmd);
        //rapportScene.modules.tts.sendText(intro_txt);
      },

      sessionDisconnected: () => {
        /* Timeout handler. */
      },
    });
  } catch (error) {
    /* Handle error. */
    stopLoadingAnimation();
    showMessage("Error fetching the interaction, please try again later", 60000)
    console.error(error);
  }
}

/* End demo. */
endButton.addEventListener('click', async () => {
  var userAgrees = confirm(default_end_message);

  if (userAgrees) {
    if (!isAnalyticsProcessing) {
      console.log("Early Termination!");
      stopRecording();
    }
    const newWindow = window.open();
    newWindow.document.write(reportFromBE);
    newWindow.document.close();
    incrementSessionCount();
    isEndButtonClicked = true;
    stop_interview();
    hideWave();
    $('.non-editable').hide();
    $('.spacebar').hide();
    cancelTimer();
    await rapportScene.sessionDisconnect();
	window.location.href = 'https://getschooled.com/interviewcoach-complete';
  }
})

/* Push-To-Talk Handlers */
// For custom push to talk implementation use this code snippet
// ------------------------
function customPttKeyUpHandler() {
  /*if (timeIsUp)
    return;*/
  pttDown = false;
  pttReleased = Date.now();	// for ASR Delay
  rapportScene.muteMic(true);
  utterance_duration = Date.now() - utterance_start - session_start;

  isAriaSpeaking = false;
  isAriaListening = false;
  isAriaProcessing = true;

  if (utterance_duration > 2000) {
    rapportScene.modules.ac.setMood('processing');
  }
  toggleIndicator();
  setTimeout(async function () {
    // Code to be executed after the delay
    log_to_transcript("USER: " + user_response + ",Question: " + q_count + ",Start: " + utterance_start + ",Duration: " + utterance_duration);
    // json_export_transcript
    var userData = {
      speaker: "USER",
      text: user_response,
      start: utterance_start,
      duration: utterance_duration,
      question_count: q_count
    };

    append_to_json(userData);
    q_count = await analyze_response(user_response, q_count, selectedResumeTemplate);
  }, 2000); // Delay of2s to allow ASR to complete.
  $('.spacebar').hide();
  // Hide the non-editable text box & set the question field to ""
  $('.non-editable').hide();
  document.getElementById("questionCountText").innerText = "";
}

function customPttKeyDownHandler() {
  /*if (timeIsUp)
    return;*/

  pttDown = true;
  cancelTimer();
  user_response = "";
  rapportScene.modules.ac.setMood('listening');
  rapportScene.muteMic(false);
  utterance_start = Date.now() - session_start;
  //console.log('Recording Response');
  toggleIndicator();
}

/* Key Up and Key Down Handlers */
// ------------------------
document.onkeydown = function (key) {
  reactKeyDown(key);
}

function reactKeyDown(evt) {
  evt.preventDefault();
  if (inCodeTest && evt.keyCode == 32) {
    return
  }

  if (!isAriaListening)
    return;

  if (evt.keyCode == 32) // SpaceBar for Tap to Start, Tap to End.
  {
    if (evt.repeat) {
      return
    }
    // one tap for first question
    if (!q_count) {
      customPttKeyDownHandler();
      customPttKeyUpHandler();
      return;
    }
    if (pttDown == true)
      customPttKeyUpHandler();
    else
      customPttKeyDownHandler();
  }
}

function toggleIndicator() {
  const stop = document.querySelector(".spacebar__stop");
  const start = document.querySelector(".spacebar__start");
  const text = document.querySelector(".spacebar__text");

  if (stop.style.display === "block") {
    stop.style.display = "none";
    start.style.display = "block";
    text.innerText = 'Start';
  } else {
    stop.style.display = "block";
    start.style.display = "none";
    text.innerText = 'Stop';
  }
}