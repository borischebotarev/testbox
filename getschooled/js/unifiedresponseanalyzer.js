async function analyze_response(response, q_count, jobSelection) {
  //console.log(questions_list[q_count], q_count, questions_list.length);
  switch (q_count) {
    case 0: {
      start_interview(); // Start Timer.
      //rapportScene.modules.tts.sendText(questions_list[q_count]);
      //alert(jobSelection);
      cmd = jobSelection + '_' + (q_count+1);
			//console.log(cmd);
			await rapportScene.modules.commands.trigger(cmd);	
      q_count++;
      return q_count;
    }
      break;

    default: {
      if (response == "") {
        isAriaListening = true;
        isAriaSpeaking = false;
        isAriaProcessing = false;
        if (q_count < (questions_list.length)) {
          startTimerAndDisplayMessage("No response received. Please tap spacebar and unmute your mic if needed.");
          $('.spacebar').show();
        }

      }

      //analyze_response_with_ai(response);
      if (q_count > (questions_list.length)) {
        //analyze_response_with_ai(response);
        return q_count;
      } else if (q_count > (questions_list.length - 1)) {
        console.log("Sending data for analysis .... ");
        stopRecording();
        isAnalyticsProcessing = true;
        //analyze_response_with_ai(response);
        toggle_editor(false);
        //rapportScene.modules.tts.sendText(CLOSING_STATEMENT);
        cmd = selectedJob + '_outro';
			  console.log(cmd);
			  await rapportScene.modules.commands.trigger(cmd);	
        // console.log("Switching to free-form dialogue...");
        q_count++;
        /*setTimeout(function() {
          endButton.click();
        }, 10000);
        break;*/
      } else if (response != "") {
        //console.log(q_count, response);
        if (questions_list[q_count].includes("piece of code")) {
          setTimeout(function () {
            toggle_editor(true);
          }, 1000);
        } else if (questions_list[q_count].includes("coding challenge")) {
          wipe_content();
          customPttKeyDownHandler();
        } else if (questions_list[q_count].includes("rate your performance")) {
          circle_content();
          customPttKeyDownHandler();
        } else {
          toggle_circles(false);
          toggle_editor(false);
        }

        cmd = jobSelection + '_' + (q_count+1);
			  //console.log(cmd);
			  await rapportScene.modules.commands.trigger(cmd);	
        //rapportScene.modules.tts.sendText(questions_list[q_count]);
        q_count++;
      }
      return q_count;
    }
      break;
  }
}